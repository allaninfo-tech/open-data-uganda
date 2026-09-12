# Open Data Uganda 🇺🇬

[![Validate Datasets](https://github.com/allaninfo-tech/open-data-uganda/actions/workflows/validate.yml/badge.svg)](https://github.com/allaninfo-tech/open-data-uganda/actions/workflows/validate.yml)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-blue.svg)](LICENSE)
[![Datasets](https://img.shields.io/badge/Datasets-14_available-green.svg)](#available-datasets)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Contributor Covenant](https://img.shields.io/badge/Contributor_Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

Welcome to **Open Data Uganda**! This project serves as a central, reliable, and standardized open-access hub for Ugandan datasets. Our mission is to democratize access to public data across demographics, geospatial boundaries, economics, public health, education, and indigenous languages.

All datasets are curated from verified government, multilateral, and research organizations (UBOS, UN OCHA, WFP, World Bank, WHO, UNESCO), cleaned, and distributed in machine-readable, open formats (`.csv` and `.jsonl`).

---

## Quickstart: Loading Data

### Python (Pandas)
Load any dataset directly from GitHub raw URL into a DataFrame:

```python
import pandas as pd

# Load Uganda District Population Data
url = "https://raw.githubusercontent.com/allaninfo-tech/open-data-uganda/main/datasets/demographics/uganda-district-population/data.csv"
df = pd.read_csv(url)

print(df[["district", "region", "total_population"]].head())
```

### Python (JSONL)
```python
import json
import urllib.request

url = "https://raw.githubusercontent.com/allaninfo-tech/open-data-uganda/main/datasets/economics/uganda-macroeconomic-indicators/data.jsonl"
req = urllib.request.urlopen(url)
records = [json.loads(line) for line in req]

print(f"Loaded {len(records)} observation years.")
```

### R
```R
# Load Uganda Administrative Districts
districts <- read.csv("https://raw.githubusercontent.com/allaninfo-tech/open-data-uganda/main/datasets/geospatial/uganda-districts/data.csv")
head(districts)
```

### cURL / Bash
```bash
# Fetch latest food markets and filter with jq
curl -s https://raw.githubusercontent.com/allaninfo-tech/open-data-uganda/main/datasets/geospatial/uganda-markets/data.jsonl | jq '.market_name, .district'
```

---

## Repository Structure

The repository is organized by domain to make finding data intuitive:

```text
open-data-uganda/
├── datasets/
│   ├── demographics/     # Census data, population projections, age/sex cohorts
│   ├── economics/        # Inflation, GDP, per capita income, market prices
│   ├── education/        # Enrollment rates, literacy, educational attainment
│   ├── geospatial/       # Administrative boundaries, districts, markets, points of interest
│   ├── health/           # Life expectancy, infant mortality, health indicators
│   └── language/         # Local language dictionaries, parallel corpora, lexicons
├── scripts/              # Automated build, validation, and API fetch utilities
├── .github/              # Issue forms, PR templates, and CI automation
├── CONTRIBUTING.md       # Contribution guidelines and submission checklist
├── CODE_OF_CONDUCT.md    # Contributor Covenant v2.1
├── SECURITY.md           # Security and data privacy policy
├── CITATION.cff          # Citation metadata for academic and research citation
└── LICENSE               # Creative Commons Attribution 4.0 International
```

---

## Dataset Summary

Quick overview of datasets by domain — updated automatically as the collection grows.

| Domain | Datasets | Total Records | ML-Ready |
|---|---|---|---|
| 🌾 Agriculture | 1 | 2,431 | ✅ Time-series regression |
| 👥 Demographics | 1 | 135 | ✅ Clustering / spatial analysis |
| 💰 Economics | 1 | 50 | ✅ Forecasting / regression |
| 📚 Education | 1 | 47 | ✅ Time-series trend modeling |
| 🌿 Environment | 2 | 1,034 | ✅ Land-cover classification, air quality ML |
| 🗺️ Geospatial | 2 | 239 | ✅ Spatial ML / location intelligence |
| 🏥 Health | 1 | 65 | ✅ Survival / regression analysis |
| ⚡ Infrastructure | 1 | 34 | ✅ Access gap modeling |
| 🗣️ Language | 2 | 11,671 | ✅ NLP / translation / NER |
| 💻 Technology | 1 | 30 | ✅ Penetration trend forecasting |
| 🦁 Tourism | 1 | 10 | ✅ Park classification / geo ML |
| **Total** | **14** | **15,806** | |

---

## Available Datasets

| Domain | Dataset | Records | Formats | Source | Description |
|---|---|---|---|---|---|
| **Agriculture** | [Uganda Staple Food Prices](datasets/agriculture/uganda-staple-food-prices/) | 2,431 records | `CSV`, `JSONL` | WFP / HDX | Market-level monthly prices for Maize, Beans, Rice, Sugar, and Cassava across major trading hubs. |
| **Demographics** | [Uganda District Population](datasets/demographics/uganda-district-population/) | 135 districts | `CSV`, `JSONL` | UBOS / UNFPA | District-level population disaggregated by gender and 16 five-year age cohorts. |
| **Economics** | [Uganda Macroeconomic Indicators](datasets/economics/uganda-macroeconomic-indicators/) | 50 years | `CSV`, `JSONL` | World Bank | Annual time series (1960–present) of GDP, annual growth, GDP per capita, and inflation. |
| **Education** | [Uganda Education Indicators](datasets/education/uganda-education-indicators/) | 47 years | `CSV`, `JSONL` | UNESCO / World Bank | Historical primary school gross enrollment rates (GER %) covering pre- and post-UPE era. |
| **Environment** | [Uganda Forest & Land Cover](datasets/environment/uganda-forest-and-land-cover/) | 34 years | `CSV`, `JSONL` | World Bank / FAO | 34-year trajectory of forest canopy coverage (% of land area) and agricultural land utilization. |
| **Environment** | [Uganda PM2.5 Air Pollutant Emissions](datasets/environment/uganda-pm25-air-pollutant-emissions/) | 1,000 records | `CSV`, `JSONL` | Climate TRACE / OCHA HDX | Sub-sector CO₂-equivalent emissions and PM2.5 air pollutant data — ready for air quality ML models. |
| **Geospatial** | [Uganda Administrative Districts](datasets/geospatial/uganda-districts/) | 135 districts | `CSV`, `JSONL` | UBOS / UN OCHA | Official administrative directory with P-codes, parent regions, and country codes. |
| **Geospatial** | [Uganda Food & Commodity Markets](datasets/geospatial/uganda-markets/) | 104 markets | `CSV`, `JSONL` | WFP | Directory of agricultural and commodity markets with GPS coordinates. |
| **Health** | [Uganda Key Health Indicators](datasets/health/uganda-key-health-indicators/) | 65 years | `CSV`, `JSONL` | WHO / World Bank | Historical life expectancy at birth and infant mortality rates (1960–2024). |
| **Infrastructure**| [Uganda Energy & Electricity](datasets/infrastructure/uganda-energy-and-electricity/) | 34 years | `CSV`, `JSONL` | World Bank / SE4ALL| Total, urban, and rural electrification rates alongside renewable energy generation shares. |
| **Language** | [Runyankore-Rukiga Dictionary](datasets/language/runyankore-rukiga-dictionary/) | 10,671 words | `JSONL` | Lexical Reference | Comprehensive Runyankore-Rukiga dictionary with definitions, parts of speech, and examples. |
| **Language** | [Uganda Multilingual NLP Parallel Corpus](datasets/language/uganda-multilingual-nlp-parallel-corpus/) | 1,000 pairs | `CSV`, `JSONL` | Sunbird AI / SALT v1.2 | Parallel sentence pairs across English, Luganda, Acholi, Ateso, and Lugbara — ideal for NLP/MT. |
| **Technology** | [Uganda Digital & Telecom](datasets/technology/uganda-digital-and-telecom/) | 30 years | `CSV`, `JSONL` | World Bank / ITU | Mobile cellular subscriptions per 100 people and internet user penetration rates. |
| **Tourism** | [Uganda National Parks](datasets/tourism/uganda-national-parks/) | 10 parks | `CSV`, `JSONL` | UWA / Tourism Min | Official registry of all 10 National Parks, UNESCO sites, area sizes, and iconic wildlife. |

---

## Developer & Automation Scripts

Reproducible automation scripts are located in [`scripts/`](scripts/):
- **[`scripts/validate_datasets.py`](scripts/validate_datasets.py):** Automated test suite that validates JSONL parseability, CSV integrity, UTF-8 encoding, and `README.md` metadata completeness across all datasets.
- **[`scripts/generate_datasets.py`](scripts/generate_datasets.py):** Standardized build pipeline used to compile raw source data into clean CSV and JSONL datasets.
- **[`scripts/fetch_worldbank_indicators.py`](scripts/fetch_worldbank_indicators.py):** CLI tool to query the World Bank API for any Ugandan indicator and export directly to CSV or JSONL.

### Running Validation Locally
```bash
python scripts/validate_datasets.py
```

---

## How to Contribute

We welcome contributions from everyone! Whether you want to add a new dataset, correct an error, or improve documentation:
1. Review the [Contribution Guidelines](CONTRIBUTING.md).
2. Check the [Code of Conduct](CODE_OF_CONDUCT.md).
3. If requesting a dataset, please use the [Dataset Request Template](https://github.com/allaninfo-tech/open-data-uganda/issues/new?template=dataset_request.yml).
4. Run `python scripts/validate_datasets.py` before submitting a Pull Request.

---

## Citing Open Data Uganda

If you use datasets or tools from this repository in your academic research, data journalism, or publications, please cite it using the metadata in [`CITATION.cff`](CITATION.cff):

```bibtex
@misc{opendatauganda2026,
  author = {Open Data Uganda Contributors},
  title = {Open Data Uganda: A Central Hub for Ugandan Public Datasets},
  year = {2026},
  publisher = {GitHub},
  journal = {GitHub repository},
  howpublished = {\url{https://github.com/allaninfo-tech/open-data-uganda}}
}
```

---

## Licensing

Unless otherwise specified in a specific dataset's directory, all datasets and content in this repository are licensed under the [Creative Commons Attribution 4.0 International License (CC-BY 4.0)](LICENSE).
