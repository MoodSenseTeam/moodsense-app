import { Link, NavLink } from "react-router-dom";
import { BarChart3, BrainCircuit, CalendarCheck, History, Lightbulb, LogOut, Settings, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";

function DashboardSidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const { language } = useApp();

  const menus = [
    {
      label: language === "id" ? "Beranda" : "Dashboard",
      path: "/dashboard",
      icon: BarChart3,
    },
    {
      label: language === "id" ? "Mood Tracker" : "Mood Tracker",
      path: "/tracker",
      icon: CalendarCheck,
    },
    {
      label: language === "id" ? "Prediksi Mood" : "Mood Prediction",
      path: "/prediction",
      icon: BrainCircuit,
    },
    {
      label: language === "id" ? "Rekomendasi" : "Recommendation",
      path: "/recommendation",
      icon: Lightbulb,
    },
    {
      label: language === "id" ? "Riwayat" : "History",
      path: "/history",
      icon: History,
    },
    {
      label: language === "id" ? "Pengaturan" : "Settings",
      path: "/settings/profile",
      icon: Settings,
    },
  ];

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-70 flex-col overflow-y-auto overscroll-contain border-r border-[#e6ece8] bg-white px-8 py-8 transition-transform duration-300 dark:border-slate-700 dark:bg-slate-900 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="text-2xl font-bold text-[#2b6a4f] dark:text-emerald-300">
            Mood Sense
          </Link>

          <button type="button" onClick={onClose} className="text-[#1f3f31] dark:text-white lg:hidden" aria-label="Tutup menu">
            <X size={22} />
          </button>
        </div>

        <nav className="mt-12 space-y-3">
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <NavLink
                key={menu.path}
                to={menu.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-[#e8f3ed] text-[#2b6a4f] dark:bg-emerald-950/40 dark:text-emerald-300" : "text-[#375446] hover:bg-[#f3f7f5] dark:text-slate-300 dark:hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={18} />
                {menu.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[#e6ece8] pt-7 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d8f5e6] text-sm font-semibold text-[#2b6a4f] dark:bg-emerald-950 dark:text-emerald-300">{user.avatar}</div>

            <div>
              <p className="font-semibold text-[#1f3f31] dark:text-white">{user.name}</p>
              <p className="text-sm text-[#60766b] dark:text-slate-300">{language === "id" ? user.status : "Active"}</p>
            </div>
          </div>

          <button className="mt-6 flex items-center gap-3 text-sm font-medium text-[#60766b] hover:text-[#2b6a4f] dark:text-slate-300 dark:hover:text-emerald-300">
            <LogOut size={18} />
            {language === "id" ? "Keluar" : "Logout"}
          </button>
        </div>
      </aside>

      {isOpen && <button type="button" onClick={onClose} className="fixed inset-0 z-40 bg-black/30 lg:hidden" aria-label="Tutup overlay" />}
    </>
  );
}

export default DashboardSidebar;
