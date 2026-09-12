# Open Data Uganda

Welcome to the **Open Data Uganda** repository! This project serves as a central, reliable, and easily accessible hub for Ugandan datasets.

## Structure

The repository is organized by domain to make finding data easy:
- `datasets/agriculture/`: Crop yields, land usage, farming statistics.
- `datasets/demographics/`: Census data, population projections, age and sex distributions.
- `datasets/economics/`: Inflation rates, GDP data, market prices, trade indicators.
- `datasets/education/`: School enrollment, literacy rates, pupil-teacher ratios.
- `datasets/geospatial/`: Administrative boundaries, districts, markets, points of interest.
- `datasets/health/`: Life expectancy, infant mortality, disease prevalence, health facilities.
- `datasets/language/`: Local language dictionaries and linguistic datasets.

## Available Datasets

| Domain | Dataset | Description | Format |
|--------|---------|-------------|--------|
| Demographics | [Uganda District Population](datasets/demographics/uganda-district-population/) | UBOS 135-district population projections disaggregated by gender and 5-year age cohorts. | CSV, JSONL |
| Economics | [Uganda Macroeconomic Indicators](datasets/economics/uganda-macroeconomic-indicators/) | Historical time series (1960–present) of GDP, annual growth, GDP per capita, inflation, and population. | CSV, JSONL |
| Education | [Uganda Education Indicators](datasets/education/uganda-education-indicators/) | UNESCO & World Bank historical gross primary school enrollment rates. | CSV, JSONL |
| Geospatial | [Uganda Administrative Districts](datasets/geospatial/uganda-districts/) | Official UBOS/UN OCHA 135 administrative districts with P-codes and parent regions. | CSV, JSONL |
| Geospatial | [Uganda Food & Commodity Markets](datasets/geospatial/uganda-markets/) | WFP registry of 104 major food and commodity markets with GPS coordinates. | CSV, JSONL |
| Health | [Uganda Key Health Indicators](datasets/health/uganda-key-health-indicators/) | WHO & World Bank annual life expectancy at birth and infant mortality rates (1960–present). | CSV, JSONL |
| Language | [Runyankore-Rukiga Dictionary](datasets/language/runyankore-rukiga-dictionary/) | Comprehensive Runyankore-Rukiga dictionary dataset extracted from lexical references. | JSONL |

## Scripts & Tools

Reproducible automation utilities are located in `scripts/`:
- `scripts/fetch_worldbank_indicators.py`: CLI tool to fetch and export any World Bank indicator for Uganda into CSV or JSONL.
- `scripts/generate_datasets.py`: Pipeline used to build, clean, and standardize datasets across the repository.

## How to Contribute

We welcome contributions from the community! If you have a dataset you'd like to add or an update to an existing one, please check out our [Contribution Guidelines](CONTRIBUTING.md).

## Licensing

Unless otherwise specified in a specific dataset's directory, the data in this repository is licensed under the [Creative Commons Attribution 4.0 International License (CC-BY 4.0)](LICENSE).
