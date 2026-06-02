import { useOutletContext } from "react-router-dom";

import { feelingOptions } from "../../lib/checkin";

function MoodEnergyStep() {
  const { draft, setDraft } = useOutletContext();

  return (
    <section className="grid gap-7 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-6">
          <p className="text-sm font-medium text-[#60766b] dark:text-slate-400">Langkah 1 dari 3</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#1f3f31] dark:text-white">Mood & Energi</h2>
          <p className="mt-2 text-sm leading-7 text-[#60766b] dark:text-slate-300">Pilih kondisi emosionalmu hari ini dan berapa jam kamu tidur semalam.</p>
        </div>

        <div>
          <p className="text-sm font-medium text-[#1f3f31] dark:text-white">Bagaimana perasaanmu?</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {feelingOptions.map((option) => {
              const isSelected = draft.how_you_feeling === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDraft((current) => ({ ...current, how_you_feeling: option.value }))}
                  className={`rounded-2xl border p-4 text-left transition ${isSelected ? "border-[#2b6a4f] bg-[#edf8f2] dark:border-emerald-400 dark:bg-emerald-950/40" : "border-[#dde5e1] bg-white hover:border-[#2b6a4f] dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-400"}`}
                >
                  <div className="text-2xl">{option.emoji}</div>
                  <p className="mt-3 text-sm font-semibold text-[#1f3f31] dark:text-white">{option.label}</p>
                  <p className="mt-1 text-xs leading-6 text-[#60766b] dark:text-slate-400">{option.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="sleep-hours" className="text-sm font-medium text-[#1f3f31] dark:text-white">Jam tidur</label>
            <span className="text-sm font-semibold text-[#2b6a4f] dark:text-emerald-300">{draft.sleep_hours} jam</span>
          </div>

          <input
            id="sleep-hours"
            type="range"
            min="0"
            max="24"
            step="0.5"
            value={draft.sleep_hours}
            onChange={(event) => setDraft((current) => ({ ...current, sleep_hours: Number(event.target.value) }))}
            className="mt-4 w-full accent-[#2b6a4f]"
          />

          <div className="mt-2 flex justify-between text-xs text-[#60766b] dark:text-slate-400">
            <span>0 jam</span>
            <span>24 jam</span>
          </div>
        </div>
      </div>

      <aside className="rounded-3xl border border-[#e2e8e4] bg-[#f8faf9] p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-[#1f3f31] dark:text-white">Ringkasan sementara</h3>
        <p className="mt-2 text-sm leading-7 text-[#60766b] dark:text-slate-300">Data ini akan dipakai backend untuk memprediksi mood dan menyusun saran harian.</p>

        <div className="mt-6 space-y-4">
          <SummaryItem label="Mood" value={draft.how_you_feeling} />
          <SummaryItem label="Tidur" value={`${draft.sleep_hours} jam`} />
        </div>
      </aside>
    </section>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#e2e8e4] bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
      <p className="text-xs uppercase tracking-[0.2em] text-[#60766b] dark:text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#1f3f31] dark:text-white">{value}</p>
    </div>
  );
}

export default MoodEnergyStep;