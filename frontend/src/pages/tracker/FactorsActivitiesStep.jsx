import { useOutletContext } from "react-router-dom";

import { activityOptions } from "../../lib/checkin";

function FactorsActivitiesStep() {
  const { draft, setDraft } = useOutletContext();

  return (
    <section className="grid gap-7 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-6">
          <p className="text-sm font-medium text-[#60766b] dark:text-slate-400">Langkah 2 dari 3</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#1f3f31] dark:text-white">Faktor & Aktivitas</h2>
          <p className="mt-2 text-sm leading-7 text-[#60766b] dark:text-slate-300">Isi aktivitas fisik, waktu belajar, dan interaksi sosial hari ini.</p>
        </div>

        <div>
          <p className="text-sm font-medium text-[#1f3f31] dark:text-white">Tingkat aktivitas</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {activityOptions.map((option) => {
              const isSelected = draft.activity_level === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDraft((current) => ({ ...current, activity_level: option.value }))}
                  className={`rounded-2xl border p-4 text-left transition ${isSelected ? "border-[#2b6a4f] bg-[#edf8f2] dark:border-emerald-400 dark:bg-emerald-950/40" : "border-[#dde5e1] bg-white hover:border-[#2b6a4f] dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-400"}`}
                >
                  <p className="text-sm font-semibold text-[#1f3f31] dark:text-white">{option.label}</p>
                  <p className="mt-1 text-xs leading-6 text-[#60766b] dark:text-slate-400">{option.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <NumberField
            label="Jam belajar"
            description="Durasi waktu yang kamu gunakan untuk belajar atau bekerja hari ini."
            value={draft.study_hours}
            min={0}
            max={24}
            step={0.5}
            onChange={(value) => setDraft((current) => ({ ...current, study_hours: value }))}
          />

          <NumberField
            label="Skor sosial"
            description="Kualitas atau keaktifan interaksi sosialmu hari ini (1: Sangat minim/sendiri, 10: Sangat aktif/berarti)."
            value={draft.social_score}
            min={1}
            max={10}
            step={1}
            onChange={(value) => setDraft((current) => ({ ...current, social_score: value }))}
          />
        </div>
      </div>

      <aside className="rounded-3xl border border-[#e2e8e4] bg-[#f8faf9] p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-[#1f3f31] dark:text-white">Faktor yang tercatat</h3>
        <div className="mt-6 space-y-4">
          <SummaryItem label="Aktivitas" value={draft.activity_level} />
          <SummaryItem label="Belajar" value={`${draft.study_hours} jam`} />
          <SummaryItem label="Sosial" value={`${draft.social_score}/10`} />
        </div>
      </aside>
    </section>
  );
}

function NumberField({ label, description, value, min, max, step, onChange }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-[#1f3f31] dark:text-white">{label}</span>
        <span className="text-sm font-semibold text-[#2b6a4f] dark:text-emerald-300">{value}</span>
      </div>
      {description && (
        <p className="mt-1.5 text-xs leading-5 text-[#60766b] dark:text-slate-400">{description}</p>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 w-full accent-[#2b6a4f]"
      />
    </label>
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

export default FactorsActivitiesStep;