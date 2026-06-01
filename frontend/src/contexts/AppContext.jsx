import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);

function getInitialLanguage() {
  return localStorage.getItem("moodsense_language") || "id";
}

function getInitialTheme() {
  return localStorage.getItem("moodsense_theme") || "light";
}

export function AppProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("moodsense_language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("moodsense_theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#020617";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#f7f8f7";
    }
  }, [theme]);

  const value = useMemo(
    () => ({
      language,
      theme,
      setLanguage,
      setTheme,
      isDarkMode: theme === "dark",
      isEnglish: language === "en",
    }),
    [language, theme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp harus digunakan di dalam AppProvider");
  }

  return context;
}
