import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  Dumbbell,
  GraduationCap,
  Moon,
  Search,
  Users,
} from "lucide-react";
import { useAuth } from "../contexts/useAuth";
import { fetchCheckinHistory, feelingOptions, getFeelingOption, activityOptions, getActivityOption } from "../lib/checkin";

function HistoryPage() {
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedLogId, setExpandedLogId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      if (isAuthLoading) return;

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
        const response = await fetchCheckinHistory(accessToken);
        
        if (isMounted) {
          // Response is expected to be { message, data: CreatedCheckinDto[] } or raw array.
          // Let's support both.
          const data = response?.data || response || [];
          setLogs(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat riwayat check-in.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [accessToken, isAuthLoading]);

  // Format timestamp helper
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  // Prediction mood mapping helper
  const getPredictionLabel = (mood) => {
    if (!mood) return { label: "Belum dihitung", emoji: "" };
    switch (mood.toUpperCase()) {
      case "HAPPY":
        return { label: "Senang", emoji: "😊", textClass: "text-emerald-600 dark:text-emerald-400" };
      case "NORMAL":
        return { label: "Normal", emoji: "😐", textClass: "text-amber-600 dark:text-amber-400" };
      case "STRESS":
        return { label: "Stres", emoji: "😔", textClass: "text-rose-600 dark:text-rose-400" };
      default:
        return { label: mood, emoji: "" };
    }
  };

  // Filter logs based on search term
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const search = searchTerm.toLowerCase();
      
      const dateString = formatDate(log.logged_at).toLowerCase();
      const notesString = (log.notes || "").toLowerCase();
      
      const feeling = getFeelingOption(log.how_you_feeling);
      const feelingLabel = feeling.label.toLowerCase();
      
      const activity = getActivityOption(log.activity_level);
      const activityLabel = activity.label.toLowerCase();

      const prediction = getPredictionLabel(log.prediction?.mood_result);
      const predictionLabel = prediction.label.toLowerCase();
      const suggestionLabel = (log.prediction?.activity_suggestion || "").toLowerCase();

      return (
        dateString.includes(search) ||
        notesString.includes(search) ||
        feelingLabel.includes(search) ||
        activityLabel.includes(search) ||
        predictionLabel.includes(search) ||
        suggestionLabel.includes(search)
      );
    });
  }, [logs, searchTerm]);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Paginated logs
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const toggleRowExpand = (logId) => {
    setExpandedLogId(expandedLogId === logId ? null : logId);
  };

  // CSV Export logic
  const handleExportCSV = () => {
    if (logs.length === 0) return;

    // Headers matching the database schema properties
    const headers = [
      "Tanggal",
      "Mood (Input)",
      "Tidur (Jam)",
      "Aktivitas",
      "Belajar (Jam)",
      "Interaksi Sosial (1-10)",
      "Prediksi Mood (ML)",
      "Tingkat Keyakinan",
      "Catatan",
      "Saran Aktivitas",
    ];

    const rows = logs.map((log) => {
      const feeling = getFeelingOption(log.how_you_feeling);
      const activity = getActivityOption(log.activity_level);
      const prediction = getPredictionLabel(log.prediction?.mood_result);
      const confidence = log.prediction
        ? `${Math.round(log.prediction.confidence_score * 100)}%`
        : "";
      
      // Escape values containing quotes/commas
      const escape = (val) => {
        if (val === null || val === undefined) return '""';
        const str = String(val);
        return `"${str.replace(/"/g, '""')}"`;
      };

      return [
        formatDate(log.logged_at),
        feeling.label,
        log.sleep_hours,
        activity.label,
        log.study_hours,
        log.social_score,
        prediction.label,
        confidence,
        log.notes || "",
        log.prediction?.activity_suggestion || "",
      ].map(escape).join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `riwayat_checkin_moodsense_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats Calculations
  const stats = useMemo(() => {
    if (logs.length === 0) {
      return {
        total: 0,
        averageSleep: 0,
        averageStudy: 0,
        averageSocial: 0,
        dominantActivity: "—",
        moodDistribution: {},
      };
    }

    const total = logs.length;
    let sleepSum = 0;
    let studySum = 0;
    let socialSum = 0;
    const activityCounts = {};
    const moodCounts = {};

    logs.forEach((log) => {
      sleepSum += log.sleep_hours;
      studySum += log.study_hours;
      socialSum += log.social_score;

      // Activity Level count
      const act = log.activity_level;
      activityCounts[act] = (activityCounts[act] || 0) + 1;

      // Mood Extended count
      const mood = log.how_you_feeling;
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });

    // Find dominant activity
    let dominantAct = "—";
    let maxActCount = 0;
    Object.entries(activityCounts).forEach(([key, value]) => {
      if (value > maxActCount) {
        maxActCount = value;
        dominantAct = getActivityOption(key).label;
      }
    });

    // Mood Distribution Percentages
    const distribution = {};
    feelingOptions.forEach((option) => {
      const count = moodCounts[option.value] || 0;
      distribution[option.value] = {
        label: option.label,
        emoji: option.emoji,
        percentage: Math.round((count / total) * 100),
        count,
      };
    });

    return {
      total,
      averageSleep: (sleepSum / total).toFixed(1),
      averageStudy: (studySum / total).toFixed(1),
      averageSocial: (socialSum / total).toFixed(1),
      dominantActivity: dominantAct,
      moodDistribution: distribution,
    };
  }, [logs]);

  // Loading skeleton
  if (isAuthLoading || isLoading) {
    return (
      <div className="mx-auto max-w-330 px-6 py-10 md:px-10 md:py-16">
        <header className="mb-8 pl-14 lg:pl-0">
          <div className="h-9 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="mt-2 h-5 w-80 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        </header>

        <div className="rounded-[2rem] border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-60 items-center justify-center text-sm text-[#60766b] dark:text-slate-400">
            <span className="animate-pulse">Memuat riwayat check-in dari database...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mx-auto max-w-330 px-6 py-10 md:px-10 md:py-16">
        <header className="mb-8 pl-14 lg:pl-0">
          <h1 className="text-3xl font-medium tracking-tight text-[#1f3f31] dark:text-white md:text-4xl">
            Jejak Perjalananmu
          </h1>
        </header>

        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center shadow-sm dark:border-red-900/40 dark:bg-red-950/30">
          <AlertCircle className="mx-auto text-red-600 dark:text-red-400" size={48} />
          <h3 className="mt-4 text-lg font-semibold text-red-900 dark:text-red-200">Gagal memuat data</h3>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-330 px-6 py-10 md:px-10 md:py-16">
      {/* Page Header */}
      <header className="mb-8 pl-14 lg:pl-0">
        <h1 className="text-3xl font-medium tracking-tight text-[#1f3f31] dark:text-white md:text-4xl">
          Jejak Perjalananmu
        </h1>
        <p className="mt-2 text-base text-[#375446] dark:text-slate-300 md:text-lg">
          Lihat pola dan tren kesehatan mentalmu dari waktu ke waktu.
        </p>
      </header>

      {/* Main Table Card */}
      <div className="mb-10 rounded-[2rem] border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#f2f5f3] pb-6 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-semibold text-[#1f3f31] dark:text-white">Tabel Riwayat Log</h2>
            <p className="text-sm text-[#60766b] dark:text-slate-400">Log lengkap semua check-in</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#91a098] dark:text-slate-500">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari catatan..."
                className="h-11 w-full rounded-xl border border-[#dfe5e1] bg-white pl-11 pr-5 text-sm text-[#1f3f31] outline-none transition placeholder:text-[#7f8f86] focus:border-[#2b6a4f] dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500 sm:w-64"
              />
            </div>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={logs.length === 0}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#dfe5e1] bg-white px-4 text-sm font-semibold text-[#1f3f31] transition hover:bg-[#f7faf8] hover:border-[#2b6a4f] disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#f2f5f3] text-xs font-semibold uppercase tracking-wider text-[#60766b] dark:border-slate-800 dark:text-slate-400">
                <th className="py-4 px-4">Tanggal</th>
                <th className="py-4 px-4">Mood</th>
                <th className="py-4 px-4">Tidur</th>
                <th className="py-4 px-4">Aktivitas</th>
                <th className="py-4 px-4">Belajar</th>
                <th className="py-4 px-4">Interaksi Sosial</th>
                <th className="py-4 px-4">Prediksi Mood</th>
                <th className="py-4 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8faf9] dark:divide-slate-800/50">
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => {
                  const feeling = getFeelingOption(log.how_you_feeling);
                  const activity = getActivityOption(log.activity_level);
                  const pred = getPredictionLabel(log.prediction?.mood_result);
                  const isExpanded = expandedLogId === log.log_id;

                  return (
                    <tr
                      key={log.log_id}
                      onClick={() => toggleRowExpand(log.log_id)}
                      className={`group cursor-pointer text-sm transition hover:bg-[#f8faf9]/50 dark:hover:bg-slate-800/30 ${
                        isExpanded ? "bg-[#f8faf9] dark:bg-slate-800/40" : ""
                      }`}
                    >
                      {/* Tanggal */}
                      <td className="py-4 px-4 font-medium text-[#1f3f31] dark:text-slate-200">
                        {formatDate(log.logged_at)}
                      </td>
                      
                      {/* Mood */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 font-medium text-[#1f3f31] dark:text-slate-200">
                          <span className="text-lg">{feeling.emoji}</span>
                          {feeling.label}
                        </span>
                      </td>

                      {/* Tidur */}
                      <td className="py-4 px-4 text-[#60766b] dark:text-slate-300">
                        {log.sleep_hours} jam
                      </td>

                      {/* Aktivitas */}
                      <td className="py-4 px-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-[#60766b] dark:bg-slate-800 dark:text-slate-300">
                          {activity.label}
                        </span>
                      </td>

                      {/* Belajar */}
                      <td className="py-4 px-4 text-[#60766b] dark:text-slate-300">
                        {log.study_hours} jam
                      </td>

                      {/* Sosial */}
                      <td className="py-4 px-4 text-[#60766b] dark:text-slate-300 font-semibold">
                        {log.social_score}/10
                      </td>

                      {/* Prediksi Mood */}
                      <td className="py-4 px-4">
                        {log.prediction ? (
                          <span className={`inline-flex items-center gap-1 font-semibold ${pred.textClass}`}>
                            <span>{pred.emoji}</span>
                            {pred.label}
                            <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                              ({Math.round(log.prediction.confidence_score * 100)}%)
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-600 font-medium">
                            —
                          </span>
                        )}
                      </td>

                      {/* Expanded trigger */}
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          className="text-[#91a098] transition hover:text-[#1f3f31] group-hover:translate-x-0.5 dark:text-slate-500 dark:hover:text-slate-300"
                          aria-label={isExpanded ? "Tutup detail" : "Buka detail"}
                        >
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-[#60766b] dark:text-slate-400">
                    Tidak ditemukan riwayat log check-in.
                  </td>
                </tr>
              )}

              {/* Render expanded details if active */}
              {paginatedLogs.map((log) => {
                const isExpanded = expandedLogId === log.log_id;
                if (!isExpanded) return null;

                return (
                  <tr key={`expanded-${log.log_id}`} className="bg-[#f8faf9]/30 dark:bg-slate-800/20">
                    <td colSpan={8} className="py-4 px-6 border-b border-[#f2f5f3] dark:border-slate-800">
                      <div className="grid gap-6 rounded-2xl bg-white p-5 border border-[#e2e8e4] dark:bg-slate-950 dark:border-slate-800 md:grid-cols-2">
                        {/* Note Detail */}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#60766b] dark:text-slate-400">
                            Catatan Harian
                          </h4>
                          <p className="mt-2 text-sm leading-relaxed text-[#1f3f31] dark:text-slate-200 whitespace-pre-line italic">
                            {log.notes?.trim() ? `"${log.notes.trim()}"` : "Tidak ada catatan untuk log ini."}
                          </p>
                        </div>

                        {/* Recommendation Detail */}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#60766b] dark:text-slate-400">
                            Rekomendasi Aktivitas (ML)
                          </h4>
                          <p className="mt-2 text-sm leading-relaxed text-[#1f3f31] dark:text-slate-200">
                            {log.prediction?.activity_suggestion ? (
                              <span className="inline-block border-l-4 border-[#19c58f] pl-3">
                                {log.prediction.activity_suggestion}
                              </span>
                            ) : (
                              <span className="text-[#60766b] dark:text-slate-500">
                                Rekomendasi belum tersedia karena prediksi belum dihitung.
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-[#f2f5f3] pt-6 dark:border-slate-800">
            <span className="text-xs font-medium text-[#60766b] dark:text-slate-400">
              Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredLogs.length)} dari {filteredLogs.length} entri
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="rounded-lg border border-[#dfe5e1] bg-white px-3 py-1.5 text-xs font-semibold text-[#1f3f31] transition hover:bg-[#f7faf8] disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                Sebelumnya
              </button>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="rounded-lg border border-[#dfe5e1] bg-white px-3 py-1.5 text-xs font-semibold text-[#1f3f31] transition hover:bg-[#f7faf8] disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary Section */}
      {logs.length > 0 && (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Mood Distribution Card */}
          <div className="rounded-[2rem] border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
            <h3 className="text-lg font-semibold text-[#1f3f31] dark:text-white">Distribusi Mood</h3>
            <p className="text-sm text-[#60766b] dark:text-slate-400 mb-6">Pola perasaan yang terekam</p>
            
            <div className="space-y-4">
              {Object.values(stats.moodDistribution).map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1.5 font-medium text-[#1f3f31] dark:text-slate-300">
                      <span>{item.emoji}</span> {item.label}
                    </span>
                    <span className="font-semibold text-[#1f3f31] dark:text-white">
                      {item.percentage}% <span className="text-xs font-normal text-slate-400">({item.count}x)</span>
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-[#2b6a4f] dark:bg-emerald-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Average Factors Card */}
          <div className="rounded-[2rem] border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
            <h3 className="text-lg font-semibold text-[#1f3f31] dark:text-white">Rata-rata Faktor</h3>
            <p className="text-sm text-[#60766b] dark:text-slate-400 mb-6">Aktivitas penunjang mood harian</p>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Tidur */}
              <div className="rounded-2xl border border-[#e2e8e4] bg-[#f8faf9] p-5 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                    <Moon size={20} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#60766b] dark:text-slate-400">Tidur</p>
                    <p className="mt-1 text-sm font-semibold text-[#1f3f31] dark:text-white">
                      {stats.averageSleep} jam/hari
                    </p>
                  </div>
                </div>
              </div>

              {/* Belajar */}
              <div className="rounded-2xl border border-[#e2e8e4] bg-[#f8faf9] p-5 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                    <GraduationCap size={20} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#60766b] dark:text-slate-400">Belajar</p>
                    <p className="mt-1 text-sm font-semibold text-[#1f3f31] dark:text-white">
                      {stats.averageStudy} jam/hari
                    </p>
                  </div>
                </div>
              </div>

              {/* Sosial */}
              <div className="rounded-2xl border border-[#e2e8e4] bg-[#f8faf9] p-5 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                    <Users size={20} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#60766b] dark:text-slate-400">Interaksi Sosial</p>
                    <p className="mt-1 text-sm font-semibold text-[#1f3f31] dark:text-white">
                      {stats.averageSocial}/10
                    </p>
                  </div>
                </div>
              </div>

              {/* Aktivitas */}
              <div className="rounded-2xl border border-[#e2e8e4] bg-[#f8faf9] p-5 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <Dumbbell size={20} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#60766b] dark:text-slate-400">Aktivitas Utama</p>
                    <p className="mt-1 text-sm font-semibold text-[#1f3f31] dark:text-white">
                      {stats.dominantActivity}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
