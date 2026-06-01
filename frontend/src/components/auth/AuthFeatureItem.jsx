function AuthFeatureItem({ icon, title }) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/10 px-6 py-5 backdrop-blur-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">{icon}</div>

      <p className="text-base font-semibold text-white/90">{title}</p>
    </div>
  );
}

export default AuthFeatureItem;
