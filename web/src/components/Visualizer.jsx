import { useEffect, useMemo, useRef, useState } from 'react'
import { Chart, registerables } from 'chart.js'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

Chart.register(...registerables)

export default function Visualizer({ dataset, data }) {
  if (!dataset || !data) return null

  switch (dataset.id) {
    case 'uganda-macroeconomic-indicators': return <MacroViz data={data} />
    case 'uganda-key-health-indicators':    return <HealthViz data={data} />
    case 'uganda-education-indicators':     return <EducationViz data={data} />
    case 'uganda-district-population':      return <DemographicsViz data={data} />
    case 'uganda-markets':                  return <MarketsMapViz data={data} />
    case 'uganda-districts':               return <DistrictsViz data={data} />
    case 'runyankore-rukiga-dictionary':   return <DictionaryViz data={data} />
    case 'uganda-national-parks':           return <NationalParksViz data={data} />
    case 'uganda-energy-and-electricity':   return <EnergyViz data={data} />
    case 'uganda-digital-and-telecom':      return <DigitalTelecomViz data={data} />
    case 'uganda-forest-and-land-cover':    return <EnvironmentViz data={data} />
    case 'uganda-staple-food-prices':       return <FoodPricesViz data={data} />
    case 'uganda-multilingual-nlp-parallel-corpus': return <NlpCorpusViz data={data} />
    case 'uganda-pm25-air-pollutant-emissions':     return <Pm25EmissionsViz data={data} />
    default: return <p className="text-slate-400 text-center py-12">No visualizer for this dataset.</p>
  }
}

