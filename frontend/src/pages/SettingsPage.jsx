import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { useApp } from "../contexts/AppContext";
import { fetchSettings, updateSettings, updateProfile, changePassword } from "../lib/settings";
import {
  User,
  Settings,
  Lock,
  CalendarDays,
  Eye,
  EyeOff,
  Check,
  Loader2,
  Sparkles,
  Bell,
  Sun,
  Moon,
  Globe,
  LockKeyhole
} from "lucide-react";

const t = {
  id: {
    title: "Pengaturan",
    subtitle: "Kelola profil, preferensi, dan keamanan akun Anda",
    tabProfile: "Profil",
    tabPreferences: "Preferensi",
    tabSecurity: "Keamanan",
    personalInfo: "Informasi Pribadi",
    name: "Nama Lengkap",
    gender: "Jenis Kelamin",
    male: "Laki-laki",
    female: "Perempuan",
    other: "Lainnya",
    birthDate: "Tanggal Lahir",
    goals: "Tujuan Utama Menggunakan MoodSense",
    saveProfile: "Simpan Profil",
    appPreferences: "Preferensi Aplikasi",
    theme: "Tema Tampilan",
    lightMode: "Terang",
    darkMode: "Gelap",
    language: "Bahasa",
    dailyReminder: "Pengingat Harian",
    reminderDesc: "Dapatkan pengingat harian untuk melakukan check-in mood Anda.",
    reminderTime: "Waktu Pengingat",
    savePreferences: "Simpan Preferensi",
    changePassword: "Ubah Password",
    currentPassword: "Password Sekarang",
    newPassword: "Password Baru",
    confirmPassword: "Konfirmasi Password Baru",
    savePassword: "Ubah Password",
    loading: "Memuat...",
    saving: "Menyimpan...",
    successProfile: "Profil berhasil diperbarui.",
    successPreferences: "Preferensi berhasil diperbarui.",
    successPassword: "Password berhasil diubah.",
    passwordsDoNotMatch: "Konfirmasi password baru tidak cocok.",
    passwordTooShort: "Password baru minimal 8 karakter.",
  },
  en: {
    title: "Settings",
    subtitle: "Manage your profile, preferences, and account security",
    tabProfile: "Profile",
    tabPreferences: "Preferences",
    tabSecurity: "Security",
    personalInfo: "Personal Information",
    name: "Full Name",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    birthDate: "Birth Date",
    goals: "Main Goals for Using MoodSense",
    saveProfile: "Save Profile",
    appPreferences: "App Preferences",
    theme: "Appearance Theme",
    lightMode: "Light",
    darkMode: "Dark",
    language: "Language",
    dailyReminder: "Daily Reminder",
    reminderDesc: "Receive daily reminders to check in your mood.",
    reminderTime: "Reminder Time",
    savePreferences: "Save Preferences",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm New Password",
    savePassword: "Change Password",
    loading: "Loading...",
    saving: "Saving...",
    successProfile: "Profile updated successfully.",
    successPreferences: "Preferences updated successfully.",
    successPassword: "Password changed successfully.",
    passwordsDoNotMatch: "New passwords do not match.",
    passwordTooShort: "New password must be at least 8 characters.",
  }
};

