import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthSidePanel from "../components/auth/AuthSidePanel";
import AuthInput from "../components/auth/AuthInput";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "password",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Data login:", formData);
    navigate("/dashboard");
  }

  return (
    <section className="min-h-screen bg-white text-[#1f3f31]">
      <div className="grid min-h-screen lg:grid-cols-[45%_55%]">
        <AuthSidePanel />

        <main className="flex min-h-screen items-center justify-center px-6 py-8 sm:px-10 lg:px-20 xl:px-28">
          <div className="w-full max-w-155">
            <div className="mb-12 flex items-center justify-between gap-4 md:mb-16">
              <Link to="/" className="inline-flex items-center gap-3 text-sm font-medium text-[#1f3f31] transition hover:text-[#2b6a4f] sm:text-base">
                <ArrowLeft size={19} />
                Kembali
              </Link>

              <div className="flex items-center gap-2 text-sm text-[#1f3f31] sm:text-base">
                <span className="hidden sm:inline">Belum punya akun?</span>
                <Link to="/register" className="font-semibold text-[#2b6a4f]">
                  Daftar
                </Link>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#1f3f31] sm:text-4xl">Login ke akunmu</h1>

              <p className="mt-4 text-base leading-7 text-[#375446] sm:text-lg">Masukkan email & password kamu untuk melanjutkan.</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 md:mt-12">
              <button type="button" className="flex h-14 w-full items-center justify-center gap-4 rounded-2xl border border-[#dfe5e1] bg-white text-sm font-semibold text-[#1f3f31] transition hover:bg-[#f7faf8] sm:h-16 sm:text-base">
                <span className="text-xl font-bold text-blue-500 sm:text-2xl">G</span>
                Masuk dengan Google
              </button>

              <div className="my-8 flex items-center gap-5 md:my-10">
                <div className="h-px flex-1 bg-[#dfe5e1]" />
                <span className="text-sm font-medium text-[#60766b]">atau</span>
                <div className="h-px flex-1 bg-[#dfe5e1]" />
              </div>

              <div className="space-y-6">
                <AuthInput id="email" name="email" label="Email" type="email" placeholder="nama@email.com" value={formData.email} onChange={handleChange} />

                <div>
                  <label htmlFor="password" className="text-sm font-medium text-[#1f3f31]">
                    Password
                  </label>

                  <div className="relative mt-2">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Masukkan password"
                      className="h-14 w-full rounded-2xl border border-[#2b6a4f] bg-white px-5 pr-14 text-base text-[#1f3f31] outline-none transition placeholder:text-[#7f8f86] sm:h-16 sm:px-6"
                    />

                    <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#1f3f31]" aria-label="Tampilkan password">
                      {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-[#1f3f31] sm:text-base">
                  <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="h-5 w-5 rounded border-[#9ca9a1] accent-[#2b6a4f]" />
                  Ingat saya
                </label>

                <Link to="/forgot-password" className="font-medium text-[#2b6a4f] hover:underline">
                  Lupa password?
                </Link>
              </div>

              <button
                type="submit"
                className="mt-9 flex h-16 w-full items-center justify-center gap-4 rounded-2xl bg-[#2b6a4f] px-6 text-base font-bold text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-[#245a43] sm:h-18 sm:text-lg"
              >
                Masuk ke Mood Sense
                <ArrowRight size={22} />
              </button>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}

export default LoginPage;
