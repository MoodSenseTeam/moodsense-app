import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthSidePanel from "../components/auth/AuthSidePanel";
import AuthInput from "../components/auth/AuthInput";
import { useAuth } from "../contexts/useAuth";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();

  const redirectPath = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectPath]);

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      navigate(redirectPath, { replace: true });
    } catch (error) {
      setSubmitError(error.message || "Gagal masuk. Periksa kembali email dan password.");
    } finally {
      setIsSubmitting(false);
    }
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
              {submitError ? <p className="-mt-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p> : null}

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
                disabled={isSubmitting}
                className="mt-9 flex h-16 w-full items-center justify-center gap-4 rounded-2xl bg-[#2b6a4f] px-6 text-base font-bold text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-[#245a43] disabled:cursor-not-allowed disabled:opacity-70 sm:h-18 sm:text-lg"
              >
                {isSubmitting ? "Memproses..." : "Masuk ke Mood Sense"}
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
