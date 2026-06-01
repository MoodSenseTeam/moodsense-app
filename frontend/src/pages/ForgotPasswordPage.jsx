import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import AuthSidePanel from "../components/auth/AuthSidePanel";
import AuthInput from "../components/auth/AuthInput";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleChange(event) {
    setEmail(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) return;

    console.log("Email reset password:", email);
    setIsSubmitted(true);
  }

  return (
    <section className="min-h-screen bg-white text-[#1f3f31]">
      <div className="grid min-h-screen lg:grid-cols-[45%_55%]">
        <AuthSidePanel
          title={
            <>
              Pulihkan akses
              <br />
              akunmu
            </>
          }
          subtitle="Masukkan email yang terhubung dengan akun Mood Sense. Kami akan membantu kamu mengatur ulang password dengan aman."
          features={[
            {
              icon: <Mail size={24} />,
              title: "Link reset dikirim ke email",
            },
            {
              icon: <ShieldCheck size={24} />,
              title: "Proses aman dan terenkripsi",
            },
            {
              icon: <CheckCircle2 size={24} />,
              title: "Gunakan password baru untuk login",
            },
          ]}
        />

        <main className="flex min-h-screen items-start justify-center px-6 py-8 pt-15 sm:px-10 lg:px-20 lg:pt-20 xl:px-28">
          <div className="w-full max-w-155">
            <div className="mb-12 flex items-center justify-between gap-4 md:mb-16">
              <Link to="/login" className="inline-flex items-center gap-3 text-sm font-medium text-[#1f3f31] transition hover:text-[#2b6a4f] sm:text-base">
                <ArrowLeft size={19} />
                Kembali
              </Link>

              <div className="flex items-center gap-2 text-sm text-[#1f3f31] sm:text-base">
                <span className="hidden sm:inline">Ingat password?</span>
                <Link to="/login" className="font-semibold text-[#2b6a4f]">
                  Masuk
                </Link>
              </div>
            </div>

            {!isSubmitted ? <ForgotPasswordForm email={email} onChange={handleChange} onSubmit={handleSubmit} /> : <SuccessMessage email={email} />}
          </div>
        </main>
      </div>
    </section>
  );
}

function ForgotPasswordForm({ email, onChange, onSubmit }) {
  return (
    <>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1f3f31] sm:text-4xl">Lupa password?</h1>

        <p className="mt-4 text-base leading-7 text-[#375446] sm:text-lg">Masukkan email akunmu untuk mendapatkan instruksi reset password.</p>
      </div>

      <form onSubmit={onSubmit} className="mt-10 md:mt-12">
        <button type="button" className="flex h-14 w-full items-center justify-center gap-4 rounded-2xl border border-[#dfe5e1] bg-white text-sm font-semibold text-[#1f3f31] transition hover:bg-[#f7faf8] sm:h-16 sm:text-base">
          <span className="text-xl font-bold text-blue-500 sm:text-2xl">G</span>
          Pulihkan dengan Google
        </button>

        <div className="my-8 flex items-center gap-5 md:my-10">
          <div className="h-px flex-1 bg-[#dfe5e1]" />
          <span className="text-sm font-medium text-[#60766b]">atau</span>
          <div className="h-px flex-1 bg-[#dfe5e1]" />
        </div>

        <AuthInput id="email" name="email" label="Email" type="email" placeholder="nama@email.com" value={email} onChange={onChange} />

        <button
          type="submit"
          className="mt-9 flex h-16 w-full items-center justify-center gap-4 rounded-2xl bg-[#2b6a4f] px-6 text-base font-bold text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-[#245a43] sm:h-18 sm:text-lg"
        >
          Kirim Link Reset
          <ArrowRight size={22} />
        </button>
      </form>
    </>
  );
}

function SuccessMessage({ email }) {
  return (
    <div>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d8f5e6] text-[#2b6a4f]">
        <CheckCircle2 size={34} />
      </div>

      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-[#1f3f31] sm:text-4xl">Cek email kamu</h1>

      <p className="mt-4 text-base leading-7 text-[#375446] sm:text-lg">
        Jika email <span className="font-semibold text-[#1f3f31]">{email}</span> terdaftar, kami akan mengirimkan instruksi untuk mengatur ulang password.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link to="/login" className="flex h-14 items-center justify-center rounded-2xl bg-[#2b6a4f] px-7 text-sm font-bold text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-[#245a43] sm:h-16 sm:text-base">
          Kembali ke Login
        </Link>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex h-14 items-center justify-center rounded-2xl border border-[#dfe5e1] bg-white px-7 text-sm font-semibold text-[#1f3f31] transition hover:bg-[#f7faf8] sm:h-16 sm:text-base"
        >
          Kirim Ulang
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
