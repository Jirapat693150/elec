import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Plus,
  Trash2,
  Sliders,
  RotateCcw,
  Thermometer,
  Search,
  Check,
  X,
  Sparkles,
  ArrowLeft,
  Home,
  Tv,
  Fan,
  Laptop,
  Flame,
  Refrigerator
} from 'lucide-react';
import { Appliance, Language, UserProfile, AIModelSuggestion } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface EnergyDashboardProps {
  appliances: Appliance[];
  onAddAppliance: (appliance: Omit<Appliance, 'id'>) => void;
  onRemoveAppliance: (id: string) => void;
  onUpdateAppliance: (appliance: Appliance) => void;
  onResetData: () => void;
  gridRate: number;
  onUpdateGridRate: (rate: number) => void;
  lang: Language;
  user: UserProfile | null;
  onBackToLanding: () => void;
  onOpenGoogleAuth: () => void;
  showToast: (msg: string) => void;
}

const COLORS = [
  '#0ea5e9', // sky blue (accent)
  '#f59e0b', // amber yellow (secondary)
  '#38bdf8', // light sky blue
  '#fbbf24', // bright yellow
  '#0284c7', // deep sky blue
  '#d97706', // warm amber
  '#10b981', // emerald
  '#6366f1', // indigo
];

// Built-in intelligent model database for instant AI search response
const PRESET_MODELS: Record<string, AIModelSuggestion[]> = {
  ac: [
    { name: 'Daikin Smile Inverter 12,000 BTU', watt: 990, hours: 8, compressor: true, category: 'ac' },
    { name: 'Mitsubishi Heavy Duty 18,000 BTU', watt: 1540, hours: 8, compressor: true, category: 'ac' },
    { name: 'Carrier Copper 11 9,000 BTU', watt: 780, hours: 8, compressor: true, category: 'ac' },
  ],
  fridge: [
    { name: 'LG Smart Inverter 2-Door 14 Cu.ft', watt: 130, hours: 24, compressor: true, category: 'fridge' },
    { name: 'Samsung Digital Inverter 12 Cu.ft', watt: 145, hours: 24, compressor: true, category: 'fridge' },
    { name: 'Mitsubishi 3-Door Multi Airflow', watt: 160, hours: 24, compressor: true, category: 'fridge' },
  ],
  fan: [
    { name: 'Hatari 16-inch Slide Fan (Level 2)', watt: 49, hours: 8, compressor: false, category: 'fan' },
    { name: 'Mitsubishi Electric 18-inch Stand Fan', watt: 62, hours: 8, compressor: false, category: 'fan' },
    { name: 'Dyson Purifier Cool TP07', watt: 40, hours: 10, compressor: false, category: 'fan' },
  ],
  laptop: [
    { name: 'Apple MacBook Air M3 (Charging & Work)', watt: 35, hours: 8, compressor: false, category: 'laptop' },
    { name: 'Gaming Laptop (RTX 4060 Under Load)', watt: 180, hours: 4, compressor: false, category: 'laptop' },
    { name: 'Dell XPS 15 Office Workstation', watt: 65, hours: 8, compressor: false, category: 'laptop' },
  ],
  tv: [
    { name: 'Samsung 55" Crystal UHD 4K', watt: 95, hours: 5, compressor: false, category: 'tv' },
    { name: 'Sony Bravia 65" OLED 4K', watt: 140, hours: 4, compressor: false, category: 'tv' },
    { name: 'LG 43" Smart Full HD', watt: 60, hours: 6, compressor: false, category: 'tv' },
  ],
  heater: [
    { name: 'Panasonic Water Heater 3,500W', watt: 3500, hours: 0.5, compressor: false, category: 'heater' },
    { name: 'Electrolux ComfortFlow 4,500W', watt: 4500, hours: 0.4, compressor: false, category: 'heater' },
    { name: 'Stiebel Eltron 3,500W', watt: 3500, hours: 0.5, compressor: false, category: 'heater' },
  ],
};

