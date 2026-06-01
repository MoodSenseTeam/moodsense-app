import { BrainCircuit, Heart, ListChecks } from "lucide-react";

const features = [
  {
    title: "Prediksi AI",
    description: "Algoritma cerdas yang memprediksi pola mood Anda sebelum terjadi, memberikan peringatan dini untuk manajemen stres.",
    icon: BrainCircuit,
    iconBox: "bg-[#edf5f1]",
    iconColor: "text-[#2b6a4f]",
  },
  {
    title: "Mood Tracker",
    description: "Catat perasaan harian Anda dengan antarmuka yang intuitif dan lihat visualisasi data emosional Anda secara realtime.",
    icon: ListChecks,
    iconBox: "bg-[#f0edff]",
    iconColor: "text-[#9b8cff]",
  },
  {
    title: "Rekomendasi",
    description: "Dapatkan saran aktivitas, konten meditasi, dan tips kesehatan mental yang dipersonalisasi khusus untuk kondisi Anda saat ini.",
    icon: Heart,
    iconBox: "bg-[#fff3e4]",
    iconColor: "text-[#f5a84b]",
  },
];

function FeaturesSection() {
  return (
    <section id="fitur" className="mx-auto max-w-7xl px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-medium tracking-tight text-[#1f3f31]">Fitur Unggulan Mood Sense</h2>
        <p className="mt-5 text-lg leading-8 text-[#526b5e]">Teknologi canggih yang dirancang khusus untuk memahami dan mendukung kesehatan emosional Anda.</p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div key={feature.title} className="rounded-[28px] border border-[#e4e9e6] bg-white p-10 soft-card-shadow transition duration-300 hover:-translate-y-2">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${feature.iconBox}`}>
                <Icon size={30} className={feature.iconColor} />
              </div>

              <h3 className="mt-9 text-2xl font-medium text-[#1f3f31]">{feature.title}</h3>

              <p className="mt-5 text-base leading-8 text-[#375446]">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturesSection;
