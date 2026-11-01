import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Moon, Sun, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UserProfile, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

export interface HeroLightBulbProps {
  isDark: boolean;
  onToggleTheme: () => void;
  lang: Language;
  user: UserProfile | null;
  onOpenGoogleAuth: () => void;
  onLaunchDashboard: () => void;
  onSignOut: () => void;
}

export type LightBulbHeroProps = HeroLightBulbProps;

export const HeroLightBulb: React.FC<HeroLightBulbProps> = ({
  isDark,
  onToggleTheme,
  lang,
  user,
  onOpenGoogleAuth,
  onLaunchDashboard,
  onSignOut,
}) => {
  const t = TRANSLATIONS[lang];
  const [isHovered, setIsHovered] = useState(false);

  // Play an authentic physical toggle click sound using Web Audio API
  const playSwitchSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isDark ? 560 : 380, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(isDark ? 960 : 200, ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // AudioContext not available or blocked
    }
  };

  const handleBulbClick = () => {
    playSwitchSound();
    onToggleTheme();
  };

  return (
    <div className="relative flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto py-3 sm:py-6">
      {/* Light / Dark Mode Status Tag: Minimalist, Concise ("โหมดมืด" / "โหมดสว่าง") with bold text & subtle shadow */}
      <motion.div
        key={`status-${isDark ? 'dark' : 'light'}`}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide border transition-all duration-300 shadow-xs select-none text-drop-subtle"
        style={{
          backgroundColor: isDark ? 'rgba(245, 158, 11, 0.16)' : '#FFFDF9',
          borderColor: isDark ? 'rgba(245, 158, 11, 0.45)' : '#e5e7eb',
          color: isDark ? '#fde047' : '#0f172a',
          boxShadow: isDark
            ? '0 2px 10px rgba(245, 158, 11, 0.25)'
            : '0 2px 6px rgba(0, 0, 0, 0.05)',
        }}
      >
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{t.darkModeActiveLabel}</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400 animate-spin" style={{ animationDuration: '14s' }} />
            <span>{t.lightModeActiveLabel}</span>
          </>
        )}
      </motion.div>

      {/* CENTERPIECE: Highly Realistic Edison Light Bulb with Vibrant Yellow Illumination (สีเหลืองสดใส Secondary) */}
      <div className="relative my-2 sm:my-4 flex flex-col items-center justify-center">
        {/* Ambient Halo & Volumetric Illumination (Vibrant Yellow Glow) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {isDark ? (
            /* Dark Mode: Gentle, cozy, warm golden-amber ambient soft glow (แสงนวลตาสีเหลืองทอง) */
            <div
              key="warm-ambient-glow"
              className="w-80 h-80 sm:w-[440px] sm:h-[440px] rounded-full animate-warm-glow-yellow transition-all duration-700"
              style={{
                background:
                  'radial-gradient(circle, rgba(245, 158, 11, 0.42) 0%, rgba(217, 119, 6, 0.22) 38%, rgba(180, 83, 9, 0.08) 65%, transparent 75%)',
              }}
            />
          ) : (
            /* Light Mode: Brilliant Sparkling Radiant Yellow shine (เปล่งประกายสีเหลืองสดใส) */
            <div
              key="sparkle-radiant-glow"
              className="w-88 h-88 sm:w-[480px] sm:h-[480px] rounded-full animate-ray-yellow transition-all duration-700"
              style={{
                background:
                  'radial-gradient(circle, rgba(254, 240, 138, 0.95) 0%, rgba(251, 191, 36, 0.62) 35%, rgba(245, 158, 11, 0.28) 58%, transparent 75%)',
              }}
            />
          )}
        </div>

        {/* Sparkling Glints (in Light Mode) */}
        {!isDark && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Rotating Starburst Ray Layer */}
            <div className="w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] animate-sparkle-yellow">
              <svg viewBox="0 0 200 200" className="w-full h-full opacity-80">
                <defs>
                  <linearGradient id="rayGradYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.95" />
                    <stop offset="45%" stopColor="#fbbf24" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                  <line
                    key={deg}
                    x1="100"
                    y1="100"
                    x2={100 + 92 * Math.cos((deg * Math.PI) / 180)}
                    y2={100 + 92 * Math.sin((deg * Math.PI) / 180)}
                    stroke="url(#rayGradYellow)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeDasharray="4 8"
                  />
                ))}
              </svg>
            </div>

            {/* Radiant Sparkle Stars around the bulb (Vibrant Yellow Glints) */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8], rotate: [0, 45, 0] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
              className="absolute -top-3 -right-4 sm:-top-5 sm:-right-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]"
            >
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
            </motion.div>
            <motion.div
              animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.85, 0.5, 0.85], rotate: [0, -30, 0] }}
              transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut', delay: 0.6 }}
              className="absolute bottom-2 -left-4 sm:bottom-4 sm:-left-8 text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.9)]"
            >
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
            </motion.div>
          </div>
        )}

        {/* Soft Ambient Floating Motes (in Dark Mode) */}
        {isDark && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4], y: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute top-2 right-6"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 blur-[1px]" />
            </motion.div>
            <motion.div
              animate={{ opacity: [0.25, 0.75, 0.25], y: [3, -3, 3] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-8 left-8"
            >
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 blur-[2px]" />
            </motion.div>
          </div>
        )}

        {/* Clickable Realistic Physical Light Bulb SVG */}
        <motion.button
          type="button"
          aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          title={t.tapBulbHint}
          onClick={handleBulbClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="relative z-10 cursor-pointer group focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/50 rounded-full p-2 transition-transform duration-200"
        >
          <svg
            width="240"
            height="320"
            viewBox="0 0 240 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-52 h-72 sm:w-60 sm:h-80 md:w-68 md:h-92 drop-shadow-2xl transition-all duration-500"
          >
            <defs>
              {/* Glass Envelope Radial Gradient with Vibrant Yellow Secondary Illumination */}
              <radialGradient id="realBulbGlassYellow" cx="48%" cy="36%" r="62%">
                {isDark ? (
                  <>
                    <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.32" />
                    <stop offset="35%" stopColor="#fef3c7" stopOpacity="0.18" />
                    <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.25" />
                    <stop offset="92%" stopColor="#b45309" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.55" />
                  </>
                ) : (
                  <>
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
                    <stop offset="30%" stopColor="#fef9c3" stopOpacity="0.82" />
                    <stop offset="68%" stopColor="#fde047" stopOpacity="0.45" />
                    <stop offset="90%" stopColor="#f59e0b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0.35" />
                  </>
                )}
              </radialGradient>

              {/* Realistic Filament Glow Filter in Vibrant Yellow */}
              <filter id="realFilamentGlowYellow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation={isDark ? "3.5" : "6.5"} result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Metallic Brass Base Cylinder Gradient */}
              <linearGradient id="brassCylinderYellow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#78350f" />
                <stop offset="15%" stopColor="#b45309" />
                <stop offset="35%" stopColor="#fde047" />
                <stop offset="55%" stopColor="#f59e0b" />
                <stop offset="85%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>

              {/* Brass Thread Highlight Strip */}
              <linearGradient id="threadHighlightYellow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#92400e" />
                <stop offset="30%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>

              {/* Specular Glare Arc Gradient */}
              <linearGradient id="specularArcYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={isDark ? "0.6" : "0.95"} />
                <stop offset="40%" stopColor="#ffffff" stopOpacity={isDark ? "0.2" : "0.5"} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>

              {/* Base Contact Gradient */}
              <linearGradient id="baseContactGradYellow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="35%" stopColor="#334155" />
                <stop offset="65%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Glass Envelope (Realistic Edison Contour) */}
            <path
              d="M120 18
                 C180 18, 218 58, 218 116
                 C218 152, 198 180, 172 208
                 C158 222, 152 235, 150 250
                 L90 250
                 C88 235, 82 222, 68 208
                 C42 180, 22 152, 22 116
                 C22 58, 60 18, 120 18 Z"
              fill="url(#realBulbGlassYellow)"
              stroke={isDark ? "rgba(245, 158, 11, 0.45)" : "rgba(251, 191, 36, 0.65)"}
              strokeWidth="2.5"
            />

            {/* Realistic Specular Glare on Curved Glass (Top-Left Shoulder) */}
            <path
              d="M54 62 C68 36, 92 26, 120 26"
              stroke="url(#specularArcYellow)"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M44 85 C38 100, 36 116, 36 130"
              stroke="url(#specularArcYellow)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Subtle Right Specular Rim Reflection */}
            <path
              d="M192 75 C202 92, 206 108, 206 126"
              stroke="#ffffff"
              strokeOpacity={isDark ? "0.2" : "0.5"}
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />

            {/* Internal Glass Stem & Exhaust Mount */}
            <path
              d="M112 250 L112 185 C112 180, 128 180, 128 185 L128 250"
              stroke={isDark ? "rgba(180, 83, 9, 0.6)" : "rgba(217, 119, 6, 0.7)"}
              strokeWidth="2"
              fill="none"
            />
            {/* Glass pinch seal button */}
            <ellipse
              cx="120"
              cy="185"
              rx="15"
              ry="8"
              fill={isDark ? "#d97706" : "#fbbf24"}
              opacity={isDark ? "0.6" : "0.85"}
            />

            {/* Molybdenum Lead Wires */}
            <path
              d="M112 185 L104 150 L88 135 M128 185 L136 150 L152 135"
              stroke={isDark ? "#f59e0b" : "#fbbf24"}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Fine support hooks holding filament loop */}
            <path
              d="M120 185 L120 120 M120 120 L116 115 M120 120 L124 115"
              stroke={isDark ? "#b45309" : "#d97706"}
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Realistic Tungsten Filament Coil with Vibrant Yellow Luminescence */}
            <g filter="url(#realFilamentGlowYellow)">
              {/* Main Hairpin Filament Loop */}
              <path
                d="M88 135
                   C85 105, 100 70, 120 70
                   C140 70, 155 105, 152 135"
                fill="none"
                stroke={isDark ? "#fde047" : "#ffffff"}
                strokeWidth={isDark ? "3.2" : "4.8"}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Coiled-coil micro zigzag details */}
              <path
                d="M92 120 Q104 110 120 110 Q136 110 148 120"
                fill="none"
                stroke={isDark ? "#fbbf24" : "#fef08a"}
                strokeWidth="2.2"
                strokeDasharray="2 3"
              />
              <path
                d="M98 95 Q120 85 142 95"
                fill="none"
                stroke={isDark ? "#fde047" : "#ffffff"}
                strokeWidth="2"
                strokeDasharray="2 3"
              />

              {/* Core Hotspot Luminescence Point */}
              <circle
                cx="120"
                cy="80"
                r={isDark ? "9" : "15"}
                fill={isDark ? "#fbbf24" : "#ffffff"}
                opacity={isDark ? "0.9" : "0.98"}
              />
            </g>

            {/* Realistic Metallic Screw Base (E27 Edison Thread) */}
            <rect x="85" y="250" width="70" height="9" rx="4.5" fill="url(#brassCylinderYellow)" stroke="#78350f" strokeWidth="1" />
            <line x1="88" y1="252" x2="152" y2="252" stroke="url(#threadHighlightYellow)" strokeWidth="1.8" strokeLinecap="round" />

            <rect x="87" y="259" width="66" height="9" rx="4.5" fill="url(#brassCylinderYellow)" stroke="#78350f" strokeWidth="1" />
            <line x1="90" y1="261" x2="150" y2="261" stroke="url(#threadHighlightYellow)" strokeWidth="1.8" strokeLinecap="round" />

            <rect x="89" y="268" width="62" height="9" rx="4.5" fill="url(#brassCylinderYellow)" stroke="#78350f" strokeWidth="1" />
            <line x1="92" y1="270" x2="148" y2="270" stroke="url(#threadHighlightYellow)" strokeWidth="1.8" strokeLinecap="round" />

            <rect x="92" y="277" width="56" height="9" rx="4.5" fill="url(#brassCylinderYellow)" stroke="#78350f" strokeWidth="1" />
            <line x1="95" y1="279" x2="145" y2="279" stroke="url(#threadHighlightYellow)" strokeWidth="1.8" strokeLinecap="round" />

            {/* Black Glass (Vitrite) Insulating Ring */}
            <rect x="98" y="286" width="44" height="6" rx="2" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />

            {/* Solder Foot Contact */}
            <path
              d="M102 292 C102 304, 138 304, 138 292 Z"
              fill="url(#baseContactGradYellow)"
              stroke="#334155"
              strokeWidth="1"
            />
            <ellipse cx="120" cy="298" rx="6" ry="2.5" fill="#cbd5e1" opacity="0.8" />
          </svg>

          {/* Realistic Illumination Puddle on Floor with Vibrant Yellow Light Spill */}
          <div
            className="w-36 h-4 mx-auto rounded-full mt-1 transition-all duration-500"
            style={{
              background: isDark
                ? 'radial-gradient(ellipse, rgba(245, 158, 11, 0.45) 0%, rgba(217, 119, 6, 0.1) 60%, transparent 80%)'
                : 'radial-gradient(ellipse, rgba(254, 240, 138, 0.95) 0%, rgba(251, 191, 36, 0.3) 60%, transparent 80%)',
              filter: 'blur(4px)',
            }}
          />

          {/* Quick Hover Tooltip */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-stone-900/95 dark:bg-stone-800/95 text-stone-100 text-xs font-bold rounded-full shadow-lg border border-stone-700/50 backdrop-blur-sm pointer-events-none text-drop-subtle"
              >
                {t.tapBulbHint}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Tap instruction badge with bold loopless Thai font & subtle shadow */}
      <p className="text-xs text-stone-600 dark:text-stone-400 mt-0 mb-6 flex items-center justify-center gap-1.5 font-bold text-drop-subtle">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>{t.tapBulbHint}</span>
      </p>

      {/* CALL TO ACTION SECTION: Directly Below The Light Bulb (Primary Button: Sky Blue Accent #0284C7) */}
      <div className="w-full max-w-md mx-auto px-4 flex flex-col items-center">
        {user ? (
          /* When Already Logged In: Show Account Summary & Direct Dashboard Launch (Sky Blue Accent) */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-[#FFFDF9] dark:bg-[#16161c] rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center gap-3 mb-4 text-left">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full ring-2 ring-sky-500 object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-500 text-white font-extrabold text-lg flex items-center justify-center shrink-0">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-stone-900 dark:text-stone-100 truncate text-sm sm:text-base text-drop-subtle">
                    {user.name}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate font-medium">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={onLaunchDashboard}
                className="flex-1 flex items-center justify-center gap-2 h-12 px-5 btn-tactile-sky text-white font-extrabold rounded-2xl cursor-pointer text-sm sm:text-base whitespace-nowrap text-drop-subtle"
              >
                <span>{t.launchApp}</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
              <button
                type="button"
                onClick={onSignOut}
                className="h-12 px-4 rounded-2xl btn-tactile-eggshell text-stone-800 dark:text-stone-100 text-xs sm:text-sm font-bold cursor-pointer whitespace-nowrap text-drop-subtle"
              >
                {t.signOut}
              </button>
            </div>
          </motion.div>
        ) : (
          /* When Not Logged In: The Prominent Google Account Login Button with 3D Depth */
          <div className="w-full flex flex-col items-center gap-3">
            {/* Primary Google Login Button (Eggshell white surface with 3D tactile elevation) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenGoogleAuth}
              className="w-full max-w-sm sm:max-w-md h-13 sm:h-14 px-6 rounded-2xl btn-tactile-eggshell text-stone-900 dark:text-stone-100 font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 cursor-pointer group text-drop-subtle"
            >
              {/* Official Google G Logo SVG */}
              <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="truncate">{t.signInWithGoogle}</span>
            </motion.button>

            {/* Hint & Direct Instant Demo Launch Button (Accent Sky Blue: #0284C7) */}
            <div className="flex flex-col items-center gap-1.5 text-center mt-1">
              <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 font-semibold text-drop-subtle">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                <span>{t.signInHint}</span>
              </span>

              {/* Direct Instant Action in Sky Blue Accent */}
              <button
                type="button"
                onClick={onLaunchDashboard}
                className="mt-1 text-xs sm:text-sm font-extrabold text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 underline underline-offset-4 cursor-pointer transition-colors text-drop-subtle"
              >
                {t.quickStartFree} &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Export backward-compatible alias
export const LightBulbHero = HeroLightBulb;
