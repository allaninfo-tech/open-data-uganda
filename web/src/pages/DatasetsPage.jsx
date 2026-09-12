import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
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
  Filter,
  SlidersHorizontal,
  X,
  Zap,
  Smartphone,
  Trees,
  Leaf,
  Wheat
} from 'lucide-react'
import { useCatalog } from '../hooks/useData'

const DOMAIN_CONFIG = {
  Demographics: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Users,
    color: '#2563eb',
  },
  Economics: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: TrendingUp,
    color: '#059669',
  },
  Agriculture: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Wheat,
    color: '#16a34a',
  },
  Infrastructure: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Zap,
    color: '#d97706',
  },
  Tourism: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Trees,
    color: '#059669',
  },
  Technology: {
    badge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    icon: Smartphone,
    color: '#0891b2',
  },
  Environment: {
    badge: 'bg-lime-50 text-lime-700 border-lime-200',
    icon: Leaf,
    color: '#65a30d',
  },
  Geospatial: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: MapPin,
    color: '#d97706',
  },
  Health: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: HeartPulse,
    color: '#e11d48',
  },
  Education: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: GraduationCap,
    color: '#7c3aed',
  },
  Language: {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: BookOpen,
    color: '#4f46e5',
  },
}

export default function DatasetsPage() {
  const { datasets, loading } = useCatalog()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const initialQuery = searchParams.get('q') || ''
  const initialDomain = searchParams.get('domain') || 'all'

  const [query, setQuery] = useState(initialQuery)
  const [activeDomain, setActiveDomain] = useState(initialDomain)

  useEffect(() => {
    const qParam = searchParams.get('q') || ''
    const dParam = searchParams.get('domain') || 'all'
    setQuery(qParam)
    setActiveDomain(dParam)
  }, [searchParams])

  const handleDomainChange = (domain) => {
    setActiveDomain(domain)
    const newParams = new URLSearchParams(searchParams)
    if (domain === 'all') {
      newParams.delete('domain')
    } else {
      newParams.set('domain', domain)
    }
    setSearchParams(newParams)
  }

  const handleQueryChange = (val) => {
    setQuery(val)
    const newParams = new URLSearchParams(searchParams)
    if (!val) {
      newParams.delete('q')
    } else {
      newParams.set('q', val)
    }
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setQuery('')
    setActiveDomain('all')
    setSearchParams({})
  }

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

  return (
    <div className="bg-slate-50/60 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link to="/" className="hover:text-slate-700 transition">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Datasets Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Uganda Public Datasets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Browse, search, and visualize all standardized datasets. Every dataset includes direct CSV and JSON downloads with full schema documentation.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-4 mb-8">
          
          {/* Top Row: Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              placeholder="Search by keywords, indicators, district name, or source..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 bg-slate-50/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition placeholder:text-slate-400"
            />
            {query && (
              <button
                onClick={() => handleQueryChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Bottom Row: Sector Pills & Result Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => handleDomainChange('all')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition cursor-pointer ${
                  activeDomain === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-900'
                }`}
              >
                <span>All ({datasets.length})</span>
              </button>

              {Object.entries(domains).map(([domain, count]) => {
                const cfg = DOMAIN_CONFIG[domain] || {}
                const IconComp = cfg.icon || Database
                const isActive = activeDomain === domain

                return (
                  <button
                    key={domain}
                    onClick={() => handleDomainChange(domain)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" style={{ color: isActive ? '#ffffff' : cfg.color }} />
                    <span>{domain} ({count})</span>
                  </button>
                )
              })}
            </div>

            <div className="text-xs text-slate-400 font-medium shrink-0">
              Showing <span className="font-bold text-slate-800">{filtered.length}</span> of {datasets.length} datasets
            </div>
          </div>

        </div>

        {/* Dataset Cards Grid */}
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
            <p className="font-bold text-base text-slate-800">No datasets match your search.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No results found for your query. Try broadening your keywords or clearing the active filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-2 text-xs font-semibold text-amber-600 hover:underline cursor-pointer"
            >
              Clear All Search &amp; Filters
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
    </div>
  )
}

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
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${cfg.badge}`}>
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
          <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-3">
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
