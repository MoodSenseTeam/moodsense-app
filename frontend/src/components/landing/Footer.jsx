function Footer() {
  return (
    <footer className="bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row lg:px-8">
        <a href="/" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2b6a4f] text-sm font-bold text-white">M</span>

          <span className="text-lg font-medium text-[#2b6a4f]">Mood Sense</span>
        </a>

        <p className="text-center text-sm text-[#60766b]">© 2026 Mood Sense. Dibuat untuk keseimbangan hidup Anda.</p>

        <div className="flex items-center gap-5 text-sm font-semibold text-[#2b6a4f]">
          <a href="#" className="transition hover:opacity-70">
            IG
          </a>
          <a href="#" className="transition hover:opacity-70">
            TW
          </a>
          <a href="#" className="transition hover:opacity-70">
            IN
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
