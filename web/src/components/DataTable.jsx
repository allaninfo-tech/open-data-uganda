import { useState, useMemo } from 'react'
import { Search, Copy, ChevronLeft, ChevronRight } from 'lucide-react'

export default function DataTable({ data }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [sortKey, setSortKey] = useState(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [copied, setCopied] = useState(false)

  const columns = data.length > 0 ? Object.keys(data[0]) : []

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    let rows = q
      ? data.filter(row => Object.values(row).some(v => v !== null && String(v).toLowerCase().includes(q)))
      : [...data]

    if (sortKey) {
      rows.sort((a, b) => {
        let va = a[sortKey], vb = b[sortKey]
        if (typeof va === 'string') va = va.toLowerCase()
        if (typeof vb === 'string') vb = vb.toLowerCase()
        if (va < vb) return sortAsc ? -1 : 1
        if (va > vb) return sortAsc ? 1 : -1
        return 0
      })
    }
    return rows
  }, [data, query, sortKey, sortAsc])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const handleSort = key => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  const handleCopy = () => {
    const tsv = [
      columns.join('\t'),
      ...filtered.map(row => columns.map(k => row[k] ?? '').join('\t'))
    ].join('\n')
    navigator.clipboard.writeText(tsv).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1) }}
            placeholder="Filter rows..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold focus:outline-none"
            >
              {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied!' : 'Copy All'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-slate-400 font-semibold w-10">#</th>
                {columns.map(col => (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wide text-slate-500 cursor-pointer select-none hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center gap-1">
                      {col.replace(/_/g, ' ')}
                      <span className="text-slate-300">
                        {sortKey === col ? (sortAsc ? '▲' : '▼') : '↕'}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {slice.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-4 text-slate-300">{((safePage - 1) * pageSize) + i + 1}</td>
                  {columns.map(col => (
                    <td key={col} className="py-2.5 px-4 text-slate-700 max-w-xs truncate">
                      {row[col] === null || row[col] === undefined
                        ? <span className="text-slate-300">—</span>
                        : typeof row[col] === 'number'
                          ? row[col].toLocaleString()
                          : String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
              {slice.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="py-12 text-center text-slate-400">
                    No matching rows found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Showing {filtered.length > 0 ? ((safePage - 1) * pageSize + 1).toLocaleString() : 0}–{Math.min(safePage * pageSize, filtered.length).toLocaleString()} of {filtered.length.toLocaleString()} rows
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-bold text-slate-700">Page {safePage} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