function formatDateForInput(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function SettingsPage() {
  const { user, accessToken, reloadSession } = useAuth();
  const { language: currentLang, setTheme, setLanguage } = useApp();
  const lang = t[currentLang] ? currentLang : "id";
  const translations = t[lang];

  const birthDateRef = useRef(null);

  // Tab State: 'profile' | 'preferences' | 'security'
  const [activeTab, setActiveTab] = useState("profile");

  // Loading settings state
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Success / Error Alerts for each section
  const [profileAlert, setProfileAlert] = useState(null);
  const [prefAlert, setPrefAlert] = useState(null);
  const [securityAlert, setSecurityAlert] = useState(null);

  // Loading buttons state
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPref, setSavingPref] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);

  // Form State - Profile
  const [profileForm, setProfileForm] = useState(() => {
    const initialGoals = user?.usage_reason
      ? user.usage_reason.split(", ").filter(Boolean)
      : [];
    return {
      name: user?.name || "",
      gender: user?.gender || "OTHER",
      birthDate: formatDateForInput(user?.tanggal_lahir),
      goals: initialGoals,
    };
  });

  // Form State - Preferences
  const [prefForm, setPrefForm] = useState({
    theme: "light",
    reminder_active: true,
    reminder_time: "20:00",
    language: "id",
  });

  // Form State - Security
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Initialize profile form from user context
  useEffect(() => {
    if (user) {
      const initialGoals = user.usage_reason
        ? user.usage_reason.split(", ").filter(Boolean)
        : [];

      Promise.resolve().then(() => {
        setProfileForm({
          name: user.name || "",
          gender: user.gender || "OTHER",
          birthDate: formatDateForInput(user.tanggal_lahir),
          goals: initialGoals,
        });
      });
    }
  }, [user]);

  // Load preferences from backend
  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      if (!accessToken) return;
      try {
        setLoadingSettings(true);
        const response = await fetchSettings(accessToken);
        if (isMounted && response?.data) {
          const { theme, reminder_active, reminder_time, language } = response.data;
          setPrefForm({
            theme: theme || "light",
            reminder_active: reminder_active ?? true,
            reminder_time: reminder_time || "20:00",
            language: language || "id",
          });
        }
      } catch (err) {
        console.error("Gagal memuat preferensi:", err);
      } finally {
        if (isMounted) {
          setLoadingSettings(false);
        }
      }
    }
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  // Handle Input Changes - Profile
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderSelect = (genderValue) => {
    setProfileForm((prev) => ({ ...prev, gender: genderValue }));
  };

  const handleGoalToggle = (goal) => {
    setProfileForm((prev) => {
      const isSelected = prev.goals.includes(goal);
      return {
        ...prev,
        goals: isSelected
          ? prev.goals.filter((g) => g !== goal)
          : [...prev.goals, goal],
      };
    });
  };

  // Handle Input Changes - Preferences
  const handlePrefChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrefForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const selectTheme = (themeValue) => {
    setPrefForm((prev) => ({ ...prev, theme: themeValue }));
    setTheme(themeValue); // apply theme instantly
  };

  const selectLanguage = (langValue) => {
    setPrefForm((prev) => ({ ...prev, language: langValue }));
    setLanguage(langValue); // apply language instantly
  };

  // Handle Input Changes - Security
  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Profile Section
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileAlert(null);
    setSavingProfile(true);

    try {
      await updateProfile(accessToken, {
        name: profileForm.name,
        gender: profileForm.gender,
        tanggal_lahir: profileForm.birthDate,
        usage_reason: profileForm.goals.join(", "),
      });
      await reloadSession();
      setProfileAlert({ type: "success", message: translations.successProfile });
    } catch (err) {
      setProfileAlert({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal menyimpan profil.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  // Submit Preferences Section
  const handlePrefSubmit = async (e) => {
    e.preventDefault();
    setPrefAlert(null);
    setSavingPref(true);

    try {
      await updateSettings(accessToken, {
        theme: prefForm.theme,
        reminder_active: prefForm.reminder_active,
        reminder_time: prefForm.reminder_time,
        language: prefForm.language,
      });
      // Sync to Contexts
      setTheme(prefForm.theme);
      setLanguage(prefForm.language);
      setPrefAlert({ type: "success", message: translations.successPreferences });
    } catch (err) {
      setPrefAlert({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal menyimpan preferensi.",
      });
    } finally {
      setSavingPref(false);
    }
  };

  // Submit Security Section
  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setSecurityAlert(null);

    const { currentPassword, newPassword, confirmPassword } = securityForm;

    if (newPassword.length < 8) {
      setSecurityAlert({ type: "error", message: translations.passwordTooShort });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityAlert({ type: "error", message: translations.passwordsDoNotMatch });
      return;
    }

    setSavingSecurity(true);

    try {
      await changePassword(accessToken, {
        currentPassword,
        newPassword,
      });
      setSecurityAlert({ type: "success", message: translations.successPassword });
      setSecurityForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setSecurityAlert({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal mengubah password.",
      });
    } finally {
      setSavingSecurity(false);
    }
  };

  const tabs = [
    { id: "profile", label: translations.tabProfile, icon: User },
    { id: "preferences", label: translations.tabPreferences, icon: Settings },
    { id: "security", label: translations.tabSecurity, icon: Lock },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <header className="mb-8 pl-14 lg:pl-0">
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#1f3f31] dark:text-white md:text-4xl">
          {translations.title}
        </h1>
        <p className="mt-2 text-sm text-[#60766b] dark:text-slate-400">
          {translations.subtitle}
        </p>
      </header>

      {/* Main Container */}
      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        {/* Navigation Tabs (Sidebar style on desktop, pill buttons on mobile) */}
        <aside className="flex flex-row overflow-x-auto pb-2 md:flex-col md:overflow-x-visible md:pb-0 gap-2 border-b border-[#e2e8e4] md:border-b-0 dark:border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setProfileAlert(null);
                  setPrefAlert(null);
                  setSecurityAlert(null);
                }}
                className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold transition shrink-0 ${
                  isActive
                    ? "bg-[#e8f3ed] text-[#2b6a4f] dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "text-[#60766b] hover:bg-[#f3f7f5] hover:text-[#2b6a4f] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-emerald-300"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Form Panel */}
        <div className="rounded-[2rem] border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
          {/* TAB 1: PROFILE */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit} className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-[#1f3f31] dark:text-white flex items-center gap-2">
                  <User className="text-[#2b6a4f] dark:text-emerald-400" size={22} />
                  {translations.personalInfo}
                </h2>
                <div className="mt-1 h-0.5 w-12 bg-gradient-to-r from-[#2b6a4f] to-emerald-400 rounded-full" />
              </div>

              {profileAlert && (
                <div
                  className={`rounded-2xl border px-5 py-4 text-sm font-medium transition-all ${
                    profileAlert.type === "success"
                      ? "border-[#c7f1dc] bg-[#edf8f2] text-[#2b6a4f] dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
                      : "border-red-200 bg-red-50 text-red-700 dark:border-red-950/50 dark:bg-red-950/20 dark:text-red-300"
                  }`}
                >
                  {profileAlert.message}
                </div>
              )}

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#1f3f31] dark:text-slate-300 mb-2">
                    {translations.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    required
                    className="h-14 w-full rounded-2xl border border-[#dfe5e1] bg-white px-5 text-base text-[#1f3f31] outline-none transition placeholder:text-[#7f8f86] focus:border-[#2b6a4f] dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400"
                  />
                </div>

                {/* Email (Read Only) */}
                <div>
                  <label className="block text-sm font-medium text-[#1f3f31] dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="h-14 w-full rounded-2xl border border-[#dfe5e1] bg-[#f8faf9] px-5 pr-12 text-base text-[#60766b] outline-none dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8fa098] dark:text-slate-500">
                      <LockKeyhole size={18} />
                    </div>
                  </div>
                </div>

                {/* Gender Picker */}
                <div>
                  <span className="block text-sm font-medium text-[#1f3f31] dark:text-slate-300 mb-3">
                    {translations.gender}
                  </span>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { value: "MALE", label: translations.male },
                      { value: "FEMALE", label: translations.female },
                      { value: "OTHER", label: translations.other },
                    ].map((opt) => {
                      const isSelected = profileForm.gender === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleGenderSelect(opt.value)}
                          className={`flex items-center justify-center gap-3 rounded-2xl border py-4 text-base font-medium transition ${
                            isSelected
                              ? "border-[#2b6a4f] bg-[#eef8f3] text-[#2b6a4f] dark:border-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-400"
                              : "border-[#dfe5e1] bg-white text-[#60766b] hover:border-[#2b6a4f] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-emerald-500"
                          }`}
                        >
                          {isSelected && <Check size={18} />}
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Birth Date */}
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-[#1f3f31] dark:text-slate-300 mb-2">
                    {translations.birthDate}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      ref={birthDateRef}
                      value={profileForm.birthDate}
                      onChange={handleProfileChange}
                      required
                      className="h-14 w-full rounded-2xl border border-[#dfe5e1] bg-white px-5 text-base text-[#1f3f31] outline-none transition dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400"
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
                      className="absolute right-5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#8fa098] dark:text-slate-400"
                      aria-label="Pilih tanggal lahir"
                    >
                      <CalendarDays size={20} />
                    </button>
                  </div>
                </div>

                {/* Goals */}
                <div>
                  <span className="block text-sm font-medium text-[#1f3f31] dark:text-slate-300 mb-3">
                    {translations.goals}
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "Kurangi Stres",
                      "Tidur Lebih Baik",
                      "Kecemasan",
                      "Produktivitas",
                    ].map((goal) => {
                      const isSelected = profileForm.goals.includes(goal);
                      return (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => handleGoalToggle(goal)}
                          className={`rounded-full border px-6 py-2.5 text-sm font-medium transition ${
                            isSelected
                              ? "border-[#2b6a4f] bg-[#2b6a4f] text-white dark:border-emerald-500 dark:bg-emerald-500"
                              : "border-[#dfe5e1] bg-white text-[#1f3f31] hover:border-[#2b6a4f] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-emerald-500"
                          }`}
                        >
                          {goal}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#2b6a4f] px-8 text-base font-semibold text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-0.5 hover:bg-[#245a43] disabled:opacity-75 disabled:hover:translate-y-0 cursor-pointer"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    {translations.saving}
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    {translations.saveProfile}
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: PREFERENCES */}
          {activeTab === "preferences" && (
            <form onSubmit={handlePrefSubmit} className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-[#1f3f31] dark:text-white flex items-center gap-2">
                  <Settings className="text-[#2b6a4f] dark:text-emerald-400" size={22} />
                  {translations.appPreferences}
                </h2>
                <div className="mt-1 h-0.5 w-12 bg-gradient-to-r from-[#2b6a4f] to-emerald-400 rounded-full" />
              </div>

              {loadingSettings ? (
                <div className="py-12 flex flex-col items-center justify-center text-[#60766b] dark:text-slate-400 gap-3">
                  <Loader2 className="animate-spin text-[#2b6a4f]" size={32} />
                  <p className="text-sm">{translations.loading}</p>
                </div>
              ) : (
                <>
                  {prefAlert && (
                    <div
                      className={`rounded-2xl border px-5 py-4 text-sm font-medium transition-all ${
                        prefAlert.type === "success"
                          ? "border-[#c7f1dc] bg-[#edf8f2] text-[#2b6a4f] dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
                          : "border-red-200 bg-red-50 text-red-700 dark:border-red-950/50 dark:bg-red-950/20 dark:text-red-300"
                      }`}
                    >
                      {prefAlert.message}
                    </div>
                  )}

                  <div className="space-y-8">
                    {/* Theme */}
                    <div>
                      <span className="block text-sm font-medium text-[#1f3f31] dark:text-slate-300 mb-4 flex items-center gap-2">
                        <Sun size={16} />
                        {translations.theme}
                      </span>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {[
                          {
                            value: "light",
                            label: translations.lightMode,
                            icon: Sun,
                            bg: "bg-amber-50 border-amber-200 text-amber-600 dark:bg-slate-900/20 dark:border-slate-800",
                            activeBg: "border-amber-400 bg-amber-50/50 text-amber-600 dark:bg-amber-950/20 dark:border-amber-500",
                          },
                          {
                            value: "dark",
                            label: translations.darkMode,
                            icon: Moon,
                            bg: "bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-slate-900/20 dark:border-slate-850",
                            activeBg: "border-indigo-500 bg-indigo-50/50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950/30 dark:text-indigo-300",
                          },
                        ].map((themeOpt) => {
                          const isSelected = prefForm.theme === themeOpt.value;
                          const ThemeIcon = themeOpt.icon;
                          return (
                            <button
                              key={themeOpt.value}
                              type="button"
                              onClick={() => selectTheme(themeOpt.value)}
                              className={`flex items-center gap-4 rounded-2xl border p-5 transition text-left cursor-pointer ${
                                isSelected ? themeOpt.activeBg : themeOpt.bg + " hover:border-slate-400 text-slate-500"
                              }`}
                            >
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                  isSelected
                                    ? "bg-white shadow-sm dark:bg-slate-900"
                                    : "bg-white/60 dark:bg-slate-950"
                                }`}
                              >
                                <ThemeIcon size={20} />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{themeOpt.label}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Language */}
                    <div>
                      <span className="block text-sm font-medium text-[#1f3f31] dark:text-slate-300 mb-4 flex items-center gap-2">
                        <Globe size={16} />
                        {translations.language}
                      </span>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {[
                          { value: "id", label: "Bahasa Indonesia" },
                          { value: "en", label: "English" },
                        ].map((langOpt) => {
                          const isSelected = prefForm.language === langOpt.value;
                          return (
                            <button
                              key={langOpt.value}
                              type="button"
                              onClick={() => selectLanguage(langOpt.value)}
                              className={`flex items-center justify-between rounded-2xl border p-4 font-semibold text-sm transition cursor-pointer ${
                                isSelected
                                  ? "border-[#2b6a4f] bg-[#eef8f3] text-[#2b6a4f] dark:border-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-400"
                                  : "border-[#dfe5e1] bg-white text-[#60766b] hover:border-[#2b6a4f] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-emerald-500"
                              }`}
                            >
                              {langOpt.label}
                              {isSelected && (
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d9f7ea] text-[#2b6a4f] dark:bg-emerald-950 dark:text-emerald-400">
                                  <Check size={14} />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Daily Reminder */}
                    <div className="border-t border-[#e2e8e4] pt-6 dark:border-slate-800 space-y-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-[#1f3f31] dark:text-white flex items-center gap-2">
                            <Bell size={16} className="text-[#2b6a4f] dark:text-emerald-400" />
                            {translations.dailyReminder}
                          </label>
                          <p className="text-xs text-[#60766b] dark:text-slate-400 max-w-md">
                            {translations.reminderDesc}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            name="reminder_active"
                            checked={prefForm.reminder_active}
                            onChange={handlePrefChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-[#2b6a4f] dark:peer-checked:bg-emerald-500" />
                        </label>
                      </div>

                      {prefForm.reminder_active && (
                        <div className="max-w-[200px] animate-fadeIn">
                          <label htmlFor="reminder_time" className="block text-xs font-semibold text-[#1f3f31] dark:text-slate-300 mb-2">
                            {translations.reminderTime}
                          </label>
                          <input
                            type="time"
                            id="reminder_time"
                            name="reminder_time"
                            value={prefForm.reminder_time}
                            onChange={handlePrefChange}
                            required
                            className="h-12 w-full rounded-xl border border-[#dfe5e1] bg-white px-4 text-base text-[#1f3f31] outline-none transition dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={savingPref}
                    className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#2b6a4f] px-8 text-base font-semibold text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-0.5 hover:bg-[#245a43] disabled:opacity-75 disabled:hover:translate-y-0 cursor-pointer"
                  >
                    {savingPref ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        {translations.saving}
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        {translations.savePreferences}
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          )}

          {/* TAB 3: SECURITY */}
          {activeTab === "security" && (
            <form onSubmit={handleSecuritySubmit} className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-[#1f3f31] dark:text-white flex items-center gap-2">
                  <Lock className="text-[#2b6a4f] dark:text-emerald-400" size={22} />
                  {translations.changePassword}
                </h2>
                <div className="mt-1 h-0.5 w-12 bg-gradient-to-r from-[#2b6a4f] to-emerald-400 rounded-full" />
              </div>

              {securityAlert && (
                <div
                  className={`rounded-2xl border px-5 py-4 text-sm font-medium transition-all ${
                    securityAlert.type === "success"
                      ? "border-[#c7f1dc] bg-[#edf8f2] text-[#2b6a4f] dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
                      : "border-red-200 bg-red-50 text-red-700 dark:border-red-950/50 dark:bg-red-950/20 dark:text-red-300"
                  }`}
                >
                  {securityAlert.message}
                </div>
              )}

              <div className="space-y-6">
                {/* Current Password */}
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-[#1f3f31] dark:text-slate-300 mb-2">
                    {translations.currentPassword}
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={securityForm.currentPassword}
                      onChange={handleSecurityChange}
                      required
                      placeholder="••••••••"
                      className="h-14 w-full rounded-2xl border border-[#dfe5e1] bg-white px-5 pr-14 text-base text-[#1f3f31] outline-none transition placeholder:text-[#7f8f86] focus:border-[#2b6a4f] dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass((p) => !p)}
                      className="absolute right-5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#8fa098] hover:text-[#2b6a4f] dark:text-slate-400 dark:hover:text-emerald-400"
                      aria-label="Toggle password visibility"
                    >
                      {showCurrentPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-[#1f3f31] dark:text-slate-300 mb-2">
                    {translations.newPassword}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={securityForm.newPassword}
                      onChange={handleSecurityChange}
                      required
                      placeholder="Min. 8 karakter"
                      className="h-14 w-full rounded-2xl border border-[#dfe5e1] bg-white px-5 pr-14 text-base text-[#1f3f31] outline-none transition placeholder:text-[#7f8f86] focus:border-[#2b6a4f] dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass((p) => !p)}
                      className="absolute right-5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#8fa098] hover:text-[#2b6a4f] dark:text-slate-400 dark:hover:text-emerald-400"
                      aria-label="Toggle password visibility"
                    >
                      {showNewPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1f3f31] dark:text-slate-300 mb-2">
                    {translations.confirmPassword}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={securityForm.confirmPassword}
                      onChange={handleSecurityChange}
                      required
                      placeholder="••••••••"
                      className="h-14 w-full rounded-2xl border border-[#dfe5e1] bg-white px-5 pr-14 text-base text-[#1f3f31] outline-none transition placeholder:text-[#7f8f86] focus:border-[#2b6a4f] dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass((p) => !p)}
                      className="absolute right-5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#8fa098] hover:text-[#2b6a4f] dark:text-slate-400 dark:hover:text-emerald-400"
                      aria-label="Toggle password visibility"
                    >
                      {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={savingSecurity}
                className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#2b6a4f] px-8 text-base font-semibold text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-0.5 hover:bg-[#245a43] disabled:opacity-75 disabled:hover:translate-y-0 cursor-pointer"
              >
                {savingSecurity ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    {translations.saving}
                  </>
                ) : (
                  <>
                    <LockKeyhole size={18} />
                    {translations.savePassword}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
