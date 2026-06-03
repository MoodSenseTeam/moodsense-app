function Footer() {
  return (
    <footer className="bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 lg:px-8">
        <div className="text-center text-sm text-[#60766b]">
          <div className="flex items-center justify-center gap-4">
            <img src="/dbs-program.png" alt="DBS Foundation Coding Camp" className="h-6 w-auto" />
            <img src="/dbs.webp" alt="DBS Foundation" className="h-6 w-auto" />
            <img src="/dicoding.png" alt="Dicoding" className="h-6 w-auto" />
          </div>

          <p className="mt-4">Mood Sense adalah proyek akhir <strong>Coding Camp</strong> yang didukung oleh <strong>DBS Foundation</strong>, dengan <strong>Dicoding</strong> sebagai platform pembelajaran.</p>
          <p className="mt-2 text-xs text-[#8aa397] italic">Catatan: Aplikasi ini bukan alat diagnosis medis profesional. Untuk masalah kesehatan mental serius, silakan konsultasikan dengan tenaga profesional.</p>
          <p className="mt-1">© 2026 MoodSenseTeam. Seluruh hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
