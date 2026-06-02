import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import MoodCheckIn from "../components/dashboard/MoodCheckIn";
import StatCard from "../components/dashboard/StatCard";
import MoodChart from "../components/dashboard/MoodChart";
import RecentLogs from "../components/dashboard/RecentLogs";
import InsightCard from "../components/dashboard/InsightCard";
import PredictionCard from "../components/dashboard/PredictionCard";
import RecommendationCard from "../components/dashboard/RecommendationCard";
import { useAuth } from "../contexts/useAuth";
import { buildDashboardViewModel, fetchDashboardInsights, fetchDashboardSummary } from "../lib/dashboard";

function DashboardPage() {
  const location = useLocation();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      if (isAuthLoading) {
        return;
      }

      if (!accessToken) {
        if (isMounted) {
          setError("Sesi login tidak tersedia.");
          setIsLoading(false);
        }

        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [summary, insights] = await Promise.all([
          fetchDashboardSummary(accessToken),
          fetchDashboardInsights(accessToken),
        ]);

        if (!isMounted) {
          return;
        }

        setDashboard(buildDashboardViewModel(summary, insights));
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat dashboard.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [accessToken, isAuthLoading]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="mx-auto max-w-330">
        <DashboardHeader />

        <div className="rounded-2xl border border-[#e2e8e4] bg-white p-6 text-sm text-[#60766b] shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Memuat data dashboard dari backend...
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="mx-auto max-w-330">
        <DashboardHeader />

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          {error || "Gagal memuat dashboard."}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-330">
      <DashboardHeader />

      <div className="space-y-7">
        {location.state?.checkinSuccess && (
          <div className="rounded-2xl border border-[#c7f1dc] bg-[#edf8f2] px-5 py-4 text-sm font-medium text-[#2b6a4f] shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
            Check-in berhasil disimpan. Dashboard diperbarui dari backend.
          </div>
        )}

        <MoodCheckIn hasCheckedInToday={dashboard.hasCheckedInToday} />

        <div className="grid gap-5 md:grid-cols-3">
          {dashboard.stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <MoodChart data={dashboard.chartData} />

        <div className="grid gap-7 xl:grid-cols-2">
          <RecentLogs logs={dashboard.recentLogs} />
          <InsightCard insight={dashboard.insight} />
        </div>

        <div className="grid gap-7 xl:grid-cols-2">
          <PredictionCard prediction={dashboard.prediction} />
          <RecommendationCard recommendations={dashboard.recommendations} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