/* ── Reusable Chart wrapper ───────────────────────────── */
function ChartBox({ children, title, subtitle }) {
  return (
    <div className="space-y-6">
      {(title || subtitle) && (
        <div>
          {title && <h3 className="font-semibold text-slate-900 text-base">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

function KpiGrid({ items }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-${items.length} gap-4`}>
      {items.map(({ label, value, sub, color = 'text-slate-900' }) => (
        <div key={label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{label}</div>
          <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
          {sub && <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>}
        </div>
      ))}
    </div>
  )
}

function useChart(canvasRef, config) {
  useEffect(() => {
    if (!canvasRef.current) return
    const chart = new Chart(canvasRef.current, config)
    return () => chart.destroy()
  }, [config])
}

const GRID_COLOR = 'rgba(0,0,0,0.05)'
const TEXT_COLOR = '#64748b'

/* ── 1. Macroeconomics ────────────────────────────────── */
function MacroViz({ data }) {
  const sorted = [...data].sort((a, b) => a.year - b.year)
  const latest = sorted.at(-1)
  const [metric, setMetric] = useState('gdp')
  const chartRef = useRef()

  const metrics = {
    gdp:       { label: 'GDP (Billion USD)', data: sorted.map(d => d.gdp_current_usd ? +(d.gdp_current_usd/1e9).toFixed(2) : null), color: '#10b981', fmt: v => `$${v}B` },
    growth:    { label: 'Annual Growth Rate (%)', data: sorted.map(d => d.gdp_growth_annual_pct), color: '#3b82f6', fmt: v => `${v}%` },
    perCapita: { label: 'GDP Per Capita (USD)', data: sorted.map(d => d.gdp_per_capita_usd), color: '#f59e0b', fmt: v => `$${v}` },
    inflation: { label: 'Inflation (CPI %)', data: sorted.map(d => d.inflation_cpi_annual_pct), color: '#f43f5e', fmt: v => `${v}%` },
    pop:       { label: 'Population (Millions)', data: sorted.map(d => d.population_total ? +(d.population_total/1e6).toFixed(2) : null), color: '#8b5cf6', fmt: v => `${v}M` },
  }

  const m = metrics[metric]

  useEffect(() => {
    if (!chartRef.current) return
    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: sorted.map(d => d.year),
        datasets: [{ label: m.label, data: m.data, borderColor: m.color, backgroundColor: m.color + '18', fill: true, tension: 0.35, pointRadius: 2, pointHoverRadius: 6, borderWidth: 2.5 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: TEXT_COLOR } }, tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${m.fmt(ctx.parsed.y)}` } } },
        scales: {
          x: { grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR } },
          y: { grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR, callback: v => m.fmt(v) } }
        }
      }
    })
    return () => chart.destroy()
  }, [metric])

  return (
    <ChartBox>
      <KpiGrid items={[
        { label: 'GDP', value: `$${(latest.gdp_current_usd/1e9).toFixed(1)}B`, sub: `Year ${latest.year}`, color: 'text-emerald-600' },
        { label: 'Growth', value: `${latest.gdp_growth_annual_pct?.toFixed(1)}%`, sub: 'Annual real growth', color: 'text-blue-600' },
        { label: 'Per Capita', value: `$${latest.gdp_per_capita_usd?.toFixed(0)}`, sub: 'Current USD', color: 'text-amber-600' },
        { label: 'Inflation', value: `${latest.inflation_cpi_annual_pct?.toFixed(1)}%`, sub: 'CPI annual', color: 'text-rose-600' },
      ]} />

      <div className="flex flex-wrap gap-2">
        {Object.entries(metrics).map(([key, { label, color }]) => (
          <button key={key} onClick={() => setMetric(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${metric === key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="h-80 relative">
        <canvas ref={chartRef} />
      </div>
    </ChartBox>
  )
}

/* ── 2. Health ────────────────────────────────────────── */
function HealthViz({ data }) {
  const sorted = [...data].sort((a, b) => a.year - b.year)
  const first = sorted[0], last = sorted.at(-1)
  const chartRef = useRef()

  useEffect(() => {
    if (!chartRef.current) return
    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: sorted.map(d => d.year),
        datasets: [
          { label: 'Life Expectancy (Years)', data: sorted.map(d => d.life_expectancy_years), borderColor: '#10b981', backgroundColor: '#10b98118', fill: true, yAxisID: 'yLife', tension: 0.3, borderWidth: 2.5 },
          { label: 'Infant Mortality (per 1,000)', data: sorted.map(d => d.infant_mortality_per_1000_live_births), borderColor: '#f43f5e', backgroundColor: '#f43f5e18', fill: true, yAxisID: 'yMort', tension: 0.3, borderWidth: 2.5 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { labels: { color: TEXT_COLOR } } },
        scales: {
          x: { grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR } },
          yLife: { type: 'linear', position: 'left', grid: { color: GRID_COLOR }, ticks: { color: '#10b981', callback: v => `${v} yrs` } },
          yMort: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#f43f5e', callback: v => `${v}/1k` } }
        }
      }
    })
    return () => chart.destroy()
  }, [])

  const lifeGain = (last.life_expectancy_years - first.life_expectancy_years).toFixed(1)
  const mortDrop = ((first.infant_mortality_per_1000_live_births - last.infant_mortality_per_1000_live_births) / first.infant_mortality_per_1000_live_births * 100).toFixed(0)

  return (
    <ChartBox>
      <KpiGrid items={[
        { label: 'Life Expectancy', value: `${last.life_expectancy_years} yrs`, sub: `▲ +${lifeGain} yrs since ${first.year}`, color: 'text-emerald-600' },
        { label: 'Infant Mortality', value: `${last.infant_mortality_per_1000_live_births}/1k`, sub: `▼ ${mortDrop}% reduction since ${first.year}`, color: 'text-rose-600' },
        { label: 'Years of Data', value: sorted.length, sub: `${first.year}–${last.year}` },
      ]} />
      <div className="h-80 relative"><canvas ref={chartRef} /></div>
    </ChartBox>
  )
}

/* ── 3. Education ─────────────────────────────────────── */
function EducationViz({ data }) {
  const sorted = [...data].sort((a, b) => a.year - b.year)
  const peak = sorted.reduce((m, d) => d.primary_enrollment_gross_pct > (m.primary_enrollment_gross_pct || 0) ? d : m, {})
  const chartRef = useRef()

  useEffect(() => {
    if (!chartRef.current) return
    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: sorted.map(d => d.year),
        datasets: [{
          label: 'Primary Gross Enrollment Ratio (%)',
          data: sorted.map(d => d.primary_enrollment_gross_pct),
          borderColor: '#8b5cf6', backgroundColor: '#8b5cf618', fill: true, tension: 0.3, borderWidth: 2.5,
          pointBackgroundColor: sorted.map(d => d.year === 1997 ? '#e02424' : '#8b5cf6'),
          pointRadius: sorted.map(d => d.year === 1997 ? 7 : 2)
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: TEXT_COLOR } },
          tooltip: { callbacks: { afterLabel: ctx => sorted[ctx.dataIndex].year === 1997 ? '★ UPE Policy launched!' : '' } }
        },
        scales: {
          x: { grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR } },
          y: { grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR, callback: v => `${v}%` } }
        }
      }
    })
    return () => chart.destroy()
  }, [])

  return (
    <ChartBox>
      <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900">
        <strong>1997 Milestone:</strong> Uganda launched Universal Primary Education (UPE), causing enrollment to surge past 100% as previously excluded age cohorts enrolled. The red dot marks this turning point.
      </div>
      <KpiGrid items={[
        { label: 'Pre-UPE Baseline (1996)', value: '73.6%', sub: 'Gross Enrollment Ratio' },
        { label: `Peak Enrollment (${peak.year})`, value: `${peak.primary_enrollment_gross_pct}%`, sub: 'All-time high', color: 'text-purple-600' },
        { label: 'Data Coverage', value: `${sorted.length} yrs`, sub: '1971 – 2017' },
      ]} />
      <div className="h-80 relative"><canvas ref={chartRef} /></div>
    </ChartBox>
  )
}

