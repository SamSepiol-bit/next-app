import React from 'react'
import SideBar from '../components/DBComponents/sideBar'
import { Sidebar as SidebarIcon } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="flex">
      <SideBar />

      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Example usage of the icon */}
        <SidebarIcon className="w-6 h-6 mt-4" />
      </main>
    </div>
  )
}
