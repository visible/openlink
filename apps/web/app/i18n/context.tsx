"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type Locale, type Translations, translations } from "./translations";

type I18nContextType = {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	t: Translations;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
	const [locale, setLocaleState] = useState<Locale>("en");

	useEffect(() => {
		const saved = localStorage.getItem("locale") as Locale;
		if (saved && translations[saved]) {
			setLocaleState(saved);
		}
	}, []);

	function setLocale(newLocale: Locale) {
		setLocaleState(newLocale);
		localStorage.setItem("locale", newLocale);
	}

	const t = translations[locale];

	return (
		<I18nContext.Provider value={{ locale, setLocale, t }}>
			{children}
		</I18nContext.Provider>
	);
}

export function useI18n() {
	const context = useContext(I18nContext);
	if (!context) {
		throw new Error("useI18n must be used within I18nProvider");
	}
	return context;
}
