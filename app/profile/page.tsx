// app/profile/page.tsx
import SideBar from "../components/DBComponents/sideBar";
import UserProfile from "../userProfile/page";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideBar />
      
      {/* Main Content Area */}
      <main className="flex-1 bg-gray-50 p-4 md:p-6 overflow-auto dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          
          <UserProfile />
        </div>
      </main>
    </div>
  );
}