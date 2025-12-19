"use client";

import React, { useState, useEffect } from 'react'
import { APP_URL } from '../config/constant';

interface Post {
    id: number;
    title: string;
    body: string;
}

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const fetchPosts = async () => {
        try {
            const response = await fetch(APP_URL + 'posts', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });

            const responseJson = await response.json();

            if (!response.ok) {
                console.log('Response Error : ', responseJson);
                return;
            }

            // const data = await response.json();
            // console.log(data);

            setPosts(responseJson)
        } catch (error) {
            console.log('Error Fetching Data : ', error);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);

  return (
    <div>
        <h1>Post Page</h1>
        {posts.map((post) => (
            <div
                className='bg-cyan-200 p-4 rounded-lg gap-4 m-4'
                key={post.id}
            >
                <h1>{post.title}</h1>
                <h1>{post.body}</h1>
            </div>
        ))}
    </div>
  )
}
