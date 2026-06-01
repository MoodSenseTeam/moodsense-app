import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";

function NotFoundPage() {
  const navigate = useNavigate();
  const { theme } = useApp();

  const isDark = theme === "dark";

  return (
    <section className={`flex min-h-screen items-center justify-center px-6 py-10 ${isDark ? "bg-slate-950 text-white" : "bg-[#f8faf9] text-[#1f3f31]"}`}>
      <div className="w-full max-w-3xl text-center">
        <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-3xl shadow-sm ${isDark ? "bg-emerald-950/50 text-emerald-300" : "bg-[#e8f3ed] text-[#2b6a4f]"}`}>
          <SearchX size={46} />
        </div>

        <p className={`mt-8 text-sm font-bold uppercase tracking-[0.35em] ${isDark ? "text-slate-400" : "text-[#60766b]"}`}>404 Page Not Found</p>

        <h1 className={`mt-5 text-4xl font-semibold tracking-tight md:text-6xl ${isDark ? "text-white" : "text-[#1f3f31]"}`}>Halaman tidak ditemukan</h1>

        <p className={`mx-auto mt-5 max-w-xl text-base leading-8 md:text-lg ${isDark ? "text-slate-300" : "text-[#60766b]"}`}>
          Maaf, halaman yang kamu cari tidak tersedia, mungkin sudah dipindahkan, dihapus, atau alamat URL yang dimasukkan kurang tepat.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/dashboard"
            className={`inline-flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-0.5 sm:w-auto ${
              isDark ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#2b6a4f] hover:bg-[#245a43]"
            }`}
          >
            <Home size={18} />
            Kembali ke Dashboard
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`inline-flex w-full items-center justify-center gap-3 rounded-2xl border px-8 py-4 text-sm font-semibold transition sm:w-auto ${
              isDark ? "border-slate-700 bg-slate-900 text-white hover:border-emerald-400 hover:bg-slate-800" : "border-[#dfe5e1] bg-white text-[#1f3f31] hover:border-[#2b6a4f] hover:bg-[#f7faf8]"
            }`}
          >
            <ArrowLeft size={18} />
            Kembali Sebelumnya
          </button>
        </div>

        <div className={`mt-12 rounded-3xl border p-6 text-left shadow-sm ${isDark ? "border-slate-700 bg-slate-900" : "border-[#e3e9e5] bg-white"}`}>
          <h2 className={`text-base font-semibold ${isDark ? "text-white" : "text-[#1f3f31]"}`}>Halaman yang tersedia:</h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <PageLink to="/dashboard" label="Dashboard" isDark={isDark} />
            <PageLink to="/tracker/mood-energy" label="Mood Tracker" isDark={isDark} />
            <PageLink to="/prediction" label="Prediksi Mood" isDark={isDark} />
            <PageLink to="/recommendation" label="Rekomendasi" isDark={isDark} />
            <PageLink to="/history" label="Riwayat" isDark={isDark} />
            <PageLink to="/settings" label="Pengaturan" isDark={isDark} />
          </div>
        </div>
      </div>
    </section>
  );
}

function PageLink({ to, label, isDark }) {
  return (
    <Link
      to={to}
      className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
        isDark ? "border-slate-700 bg-slate-800 text-slate-300 hover:border-emerald-400 hover:bg-slate-700 hover:text-emerald-300" : "border-[#e3e9e5] bg-[#fbfcfb] text-[#375446] hover:border-[#2b6a4f] hover:text-[#2b6a4f]"
      }`}
    >
      {label}
    </Link>
  );
}

export default NotFoundPage;
