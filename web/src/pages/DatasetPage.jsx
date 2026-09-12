import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, FileCode, BarChart3, Table } from 'lucide-react'
import { useCatalog, useDataset } from '../hooks/useData'
import Visualizer from '../components/Visualizer'
import DataTable from '../components/DataTable'

const DOMAIN_STYLES = {
  Demographics: 'bg-blue-50 text-blue-700',
  Economics:    'bg-emerald-50 text-emerald-700',
  Geospatial:   'bg-amber-50 text-amber-700',
  Health:       'bg-rose-50 text-rose-700',
  Education:    'bg-purple-50 text-purple-700',
  Language:     'bg-indigo-50 text-indigo-700',
}

export default function DatasetPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { datasets } = useCatalog()
  const { data, loading } = useDataset(id)
  const [activeTab, setActiveTab] = useState('viz')

  const dataset = datasets.find(d => d.id === id)

  if (!dataset && datasets.length > 0) {
    return (
      <div className="text-center py-32 text-slate-400">
        <p className="text-lg font-semibold">Dataset not found.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-amber-600 hover:underline text-sm">← Back to all datasets</button>
      </div>
    )
  }

  const badgeStyle = DOMAIN_STYLES[dataset?.domain] || 'bg-slate-100 text-slate-600'

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button onClick={() => navigate('/')} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition mb-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> All Datasets
            </button>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{dataset?.title || '...'}</h1>
              {dataset && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${badgeStyle}`}>
                  {dataset.domain}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {dataset ? `Source: ${dataset.source} · Timeframe: ${dataset.timeframe} · License: ${dataset.license}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a href={`/data/${id}.csv`} download
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition">
              <Download className="w-3.5 h-3.5" /> Download CSV
            </a>
            <a href={`/data/${id}.json`} download
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition">
              <FileCode className="w-3.5 h-3.5" /> JSON
            </a>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-100 flex items-center gap-0">
          <TabBtn active={activeTab === 'viz'} onClick={() => setActiveTab('viz')} icon={<BarChart3 className="w-4 h-4" />}>
            Visualize
          </TabBtn>
          <TabBtn active={activeTab === 'table'} onClick={() => setActiveTab('table')} icon={<Table className="w-4 h-4" />}>
            Data Table
          </TabBtn>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading || !data ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 min-h-96 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm font-medium">Loading dataset...</p>
            </div>
          </div>
        ) : activeTab === 'viz' ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 min-h-96">
            <Visualizer dataset={dataset} data={data} />
          </div>
        ) : (
          <DataTable data={data} />
        )}
      </div>
    </div>
  )
}

function TabBtn({ children, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition ${
        active
          ? 'border-slate-900 text-slate-900'
          : 'border-transparent text-slate-400 hover:text-slate-600'
      }`}
    >
      {icon} {children}
    </button>
  )
}
