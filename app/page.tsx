"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {MessageCircle, ImageIcon, Folder, GalleryHorizontal, ListTodo, Users, Hotel,} from "lucide-react";


export default function Home() {
    const router = useRouter();

    const items = [
        {
                title: "Posts",
                desc: "Browse and manage posts",
                icon: MessageCircle,
                path: "/posts",
            },
            {
                title: "Comments",
                desc: "Read and moderate comments",
                icon: ImageIcon,
                path: "/comments",
            },
            {
                title: "Albums",
                desc: "Explore photo albums",
                icon: Folder,
                path: "/albums",
            },
            {
                title: "photos",
                desc: "Explore gallery photos",
                icon: GalleryHorizontal,
                path: "/photos"

            },
            {
                title: "Todos",
                desc: "Message for Your task",
                icon: ListTodo,
                path: "/todos"
            },
            {
                title: "Users",
                desc: "Manage users",
                icon: Users,
                path: "/users"
            },
            {
                title: "Hotels",
                desc: "Manage users",
                icon: Hotel,
                path: "/hotel",
            },
            {
                title: "Homehotel",
                desc: "Landing page",
                icon: Hotel,
                path: "/hotelHome"
            }
        ];

    return(

        
        
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-6">
            <section className="w-full max-w-5xl">
                <div className="mb-12 text-center">
                    
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Dashboard
                    </h1>
                    <p className="mt-3 text-slate-400 text-lg">
                        Choose a section to continue
                    </p>
                </div>

                
                =
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {items.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y:30 }}
                            animate={{ opacity: 1, y:0 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => router.push(item.path)}
                            className="group cursor-pointer rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl hover:bg-white/10 transition"
                        >
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 mb-4 group-hover:scale-110 transition"
                            >
                                <item.icon size={22} />
                            </div>

                            <h3 className="text-xl font-semibold text-white">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm text-slate-400">
                                {item.desc}
                            </p>

                            <div className="mt-6 text-cyan-400 text-sm font-semibold group-hover:translate-x-1 transition"
                            >
                                Open
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

        </main>
    )
}