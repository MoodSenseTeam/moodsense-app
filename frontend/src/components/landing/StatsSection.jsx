const stats = [
  {
    value: "10K+",
    label: "Pengguna Aktif",
  },
  {
    value: "84%",
    label: "Akurasi",
  },
  {
    value: "2min",
    label: "Waktu Check-In",
  },
  {
    value: "4.9★",
    label: "Rating Pengguna",
  },
];

function StatsSection() {
  return (
    <section className="bg-[#2b6a4f] py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 text-center md:grid-cols-4 lg:px-8">
        {stats.map((item) => (
          <div key={item.label}>
            <h3 className="text-4xl font-medium text-white">{item.value}</h3>
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-white/55">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsSection;
