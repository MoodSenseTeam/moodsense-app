import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Eye, EyeOff, User, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthSidePanel from "../components/auth/AuthSidePanel";
import RegisterSteps from "../components/auth/RegisterSteps";

function RegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const birthDateRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "P",
    birthDate: "",
    goals: ["Kurangi Stres"],
    agreeTerms: true,
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleGoalToggle(goal) {
    setFormData((prevData) => {
      const isSelected = prevData.goals.includes(goal);

      return {
        ...prevData,
        goals: isSelected ? prevData.goals.filter((item) => item !== goal) : [...prevData.goals, goal],
      };
    });
  }

  function handleNextStep(event) {
    event.preventDefault();
    setStep(2);
  }

  function handlePrevStep() {
    setStep(1);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Data register:", formData);
    navigate("/dashboard");
  }

  return (
    <section className="min-h-screen bg-white text-[#1f3f31]">
      <div className="grid min-h-screen lg:grid-cols-[45%_55%]">
        <AuthSidePanel title="Buat akunmu Sekarang!" subtitle="Hanya 2 langkah sebelum memulai" />

        <main className="flex min-h-screen items-start justify-center px-6 py-8 sm:px-10 lg:px-20 lg:py-14 xl:px-28">
          <div className="w-full max-w-155">
            <div className="mb-12 flex items-center justify-between">
              {step === 1 ? (
                <Link to="/" className="inline-flex items-center gap-3 text-sm font-medium text-[#1f3f31] transition hover:text-[#2b6a4f] sm:text-base">
                  <ArrowLeft size={19} />
                  Kembali
                </Link>
              ) : (
                <button type="button" onClick={handlePrevStep} className="inline-flex items-center gap-3 text-sm font-medium text-[#1f3f31] transition hover:text-[#2b6a4f] sm:text-base">
                  <ArrowLeft size={19} />
                  Langkah sebelumnya
                </button>
              )}

              <div className="flex items-center gap-2 text-sm text-[#1f3f31] sm:text-base">
                <span className="hidden sm:inline">Sudah punya akun?</span>
                <Link to="/login" className="font-semibold text-[#2b6a4f]">
                  Masuk
                </Link>
              </div>
            </div>

            <RegisterSteps currentStep={step} />

            {step === 1 ? (
              <form onSubmit={handleNextStep}>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-[#1f3f31] sm:text-4xl">Buat akunmu</h1>

                  <p className="mt-4 text-base leading-7 text-[#375446] sm:text-lg">Langkah 1 dari 2 — data dasar.</p>
                </div>

                <div className="mt-10">
                  <button type="button" className="flex h-14 w-full items-center justify-center gap-4 rounded-2xl border border-[#dfe5e1] bg-white text-sm font-semibold text-[#1f3f31] shadow-sm transition hover:bg-[#f7faf8] sm:h-16 sm:text-base">
                    <span className="text-xl font-bold text-blue-500 sm:text-2xl">G</span>
                    Daftar dengan Google
                  </button>

                  <div className="my-8 flex items-center gap-5 md:my-10">
                    <div className="h-px flex-1 bg-[#dfe5e1]" />
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#60766b]">atau</span>
                    <div className="h-px flex-1 bg-[#dfe5e1]" />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium text-[#1f3f31]">
                        Nama
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Contoh: Budi"
                        className="mt-2 h-14 w-full rounded-2xl border border-[#dfe5e1] bg-white px-5 text-base text-[#1f3f31] outline-none transition placeholder:text-[#7f8f86] focus:border-[#2b6a4f] sm:h-16 sm:px-6"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="text-sm font-medium text-[#1f3f31]">
                        Email
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="nama@email.com"
                        className="mt-2 h-14 w-full rounded-2xl border border-[#dfe5e1] bg-white px-5 text-base text-[#1f3f31] outline-none transition placeholder:text-[#7f8f86] focus:border-[#2b6a4f] sm:h-16 sm:px-6"
                      />
                    </div>

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
                          placeholder="Min. 8 karakter"
                          className="h-14 w-full rounded-2xl border border-[#dfe5e1] bg-white px-5 pr-16 text-base text-[#1f3f31] outline-none transition placeholder:text-[#7f8f86] focus:border-[#2b6a4f] sm:h-16 sm:px-6"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1f3f31]"
                          aria-label="Tampilkan password"
                        >
                          {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="flex flex-1 gap-2">
                          <span className="h-1.5 w-14 rounded-full bg-[#19c58f]" />
                          <span className="h-1.5 w-14 rounded-full bg-[#19c58f]" />
                          <span className="h-1.5 w-14 rounded-full bg-[#dfe5e1]" />
                        </div>

                        <span className="text-sm font-medium text-[#f59e0b]">Cukup</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-12 flex h-16 w-full items-center justify-center gap-4 rounded-2xl bg-[#2b6a4f] px-6 text-base font-bold text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-[#245a43] sm:h-18 sm:text-lg"
                  >
                    Lanjut ke Langkah 2
                    <ArrowRight size={22} />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-[#1f3f31] sm:text-4xl">Lengkapi profilmu</h1>

                  <p className="mt-4 text-base leading-7 text-[#375446] sm:text-lg">Langkah 2 dari 2 Preferensi</p>
                </div>

                <div className="mt-10 space-y-8">
                  <div>
                    <p className="text-sm font-medium text-[#1f3f31]">Jenis Kelamin</p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                      <GenderCard
                        label="L"
                        value="L"
                        selectedValue={formData.gender}
                        onSelect={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            gender: value,
                          }))
                        }
                        icon={<User size={24} />}
                      />

                      <GenderCard
                        label="P"
                        value="P"
                        selectedValue={formData.gender}
                        onSelect={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            gender: value,
                          }))
                        }
                        icon={<User size={24} />}
                      />

                      <GenderCard
                        label="Lain"
                        value="Lain"
                        selectedValue={formData.gender}
                        onSelect={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            gender: value,
                          }))
                        }
                        icon={<Users size={24} />}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="birthDate" className="text-sm font-medium text-[#1f3f31]">
                      Tgl. Lahir (opsional)
                    </label>

                    <div className="relative">
                      <input
                        ref={birthDateRef}
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="mt-2 h-14 w-full rounded-2xl border border-[#dfe5e1] bg-white px-5 pr-14 text-base text-[#1f3f31] outline-none transition focus:border-[#2b6a4f] sm:h-16 sm:px-6"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          if (birthDateRef.current?.showPicker) {
                            birthDateRef.current.showPicker();
                          } else {
                            birthDateRef.current?.focus();
                          }
                        }}
                        className="absolute right-5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8fa098]"
                        aria-label="Pilih tanggal lahir"
                      >
                        <CalendarDays size={21} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#1f3f31]">Tujuan Utama</p>

                    <div className="mt-5 flex flex-wrap gap-4">
                      {["Kurangi Stres", "Tidur Lebih Baik", "Kecemasan", "Produktivitas"].map((goal) => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => handleGoalToggle(goal)}
                          className={`rounded-full border px-7 py-3 text-sm font-medium transition ${
                            formData.goals.includes(goal) ? "border-[#2b6a4f] bg-[#2b6a4f] text-white shadow-lg shadow-green-900/10" : "border-[#dfe5e1] bg-white text-[#1f3f31] hover:border-[#2b6a4f]"
                          }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 text-sm text-[#1f3f31] sm:text-base">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(event) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          agreeTerms: event.target.checked,
                        }))
                      }
                      className="h-5 w-5 rounded border-[#9ca9a1] accent-[#2b6a4f]"
                    />
                    Saya menyetujui Syarat & Ketentuan
                  </label>

                  <button
                    type="submit"
                    className="flex h-16 w-full items-center justify-center gap-4 rounded-2xl bg-[#2b6a4f] px-6 text-base font-bold text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-[#245a43] sm:h-18 sm:text-lg"
                  >
                    Selesai & Masuk ke Dashboard
                    <ArrowRight size={22} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </section>
  );
}

function GenderCard({ label, value, selectedValue, onSelect, icon }) {
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`flex h-36 flex-col items-center justify-center rounded-2xl border transition ${isSelected ? "border-[#2b6a4f] bg-[#eef8f3] text-[#19c58f]" : "border-[#dfe5e1] bg-white text-[#91a098] hover:border-[#2b6a4f]"}`}
    >
      <div className={`flex h-14 w-14 items-center justify-center rounded-full ${isSelected ? "bg-[#d9f7ea]" : "bg-[#f6f8f7]"}`}>{icon}</div>

      <span className={`mt-4 text-base font-medium ${isSelected ? "text-[#19c58f]" : "text-[#1f3f31]"}`}>{label}</span>
    </button>
  );
}

export default RegisterPage;