/* ── 4. Demographics ──────────────────────────────────── */
function DemographicsViz({ data }) {
  const sorted = [...data].sort((a, b) => b.total_population - a.total_population)
  const [selectedDistrict, setSelectedDistrict] = useState(sorted[0]?.district)
  const chartRef = useRef()
  const top12 = sorted.slice(0, 12)
  const totalPop = data.reduce((s, d) => s + (d.total_population || 0), 0)

  useEffect(() => {
    if (!chartRef.current) return
    const chart = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: top12.map(d => d.district),
        datasets: [
          { label: 'Female', data: top12.map(d => d.female_total), backgroundColor: 'rgba(244,63,94,0.85)', borderRadius: 4 },
          { label: 'Male', data: top12.map(d => d.male_total), backgroundColor: 'rgba(14,165,233,0.85)', borderRadius: 4 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: { legend: { labels: { color: TEXT_COLOR } } },
        scales: {
          x: { stacked: true, grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR, callback: v => `${(v/1e3).toFixed(0)}k` } },
          y: { stacked: true, grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR } }
        }
      }
    })
    return () => chart.destroy()
  }, [])

  const district = data.find(d => d.district === selectedDistrict) || data[0]
  const cohorts = ['00_04','05_09','10_14','15_19','20_24','25_29','30_34','35_39','40_44','45_49','50_54','55_59','60_64','65_69','70_74','75_79','80plus']
  const cohortLabels = ['0–4','5–9','10–14','15–19','20–24','25–29','30–34','35–39','40–44','45–49','50–54','55–59','60–64','65–69','70–74','75–79','80+']
  const maxVal = Math.max(...cohorts.flatMap(c => [district[`male_${c}`]||0, district[`female_${c}`]||0]))

  return (
    <ChartBox>
      <KpiGrid items={[
        { label: 'Total Population', value: `${(totalPop/1e6).toFixed(2)}M`, sub: '135 districts', color: 'text-blue-600' },
        { label: 'Female', value: `${((data.reduce((s,d)=>s+(d.female_total||0),0)/totalPop)*100).toFixed(1)}%`, sub: `${(data.reduce((s,d)=>s+(d.female_total||0),0)/1e6).toFixed(2)}M` },
        { label: 'Male', value: `${((data.reduce((s,d)=>s+(d.male_total||0),0)/totalPop)*100).toFixed(1)}%`, sub: `${(data.reduce((s,d)=>s+(d.male_total||0),0)/1e6).toFixed(2)}M` },
        { label: 'Districts', value: data.length, sub: '16 age cohorts each' },
      ]} />

      <div>
        <h4 className="font-semibold text-slate-800 text-sm mb-3">Top 12 Most Populous Districts</h4>
        <div className="h-80 relative"><canvas ref={chartRef} /></div>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <h4 className="font-semibold text-slate-800 text-sm">Age Pyramid — District Explorer</h4>
          <select
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {sorted.map(d => <option key={d.district} value={d.district}>{d.district} ({(d.total_population/1e3).toFixed(0)}k)</option>)}
          </select>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-1.5">
          <div className="flex justify-between text-[11px] font-bold pb-1 border-b border-slate-200 mb-2">
            <span className="text-sky-500">◀ Male ({district.male_total?.toLocaleString()})</span>
            <span className="text-slate-600">{district.district} ({district.total_population?.toLocaleString()})</span>
            <span className="text-rose-500">Female ({district.female_total?.toLocaleString()}) ▶</span>
          </div>
          {[...cohorts].reverse().map((c, i) => {
            const mVal = district[`male_${c}`] || 0
            const fVal = district[`female_${c}`] || 0
            const mPct = maxVal ? (mVal/maxVal*100).toFixed(1) : 0
            const fPct = maxVal ? (fVal/maxVal*100).toFixed(1) : 0
            const label = cohortLabels[cohorts.length - 1 - i]
            return (
              <div key={c} className="flex items-center gap-2 text-[10px] font-mono">
                <div className="flex-1 flex justify-end items-center gap-1">
                  <span className="text-slate-400 text-[9px] w-12 text-right">{mVal.toLocaleString()}</span>
                  <div className="h-3 bg-sky-400 rounded-l" style={{ width: `${mPct}%`, minWidth: mVal > 0 ? '2px' : 0 }} />
                </div>
                <div className="w-10 text-center text-slate-500 font-bold shrink-0">{label}</div>
                <div className="flex-1 flex justify-start items-center gap-1">
                  <div className="h-3 bg-rose-400 rounded-r" style={{ width: `${fPct}%`, minWidth: fVal > 0 ? '2px' : 0 }} />
                  <span className="text-slate-400 text-[9px] w-12">{fVal.toLocaleString()}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ChartBox>
  )
}

/* ── 5. Markets Map ───────────────────────────────────── */
const REGION_COLORS = { Central: '#e02424', Eastern: '#059669', Northern: '#2563eb', Western: '#d97706' }

function MarketsMapViz({ data }) {
  const [activeRegion, setActiveRegion] = useState('all')
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const layerGroupRef = useRef(null)

  const regions = [...new Set(data.map(d => d.region).filter(Boolean))]
  const filtered = activeRegion === 'all' ? data : data.filter(d => d.region === activeRegion)

  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([1.3733, 32.2903], 7)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map)
      mapInstanceRef.current = map
      layerGroupRef.current = L.layerGroup().addTo(map)
    }

    const layer = layerGroupRef.current
    layer.clearLayers()

    filtered.filter(m => m.latitude && m.longitude).forEach(m => {
      const color = REGION_COLORS[m.region] || '#f59e0b'
      const marker = L.circleMarker([m.latitude, m.longitude], {
        radius: 7,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        fillOpacity: 0.9,
      })
      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; font-size: 12px; line-height: 1.4; padding: 4px;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: #0f172a;">🛒 ${m.market_name}</div>
          <div style="color: #475569;"><strong>District:</strong> ${m.district}</div>
          <div style="color: #475569;"><strong>Region:</strong> <span style="color: ${color}; font-weight: 600;">${m.region}</span></div>
          <div style="color: #94a3b8; font-family: monospace; font-size: 10px; margin-top: 4px;">
            Lat: ${m.latitude?.toFixed(4)}, Lon: ${m.longitude?.toFixed(4)}
          </div>
        </div>
      `)
      layer.addLayer(marker)
    })
  }, [filtered])

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <ChartBox>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <RegionPill active={activeRegion === 'all'} onClick={() => setActiveRegion('all')}>All ({data.length})</RegionPill>
          {regions.map(r => (
            <RegionPill key={r} active={activeRegion === r} color={REGION_COLORS[r]} onClick={() => setActiveRegion(r)}>{r}</RegionPill>
          ))}
        </div>
        <span className="text-xs text-slate-400">{filtered.length} markets shown</span>
      </div>

      <div style={{ height: 520 }} className="rounded-xl overflow-hidden border border-slate-200">
        <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
      </div>
    </ChartBox>
  )
}

function RegionPill({ children, active, color, onClick }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>
      {active && color && <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: color }} />}
      {children}
    </button>
  )
}

/* ── 6. Districts ─────────────────────────────────────── */
function DistrictsViz({ data }) {
  const regionCounts = data.reduce((acc, d) => { acc[d.region_name] = (acc[d.region_name] || 0) + 1; return acc }, {})
  const chartRef = useRef()

  useEffect(() => {
    if (!chartRef.current) return
    const entries = Object.entries(regionCounts)
    const chart = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: entries.map(([k]) => k),
        datasets: [{ label: 'Districts', data: entries.map(([,v]) => v), backgroundColor: ['rgba(244,63,94,0.85)','rgba(16,185,129,0.85)','rgba(59,130,246,0.85)','rgba(245,158,11,0.85)'], borderRadius: 6 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR } },
          y: { grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR, stepSize: 5 } }
        }
      }
    })
    return () => chart.destroy()
  }, [])

  return (
    <ChartBox>
      <KpiGrid items={[
        { label: 'Total Districts', value: data.length, sub: 'Official admin units', color: 'text-amber-600' },
        ...Object.entries(regionCounts).map(([region, count]) => ({ label: region, value: count, sub: 'districts' }))
      ]} />
      <div className="h-72 relative"><canvas ref={chartRef} /></div>
    </ChartBox>
  )
}

/* ── 7. Dictionary ────────────────────────────────────── */
function DictionaryViz({ data }) {
  const [query, setQuery] = useState('')
  const [pos, setPos] = useState('all')
  const [letter, setLetter] = useState('all')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 18

  const filtered = data.filter(item => {
    if (letter !== 'all' && (!item.headword || !item.headword.toUpperCase().startsWith(letter))) return false
    if (pos !== 'all' && (!item.pos || !item.pos.toLowerCase().includes(pos))) return false
    if (query) {
      const q = query.toLowerCase()
      return (item.headword?.toLowerCase().includes(q) || item.definition?.toLowerCase().includes(q) || item.example_english?.toLowerCase().includes(q))
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const posCounts = data.reduce((acc, w) => { const p = w.pos || 'other'; acc[p] = (acc[p]||0)+1; return acc }, {})
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const handleQuery = q => { setQuery(q); setPage(1) }
  const handlePos   = p => { setPos(p); setPage(1) }
  const handleLetter = l => { setLetter(l); setPage(1) }

  const randomWord = () => {
    const w = data[Math.floor(Math.random() * data.length)]
    setQuery(w.headword)
    setPage(1)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Runyankore-Rukiga Lexicon</h3>
          <p className="text-sm text-slate-500">{data.length.toLocaleString()} words with definitions, part-of-speech, and usage examples</p>
        </div>
        <button onClick={randomWord}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold border border-amber-200 transition">
          🎲 Random Word
        </button>
      </div>

      {/* Search + POS filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input type="text" value={query} onChange={e => handleQuery(e.target.value)}
            placeholder="Search by Runyankore word or English definition..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
          />
        </div>
        <select value={pos} onChange={e => handlePos(e.target.value)}
          className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400">
          <option value="all">All Parts of Speech ({data.length.toLocaleString()})</option>
          {['n.','v.','a.','adv.','pron.','conj.','interj.'].map(p => (
            <option key={p} value={p}>{p} — {posCounts[p]?.toLocaleString() || 0}</option>
          ))}
        </select>
      </div>

      {/* A–Z jump */}
      <div className="flex flex-wrap gap-1">
        <button onClick={() => handleLetter('all')}
          className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${letter==='all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
          ALL
        </button>
        {alphabet.map(l => (
          <button key={l} onClick={() => handleLetter(l)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${letter===l ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Result count + pagination */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
        <span>{filtered.length.toLocaleString()} words found</span>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={safePage <= 1}
            className="px-2.5 py-1 rounded border border-slate-200 font-semibold hover:bg-slate-50 disabled:opacity-30">Prev</button>
          <span className="font-bold text-slate-700">Page {safePage} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={safePage >= totalPages}
            className="px-2.5 py-1 rounded border border-slate-200 font-semibold hover:bg-slate-50 disabled:opacity-30">Next</button>
        </div>
      </div>

      {/* Word Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-1">
        {pageItems.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            <p className="font-semibold">No words match your search.</p>
          </div>
        ) : pageItems.map((item, i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-base text-slate-900">{item.headword}</span>
              {item.pos && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">{item.pos}</span>}
              {item.clarifier && <span className="text-[10px] text-slate-400 italic">({item.clarifier})</span>}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{item.definition || <span className="italic text-slate-400">Definition unavailable</span>}</p>
            {item.example_runyankore && (
              <div className="pt-2 border-t border-slate-200 text-[11px] space-y-0.5">
                <div className="italic text-slate-500">"{item.example_runyankore}"</div>
                {item.example_english && <div className="text-slate-400">→ {item.example_english}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── 8. National Parks Map & Directory ────────────────── */
function NationalParksViz({ data }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const totalArea = data.reduce((s, p) => s + (p.area_sq_km || 0), 0)

  useEffect(() => {
    if (!mapRef.current) return
    if (!mapInstance.current) {
      const map = L.map(mapRef.current).setView([1.3733, 32.2903], 7)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map)
      mapInstance.current = map

      data.forEach(park => {
        if (!park.latitude || !park.longitude) return
        const isWorldHeritage = park.unesco_status?.includes('World Heritage')
        const marker = L.circleMarker([park.latitude, park.longitude], {
          radius: isWorldHeritage ? 10 : 8,
          fillColor: isWorldHeritage ? '#e11d48' : '#059669',
          color: '#ffffff',
          weight: 2,
          fillOpacity: 0.9,
        })
        marker.bindPopup(`
          <div style="font-family: 'Google Sans', sans-serif; font-size: 12px; line-height: 1.4; padding: 4px; max-width: 240px;">
            <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-bottom: 2px;">🌲 ${park.park_name}</div>
            <div style="color: #059669; font-weight: 600; font-size: 11px;">Est. ${park.established_year} · ${park.area_sq_km?.toLocaleString()} km²</div>
            <div style="color: #475569; font-size: 11px; margin-top: 4px;"><strong>Districts:</strong> ${park.districts}</div>
            <div style="color: #64748b; font-size: 10px; margin-top: 2px;"><strong>Wildlife:</strong> ${park.key_wildlife}</div>
            ${isWorldHeritage ? '<div style="background: #fff1f2; color: #be123c; font-weight: 700; font-size: 10px; padding: 2px 4px; border-radius: 4px; margin-top: 4px; display: inline-block;">★ UNESCO World Heritage Site</div>' : ''}
          </div>
        `)
        marker.addTo(map)
      })
    }
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [data])

  return (
    <ChartBox>
      <KpiGrid items={[
        { label: 'Total Parks', value: data.length, sub: 'Uganda Wildlife Authority', color: 'text-emerald-600' },
        { label: 'Protected Area', value: `${totalArea.toLocaleString()} km²`, sub: 'Conservation estate', color: 'text-blue-600' },
        { label: 'World Heritage', value: '2 Sites', sub: 'Bwindi & Rwenzori', color: 'text-rose-600' },
        { label: 'Largest Park', value: 'Murchison', sub: '3,893 km²', color: 'text-amber-600' },
      ]} />

      <div style={{ height: 480 }} className="rounded-2xl overflow-hidden border border-slate-200">
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {data.map(p => (
          <div key={p.park_id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-slate-300 transition">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{p.park_name}</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {p.area_sq_km?.toLocaleString()} km²
              </span>
            </div>
            <div className="text-xs text-slate-500">
              <strong>Ecosystem:</strong> {p.ecosystem}
            </div>
            <div className="text-xs text-slate-500">
              <strong>Wildlife:</strong> {p.key_wildlife}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/50">
              <span>Est. {p.established_year} · {p.region} Region</span>
              {p.unesco_status !== 'No' && (
                <span className="text-amber-700 font-semibold">{p.unesco_status}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </ChartBox>
  )
}

/* ── 9. Energy & Electricity Access ───────────────────── */
function EnergyViz({ data }) {
  const sorted = [...data].sort((a, b) => a.year - b.year)
  const chartRef = useRef()
  const latest = sorted.at(-1) || {}

  useEffect(() => {
    if (!chartRef.current) return
    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: sorted.map(d => d.year),
        datasets: [
          { label: 'Total Electricity Access (%)', data: sorted.map(d => d.electricity_access_total_pct), borderColor: '#f59e0b', backgroundColor: '#f59e0b15', fill: true, tension: 0.3, borderWidth: 2.5 },
          { label: 'Urban Access (%)', data: sorted.map(d => d.electricity_access_urban_pct), borderColor: '#3b82f6', tension: 0.3, borderWidth: 2, borderDash: [4, 4] },
          { label: 'Rural Access (%)', data: sorted.map(d => d.electricity_access_rural_pct), borderColor: '#10b981', tension: 0.3, borderWidth: 2 },
          { label: 'Renewable Electricity Output (%)', data: sorted.map(d => d.renewable_electricity_output_pct), borderColor: '#8b5cf6', tension: 0.3, borderWidth: 2 },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: TEXT_COLOR } } },
        scales: {
          x: { grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR } },
          y: { grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR, callback: v => `${v}%` } }
        }
      }
    })
    return () => chart.destroy()
  }, [])

  return (
    <ChartBox>
      <KpiGrid items={[
        { label: 'Total Access (Latest)', value: `${latest.electricity_access_total_pct}%`, sub: `Year ${latest.year}`, color: 'text-amber-600' },
        { label: 'Urban Electrification', value: `${latest.electricity_access_urban_pct}%`, sub: 'Urban population', color: 'text-blue-600' },
        { label: 'Rural Electrification', value: `${latest.electricity_access_rural_pct}%`, sub: 'Rural population', color: 'text-emerald-600' },
        { label: 'Renewable Generation', value: `${latest.renewable_electricity_output_pct || 88.5}%`, sub: 'Hydro & Solar', color: 'text-purple-600' },
      ]} />
      <div className="h-80 relative"><canvas ref={chartRef} /></div>
    </ChartBox>
  )
}

/* ── 10. Digital & Telecommunications ─────────────────── */
function DigitalTelecomViz({ data }) {
  const sorted = [...data].sort((a, b) => a.year - b.year)
  const chartRef = useRef()
  const latest = sorted.at(-1) || {}

  useEffect(() => {
    if (!chartRef.current) return
    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: sorted.map(d => d.year),
        datasets: [
          { label: 'Mobile Subscriptions (per 100 people)', data: sorted.map(d => d.mobile_subscriptions_per_100), borderColor: '#06b6d4', backgroundColor: '#06b6d418', fill: true, tension: 0.3, borderWidth: 2.5, yAxisID: 'yMob' },
          { label: 'Internet Users (% of population)', data: sorted.map(d => d.internet_users_pct), borderColor: '#ec4899', backgroundColor: '#ec489918', fill: true, tension: 0.3, borderWidth: 2.5, yAxisID: 'yNet' },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: TEXT_COLOR } } },
        scales: {
          x: { grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR } },
          yMob: { type: 'linear', position: 'left', grid: { color: GRID_COLOR }, ticks: { color: '#06b6d4', callback: v => `${v}/100` } },
          yNet: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#ec4899', callback: v => `${v}%` } }
        }
      }
    })
    return () => chart.destroy()
  }, [])

  return (
    <ChartBox>
      <KpiGrid items={[
        { label: 'Mobile Cellular Penetration', value: `${latest.mobile_subscriptions_per_100} / 100`, sub: `Year ${latest.year}`, color: 'text-cyan-600' },
        { label: 'Internet Penetration', value: `${latest.internet_users_pct}%`, sub: 'Population online', color: 'text-pink-600' },
        { label: 'Data Span', value: `${sorted.length} Years`, sub: '1995 – 2024' },
      ]} />
      <div className="h-80 relative"><canvas ref={chartRef} /></div>
    </ChartBox>
  )
}

/* ── 11. Forest & Land Cover ──────────────────────────── */
function EnvironmentViz({ data }) {
  const sorted = [...data].sort((a, b) => a.year - b.year)
  const chartRef = useRef()
  const first = sorted[0] || {}
  const latest = sorted.at(-1) || {}

  useEffect(() => {
    if (!chartRef.current) return
    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: sorted.map(d => d.year),
        datasets: [
          { label: 'Agricultural Land (% of land area)', data: sorted.map(d => d.agricultural_land_pct), borderColor: '#f59e0b', backgroundColor: '#f59e0b15', fill: true, tension: 0.3, borderWidth: 2.5 },
          { label: 'Forest Area (% of land area)', data: sorted.map(d => d.forest_area_pct), borderColor: '#10b981', backgroundColor: '#10b98115', fill: true, tension: 0.3, borderWidth: 2.5 },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: TEXT_COLOR } } },
        scales: {
          x: { grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR } },
          y: { grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR, callback: v => `${v}%` } }
        }
      }
    })
    return () => chart.destroy()
  }, [])

  return (
    <ChartBox>
      <KpiGrid items={[
        { label: 'Agricultural Land Cover', value: `${latest.agricultural_land_pct}%`, sub: `Expanded from ${first.agricultural_land_pct}% in ${first.year}`, color: 'text-amber-600' },
        { label: 'Forest Area (Current)', value: `${latest.forest_area_pct}%`, sub: `Down from ${first.forest_area_pct}% in ${first.year}`, color: 'text-emerald-600' },
        { label: 'Timeframe', value: `${sorted.length} Years`, sub: `${first.year} – ${latest.year}` },
      ]} />
      <div className="h-80 relative"><canvas ref={chartRef} /></div>
    </ChartBox>
  )
}

/* ── 12. Staple Food Commodity Prices ─────────────────── */
function FoodPricesViz({ data }) {
  const [selectedCommodity, setSelectedCommodity] = useState('Beans')
  const commodities = [...new Set(data.map(d => d.commodity).filter(Boolean))]
  const chartRef = useRef()

  const commodityData = useMemo(() => {
    return data
      .filter(d => d.commodity === selectedCommodity)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [data, selectedCommodity])

  // Group by date and calculate average price across reporting markets
  const aggregated = useMemo(() => {
    const byDate = {}
    commodityData.forEach(d => {
      if (!byDate[d.date]) byDate[d.date] = { sumUgx: 0, count: 0 }
      byDate[d.date].sumUgx += d.price_ugx
      byDate[d.date].count += 1
    })
    return Object.entries(byDate).map(([date, val]) => ({
      date,
      avgUgx: Math.round(val.sumUgx / val.count),
    })).sort((a, b) => a.date.localeCompare(b.date))
  }, [commodityData])

  const latestPrice = aggregated.at(-1)?.avgUgx || 0
  const oldestPrice = aggregated[0]?.avgUgx || 0

  useEffect(() => {
    if (!chartRef.current || aggregated.length === 0) return
    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: aggregated.map(d => d.date),
        datasets: [{
          label: `Average Retail/Wholesale Price (UGX / KG) - ${selectedCommodity}`,
          data: aggregated.map(d => d.avgUgx),
          borderColor: '#10b981',
          backgroundColor: '#10b98115',
          fill: true,
          tension: 0.25,
          borderWidth: 2,
          pointRadius: 1,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: TEXT_COLOR } } },
        scales: {
          x: { grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR, maxTicksLimit: 12 } },
          y: { grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR, callback: v => `UGX ${v.toLocaleString()}` } }
        }
      }
    })
    return () => chart.destroy()
  }, [aggregated, selectedCommodity])

  return (
    <ChartBox>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 mr-1">Select Commodity:</span>
        {commodities.map(c => (
          <button
            key={c}
            onClick={() => setSelectedCommodity(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
              selectedCommodity === c
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <KpiGrid items={[
        { label: `Latest ${selectedCommodity} Price`, value: `UGX ${latestPrice.toLocaleString()} / KG`, sub: 'National market average', color: 'text-emerald-600' },
        { label: 'Baseline Price (2015)', value: `UGX ${oldestPrice.toLocaleString()} / KG`, sub: 'Initial benchmark', color: 'text-slate-600' },
        { label: 'Price Observations', value: commodityData.length.toLocaleString(), sub: 'Across 7 major trading hubs' },
      ]} />

      <div className="h-80 relative"><canvas ref={chartRef} /></div>
    </ChartBox>
  )
}

/* ── 13. Multilingual Parallel NLP Benchmark (SALT) ───── */
function NlpCorpusViz({ data }) {
  const [search, setSearch] = useState('')
  const [splitFilter, setSplitFilter] = useState('all')
  const [activeLang, setActiveLang] = useState('luganda')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim()
    return data.filter(d => {
      const matchSplit = splitFilter === 'all' || d.split === splitFilter
      const matchSearch = !s ||
        d.english?.toLowerCase().includes(s) ||
        d.luganda?.toLowerCase().includes(s) ||
        d.runyankore_rukiga?.toLowerCase().includes(s) ||
        d.acholi?.toLowerCase().includes(s) ||
        d.ateso?.toLowerCase().includes(s) ||
        d.lugbara?.toLowerCase().includes(s)
      return matchSplit && matchSearch
    })
  }, [data, search, splitFilter])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const safePage = Math.min(page, Math.max(1, totalPages))
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const LANG_NAMES = {
    luganda: 'Luganda (Central)',
    runyankore_rukiga: 'Runyankore-Rukiga (Western)',
    acholi: 'Acholi (Northern)',
    ateso: 'Ateso (Eastern)',
    lugbara: 'Lugbara (West Nile)',
  }

  return (
    <ChartBox>
      <KpiGrid items={[
        { label: 'Parallel Sentences', value: data.length.toLocaleString(), sub: 'Multi-way aligned', color: 'text-indigo-600' },
        { label: 'Supported Languages', value: '6 Languages', sub: 'English + 5 Ugandan', color: 'text-blue-600' },
        { label: 'Translation Pairs', value: `${(data.length * 6).toLocaleString()}`, sub: 'Complete cross-lingual matrix', color: 'text-emerald-600' },
        { label: 'ML Purpose', value: 'NLP / NMT', sub: 'Sunbird AI Benchmark', color: 'text-amber-600' },
      ]} />

      {/* Controls Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search words or phrases across all 6 languages..."
            className="w-full sm:max-w-md px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-slate-400">Split:</span>
            {['all', 'test', 'dev'].map(sp => (
              <button
                key={sp}
                onClick={() => { setSplitFilter(sp); setPage(1) }}
                className={`px-3 py-1 rounded-lg uppercase text-[10px] transition cursor-pointer ${
                  splitFilter === sp
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {sp}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Target Language Selector */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-200/60 text-xs">
          <span className="text-slate-500 font-semibold mr-1">Primary Comparison:</span>
          {Object.entries(LANG_NAMES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveLang(key)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeLang === key
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Pagination & Count */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Showing {filtered.length} sentences</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="px-2.5 py-1 rounded border border-slate-200 font-semibold hover:bg-slate-50 disabled:opacity-30"
          >
            Prev
          </button>
          <span className="font-bold text-slate-700">Page {safePage} of {totalPages || 1}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="px-2.5 py-1 rounded border border-slate-200 font-semibold hover:bg-slate-50 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>

      {/* Parallel Sentence Cards */}
      <div className="space-y-3">
        {pageItems.map(item => (
          <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5 hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-100 pb-1.5">
              <span className="font-mono font-semibold text-slate-500">{item.id}</span>
              <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-600">{item.split} split</span>
            </div>

            {/* English Source */}
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">English:</div>
              <div className="text-xs sm:text-sm font-medium text-slate-900">{item.english}</div>
            </div>

            {/* Selected Ugandan Language Translation */}
            <div className="space-y-0.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">{LANG_NAMES[activeLang]}:</div>
              <div className="text-xs sm:text-sm font-semibold text-amber-950">{item[activeLang]}</div>
            </div>

            {/* Other Languages Accordion / Pills */}
            <div className="pt-1.5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(LANG_NAMES).filter(([k]) => k !== activeLang).map(([k, label]) => (
                <div key={k} className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">{label.split(' ')[0]}:</div>
                  <div className="text-slate-700 text-[11px] truncate">{item[k]}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ChartBox>
  )
}

/* ── 14. Fine Particulate Matter (PM2.5) Emissions ─────── */
function Pm25EmissionsViz({ data }) {
  const chartRef = useRef()
  const top12 = [...data].sort((a, b) => b.emissions_quantity_tonnes - a.emissions_quantity_tonnes).slice(0, 12)
  const totalEmissions = data.reduce((s, d) => s + (d.emissions_quantity_tonnes || 0), 0)

  useEffect(() => {
    if (!chartRef.current) return
    const chart = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: top12.map(d => d.location_name),
        datasets: [{
          label: 'PM2.5 Emissions (Metric Tonnes)',
          data: top12.map(d => d.emissions_quantity_tonnes),
          backgroundColor: 'rgba(239, 68, 68, 0.85)',
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: { legend: { labels: { color: TEXT_COLOR } } },
        scales: {
          x: { grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR, callback: v => `${v.toLocaleString()} t` } },
          y: { grid: { color: GRID_COLOR }, ticks: { color: TEXT_COLOR } }
        }
      }
    })
    return () => chart.destroy()
  }, [])

  return (
    <ChartBox>
      <KpiGrid items={[
        { label: 'Total PM2.5 Emissions', value: `${Math.round(totalEmissions).toLocaleString()} t`, sub: 'Annual emissions measured', color: 'text-red-600' },
        { label: 'Top Emission Hub', value: top12[0]?.location_name || 'Kampala', sub: `${Math.round(top12[0]?.emissions_quantity_tonnes || 0).toLocaleString()} t`, color: 'text-amber-600' },
        { label: 'Tracked Locations', value: data.length.toLocaleString(), sub: 'Counties & municipalities', color: 'text-blue-600' },
        { label: 'Pollutant', value: 'PM2.5', sub: 'Fine inhalable particles', color: 'text-purple-600' },
      ]} />

      <div className="h-96 relative"><canvas ref={chartRef} /></div>
    </ChartBox>
  )
}
