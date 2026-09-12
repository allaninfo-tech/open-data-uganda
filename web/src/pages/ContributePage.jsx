import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  GitPullRequest,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Github,
  Copy,
  Check,
  BookOpen,
  AlertTriangle,
  FileText
} from 'lucide-react'

export default function ContributePage() {
  const [copiedBib, setCopiedBib] = useState(false)

  const bibtex = `@misc{open_data_uganda_2026,
  author = {Open Data Uganda Contributors},
  title = {Open Data Uganda: Standardized Public Datasets Archive},
  year = {2026},
  publisher = {GitHub},
  journal = {GitHub repository},
  howpublished = {\\url{https://github.com/allaninfo-tech/open-data-uganda}}
}`

  const copyBib = () => {
    navigator.clipboard.writeText(bibtex).then(() => {
      setCopiedBib(true)
      setTimeout(() => setCopiedBib(false), 2000)
    })
  }

  return (
    <div className="bg-slate-50/60 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-6 space-y-10">
        
        {/* Breadcrumb & Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link to="/" className="hover:text-slate-700 transition">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Contribute &amp; Governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contribute to Open Data Uganda
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Open Data Uganda is maintained by open-source researchers, data scientists, journalists, and civic developers. We welcome new datasets, corrections, documentation improvements, and tool integrations.
          </p>
        </div>

        {/* 3 Step Contribution Guide */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            How to Submit a Dataset
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900">Prepare Data Files</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Create a folder under <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">datasets/&lt;domain&gt;/&lt;dataset-name&gt;/</code> containing:
              </p>
              <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                <li><code className="bg-slate-200 px-1 py-0.5 rounded">data.csv</code> (Tabular format)</li>
                <li><code className="bg-slate-200 px-1 py-0.5 rounded">data.jsonl</code> (1 valid JSON per line)</li>
                <li><code className="bg-slate-200 px-1 py-0.5 rounded">README.md</code> (Source, License, Schema)</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900">Run Validation Test</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Run our automated schema validator locally before opening a pull request:
              </p>
              <div className="bg-slate-950 text-slate-200 font-mono text-[10px] p-2.5 rounded-lg overflow-x-auto">
                python3 scripts/validate_datasets.py
              </div>
              <p className="text-[11px] text-emerald-600 font-medium">
                Checks schema sections, non-empty files, and syntax integrity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900">Open a Pull Request</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Push your branch and open a pull request on GitHub. Our CI actions will automatically run the test suite and verify dataset integrity.
              </p>
              <a
                href="https://github.com/allaninfo-tech/open-data-uganda/pulls"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-amber-600"
              >
                <span>View Pull Requests</span>
                <GitPullRequest className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Governance & Standards Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Licensing & Citation */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-base">Academic Citation</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              If you use Open Data Uganda in research papers, policy briefs, journalistic articles, or software, cite us using standard BibTeX:
            </p>
            <div className="relative">
              <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] overflow-x-auto leading-relaxed">
                {bibtex}
              </pre>
              <button
                onClick={copyBib}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              >
                {copiedBib ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Privacy & Safeguards */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">Privacy &amp; PII Policy</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Open Data Uganda enforces strict privacy safeguards. We do not accept datasets containing Personally Identifiable Information (PII) such as NINs, phone numbers, individual health records, or private addresses.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-800">Allowed Data Categories:</div>
              <div className="text-[11px] text-slate-500 space-y-1">
                <div>✔ District and national level aggregations</div>
                <div>✔ Public commodity markets and infrastructure</div>
                <div>✔ Open macroeconomic &amp; development indicators</div>
                <div>✔ Cultural and language reference materials</div>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Direct Link Card */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold">Have a question or request for a dataset?</h3>
            <p className="text-xs text-slate-400">Open an issue on GitHub to request or report inaccuracies.</p>
          </div>
          <a
            href="https://github.com/allaninfo-tech/open-data-uganda/issues/new/choose"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition whitespace-nowrap shadow-xs"
          >
            <Github className="w-4 h-4" />
            <span>Open GitHub Issue</span>
          </a>
        </div>

      </div>
    </div>
  )
}
