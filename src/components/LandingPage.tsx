import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Zap,
  Cpu,
  PieChart,
  SlidersHorizontal,
  Smartphone,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { HeroLightBulb } from './HeroLightBulb';
import { EnergyCalculator } from './EnergyCalculator';
import { UserProfile, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface LandingPageProps {
  isDark: boolean;
  onToggleTheme: () => void;
  lang: Language;
  user: UserProfile | null;
  onOpenGoogleAuth: () => void;
  onLaunchDashboard: () => void;
  onSignOut: () => void;
  gridRate: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  isDark,
  onToggleTheme,
  lang,
  user,
  onOpenGoogleAuth,
  onLaunchDashboard,
  onSignOut,
  gridRate,
}) => {
  const t = TRANSLATIONS[lang];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqItems = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
  ];

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] dark:bg-[#0e0e11] text-stone-900 dark:text-stone-100 transition-colors duration-300">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-stone-200/80 dark:border-stone-800/80">
        {/* Subtle Minimalist Aura with Yellow Light & Sky Blue Highlights */}
        <div className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-20">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] bg-gradient-to-tr from-amber-300/30 via-yellow-200/20 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 relative z-10 flex flex-col items-center">
          {/* Top Badge (Eggshell white surface, Amber icon & text) */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[#FFFDF9] dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-stone-800 dark:text-stone-200 mb-5 shadow-xs text-drop-subtle">
            <span className="text-amber-500">💡</span>
            <span>{t.heroBadge}</span>
          </div>

          {/* Main Headline: Bold font with soft text shadow and Yellow/Sky highlights */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-center max-w-3xl text-balance leading-tight text-stone-900 dark:text-stone-50 text-drop-subtle">
            {t.heroTitlePrefix}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-400 to-sky-500 dark:from-yellow-400 dark:via-amber-300 dark:to-sky-400">
              {t.heroTitleHighlight}
            </span>
          </h1>

          {/* Subtitle with bold readability */}
          <p className="mt-4 text-sm sm:text-lg text-stone-600 dark:text-stone-300 text-center max-w-2xl text-balance font-medium text-drop-subtle">
            {t.heroSubtitle}
          </p>

          {/* Center Light Bulb (Vibrant Yellow Secondary Illumination) & Google Login CTA */}
          <div className="w-full mt-3">
            <HeroLightBulb
              isDark={isDark}
              onToggleTheme={onToggleTheme}
              lang={lang}
              user={user}
              onOpenGoogleAuth={onOpenGoogleAuth}
              onLaunchDashboard={onLaunchDashboard}
              onSignOut={onSignOut}
            />
          </div>

          {/* Claim-to-Proof Quantitative Metric Strip: Sky Blue Accent (สีฟ้า Accent) */}
          <div className="w-full max-w-3xl mt-8 pt-8 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center p-3">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-500 dark:text-sky-400 text-drop-subtle">
                {t.metric1Val}
              </span>
              <span className="text-xs text-stone-600 dark:text-stone-300 mt-1 font-bold text-drop-subtle">
                {t.metric1Label}
              </span>
            </div>
            <div className="flex flex-col items-center p-3">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-500 dark:text-sky-400 text-drop-subtle">
                {t.metric2Val}
              </span>
              <span className="text-xs text-stone-600 dark:text-stone-300 mt-1 font-bold text-drop-subtle">
                {t.metric2Label}
              </span>
            </div>
            <div className="flex flex-col items-center p-3">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-500 dark:text-sky-400 text-drop-subtle">
                {t.metric3Val}
              </span>
              <span className="text-xs text-stone-600 dark:text-stone-300 mt-1 font-bold text-drop-subtle">
                {t.metric3Label}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE QUICK CALCULATOR TEASER */}
      <EnergyCalculator
        lang={lang}
        gridRate={gridRate}
        onLaunchDashboard={onLaunchDashboard}
      />

      {/* CORE CAPABILITIES & BENTO FEATURES: Minimalist Eggshell & Yellow Light / Sky Blue Accents */}
      <section id="features" className="py-14 sm:py-20 bg-[#FAF7F2] dark:bg-[#121216] border-y border-stone-200 dark:border-stone-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FFFDF9] dark:bg-stone-900 text-amber-600 dark:text-amber-400 border border-stone-200 dark:border-stone-800 mb-3 shadow-xs text-drop-subtle">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.navFeatures}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 text-drop-subtle">
              {t.featuresTitle}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-400 font-medium">
              {t.featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bento Card 1: AI Temperature Sync */}
            <div className="bg-[#FFFDF9] dark:bg-[#18181f] rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400 flex items-center justify-center mb-5 border border-amber-100 dark:border-amber-900">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-stone-900 dark:text-stone-100 mb-2 text-drop-subtle">
                {t.feat1Title}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                {t.feat1Desc}
              </p>
            </div>

            {/* Bento Card 2: Doughnut Chart */}
            <div className="bg-[#FFFDF9] dark:bg-[#18181f] rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-500 dark:text-sky-400 flex items-center justify-center mb-5 border border-sky-100 dark:border-sky-900">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-stone-900 dark:text-stone-100 mb-2 text-drop-subtle">
                {t.feat2Title}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                {t.feat2Desc}
              </p>
            </div>

            {/* Bento Card 3: Custom Rates */}
            <div className="bg-[#FFFDF9] dark:bg-[#18181f] rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400 flex items-center justify-center mb-5 border border-amber-100 dark:border-amber-900">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-stone-900 dark:text-stone-100 mb-2 text-drop-subtle">
                {t.feat3Title}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                {t.feat3Desc}
              </p>
            </div>

            {/* Bento Card 4: Mobile First */}
            <div className="bg-[#FFFDF9] dark:bg-[#18181f] rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-500 dark:text-sky-400 flex items-center justify-center mb-5 border border-sky-100 dark:border-sky-900">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-stone-900 dark:text-stone-100 mb-2 text-drop-subtle">
                {t.feat4Title}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                {t.feat4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS: 3 STEPS */}
      <section id="how-it-works" className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 text-drop-subtle">
              {t.howTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative flex flex-col p-6 rounded-3xl bg-[#FFFDF9] dark:bg-[#18181f] border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="font-mono text-3xl font-extrabold text-sky-500 dark:text-sky-400 mb-3 text-drop-subtle">
                {t.howStep1Num}
              </div>
              <h3 className="text-lg font-extrabold text-stone-900 dark:text-stone-100 mb-2 text-drop-subtle">
                {t.howStep1Title}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                {t.howStep1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col p-6 rounded-3xl bg-[#FFFDF9] dark:bg-[#18181f] border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="font-mono text-3xl font-extrabold text-amber-500 dark:text-amber-400 mb-3 text-drop-subtle">
                {t.howStep2Num}
              </div>
              <h3 className="text-lg font-extrabold text-stone-900 dark:text-stone-100 mb-2 text-drop-subtle">
                {t.howStep2Title}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                {t.howStep2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col p-6 rounded-3xl bg-[#FFFDF9] dark:bg-[#18181f] border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="font-mono text-3xl font-extrabold text-sky-500 dark:text-sky-400 mb-3 text-drop-subtle">
                {t.howStep3Num}
              </div>
              <h3 className="text-lg font-extrabold text-stone-900 dark:text-stone-100 mb-2 text-drop-subtle">
                {t.howStep3Title}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                {t.howStep3Desc}
              </p>
            </div>
          </div>

          {/* Bottom Launch Banner with Primary Sky Blue Accent Tactile Button */}
          <div className="mt-12 p-8 rounded-3xl bg-[#FFFDF9] dark:bg-[#18181f] border border-stone-200 dark:border-stone-800 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 text-drop-subtle">
                {lang === 'th' ? 'พร้อมเริ่มต้นลดค่าไฟของคุณหรือยัง?' : 'Ready to master your energy costs?'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 font-medium">
                {lang === 'th' ? 'ไม่มีค่าใช้จ่าย เริ่มวิเคราะห์เครื่องใช้ไฟฟ้าของคุณได้ทันที' : 'No cost, start analyzing your devices now.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onLaunchDashboard}
              className="py-3 px-6 rounded-2xl btn-tactile-sky text-white font-extrabold text-sm cursor-pointer whitespace-nowrap flex items-center gap-2 text-drop-subtle"
            >
              <span>{t.launchApp}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section id="faq" className="py-14 sm:py-20 bg-[#FAF7F2] dark:bg-[#101014] border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 text-drop-subtle">
              {t.faqTitle}
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-[#FFFDF9] dark:bg-[#18181f] overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 cursor-pointer text-drop-subtle"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform duration-200 shrink-0 ${
                      openFaqIndex === idx ? 'rotate-180 text-sky-500' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800/80 pt-3 font-medium">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUIET FOOTER */}
      <footer className="py-8 border-t border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500 dark:text-stone-400 bg-[#FAF7F2] dark:bg-[#0e0e11]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-stone-700 dark:text-stone-300 text-drop-subtle">
            <span>Power Profiles</span>
          </div>
          <p className="font-medium">{t.footerCopyright}</p>
        </div>
      </footer>
    </div>
  );
};
