import { Activity, Sparkles, Zap } from "lucide-react";
import Button from "../ui/Button";

function HeroSection() {
  return (
    <section id="tentang" className="mx-auto max-w-7xl px-6 pb-28 pt-14 lg:px-8">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-[#e3f0e9] px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#235f46]">
            <Zap size={14} />
            ML-Powered Mental Health
          </div>

          <h1 className="max-w-xl text-5xl font-bold leading-[1.12] tracking-tight text-[#2b6a4f] md:text-6xl lg:text-7xl">Jaga Kesehatan Mentalmu dengan AI</h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-[#375446]">Prediksi mood, tracker harian, dan rekomendasi personal berbasis machine learning untuk membantu Anda mencapai keseimbangan mental setiap hari.</p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Button to="/register">Mulai Gratis</Button>
            <Button to="/login" variant="secondary">
              Masuk
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-140">
          <div className="hero-shadow relative rounded-[28px] bg-white p-8">
            <p className="text-xl font-medium text-[#284537]">Mood Hari Ini</p>

            <div className="mt-8">
              <h3 className="text-2xl font-medium text-[#284537]">Kondisi Baik</h3>
              <p className="mt-1 text-sm text-[#6c7f75]">Peningkatan 12% dari kemarin</p>
            </div>

            <div className="mt-9 rounded-3xl bg-[#e9eef1] p-8">
              <div className="rounded-[28px] bg-[#f9fbfa] p-7 soft-card-shadow">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#4b5d54]">Mood Tracker</h4>
                      <span className="h-3 w-3 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-xs text-[#9aa8a0]">Last 7 Days</p>
                  </div>

                  <span className="text-lg text-[#9aa8a0]">...</span>
                </div>

                <div className="grid grid-cols-[90px_1fr] gap-4">
                  <div className="space-y-4 text-xs text-[#96a69e]">
                    <p>😊 Happy</p>
                    <p>😐 Neutral</p>
                    <p>😔 Sad</p>
                  </div>

                  <div className="relative h-40 overflow-hidden">
                    <svg viewBox="0 0 360 160" className="h-full w-full" fill="none">
                      <path d="M0 120 C60 105 75 70 130 68 C190 66 190 105 245 95 C305 85 315 35 360 28" stroke="#36c495" strokeWidth="4" fill="none" />
                      <path d="M0 120 C60 105 75 70 130 68 C190 66 190 105 245 95 C305 85 315 35 360 28 L360 160 L0 160 Z" fill="#36c495" opacity="0.08" />
                    </svg>

                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-[#9aa8a0]">
                      <span>Mon</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 text-center text-xs font-semibold text-[#718379]">
                <p>RAB</p>
                <p>KAM</p>
              </div>
            </div>
          </div>

          <div className="absolute -right-5 top-10 rounded-xl bg-white px-5 py-4 soft-card-shadow md:-right-8">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eeeaff]">
                <Activity size={22} className="text-[#9b8cff]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-[#506459]">Mood Tracker</p>
                <p className="text-sm font-semibold text-[#1f3f31]">Stabil</p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-7 -left-8 rounded-2xl bg-white p-5 soft-card-shadow">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff3e4]">
                <Sparkles size={18} className="text-[#f5a84b]" />
              </div>
              <p className="text-sm font-bold text-[#60766b]">Rekomendasi</p>
            </div>
            <p className="max-w-47.5 text-sm leading-6 text-[#60766b]">Coba meditasi 5 menit untuk menjaga fokus sore ini.</p>
          </div>

          <div className="absolute -right-10 bottom-14 rounded-2xl bg-[#2b6a4f] p-6 text-white shadow-2xl shadow-green-900/20">
            <p className="text-xs uppercase tracking-wide text-white/70">Prediksi AI</p>
            <p className="mt-1 max-w-35 text-lg leading-6">Mood akan membaik 15% besok</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
