import { useCallback, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { useAuth } from "../contexts/useAuth";
import { submitCheckin } from "../lib/checkin";

const trackerSteps = [
  {
    number: 1,
    label: "Mood & Energi",
    path: "/tracker/mood-energy",
  },
  {
    number: 2,
    label: "Faktor & Aktivitas",
    path: "/tracker/factors-activities",
  },
  {
    number: 3,
    label: "Catatan",
    path: "/tracker/note",
  },
];

const initialDraft = {
  sleep_hours: 7.5,
  activity_level: "MODERATE",
  study_hours: 4,
  social_score: 6,
  how_you_feeling: "HAPPY",
  notes: "",
};

function TrackerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [draft, setDraft] = useState(initialDraft);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const updateDraft = useCallback((patch) => {
    setDraft((current) => ({ ...current, ...patch }));
  }, []);

  const currentStep = trackerSteps.find((step) => step.path === location.pathname)?.number || 1;

  const outletContext = useMemo(
    () => ({
      draft,
      setDraft,
      updateDraft,
      isSubmitting,
      submitError,
      error: submitError,
      isSubmitted,
    }),
    [draft, isSubmitting, isSubmitted, submitError, updateDraft],
  );

  function handleBack() {
    if (currentStep === 1) {
      navigate("/dashboard");
    } else if (currentStep === 2) {
      navigate("/tracker/mood-energy");
    } else {
      navigate("/tracker/factors-activities");
    }
  }

  const handleNext = useCallback(() => {
    if (currentStep === 1) {
      navigate("/tracker/factors-activities");
    } else if (currentStep === 2) {
      navigate("/tracker/note");
    } else {
      return null;
    }
    return null;
  }, [currentStep, navigate]);

  const handleSubmit = useCallback(async () => {
    if (!accessToken || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await submitCheckin(accessToken, {
        sleep_hours: draft.sleep_hours,
        activity_level: draft.activity_level,
        study_hours: draft.study_hours,
        social_score: draft.social_score,
        how_you_feeling: draft.how_you_feeling,
        notes: draft.notes.trim() || undefined,
      });

      setIsSubmitted(true);
      navigate("/dashboard", {
        replace: true,
        state: { checkinSuccess: true },
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Gagal mengirim check-in.");
    } finally {
      setIsSubmitting(false);
    }
  }, [accessToken, draft, isSubmitting, navigate]);

  const handlePrimaryAction = useCallback(() => {
    if (currentStep === 3) {
      void handleSubmit();
      return;
    }

    handleNext();
  }, [currentStep, handleNext, handleSubmit]);

  return (
    <div className="mx-auto max-w-340">
      <header className="mb-8 pl-14 lg:pl-0">
        <h1 className="text-3xl font-medium tracking-tight text-[#1f3f31] dark:text-white md:text-4xl">Mood Tracker</h1>

        <p className="mt-2 text-base text-[#375446] dark:text-slate-300 md:text-lg">Pantau kesehatan mentalmu setiap hari untuk hidup yang lebih baik.</p>
      </header>

      <TrackerSteps currentStep={currentStep} />

      <div className="mt-8">
        <Outlet context={outletContext} />
      </div>

      <div className="mt-10 border-t border-[#e3e9e5] pt-8 dark:border-slate-700">
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={handleBack} className="inline-flex items-center gap-3 text-base font-medium text-[#1f3f31] transition hover:text-[#2b6a4f] dark:text-white dark:hover:text-emerald-300">
            <ArrowLeft size={20} />
            Kembali
          </button>

          <button type="button" onClick={handlePrimaryAction} disabled={isSubmitting} className="rounded-2xl bg-[#2b6a4f] px-12 py-4 text-base font-semibold text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-[#245a43] disabled:cursor-not-allowed disabled:opacity-70">
            {currentStep === 3 ? (isSubmitting ? "Menyimpan..." : "Simpan") : "Lanjut"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TrackerSteps({ currentStep }) {
  return (
    <div className="mx-auto grid max-w-265 grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
      {trackerSteps.map((item, index) => {
        const isActive = currentStep === item.number;
        const isCompleted = currentStep > item.number;

        return (
          <div key={item.number} className="contents">
            <div className="flex items-center justify-center gap-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#2b6a4f] text-white"
                    : isCompleted
                      ? "border border-[#1f3f31] bg-white text-[#1f3f31] dark:border-emerald-300 dark:bg-slate-900 dark:text-emerald-300"
                      : "border border-[#dfe5e1] bg-white text-[#60766b] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                {isCompleted ? <Check size={16} /> : item.number}
              </span>

              <span className={`text-base font-medium ${isActive || isCompleted ? "text-[#1f3f31] dark:text-white" : "text-[#60766b] dark:text-slate-400"}`}>{item.label}</span>
            </div>

            {index < trackerSteps.length - 1 && <div className="hidden h-px w-24 bg-[#dfe5e1] dark:bg-slate-700 sm:block lg:w-32" />}
          </div>
        );
      })}
    </div>
  );
}

export default TrackerLayout;
