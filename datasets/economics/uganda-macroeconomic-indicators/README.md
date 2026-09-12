# Uganda Macroeconomic Indicators (1960–Present)

This dataset compiles key national macroeconomic and development time series indicators for Uganda, tracking economic expansion, inflation, demographic growth, and per-capita income since independence.

## Source
Curated from the **World Bank Open Data API** and Development Indicators Database:
- Indicator `NY.GDP.MKTP.CD`: GDP (current US$)
- Indicator `NY.GDP.MKTP.KD.ZG`: GDP growth (annual %)
- Indicator `FP.CPI.TOTL.ZG`: Inflation, consumer prices (annual %)
- Indicator `SP.POP.TOTL`: Total Population

Portal: [World Bank Open Data - Uganda](https://data.worldbank.org/country/uganda)

## License
Creative Commons Attribution 4.0 International ([CC-BY 4.0](https://datacatalog.worldbank.org/public-licenses#cc-by)).

## Timeframe
Covers annual observations from 1960 through recent reporting years (2024–2025).

## Format
Provided in both `CSV` (`data.csv`) and `JSONL` (`data.jsonl`) formats with UTF-8 encoding.

## Schema
Each record represents one observation year and contains:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `year` | integer | Calendar year | `2024` |
| `gdp_current_usd` | float / null | Gross Domestic Product in current US Dollars | `53911907079.05` |
| `gdp_growth_annual_pct` | float / null | Annual percentage growth rate of GDP at market prices | `6.0556` |
| `gdp_per_capita_usd` | float / null | GDP divided by midyear total population (current US$) | `1086.47` |
| `inflation_cpi_annual_pct` | float / null | Consumer price index annual percentage change | `3.1415` |
| `population_total` | integer / null | Midyear total population estimate | `49621138` |

## Notes
- Earlier historical years (e.g. 1960–1975) may have missing (`null`) values for certain series where official national accounts were not standardized.
- Financial figures are rounded to 2 decimal places and percentages to 4 decimal places.
