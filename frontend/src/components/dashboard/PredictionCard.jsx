import { useNavigate } from "react-router-dom";
import { ArrowRight, ListChecks } from "lucide-react";

function PredictionCard({ prediction }) {
  const navigate = useNavigate();

  const title = prediction?.title || "Prediksi belum tersedia";
  const score = prediction?.score || "-";
  const status = prediction?.status || "Menunggu data";
  const factors = prediction?.factors || null;

  const hasFactors = factors && (
    (factors.stressors && factors.stressors.length > 0) ||
    (factors.boosters && factors.boosters.length > 0)
  );

  return (
    <section className="rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-lg font-medium text-[#1f3f31] dark:text-white">Prediksi Mood</h2>

      <div className="mt-6 flex items-center gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d8f7e8] text-[#2b6a4f] dark:bg-emerald-950/50 dark:text-emerald-300">
          <ListChecks size={24} />
        </div>

        <div>
          <p className="text-sm text-[#60766b] dark:text-slate-300">Prediksi Hari ini</p>

          <h3 className="text-base font-medium text-[#1f3f31] dark:text-white">{title}</h3>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-[#f0f4f7] p-4 dark:bg-slate-800">
          <p className="text-xs text-[#60766b] dark:text-slate-400">Skor saat ini</p>

          <h4 className="mt-2 text-lg font-medium text-[#1f3f31] dark:text-white">{score}</h4>
        </div>

        <div className="rounded-xl bg-[#f0f4f7] p-4 dark:bg-slate-800">
          <p className="text-xs text-[#60766b] dark:text-slate-400">Status</p>

          <span className="mt-2 inline-flex rounded-full bg-[#d8f7e8] px-3 py-1 text-xs font-medium text-[#2b6a4f] dark:bg-emerald-950/50 dark:text-emerald-300">{status}</span>
        </div>
      </div>

      <div className="mt-7">
        <p className="text-xs font-medium text-[#60766b] dark:text-slate-400 mb-3">Faktor utama:</p>

        {hasFactors ? (
          <div className="space-y-4">
            {factors.stressors && factors.stressors.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">
                  Pemicu Stres (Stressors)
                </p>
                <div className="space-y-2">
                  {factors.stressors.map((s, idx) => (
                    <div key={idx} className="rounded-xl border border-rose-100 bg-rose-50/30 p-3 dark:border-rose-950/20 dark:bg-rose-950/10">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-rose-900 dark:text-rose-200">{s.name}</span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">{s.value}</span>
                      </div>
                      <p className="mt-1 text-xs text-rose-700 dark:text-rose-300/80 leading-relaxed">{s.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {factors.boosters && factors.boosters.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                  Pendukung Mood (Boosters)
                </p>
                <div className="space-y-2">
                  {factors.boosters.map((b, idx) => (
                    <div key={idx} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3 dark:border-emerald-950/20 dark:bg-emerald-950/10">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">{b.name}</span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">{b.value}</span>
                      </div>
                      <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300/80 leading-relaxed">{b.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm leading-6 text-[#1f3f31] dark:text-slate-300">
            Tambahkan beberapa check-in agar faktor pemicu stres dan pendukung mood Anda terdeteksi.
          </p>
        )}
      </div>

      <button type="button" onClick={() => navigate("/prediction")} className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-[#2b6a4f] transition hover:gap-3 hover:text-[#245a43] dark:text-emerald-300 dark:hover:text-emerald-200">
        Lihat prediksi lengkap
        <ArrowRight size={16} />
      </button>
    </section>
  );
}

export default PredictionCard;
