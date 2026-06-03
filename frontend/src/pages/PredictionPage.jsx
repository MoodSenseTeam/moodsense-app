import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingDown, TrendingUp, Minus, Sparkles, AlertTriangle, Lightbulb } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "../contexts/useAuth";
import { fetchDashboardSummary, fetchDashboardInsights, fetchForecast, formatTrendDay } from "../lib/dashboard";

function getMoodLabel(value) {
  if (value <= 2.5) return "Buruk";
  if (value <= 4.5) return "Kurang";
  if (value <= 6.5) return "Biasa";
  if (value <= 8.5) return "Baik";
  return "Luar Biasa";
}

function getMoodColor(value) {
  if (value <= 2.5) return "#ef4444";
  if (value <= 4.5) return "#f97316";
  if (value <= 6.5) return "#eab308";
  if (value <= 8.5) return "#22c55e";
  return "#10b981";
}

function PredictionPage() {
  const navigate = useNavigate();
  const { accessToken, user, isAuthLoading } = useAuth();
  const [historical, setHistorical] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!accessToken) return;

    try {
      setIsLoading(true);
      setError(null);

      const [summary, insights, forecastResult] = await Promise.all([
        fetchDashboardSummary(accessToken),
        fetchDashboardInsights(accessToken),
        fetchForecast(accessToken),
      ]);

      // Build historical trend for chart
      const trend = (summary?.weekly_mood_trend || []).map((point) => ({
        day: formatTrendDay(point.date),
        date: point.date,
        mood: point.average_mood,
        type: "Historis",
      }));

      setHistorical(trend);
      setForecast(forecastResult?.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat prediksi.");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Merge chart data: historical + forecast
  const chartData = [...historical];
  if (forecast?.forecasts) {
    forecast.forecasts.forEach((f) => {
      chartData.push({
        day: f.day,
        date: f.date,
        mood: f.predicted_mood,
        type: "Proyeksi",
        confidence: f.confidence,
      });
    });
  }

  const TrendIcon = forecast?.trend_direction === "meningkat" ? TrendingUp
    : forecast?.trend_direction === "menurun" ? TrendingDown
    : Minus;

  const trendColor = forecast?.trend_direction === "meningkat" ? "text-emerald-500"
    : forecast?.trend_direction === "menurun" ? "text-rose-500"
    : "text-amber-500";

  const trendBg = forecast?.trend_direction === "meningkat" ? "bg-emerald-50 dark:bg-emerald-950/30"
    : forecast?.trend_direction === "menurun" ? "bg-rose-50 dark:bg-rose-950/30"
    : "bg-amber-50 dark:bg-amber-950/30";

  // --- Loading ---
  if (isAuthLoading || isLoading) {
    return (
      <div className="mx-auto max-w-330">
        <div className="mb-8 h-5 w-48 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
        <div className="mb-2 h-8 w-64 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
        <div className="mb-8 h-4 w-80 animate-pulse rounded-md bg-slate-100 dark:bg-slate-700/60" />
        <div className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  // --- Error ---
  if (error) {
    return (
      <div className="mx-auto max-w-330">
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-8 dark:border-red-900/30 dark:bg-red-950/20">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle size={20} className="text-red-500" />
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">Gagal Memuat</h2>
          </div>
          <p className="text-sm text-red-600 dark:text-red-300/90">{error}</p>
          <button type="button" onClick={loadData} className="mt-4 rounded-xl bg-white border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800/40 dark:text-red-300">
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  // --- Empty (no check-in data) ---
  if (historical.length === 0) {
    return (
      <div className="mx-auto max-w-330">
        <div className="flex flex-col items-center py-20 text-center rounded-2xl border border-[#e2e8e4] bg-white dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/70">
            <Sparkles size={40} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h2 className="mt-6 text-lg font-semibold text-[#1f3f31] dark:text-slate-100">Belum cukup data</h2>
          <p className="mt-2 text-sm text-[#60766b] dark:text-slate-400 max-w-sm">
            Lakukan check-in secara rutin minimal 3-5 hari agar AI dapat memproyeksikan tren mood kamu ke depan.
          </p>
          <button type="button" onClick={() => navigate("/tracker")} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2b6a4f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#245a43] dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors">
            Mulai Check-in
          </button>
        </div>
      </div>
    );
  }

  // --- Forecast ---
  return (
    <div className="mx-auto max-w-330">
      <header className="mb-8 pl-14 lg:pl-0">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950/30">
            <Sparkles size={24} className="text-purple-500 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-[#1f3f31] dark:text-white md:text-4xl">Prediksi Mood</h1>
            <p className="mt-2 text-base text-[#375446] dark:text-slate-300 md:text-lg">
              Proyeksi 5 hari ke depan berdasarkan tren historis
            </p>
          </div>
        </div>
      </header>

      {/* Chart */}
      <div className="mt-8 rounded-2xl border border-[#e2e8e4] bg-white p-6 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-md">
        <div className="mb-4 flex items-center gap-5 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-[#60766b] dark:text-slate-400">
            <span className="h-3 w-3 rounded-full bg-[#7bc47f]" /> Historis
          </span>
          <span className="flex items-center gap-1.5 text-purple-500 dark:text-purple-400">
            <span className="h-3 w-3 rounded-full bg-purple-400" /> Proyeksi
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7bc47f" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#7bc47f" stopOpacity={0.08} />
                </linearGradient>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.04} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#e9efeb" />

              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} dy={12} />

              <YAxis domain={[1, 10]} ticks={[2, 4, 6, 8, 10]} tickFormatter={getMoodLabel} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} width={80} />

              <Tooltip
                formatter={(value, name) => [name === "confidence" ? `${Math.round(value * 100)}%` : `${value}/10`, name === "confidence" ? "Confidence" : "Mood"]}
                labelStyle={{ color: "#1f3f31", fontWeight: 600 }}
                contentStyle={{ borderRadius: "14px", border: "1px solid #e2e8e4", backgroundColor: "#ffffff", color: "#1f3f31" }}
              />

              {/* Historical */}
              <Area type="monotone" dataKey="mood" stroke="#7bc47f" strokeWidth={3} fill="url(#histGrad)" dot={{ r: 4, fill: "#7bc47f", stroke: "#7bc47f" }} activeDot={{ r: 6, fill: "#2b6a4f" }} />

              {/* Forecast */}
              <Line type="monotone" dataKey="mood" stroke="#a78bfa" strokeWidth={3} strokeDasharray="8 4" dot={{ r: 5, fill: "#a78bfa", stroke: "#7c3aed" }} activeDot={{ r: 7, fill: "#7c3aed" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Analysis */}
      {forecast && (
        <div className={`mt-6 rounded-2xl border p-6 ${trendBg} dark:border-slate-800 dark:bg-opacity-20`}>
          <div className="flex items-center gap-3 mb-3">
            <TrendIcon size={22} className={trendColor} />
            <h3 className="text-lg font-semibold text-[#1f3f31] dark:text-slate-100 capitalize">
              Tren {forecast.trend_direction}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-[#60766b] dark:text-slate-400">
            {forecast.trend_analysis}
          </p>

          {/* Forecast details */}
          <div className="mt-5 grid gap-3 sm:grid-cols-5">
            {forecast.forecasts.map((f) => (
              <div key={f.date} className="rounded-xl bg-white/60 p-3 text-center dark:bg-slate-900/50">
                <p className="text-xs text-[#60766b] dark:text-slate-500">{f.day}</p>
                <p className="mt-1 text-xl font-bold" style={{ color: getMoodColor(f.predicted_mood) }}>
                  {f.predicted_mood}
                </p>
                <p className="text-xs font-medium text-[#1f3f31] dark:text-slate-300">{f.label}</p>
                <p className="mt-1 text-[10px] text-[#9ca9a1] dark:text-slate-500">{Math.round(f.confidence * 100)}% yakin</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {forecast?.boost_tips?.length > 0 && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 dark:border-emerald-900/30 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={18} className="text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Tips Pertahankan Mood</h3>
            </div>
            <ul className="space-y-3">
              {forecast.boost_tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#60766b] dark:text-slate-400">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {forecast?.prevention_tips?.length > 0 && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-6 dark:border-rose-900/30 dark:bg-rose-950/20">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-rose-500 dark:text-rose-400" />
              <h3 className="text-sm font-semibold text-rose-800 dark:text-rose-300">Tips Pencegahan</h3>
            </div>
            <ul className="space-y-3">
              {forecast.prevention_tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#60766b] dark:text-slate-400">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictionPage;
