"use client";

import React, { useEffect, useState } from "react";
import { APP_URL } from "../config/constant";

interface Todos {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export default function Todos() {
  const [loading, setLoading] = useState<boolean>(true);
  const [todos, setTodos] = useState<Todos[]>([]);

  useEffect(() => {
    console.log("useEffect triggered");

    const fetchTodos = async () => {
      try {
        const response = await fetch(APP_URL + "todos", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.log("Response Error :", response.status);
          return;
        }

        const responseJson: Todos[] = await response.json();
        setTodos(responseJson);
      } catch (error) {
        console.error("Error Fetching Data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Todos List
        </h1>

        {loading && (
          <p className="text-gray-500 dark:text-gray-400">
            Loading todos...
          </p>
        )}

        {/* Empty State */}
        {!loading && todos.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            No todos found.
          </p>
        )}

        {!loading && todos.length > 0 && (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4"
              >
                <div>
                  <p
                    className={`font-medium ${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {todo.title}
                  </p>
                  <span className="text-xs text-gray-500">
                    User #{todo.userId}
                  </span>
                </div>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    todo.completed
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {todo.completed ? "Completed" : "Pending"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
