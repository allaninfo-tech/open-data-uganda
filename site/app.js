/**
 * Open Data Uganda Web Portal
 * Interactive catalog, visualizers, spreadsheet table viewer, and export tools.
 */

class OpenDataApp {
  constructor() {
    this.datasets = [];
    this.activeDataset = null;
    this.dataCache = {};
    this.activeTab = 'viz';
    this.activeDomain = 'all';
    
    // Table viewer state
    this.tableState = {
      page: 1,
      pageSize: 25,
      sortKey: null,
      sortAsc: true,
      query: '',
      filteredData: []
    };

    // Chart and map instances
    this.activeChart = null;
    this.activeMap = null;

    // Dictionary state
    this.dictState = {
      query: '',
      pos: 'all',
      letter: 'all',
      page: 1,
      pageSize: 20
    };

    this.init();
  }

  async init() {
    this.initTheme();
    this.bindEvents();
    await this.loadCatalog();
    this.handleRouting();
    window.addEventListener('hashchange', () => this.handleRouting());
  }

  // --- Theme Management ---
  initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    lucide.createIcons();
    if (this.activeTab === 'viz' && this.activeDataset) {
      this.renderVisualizer(this.activeDataset, this.dataCache[this.activeDataset.id]);
    }
  }

  // --- Event Bindings ---
  bindEvents() {
    document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());

    // Global catalog search
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
      globalSearch.addEventListener('input', (e) => {
        this.filterCatalog(e.target.value);
      });
    }

    // Domain filter tabs
    document.querySelectorAll('.domain-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.domain-filter').forEach(b => b.classList.remove('active'));
        const target = e.currentTarget;
        target.classList.add('active');
        this.activeDomain = target.getAttribute('data-domain');
        this.filterCatalog(document.getElementById('globalSearch')?.value || '');
      });
    });

    // Table search
    document.getElementById('tableSearch')?.addEventListener('input', (e) => {
      this.tableState.query = e.target.value.toLowerCase();
      this.tableState.page = 1;
      this.applyTableFilters();
    });

    // Table page size
    document.getElementById('pageSize')?.addEventListener('change', (e) => {
      this.tableState.pageSize = parseInt(e.target.value, 10);
      this.tableState.page = 1;
      this.renderTablePage();
    });
  }

  // --- Catalog Loading & Rendering ---
  async loadCatalog() {
    try {
      const res = await fetch('data/catalog.json');
      this.datasets = await res.json();
      this.renderCatalog(this.datasets);
    } catch (err) {
      console.error('Failed to load dataset catalog:', err);
      const grid = document.getElementById('datasetGrid');
      if (grid) {
        grid.innerHTML = `<div class="col-span-full p-8 text-center text-red-500">Failed to load dataset catalog. Please ensure data files are generated.</div>`;
      }
    }
  }

  renderCatalog(datasets) {
    const grid = document.getElementById('datasetGrid');
    if (!grid) return;

    if (datasets.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-400">
          <i data-lucide="search-x" class="w-12 h-12 mx-auto mb-3 opacity-40"></i>
          <p class="text-base font-semibold">No matching datasets found.</p>
          <p class="text-xs text-slate-500">Try adjusting your search terms or domain filter.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    const domainColors = {
      Demographics: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900',
      Economics: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
      Geospatial: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900',
      Health: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900',
      Education: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900',
      Language: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900',
    };

    grid.innerHTML = datasets.map(d => {
      const badgeStyle = domainColors[d.domain] || 'bg-slate-100 text-slate-700 border-slate-200';
      return `
        <div class="dataset-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition">
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badgeStyle}">
                ${d.domain}
              </span>
              <span class="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <i data-lucide="clock" class="w-3 h-3"></i> ${d.timeframe}
              </span>
            </div>

            <div class="flex items-start gap-3 pt-1">
              <div class="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 shrink-0">
                <i data-lucide="${d.icon || 'database'}" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-slate-900 dark:text-white text-base leading-snug hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer" onclick="app.exploreDataset('${d.id}')">
                  ${d.title}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  ${d.description}
                </p>
              </div>
            </div>

            <div class="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-500"></i>
              <span class="truncate">Source: ${d.source}</span>
            </div>
          </div>

          <div class="pt-5 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between gap-2">
            <button onclick="app.exploreDataset('${d.id}')" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition">
              <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i>
              <span>Explore & View</span>
            </button>
            <div class="flex items-center gap-1">
              <a href="${d.csv_file}" download title="Download CSV" class="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition">
                <i data-lucide="download" class="w-4 h-4"></i>
              </a>
              <a href="${d.json_file}" download title="Download JSON" class="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition">
                <i data-lucide="file-code" class="w-4 h-4"></i>
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons();
  }

  filterCatalog(query) {
    const q = (query || '').toLowerCase().trim();
    const filtered = this.datasets.filter(d => {
      const matchDomain = (this.activeDomain === 'all' || d.domain === this.activeDomain);
      const matchQuery = !q || 
        d.title.toLowerCase().includes(q) || 
        d.description.toLowerCase().includes(q) || 
        d.domain.toLowerCase().includes(q) ||
        d.source.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q);
      return matchDomain && matchQuery;
    });
    this.renderCatalog(filtered);
  }

  // --- Router & Views ---
  handleRouting() {
    const hash = window.location.hash;
    if (hash.startsWith('#dataset/')) {
      const id = hash.replace('#dataset/', '');
      this.exploreDataset(id, false);
    } else {
      this.showCatalog(false);
    }
  }

  showCatalog(updateHash = true) {
    if (updateHash) {
      window.location.hash = '';
    }
    document.getElementById('catalogView')?.classList.remove('hidden');
    document.getElementById('explorerView')?.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async exploreDataset(datasetId, updateHash = true) {
    const dataset = this.datasets.find(d => d.id === datasetId);
    if (!dataset) return;

    if (updateHash) {
      window.location.hash = `#dataset/${datasetId}`;
    }

    this.activeDataset = dataset;
    document.getElementById('catalogView')?.classList.add('hidden');
    document.getElementById('explorerView')?.classList.remove('hidden');

    // Header metadata
    const titleEl = document.getElementById('currentDatasetTitle');
    const domainEl = document.getElementById('currentDatasetDomain');
    const metaEl = document.getElementById('currentDatasetMeta');
    const csvBtn = document.getElementById('btnDownloadCsv');
    const jsonBtn = document.getElementById('btnDownloadJson');

    if (titleEl) titleEl.textContent = dataset.title;
    if (domainEl) {
      domainEl.textContent = dataset.domain;
      domainEl.className = 'text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
    }
    if (metaEl) {
      metaEl.textContent = `Source: ${dataset.source} • Timeframe: ${dataset.timeframe} • License: ${dataset.license}`;
    }
    if (csvBtn) csvBtn.href = dataset.csv_file;
    if (jsonBtn) jsonBtn.href = dataset.json_file;

    // Fetch data if not cached
    if (!this.dataCache[dataset.id]) {
      try {
        const res = await fetch(dataset.json_file);
        this.dataCache[dataset.id] = await res.json();
      } catch (err) {
        console.error('Error fetching dataset JSON:', err);
      }
    }

    const data = this.dataCache[dataset.id] || [];

    // Reset table search & pagination
    this.tableState.query = '';
    this.tableState.page = 1;
    this.tableState.sortKey = null;
    this.tableState.sortAsc = true;
    const searchInput = document.getElementById('tableSearch');
    if (searchInput) searchInput.value = '';

    // Render active tab
    this.switchTab(this.activeTab);
    lucide.createIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  switchTab(tab) {
    this.activeTab = tab;
    const tabViz = document.getElementById('tabViz');
    const tabTable = document.getElementById('tabTable');
    const vizContainer = document.getElementById('vizContainer');
    const tableContainer = document.getElementById('tableContainer');

    if (tab === 'viz') {
      tabViz?.classList.add('active', 'border-amber-500', 'text-amber-600', 'dark:text-amber-400');
      tabViz?.classList.remove('border-transparent', 'text-slate-500');
      tabTable?.classList.remove('active', 'border-amber-500', 'text-amber-600', 'dark:text-amber-400');
      tabTable?.classList.add('border-transparent', 'text-slate-500');
      vizContainer?.classList.remove('hidden');
      tableContainer?.classList.add('hidden');

      if (this.activeDataset) {
        this.renderVisualizer(this.activeDataset, this.dataCache[this.activeDataset.id] || []);
      }
    } else {
      tabTable?.classList.add('active', 'border-amber-500', 'text-amber-600', 'dark:text-amber-400');
      tabTable?.classList.remove('border-transparent', 'text-slate-500');
      tabViz?.classList.remove('active', 'border-amber-500', 'text-amber-600', 'dark:text-amber-400');
      tabViz?.classList.add('border-transparent', 'text-slate-500');
      tableContainer?.classList.remove('hidden');
      vizContainer?.classList.add('hidden');

      if (this.activeDataset) {
        this.initTable(this.dataCache[this.activeDataset.id] || []);
      }
    }
  }

  // ==========================================
  // VISUALIZERS (Interactive Charts, Maps & Lexicon)
  // ==========================================
  renderVisualizer(dataset, data) {
    const container = document.getElementById('vizContainer');
    if (!container) return;

    // Destroy existing chart if any
    if (this.activeChart) {
      this.activeChart.destroy();
      this.activeChart = null;
    }
    // Remove existing map if any
    if (this.activeMap) {
      this.activeMap.remove();
      this.activeMap = null;
    }

    if (!data || data.length === 0) {
      container.innerHTML = `<div class="p-8 text-center text-slate-400">No data records available to visualize.</div>`;
      return;
    }

    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    // Route by dataset ID / type
    switch (dataset.id) {
      case 'uganda-macroeconomic-indicators':
        this.renderMacroeconomicViz(container, data, gridColor, textColor);
        break;
      case 'uganda-key-health-indicators':
        this.renderHealthViz(container, data, gridColor, textColor);
        break;
      case 'uganda-education-indicators':
        this.renderEducationViz(container, data, gridColor, textColor);
        break;
      case 'uganda-district-population':
        this.renderDemographicsViz(container, data, gridColor, textColor);
        break;
      case 'uganda-markets':
        this.renderMarketsMapViz(container, data);
        break;
      case 'uganda-districts':
        this.renderDistrictsViz(container, data, gridColor, textColor);
        break;
      case 'runyankore-rukiga-dictionary':
        this.renderDictionaryViz(container, data);
        break;
      default:
        container.innerHTML = `<div class="p-8 text-center text-slate-400">Data visualizer ready in table view.</div>`;
    }

    lucide.createIcons();
  }

  // 1. Macroeconomics Visualizer
  renderMacroeconomicViz(container, data, gridColor, textColor) {
    // Sort chronologically
    const sorted = [...data].sort((a, b) => a.year - b.year);
    const latest = sorted[sorted.length - 1];

    container.innerHTML = `
      <div class="space-y-6">
        <!-- KPI Summary Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Current GDP</div>
            <div class="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">$${(latest.gdp_current_usd / 1e9).toFixed(2)}B</div>
            <div class="text-[10px] text-slate-400 mt-0.5">USD (Year ${latest.year})</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Annual Growth Rate</div>
            <div class="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">${latest.gdp_growth_annual_pct?.toFixed(1)}%</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Real GDP growth</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">GDP Per Capita</div>
            <div class="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">$${latest.gdp_per_capita_usd?.toFixed(0)}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Per person in USD</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Inflation Rate (CPI)</div>
            <div class="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">${latest.inflation_cpi_annual_pct?.toFixed(1)}%</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Annual consumer prices</div>
          </div>
        </div>

        <!-- Metric Switcher Pills -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold text-slate-500 mr-1">Select Metric:</span>
          <button id="macroGdpBtn" class="macro-pill active px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-white shadow-sm">GDP ($ Billions)</button>
          <button id="macroGrowthBtn" class="macro-pill px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Growth %</button>
          <button id="macroPerCapitaBtn" class="macro-pill px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Per Capita ($)</button>
          <button id="macroInflationBtn" class="macro-pill px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Inflation (CPI %)</button>
          <button id="macroPopBtn" class="macro-pill px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Population (M)</button>
        </div>

        <!-- Chart Container -->
        <div class="relative h-80 sm:h-96 w-full">
          <canvas id="macroChart"></canvas>
        </div>
      </div>
    `;

    const ctx = document.getElementById('macroChart').getContext('2d');
    const labels = sorted.map(d => d.year);

    const metricsConfig = {
      gdp: {
        label: 'Uganda GDP (Billion USD)',
        data: sorted.map(d => d.gdp_current_usd ? (d.gdp_current_usd / 1e9).toFixed(2) : null),
        color: '#10b981',
        yFormat: val => `$${val}B`
      },
      growth: {
        label: 'GDP Annual Growth Rate (%)',
        data: sorted.map(d => d.gdp_growth_annual_pct),
        color: '#3b82f6',
        yFormat: val => `${val}%`
      },
      perCapita: {
        label: 'GDP Per Capita (Current USD)',
        data: sorted.map(d => d.gdp_per_capita_usd),
        color: '#f59e0b',
        yFormat: val => `$${val}`
      },
      inflation: {
        label: 'Annual Inflation Rate (CPI %)',
        data: sorted.map(d => d.inflation_cpi_annual_pct),
        color: '#f43f5e',
        yFormat: val => `${val}%`
      },
      pop: {
        label: 'Total Population (Millions)',
        data: sorted.map(d => d.population_total ? (d.population_total / 1e6).toFixed(2) : null),
        color: '#8b5cf6',
        yFormat: val => `${val}M`
      }
    };

    let activeKey = 'gdp';

    const drawChart = (key) => {
      const cfg = metricsConfig[key];
      if (this.activeChart) this.activeChart.destroy();

      this.activeChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: cfg.label,
            data: cfg.data,
            borderColor: cfg.color,
            backgroundColor: `${cfg.color}18`,
            fill: true,
            tension: 0.35,
            pointRadius: 2,
            pointHoverRadius: 6,
            borderWidth: 2.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: textColor, font: { family: 'Plus Jakarta Sans', weight: '600' } } },
            tooltip: {
              padding: 10,
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${cfg.yFormat(ctx.parsed.y)}`
              }
            }
          },
          scales: {
            x: { grid: { color: gridColor }, ticks: { color: textColor } },
            y: { 
              grid: { color: gridColor }, 
              ticks: { color: textColor, callback: (val) => cfg.yFormat(val) } 
            }
          }
        }
      });
    };

    drawChart('gdp');

    // Button interactions
    const btns = {
      macroGdpBtn: 'gdp',
      macroGrowthBtn: 'growth',
      macroPerCapitaBtn: 'perCapita',
      macroInflationBtn: 'inflation',
      macroPopBtn: 'pop'
    };

    Object.entries(btns).forEach(([btnId, key]) => {
      document.getElementById(btnId)?.addEventListener('click', (e) => {
        document.querySelectorAll('.macro-pill').forEach(b => {
          b.classList.remove('bg-amber-500', 'text-white', 'shadow-sm');
          b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
        });
        e.currentTarget.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
        e.currentTarget.classList.add('bg-amber-500', 'text-white', 'shadow-sm');
        drawChart(key);
      });
    });
  }

  // 2. Health Indicators Visualizer
  renderHealthViz(container, data, gridColor, textColor) {
    const sorted = [...data].sort((a, b) => a.year - b.year);
    const earliest = sorted[0];
    const latest = sorted[sorted.length - 1];

    const lifeGain = (latest.life_expectancy_years - earliest.life_expectancy_years).toFixed(1);
    const mortDrop = ((earliest.infant_mortality_per_1000_live_births - latest.infant_mortality_per_1000_live_births) / earliest.infant_mortality_per_1000_live_births * 100).toFixed(0);

    container.innerHTML = `
      <div class="space-y-6">
        <!-- KPI Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Life Expectancy at Birth</div>
            <div class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">${latest.life_expectancy_years} Years</div>
            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">▲ +${lifeGain} years gained since ${earliest.year}</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Infant Mortality Rate</div>
            <div class="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">${latest.infant_mortality_per_1000_live_births} / 1k</div>
            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">▼ ${mortDrop}% reduction since ${earliest.year}</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Dataset Coverage</div>
            <div class="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">${sorted.length} Years</div>
            <div class="text-[10px] text-slate-400 mt-0.5">From ${earliest.year} to ${latest.year}</div>
          </div>
        </div>

        <!-- Chart -->
        <div class="relative h-80 sm:h-96 w-full">
          <canvas id="healthChart"></canvas>
        </div>
      </div>
    `;

    const ctx = document.getElementById('healthChart').getContext('2d');
    this.activeChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sorted.map(d => d.year),
        datasets: [
          {
            label: 'Life Expectancy (Years)',
            data: sorted.map(d => d.life_expectancy_years),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            yAxisID: 'yLife',
            tension: 0.3,
            borderWidth: 2.5
          },
          {
            label: 'Infant Mortality (per 1,000 live births)',
            data: sorted.map(d => d.infant_mortality_per_1000_live_births),
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            fill: true,
            yAxisID: 'yMort',
            tension: 0.3,
            borderWidth: 2.5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: textColor, font: { family: 'Plus Jakarta Sans', weight: '600' } } }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          yLife: {
            type: 'linear',
            position: 'left',
            grid: { color: gridColor },
            ticks: { color: '#10b981', callback: val => `${val} yrs` },
            title: { display: true, text: 'Life Expectancy (Years)', color: '#10b981' }
          },
          yMort: {
            type: 'linear',
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#f43f5e', callback: val => `${val} / 1k` },
            title: { display: true, text: 'Mortality / 1k births', color: '#f43f5e' }
          }
        }
      }
    });
  }

  // 3. Education Indicators Visualizer
  renderEducationViz(container, data, gridColor, textColor) {
    const sorted = [...data].sort((a, b) => a.year - b.year);
    const preUPE = sorted.filter(d => d.year < 1997);
    const postUPE = sorted.filter(d => d.year >= 1997);
    const peak = sorted.reduce((max, d) => (d.primary_enrollment_gross_pct > (max.primary_enrollment_gross_pct || 0)) ? d : max, {});

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Callout Banner -->
        <div class="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 flex items-center gap-3">
          <div class="p-2 rounded-lg bg-purple-600 text-white shrink-0">
            <i data-lucide="sparkles" class="w-4 h-4"></i>
          </div>
          <div class="text-xs text-purple-900 dark:text-purple-200">
            <strong>Historical Milestone:</strong> In <strong>1997</strong>, Uganda launched the pioneering <em>Universal Primary Education (UPE)</em> policy, causing Primary Gross Enrollment to rapidly surge past 100% due to the enrollment of previously excluded age cohorts.
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Pre-UPE Baseline (1996)</div>
            <div class="text-xl font-extrabold text-slate-700 dark:text-slate-300 mt-1">73.6%</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Gross Enrollment Ratio</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Post-UPE Peak (${peak.year})</div>
            <div class="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">${peak.primary_enrollment_gross_pct}%</div>
            <div class="text-[10px] text-purple-500 mt-0.5">All-time record enrollment</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 col-span-2 md:col-span-1">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Time Series Length</div>
            <div class="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">${sorted.length} Years</div>
            <div class="text-[10px] text-slate-400 mt-0.5">1971 to 2017</div>
          </div>
        </div>

        <!-- Chart -->
        <div class="relative h-80 sm:h-96 w-full">
          <canvas id="eduChart"></canvas>
        </div>
      </div>
    `;

    const ctx = document.getElementById('eduChart').getContext('2d');
    this.activeChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sorted.map(d => d.year),
        datasets: [{
          label: 'Primary Gross Enrollment Ratio (%)',
          data: sorted.map(d => d.primary_enrollment_gross_pct),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          fill: true,
          tension: 0.3,
          borderWidth: 2.5,
          pointBackgroundColor: sorted.map(d => d.year === 1997 ? '#e02424' : '#8b5cf6'),
          pointRadius: sorted.map(d => d.year === 1997 ? 7 : 3)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor, font: { family: 'Plus Jakarta Sans', weight: '600' } } },
          tooltip: {
            callbacks: {
              afterLabel: (ctx) => {
                const yr = sorted[ctx.dataIndex].year;
                if (yr === 1997) return '★ Universal Primary Education (UPE) launched!';
                return '';
              }
            }
          }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          y: { 
            grid: { color: gridColor }, 
            ticks: { color: textColor, callback: val => `${val}%` } 
          }
        }
      }
    });
  }

  // 4. Demographics Visualizer (Top Districts + Age Pyramid Explorer)
  renderDemographicsViz(container, data, gridColor, textColor) {
    const totalPop = data.reduce((acc, d) => acc + (d.total_population || 0), 0);
    const totalFemale = data.reduce((acc, d) => acc + (d.female_total || 0), 0);
    const totalMale = data.reduce((acc, d) => acc + (d.male_total || 0), 0);
    const femalePct = ((totalFemale / totalPop) * 100).toFixed(1);
    const malePct = ((totalMale / totalPop) * 100).toFixed(1);

    // Sort districts by total population descending
    const sortedDistricts = [...data].sort((a, b) => b.total_population - a.total_population);
    const top10 = sortedDistricts.slice(0, 12);

    container.innerHTML = `
      <div class="space-y-6">
        <!-- National Summary -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Population</div>
            <div class="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">${(totalPop / 1e6).toFixed(2)}M</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Across 135 Districts</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Female Population</div>
            <div class="text-xl font-extrabold text-rose-500 dark:text-rose-400 mt-1">${femalePct}%</div>
            <div class="text-[10px] text-slate-400 mt-0.5">${(totalFemale / 1e6).toFixed(2)} Million</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Male Population</div>
            <div class="text-xl font-extrabold text-sky-500 dark:text-sky-400 mt-1">${malePct}%</div>
            <div class="text-[10px] text-slate-400 mt-0.5">${(totalMale / 1e6).toFixed(2)} Million</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Districts Documented</div>
            <div class="text-xl font-extrabold text-amber-500 dark:text-amber-400 mt-1">${data.length}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">16 age cohorts per district</div>
          </div>
        </div>

        <!-- Section 1: Top Populated Districts Bar Chart -->
        <div>
          <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Top 12 Most Populous Districts (Male vs Female)</h4>
          <div class="relative h-80 w-full">
            <canvas id="districtBarChart"></canvas>
          </div>
        </div>

        <!-- Section 2: Interactive Age Pyramid for any District -->
        <div class="pt-4 border-t border-slate-200 dark:border-slate-800">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200">District Age-Cohort Pyramid</h4>
              <p class="text-xs text-slate-500">Explore population structure by 5-year age groups for any district</p>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-xs font-semibold text-slate-500">Select District:</label>
              <select id="districtSelect" class="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500">
                ${sortedDistricts.map(d => `<option value="${d.district}">${d.district} (${(d.total_population / 1e3).toFixed(0)}k)</option>`).join('')}
              </select>
            </div>
          </div>

          <div id="pyramidContainer" class="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <!-- Rendered by renderPyramid -->
          </div>
        </div>
      </div>
    `;

    // Render Top Districts Bar Chart
    const ctx = document.getElementById('districtBarChart').getContext('2d');
    this.activeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: top10.map(d => d.district),
        datasets: [
          {
            label: 'Female Population',
            data: top10.map(d => d.female_total),
            backgroundColor: 'rgba(244, 63, 94, 0.85)',
            borderRadius: 4
          },
          {
            label: 'Male Population',
            data: top10.map(d => d.male_total),
            backgroundColor: 'rgba(14, 165, 233, 0.85)',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true, grid: { color: gridColor }, ticks: { color: textColor } },
          y: { 
            stacked: true, 
            grid: { color: gridColor }, 
            ticks: { color: textColor, callback: val => `${(val / 1e3).toFixed(0)}k` } 
          }
        },
        plugins: {
          legend: { labels: { color: textColor, font: { family: 'Plus Jakarta Sans', weight: '600' } } }
        }
      }
    });

    // Age Pyramid Function
    const cohorts = [
      { key: '00_04', label: '0–4' },
      { key: '05_09', label: '5–9' },
      { key: '10_14', label: '10–14' },
      { key: '15_19', label: '15–19' },
      { key: '20_24', label: '20–24' },
      { key: '25_29', label: '25–29' },
      { key: '30_34', label: '30–34' },
      { key: '35_39', label: '35–39' },
      { key: '40_44', label: '40–44' },
      { key: '45_49', label: '45–49' },
      { key: '50_54', label: '50–54' },
      { key: '55_59', label: '55–59' },
      { key: '60_64', label: '60–64' },
      { key: '65_69', label: '65–69' },
      { key: '70_74', label: '70–74' },
      { key: '75_79', label: '75–79' },
      { key: '80plus', label: '80+' }
    ];

    const renderPyramid = (districtName) => {
      const dist = data.find(d => d.district === districtName) || data[0];
      const pContainer = document.getElementById('pyramidContainer');
      if (!pContainer) return;

      // Find max cohort value for scaling
      let maxCohort = 1;
      cohorts.forEach(c => {
        const m = dist[`male_${c.key}`] || 0;
        const f = dist[`female_${c.key}`] || 0;
        if (m > maxCohort) maxCohort = m;
        if (f > maxCohort) maxCohort = f;
      });

      pContainer.innerHTML = `
        <div class="flex items-center justify-between text-xs font-bold pb-2 border-b border-slate-200 dark:border-slate-700">
          <span class="text-sky-500 flex items-center gap-1">◀ Male (${(dist.male_total).toLocaleString()})</span>
          <span class="text-slate-600 dark:text-slate-300 font-semibold">${dist.district} (Total: ${(dist.total_population).toLocaleString()})</span>
          <span class="text-rose-500 flex items-center gap-1">Female (${(dist.female_total).toLocaleString()}) ▶</span>
        </div>
        <div class="space-y-1.5 pt-3">
          ${[...cohorts].reverse().map(c => {
            const mVal = dist[`male_${c.key}`] || 0;
            const fVal = dist[`female_${c.key}`] || 0;
            const mPct = (mVal / maxCohort * 100).toFixed(1);
            const fPct = (fVal / maxCohort * 100).toFixed(1);

            return `
              <div class="flex items-center text-[10px] font-mono gap-2">
                <!-- Male Bar (Right aligned) -->
                <div class="flex-1 flex justify-end items-center gap-1.5">
                  <span class="text-slate-400 text-[9px]">${mVal.toLocaleString()}</span>
                  <div class="h-3.5 bg-sky-500 rounded-l transition-all duration-300" style="width: ${mPct}%;"></div>
                </div>
                <!-- Cohort Label -->
                <div class="w-12 text-center text-slate-500 dark:text-slate-400 font-bold shrink-0">
                  ${c.label}
                </div>
                <!-- Female Bar (Left aligned) -->
                <div class="flex-1 flex justify-start items-center gap-1.5">
                  <div class="h-3.5 bg-rose-500 rounded-r transition-all duration-300" style="width: ${fPct}%;"></div>
                  <span class="text-slate-400 text-[9px]">${fVal.toLocaleString()}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    };

    renderPyramid(sortedDistricts[0].district);

    document.getElementById('districtSelect')?.addEventListener('change', (e) => {
      renderPyramid(e.target.value);
    });
  }

  // 5. Food Markets Interactive Map
  renderMarketsMapViz(container, data) {
    container.innerHTML = `
      <div class="space-y-4">
        <!-- Region Filter Pills -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-semibold text-slate-500 mr-1">Filter by Region:</span>
            <button class="market-region-filter active px-3 py-1 text-xs font-semibold rounded-lg bg-amber-500 text-white shadow-sm" data-region="all">All (104)</button>
            <button class="market-region-filter px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300" data-region="Central">Central</button>
            <button class="market-region-filter px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300" data-region="Eastern">Eastern</button>
            <button class="market-region-filter px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300" data-region="Northern">Northern</button>
            <button class="market-region-filter px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300" data-region="Western">Western</button>
          </div>

          <div id="marketCountDisplay" class="text-xs text-slate-400 font-medium">
            Displaying 104 markets with GPS coordinates
          </div>
        </div>

        <!-- Leaflet Map Container -->
        <div id="mapContainer" class="border border-slate-200 dark:border-slate-800 shadow-inner"></div>
      </div>
    `;

    // Initialize Leaflet Map centered on Uganda [1.3733, 32.2903]
    const map = L.map('mapContainer').setView([1.3733, 32.2903], 7);
    this.activeMap = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const regionColors = {
      Central: '#e02424',
      Eastern: '#059669',
      Northern: '#2563eb',
      Western: '#d97706'
    };

    let markerLayer = L.layerGroup().addTo(map);

    const populateMarkers = (region = 'all') => {
      markerLayer.clearLayers();
      const filtered = region === 'all' ? data : data.filter(m => m.region === region);

      filtered.forEach(m => {
        if (!m.latitude || !m.longitude) return;
        const color = regionColors[m.region] || '#f59e0b';

        const iconHtml = `
          <div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>
        `;
        const customIcon = L.divIcon({
          className: 'custom-market-pin',
          html: iconHtml,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        const marker = L.marker([m.latitude, m.longitude], { icon: customIcon });
        marker.bindPopup(`
          <div class="p-3 text-slate-900">
            <div class="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span>🛒</span> ${m.market_name}
            </div>
            <div class="mt-1 text-xs space-y-0.5 text-slate-600">
              <div><strong>District:</strong> ${m.district}</div>
              <div><strong>Region:</strong> <span style="color: ${color}; font-weight: 600;">${m.region}</span></div>
              <div class="font-mono text-[10px] text-slate-400 mt-1">Lat: ${m.latitude.toFixed(4)}, Lon: ${m.longitude.toFixed(4)}</div>
            </div>
          </div>
        `);
        markerLayer.addLayer(marker);
      });

      const countDisplay = document.getElementById('marketCountDisplay');
      if (countDisplay) {
        countDisplay.textContent = `Displaying ${filtered.length} of ${data.length} markets`;
      }
    };

    populateMarkers('all');

    // Region pill clicks
    document.querySelectorAll('.market-region-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.market-region-filter').forEach(b => {
          b.classList.remove('active', 'bg-amber-500', 'text-white', 'shadow-sm');
          b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
        });
        e.currentTarget.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
        e.currentTarget.classList.add('active', 'bg-amber-500', 'text-white', 'shadow-sm');
        const reg = e.currentTarget.getAttribute('data-region');
        populateMarkers(reg);
      });
    });
  }

  // 6. Districts Directory Visualizer
  renderDistrictsViz(container, data, gridColor, textColor) {
    const regionCounts = {};
    data.forEach(d => {
      regionCounts[d.region_name] = (regionCounts[d.region_name] || 0) + 1;
    });

    container.innerHTML = `
      <div class="space-y-6">
        <!-- KPI Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Districts</div>
            <div class="text-2xl font-extrabold text-amber-500 dark:text-amber-400 mt-1">${data.length}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Official Administrative Units</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Central Region</div>
            <div class="text-2xl font-extrabold text-rose-500 dark:text-rose-400 mt-1">${regionCounts['Central'] || 0}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Includes Kampala Capital</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Eastern Region</div>
            <div class="text-2xl font-extrabold text-emerald-500 dark:text-emerald-400 mt-1">${regionCounts['Eastern'] || 0}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Sub-regions: Busoga, Bugisu...</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Northern & Western</div>
            <div class="text-2xl font-extrabold text-blue-500 dark:text-blue-400 mt-1">${(regionCounts['Northern'] || 0) + (regionCounts['Western'] || 0)}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">North: ${regionCounts['Northern'] || 0}, West: ${regionCounts['Western'] || 0}</div>
          </div>
        </div>

        <!-- Regional Distribution Bar Chart -->
        <div>
          <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Districts per Geographic Region</h4>
          <div class="relative h-72 w-full">
            <canvas id="districtsRegionChart"></canvas>
          </div>
        </div>
      </div>
    `;

    const ctx = document.getElementById('districtsRegionChart').getContext('2d');
    this.activeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(regionCounts),
        datasets: [{
          label: 'Number of Districts',
          data: Object.values(regionCounts),
          backgroundColor: [
            'rgba(244, 63, 94, 0.85)',
            'rgba(16, 185, 129, 0.85)',
            'rgba(59, 130, 246, 0.85)',
            'rgba(245, 158, 11, 0.85)'
          ],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          y: { 
            grid: { color: gridColor }, 
            ticks: { color: textColor, stepSize: 5 } 
          }
        }
      }
    });
  }

  // 7. Runyankore-Rukiga Dictionary Visualizer & Search Engine
  renderDictionaryViz(container, data) {
    const totalWords = data.length;
    
    // Extract unique POS tags
    const posCounts = {};
    data.forEach(w => {
      const p = w.pos || 'other';
      posCounts[p] = (posCounts[p] || 0) + 1;
    });

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    container.innerHTML = `
      <div class="space-y-5">
        <!-- Dictionary Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>📖</span> Runyankore-Rukiga Lexicon Search
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Browse <strong>${totalWords.toLocaleString()}</strong> words with grammatical markers, English definitions, and usage examples.
            </p>
          </div>

          <button id="dictRandomBtn" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 transition">
            <i data-lucide="shuffle" class="w-3.5 h-3.5"></i> Discover Random Word
          </button>
        </div>

        <!-- Search & Filter Controls -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
          <!-- Search Input -->
          <div class="md:col-span-8 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <i data-lucide="search" class="w-4 h-4"></i>
            </div>
            <input 
              type="text" 
              id="dictSearchInput" 
              placeholder="Search by Runyankore word (e.g. omuntu, embwa) or English (e.g. person, dog)..." 
              class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
          </div>

          <!-- POS Selector -->
          <div class="md:col-span-4">
            <select id="dictPosSelect" class="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option value="all">All Parts of Speech (${totalWords.toLocaleString()})</option>
              <option value="n.">Nouns (n.)</option>
              <option value="v.">Verbs (v.)</option>
              <option value="a.">Adjectives (a.)</option>
              <option value="adv.">Adverbs (adv.)</option>
              <option value="pron.">Pronouns (pron.)</option>
              <option value="conj.">Conjunctions (conj.)</option>
              <option value="interj.">Interjections (interj.)</option>
            </select>
          </div>
        </div>

        <!-- A-Z Alphabet Quick Jump -->
        <div class="flex flex-wrap items-center gap-1 text-[11px] font-semibold py-1">
          <button class="dict-letter active px-2 py-0.5 rounded bg-amber-500 text-white" data-letter="all">ALL</button>
          ${alphabet.map(l => `<button class="dict-letter px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100 hover:text-amber-700 dark:hover:bg-slate-700" data-letter="${l}">${l}</button>`).join('')}
        </div>

        <!-- Status / Results Summary -->
        <div class="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2">
          <span id="dictResultCount">Showing first 20 results</span>
          <div class="flex items-center gap-2">
            <button id="dictPrevBtn" class="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold disabled:opacity-30">Prev</button>
            <span id="dictPageNum" class="font-bold">Page 1</span>
            <button id="dictNextBtn" class="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold disabled:opacity-30">Next</button>
          </div>
        </div>

        <!-- Dictionary Cards Container -->
        <div id="dictCardsGrid" class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[550px] overflow-y-auto pr-1">
          <!-- Populated by renderDictCards -->
        </div>
      </div>
    `;

    let currentFiltered = data;

    const filterDictionary = () => {
      const q = (this.dictState.query || '').trim().toLowerCase();
      const pos = this.dictState.pos;
      const letter = this.dictState.letter;

      currentFiltered = data.filter(item => {
        // Letter filter
        if (letter !== 'all') {
          if (!item.headword || !item.headword.toUpperCase().startsWith(letter)) return false;
        }
        // POS filter
        if (pos !== 'all') {
          if (!item.pos || !item.pos.toLowerCase().includes(pos)) return false;
        }
        // Search query
        if (q) {
          const matchHead = item.headword && item.headword.toLowerCase().includes(q);
          const matchDef = item.definition && item.definition.toLowerCase().includes(q);
          const matchEx = item.example_english && item.example_english.toLowerCase().includes(q);
          return matchHead || matchDef || matchEx;
        }
        return true;
      });

      this.dictState.page = 1;
      renderDictCards();
    };

    const renderDictCards = () => {
      const grid = document.getElementById('dictCardsGrid');
      const countEl = document.getElementById('dictResultCount');
      const pageNumEl = document.getElementById('dictPageNum');
      const prevBtn = document.getElementById('dictPrevBtn');
      const nextBtn = document.getElementById('dictNextBtn');
      if (!grid) return;

      const page = this.dictState.page;
      const size = this.dictState.pageSize;
      const start = (page - 1) * size;
      const end = start + size;
      const pageItems = currentFiltered.slice(start, end);
      const totalPages = Math.ceil(currentFiltered.length / size) || 1;

      if (countEl) countEl.textContent = `Found ${currentFiltered.length.toLocaleString()} matching words`;
      if (pageNumEl) pageNumEl.textContent = `Page ${page} of ${totalPages}`;
      if (prevBtn) prevBtn.disabled = page <= 1;
      if (nextBtn) nextBtn.disabled = page >= totalPages;

      if (pageItems.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full py-12 text-center text-slate-400">
            <i data-lucide="book-x" class="w-10 h-10 mx-auto mb-2 opacity-40"></i>
            <p class="font-semibold text-sm">No dictionary words match your criteria.</p>
          </div>
        `;
        lucide.createIcons();
        return;
      }

      grid.innerHTML = pageItems.map(item => `
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-amber-400 transition">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="font-bold text-base text-slate-900 dark:text-white font-sans tracking-tight">${item.headword}</span>
              ${item.pos ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">${item.pos}</span>` : ''}
            </div>
            ${item.clarifier ? `<span class="text-[10px] text-slate-400 italic">(${item.clarifier})</span>` : ''}
          </div>

          <div class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            ${item.definition || '<span class="italic text-slate-400">Definition unavailable</span>'}
          </div>

          ${item.example_runyankore ? `
            <div class="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] space-y-0.5">
              <div class="text-slate-600 dark:text-slate-400 italic font-sans">“${item.example_runyankore}”</div>
              ${item.example_english ? `<div class="text-slate-500 dark:text-slate-500">→ ${item.example_english}</div>` : ''}
            </div>
          ` : ''}
        </div>
      `).join('');

      lucide.createIcons();
    };

    renderDictCards();

    // Event listeners
    document.getElementById('dictSearchInput')?.addEventListener('input', (e) => {
      this.dictState.query = e.target.value;
      filterDictionary();
    });

    document.getElementById('dictPosSelect')?.addEventListener('change', (e) => {
      this.dictState.pos = e.target.value;
      filterDictionary();
    });

    document.querySelectorAll('.dict-letter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.dict-letter').forEach(b => {
          b.classList.remove('active', 'bg-amber-500', 'text-white');
          b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
        });
        e.currentTarget.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
        e.currentTarget.classList.add('active', 'bg-amber-500', 'text-white');
        this.dictState.letter = e.currentTarget.getAttribute('data-letter');
        filterDictionary();
      });
    });

    document.getElementById('dictPrevBtn')?.addEventListener('click', () => {
      if (this.dictState.page > 1) {
        this.dictState.page--;
        renderDictCards();
        document.getElementById('dictCardsGrid')?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    document.getElementById('dictNextBtn')?.addEventListener('click', () => {
      this.dictState.page++;
      renderDictCards();
      document.getElementById('dictCardsGrid')?.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('dictRandomBtn')?.addEventListener('click', () => {
      const randIndex = Math.floor(Math.random() * data.length);
      const word = data[randIndex];
      const searchInput = document.getElementById('dictSearchInput');
      if (searchInput) {
        searchInput.value = word.headword;
        this.dictState.query = word.headword;
        filterDictionary();
        this.showToast(`Showing word: "${word.headword}"`);
      }
    });
  }

  // ==========================================
  // UNIVERSAL DATA TABLE VIEWER
  // ==========================================
  initTable(data) {
    if (!data || data.length === 0) return;
    this.tableState.filteredData = [...data];
    this.tableState.page = 1;
    this.renderTableHeaders(data[0]);
    this.applyTableFilters();
  }

  renderTableHeaders(sampleRow) {
    const head = document.getElementById('tableHead');
    if (!head || !sampleRow) return;

    const keys = Object.keys(sampleRow);
    head.innerHTML = `
      <tr>
        <th class="py-3 px-4 border-b border-slate-200 dark:border-slate-800 w-12 text-slate-400">#</th>
        ${keys.map(k => `
          <th class="sortable py-3 px-4 border-b border-slate-200 dark:border-slate-800 font-semibold tracking-wide capitalize" onclick="app.sortTable('${k}')">
            <div class="flex items-center gap-1.5">
              <span>${k.replace(/_/g, ' ')}</span>
              <span id="sortIcon-${k}" class="text-[10px] text-slate-400">↕</span>
            </div>
          </th>
        `).join('')}
      </tr>
    `;
  }

  applyTableFilters() {
    const rawData = this.dataCache[this.activeDataset?.id] || [];
    const q = this.tableState.query;

    if (!q) {
      this.tableState.filteredData = [...rawData];
    } else {
      this.tableState.filteredData = rawData.filter(row => {
        return Object.values(row).some(val => {
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(q);
        });
      });
    }

    if (this.tableState.sortKey) {
      const k = this.tableState.sortKey;
      const asc = this.tableState.sortAsc;
      this.tableState.filteredData.sort((a, b) => {
        let valA = a[k];
        let valB = b[k];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return asc ? -1 : 1;
        if (valA > valB) return asc ? 1 : -1;
        return 0;
      });
    }

    this.renderTablePage();
  }

  sortTable(columnKey) {
    if (this.tableState.sortKey === columnKey) {
      this.tableState.sortAsc = !this.tableState.sortAsc;
    } else {
      this.tableState.sortKey = columnKey;
      this.tableState.sortAsc = true;
    }

    // Reset sort icons
    document.querySelectorAll('[id^="sortIcon-"]').forEach(el => el.textContent = '↕');
    const activeIcon = document.getElementById(`sortIcon-${columnKey}`);
    if (activeIcon) {
      activeIcon.textContent = this.tableState.sortAsc ? '▲' : '▼';
    }

    this.applyTableFilters();
  }

  renderTablePage() {
    const tbody = document.getElementById('tableBody');
    const info = document.getElementById('tableInfo');
    const pageNumDisplay = document.getElementById('pageNumberDisplay');
    const btnPrev = document.getElementById('btnPrevPage');
    const btnNext = document.getElementById('btnNextPage');
    if (!tbody) return;

    const items = this.tableState.filteredData;
    const total = items.length;
    const page = this.tableState.page;
    const size = this.tableState.pageSize;
    const totalPages = Math.ceil(total / size) || 1;

    const start = (page - 1) * size;
    const end = Math.min(start + size, total);
    const slice = items.slice(start, end);

    if (info) {
      info.textContent = `Showing ${total > 0 ? (start + 1).toLocaleString() : 0} to ${end.toLocaleString()} of ${total.toLocaleString()} entries`;
    }
    if (pageNumDisplay) {
      pageNumDisplay.textContent = `Page ${page} of ${totalPages}`;
    }
    if (btnPrev) btnPrev.disabled = page <= 1;
    if (btnNext) btnNext.disabled = page >= totalPages;

    if (slice.length === 0) {
      tbody.innerHTML = `<tr><td colspan="100%" class="py-8 text-center text-slate-400">No matching records found.</td></tr>`;
      return;
    }

    tbody.innerHTML = slice.map((row, idx) => {
      const keys = Object.keys(row);
      return `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
          <td class="py-2.5 px-4 text-slate-400 font-mono">${(start + idx + 1).toLocaleString()}</td>
          ${keys.map(k => {
            let val = row[k];
            if (val === null || val === undefined) val = '<span class="text-slate-300 dark:text-slate-600">—</span>';
            else if (typeof val === 'number') val = val.toLocaleString();
            return `<td class="py-2.5 px-4 text-slate-800 dark:text-slate-200">${val}</td>`;
          }).join('')}
        </tr>
      `;
    }).join('');
  }

  prevPage() {
    if (this.tableState.page > 1) {
      this.tableState.page--;
      this.renderTablePage();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.tableState.filteredData.length / this.tableState.pageSize);
    if (this.tableState.page < totalPages) {
      this.tableState.page++;
      this.renderTablePage();
    }
  }

  copyTableData() {
    const data = this.tableState.filteredData;
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const tsv = [
      headers.join('\t'),
      ...data.map(row => headers.map(h => (row[h] !== null && row[h] !== undefined) ? `"${String(row[h]).replace(/"/g, '""')}"` : '').join('\t'))
    ].join('\n');

    navigator.clipboard.writeText(tsv).then(() => {
      this.showToast(`Copied ${data.length} rows to clipboard!`);
    }).catch(() => {
      this.showToast('Unable to copy to clipboard.');
    });
  }

  // --- Toast Notification ---
  showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMessage');
    if (!toast || !msg) return;

    msg.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
  }
}

// Global App Instance
window.app = new OpenDataApp();
