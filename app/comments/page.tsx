"use client";

import { useState, useEffect } from "react";
import { APP_URL } from "../config/constant";

interface Post {
     id: number;
     name: string;
     email: string;
     body: string;
}

export default function CommentPage() {
    const [posts, setPosts] = useState<Post[]>([]);

    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // const fetchPost = async () => {
        //     try {
        //         const response = await fetch(APP_URL + "comments", {
        //             method: 'GET',
        //             headers: {
        //                 'Accept': 'application/json',
        //                 'Content-Type': 'application/json',
        //             },
        //         });

        //         const responseJson = await response.json();

        //         if (!response.ok) {
        //             console.log('Response Error : ', responseJson);
        //             return;
        //         }
        //         console.log('Posts: ', responseJson);
        //         setPosts(responseJson);
        //     } catch (error) {
        //         console.log('Error Fetching Data : ', error);
        //     }
        // }
            const fetchPost = async () => {
                try {
                    const response = await fetch(APP_URL + "posts");
                    const data = await response.json();
                    setPosts(data);
                } catch (error) {
                    console.error("Error Fetching Data:", error);
                } finally {
                    setLoading(false);
                }
            };
        
    
        fetchPost();
    }, []);

    return (
        // <div>
        //     <h1>Comment Page</h1>
        //     {posts.map((post) => (
        //         <div 
        //             className='bg-cyan-200 p-4 rounded-lg gap-4 m-4'
        //             key={post.id}
        //         >
        //             <h1>{post.id}</h1>
        //             <h2>{post.name}</h2>
        //             <p>{post.email}</p>
        //             <p>{post.body}</p>
        //         </div>
        //     ))}
        // </div>

        <div className={darkMode ? "dark" : ""}>
            <main className="min-h-screen bg-gray-100 dark:bg-slate-950 transition-colors">
                <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800"
                >
                    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Comments
                        </h1>

                        <button
                            onClick={() => setDarkMode(!setDarkMode)}
                            className="px-4 py-2 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black transition"
                        >
                            {darkMode ? "Light Mode " : "Dark Mode "}
                        </button>
                    </div>
                </header>
                <section className="max-w-6xl mx-auto px-6 py-10">
                    {loading ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            Loading Comments...
                        </p>
                    ) : (
                        <div className="mx-auto max-w-7xl">
                            <div className="grid gap-6 sm:grid-col-1 md:grid-cols-2 lg:grid-cols-3 ">
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
                                        {post.name}
                                    </h2>

                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                        {post.email}
                                    </p>

                                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                        {post.body}
                                    </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}