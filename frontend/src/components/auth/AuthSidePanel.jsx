import { Activity, ShieldCheck, Zap } from "lucide-react";
import AuthFeatureItem from "./AuthFeatureItem";

function AuthSidePanel({ title = "Selamat datang kembali!", subtitle = "Lanjutkan perjalanan kesehatan mentalmu bersama kami.", features }) {
  const defaultFeatures = [
    {
      icon: <ShieldCheck size={24} />,
      title: "Login aman & terenkripsi",
    },
    {
      icon: <Activity size={24} />,
      title: "Akses semua riwayat mood",
    },
    {
      icon: <Zap size={24} />,
      title: "Lanjutkan analisis AI",
    },
  ];

  const displayedFeatures = features || defaultFeatures;

  return (
    <aside className="hidden min-h-screen bg-[#2b6a4f] px-12 py-14 text-white lg:flex lg:flex-col xl:px-20">
      <h1 className="text-2xl font-bold tracking-tight">Mood Sense</h1>

      <div className="mt-24 xl:mt-28">
        <h2 className="max-w-md text-5xl font-medium leading-tight tracking-tight xl:text-6xl">{title}</h2>

        <p className="mt-8 max-w-sm text-lg leading-8 text-white/65">{subtitle}</p>
      </div>

      <div className="mt-20 space-y-5">
        {displayedFeatures.map((feature) => (
          <AuthFeatureItem key={feature.title} icon={feature.icon} title={feature.title} />
        ))}
      </div>

      <p className="mt-auto text-sm text-white/50">© 2026 Mood Sense</p>
    </aside>
  );
}

export default AuthSidePanel;
