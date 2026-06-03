import { BarChart3 } from "lucide-react";

function DashboardHeader() {
  return (
    <header className="mb-8 pl-14 lg:pl-0">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf8f2] dark:bg-emerald-950/30">
          <BarChart3 size={24} className="text-[#2b6a4f] dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-[#1f3f31] dark:text-white md:text-4xl">Bagaimana perasaanmu?</h1>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
