import { ArrowLeft, Construction, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const routeMeta = {
  "/prediction": {
    title: "Prediksi Mood",
    description:
      "Halaman prediksi mood masih dalam tahap pengembangan. Untuk saat ini, data prediksi utama tetap dirangkum di dashboard.",
    accent: "#f59e0b",
  },
  "/recommendation": {
    title: "Rekomendasi",
    description:
      "Halaman rekomendasi personal sedang dibangun. Sementara itu, rekomendasi singkat sudah tersedia di dashboard.",
    accent: "#19c58f",
  },
  "/history": {
    title: "Riwayat",
    description:
      "Halaman riwayat aktivitas dan check-in masih dalam proses pengembangan. Data terbaru tetap bisa dilihat di dashboard.",
    accent: "#2b6a4f",
  },
  "/settings": {
    title: "Pengaturan",
    description:
      "Halaman pengaturan akun dan preferensi masih dalam tahap pembangunan. Fitur lengkapnya akan hadir berikutnya.",
    accent: "#60766b",
  },
  "/settings/profile": {
    title: "Pengaturan Profil",
    description:
      "Halaman pengaturan profil masih dalam tahap pengembangan. Silakan kembali lagi nanti untuk pembaruan akun.",
    accent: "#60766b",
  },
};

function ConstructionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const meta = routeMeta[location.pathname] || routeMeta["/settings"];

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl rounded-[2rem] border border-[#e2e8e4] bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e2e8e4] bg-[#f8faf9] px-4 py-2 text-sm font-medium text-[#60766b] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Construction size={16} />
              Sedang dalam tahap pengembangan
            </div>

            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-[#1f3f31] dark:text-white md:text-5xl">{meta.title}</h1>

            <p className="mt-4 max-w-2xl text-base leading-8 text-[#375446] dark:text-slate-300 md:text-lg">{meta.description}</p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#2b6a4f] px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-[#245a43]"
              >
                <ArrowLeft size={18} />
                Kembali
              </button>

              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[#dfe5e1] bg-white px-6 py-4 text-sm font-semibold text-[#1f3f31] transition hover:border-[#2b6a4f] hover:bg-[#f7faf8] dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-emerald-400 dark:hover:bg-slate-800"
              >
                <Sparkles size={18} />
                Ke Dashboard
              </Link>
            </div>

            <p className="mt-6 text-sm text-[#60766b] dark:text-slate-400">
              Kamu tetap bisa melihat ringkasan utama dari dashboard atau melakukan check-in harian lewat tracker.
            </p>
          </div>

          <div className="rounded-[1.75rem] bg-gradient-to-br from-[#edf8f2] via-[#f8faf9] to-[#fff7ea] p-6 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-800">
            <div className="flex h-full min-h-[320px] flex-col justify-between rounded-[1.5rem] border border-dashed border-[#dfe5e1] bg-white/80 p-6 dark:border-slate-700 dark:bg-slate-950/70">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#60766b] dark:text-slate-400">Preview</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: meta.accent }} />
                  <p className="text-sm font-semibold text-[#1f3f31] dark:text-white">Halaman ini akan hadir segera</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard label="Status" value="In construction" />
                <InfoCard label="Akses" value="Belum tersedia penuh" />
                <InfoCard label="Tujuan" value="Fitur lengkap nanti" />
                <InfoCard label="Data" value="Masih dipusatkan di dashboard" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#e2e8e4] bg-[#f8faf9] p-4 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs uppercase tracking-[0.24em] text-[#60766b] dark:text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#1f3f31] dark:text-white">{value}</p>
    </div>
  );
}

export default ConstructionPage;