export const EnergyDashboard: React.FC<EnergyDashboardProps> = ({
  appliances,
  onAddAppliance,
  onRemoveAppliance,
  onUpdateAppliance,
  onResetData,
  gridRate,
  onUpdateGridRate,
  lang,
  user,
  onBackToLanding,
  onOpenGoogleAuth,
  showToast,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appliances' | 'settings'>('dashboard');

  // Manual Add Form State
  const [manualName, setManualName] = useState('');
  const [manualWatts, setManualWatts] = useState<number | ''>('');
  const [manualHours, setManualHours] = useState<number | ''>('');
  const [manualIsCompressor, setManualIsCompressor] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [modalModels, setModalModels] = useState<AIModelSuggestion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chosenIndex, setChosenIndex] = useState<number>(-1);
  const [selectedModelName, setSelectedModelName] = useState('');
  const [selectedModelWatts, setSelectedModelWatts] = useState<number>(0);
  const [selectedModelHours, setSelectedModelHours] = useState<number>(0);

  // Temperature sync loading IDs
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Monthly kWh calculation for an appliance
  const calculateKwh = (a: Appliance) => (a.watts * a.hours * 30) / 1000;
  const totalKwh = appliances.reduce((sum, a) => sum + calculateKwh(a), 0);
  const totalBill = totalKwh * gridRate;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === 'th' ? 'th-TH' : lang === 'zh' ? 'zh-CN' : 'en-US', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Add Manual Appliance
  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualWatts || manualWatts <= 0 || !manualHours || manualHours <= 0 || manualHours > 24) {
      showToast(t.badInputs);
      return;
    }

    onAddAppliance({
      name: manualName.trim(),
      watts: Number(manualWatts),
      hours: Number(manualHours),
      compressor: manualIsCompressor,
      baseWatts: Number(manualWatts),
      outsideTemp: 30,
      tempMultiplier: 1,
    });

    setManualName('');
    setManualWatts('');
    setManualHours('');
    setManualIsCompressor(false);
    showToast(t.addOk);
  };

  // Preset quick add
  const handleAddPreset = (key: 'ac' | 'fridge' | 'fan' | 'laptop' | 'tv' | 'heater') => {
    const list = PRESET_MODELS[key];
    if (list && list.length > 0) {
      const p = list[0];
      onAddAppliance({
        name: p.name,
        watts: p.watt,
        hours: p.hours,
        compressor: p.compressor,
        baseWatts: p.watt,
        outsideTemp: 30,
        tempMultiplier: 1,
      });
      showToast(t.addOk);
    }
  };

  // Model Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    setIsSearching(true);
    setTimeout(() => {
      let results: AIModelSuggestion[] = [];

      // Check keyword matches
      if (q.includes('แอร์') || q.includes('ac') || q.includes('air') || q.includes('daikin') || q.includes('carrier') || q.includes('mitsubishi')) {
        results = [...PRESET_MODELS.ac];
      } else if (q.includes('ตู้เย็น') || q.includes('fridge') || q.includes('refrigerator') || q.includes('lg') || q.includes('samsung')) {
        results = [...PRESET_MODELS.fridge];
      } else if (q.includes('พัดลม') || q.includes('fan') || q.includes('hatari') || q.includes('dyson')) {
        results = [...PRESET_MODELS.fan];
      } else if (q.includes('โน้ตบุ๊ก') || q.includes('laptop') || q.includes('macbook') || q.includes('computer') || q.includes('pc')) {
        results = [...PRESET_MODELS.laptop];
      } else if (q.includes('ทีวี') || q.includes('tv') || q.includes('oled') || q.includes('sony')) {
        results = [...PRESET_MODELS.tv];
      } else if (q.includes('น้ำอุ่น') || q.includes('heater') || q.includes('panasonic')) {
        results = [...PRESET_MODELS.heater];
      } else {
        // Fallback intelligent suggestions generated based on user query
        results = [
          { name: `${searchQuery} (Standard Model)`, watt: 450, hours: 4, compressor: false },
          { name: `${searchQuery} (High Efficiency Eco)`, watt: 280, hours: 4, compressor: false },
          { name: `${searchQuery} (Pro / Heavy Duty)`, watt: 900, hours: 5, compressor: false },
        ];
      }

      setModalModels(results);
      setChosenIndex(0);
      setSelectedModelName(results[0].name);
      setSelectedModelWatts(results[0].watt);
      setSelectedModelHours(results[0].hours);
      setIsSearching(false);
      setIsModalOpen(true);
    }, 350);
  };

  const handleSelectModel = (idx: number) => {
    setChosenIndex(idx);
    const m = modalModels[idx];
    if (m) {
      setSelectedModelName(m.name);
      setSelectedModelWatts(m.watt);
      setSelectedModelHours(m.hours);
    }
  };

  const handleConfirmModel = () => {
    if (chosenIndex < 0 || !selectedModelName.trim() || selectedModelWatts <= 0 || selectedModelHours <= 0) {
      showToast(t.badInputs);
      return;
    }

    const chosen = modalModels[chosenIndex];
    onAddAppliance({
      name: selectedModelName.trim(),
      watts: selectedModelWatts,
      hours: selectedModelHours,
      compressor: Boolean(chosen?.compressor),
      baseWatts: selectedModelWatts,
      outsideTemp: 30,
      tempMultiplier: 1,
    });

    setIsModalOpen(false);
    setSearchQuery('');
    showToast(t.addOk);
    setActiveTab('dashboard');
  };

  // AI Temperature Sync Simulation for Compressor Devices
  const handleSyncTemp = (appliance: Appliance, targetTemp: number) => {
    setSyncingId(appliance.id);

    setTimeout(() => {
      // Thermodynamic compressor multiplier calculation:
      // Baseline outside temp is 28°C (multiplier = 1.0)
      // Every 1°C increase above 28°C increases compressor load by ~3.5%
      // In cool weather (e.g. 24°C), compressor load reduces by ~2.5% per °C
      let multiplier = 1.0;
      let reason = '';

      if (targetTemp >= 28) {
        multiplier = 1.0 + (targetTemp - 28) * 0.035;
        multiplier = Math.min(1.85, multiplier);
        reason = `อุณหภูมิ ${targetTemp}°C: คอมเพรสเซอร์ทำงานหนักขึ้น +${((multiplier - 1) * 100).toFixed(0)}%`;
      } else {
        multiplier = Math.max(0.65, 1.0 - (28 - targetTemp) * 0.025);
        reason = `อากาศเย็น ${targetTemp}°C: คอมเพรสเซอร์ระบายความร้อนได้ดี ประหยัดไฟ ${((1 - multiplier) * 100).toFixed(0)}%`;
      }

      const baseWatts = appliance.baseWatts || appliance.watts;
      const updatedWatts = Math.round(baseWatts * multiplier);

      onUpdateAppliance({
        ...appliance,
        baseWatts,
        outsideTemp: targetTemp,
        tempMultiplier: Number(multiplier.toFixed(2)),
        watts: updatedWatts,
        tempReason: reason,
      });

      setSyncingId(null);
      showToast(t.tempUpdated);
    }, 400);
  };

  // SVG Donut Chart Slices Math
  let cumulativePercent = 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="w-full min-h-[calc(100vh-64px)] pb-24 md:pb-12 bg-[#FAF7F2] dark:bg-[#0e0e11] text-stone-900 dark:text-stone-100">
      {/* Top Header Bar */}
      <div className="border-b border-stone-200/80 dark:border-stone-800/80 bg-[#FAF7F2]/90 dark:bg-[#0e0e11]/90 backdrop-blur-md px-4 py-4 sticky top-16 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn-tactile-eggshell text-stone-800 dark:text-stone-200 text-xs font-bold cursor-pointer text-drop-subtle"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.backToHome}</span>
            </button>
            <span className="text-stone-400 dark:text-stone-600">/</span>
            <span className="font-extrabold text-sm text-stone-900 dark:text-stone-100 text-drop-subtle">
              {activeTab === 'dashboard' ? t.navDashboard : activeTab === 'appliances' ? t.navAppliances : t.navSettings}
            </span>
          </div>

          {/* Desktop Tab Switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-[#FFFDF9] dark:bg-stone-900 p-1 rounded-xl border border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors text-drop-subtle ${
                activeTab === 'dashboard'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {t.navDashboard}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('appliances')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors text-drop-subtle ${
                activeTab === 'appliances'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {t.navAppliances} ({appliances.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors text-drop-subtle ${
                activeTab === 'settings'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {t.navSettings}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 text-drop-subtle">
                {t.dashHello}{' '}
                <span className="text-sky-500 dark:text-sky-400">{t.dashInFocus}</span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 font-medium">
                {t.dashCaption}
              </p>
            </div>

            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Left KPI Card: Monthly Total Bill (Accent Sky Blue: #0284C7 / #0EA5E9) */}
              <div className="md:col-span-7 bg-[#FFFDF9] dark:bg-[#16161c] rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase font-extrabold text-stone-500 dark:text-stone-400 text-drop-subtle">
                    {t.monthlyBill}
                  </div>
                  {/* Accent Sky Blue for Key Monthly Bill Number */}
                  <div className="text-3xl sm:text-5xl font-extrabold text-sky-500 dark:text-sky-400 font-mono tracking-tight mt-2 text-drop-subtle">
                    {formatCurrency(totalBill)}
                    <span className="text-sm sm:text-base font-sans text-stone-500 dark:text-stone-400 font-bold ml-2">
                      {t.perMonth}
                    </span>
                  </div>
                </div>

                <div className="my-5 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs text-stone-500 dark:text-stone-400 block font-bold text-drop-subtle">{t.energyUse}</span>
                    <span className="text-base sm:text-lg font-extrabold font-mono text-amber-500 dark:text-amber-400 text-drop-subtle">
                      {totalKwh.toFixed(1)} kWh
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-stone-500 dark:text-stone-400 block font-bold text-drop-subtle">{t.appliances}</span>
                    <span className="text-base sm:text-lg font-extrabold font-mono text-stone-900 dark:text-stone-100 text-drop-subtle">
                      {appliances.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-stone-500 dark:text-stone-400 block font-bold text-drop-subtle">{t.gridRate}</span>
                    <span className="text-base sm:text-lg font-extrabold font-mono text-stone-900 dark:text-stone-100 text-drop-subtle">
                      ฿{gridRate.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Chart Card: Interactive SVG Donut Breakdown */}
              <div className="md:col-span-5 bg-[#FFFDF9] dark:bg-[#16161c] rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col items-center justify-center">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                    {/* Background track circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="20"
                      fill="transparent"
                      className="text-stone-100 dark:text-stone-800"
                    />

                    {/* Slices */}
                    {appliances.length > 0 ? (
                      appliances.map((appliance, i) => {
                        const itemKwh = calculateKwh(appliance);
                        const percent = totalKwh > 0 ? itemKwh / totalKwh : 0;
                        const strokeDasharray = `${percent * circumference} ${circumference}`;
                        const strokeDashoffset = -cumulativePercent * circumference;
                        cumulativePercent += percent;

                        return (
                          <circle
                            key={appliance.id}
                            cx="80"
                            cy="80"
                            r={radius}
                            stroke={COLORS[i % COLORS.length]}
                            strokeWidth="20"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            fill="transparent"
                            className="transition-all duration-500"
                          />
                        );
                      })
                    ) : (
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="20"
                        fill="transparent"
                        className="text-stone-200 dark:text-stone-800"
                      />
                    )}
                  </svg>

                  {/* Centered Number in Chart (Accent Sky Blue) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-xl sm:text-2xl font-extrabold font-mono text-sky-500 dark:text-sky-400 text-drop-subtle">
                      {totalKwh.toFixed(0)}
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 font-bold">
                      kWh / {lang === 'th' ? 'เดือน' : 'mo'}
                    </span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="w-full mt-4 flex flex-wrap gap-2 justify-center max-h-24 overflow-y-auto">
                  {appliances.slice(0, 6).map((app, i) => (
                    <div key={app.id} className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="truncate max-w-[90px] font-medium">{app.name}</span>
                      <span className="font-mono font-bold text-sky-500">({calculateKwh(app).toFixed(0)})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Usage Breakdown List */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-stone-900 dark:text-stone-100 text-drop-subtle">
                    {t.usageBreakdown}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {t.monthEstimates}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('appliances')}
                  className="px-3 py-1.5 rounded-xl btn-tactile-eggshell text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer text-drop-subtle"
                >
                  {t.manage}
                </button>
              </div>

              {appliances.length === 0 ? (
                <div className="bg-[#FFFDF9] dark:bg-[#16161c] rounded-3xl p-8 text-center border border-stone-200 dark:border-stone-800 text-stone-500 shadow-sm">
                  <p className="text-sm font-medium">{t.empty}</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('appliances')}
                    className="mt-3 px-4 py-2 btn-tactile-sky text-white font-extrabold rounded-xl text-xs text-drop-subtle"
                  >
                    {t.addAppliance}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {appliances.map((appliance, idx) => {
                    const itemKwh = calculateKwh(appliance);
                    const pct = totalKwh > 0 ? (itemKwh / totalKwh) * 100 : 0;
                    const itemCost = itemKwh * gridRate;

                    return (
                      <div
                        key={appliance.id}
                        className="bg-[#FFFDF9] dark:bg-[#16161c] rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-stone-100 truncate text-drop-subtle">
                              {appliance.name}
                            </div>
                            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                              {appliance.watts} W &middot; {appliance.hours} {t.hoursPerDay} &middot;{' '}
                              <span className="font-mono font-bold text-amber-500 dark:text-amber-400">{itemKwh.toFixed(1)} kWh/{lang === 'th' ? 'เดือน' : 'mo'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="font-extrabold font-mono text-sm sm:text-base text-sky-500 dark:text-sky-400 text-drop-subtle">
                              {formatCurrency(itemCost)}
                            </div>
                            <button
                              type="button"
                              onClick={() => onRemoveAppliance(appliance.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                              title={t.remove}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar of Appliance Share */}
                        <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 mt-3 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(3, pct))}%`,
                              backgroundColor: COLORS[idx % COLORS.length],
                            }}
                          />
                        </div>

                        {/* Compressor Outside Temperature Sync row */}
                        {appliance.compressor && (
                          <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap items-center gap-2 text-xs">
                            <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-stone-500 dark:text-stone-400">
                              {t.outside}:
                            </span>
                            <input
                              type="number"
                              min="-10"
                              max="50"
                              defaultValue={appliance.outsideTemp || 30}
                              id={`temp-input-${appliance.id}`}
                              className="w-16 px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono text-xs text-center"
                            />
                            <button
                              type="button"
                              disabled={syncingId === appliance.id}
                              onClick={() => {
                                const input = document.getElementById(
                                  `temp-input-${appliance.id}`
                                );
                                const val = Number((input as HTMLInputElement)?.value || 30);
                                handleSyncTemp(appliance, val);
                              }}
                              className="px-2.5 py-1 rounded-xl btn-tactile-sky text-white text-[11px] font-bold cursor-pointer text-drop-subtle"
                            >
                              {syncingId === appliance.id ? '...' : t.tempSync}
                            </button>

                            {appliance.tempMultiplier && appliance.tempMultiplier !== 1 && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-[11px]">
                                &times;{appliance.tempMultiplier.toFixed(2)}
                              </span>
                            )}

                            {appliance.tempReason && (
                              <span className="text-[11px] text-amber-600 dark:text-amber-400 truncate max-w-xs font-medium">
                                {appliance.tempReason}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: APPLIANCES MANAGEMENT */}
        {activeTab === 'appliances' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 text-drop-subtle">
                {t.yourAppliances}{' '}
                <span className="text-sky-500 dark:text-sky-400">{t.yourAppliancesSpan}</span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 font-medium">
                {t.applianceCaption}
              </p>
            </div>

            {/* Card 1: Add Manual Appliance & Presets */}
            <div className="bg-[#FFFDF9] dark:bg-[#16161c] rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-sm">
              <h2 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 mb-4 text-drop-subtle">
                {t.addAppliance}
              </h2>

              <form onSubmit={handleManualAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    required
                    placeholder={t.name}
                    value={manualName}
                    onChange={e => setManualName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Watts (W)"
                    value={manualWatts}
                    onChange={e => setManualWatts(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="number"
                    required
                    min="0.1"
                    max="24"
                    step="0.1"
                    placeholder="Hours/day"
                    value={manualHours}
                    onChange={e => setManualHours(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full h-full min-h-[42px] px-4 rounded-xl btn-tactile-sky text-white font-extrabold text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5 text-drop-subtle"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.add}</span>
                  </button>
                </div>
              </form>

              {/* Compressor checkbox toggle */}
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCompressorCheckbox"
                  checked={manualIsCompressor}
                  onChange={e => setManualIsCompressor(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 cursor-pointer"
                />
                <label
                  htmlFor="isCompressorCheckbox"
                  className="text-xs text-stone-600 dark:text-stone-400 cursor-pointer font-medium"
                >
                  {lang === 'th'
                    ? 'อุปกรณ์นี้มีคอมเพรสเซอร์ (เช่น แอร์, ตู้เย็น) เพื่อเปิดใช้ระบบจำลองอุณหภูมิ'
                    : 'Has a compressor (e.g. AC, Fridge) for outside temperature sync'}
                </label>
              </div>

              {/* Quick Presets Strip */}
              <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleAddPreset('ac')}
                  className="px-3 py-1.5 rounded-xl btn-tactile-eggshell text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer text-drop-subtle"
                >
                  {t.acPreset}
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPreset('fridge')}
                  className="px-3 py-1.5 rounded-xl btn-tactile-eggshell text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer text-drop-subtle"
                >
                  {t.fridgePreset}
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPreset('fan')}
                  className="px-3 py-1.5 rounded-xl btn-tactile-eggshell text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer text-drop-subtle"
                >
                  {t.fanPreset}
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPreset('laptop')}
                  className="px-3 py-1.5 rounded-xl btn-tactile-eggshell text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer text-drop-subtle"
                >
                  {t.laptopPreset}
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPreset('tv')}
                  className="px-3 py-1.5 rounded-xl btn-tactile-eggshell text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer text-drop-subtle"
                >
                  {t.tvPreset}
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPreset('heater')}
                  className="px-3 py-1.5 rounded-xl btn-tactile-eggshell text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer text-drop-subtle"
                >
                  {t.heaterPreset}
                </button>
              </div>
            </div>

            {/* Card 2: AI Appliance Search */}
            <div className="bg-[#FFFDF9] dark:bg-[#16161c] rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="text-xs uppercase font-extrabold text-amber-500 dark:text-amber-400 mb-2 flex items-center gap-1.5 text-drop-subtle">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.aiSearch}</span>
              </div>

              <form onSubmit={handleSearchSubmit} className="flex gap-2.5">
                <input
                  type="text"
                  required
                  placeholder={t.searchPh}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-5 py-2.5 rounded-xl btn-tactile-sky text-white font-extrabold text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 whitespace-nowrap text-drop-subtle"
                >
                  {isSearching ? '...' : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>{t.search}</span>
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                {t.aiNote}
              </p>
            </div>

            {/* Appliance Inventory Count & List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-stone-900 dark:text-stone-100 text-drop-subtle">
                  {t.allAppliances}
                </h2>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-bold">
                  {t.summaryText(appliances.length)}
                </span>
              </div>

              {appliances.length === 0 ? (
                <div className="bg-[#FFFDF9] dark:bg-[#16161c] rounded-3xl p-8 text-center border border-stone-200 dark:border-stone-800 text-stone-500 shadow-sm">
                  {t.empty}
                </div>
              ) : (
                <div className="space-y-3">
                  {appliances.map(app => {
                    const itemKwh = calculateKwh(app);
                    const itemCost = itemKwh * gridRate;

                    return (
                      <div
                        key={app.id}
                        className="bg-[#FFFDF9] dark:bg-[#16161c] rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div>
                          <div className="font-extrabold text-sm sm:base text-stone-900 dark:text-stone-100 text-drop-subtle">
                            {app.name}
                          </div>
                          <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            {app.watts} W &middot; {app.hours} {t.hoursPerDay} &middot;{' '}
                            <span className="font-mono font-bold text-amber-500 dark:text-amber-400">{itemKwh.toFixed(1)} kWh/{lang === 'th' ? 'เดือน' : 'mo'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-extrabold font-mono text-sm sm:text-base text-sky-500 dark:text-sky-400 text-drop-subtle">
                            {formatCurrency(itemCost)}
                          </span>
                          <button
                            type="button"
                            onClick={() => onRemoveAppliance(app.id)}
                            className="p-2 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 text-drop-subtle">
                {t.settingsTitle}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 font-medium">
                {t.settingsCaption}
              </p>
            </div>

            {/* Rate Setting Card */}
            <div className="bg-[#FFFDF9] dark:bg-[#16161c] rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
              <h2 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 text-drop-subtle">
                {t.electricityRate}
              </h2>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 text-drop-subtle">
                  {t.rateLabel}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.05"
                    value={gridRate}
                    onChange={e => onUpdateGridRate(Number(e.target.value) || 0)}
                    className="w-32 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-bold">
                    {t.thbPerUnit}
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                  {t.rateNote}
                </p>
              </div>
            </div>

            {/* Account & Sync Status Card */}
            <div className="bg-[#FFFDF9] dark:bg-[#16161c] rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
              <h2 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 text-drop-subtle">
                {lang === 'th' ? 'สถานะบัญชีและการซิงค์' : 'Account & Sync Status'}
              </h2>

              {user ? (
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-extrabold text-sm text-stone-900 dark:text-stone-100 text-drop-subtle">{user.name}</div>
                      <div className="text-xs text-stone-500 dark:text-stone-400">{user.email}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Google Connected
                  </span>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                  <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                    {lang === 'th' ? 'ยังไม่ได้เข้าสู่ระบบ บันทึกข้อมูลเฉพาะในเบราว์เซอร์นี้' : 'Guest session: stored locally in browser'}
                  </div>
                  <button
                    type="button"
                    onClick={onOpenGoogleAuth}
                    className="px-3.5 py-1.5 rounded-xl btn-tactile-sky text-white font-extrabold text-xs cursor-pointer text-drop-subtle"
                  >
                    Google Login
                  </button>
                </div>
              )}
            </div>

            {/* Reset Data Card */}
            <div className="bg-[#FFFDF9] dark:bg-[#16161c] rounded-3xl p-6 sm:p-7 border border-rose-200 dark:border-rose-950/60 shadow-sm space-y-3">
              <h2 className="text-base sm:text-lg font-extrabold text-rose-600 dark:text-rose-400 text-drop-subtle">
                {t.dataSettings}
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                {t.dataNote}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm(lang === 'th' ? 'คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลเครื่องใช้ไฟฟ้าทั้งหมด?' : 'Reset all local appliance data?')) {
                    onResetData();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-extrabold transition-colors cursor-pointer text-drop-subtle"
              >
                {t.resetData}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FFFDF9]/95 dark:bg-[#16161c]/95 border-t border-stone-200 dark:border-stone-800 backdrop-blur-md px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
            activeTab === 'dashboard'
              ? 'text-sky-500 dark:text-sky-400'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span>{t.navDashboard}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('appliances')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
            activeTab === 'appliances'
              ? 'text-sky-500 dark:text-sky-400'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Sliders className="w-5 h-5" />
          <span>{t.navAppliances}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
            activeTab === 'settings'
              ? 'text-sky-500 dark:text-sky-400'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <RotateCcw className="w-5 h-5" />
          <span>{t.navSettings}</span>
        </button>

        <button
          type="button"
          onClick={onBackToLanding}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-bold text-stone-500 dark:text-stone-400 hover:text-sky-500 dark:hover:text-sky-400 cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span>{t.backToHome}</span>
        </button>
      </nav>

      {/* Model Selection Modal (from AI Search) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-[#FFFDF9] dark:bg-[#16161c] rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight text-drop-subtle">
                    {t.chooseModel}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                    {t.chooseHint}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Models Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                {modalModels.map((m, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectModel(idx)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      chosenIndex === idx
                        ? 'border-sky-500 bg-sky-500/10 ring-2 ring-sky-500/30'
                        : 'border-stone-200 dark:border-stone-700/80 bg-stone-50 dark:bg-stone-800/50 hover:border-stone-300'
                    }`}
                  >
                    <div className="font-extrabold text-xs sm:text-sm line-clamp-2 text-drop-subtle">
                      {m.name}
                    </div>
                    <div className="text-sky-500 dark:text-sky-400 font-mono font-extrabold text-sm mt-1 text-drop-subtle">
                      {m.watt} W
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 font-medium">
                      {m.hours} {t.hoursPerDay}
                    </div>
                  </button>
                ))}
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1 text-drop-subtle">
                    {t.productName}
                  </label>
                  <input
                    type="text"
                    value={selectedModelName}
                    onChange={e => setSelectedModelName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1 text-drop-subtle">
                    {t.wattsExact}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={selectedModelWatts}
                    onChange={e => setSelectedModelWatts(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs sm:text-sm font-mono font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1 text-drop-subtle">
                    {t.hoursDay}
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    max="24"
                    step="0.1"
                    value={selectedModelHours}
                    onChange={e => setSelectedModelHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs sm:text-sm font-mono font-bold"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl btn-tactile-eggshell text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer text-drop-subtle"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmModel}
                  className="px-5 py-2 rounded-xl btn-tactile-sky text-white font-extrabold text-xs cursor-pointer text-drop-subtle"
                >
                  {t.confirmAdd}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
