import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

function InsightCard({ insight }) {
  const navigate = useNavigate();

  const text = insight || "Analisis belum tersedia sampai beberapa check-in terkumpul.";

  return (
    <section className="rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-6 flex items-center gap-3">
        <Zap size={20} className="text-[#2b6a4f] dark:text-emerald-300" />

        <h2 className="text-lg font-medium text-[#1f3f31] dark:text-white">AI Insight</h2>
      </div>

      <p className="text-sm leading-7 text-[#1f3f31] dark:text-slate-300">{text}</p>

      <button type="button" onClick={() => navigate("/prediction")} className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-[#2b6a4f] transition hover:gap-3 hover:text-[#245a43] dark:text-emerald-300 dark:hover:text-emerald-200">
        Lihat prediksi lengkap
        <ArrowRight size={16} />
      </button>
    </section>
  );
}

export default InsightCard;
