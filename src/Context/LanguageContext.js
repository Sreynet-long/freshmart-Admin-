import React, { createContext, useState, useEffect } from "react";

// Create Context
export const LanguageContext = createContext();

// Language Provider
export function LanguageProvider({ children }) {
  const storedLanguage = localStorage.getItem("language") || "kh";
  const [language, setLanguage] = useState(storedLanguage);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
