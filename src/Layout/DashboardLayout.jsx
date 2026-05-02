import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex">
      {/* dashboard sidebar (if you have one) */}
      
      <div className="flex-1">
        {/* dashboard topbar (optional) */}
        
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}