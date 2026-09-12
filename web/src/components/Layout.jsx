import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Github, Star } from 'lucide-react'

export default function Layout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Bar */}
      <div className="bg-slate-900 text-slate-400 text-xs py-2 px-6 flex items-center justify-between">
        <span>🇺🇬 Uganda's Official Open Data Archive — Free for research, journalism & development</span>
        <a
          href="https://github.com/allaninfo-tech/open-data-uganda"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-slate-300 hover:text-white transition"
        >
          <Github className="w-3.5 h-3.5" /> GitHub
        </a>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-base leading-none">🇺🇬</div>
            <div className="flex flex-col leading-none text-left">
              <span className="font-bold text-slate-900 text-sm tracking-tight">Open Data Uganda</span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Public Archive</span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <button onClick={() => navigate('/')} className="hover:text-slate-900 transition">Datasets</button>
            <a href="https://github.com/allaninfo-tech/open-data-uganda/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition">Contribute</a>
            <a href="https://github.com/allaninfo-tech/open-data-uganda" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition">API / GitHub</a>
          </nav>

          <a
            href="https://github.com/allaninfo-tech/open-data-uganda"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition"
          >
            <Star className="w-3.5 h-3.5" /> Star on GitHub
          </a>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">Open Data Uganda</span>
                <span className="text-slate-600">🇺🇬</span>
              </div>
              <p className="text-sm text-slate-500 max-w-xs">Free, public, standardized datasets about Uganda for researchers, journalists, and developers.</p>
              <p className="text-xs">Licensed under <a href="https://creativecommons.org/licenses/by/4.0/" className="underline hover:text-white transition" target="_blank" rel="noopener noreferrer">CC-BY 4.0</a></p>
            </div>
            <div className="flex flex-wrap gap-8 text-sm">
              <div className="space-y-3">
                <div className="font-semibold text-slate-300 text-xs uppercase tracking-wider">Resources</div>
                <div className="space-y-2">
                  <a href="https://github.com/allaninfo-tech/open-data-uganda" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">GitHub Repository</a>
                  <a href="https://github.com/allaninfo-tech/open-data-uganda/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">Contribute Data</a>
                  <a href="https://github.com/allaninfo-tech/open-data-uganda/blob/main/CITATION.cff" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">Cite This Data</a>
                </div>
              </div>
              <div className="space-y-3">
                <div className="font-semibold text-slate-300 text-xs uppercase tracking-wider">Legal</div>
                <div className="space-y-2">
                  <a href="https://github.com/allaninfo-tech/open-data-uganda/blob/main/SECURITY.md" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">Security &amp; Privacy</a>
                  <a href="https://github.com/allaninfo-tech/open-data-uganda/blob/main/CODE_OF_CONDUCT.md" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">Code of Conduct</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
