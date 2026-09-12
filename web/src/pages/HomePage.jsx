import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Search,
  ArrowRight,
  Database,
  MapPin,
  Store,
  BookOpen,
  Clock,
  TrendingUp,
  Users,
  HeartPulse,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Code2,
  FileSpreadsheet,
  CheckCircle2,
  Zap,
  Smartphone,
  Trees,
  Leaf,
  Wheat,
  ExternalLink
} from 'lucide-react'

const SECTORS = [
  {
    id: 'Demographics',
    title: 'Demographics & Census',
    description: '135 districts with 16 five-year age cohorts and gender distributions from UBOS.',
    icon: Users,
    color: '#2563eb',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    count: '1 Dataset · 135 Districts',
  },
  {
    id: 'Economics',
    title: 'Macroeconomic Trends',
    description: '50-year annual time series tracking GDP, growth %, per capita, and inflation CPI.',
    icon: TrendingUp,
    color: '#059669',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    count: '1 Dataset · 50 Years',
  },
  {
    id: 'Agriculture',
    title: 'Staple Food Prices',
    description: 'WFP commodity prices (Maize, Beans, Rice, Sugar, Cassava) across key markets.',
    icon: Wheat,
    color: '#16a34a',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    count: '1 Dataset · 2,431 Records',
  },
  {
    id: 'Infrastructure',
    title: 'Energy & Electrification',
    description: 'National, urban, and rural electricity access rates plus renewable generation shares.',
    icon: Zap,
    color: '#d97706',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    count: '1 Dataset · 34 Years',
  },
  {
    id: 'Tourism',
    title: 'National Parks & Wildlife',
    description: 'Registry of all 10 National Parks, UNESCO sites, area sizes, and iconic wildlife.',
    icon: Trees,
    color: '#059669',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    count: '1 Dataset · 10 Parks',
  },
  {
    id: 'Technology',
    title: 'Digital & Telecommunications',
    description: 'Mobile phone adoption and internet penetration trends across Uganda since 1995.',
    icon: Smartphone,
    color: '#0891b2',
    badge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    count: '1 Dataset · 30 Years',
  },
  {
    id: 'Environment',
    title: 'Forest & Land Cover',
    description: '34-year historical trajectory of forest canopy area and agricultural land utilization.',
    icon: Leaf,
    color: '#65a30d',
    badge: 'bg-lime-50 text-lime-700 border-lime-200',
    count: '1 Dataset · 34 Years',
  },
  {
    id: 'Geospatial',
    title: 'Geospatial & Markets',
    description: 'Administrative district boundary P-codes and 104 WFP food market GPS locations.',
    icon: MapPin,
    color: '#d97706',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    count: '2 Datasets · 239 Locations',
  },
  {
    id: 'Health',
    title: 'Public Health Metrics',
    description: 'Six decades of life expectancy at birth and infant mortality reduction statistics.',
    icon: HeartPulse,
    color: '#e11d48',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    count: '1 Dataset · 65 Years',
  },
  {
    id: 'Language',
    title: 'Indigenous Languages',
    description: 'Comprehensive bilingual dictionary of 10,671 Runyankore-Rukiga lexical entries.',
    icon: BookOpen,
    color: '#4f46e5',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    count: '1 Dataset · 10,671 Words',
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [spotlightTab, setSpotlightTab] = useState('economics')
  const navigate = useNavigate()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/datasets?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/datasets')
    }
  }

  return (
    <div className="space-y-0">
      {/* ============================================================ */}
      {/* 1. HERO SECTION (2-Column Balanced, Solid Colors)           */}
      {/* ============================================================ */}
      <section className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline, Search & Navigation CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Authority Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>Uganda Public Open Data Initiative</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">CC-BY 4.0 Open License</span>
              </div>

              {/* Main Headline (Solid colors, No text gradients) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Uganda's Public Data, <br />
                <span className="text-amber-600">Free &amp; Accessible to Everyone.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                An independent, public-interest portal providing standardized, machine-readable datasets covering demographics, macroeconomic indicators, health metrics, food markets, and local languages.
              </p>

              {/* Search Form (Navigates directly to /datasets?q=...) */}
              <form onSubmit={handleSearchSubmit} className="space-y-2.5 pt-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search datasets, districts, indicators..."
                    className="w-full pl-12 pr-24 py-4 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-xs text-sm sm:text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-white transition placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
                  >
                    Search
                  </button>
                </div>

                {/* Quick Search Tags */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                  <span className="font-semibold text-slate-400 mr-1">Popular:</span>
                  {[
                    { label: 'Kampala Census', q: 'population' },
                    { label: 'GDP Growth', q: 'macroeconomic' },
                    { label: 'Food Markets', q: 'markets' },
                    { label: 'Infant Mortality', q: 'health' },
                    { label: 'Runyankore Dictionary', q: 'dictionary' },
                  ].map(chip => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => navigate(`/datasets?q=${encodeURIComponent(chip.q)}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </form>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/datasets"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition"
                >
                  <span>Browse All Datasets (12)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/api"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 shadow-2xs transition"
                >
                  <Code2 className="w-4 h-4 text-slate-500" />
                  <span>Developer API &amp; Python</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Interactive Live Data Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-100 p-6 space-y-5">
                
                {/* Spotlight Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <span className="font-bold text-sm text-slate-900">Live Data Spotlight</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    ● UBOS &amp; World Bank
                  </span>
                </div>

                {/* Tab Switcher */}
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                  {[
                    { id: 'economics', label: 'Economy' },
                    { id: 'demographics', label: 'Census' },
                    { id: 'markets', label: 'Markets' },
                    { id: 'language', label: 'Lexicon' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSpotlightTab(tab.id)}
                      className={`py-1.5 text-center rounded-lg transition cursor-pointer ${
                        spotlightTab === tab.id
                          ? 'bg-white text-slate-900 shadow-xs font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab 1: Economy */}
                {spotlightTab === 'economics' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[11px] text-slate-400 font-medium uppercase">Current GDP</div>
                        <div className="text-2xl font-extrabold text-emerald-600 mt-1">$48.2 Billion</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">World Bank series</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[11px] text-slate-400 font-medium uppercase">Annual Growth</div>
                        <div className="text-2xl font-extrabold text-blue-600 mt-1">+5.3%</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Real annual growth</div>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">50-Year Economic Trajectory</div>
                        <div className="text-[11px] text-slate-500">GDP, per capita, inflation CPI, population</div>
                      </div>
                      <Link
                        to="/dataset/uganda-macroeconomic-indicators"
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                      >
                        Inspect <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Tab 2: Demographics */}
                {spotlightTab === 'demographics' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[11px] text-slate-400 font-medium uppercase">Total Population</div>
                        <div className="text-2xl font-extrabold text-blue-600 mt-1">45.8 Million</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">135 administrative districts</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[11px] text-slate-400 font-medium uppercase">Top District</div>
                        <div className="text-2xl font-extrabold text-indigo-600 mt-1">Wakiso</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">3.1M population</div>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">16 Age Cohort Breakdowns</div>
                        <div className="text-[11px] text-slate-500">District population pyramid visualization</div>
                      </div>
                      <Link
                        to="/dataset/uganda-district-population"
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                      >
                        Inspect <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Tab 3: Markets */}
                {spotlightTab === 'markets' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[11px] text-slate-400 font-medium uppercase">Monitored Markets</div>
                        <div className="text-2xl font-extrabold text-amber-600 mt-1">104 Markets</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">WFP Food Programme</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[11px] text-slate-400 font-medium uppercase">Geographic Spread</div>
                        <div className="text-2xl font-extrabold text-rose-600 mt-1">4 Regions</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">All with GPS lat / lon</div>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Interactive Map Visualizer</div>
                        <div className="text-[11px] text-slate-500">OpenStreetMap Leaflet pins &amp; popups</div>
                      </div>
                      <Link
                        to="/dataset/uganda-markets"
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                      >
                        View Map <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Tab 4: Language */}
                {spotlightTab === 'language' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[11px] text-slate-400 font-medium uppercase">Lexicon Size</div>
                        <div className="text-2xl font-extrabold text-indigo-600 mt-1">10,671 Words</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Runyankore-Rukiga</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[11px] text-slate-400 font-medium uppercase">Annotations</div>
                        <div className="text-2xl font-extrabold text-purple-600 mt-1">POS &amp; Examples</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Bilingual definitions</div>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Instant Lexicon Search</div>
                        <div className="text-[11px] text-slate-500">Search by Runyankore or English meaning</div>
                      </div>
                      <Link
                        to="/dataset/runyankore-rukiga-dictionary"
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                      >
                        Search Words <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Trust Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>UBOS · World Bank · WHO · WFP</span>
                  <span className="font-semibold text-slate-600">Free Public Archive</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. IMPACT METRICS BAR                                        */}
      {/* ============================================================ */}
      <section className="bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                value: '12',
                label: 'Curated Datasets',
                sub: '10 Domains of Public Records',
                icon: Database,
                color: 'text-amber-600',
              },
              {
                value: '135',
                label: 'Districts Documented',
                sub: 'UBOS COD-AB standard codes',
                icon: MapPin,
                color: 'text-red-600',
              },
              {
                value: '104',
                label: 'Geocoded Markets',
                sub: 'WFP food & commodity trading',
                icon: Store,
                color: 'text-emerald-600',
              },
              {
                value: '10,671',
                label: 'Dictionary Words',
                sub: 'Runyankore-Rukiga bilingual',
                icon: BookOpen,
                color: 'text-indigo-600',
              },
              {
                value: '65 Yrs',
                label: 'Historical Series',
                sub: 'Life expectancy & economic data',
                icon: Clock,
                color: 'text-blue-600',
              },
            ].map(metric => {
              const IconComponent = metric.icon
              return (
                <div
                  key={metric.label}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {metric.value}
                    </span>
                    <IconComponent className={`w-4 h-4 ${metric.color}`} />
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-1">{metric.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate">{metric.sub}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. EXPLORE BY SECTOR (Clean Category Cards)                  */}
      {/* ============================================================ */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Catalog Domains</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Explore Uganda's Data by Sector
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select a domain to view its standardized datasets, schemas, and interactive visualizers.
              </p>
            </div>

            <Link
              to="/datasets"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 hover:text-amber-600 transition"
            >
              <span>View All Datasets</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTORS.map(sector => {
              const IconComp = sector.icon
              return (
                <div
                  key={sector.id}
                  onClick={() => navigate(`/datasets?domain=${encodeURIComponent(sector.id)}`)}
                  className="group p-6 rounded-3xl bg-slate-50/60 border border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                        <IconComp className="w-5 h-5" style={{ color: sector.color }} />
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {sector.count}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-amber-600 transition">
                      {sector.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {sector.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-amber-600 transition">
                    <span>Browse sector</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. WHY OPEN DATA UGANDA (Value Pillars)                      */}
      {/* ============================================================ */}
      <section className="bg-slate-50/80 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Open Standards</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Built for Researchers, Journalists &amp; Developers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Every dataset in Open Data Uganda adheres to strict open-source repository and data governance standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">100% Free &amp; Open License</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Licensed under Creative Commons Attribution 4.0 (CC-BY 4.0). You are free to share, adapt, and build commercially on this data with proper attribution.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Dual Formats (CSV + JSON)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every dataset is packaged simultaneously as tabular CSV (for Excel, Google Sheets, Stata) and structured JSON/JSONL (for software and data pipelines).
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Verified Institutional Sources</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Aggregated from official agencies including the Uganda Bureau of Statistics (UBOS), the World Bank, WHO, UNESCO, and the UN World Food Programme.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="mt-12 p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight">Ready to explore Uganda's public records?</h3>
              <p className="text-xs text-slate-400">View interactive charts, explore spreadsheets, or download raw files instantly.</p>
            </div>
            <Link
              to="/datasets"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition whitespace-nowrap shadow-sm"
            >
              <span>Explore All Datasets</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
