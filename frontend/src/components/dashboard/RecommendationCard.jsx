import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { recommendations } from "../../data/dashboardData";

function RecommendationCard() {
  const navigate = useNavigate();

  return (
    <section className="rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-lg font-medium text-[#1f3f31] dark:text-white">Rekomendasi Singkat</h2>

      <p className="mt-3 text-sm text-[#60766b] dark:text-slate-300">Saran personal untuk menjaga keseimbangan Anda.</p>

      <div className="mt-6 space-y-4">
        {recommendations.map((item) => (
          <div key={item} className="flex items-center gap-3">
            <CheckCircle2 size={19} className="shrink-0 text-[#19c58f] dark:text-emerald-300" />

            <p className="text-sm text-[#1f3f31] dark:text-slate-300">{item}</p>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => navigate("/recommendation")} className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-[#2b6a4f] transition hover:gap-3 hover:text-[#245a43] dark:text-emerald-300 dark:hover:text-emerald-200">
        Lihat rekomendasi lengkap
        <ArrowRight size={16} />
      </button>
    </section>
  );
}

export default RecommendationCard;
