# Uganda Education Indicators

This dataset compiles historical indicators on primary school participation and access in Uganda, highlighting trends from the pre-Universal Primary Education (UPE) era through the nationwide rollout of UPE.

## Source
Curated from the **UNESCO Institute for Statistics (UIS)** and the **World Bank EdStats Database**:
- Indicator `SE.PRM.ENRR`: School enrollment, primary (% gross).

Portal: [World Bank EdStats - Uganda](https://data.worldbank.org/indicator/SE.PRM.ENRR?locations=UG)

## License
Creative Commons Attribution 4.0 International ([CC-BY 4.0](https://datacatalog.worldbank.org/public-licenses#cc-by)).

## Timeframe
Covers available reporting years between 1971 and 2017.

## Format
Provided in both `CSV` (`data.csv`) and `JSONL` (`data.jsonl`) formats with UTF-8 encoding.

## Schema
Each record contains:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `year` | integer | Calendar year of observation | `2017` |
| `primary_enrollment_gross_pct` | float | Total enrollment in primary education, regardless of age, expressed as a percentage of the population of official primary education age | `106.1696` |

## Historical Context
In 1997, Uganda introduced Universal Primary Education (UPE). The impact is visible in the data, where Gross Enrollment Ratio (GER) surged above 100% (reflecting enrollment of previously out-of-school over-age children).
