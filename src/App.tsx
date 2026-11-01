import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { EnergyDashboard } from './components/EnergyDashboard';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { ThemeMode, Language, Appliance, UserProfile } from './types';
import { TRANSLATIONS } from './utils/translations';

const DEFAULT_APPLIANCES: Appliance[] = [
  {
    id: 'app-ac-1',
    name: 'Daikin Inverter AC 12,000 BTU',
    watts: 990,
    hours: 8,
    compressor: true,
    baseWatts: 990,
    outsideTemp: 32,
    tempMultiplier: 1.14,
    tempReason: 'อุณหภูมิภายนอก 32°C: คอมเพรสเซอร์ทำงานหนักขึ้น +14%',
  },
  {
    id: 'app-fridge-1',
    name: 'LG Inverter Refrigerator 14 Cu.ft',
    watts: 130,
    hours: 24,
    compressor: true,
    baseWatts: 130,
    outsideTemp: 32,
    tempMultiplier: 1.14,
    tempReason: 'อุณหภูมิภายนอก 32°C: คอมเพรสเซอร์ทำงานหนักขึ้น +14%',
  },
  {
    id: 'app-fan-1',
    name: 'Hatari 16" Slide Fan',
    watts: 49,
    hours: 8,
    compressor: false,
    baseWatts: 49,
  },
  {
    id: 'app-pc-1',
    name: 'Workstation Laptop (M3)',
    watts: 55,
    hours: 7,
    compressor: false,
    baseWatts: 55,
  },
  {
    id: 'app-tv-1',
    name: 'Samsung 55" Smart 4K TV',
    watts: 95,
    hours: 4,
    compressor: false,
    baseWatts: 95,
  },
];

export default function App() {
  // Theme Mode State ('light' | 'dark' | 'system')
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('powerProfiles.theme');
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
      // Default to user's system preference or dark
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'dark';
    }
  });

  const [isDark, setIsDark] = useState<boolean>(true);

  // Sync theme with documentElement and media query
  useEffect(() => {
    const updateTheme = () => {
      let activeIsDark = true;
      if (themeMode === 'system') {
        activeIsDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
      } else {
        activeIsDark = themeMode === 'dark';
      }

      setIsDark(activeIsDark);
      if (activeIsDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();
    localStorage.setItem('powerProfiles.theme', themeMode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (themeMode === 'system') updateTheme();
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [themeMode]);

  // Language State ('th' | 'en' | 'zh')
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('powerProfiles.language.v1');
      if (saved === 'th' || saved === 'en' || saved === 'zh') return saved;
      return 'th';
    } catch {
      return 'th';
    }
  });

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('powerProfiles.language.v1', newLang);
    document.documentElement.lang = newLang;
  };

  // View Navigation ('landing' | 'dashboard')
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  // Appliances State
  const [appliances, setAppliances] = useState<Appliance[]>(() => {
    try {
      const saved = localStorage.getItem('powerProfiles.appliances.v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_APPLIANCES;
    } catch {
      return DEFAULT_APPLIANCES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('powerProfiles.appliances.v2', JSON.stringify(appliances));
    } catch {
      // storage quota or disabled
    }
  }, [appliances]);

  // Electricity Tariff Grid Rate
  const [gridRate, setGridRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('powerProfiles.rate.v2');
      const num = Number(saved);
      return Number.isFinite(num) && num > 0 ? num : 4.2;
    } catch {
      return 4.2;
    }
  });

  const handleUpdateGridRate = (rate: number) => {
    setGridRate(rate);
    localStorage.setItem('powerProfiles.rate.v2', String(rate));
  };

  // Google User Session State
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('powerProfiles.user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleGoogleSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem('powerProfiles.user', JSON.stringify(newUser));
    setIsGoogleModalOpen(false);
    showToast(`${TRANSLATIONS[lang].signedInAs} ${newUser.name}`);
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('powerProfiles.user');
    showToast(TRANSLATIONS[lang].signOut);
  };

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 2800);
  };

  // Appliance Actions
  const handleAddAppliance = (appliance: Omit<Appliance, 'id'>) => {
    const newItem: Appliance = {
      ...appliance,
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setAppliances(prev => [newItem, ...prev]);
  };

  const handleRemoveAppliance = (id: string) => {
    setAppliances(prev => prev.filter(a => a.id !== id));
  };

  const handleUpdateAppliance = (updated: Appliance) => {
    setAppliances(prev => prev.map(a => (a.id === updated.id ? updated : a)));
  };

  const handleResetData = () => {
    setAppliances([]);
    setGridRate(4.2);
    localStorage.removeItem('powerProfiles.appliances.v2');
    localStorage.removeItem('powerProfiles.rate.v2');
    showToast(lang === 'th' ? 'ล้างข้อมูลเครื่องใช้ไฟฟ้าเรียบร้อยแล้ว' : 'Appliance data reset.');
  };

  // Light bulb interactive toggle
  const handleToggleThemeFromBulb = () => {
    const nextMode: ThemeMode = isDark ? 'light' : 'dark';
    setThemeMode(nextMode);
    showToast(nextMode === 'light' ? TRANSLATIONS[lang].themeLight : TRANSLATIONS[lang].themeDark);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-900 dark:bg-[#0e0e11] dark:text-slate-100 transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        themeMode={themeMode}
        onSetThemeMode={setThemeMode}
        lang={lang}
        onSetLang={handleSetLang}
        user={user}
        onOpenGoogleAuth={() => setIsGoogleModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {currentView === 'landing' ? (
          <LandingPage
            isDark={isDark}
            onToggleTheme={handleToggleThemeFromBulb}
            lang={lang}
            user={user}
            onOpenGoogleAuth={() => setIsGoogleModalOpen(true)}
            onLaunchDashboard={() => setCurrentView('dashboard')}
            onSignOut={handleSignOut}
            gridRate={gridRate}
          />
        ) : (
          <EnergyDashboard
            appliances={appliances}
            onAddAppliance={handleAddAppliance}
            onRemoveAppliance={handleRemoveAppliance}
            onUpdateAppliance={handleUpdateAppliance}
            onResetData={handleResetData}
            gridRate={gridRate}
            onUpdateGridRate={handleUpdateGridRate}
            lang={lang}
            user={user}
            onBackToLanding={() => setCurrentView('landing')}
            onOpenGoogleAuth={() => setIsGoogleModalOpen(true)}
            showToast={showToast}
          />
        )}
      </div>

      {/* Google Authentication Dialog Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
        lang={lang}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/90 dark:bg-slate-100/95 text-slate-100 dark:text-slate-900 text-xs sm:text-sm font-semibold shadow-2xl backdrop-blur-md border border-slate-700/50 dark:border-slate-300/50 transition-all">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
