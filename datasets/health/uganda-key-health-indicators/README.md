# Uganda Key Health Indicators (1960–Present)

This dataset tracks long-term public health outcomes and demographic indicators in Uganda, focusing on life expectancy at birth and infant mortality rates over six decades.

## Source
Curated from the **World Bank Development Indicators Database** and the **World Health Organization (WHO Global Health Observatory)**:
- Indicator `SP.DYN.LE00.IN`: Life expectancy at birth, total (years)
- Indicator `SP.DYN.IMRT.IN`: Mortality rate, infant (per 1,000 live births)

Portal: [World Bank Data - Uganda Health Indicators](https://data.worldbank.org/country/uganda)

## License
Creative Commons Attribution 4.0 International ([CC-BY 4.0](https://datacatalog.worldbank.org/public-licenses#cc-by)).

## Timeframe
Covers annual observations from 1960 through 2024.

## Format
Provided in both `CSV` (`data.csv`) and `JSONL` (`data.jsonl`) formats with UTF-8 encoding.

## Schema
Each record contains:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `year` | integer | Calendar observation year | `2024` |
| `life_expectancy_years` | float / null | Average number of years a newborn infant would live if prevailing patterns of mortality at the time of its birth were to stay the same throughout its life | `68.487` |
| `infant_mortality_per_1000_live_births` | float / null | Number of infants dying before reaching one year of age, per 1,000 live births in a given year | `35.9` |

## Insights
The dataset captures Uganda's long-term health trajectory:
- Life expectancy rose from ~43.8 years in 1960 to ~68.5 years in 2024, showing resilience and significant recovery following earlier health shocks.
- Infant mortality dropped precipitously from ~132.8 deaths per 1,000 live births in 1960 down to 35.9 in 2024.
