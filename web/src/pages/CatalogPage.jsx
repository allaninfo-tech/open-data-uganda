import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Download,
  FileCode,
  Database,
  MapPin,
  Store,
  BookOpen,
  Clock,
  ArrowRight,
  TrendingUp,
  Users,
  HeartPulse,
  GraduationCap,
  ShieldCheck,
  Code2,
  Copy,
  Check,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import { useCatalog } from '../hooks/useData'

const DOMAIN_CONFIG = {
  Demographics: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Users,
    color: '#2563eb',
    accent: 'from-blue-500/10 to-transparent',
  },
  Economics: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: TrendingUp,
    color: '#059669',
    accent: 'from-emerald-500/10 to-transparent',
  },
  Geospatial: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: MapPin,
    color: '#d97706',
    accent: 'from-amber-500/10 to-transparent',
  },
  Health: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: HeartPulse,
    color: '#e11d48',
    accent: 'from-rose-500/10 to-transparent',
  },
  Education: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: GraduationCap,
    color: '#7c3aed',
    accent: 'from-purple-500/10 to-transparent',
  },
  Language: {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: BookOpen,
    color: '#4f46e5',
    accent: 'from-indigo-500/10 to-transparent',
  },
}

export default function CatalogPage() {
  const { datasets, loading } = useCatalog()
  const [query, setQuery] = useState('')
  const [activeDomain, setActiveDomain] = useState('all')
  const [spotlightTab, setSpotlightTab] = useState('economics')
  const [copiedCode, setCopiedCode] = useState(false)
  const navigate = useNavigate()

  const domains = useMemo(() => {
    const counts = {}
    datasets.forEach(d => { counts[d.domain] = (counts[d.domain] || 0) + 1 })
    return counts
  }, [datasets])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return datasets.filter(d => {
      const matchDomain = activeDomain === 'all' || d.domain === activeDomain
      const matchQuery =
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.domain.toLowerCase().includes(q) ||
        d.source.toLowerCase().includes(q)
      return matchDomain && matchQuery
    })
  }, [datasets, query, activeDomain])

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    })
  }

  return (
    <div className="space-y-0">
      {/* ============================================================ */}
      {/* 1. HERO SECTION (2-Column Balanced Grid)                    */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Text, Search, and Action Buttons */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Official Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/70 text-amber-800 text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Uganda Public Open Data Initiative</span>
                <span className="text-amber-400">•</span>
                <span className="text-amber-700 font-medium">CC-BY 4.0 Open License</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Uganda's Public Data, <br />
                <span className="bg-gradient-to-r from-amber-600 via-red-600 to-slate-900 bg-clip-text text-transparent">
                  Open, Verified &amp; Visualized.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                Standardized, machine-readable datasets covering demographics, macroeconomic trends, public health, education access, food markets, and indigenous language dictionaries.
              </p>

              {/* Interactive Search Bar */}
              <div className="space-y-2.5 pt-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search datasets, districts, health indicators, dictionary..."
                    className="w-full pl-12 pr-12 py-4 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition placeholder:text-slate-400"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full px-2 py-0.5"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Quick Search Suggestion Chips */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                  <span className="font-semibold text-slate-400 mr-1">Trending:</span>
                  {[
                    { label: 'Kampala Population', q: 'population' },
                    { label: 'GDP Growth', q: 'macroeconomic' },
                    { label: '104 Food Markets', q: 'markets' },
                    { label: 'Infant Mortality', q: 'health' },
                    { label: 'Runyankore Words', q: 'dictionary' },
                  ].map(chip => (
                    <button
                      key={chip.label}
                      onClick={() => setQuery(chip.q)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#datasets"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-md shadow-slate-900/10 transition cursor-pointer"
                >
                  <span>Explore 7 Datasets</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#developer-access"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 shadow-xs transition"
                >
                  <Code2 className="w-4 h-4 text-slate-500" />
                  <span>Python &amp; API Access</span>
                </a>
              </div>
            </div>

            {/* Right Column: Live Data Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 space-y-5">
                
                {/* Spotlight Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <span className="font-bold text-sm text-slate-900">Live Data Spotlight</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    ● Verified Sources
                  </span>
                </div>

                {/* Spotlight Navigation Tabs */}
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
                      className={`py-1.5 text-center rounded-lg transition ${
                        spotlightTab === tab.id
                          ? 'bg-white text-slate-900 shadow-xs font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Spotlight Tab Content */}
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
                        <div className="text-[10px] text-slate-400 mt-0.5">Real GDP growth rate</div>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">50-Year Economic Trajectory</div>
                        <div className="text-[11px] text-slate-500">Tracks GDP, per capita, inflation CPI, population</div>
                      </div>
                      <button
                        onClick={() => navigate('/dataset/uganda-macroeconomic-indicators')}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                      >
                        Inspect <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

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
                        <div className="text-[11px] text-slate-500">Male vs Female distribution per district</div>
                      </div>
                      <button
                        onClick={() => navigate('/dataset/uganda-district-population')}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                      >
                        Inspect <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {spotlightTab === 'markets' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[11px] text-slate-400 font-medium uppercase">Monitored Markets</div>
                        <div className="text-2xl font-extrabold text-amber-600 mt-1">104 Markets</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">World Food Programme</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[11px] text-slate-400 font-medium uppercase">Geographic Spread</div>
                        <div className="text-2xl font-extrabold text-rose-600 mt-1">4 Regions</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">All with GPS lat / lon</div>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Interactive Map Ready</div>
                        <div className="text-[11px] text-slate-500">OpenStreetMap Leaflet markers &amp; popups</div>
                      </div>
                      <button
                        onClick={() => navigate('/dataset/uganda-markets')}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                      >
                        View Map <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

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
                      <button
                        onClick={() => navigate('/dataset/runyankore-rukiga-dictionary')}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                      >
                        Launch Search <ArrowRight className="w-3.5 h-3.5" />
                      </button>
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
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                value: '7',
                label: 'Curated Datasets',
                sub: 'Demographics, Health, Economy...',
                icon: Database,
                color: 'text-amber-600',
              },
              {
                value: '135',
                label: 'Districts Documented',
                sub: 'UBOS COD-AB admin codes',
                icon: MapPin,
                color: 'text-red-600',
              },
              {
                value: '104',
                label: 'Geocoded Markets',
                sub: 'WFP food and grain trading',
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
                sub: 'Life expectancy & GDP trends',
                icon: Clock,
                color: 'text-blue-600',
              },
            ].map(metric => {
              const IconComponent = metric.icon
              return (
                <div
                  key={metric.label}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:border-slate-300 transition"
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
      {/* 3. DATASET CATALOG (Filters + Grid)                          */}
      {/* ============================================================ */}
      <section id="datasets" className="bg-slate-50/60 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Explore Public Catalog</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Standardized Ugandan Datasets
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Filter by domain or search across schemas, indicators, and metadata.
              </p>
            </div>

            {/* Total Indicator Count */}
            <div className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200 self-start md:self-auto shadow-2xs">
              Showing <span className="font-bold text-slate-900">{filtered.length}</span> of {datasets.length} datasets
            </div>
          </div>

          {/* Domain Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
            <button
              onClick={() => setActiveDomain('all')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap border transition cursor-pointer ${
                activeDomain === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <span>All Sectors</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${activeDomain === 'all' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                {datasets.length}
              </span>
            </button>

            {Object.entries(domains).map(([domain, count]) => {
              const cfg = DOMAIN_CONFIG[domain] || {}
              const IconComp = cfg.icon || Database
              const isActive = activeDomain === domain

              return (
                <button
                  key={domain}
                  onClick={() => setActiveDomain(domain)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap border transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" style={{ color: isActive ? '#ffffff' : cfg.color }} />
                  <span>{domain}</span>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Grid of Dataset Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 h-64 animate-pulse space-y-4">
                  <div className="h-4 bg-slate-100 rounded w-1/4" />
                  <div className="h-6 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
              <Database className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-bold text-base text-slate-700">No datasets match your search query.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for broader keywords like "population", "districts", "economics", or click "Clear Filters".
              </p>
              <button
                onClick={() => { setQuery(''); setActiveDomain('all') }}
                className="mt-2 text-xs font-semibold text-amber-600 hover:underline cursor-pointer"
              >
                Reset Search and Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(dataset => (
                <DatasetCard
                  key={dataset.id}
                  dataset={dataset}
                  onExplore={() => navigate(`/dataset/${dataset.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. DEVELOPER & RESEARCHER INTEGRATION SECTION                */}
      {/* ============================================================ */}
      <section id="developer-access" className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-8">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Direct Data Access</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              One-Click Integration for Analysts &amp; Developers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Every dataset is hosted over HTTPS in clean, uncompressed CSV and JSON formats. Import directly into Python Pandas, R, Google Sheets, or cURL.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Python / Pandas Card */}
            <div className="lg:col-span-7 bg-slate-900 text-slate-100 rounded-3xl p-6 font-mono text-xs space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  <span className="ml-2 text-xs text-slate-400 font-sans font-medium">Python (Pandas) Instant Read</span>
                </div>
                <button
                  onClick={() => copyCode(`import pandas as pd\n\n# Load Uganda district census directly from CDN\nurl = "https://opendata-ug.pages.dev/data/uganda-district-population.csv"\ndf = pd.read_csv(url)\nprint(df.head())`)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition px-2.5 py-1 rounded-md bg-slate-800"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="text-slate-300 leading-relaxed overflow-x-auto py-1">
{`import pandas as pd

# 1. Load Uganda District Population directly via HTTPS
url = "https://opendata-ug.pages.dev/data/uganda-district-population.csv"
df = pd.read_csv(url)

# 2. View top districts by population
top_districts = df[['district', 'total_population']].sort_values(by='total_population', ascending=False)
print(top_districts.head(10))`}
              </pre>
            </div>

            {/* Direct Tooling Links */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-600" />
                  <span>Google Sheets &amp; Microsoft Excel</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Import live datasets into Google Sheets using <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">=IMPORTDATA("https://opendata-ug.pages.dev/data/uganda-districts.csv")</code>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Open License &amp; Citation</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Published under Creative Commons Attribution 4.0 (CC-BY 4.0). Fully cited with standard <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">CITATION.cff</code> file for academic publications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ============================================================ */
/* DATASET CARD COMPONENT                                       */
/* ============================================================ */
function DatasetCard({ dataset, onExplore }) {
  const cfg = DOMAIN_CONFIG[dataset.domain] || {
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Database,
    color: '#64748b',
  }
  const IconComponent = cfg.icon

  return (
    <div className="group bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-200">
      <div className="space-y-4">
        
        {/* Card Header: Domain Badge + Timeframe */}
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${cfg.badge}`}>
            <IconComponent className="w-3 h-3" />
            <span>{dataset.domain}</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{dataset.timeframe}</span>
          </span>
        </div>

        {/* Title and Description */}
        <div>
          <h3
            onClick={onExplore}
            className="font-bold text-slate-900 text-lg leading-snug group-hover:text-amber-600 transition cursor-pointer"
          >
            {dataset.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2">
            {dataset.description}
          </p>
        </div>

        {/* Source Attribution Tag */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="truncate">Source: {dataset.source}</span>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-5 border-t border-slate-100 mt-5 flex items-center gap-2">
        <button
          onClick={onExplore}
          className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
        >
          <span>Explore &amp; Visualize</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Direct Download Buttons */}
        <a
          href={`/data/${dataset.id}.csv`}
          download
          title="Download CSV file"
          className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
        >
          <Download className="w-4 h-4" />
        </a>
        <a
          href={`/data/${dataset.id}.json`}
          download
          title="Download JSON file"
          className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
        >
          <FileCode className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
