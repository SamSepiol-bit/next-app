"use client";

import { useState, useEffect } from "react";
import { APP_URL } from "../config/constant";

interface Post {
    userId: number;
    id: number;
    title: string;
}

export default function Albums() {
    const [posts, setPosts] = useState<Post[]>([]); 
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPost = async() => {
            try {
                const response = await fetch(APP_URL + "posts");
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("Error Fetching Data: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, []);

    return(
        <div className="">
            <main className="min-h-screen bg-gray-100 dark:bg-slate-950 transition-colors">
                <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800"
                >
                    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Albums...
                        </h1>

                    </div>
                </header>
                <section className="max-w-6xl mx-auto px-6 py-10">
                    {loading ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            Loading Comments...
                        </p>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <div
                                    key={post.id} 
                                    className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition"
                                >
                                    <div className="flex item-center justify-between mb-3">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white"
                                        >
                                            #{post.id}
                                        </span>
                                    </div>
                             <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {post.userId}
                            </h2>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                {post.id}
                            </p>

                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                {post.title}
                            </p>
                            </div>
                        ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}