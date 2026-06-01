function RegisterSteps({ currentStep }) {
  return (
    <div className="mb-12 flex items-center gap-4">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold shadow-lg transition ${currentStep >= 1 ? "bg-[#2b6a4f] text-white shadow-green-900/20" : "bg-[#f3f5f4] text-[#1f3f31]"}`}>1</div>

        <span className="whitespace-nowrap text-base font-semibold text-[#1f3f31]">Data Dasar</span>
      </div>

      <div className={`h-px flex-1 transition ${currentStep >= 2 ? "bg-[#2b6a4f]" : "bg-[#dfe5e1]"}`} />

      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold shadow-lg transition ${currentStep >= 2 ? "bg-[#2b6a4f] text-white shadow-green-900/20" : "bg-[#f3f5f4] text-[#1f3f31]"}`}>2</div>

        <span className="whitespace-nowrap text-base font-semibold text-[#1f3f31]">Preferensi</span>
      </div>
    </div>
  );
}

export default RegisterSteps;
