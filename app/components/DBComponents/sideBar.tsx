"use client";

import {
  FileText,
  HomeIcon,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  ShoppingCart,
  Trophy,
  User,
  X,
  Clipboard,
  Puzzle,
  MessageCircle,
  HelpCircle,
  Ticket,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const dBoard = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
];

const navMain = [
  { href: "/profile", label: "User Profile", icon: User },
  { href: "/cv", label: "My CV", icon: FileText },
  { href: "/jobs", label: "Jobs", icon: ShoppingBag },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/plans", label: "Plans", icon: Trophy },
];

const navOrders = [
  { href: "/invoice", label: "Invoice", icon: Clipboard },
  { href: "/subscriptions", label: "Subscriptions", icon: Package },
  { href: "/appJobs", label: "Apply Jobs", icon: Puzzle },
];

const navOthers = [
    { href: "/chatAdm", label: "Chat with Admin", icon: MessageCircle },
    { href: "/faq", label: "FAQs", icon: HelpCircle },
    { href: "/support", label: "Support Request", icon: Ticket },
    { href: "/share", label: "Referral", icon:  Share2 },
]

export default function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`bg-gray-900 text-white h-screen sticky top-0 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-800 rounded"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        <span className="text-[10px] text-gray-500 mt-6 mb-3 tracking-widest">
          Dashboard
        </span>
        {dBoard.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition"
          >
            <Icon size={20} />
            {!isCollapsed && <span>{label}</span>}
          </Link>
        ))}

        <span className="text-[10px] text-gray-500 mt-6 mb-4 tracking-widest">
          Accounts
        </span>

        {navMain.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition"
          >
            <Icon size={20} />
            {!isCollapsed && <span>{label}</span>}
          </Link>
        ))}

        <span className="text-[10px] text-gray-500 mt-6 mb-4 tracking-widest">
          Orders
        </span>

        {navOrders.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition"
          >
            <Icon size={20} />
            {!isCollapsed && <span>{label}</span>}
          </Link>
        ))}

        <span className="text-[10px] text-gray-500 mt-6 mb-4 tracking-widest">
          Others
        </span>

        {navOthers.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition"
          >
            <Icon size={20} />
            {!isCollapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition w-full">
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}