import Button from "../ui/Button";

function CTASection() {
  return (
    <section id="mulai" className="mx-auto max-w-7xl px-6 pb-28 lg:px-8">
      <div className="cta-shadow rounded-[42px] bg-[#2b6a4f] px-8 py-20 text-center md:px-16">
        <h2 className="mx-auto max-w-3xl text-4xl font-medium leading-tight tracking-[0.08em] text-white md:text-5xl">Mulai perjalanan kesehatan mentalmu hari ini</h2>

        <p className="mt-8 text-base text-white/70">Gratis selamanya • Tanpa iklan • Aman & Privat</p>

        <div className="mt-10">
          <Button to="/register" variant="secondary" className="px-10 py-5 text-base">
            Daftar Gratis Sekarang
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
