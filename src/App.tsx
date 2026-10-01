import React, { useState, useEffect } from 'react';

// Types
type FilterMode = 'global' | 'facility';
type UnitSystem = 'metric' | 'imperial';

interface SimulationState {
  facilities: number;
  forkliftsPerFacility: number;
  shiftHours: number;
  hourlyLaborRate: number;
  palletWeightKg: number;
}

export default function App() {
  // Navigation active tab
  const [activeNav, setActiveNav] = useState('vision');
  
  // Human Dividend Filter
  const [dividendFilter, setDividendFilter] = useState<FilterMode>('global');

  // Simulation Unit System (Metric vs Imperial)
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');

  // Live ticking counter for daily hours reclaimed
  const [reclaimedToday, setReclaimedToday] = useState(3427);

  // Modals
  const [showCalculator, setShowCalculator] = useState(false);
  const [showTocModal, setShowTocModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showFinancialPreview, setShowFinancialPreview] = useState(false);

  // Calculator State
  const [sim, setSim] = useState<SimulationState>({
    facilities: 4,
    forkliftsPerFacility: 12,
    shiftHours: 16,
    hourlyLaborRate: 28,
    palletWeightKg: 1840,
  });

  // Purchase modal form state
  const [purchaseEmail, setPurchaseEmail] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Live ticker effect
  useEffect(() => {
    const timer = setInterval(() => {
      setReclaimedToday(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Calculate simulation metrics
  const totalFleetUnits = sim.facilities * sim.forkliftsPerFacility;
  const annualForkliftHours = totalFleetUnits * sim.shiftHours * 350;
  const annualHoursReclaimed = Math.round(annualForkliftHours * 0.92);
  const annualGrossSavings = Math.round(annualHoursReclaimed * sim.hourlyLaborRate);
  const annualNetSavings = Math.round(annualGrossSavings * 0.72); // minus autonomous operating maintenance
  const fatigueEventsAvoided = Math.round(totalFleetUnits * 4.8);

  // Floor weight calculations
  // Average pallet cycles per hour per unit = 22
  const dailyPalletMoves = totalFleetUnits * sim.shiftHours * 22;
  const dailyWeightKg = dailyPalletMoves * sim.palletWeightKg;
  const dailyWeightLbs = dailyWeightKg * 2.20462;
  const liftRatingKg = sim.palletWeightKg;
  const liftRatingLbs = Math.round(sim.palletWeightKg * 2.20462);

  // Operational range calculations
  // Average vehicle speed in active warehouse traffic = 3.6 km/h (2.237 mph)
  const dailyRangeKm = totalFleetUnits * sim.shiftHours * 3.6;
  const dailyRangeMiles = dailyRangeKm * 0.621371;
  const perUnitRangeKm = sim.shiftHours * 3.6;
  const perUnitRangeMiles = perUnitRangeKm * 0.621371;
  const lidarPerimeterM = 15.0;
  const lidarPerimeterFt = 49.2;

  const scrollTo = (id: string, navKey: string) => {
    setActiveNav(navKey);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen selection:bg-primary-container selection:text-on-primary-container font-sans">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#10141a]/85 backdrop-blur-2xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
        <div className="h-20 w-full px-4 sm:px-8 max-w-[1720px] mx-auto flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => scrollTo('hero', 'vision')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="relative w-8 h-8 flex items-center justify-center">
                <img
                  src="/images/logo.png"
                  alt="Vistamation Logo"
                  className="h-8 w-auto object-contain"
                  onError={(e) => {
                    // Fallback to inline logo SVG if image fails
                    (e.target as HTMLElement).style.display = 'none';
                    const fallback = document.getElementById('brand-svg-fallback');
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                <svg
                  id="brand-svg-fallback"
                  className="hidden w-8 h-8"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 18L30 52L40 32" stroke="#00e5ff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M26 18L38 38L52 18" stroke="#ffb874" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="28" cy="38" r="3.5" fill="#00e5ff" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-lg sm:text-xl text-on-surface tracking-tight font-semibold">
                  Vistamation
                </span>
                <span className="font-mono text-[10px] text-primary-fixed-dim uppercase tracking-widest -mt-0.5">
                  Horizon Platform
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-surface-container-lowest/60 p-1 rounded-xl backdrop-blur-md border border-outline-variant/30">
            <button
              onClick={() => scrollTo('hero', 'vision')}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                activeNav === 'vision'
                  ? 'text-primary-container bg-surface-container-high'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Vision
            </button>
            <button
              onClick={() => scrollTo('fleet-telemetry', 'autonomous-fleet')}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                activeNav === 'autonomous-fleet'
                  ? 'text-primary-container bg-surface-container-high'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Autonomous Fleet
            </button>
            <button
              onClick={() => scrollTo('human-dividend', 'human-impact')}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                activeNav === 'human-impact'
                  ? 'text-primary-container bg-surface-container-high'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Human Impact
            </button>
            <button
              onClick={() => scrollTo('philosophy-flow-on', 'recreation-life')}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                activeNav === 'recreation-life'
                  ? 'text-primary-container bg-surface-container-high'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Recreation &amp; Life
            </button>
            <button
              onClick={() => scrollTo('financial-projections', 'telemetry')}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                activeNav === 'telemetry'
                  ? 'text-primary-container bg-surface-container-high'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Telemetry
            </button>
          </nav>

          {/* Action Button & Avatar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo('executive-pack', 'executive')}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-semibold hover:bg-primary-fixed shadow-[0_0_24px_rgba(0,229,255,0.3)] transition-all text-sm"
            >
              Explore The Future
            </button>
            <button
              onClick={() => setShowCalculator(true)}
              title="Launch Simulation Calculator"
              className="w-9 h-9 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/40 flex items-center justify-center text-primary transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full pt-20">
        <div className="flex flex-col w-full relative overflow-hidden">
          {/* Ambient Background Glows */}
          <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary-container/10 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 -right-24 h-[500px] w-[500px] rounded-full bg-secondary-container/10 blur-[160px]" />

          {/* 1. Panoramic Hero Showcase (16:9 Aspect Ratio) */}
          <section id="hero" className="relative w-full px-4 sm:px-8 pt-6 pb-12">
            <div className="relative mx-auto w-full max-w-[1720px] rounded-3xl overflow-hidden shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85)] bg-surface-container-lowest border border-outline-variant/30">
              <div className="relative w-full aspect-[21/9] min-h-[580px] max-h-[820px] overflow-hidden flex items-end">
                {/* Background Visual */}
                <img
                  src="/images/warehouse-hero.jpg"
                  alt="Autonomous forklift system operating precisely inside modern illuminated industrial facility"
                  className="absolute inset-0 h-full w-full object-cover object-center scale-[1.02] transform transition-transform duration-1000 ease-out hover:scale-100"
                  onError={(e) => {
                    // Fallback to CDN URL if local path fails
                    (e.target as HTMLImageElement).src =
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuD4Eb2AkPwZ_rKgKuPipoufMqHn2a59UJ4SW6yrih_eKFGDGSNaIGnWOG9C0y0NeiBmgYwQ81gv0cWHGxBsEQlOCpnN50QOTPRByiXyy2wgVxcyGuWj9zOCyx7yVaGLbYHszrGiGJsJwLICcF0WALw-AEWvF3bnZWZ93JV23EcTujkf4Qx2j70__uFGy9vSxCTJW7GyNVbJpvZGliIkm41QQk0QktTbIc6EzjFLXrw8qfviMmdBadZaIQ';
                  }}
                />

                {/* Scrims */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-surface-container-lowest/65 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-surface-container-lowest/40 to-transparent pointer-events-none" />

                {/* Spatial Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="spatial-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary-container/20" />
                        <circle cx="60" cy="0" r="1.5" className="fill-primary-container/40" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#spatial-grid)" />
                  </svg>
                </div>

                {/* Top-Edge Telemetry HUD Chips */}
                <div className="absolute top-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3 z-20">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-lowest/80 border border-outline-variant/40 backdrop-blur-xl shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                    <span className="font-mono text-xs text-primary tracking-widest">UNIT // FL-09 ACTIVE</span>
                    <span className="text-outline-variant font-mono text-xs mx-1">|</span>
                    <span className="font-mono text-xs text-on-surface-variant">PALLET DOCK #14B AUTO-SEQUENCE</span>
                  </div>
                  <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-surface-container-lowest/80 border border-outline-variant/40 backdrop-blur-xl shadow-lg">
                    <span className="font-mono text-xs text-secondary uppercase tracking-widest flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">format_image_left</span> Zero Operator Strain
                    </span>
                    <span className="text-outline-variant font-mono text-xs">|</span>
                    <span className="font-mono text-xs text-primary-fixed-dim">100% SENSOR COVERAGE</span>
                  </div>
                </div>

                {/* Hero Core Content Overlay */}
                <div className="relative z-20 w-full max-w-4xl p-6 md:p-12 flex flex-col items-start gap-4 md:gap-6">
                  {/* Vision Pill */}
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-surface-container-high/80 border border-secondary/30 backdrop-blur-md shadow-md">
                    <span className="material-symbols-outlined text-secondary text-[16px]">schedule</span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-secondary">Vistamation Horizon Protocol</span>
                    <span className="w-1 h-1 rounded-full bg-outline" />
                    <span className="font-mono text-[11px] text-primary uppercase">Autonomous Precision • Human Liberation</span>
                  </div>

                  {/* Main Title */}
                  <h1 className="font-headline-hero text-4xl sm:text-5xl md:text-6xl text-on-surface tracking-tight font-semibold leading-[1.1] drop-shadow-md">
                    Getting Your <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-secondary">
                      Time Back.
                    </span>
                  </h1>

                  <p className="font-body-lg text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                    Autonomous intelligence lifting the burden of tedious, monotonous physical labor — returning millions of quiet hours to human existence for family, recreation, creativity, and living.
                  </p>

                  {/* Actions Bar */}
                  <div className="pt-2 flex flex-wrap items-center gap-4 w-full sm:w-auto">
                    <button
                      onClick={() => scrollTo('human-dividend', 'human-impact')}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-primary-container text-on-primary-container font-semibold hover:bg-primary-fixed shadow-[0_0_28px_rgba(0,229,255,0.4)] transition-all text-sm"
                    >
                      <span>Explore the Human Dividend</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                    </button>
                    <button
                      onClick={() => scrollTo('fleet-telemetry', 'autonomous-fleet')}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-surface-container-high/90 border border-outline-variant/40 text-primary font-medium hover:bg-surface-bright shadow-lg backdrop-blur-md transition-all text-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
                      <span>Inspect Autonomous Fleet</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Visual Edge Metric Tag */}
                <div className="hidden xl:flex absolute bottom-8 right-8 z-20 flex-col gap-2 p-4 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/40 backdrop-blur-2xl shadow-2xl max-w-xs">
                  <div className="flex items-center justify-between text-on-surface-variant font-mono text-[11px]">
                    <span>REAL-TIME STATUS</span>
                    <span className="text-primary font-semibold">GRID ONLINE</span>
                  </div>
                  <div className="text-lg font-semibold text-on-surface">1,840 kg Continuous Lift</div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1 overflow-hidden">
                    <div className="bg-primary-container h-full w-[84%] transition-all duration-500" />
                  </div>
                  <div className="flex justify-between items-center text-xs text-on-surface-variant">
                    <span>Zero Human Hazards</span>
                    <span className="text-secondary font-mono font-medium">99.98% Acc</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Live Operational Telemetry Strip */}
          <section id="fleet-telemetry" className="w-full px-4 sm:px-8 py-3">
            <div className="mx-auto w-full max-w-[1720px] bg-surface-container-low/90 border border-outline-variant/30 rounded-2xl p-4 shadow-xl backdrop-blur-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container/60 border border-outline-variant/20 hover:bg-surface-container transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container shrink-0">
                    <span className="material-symbols-outlined text-[26px]">smart_toy</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-lg sm:text-xl text-on-surface font-semibold tracking-tight">
                      42 Units
                    </span>
                    <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                      Fleet In Autonomous Duty
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container/60 border border-outline-variant/20 hover:bg-surface-container transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container shrink-0">
                    <span className="material-symbols-outlined text-[26px]">bolt</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-lg sm:text-xl text-primary font-semibold tracking-tight">
                      99.98%
                    </span>
                    <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                      Repetitive Cycle Efficiency
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container/60 border border-outline-variant/20 hover:bg-surface-container transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[26px]">radar</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-lg sm:text-xl text-on-surface font-semibold tracking-tight">
                      LiDAR 360°
                    </span>
                    <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                      Collision-Free Perimeter
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container/60 border border-outline-variant/20 hover:bg-surface-container transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[26px]">hourglass_bottom</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className="font-headline-sm text-lg sm:text-xl text-secondary font-semibold tracking-tight font-mono">
                        {reclaimedToday.toLocaleString()}
                      </span>
                      <span className="font-mono text-xs text-secondary">Hrs</span>
                    </div>
                    <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                      Human Rest Reclaimed Today
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. The Human Dividend Metric Cards */}
          <section id="human-dividend" className="w-full px-4 sm:px-8 py-12">
            <div className="mx-auto w-full max-w-[1720px] flex flex-col gap-6">
              {/* Header with Interactive Filter Toggle */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="font-mono text-xs text-secondary uppercase tracking-widest">
                      Direct Socio-Human Impact
                    </span>
                  </div>
                  <h2 className="font-headline-lg text-3xl sm:text-4xl text-on-surface tracking-tight font-semibold">
                    The Human Dividend
                  </h2>
                  <p className="font-body-lg text-sm sm:text-base text-on-surface-variant">
                    Every autonomous turn and pallet racked by AI is time transferred straight back to living souls. Here is the verified human balance sheet.
                  </p>
                </div>

                {/* Interactive Filter Buttons */}
                <div className="flex items-center gap-1 p-1 bg-surface-container-low border border-outline-variant/30 rounded-xl">
                  <button
                    onClick={() => setDividendFilter('global')}
                    className={`px-4 py-1.5 rounded-lg font-mono text-xs uppercase transition-all ${
                      dividendFilter === 'global'
                        ? 'bg-surface-container-high text-on-surface font-semibold shadow-sm border border-outline-variant/40'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Global Aggregate
                  </button>
                  <button
                    onClick={() => setDividendFilter('facility')}
                    className={`px-4 py-1.5 rounded-lg font-mono text-xs uppercase transition-all ${
                      dividendFilter === 'facility'
                        ? 'bg-surface-container-high text-on-surface font-semibold shadow-sm border border-outline-variant/40'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Per Facility Avg
                  </button>
                </div>
              </div>

              {/* 4-Card Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Card 1: Hours Returned */}
                <div className="group relative rounded-2xl bg-surface-container-low border border-outline-variant/30 p-6 shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary-container/10 rounded-full blur-2xl group-hover:bg-primary-container/20 transition-all pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between pb-4">
                      <span className="font-mono text-xs text-primary tracking-widest">METRIC // HR-RECLAIM</span>
                      <span className="material-symbols-outlined text-primary text-[24px]">timelapse</span>
                    </div>
                    <div className="font-headline-hero text-4xl sm:text-[44px] leading-tight text-primary tracking-tight font-semibold pb-1">
                      {dividendFilter === 'global' ? '18.4M' : '613K'}
                    </div>
                    <h3 className="text-lg text-on-surface font-semibold pb-1">
                      Hours Returned
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      {dividendFilter === 'global'
                        ? 'Eliminated from grueling 12-hour repetitive warehouse circuits and hazardous physical transit loops globally.'
                        : 'Reclaimed annual hours returned directly to each individual facility workforce across 30 enterprise sites.'}
                    </p>
                  </div>
                  <div className="pt-6">
                    <div className="flex justify-between items-center font-mono text-xs text-on-surface-variant pb-1.5">
                      <span>Annual Goal Progress</span>
                      <span className="text-primary font-semibold">92%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary-container h-full w-[92%] rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Card 2: Family & Presence */}
                <div className="group relative rounded-2xl bg-surface-container-low border border-outline-variant/30 p-6 shadow-lg hover:border-secondary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between pb-4">
                      <span className="font-mono text-xs text-secondary tracking-widest">METRIC // FAMILY-INDEX</span>
                      <span className="material-symbols-outlined text-secondary text-[24px]">favorite</span>
                    </div>
                    <div className="font-headline-hero text-4xl sm:text-[44px] leading-tight text-secondary tracking-tight font-semibold pb-1">
                      +73%
                    </div>
                    <h3 className="text-lg text-on-surface font-semibold pb-1">
                      Family &amp; Presence First
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      Direct increase in family dinner attendance, bedtime presence with children, and peaceful uninterrupted evenings.
                    </p>
                  </div>
                  <div className="pt-6 flex items-center gap-2 p-2.5 rounded-lg bg-surface-container border border-outline-variant/20">
                    <span className="material-symbols-outlined text-secondary text-[18px]">dinner_dining</span>
                    <span className="text-xs text-on-surface font-medium">
                      {dividendFilter === 'global' ? 'Over 240,000 shared family dinners weekly' : '8,000+ family dinners restored per facility'}
                    </span>
                  </div>
                </div>

                {/* Card 3: Zero Fatigue Hazards */}
                <div className="group relative rounded-2xl bg-surface-container-low border border-outline-variant/30 p-6 shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between pb-4">
                      <span className="font-mono text-xs text-primary tracking-widest">METRIC // SAFETY-EXPONENTIAL</span>
                      <span className="material-symbols-outlined text-primary text-[24px]">health_and_safety</span>
                    </div>
                    <div className="font-headline-hero text-4xl sm:text-[44px] leading-tight text-on-surface tracking-tight font-semibold pb-1">
                      Zero
                    </div>
                    <h3 className="text-lg text-on-surface font-semibold pb-1">
                      Fatigue Hazards
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      Lumbar strain, crush vectors, and high-altitude pallet drops completely transitioned to autonomous steel chassis.
                    </p>
                  </div>
                  <div className="pt-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-primary font-mono text-xs">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span>100% Zero Human Heavy-Lifting</span>
                    </div>
                  </div>
                </div>

                {/* Card 4: Recreation & Life Index */}
                <div className="group relative rounded-2xl bg-surface-container-low border border-outline-variant/30 p-6 shadow-lg hover:border-secondary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between pb-4">
                      <span className="font-mono text-xs text-secondary tracking-widest">METRIC // LIFE-INDEX</span>
                      <span className="material-symbols-outlined text-secondary text-[24px]">paragliding</span>
                    </div>
                    <div className="font-headline-hero text-4xl sm:text-[44px] leading-tight text-secondary tracking-tight font-semibold pb-1">
                      4.9<span className="text-lg font-normal text-on-surface-variant">/5.0</span>
                    </div>
                    <h3 className="text-lg text-on-surface font-semibold pb-1">
                      Recreation &amp; Life Index
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      Operators elevated into telemetry supervisors, sports coaches, outdoor enthusiasts, and lifelong learners.
                    </p>
                  </div>
                  <div className="pt-6 flex items-center justify-between text-xs text-on-surface-variant border-t border-outline-variant/20 pt-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Wellness
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Mentorship
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary" /> Hobbies
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. "From Monotony to Meaning": Dual Comparison Canvas */}
          <section className="w-full px-4 sm:px-8 py-12">
            <div className="mx-auto w-full max-w-[1720px] rounded-3xl bg-surface-container-lowest border border-outline-variant/40 p-6 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col gap-1 mb-8">
                <span className="font-mono text-xs text-primary tracking-widest uppercase">The Paradigm Shift</span>
                <h2 className="font-headline-lg text-3xl sm:text-4xl text-on-surface tracking-tight font-semibold">
                  From Monotony to Meaning
                </h2>
                <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl">
                  Compare the reality of outdated manual warehouse operations against the autonomous dignity realized under Vistamation's Horizon platform.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel: Legacy Warehousing */}
                <div className="rounded-2xl bg-surface-container-low/70 border border-error-container/30 p-6 sm:p-8 flex flex-col justify-between shadow-md">
                  <div>
                    <div className="flex items-center justify-between pb-6 border-b border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-error" />
                        <span className="font-mono text-xs text-error tracking-wider uppercase font-semibold">
                          Legacy Warehousing
                        </span>
                      </div>
                      <span className="font-mono text-xs text-on-surface-variant">THE PHYSICAL TOLL</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl text-on-surface font-semibold pt-4 pb-2">
                      Monotonous, Depleting Labor
                    </h3>
                    <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                      Human beings forced to mimic machines — conducting repetitive mechanical loops across endless fluorescent aisles, driving cumulative physical attrition.
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-error-container/40 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-error text-[16px]">close</span>
                        </div>
                        <div>
                          <span className="text-base text-on-surface font-medium block">10-12 Hour Forklift Circuits</span>
                          <span className="text-xs sm:text-sm text-on-surface-variant">Staring at identical concrete racks, high risk of micro-sleep and repetitive strain injuries.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-error-container/40 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-error text-[16px]">close</span>
                        </div>
                        <div>
                          <span className="text-base text-on-surface font-medium block">Chronic Mental &amp; Physical Fatigue</span>
                          <span className="text-xs sm:text-sm text-on-surface-variant">Arriving home exhausted with zero emotional bandwidth left for partners, children, or self-care.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-error-container/40 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-error text-[16px]">close</span>
                        </div>
                        <div>
                          <span className="text-base text-on-surface font-medium block">Hazard Exposure &amp; Blind Spots</span>
                          <span className="text-xs sm:text-sm text-on-surface-variant">Constant occupational hazard of falling loads, blind intersections, and ergonomic damage.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 bg-surface-container-high/40 border border-outline-variant/30 p-4 rounded-xl flex items-center justify-between">
                    <span className="font-mono text-xs text-on-surface-variant">HUMAN COST</span>
                    <span className="font-mono text-xs sm:text-sm text-error font-medium">8.4 Hours/Day Consumed in Monotony</span>
                  </div>
                </div>

                {/* Right Panel: The Vistamation Era */}
                <div className="rounded-2xl bg-surface-container/90 border border-primary-container/40 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between pb-6 border-b border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary-container animate-pulse" />
                        <span className="font-mono text-xs text-primary tracking-wider uppercase font-semibold">
                          The Vistamation Era
                        </span>
                      </div>
                      <span className="font-mono text-xs text-secondary font-semibold">RECLAIMED HUMAN LIFE</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl text-on-surface font-semibold pt-4 pb-2">
                      Liberated, Dignified Living
                    </h3>
                    <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                      Machines handle the cold steel and heavy tonnage. Humans manage high-level telemetry, mentor operations, and walk out into daylight with vitality intact.
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-primary-container text-[16px]">check</span>
                        </div>
                        <div>
                          <span className="text-base text-on-surface font-medium block">Dinner at 5:30 PM With Loved Ones</span>
                          <span className="text-xs sm:text-sm text-on-surface-variant">Consistent daylight hours and predictable shifts allow people to genuinely be present for dinner and milestones.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-primary-container text-[16px]">check</span>
                        </div>
                        <div>
                          <span className="text-base text-on-surface font-medium block">Supervisory &amp; Strategic Roles</span>
                          <span className="text-xs sm:text-sm text-on-surface-variant">Operators upskill into autonomous fleet orchestrators, diagnostics monitors, and optimization leaders.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-secondary text-[16px]">sports_soccer</span>
                        </div>
                        <div>
                          <span className="text-base text-on-surface font-medium block">Energy for Recreation &amp; Sports</span>
                          <span className="text-xs sm:text-sm text-on-surface-variant">Reclaiming physical vitality for trail runs, coaching youth soccer, art, music, and deep community roots.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 bg-surface-container-high/80 border border-primary-container/30 p-4 rounded-xl flex items-center justify-between shadow-inner">
                    <span className="font-mono text-xs text-secondary font-semibold">HUMAN DIVIDEND</span>
                    <span className="font-mono text-xs sm:text-sm text-primary-fixed-dim font-medium">+100% Vital Energy Restored</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. The Flow-On Effect: Nurturing Life at the Core (Featuring Mother Cat & Kittens) */}
          <section id="philosophy-flow-on" className="w-full px-4 sm:px-8 py-12">
            <div className="mx-auto w-full max-w-[1720px] rounded-3xl bg-surface-container-low/90 border border-secondary/20 p-6 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="pointer-events-none absolute -top-12 -right-12 h-96 w-96 rounded-full bg-secondary-container/15 blur-[140px]" />
              <div className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-primary-container/10 blur-[120px]" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
                {/* Visual Frame */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group border border-secondary/30 bg-surface-container-lowest">
                  <img
                    src="/images/mother-cat.jpg"
                    alt="Cinematic photography of a gentle mother cat lovingly curled around her four newborn kittens in warm golden light"
                    className="w-full h-full max-h-[480px] object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuD0VNvQCjSI93vGCgogM1aEpbsMvEOtXcyOc4n11IEoR542-jbkvmiWqzonSFr-MWtda6Oyr538THg3OwgU17ULelVPZW1RFMPoLMK6pQsqlABU152OwSIugqh-pAB9gy42_1RR9wUjRfiV05vZUFf91HwAY7Gy6eWOHVBojakjEsJD_8cW0gmtPHlzLXXgXWLyn8Klz9jf78Y7uJeeOUUs0x9ihNhV2UM_V8-Dr-7HgA7vPwdtnpMtfQ';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-20">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-xl shadow-lg border border-secondary/30">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                      <span className="font-mono text-[10px] sm:text-xs text-secondary tracking-widest">
                        SYMBOL // 01 · NURTURE &amp; EXPAND
                      </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-xl shadow-lg border border-outline-variant/30">
                      <span className="material-symbols-outlined text-secondary text-[14px]">nest_cam_wired_stand</span>
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                        CORE ETHOS · THE FLOW-ON PRINCIPLE
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between bg-surface-container-lowest/85 backdrop-blur-xl p-3 rounded-xl border border-secondary/20">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-[18px]">pets</span>
                      </div>
                      <span className="font-mono text-xs text-on-surface font-semibold tracking-wide">
                        LIVING EMBLEM · MOTHER &amp; 4 KITTENS
                      </span>
                    </div>
                    <span className="font-mono text-xs text-secondary font-semibold">
                      100% CAREGIVER ENERGY RESTORED
                    </span>
                  </div>
                </div>

                {/* Narrative Right Side */}
                <div className="flex flex-col gap-5">
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-secondary-container/15 border border-secondary/30 backdrop-blur-md shadow-md w-fit">
                    <span className="material-symbols-outlined text-secondary text-[16px]">family_restroom</span>
                    <span className="font-mono text-xs uppercase tracking-wider text-secondary">
                      Brand Philosophy &amp; Core Values
                    </span>
                  </div>

                  <h2 className="font-headline-lg text-3xl sm:text-4xl text-on-surface tracking-tight font-semibold leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-secondary-fixed to-primary">
                      The Flow-On Effect:
                    </span>
                    <br />
                    Nurturing Life at the Core
                  </h2>

                  <div className="p-4 rounded-xl bg-surface-container border-l-2 border-secondary shadow-sm">
                    <p className="text-lg text-secondary font-medium tracking-tight italic">
                      “Taking Care of Life, So Love Has a Flow-On Effect”
                    </p>
                  </div>

                  <p className="font-body-lg text-sm sm:text-base text-on-surface-variant leading-relaxed">
                    Autonomous precision in the warehouse is never about efficiency for its own sake—it exists to protect life, restore gentle presence, and give every worker the unhurried capacity to nurture their families, pets, and communities so care ripples across generations.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-high/40 border border-outline-variant/30">
                      <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary-container shrink-0">
                        <span className="material-symbols-outlined text-[18px]">shield_heart</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-on-surface font-semibold">Protective Foundation</span>
                        <span className="text-xs text-on-surface-variant">Zero strain loops so bodies remain healthy and capable for those who depend on them.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-high/40 border border-outline-variant/30">
                      <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                        <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-on-surface font-semibold">Generational Care</span>
                        <span className="text-xs text-on-surface-variant">Patience, emotional calm, and devotion carried back through every front door daily.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Mission Statement & Value Architecture (4 Pillars) */}
          <section id="mission-values" className="w-full px-4 sm:px-8 py-12">
            <div className="mx-auto w-full max-w-[1720px] rounded-3xl bg-surface-container-lowest border border-outline-variant/40 p-6 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="pointer-events-none absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-primary-container/10 blur-[140px]" />
              <div className="pointer-events-none absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-secondary-container/15 blur-[160px]" />

              <div className="relative z-10 flex flex-col gap-6 md:gap-8">
                <div className="flex flex-col gap-1 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-surface-container-high/80 border border-secondary/30 backdrop-blur-md shadow-md w-fit">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="font-mono text-xs uppercase tracking-widest text-secondary">Governance &amp; Purpose</span>
                    <span className="w-1 h-1 rounded-full bg-outline" />
                    <span className="font-mono text-xs text-primary tracking-wider uppercase">Ethical Framework</span>
                  </div>
                  <h2 className="font-headline-lg text-3xl sm:text-4xl text-on-surface tracking-tight font-semibold">
                    Mission Statement &amp; Value Architecture
                  </h2>
                  <p className="text-sm sm:text-base text-on-surface-variant">
                    The structural philosophical pillars anchoring Vistamation's engineering decisions, robotics design, and socio-human metric tracking.
                  </p>
                </div>

                {/* Mission Callout Card */}
                <div className="relative rounded-2xl bg-surface-container/70 border border-primary-container/40 p-6 md:p-8 shadow-[0_0_24px_rgba(0,229,255,0.15)] backdrop-blur-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[28px]">verified</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-primary font-semibold tracking-widest uppercase">
                          Official Charter // 2025–2035
                        </span>
                        <span className="text-outline-variant font-mono text-xs">|</span>
                        <span className="font-mono text-xs text-secondary uppercase">Board Ratified</span>
                      </div>
                      <p className="text-base sm:text-xl text-on-surface font-medium leading-relaxed">
                        <span className="text-primary font-semibold">Mission Statement:</span> “To liberate human potential from monotonous, hazardous labor through intelligent autonomous logistics—returning time, physical vitality, and presence back to people, so life and care flourish across families and communities.”
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Pillar 1 */}
                  <div className="rounded-2xl bg-surface-container-low/90 p-6 border border-secondary/20 shadow-lg flex flex-col justify-between hover:bg-surface-container transition-all">
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary">
                          <span className="material-symbols-outlined text-[22px]">pets</span>
                        </div>
                        <span className="font-mono text-xs text-secondary tracking-widest font-semibold">PILLAR // 01</span>
                      </div>
                      <h3 className="text-lg text-on-surface font-semibold pt-1">Nurturing the Caregiver</h3>
                      <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                        Illustrated by our emblem of the mother cat &amp; four kittens. When technology protects physical energy, love and presence naturally flow onward to families, pets, and children.
                      </p>
                    </div>
                    <div className="pt-4 flex items-center gap-1.5 text-secondary font-mono text-xs">
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      <span>The Flow-On Principle</span>
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className="rounded-2xl bg-surface-container-low/90 p-6 border border-primary/20 shadow-lg flex flex-col justify-between hover:bg-surface-container transition-all">
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container">
                          <span className="material-symbols-outlined text-[22px]">accessibility_new</span>
                        </div>
                        <span className="font-mono text-xs text-primary tracking-widest font-semibold">PILLAR // 02</span>
                      </div>
                      <h3 className="text-lg text-on-surface font-semibold pt-1">Dignity Over Depletion</h3>
                      <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                        Autonomous AI carries the steel and concrete; humans command strategic telemetry and return home unexhausted with mental bandwidth intact.
                      </p>
                    </div>
                    <div className="pt-4 flex items-center gap-1.5 text-primary font-mono text-xs">
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      <span>Elevated Telemetry Roles</span>
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="rounded-2xl bg-surface-container-low/90 p-6 border border-secondary/20 shadow-lg flex flex-col justify-between hover:bg-surface-container transition-all">
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary">
                          <span className="material-symbols-outlined text-[22px]">hourglass_empty</span>
                        </div>
                        <span className="font-mono text-xs text-secondary tracking-widest font-semibold">PILLAR // 03</span>
                      </div>
                      <h3 className="text-lg text-on-surface font-semibold pt-1">Generational Time Sovereignty</h3>
                      <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                        We measure true corporate success not merely in pallet throughput, but in millions of quiet dinner hours restored to human life and family tables.
                      </p>
                    </div>
                    <div className="pt-4 flex items-center gap-1.5 text-secondary font-mono text-xs">
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      <span>Reclaimed Human Hours</span>
                    </div>
                  </div>

                  {/* Pillar 4 */}
                  <div className="rounded-2xl bg-surface-container-low/90 p-6 border border-primary/20 shadow-lg flex flex-col justify-between hover:bg-surface-container transition-all">
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container">
                          <span className="material-symbols-outlined text-[22px]">shield</span>
                        </div>
                        <span className="font-mono text-xs text-primary tracking-widest font-semibold">PILLAR // 04</span>
                      </div>
                      <h3 className="text-lg text-on-surface font-semibold pt-1">Zero-Hazard Safeguarding</h3>
                      <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                        Uncompromising physical security through 360° LiDAR perception, eliminating cumulative strain, blind-spot collisions, and workplace hazards forever.
                      </p>
                    </div>
                    <div className="pt-4 flex items-center gap-1.5 text-primary font-mono text-xs">
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      <span>Zero Human Hazards</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. 5-Year Strategic & Human Impact Projections (2025–2029) */}
          <section id="financial-projections" className="w-full px-4 sm:px-8 py-12">
            <div className="mx-auto w-full max-w-[1720px] rounded-3xl bg-surface-container-low/95 border border-primary/20 p-6 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-primary-container/10 blur-[140px]" />
              <div className="pointer-events-none absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-secondary-container/15 blur-[160px]" />

              <div className="relative z-10 flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="flex flex-col gap-1 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-surface-container-high border border-primary/30 backdrop-blur-md shadow-md w-fit">
                      <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                      <span className="font-mono text-xs uppercase tracking-widest text-primary">
                        FINANCIAL MODELING // 2025–2029 DUAL-DIVIDEND ARCHITECTURE
                      </span>
                    </div>
                    <h2 className="font-headline-lg text-3xl sm:text-4xl text-on-surface tracking-tight font-semibold leading-tight">
                      5-Year Strategic &amp; Human Impact Projections
                    </h2>
                    <p className="text-sm sm:text-base text-on-surface-variant">
                      Quantifying the compounding returns of autonomous fleet scalability, operational cost reduction, and human life hours restored.
                    </p>
                  </div>

                  <div className="hidden md:flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/40">
                    <span className="material-symbols-outlined text-primary text-[20px]">trending_up</span>
                    <span className="font-mono text-xs text-on-surface-variant">30-Facility Enterprise Scaled Model</span>
                  </div>
                </div>

                {/* 4 Executive Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="group rounded-2xl bg-surface-container-lowest/90 border border-primary/20 p-6 shadow-lg hover:border-primary/40 transition-all flex flex-col justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between pb-1">
                        <span className="font-mono text-xs text-primary tracking-widest">CUMULATIVE SAVINGS</span>
                        <span className="material-symbols-outlined text-primary text-[22px]">monetization_on</span>
                      </div>
                      <div className="font-headline-hero text-4xl leading-tight text-primary font-semibold tracking-tight">$48.6M</div>
                      <h4 className="text-base text-on-surface font-semibold">Net Operational Savings</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">Cumulative net gains modeled across standard 30-facility deployment through reduced downtime and maximized floor utilization.</p>
                    </div>
                    <div className="pt-4 flex items-center gap-1.5 text-primary font-mono text-xs">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span>Y5 OpEx: -$1.62M/facility</span>
                    </div>
                  </div>

                  <div className="group rounded-2xl bg-surface-container-lowest/90 border border-secondary/20 p-6 shadow-lg hover:border-secondary/40 transition-all flex flex-col justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between pb-1">
                        <span className="font-mono text-xs text-secondary tracking-widest">HUMAN CAPITAL RECLAIMED</span>
                        <span className="material-symbols-outlined text-secondary text-[22px]">nest_clock_farsight_analog</span>
                      </div>
                      <div className="font-headline-hero text-4xl leading-tight text-secondary font-semibold tracking-tight">92.4M Hrs</div>
                      <h4 className="text-base text-on-surface font-semibold">Returned to Family &amp; Recreation</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">Direct elimination of 12-hour repetitive cycles, returning waking hours to life, emotional recovery, and family tables.</p>
                    </div>
                    <div className="pt-4 flex items-center gap-1.5 text-secondary font-mono text-xs">
                      <span className="material-symbols-outlined text-[14px]">favorite</span>
                      <span>+73% Sustained Presence</span>
                    </div>
                  </div>

                  <div className="group rounded-2xl bg-surface-container-lowest/90 border border-primary/20 p-6 shadow-lg hover:border-primary/40 transition-all flex flex-col justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between pb-1">
                        <span className="font-mono text-xs text-primary tracking-widest">FLEET CAPACITY</span>
                        <span className="material-symbols-outlined text-primary text-[22px]">precision_manufacturing</span>
                      </div>
                      <div className="font-headline-hero text-4xl leading-tight text-on-surface font-semibold tracking-tight">340+ Units</div>
                      <h4 className="text-base text-on-surface font-semibold">Autonomous Fleet in Service</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">Synchronized active autonomous forklifts and automated guided units coordinating round-the-clock throughput.</p>
                    </div>
                    <div className="pt-4 flex items-center gap-1.5 text-primary font-mono text-xs">
                      <span className="material-symbols-outlined text-[14px]">speed</span>
                      <span>56.0M pallets racked/yr</span>
                    </div>
                  </div>

                  <div className="group rounded-2xl bg-surface-container-lowest/90 border border-secondary/20 p-6 shadow-lg hover:border-secondary/40 transition-all flex flex-col justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between pb-1">
                        <span className="font-mono text-xs text-secondary tracking-widest">SAFETY METRIC</span>
                        <span className="material-symbols-outlined text-secondary text-[22px]">health_and_safety</span>
                      </div>
                      <div className="font-headline-hero text-4xl leading-tight text-secondary font-semibold tracking-tight">Zero</div>
                      <h4 className="text-base text-on-surface font-semibold">Critical Incidents &amp; Fatalities</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">99.994% safety bubble reliability preventing high-velocity tip-overs, dropped pallets, and heavy lumbar strain vectors.</p>
                    </div>
                    <div className="pt-4 flex items-center gap-1.5 text-secondary font-mono text-xs">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      <span>100% OSHA Zero-Harm</span>
                    </div>
                  </div>
                </div>

                {/* 5-Year Dual-Dividend Matrix Table */}
                <div className="rounded-2xl bg-surface-container-lowest/90 border border-outline-variant/50 p-4 sm:p-6 shadow-xl flex flex-col gap-4 overflow-x-auto">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 border-b border-outline-variant/30 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">table_chart</span>
                      <span className="font-mono text-xs text-primary tracking-widest uppercase font-semibold">
                        5-Year Dual-Dividend Matrix (2025–2029)
                      </span>
                    </div>
                    <span className="font-mono text-xs text-on-surface-variant">Forecast Model // Horizon OS v4.8</span>
                  </div>

                  <div className="min-w-[680px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-outline-variant/30 font-mono text-xs text-on-surface-variant uppercase">
                          <th className="py-3 px-4">Metric Indicator</th>
                          <th className="py-3 px-4 text-center">2025 (Y1)</th>
                          <th className="py-3 px-4 text-center">2026 (Y2)</th>
                          <th className="py-3 px-4 text-center">2027 (Y3)</th>
                          <th className="py-3 px-4 text-center">2028 (Y4)</th>
                          <th className="py-3 px-4 text-center text-primary font-semibold">2029 (Y5)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20 font-sans text-xs sm:text-sm">
                        <tr className="hover:bg-surface-container/40 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-2 text-on-surface font-medium">
                            <span className="material-symbols-outlined text-primary text-[18px]">forklift</span>
                            Autonomous Units Active
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">25</td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">70</td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">150</td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">240</td>
                          <td className="py-3 px-4 text-center font-mono text-primary font-semibold">340+</td>
                        </tr>
                        <tr className="hover:bg-surface-container/40 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-2 text-on-surface font-medium">
                            <span className="material-symbols-outlined text-primary text-[18px]">inventory_2</span>
                            Pallets Moved Autonomously
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">3.2M</td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">9.8M</td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">22.4M</td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">38.1M</td>
                          <td className="py-3 px-4 text-center font-mono text-primary font-semibold">56.0M</td>
                        </tr>
                        <tr className="hover:bg-surface-container/40 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-2 text-on-surface font-medium">
                            <span className="material-symbols-outlined text-secondary text-[18px]">payments</span>
                            OpEx Savings per Facility
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">$380K</td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">$620K</td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">$940K</td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">$1.25M</td>
                          <td className="py-3 px-4 text-center font-mono text-secondary font-semibold">$1.62M</td>
                        </tr>
                        <tr className="hover:bg-surface-container/40 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-2 text-on-surface font-medium">
                            <span className="material-symbols-outlined text-secondary text-[18px]">account_balance_wallet</span>
                            Net Cumulative Cash Flow
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-secondary">+$1.8M</td>
                          <td className="py-3 px-4 text-center font-mono text-secondary">+$7.4M</td>
                          <td className="py-3 px-4 text-center font-mono text-secondary">+$19.8M</td>
                          <td className="py-3 px-4 text-center font-mono text-secondary">+$37.9M</td>
                          <td className="py-3 px-4 text-center font-mono text-secondary font-semibold">+$62.1M</td>
                        </tr>
                        <tr className="hover:bg-surface-container/40 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-2 text-on-surface font-medium">
                            <span className="material-symbols-outlined text-primary text-[18px]">family_restroom</span>
                            Human Hours Restored
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-primary">2.1M hrs</td>
                          <td className="py-3 px-4 text-center font-mono text-primary">8.5M hrs</td>
                          <td className="py-3 px-4 text-center font-mono text-primary">24.8M hrs</td>
                          <td className="py-3 px-4 text-center font-mono text-primary">52.3M hrs</td>
                          <td className="py-3 px-4 text-center font-mono text-primary font-semibold">92.4M hrs</td>
                        </tr>
                        <tr className="hover:bg-surface-container/40 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-2 text-on-surface font-medium">
                            <span className="material-symbols-outlined text-secondary text-[18px]">supervisor_account</span>
                            Workforce Transition (Telemetry Roles)
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">42%</td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">68%</td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">85%</td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">94%</td>
                          <td className="py-3 px-4 text-center font-mono text-secondary font-semibold">99%</td>
                        </tr>
                        <tr className="hover:bg-surface-container/40 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-2 text-on-surface font-medium">
                            <span className="material-symbols-outlined text-primary text-[18px]">shield</span>
                            Workplace Fatigue Incidents
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">-65%</td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">-82%</td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">-94%</td>
                          <td className="py-3 px-4 text-center font-mono text-on-surface-variant">-99.2%</td>
                          <td className="py-3 px-4 text-center font-mono text-primary font-semibold">Zero Hazards</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Trajectory Visualizers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  <div className="rounded-2xl bg-surface-container-lowest/80 border border-outline-variant/40 p-6 flex flex-col justify-between gap-4 shadow-lg">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-secondary uppercase tracking-widest font-semibold">
                          COMPOUNDING FINANCIAL TRAJECTORY
                        </span>
                        <span className="material-symbols-outlined text-secondary text-[20px]">bar_chart</span>
                      </div>
                      <h4 className="text-base text-on-surface font-semibold">Exponential ROI vs. Linear Manual Costs</h4>
                      <p className="text-xs text-on-surface-variant">
                        While traditional warehouse labor costs inflate 6.2% annually with severe turnover penalties, autonomous fleet economics yield exponential returns with fixed operational power budgets.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-on-surface">2025 (Y1) Return Ratio</span>
                          <span className="text-primary font-semibold">1.4x Invested</span>
                        </div>
                        <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                          <div className="bg-primary-container h-full rounded-full w-[25%]" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-on-surface">2027 (Y3) Return Ratio</span>
                          <span className="text-primary font-semibold">4.2x Invested</span>
                        </div>
                        <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                          <div className="bg-primary-container h-full rounded-full w-[60%]" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-on-surface">2029 (Y5) Return Ratio</span>
                          <span className="text-secondary font-semibold">8.9x Compounding</span>
                        </div>
                        <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                          <div className="bg-gradient-to-r from-primary-container to-secondary h-full rounded-full w-[95%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-surface-container-lowest/80 border border-outline-variant/40 p-6 flex flex-col justify-between gap-4 shadow-lg">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold">
                          HUMAN ENERGY PRESERVATION ACCELERATOR
                        </span>
                        <span className="material-symbols-outlined text-primary text-[20px]">vital_signs</span>
                      </div>
                      <h4 className="text-base text-on-surface font-semibold">Restored Life Capacity Over Time</h4>
                      <p className="text-xs text-on-surface-variant">
                        Total human rest, family dinner evenings, and injury prevention metrics compound as autonomous pallet circuits expand from primary lines to cross-dock sorting.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-1 text-center">
                      <div className="p-3 rounded-xl bg-surface-container/60 border border-outline-variant/30 flex flex-col items-center justify-center">
                        <span className="text-lg sm:text-xl font-semibold font-mono text-on-surface">2.1M</span>
                        <span className="font-mono text-[10px] text-on-surface-variant uppercase pt-1">Y1 Hours Saved</span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-container/60 border border-outline-variant/30 flex flex-col items-center justify-center">
                        <span className="text-lg sm:text-xl font-semibold font-mono text-primary">24.8M</span>
                        <span className="font-mono text-[10px] text-on-surface-variant uppercase pt-1">Y3 Hours Saved</span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-container/60 border border-secondary/30 flex flex-col items-center justify-center">
                        <span className="text-lg sm:text-xl font-semibold font-mono text-secondary">92.4M</span>
                        <span className="font-mono text-[10px] text-secondary uppercase pt-1">Y5 Hours Saved</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" /> 99% Zero Fatigue Hazards</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-secondary" /> 99% Reclaimed Operator Dignity</span>
                    </div>
                  </div>
                </div>

                {/* Document Outlay Callout */}
                <div className="rounded-2xl bg-surface-container-high/70 border border-primary-container/30 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[26px]">description</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-primary uppercase font-semibold tracking-wider">
                          RAW FINANCIAL MODELS INCLUDED
                        </span>
                        <span className="text-outline-variant font-mono text-xs">|</span>
                        <span className="font-mono text-xs text-secondary font-semibold">EXECUTIVE ASSET PACK</span>
                      </div>
                      <p className="text-xs sm:text-sm text-on-surface-variant max-w-4xl">
                        Comprehensive 5-Year Financial Model (.XLSX / .CSV) available in the $499 Executive Pack, pre-populated with facility headcount calculators, shift multipliers, and battery lifecycle amortization.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFinancialPreview(true)}
                    className="shrink-0 px-6 py-2.5 rounded-lg bg-surface-container-highest border border-primary-container/40 text-primary hover:bg-primary-container hover:text-on-primary-container font-semibold transition-all shadow-md flex items-center gap-2 text-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">analytics</span>
                    <span>Preview Financial Model</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 8. The Vistamation Manifesto Quote Banner */}
          <section className="w-full px-4 sm:px-8 py-12">
            <div className="mx-auto w-full max-w-[1720px] rounded-3xl bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-low border border-outline-variant/30 p-8 md:p-12 relative overflow-hidden shadow-2xl">
              <div className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full bg-primary-container/10 blur-[100px]" />
              <div className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 rounded-full bg-secondary-container/15 blur-[120px]" />

              <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest border border-secondary/30 flex items-center justify-center shadow-lg text-secondary">
                  <span className="material-symbols-outlined text-[28px]">format_quote</span>
                </div>

                <h3 className="font-headline-md text-2xl sm:text-3xl md:text-4xl font-semibold text-on-surface leading-snug tracking-tight">
                  “Technology shouldn’t accelerate human exhaustion; it should liberate human potential. When autonomous machines carry the crates, human beings can carry the conversation at the dinner table.”
                </h3>

                <div className="flex flex-col items-center gap-1 pt-2">
                  <span className="text-base sm:text-lg text-primary font-semibold">The Vistamation Manifesto</span>
                  <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
                    Engineering for Human Liberation • Horizon Platform
                  </span>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-sm text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
                    <span>Cognitive Elevation</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-outline" />
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">wb_sunny</span>
                    <span>Circadian Equilibrium</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-outline" />
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">groups</span>
                    <span>Community Restoration</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 9. Panoramic Executive Pack Showcase ($499 Pack) */}
          <section id="executive-pack" className="w-full px-4 sm:px-8 py-12">
            <div className="mx-auto w-full max-w-[1720px] rounded-3xl bg-surface-container-low/95 border border-primary/20 p-6 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="pointer-events-none absolute top-0 right-1/4 h-80 w-80 rounded-full bg-primary-container/10 blur-[130px]" />
              <div className="pointer-events-none absolute bottom-0 left-10 h-80 w-80 rounded-full bg-secondary-container/15 blur-[140px]" />

              <div className="relative z-10 flex flex-col gap-6 md:gap-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="flex flex-col gap-1.5 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-surface-container-high border border-primary/30 backdrop-blur-md shadow-md w-fit">
                      <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                      <span className="font-mono text-xs uppercase tracking-widest text-primary">
                        Comprehensive Fleet &amp; Human Dividend Blueprint
                      </span>
                    </div>
                    <h2 className="font-headline-lg text-3xl sm:text-4xl text-on-surface tracking-tight font-semibold leading-tight">
                      Vistamation Executive Intelligence &amp; Deployment Pack
                    </h2>
                    <p className="text-sm sm:text-base text-on-surface-variant">
                      Everything required for boards, operations directors, and logistics leadership to evaluate automation ROI, human capital dividend, and full rollout mechanics.
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/40">
                    <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
                    <span className="font-mono text-xs text-on-surface-variant">Enterprise Board Presentation License</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                  {/* Left: 5 Assets */}
                  <div className="lg:col-span-2 rounded-2xl bg-surface-container-lowest/90 border border-outline-variant/50 p-6 shadow-xl flex flex-col justify-between gap-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                        <span className="font-mono text-xs text-primary tracking-widest uppercase font-semibold">
                          Included Deliverables &amp; Research Assets
                        </span>
                        <span className="font-mono text-xs text-secondary font-semibold">5 Modular Assets</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container/60 hover:bg-surface-container transition-colors border border-outline-variant/20">
                          <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[20px]">podcasts</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-on-surface font-semibold">Podcasts &amp; Audio Briefings</span>
                            <span className="text-xs text-on-surface-variant leading-relaxed">
                              4-part executive deep-dive series exploring autonomous logistics transition, human impact case studies, and change management.
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container/60 hover:bg-surface-container transition-colors border border-outline-variant/20">
                          <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[20px]">description</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-on-surface font-semibold">Google Docs Strategic Reports</span>
                            <span className="text-xs text-on-surface-variant leading-relaxed">
                              Comprehensive 68-page whitepaper, executive summary, policy templates, and human-first operational framework.
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container/60 hover:bg-surface-container transition-colors border border-outline-variant/20">
                          <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[20px]">hub</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-on-surface font-semibold">Visual Mind Maps</span>
                            <span className="text-xs text-on-surface-variant leading-relaxed">
                              High-resolution interactive architecture maps detailing warehouse topology, LiDAR fleet routing, and labor upskilling paths.
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container/60 hover:bg-surface-container transition-colors border border-outline-variant/20">
                          <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[20px]">table_chart</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-on-surface font-semibold">CSV &amp; Spreadsheet Outlays</span>
                            <span className="text-xs text-on-surface-variant leading-relaxed">
                              Financial model spreadsheets (.csv &amp; .xlsx) with 10-year CapEx/OpEx calculations, labor equations, and amortized forecasts.
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container/60 hover:bg-surface-container transition-colors border border-outline-variant/20">
                        <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[20px]">smart_display</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-on-surface font-semibold">4K Video Overview &amp; Walkthrough</span>
                          <span className="text-xs text-on-surface-variant leading-relaxed">
                            28-minute masterclass covering autonomous forklift mechanics, fail-safe protocols, and live warehouse telemetry walkthrough.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 flex flex-wrap items-center justify-between text-xs text-on-surface-variant gap-2 border-t border-outline-variant/30">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[16px]">lock</span>
                        Instant secure cloud access
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[16px]">update</span>
                        Continuous updates &amp; amendments
                      </span>
                    </div>
                  </div>

                  {/* Right: Pricing Box */}
                  <div className="rounded-2xl bg-surface-container-high/90 border border-primary-container/40 p-6 md:p-8 shadow-2xl flex flex-col justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 px-4 py-1 bg-secondary-container text-on-secondary font-mono text-[11px] font-semibold rounded-bl-xl uppercase tracking-wider">
                      Single Executive License
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <span className="font-mono text-xs text-primary tracking-widest uppercase">One-Time Purchase</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-headline-hero text-5xl leading-none text-on-surface font-semibold tracking-tight">
                          $499
                        </span>
                        <span className="font-mono text-xs text-on-surface-variant uppercase">USD</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/15 text-primary font-mono text-xs w-fit">
                        <span className="material-symbols-outlined text-[14px]">bolt</span>
                        <span>Instant Digital Access</span>
                      </div>
                      <p className="text-xs text-on-surface-variant pt-2 leading-relaxed">
                        Full access to all 5 research assets, editable raw spreadsheets, board-ready presentation slide deck, and 4K footage license.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => setShowPurchaseModal(true)}
                        className="w-full py-3 px-4 rounded-xl bg-primary-container text-on-primary-container font-semibold hover:bg-primary-fixed transition-all shadow-[0_0_24px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2 text-sm"
                      >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        <span>Purchase Executive Document Pack — $499</span>
                      </button>

                      <button
                        onClick={() => setShowTocModal(true)}
                        className="w-full py-2 text-center text-xs text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        <span>Preview Table of Contents</span>
                      </button>

                      <p className="text-center font-mono text-[10px] text-on-surface-variant">
                        Instant digital access • Includes license for enterprise board presentation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 10. Bottom Interactive Simulation Banner */}
          <section className="w-full px-4 sm:px-8 pb-16">
            <div className="mx-auto w-full max-w-[1720px] rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-container/15 flex items-center justify-center text-primary-container shrink-0">
                  <span className="material-symbols-outlined text-[32px]">diversity_1</span>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-lg sm:text-xl text-on-surface font-semibold">
                    Ready to reclaim your workforce’s time?
                  </h4>
                  <p className="text-xs sm:text-sm text-on-surface-variant">
                    Simulate fleet deployment and calculate reclaimed human hours for your logistics centers.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => setShowCalculator(true)}
                  className="w-full md:w-auto px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-semibold hover:bg-primary-fixed transition-all shadow-[0_0_20px_rgba(0,229,255,0.35)] text-sm flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">calculate</span>
                  <span>Launch Simulation Calculator</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 shadow-[0_-1px_12px_rgba(0,0,0,0.5)]">
        <div className="w-full px-4 sm:px-8 py-8 max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-surface-container border border-outline-variant/30 px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary-fixed-dim animate-pulse" />
              <span className="font-mono text-xs text-on-surface-variant">
                Autonomous Grid: <span className="text-primary font-semibold">99.98% Active</span>
              </span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container border border-outline-variant/30 px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-secondary-container" />
              <span className="font-mono text-xs text-on-surface-variant">
                Returning <span className="text-secondary font-semibold">14.2M Hours</span> to Human Lives
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-on-surface-variant font-mono text-xs">
            <span>SYS.VER // 4.8.2-HORIZON</span>
            <span>© 2025 Vistamation Technologies Inc.</span>
          </div>
        </div>
      </footer>

      {/* --- MODAL 1: Simulation Calculator Modal --- */}
      {showCalculator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-surface-container-low border border-primary/30 rounded-2xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowCalculator(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Modal Header & Metric/Imperial Unit Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pr-8 sm:pr-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container shrink-0">
                  <span className="material-symbols-outlined text-[24px]">calculate</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-on-surface">Workforce &amp; Fleet Simulator</h3>
                  <p className="text-xs text-on-surface-variant">Simulate autonomous logistics throughput, floor dynamics, and human dividend.</p>
                </div>
              </div>

              {/* Unit Toggle */}
              <div className="flex items-center self-start sm:self-auto bg-surface-container-lowest p-1 rounded-xl border border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setUnitSystem('metric')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                    unitSystem === 'metric'
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-md'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${unitSystem === 'metric' ? 'bg-on-primary-container' : 'bg-transparent'}`} />
                  <span>Metric (kg · km)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('imperial')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                    unitSystem === 'imperial'
                      ? 'bg-secondary text-on-secondary font-semibold shadow-md'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${unitSystem === 'imperial' ? 'bg-on-secondary' : 'bg-transparent'}`} />
                  <span>Imperial (lbs · mi)</span>
                </button>
              </div>
            </div>

            {/* Slider Inputs */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-on-surface">Operating Facilities</span>
                    <span className="text-primary font-semibold">{sim.facilities} Centers</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={sim.facilities}
                    onChange={(e) => setSim({ ...sim, facilities: parseInt(e.target.value) })}
                    className="w-full accent-[#00e5ff] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-on-surface">Active Forklifts per Facility</span>
                    <span className="text-primary font-semibold">{sim.forkliftsPerFacility} Units</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="40"
                    value={sim.forkliftsPerFacility}
                    onChange={(e) => setSim({ ...sim, forkliftsPerFacility: parseInt(e.target.value) })}
                    className="w-full accent-[#00e5ff] cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-on-surface">Daily Operational Shift</span>
                    <span className="text-primary font-semibold">{sim.shiftHours} Hours/Day</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="24"
                    step="2"
                    value={sim.shiftHours}
                    onChange={(e) => setSim({ ...sim, shiftHours: parseInt(e.target.value) })}
                    className="w-full accent-[#00e5ff] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-on-surface">Rated Pallet Weight</span>
                    <span className="text-primary font-semibold">
                      {unitSystem === 'metric'
                        ? `${sim.palletWeightKg.toLocaleString()} kg`
                        : `${Math.round(sim.palletWeightKg * 2.20462).toLocaleString()} lbs`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="800"
                    max="2600"
                    step="20"
                    value={sim.palletWeightKg}
                    onChange={(e) => setSim({ ...sim, palletWeightKg: parseInt(e.target.value) })}
                    className="w-full accent-[#00e5ff] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-on-surface">Hourly Operator Cost</span>
                    <span className="text-secondary font-semibold">${sim.hourlyLaborRate} / hr</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="55"
                    value={sim.hourlyLaborRate}
                    onChange={(e) => setSim({ ...sim, hourlyLaborRate: parseInt(e.target.value) })}
                    className="w-full accent-[#ffb874] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Results Grid with Dynamic Floor Weight and Range Values */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 mb-6">
              {/* Metric 1: Floor Weight Throughput */}
              <div className="flex flex-col p-2.5 rounded-lg bg-surface-container/50 border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-primary uppercase font-semibold">Floor Weight</span>
                  <span className="material-symbols-outlined text-primary text-[14px]">scale</span>
                </div>
                <span className="text-lg font-bold font-mono text-primary mt-1">
                  {unitSystem === 'metric'
                    ? `${(dailyWeightKg / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} t/day`
                    : `${(dailyWeightLbs / 2000).toLocaleString(undefined, { maximumFractionDigits: 1 })} tons/day`}
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant mt-0.5">
                  {unitSystem === 'metric'
                    ? `${liftRatingKg.toLocaleString()} kg / lift rating`
                    : `${liftRatingLbs.toLocaleString()} lbs / lift rating`}
                </span>
              </div>

              {/* Metric 2: Operational Fleet Range */}
              <div className="flex flex-col p-2.5 rounded-lg bg-surface-container/50 border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-secondary uppercase font-semibold">Fleet Range</span>
                  <span className="material-symbols-outlined text-secondary text-[14px]">near_me</span>
                </div>
                <span className="text-lg font-bold font-mono text-secondary mt-1">
                  {unitSystem === 'metric'
                    ? `${Math.round(dailyRangeKm).toLocaleString()} km/day`
                    : `${Math.round(dailyRangeMiles).toLocaleString()} mi/day`}
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant mt-0.5">
                  {unitSystem === 'metric'
                    ? `${perUnitRangeKm.toFixed(1)} km/unit (${lidarPerimeterM.toFixed(1)}m LiDAR)`
                    : `${perUnitRangeMiles.toFixed(1)} mi/unit (${lidarPerimeterFt.toFixed(1)}ft LiDAR)`}
                </span>
              </div>

              {/* Metric 3: Human Hours Reclaimed */}
              <div className="flex flex-col p-2.5 rounded-lg bg-surface-container/50 border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase font-semibold">Human Rest</span>
                  <span className="material-symbols-outlined text-primary text-[14px]">timelapse</span>
                </div>
                <span className="text-lg font-bold font-mono text-on-surface mt-1">
                  {annualHoursReclaimed.toLocaleString()} <span className="text-xs font-normal">hrs</span>
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant mt-0.5">
                  Annual time returned
                </span>
              </div>

              {/* Metric 4: Net OpEx Yield */}
              <div className="flex flex-col p-2.5 rounded-lg bg-surface-container/50 border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase font-semibold">Net OpEx Yield</span>
                  <span className="material-symbols-outlined text-secondary text-[14px]">payments</span>
                </div>
                <span className="text-lg font-bold font-mono text-secondary mt-1">
                  ${(annualNetSavings / 1_000_000).toFixed(2)}M
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant mt-0.5">
                  Annual net savings
                </span>
              </div>

              {/* Metric 5: Fatigue Hazards Eradicated */}
              <div className="flex flex-col p-2.5 rounded-lg bg-surface-container/50 border border-outline-variant/30 col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase font-semibold">Fatigue Voided</span>
                  <span className="material-symbols-outlined text-primary text-[14px]">health_and_safety</span>
                </div>
                <span className="text-lg font-bold font-mono text-on-surface mt-1">
                  {fatigueEventsAvoided}
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant mt-0.5">
                  Annual risk vectors
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCalculator(false)}
                className="px-4 py-2 text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowCalculator(false);
                  scrollTo('executive-pack', 'executive');
                }}
                className="px-5 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-semibold hover:bg-primary-fixed text-xs flex items-center gap-1.5 shadow-[0_0_16px_rgba(0,229,255,0.3)] transition-all"
              >
                <span>Export Full Scenario in Executive Pack</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: Table of Contents Preview Modal --- */}
      {showTocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-surface-container-low border border-primary/30 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowTocModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[24px]">menu_book</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-on-surface">Executive Pack — Table of Contents</h3>
                <span className="font-mono text-xs text-primary">68 Pages • 5 Deliverable Bundles • Version 4.8</span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30">
                <h4 className="font-semibold text-primary mb-1">Module 1: The Macro Logistics Crisis &amp; Attrition Realities</h4>
                <p className="text-on-surface-variant">Worker turnover dynamics, micro-sleep hazards, lumbar injury data from 200+ global fulfillment hubs, and human capital attrition curves.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30">
                <h4 className="font-semibold text-secondary mb-1">Module 2: The Flow-On Principle: Nurturing Life at the Core</h4>
                <p className="text-on-surface-variant">The psychological &amp; sociological impact of returning unexhausted humans back to families, pets, and communities; reduction in chronic fatigue.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30">
                <h4 className="font-semibold text-primary mb-1">Module 3: Autonomous Fleet Architecture &amp; LiDAR Mechanics</h4>
                <p className="text-on-surface-variant">360-degree sensor envelopes, SLAM warehouse mesh networking, dynamic dock auto-sequencing, and fail-safe redundancy protocols.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30">
                <h4 className="font-semibold text-secondary mb-1">Module 4: 10-Year Amortized Financial Models (.CSV / .XLSX)</h4>
                <p className="text-on-surface-variant">Detailed spreadsheet formulations for CapEx deployment, battery amortization, utility costs, shift multipliers, and payback milestones.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30">
                <h4 className="font-semibold text-primary mb-1">Module 5: Workforce Upskilling &amp; Telemetry Transition Protocols</h4>
                <p className="text-on-surface-variant">Training syllabus to transition floor forklift operators into salaried supervisory fleet orchestrators, diagnostic leads, and operations directors.</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant/30 flex justify-between items-center">
              <span className="font-mono text-xs text-on-surface-variant">$499 Single Executive License</span>
              <button
                onClick={() => {
                  setShowTocModal(false);
                  setShowPurchaseModal(true);
                }}
                className="px-5 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-semibold hover:bg-primary-fixed text-xs flex items-center gap-1.5"
              >
                <span>Purchase Instant Access</span>
                <span className="material-symbols-outlined text-[16px]">bolt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: Purchase / Checkout Modal --- */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-surface-container-low border border-primary/30 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => {
                setShowPurchaseModal(false);
                setPurchaseSuccess(false);
              }}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {purchaseSuccess ? (
              <div className="text-center py-6 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary-container/20 text-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[36px]">check_circle</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface">License Issued Successfully</h3>
                <p className="text-sm text-on-surface-variant max-w-md">
                  Your secure cloud access link and Google Drive credentials for the 5-part Executive Pack have been dispatched to <span className="text-primary font-mono">{purchaseEmail || 'your email'}</span>.
                </p>
                <div className="p-3 bg-surface-container rounded-xl font-mono text-xs text-secondary mt-2">
                  TRANSACTION ID: #HORIZON-EX-2025-9984
                </div>
                <button
                  onClick={() => {
                    setShowPurchaseModal(false);
                    setPurchaseSuccess(false);
                  }}
                  className="mt-4 px-6 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-semibold hover:bg-primary-fixed text-xs"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-on-surface">Acquire Executive Pack</h3>
                    <span className="font-mono text-xs text-secondary">$499 USD • Single Executive License</span>
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant mb-4">
                  Enter your executive email address to generate an instant board presentation key and access the 5 modular deliverables immediately.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setPurchaseSuccess(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-mono text-on-surface mb-1">Corporate Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="executive@logistics-enterprise.com"
                      value={purchaseEmail}
                      onChange={(e) => setPurchaseEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary-container"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-xs text-on-surface-variant space-y-1">
                    <div className="flex justify-between">
                      <span>Executive Research Assets</span>
                      <span className="text-on-surface font-mono">$499.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Board Presentation License</span>
                      <span className="text-primary font-mono">Included</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Continuous Model Updates</span>
                      <span className="text-secondary font-mono">Included</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-primary-container text-on-primary-container font-semibold hover:bg-primary-fixed transition-all text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                  >
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    <span>Confirm &amp; Instant Access ($499)</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL 4: Financial Model Preview Modal --- */}
      {showFinancialPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-surface-container-low border border-primary/30 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowFinancialPreview(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[24px]">analytics</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-on-surface">5-Year Amortization Model Summary</h3>
                <span className="font-mono text-xs text-primary">Pre-calculated across 30 Enterprise Fulfillment Facilities</span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30 text-center">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase">Initial CapEx Payback</span>
                  <div className="text-lg font-bold text-primary font-mono mt-1">11.4 Mos</div>
                </div>
                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30 text-center">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase">Y5 Net Annual Gain</span>
                  <div className="text-lg font-bold text-secondary font-mono mt-1">$1.62M/site</div>
                </div>
                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30 text-center">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase">Battery Life Cycle</span>
                  <div className="text-lg font-bold text-on-surface font-mono mt-1">8.5 Yrs</div>
                </div>
                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30 text-center">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase">Turnover Elimination</span>
                  <div className="text-lg font-bold text-primary font-mono mt-1">-$280K/yr</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30 font-mono text-xs leading-relaxed text-on-surface-variant">
                <div className="text-primary font-semibold mb-2">RAW FORMULA EQUATION EXTRACT:</div>
                <code>
                  Net_Savings = Σ [ (Forklift_Units × Shift_Hrs × 350 × Human_Hourly_Rate) - (CapEx_Amortized + Grid_Power + Horizon_OS_License) ] + Worker_Compensation_Reduction_Dividend
                </code>
              </div>

              <p className="text-xs text-on-surface-variant">
                The fully populated multi-tab Microsoft Excel (.XLSX) and CSV workbook containing cell formulas, macro sensitivity charts, and automated headcount projection matrices is packaged in the $499 Executive Intelligence Pack.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant/30 flex justify-between items-center">
              <button
                onClick={() => setShowFinancialPreview(false)}
                className="px-4 py-2 text-xs text-on-surface-variant hover:text-on-surface"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setShowFinancialPreview(false);
                  setShowPurchaseModal(true);
                }}
                className="px-5 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-semibold hover:bg-primary-fixed text-xs flex items-center gap-1.5"
              >
                <span>Purchase Full Spreadsheets ($499)</span>
                <span className="material-symbols-outlined text-[16px]">download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
