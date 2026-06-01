import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <section className="min-h-screen bg-[#f8faf9] text-[#1f3f31] dark:bg-slate-950 dark:text-white">
      <button
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-[#e3e9e5] bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:hidden"
        aria-label="Buka menu"
      >
        <Menu size={22} />
      </button>

      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="min-h-screen px-5 py-8 lg:ml-70 lg:px-10 xl:px-12">
        <Outlet />
      </main>
    </section>
  );
}

export default DashboardLayout;
