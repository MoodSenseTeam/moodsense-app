function StatCard({ title, value, description, accent }) {
  return (
    <div className="rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm font-medium text-[#375446] dark:text-slate-300">{title}</p>

      <div className="mt-3 flex items-end gap-2">
        <h3 className="text-2xl font-medium text-[#1f3f31] dark:text-white">{value}</h3>

        {description && <span className={`text-sm font-medium ${accent || "text-[#60766b]"}`}>{description}</span>}
      </div>
    </div>
  );
}

export default StatCard;
