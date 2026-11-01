import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface LiveCalculatorPreviewProps {
  lang: Language;
  gridRate: number;
  onLaunchDashboard: () => void;
}

export const LiveCalculatorPreview: React.FC<LiveCalculatorPreviewProps> = ({
  lang,
  gridRate,
  onLaunchDashboard,
}) => {
  const t = TRANSLATIONS[lang];

  // Quick slider states (hours per day)
  const [acHours, setAcHours] = useState<number>(8);
  const [fridgeHours, setFridgeHours] = useState<number>(24);
  const [pcHours, setPcHours] = useState<number>(6);
  const [tvHours, setTvHours] = useState<number>(4);

  // Wattages
  const acWatts = 1200;
  const fridgeWatts = 150;
  const pcWatts = 120;
  const tvWatts = 100;

  // Monthly kWh calculation: (Watts * Hours * 30) / 1000
  const acKwh = (acWatts * acHours * 30) / 1000;
  const fridgeKwh = (fridgeWatts * fridgeHours * 30) / 1000;
  const pcKwh = (pcWatts * pcHours * 30) / 1000;
  const tvKwh = (tvWatts * tvHours * 30) / 1000;

  const totalKwh = acKwh + fridgeKwh + pcKwh + tvKwh;
  const totalCost = totalKwh * gridRate;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(lang === 'th' ? 'th-TH' : lang === 'zh' ? 'zh-CN' : 'en-US', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="calculator" className="py-12 sm:py-16 bg-[#FAF7F2] dark:bg-[#0e0e11]">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FFFDF9] dark:bg-stone-900 text-amber-600 dark:text-amber-400 border border-stone-200 dark:border-stone-800 mb-3 shadow-xs text-drop-subtle">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{t.previewTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 text-drop-subtle">
            {lang === 'th'
              ? 'ประเมินค่าไฟคร่าวๆ ในบ้านของคุณ'
              : lang === 'zh'
              ? '快速试算您的家庭用电'
              : 'Estimate Your Monthly Power Costs in Seconds'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-xl mx-auto font-medium">
            {t.previewSubtitle}
          </p>
        </div>

        {/* Interactive Minimalist Eggshell Card */}
        <div className="bg-[#FFFDF9] dark:bg-[#16161c] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Sliders */}
            <div className="lg:col-span-7 space-y-5">
              {/* AC Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="font-extrabold text-stone-900 dark:text-stone-100 text-drop-subtle">
                    ❄️ {t.previewAc}
                  </span>
                  <span className="font-mono text-sky-500 dark:text-sky-400 font-extrabold text-drop-subtle">
                    {acHours} {t.hoursPerDay} ({acKwh.toFixed(0)} kWh)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={acHours}
                  onChange={e => setAcHours(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              {/* Fridge Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="font-extrabold text-stone-900 dark:text-stone-100 text-drop-subtle">
                    🧊 {t.previewFridge}
                  </span>
                  <span className="font-mono text-sky-500 dark:text-sky-400 font-extrabold text-drop-subtle">
                    {fridgeHours} {t.hoursPerDay} ({fridgeKwh.toFixed(0)} kWh)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={fridgeHours}
                  onChange={e => setFridgeHours(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              {/* PC Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="font-extrabold text-stone-900 dark:text-stone-100 text-drop-subtle">
                    💻 {t.previewPc}
                  </span>
                  <span className="font-mono text-sky-500 dark:text-sky-400 font-extrabold text-drop-subtle">
                    {pcHours} {t.hoursPerDay} ({pcKwh.toFixed(0)} kWh)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={pcHours}
                  onChange={e => setPcHours(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              {/* TV Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="font-extrabold text-stone-900 dark:text-stone-100 text-drop-subtle">
                    📺 {t.previewTv}
                  </span>
                  <span className="font-mono text-sky-500 dark:text-sky-400 font-extrabold text-drop-subtle">
                    {tvHours} {t.hoursPerDay} ({tvKwh.toFixed(0)} kWh)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={tvHours}
                  onChange={e => setTvHours(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>
            </div>

            {/* Right Column: Output Summary Box (Sky Blue Accent) */}
            <div className="lg:col-span-5 bg-[#FAF7F2] dark:bg-[#1d1d26] rounded-2xl p-6 border border-stone-200 dark:border-stone-800 text-center flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold text-stone-500 dark:text-stone-400 text-drop-subtle">
                  {t.estimatedMonthlyBill}
                </span>
                {/* Accent Sky Blue for key monthly bill cost number */}
                <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-sky-500 dark:text-sky-400 font-mono tracking-tight text-drop-subtle">
                  {formatCurrency(totalCost)}
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-400 mt-1 font-bold">
                  ~{totalKwh.toFixed(1)} kWh {t.perMonth}
                </div>
                <div className="mt-3 inline-block px-3 py-1 rounded-full text-[11px] bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono font-bold border border-stone-200 dark:border-stone-700 shadow-xs">
                  {t.basedOnRate} ฿{gridRate.toFixed(2)} / kWh
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-700">
                <button
                  type="button"
                  onClick={onLaunchDashboard}
                  className="w-full py-3 px-4 rounded-2xl btn-tactile-sky text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer text-drop-subtle"
                >
                  <span>{t.openFullDashboardToCustomize}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
