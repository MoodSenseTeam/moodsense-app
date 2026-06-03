import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

function RecommendationCard({ recommendations = [] }) {
  const navigate = useNavigate();
  const hasRecommendations = recommendations.length > 0 && typeof recommendations[0] === 'object';

  return (
    <section className="rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-lg font-medium text-[#1f3f31] dark:text-white">Rekomendasi Singkat</h2>

      <p className="mt-3 text-sm text-[#60766b] dark:text-slate-300">Saran personal untuk menjaga keseimbangan Anda.</p>

      <div className="mt-6 space-y-4">
        {hasRecommendations ? (
          recommendations.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/30 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#19c58f] dark:text-emerald-300" />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-[#1f3f31] dark:text-white">{item.name}</h4>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#edf8f2] text-[#2b6a4f] dark:bg-emerald-950/40 dark:text-emerald-300 shrink-0">
                    {item.duration}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#60766b] dark:text-slate-300/80 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-3">
            <CheckCircle2 size={19} className="shrink-0 text-[#19c58f] dark:text-emerald-300" />
            <p className="text-sm text-[#1f3f31] dark:text-slate-300">
              {recommendations[0] || "Tambahkan beberapa check-in untuk melihat rekomendasi yang lebih personal."}
            </p>
          </div>
        )}
      </div>

      <button type="button" onClick={() => navigate("/recommendation")} className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-[#2b6a4f] transition hover:gap-3 hover:text-[#245a43] dark:text-emerald-300 dark:hover:text-emerald-200">
        Lihat rekomendasi lengkap
        <ArrowRight size={16} />
      </button>
    </section>
  );
}

export default RecommendationCard;
