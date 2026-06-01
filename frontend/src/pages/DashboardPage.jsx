import DashboardHeader from "../components/dashboard/DashboardHeader";
import MoodCheckIn from "../components/dashboard/MoodCheckIn";
import StatCard from "../components/dashboard/StatCard";
import MoodChart from "../components/dashboard/MoodChart";
import RecentLogs from "../components/dashboard/RecentLogs";
import InsightCard from "../components/dashboard/InsightCard";
import PredictionCard from "../components/dashboard/PredictionCard";
import RecommendationCard from "../components/dashboard/RecommendationCard";

function DashboardPage() {
  return (
    <div className="mx-auto max-w-330">
      <DashboardHeader />

      <div className="space-y-7">
        <MoodCheckIn />

        <div className="grid gap-5 md:grid-cols-3">
          <StatCard title="Streak Check-in" value="12 Hari" description="+ dari kemarin" accent="text-[#2b6a4f]" />

          <StatCard title="Rata-rata Mood" value="Baik" description="Stabil" accent="text-[#60766b]" />

          <StatCard title="Kualitas Tidur" value="7.5 Jam" description="Cukup" accent="text-[#f59e0b]" />
        </div>

        <MoodChart />

        <div className="grid gap-7 xl:grid-cols-2">
          <RecentLogs />
          <InsightCard />
        </div>

        <div className="grid gap-7 xl:grid-cols-2">
          <PredictionCard />
          <RecommendationCard />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
