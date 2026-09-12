import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Download, FileCode, Database, MapPin, Store, BookOpen, Clock } from 'lucide-react'
import { useCatalog } from '../hooks/useData'

const DOMAIN_STYLES = {
  Demographics: 'bg-blue-50 text-blue-700',
  Economics:    'bg-emerald-50 text-emerald-700',
  Geospatial:   'bg-amber-50 text-amber-700',
  Health:       'bg-rose-50 text-rose-700',
  Education:    'bg-purple-50 text-purple-700',
  Language:     'bg-indigo-50 text-indigo-700',
}

const DOMAIN_ICONS = {
  Demographics: '👥',
  Economics:    '📈',
  Geospatial:   '📍',
  Health:       '🩺',
  Education:    '🎓',
  Language:     '📖',
}

export default function CatalogPage() {
  const { datasets, loading } = useCatalog()
  const [query, setQuery] = useState('')
  const [activeDomain, setActiveDomain] = useState('all')
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
      const matchQuery = !q || d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || d.domain.toLowerCase().includes(q)
      return matchDomain && matchQuery
    })
  }, [datasets, query, activeDomain])

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block"></span>
              Live Public Dataset Archive
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-normal text-slate-900 leading-tight mb-5">
              Uganda's public data,<br />
              <span className="italic text-amber-600">open to everyone.</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-2xl">
              Clean, standardized datasets covering demographics, economics, health, education, geography, and local languages. Free for researchers, journalists, developers, and policymakers.
            </p>

            {/* Search */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search datasets, districts, indicators..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent focus:bg-white transition placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-10 border-t border-slate-100">
            {[
              { value: '7', label: 'Curated Datasets' },
              { value: '135', label: 'Districts Covered' },
              { value: '10,671', label: 'Dictionary Words' },
              { value: '65 yrs', label: 'Historical Data' },
              { value: 'CC-BY', label: 'Open License' },
            ].map((stat, i, arr) => (
              <div key={stat.label} className="flex items-center gap-8">
                <div>
                  <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5 uppercase tracking-wide">{stat.label}</div>
                </div>
                {i < arr.length - 1 && <div className="w-px bg-slate-200 h-10" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              <FilterPill active={activeDomain === 'all'} onClick={() => setActiveDomain('all')}>
                All Datasets ({datasets.length})
              </FilterPill>
              {Object.entries(domains).map(([domain, count]) => (
                <FilterPill key={domain} active={activeDomain === domain} onClick={() => setActiveDomain(domain)}>
                  {DOMAIN_ICONS[domain]} {domain} ({count})
                </FilterPill>
              ))}
            </div>
            <span className="text-sm text-slate-400 font-medium shrink-0">
              {filtered.length} dataset{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 h-56 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-1/3 mb-4" />
                  <div className="h-5 bg-slate-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-full mb-1" />
                  <div className="h-3 bg-slate-100 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Database className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-base">No datasets match your search.</p>
              <button onClick={() => { setQuery(''); setActiveDomain('all') }} className="mt-3 text-sm text-amber-600 hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(dataset => (
                <DatasetCard key={dataset.id} dataset={dataset} onExplore={() => navigate(`/dataset/${dataset.id}`)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function FilterPill({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition ${
        active
          ? 'bg-slate-900 text-white border-slate-900'
          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-800'
      }`}
    >
      {children}
    </button>
  )
}

function DatasetCard({ dataset, onExplore }) {
  const badgeStyle = DOMAIN_STYLES[dataset.domain] || 'bg-slate-100 text-slate-600'

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${badgeStyle}`}>
          {dataset.domain}
        </span>
        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" /> {dataset.timeframe}
        </span>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 text-base leading-snug mb-1.5 group-hover:text-amber-700 transition">
          {dataset.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{dataset.description}</p>
      </div>

      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-auto">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shrink-0"></span>
        {dataset.source}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={onExplore}
          className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition"
        >
          Explore & Visualize
        </button>
        <a href={`/data/${dataset.id}.csv`} download title="Download CSV"
          className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition"
          onClick={e => e.stopPropagation()}>
          <Download className="w-4 h-4" />
        </a>
        <a href={`/data/${dataset.id}.json`} download title="Download JSON"
          className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition"
          onClick={e => e.stopPropagation()}>
          <FileCode className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
