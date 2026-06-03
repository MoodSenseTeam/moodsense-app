import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock3 } from "lucide-react";
import { feelingOptions } from "../../lib/checkin";

function MoodCheckIn({ hasCheckedInToday = false }) {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState("HAPPY");

  function handleSaveAndAnalyze() {
    navigate("/tracker/mood-energy", { state: { preselectedMood: selectedMood } });
  }

  return (
    <section className="rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-medium text-[#1f3f31] dark:text-white">Check-in Cepat</h2>

        <div className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${hasCheckedInToday ? "border border-[#c7f1dc] bg-[#edf8f2] text-[#2b6a4f] dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300" : "border border-[#ffd6d6] bg-[#fff1f1] text-[#ef4444] dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"}`}>
          <Clock3 size={16} />
          {hasCheckedInToday ? "Sudah check-in hari ini" : "Belum check-in"}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {feelingOptions.map((option) => {
          const isSelected = selectedMood === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedMood(option.value)}
              className={`rounded-2xl border px-4 py-5 text-center transition ${
                isSelected ? "border-[#2b6a4f] bg-[#edf8f2] dark:border-emerald-400 dark:bg-emerald-950/40" : "border-[#dde5e1] bg-white hover:border-[#2b6a4f] dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-400"
              }`}
            >
              <div className="text-3xl">{option.emoji}</div>

              <p className="mt-3 text-sm font-medium text-[#1f3f31] dark:text-white">{option.label}</p>
            </button>
          );
        })}
      </div>

      <button type="button" onClick={handleSaveAndAnalyze} className="mt-7 rounded-xl bg-[#2b6a4f] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#245a43] dark:bg-emerald-600 dark:hover:bg-emerald-700">
        Simpan & Analisis
      </button>
    </section>
  );
}

export default MoodCheckIn;
