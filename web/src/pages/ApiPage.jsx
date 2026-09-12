import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Code2,
  Copy,
  Check,
  Download,
  FileCode,
  FileSpreadsheet,
  Globe,
  Database,
  ExternalLink,
  ShieldCheck,
  Layers
} from 'lucide-react'
import { useCatalog } from '../hooks/useData'

const CODE_EXAMPLES = {
  python: {
    title: 'Python (Pandas)',
    lang: 'python',
    code: `import pandas as pd

# Load Uganda district census directly over HTTPS
url = "https://opendata-ug.pages.dev/data/uganda-district-population.csv"
df = pd.read_csv(url)

# Display the top 5 most populous districts
print(df[['district', 'total_population', 'female_total', 'male_total']].head())`,
  },
  javascript: {
    title: 'JavaScript / Node.js',
    lang: 'javascript',
    code: `// Fetch macroeconomic indicators JSON directly from Cloudflare Pages
async function loadUgandaEconomy() {
  const res = await fetch('https://opendata-ug.pages.dev/data/uganda-macroeconomic-indicators.json');
  const data = await res.json();
  console.log('Latest year:', data[data.length - 1]);
}

loadUgandaEconomy();`,
  },
  curl: {
    title: 'cURL / Shell',
    lang: 'bash',
    code: `# Download the 104 WFP Food Markets geocoded CSV
curl -O https://opendata-ug.pages.dev/data/uganda-markets.csv

# Inspect the first 5 records with header
head -n 6 uganda-markets.csv`,
  },
  r: {
    title: 'R Statistical Language',
    lang: 'r',
    code: `# Read 65-year health trajectory directly into R
health_data <- read.csv("https://opendata-ug.pages.dev/data/uganda-key-health-indicators.csv")

# Summary of life expectancy and infant mortality
summary(health_data)`,
  },
  sheets: {
    title: 'Google Sheets / Excel',
    lang: 'excel',
    code: `=IMPORTDATA("https://opendata-ug.pages.dev/data/uganda-districts.csv")

// Paste this formula into cell A1 of any Google Sheet to load all 135 districts live!`,
  },
}

export default function ApiPage() {
  const { datasets } = useCatalog()
  const [activeLang, setActiveLang] = useState('python')
  const [copiedKey, setCopiedKey] = useState(null)

  const copySnippet = (key, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    })
  }

  return (
    <div className="bg-slate-50/60 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        
        {/* Breadcrumb & Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link to="/" className="hover:text-slate-700 transition">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">API &amp; Integration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Developer API &amp; Data Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
            Open Data Uganda is architected as an ultra-fast, serverless static CDN. All datasets are public, uncompressed, CORS-enabled, and accessible via standard HTTPS GET requests without API keys or rate limits.
          </p>
        </div>

        {/* Code Example Showcase */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Tabs Bar */}
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {Object.entries(CODE_EXAMPLES).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setActiveLang(key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeLang === key
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>

            <button
              onClick={() => copySnippet('active', CODE_EXAMPLES[activeLang].code)}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto"
            >
              {copiedKey === 'active' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'active' ? 'Copied' : 'Copy Snippet'}</span>
            </button>
          </div>

          {/* Code Window */}
          <div className="bg-slate-950 p-6 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
            <pre>{CODE_EXAMPLES[activeLang].code}</pre>
          </div>

        </div>

        {/* Catalog Endpoints Directory Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Direct Endpoints Directory
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Every dataset is available as raw CSV and array-structured JSON. Click any format to copy its endpoint or download the file.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Dataset Name</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Timeframe</th>
                  <th className="py-3 px-4">Direct CSV Endpoint</th>
                  <th className="py-3 px-4">Direct JSON Endpoint</th>
                  <th className="py-3 px-4">Interactive View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {datasets.map(d => {
                  const csvUrl = `https://opendata-ug.pages.dev/data/${d.id}.csv`
                  const jsonUrl = `https://opendata-ug.pages.dev/data/${d.id}.json`

                  return (
                    <tr key={d.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-sans font-bold text-slate-900">
                        {d.title}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {d.domain}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-sans">
                        {d.timeframe}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => copySnippet(d.id + '-csv', csvUrl)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-semibold transition cursor-pointer"
                        >
                          {copiedKey === d.id + '-csv' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>Copy CSV URL</span>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => copySnippet(d.id + '-json', jsonUrl)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-800 text-[10px] font-semibold transition cursor-pointer"
                        >
                          {copiedKey === d.id + '-json' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>Copy JSON URL</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <Link
                          to={`/dataset/${d.id}`}
                          className="text-amber-600 hover:text-amber-700 font-bold hover:underline"
                        >
                          Explore →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Features & Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">CORS Enabled Globally</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every resource allows cross-origin requests (<code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">Access-Control-Allow-Origin: *</code>). Integrate directly from clientside web applications without proxies.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">No Authentication Required</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Zero API keys, tokens, or signups. Pure open public data served edge-cached via Cloudflare CDN with sub-second response times worldwide.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">Automated CI Validation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every commit is validated via automated GitHub Actions testing for CSV integrity, JSONL valid formatting, and schema presence.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
