import React from 'react';
import { Sun, Moon, Monitor, ArrowRight, User as UserIcon } from 'lucide-react';
import { ThemeMode, Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface NavbarProps {
  currentView: 'landing' | 'dashboard';
  onNavigate: (view: 'landing' | 'dashboard') => void;
  themeMode: ThemeMode;
  onSetThemeMode: (mode: ThemeMode) => void;
  lang: Language;
  onSetLang: (lang: Language) => void;
  user: UserProfile | null;
  onOpenGoogleAuth: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  themeMode,
  onSetThemeMode,
  lang,
  onSetLang,
  user,
  onOpenGoogleAuth,
  onSignOut,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-[#FAF7F2]/90 dark:bg-[#0e0e11]/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Left: Navigation Links or Back Button */}
        {currentView === 'landing' ? (
          <nav className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300">
            <a href="#features" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 text-drop-subtle">
              {t.navFeatures}
            </a>
            <a href="#calculator" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 text-drop-subtle">
              {t.navCalculator}
            </a>
            <a href="#how-it-works" className="hidden sm:inline hover:text-sky-500 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 text-drop-subtle">
              {t.navHowItWorks}
            </a>
            <a href="#faq" className="hidden sm:inline hover:text-sky-500 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 text-drop-subtle">
              {t.navFAQ}
            </a>
          </nav>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors cursor-pointer whitespace-nowrap text-drop-subtle"
            >
              &larr; {t.backToHome}
            </button>
          </div>
        )}

        {/* Right Actions: Language Switcher, Theme Switcher & Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Selector */}
          <select
            value={lang}
            onChange={e => onSetLang(e.target.value as Language)}
            aria-label="Language selection"
            className="h-9 px-2 text-xs font-bold bg-[#FFFDF9] dark:bg-stone-900 text-stone-700 dark:text-stone-300 rounded-xl border border-stone-200 dark:border-stone-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="th">🇹🇭 ไทย</option>
            <option value="en">🇬🇧 EN</option>
            <option value="zh">🇨🇳 中文</option>
          </select>

          {/* Theme Mode Toggle Button */}
          <div className="flex items-center bg-[#FFFDF9] dark:bg-stone-900 p-0.5 rounded-xl border border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={() => onSetThemeMode('light')}
              title={t.themeLight}
              className={`p-1.5 rounded-lg transition-colors ${
                themeMode === 'light'
                  ? 'bg-amber-100 text-amber-600 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onSetThemeMode('dark')}
              title={t.themeDark}
              className={`p-1.5 rounded-lg transition-colors ${
                themeMode === 'dark'
                  ? 'bg-stone-800 text-blue-400 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onSetThemeMode('system')}
              title={t.themeSystem}
              className={`p-1.5 rounded-lg transition-colors hidden sm:block ${
                themeMode === 'system'
                  ? 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary View Action / User Button (Accent Sky Blue: #0284C7 / #0EA5E9) */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onNavigate(currentView === 'landing' ? 'dashboard' : 'landing')}
                className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl btn-tactile-sky text-white font-extrabold text-xs cursor-pointer whitespace-nowrap shrink-0 text-drop-subtle"
              >
                <span>{currentView === 'landing' ? t.launchApp : t.backToHome}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            currentView === 'landing' ? (
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl btn-tactile-sky text-white font-extrabold text-xs cursor-pointer whitespace-nowrap shrink-0 text-drop-subtle"
              >
                <span>{t.launchApp}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenGoogleAuth}
                className="flex items-center gap-1.5 h-9 px-3 rounded-xl btn-tactile-eggshell text-stone-800 dark:text-stone-100 font-bold text-xs cursor-pointer whitespace-nowrap shrink-0 text-drop-subtle"
              >
                <UserIcon className="w-3.5 h-3.5 text-sky-500" />
                <span className="hidden sm:inline">Google</span>
                <span>Login</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};
