import { Outlet, useNavigate } from 'react-router-dom'
import { Github, Star, ExternalLink, ShieldCheck, FileText, Database } from 'lucide-react'

export default function Layout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
      
      {/* Top Notification / Authority Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs py-2 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>🇺🇬</span>
            <span className="font-semibold text-white">Open Data Uganda:</span>
            <span className="hidden sm:inline text-slate-400">An independent, public-interest open archive for research, journalism, and development.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden md:inline">Open License: CC-BY 4.0</span>
            <a
              href="https://github.com/allaninfo-tech/open-data-uganda"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition font-medium"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          
          {/* Brand Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-lg shadow-sm shadow-amber-500/20">
              🇺🇬
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-base tracking-tight leading-none">
                Open Data Uganda
              </div>
              <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mt-0.5">
                Official Public Archive
              </div>
            </div>
          </button>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-semibold text-slate-600">
            <button
              onClick={() => {
                navigate('/')
                document.getElementById('datasets')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="hover:text-slate-900 transition cursor-pointer"
            >
              All Datasets (7)
            </button>
            <button
              onClick={() => {
                navigate('/')
                document.getElementById('developer-access')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="hover:text-slate-900 transition cursor-pointer"
            >
              API &amp; Python
            </button>
            <a
              href="https://github.com/allaninfo-tech/open-data-uganda/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition"
            >
              Contribute
            </a>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/allaninfo-tech/open-data-uganda"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Star on GitHub</span>
              <span className="sm:hidden">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content View Outlet */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Comprehensive Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Brand column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🇺🇬</span>
                <span className="text-white font-bold text-base tracking-tight">Open Data Uganda</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                An open, community-maintained data portal dedicated to providing standardized, verified Ugandan public records for researchers, journalists, developers, and policymakers worldwide.
              </p>
              <div className="pt-1 text-xs text-slate-500">
                Released under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="text-slate-300 underline hover:text-white">Creative Commons Attribution 4.0 International (CC-BY 4.0)</a>.
              </div>
            </div>

            {/* Datasets Quick Nav */}
            <div className="md:col-span-3 space-y-3 text-xs">
              <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Datasets By Domain</div>
              <div className="space-y-2">
                <div onClick={() => navigate('/dataset/uganda-district-population')} className="hover:text-white transition cursor-pointer">👥 District Population Census</div>
                <div onClick={() => navigate('/dataset/uganda-macroeconomic-indicators')} className="hover:text-white transition cursor-pointer">📈 Macroeconomic Indicators</div>
                <div onClick={() => navigate('/dataset/uganda-markets')} className="hover:text-white transition cursor-pointer">🛒 WFP Food &amp; Commodity Markets</div>
                <div onClick={() => navigate('/dataset/uganda-key-health-indicators')} className="hover:text-white transition cursor-pointer">🩺 Key Health Indicators</div>
                <div onClick={() => navigate('/dataset/uganda-education-indicators')} className="hover:text-white transition cursor-pointer">🎓 Primary Education Stats</div>
                <div onClick={() => navigate('/dataset/runyankore-rukiga-dictionary')} className="hover:text-white transition cursor-pointer">📖 Runyankore-Rukiga Dictionary</div>
              </div>
            </div>

            {/* Resources & Open Source */}
            <div className="md:col-span-4 space-y-3 text-xs">
              <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Open Source &amp; Governance</div>
              <div className="space-y-2">
                <a href="https://github.com/allaninfo-tech/open-data-uganda" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">GitHub Repository</a>
                <a href="https://github.com/allaninfo-tech/open-data-uganda/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">Contribution Guidelines</a>
                <a href="https://github.com/allaninfo-tech/open-data-uganda/blob/main/CITATION.cff" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">Citation &amp; Academic Reference</a>
                <a href="https://github.com/allaninfo-tech/open-data-uganda/blob/main/SECURITY.md" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">Security &amp; PII Safeguards</a>
                <a href="https://github.com/allaninfo-tech/open-data-uganda/blob/main/CODE_OF_CONDUCT.md" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">Contributor Code of Conduct</a>
              </div>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>© {new Date().getFullYear()} Open Data Uganda. All data freely accessible.</div>
            <div className="flex items-center gap-2">
              <span>Hosted globally on</span>
              <span className="text-slate-300 font-semibold">Cloudflare Pages</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
