import { Link } from "react-router-dom";
import { recentLogs } from "../../data/dashboardData";

function RecentLogs() {
  return (
    <section className="rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium text-[#1f3f31] dark:text-white">Log Terbaru</h2>

        <Link to="/history" className="text-sm font-medium text-[#2b6a4f] transition hover:text-[#245a43] dark:text-emerald-300 dark:hover:text-emerald-200">
          Lihat Semua
        </Link>
      </div>

      <div className="space-y-5">
        {recentLogs.map((log) => (
          <div key={log.id} className="flex items-center justify-between gap-4 border-b border-[#e6ece8] pb-4 last:border-none last:pb-0 dark:border-slate-700">
            <div className="flex items-start gap-4">
              <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${log.color}`} />

              <div>
                <h3 className="text-sm font-medium text-[#1f3f31] dark:text-white">{log.mood}</h3>

                <p className="mt-1 text-xs text-[#60766b] dark:text-slate-300">{log.note}</p>
              </div>
            </div>

            <span className="shrink-0 text-xs text-[#375446] dark:text-slate-400">{log.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentLogs;
