import { useOutletContext } from "react-router-dom";

import { getActivityOption, getFeelingOption } from "../../lib/checkin";

function NoteStep() {
  const { draft, setDraft, submitError, isSubmitting, isSubmitted } = useOutletContext();

  const feeling = getFeelingOption(draft.how_you_feeling);
  const activity = getActivityOption(draft.activity_level);

  return (
    <section className="grid gap-7 xl:grid-cols-[1fr_0.9fr]">
      <div className="rounded-3xl border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-6">
          <p className="text-sm font-medium text-[#60766b] dark:text-slate-400">Langkah 3 dari 3</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#1f3f31] dark:text-white">Catatan</h2>
          <p className="mt-2 text-sm leading-7 text-[#60766b] dark:text-slate-300">Tambahkan catatan singkat sebelum check-in dikirim ke backend.</p>
        </div>

        <label className="block">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-[#1f3f31] dark:text-white">Catatan harian</span>
            <span className="text-xs text-[#60766b] dark:text-slate-400">{draft.notes.length}/500</span>
          </div>

          <textarea
            value={draft.notes}
            onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
            maxLength={500}
            rows={9}
            placeholder="Contoh: tidur agak larut, tapi pagi ini merasa lebih fokus setelah jalan sebentar."
            className="mt-4 w-full rounded-2xl border border-[#dde5e1] bg-white px-4 py-3 text-sm leading-7 text-[#1f3f31] outline-none transition placeholder:text-[#94a3b8] focus:border-[#2b6a4f] dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
          />
        </label>

        {submitError && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
            {submitError}
          </div>
        )}

        {isSubmitted && !submitError && (
          <div className="mt-5 rounded-2xl border border-[#c7f1dc] bg-[#edf8f2] px-4 py-3 text-sm text-[#2b6a4f] dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
            Check-in sudah tersimpan. Kamu akan diarahkan ke dashboard.
          </div>
        )}
      </div>

      <aside className="rounded-3xl border border-[#e2e8e4] bg-[#f8faf9] p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-[#1f3f31] dark:text-white">Tinjauan sebelum kirim</h3>

        <div className="mt-6 space-y-4">
          <ReviewItem label="Mood" value={feeling.label} />
          <ReviewItem label="Aktivitas" value={activity.label} />
          <ReviewItem label="Tidur" value={`${draft.sleep_hours} jam`} />
          <ReviewItem label="Belajar" value={`${draft.study_hours} jam`} />
          <ReviewItem label="Sosial" value={`${draft.social_score}/10`} />
          <ReviewItem label="Catatan" value={draft.notes.trim() || "Tanpa catatan"} />
        </div>

        <p className="mt-6 text-sm leading-7 text-[#60766b] dark:text-slate-300">Saat kamu menekan Simpan, frontend akan mengirim data ini ke endpoint <span className="font-semibold text-[#1f3f31] dark:text-white">/dashboard/checkin</span> dengan access token aktif.</p>
      </aside>
    </section>
  );
}

function ReviewItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#e2e8e4] bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
      <p className="text-xs uppercase tracking-[0.2em] text-[#60766b] dark:text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#1f3f31] dark:text-white">{value}</p>
    </div>
  );
}

export default NoteStep;