# Uganda District Population Statistics (Sex & Age Disaggregated)

This dataset provides demographic statistics for all 135 administrative districts in Uganda, disaggregated by sex (Female, Male, Total) and across 16 five-year age cohorts (from 0–4 years through 80+ years).

## Source
Published by the **Uganda Bureau of Statistics (UBOS)** with demographic projection support from the **United Nations Population Fund (UNFPA)** and P-coding standardization by **UN OCHA**.

- **Primary Source:** Uganda Bureau of Statistics (UBOS) / UNFPA
- **Portal:** [HDX - Uganda Subnational Population Statistics](https://data.humdata.org/dataset/cod-ps-uga)

## License
Creative Commons Attribution for Intergovernmental Organisations ([CC BY-IGO 3.0](http://creativecommons.org/licenses/by/3.0/igo/legalcode)).

## Timeframe
Baseline projection reference year: 2022–2023, reflecting the 135-district administrative structure.

## Format
Provided in both `CSV` (`data.csv`) and `JSONL` (`data.jsonl`) formats with UTF-8 encoding.

## Schema
Each record represents one district and includes the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `year` | integer | Reference year of the projection/census |
| `country` | string | Country name (`Uganda`) |
| `region` | string | Region name (`Central`, `Eastern`, `Northern`, `Western`) |
| `district` | string | District name (`Buikwe`, `Kampala`, `Wakiso`, etc.) |
| `district_pcode` | string | Unique OCHA district P-code (`UG1001`, `UG1008`, etc.) |
| `female_total` | integer | Total female population |
| `male_total` | integer | Total male population |
| `total_population` | integer | Total population of the district |
| `female_00_04` ... `female_80plus` | integer | Female population in 5-year age cohorts |
| `male_00_04` ... `male_80plus` | integer | Male population in 5-year age cohorts |
| `total_00_04` ... `total_80plus` | integer | Total population in 5-year age cohorts |

### Age Cohorts Included:
- `00_04` (0–4 years)
- `05_09` (5–9 years)
- `10_14` (10–14 years)
- `15_19` (15–19 years)
- `20_24` (20–24 years)
- `25_29` (25–29 years)
- `30_34` (30–34 years)
- `35_39` (35–39 years)
- `40_44` (40–44 years)
- `45_49` (45–49 years)
- `50_54` (50–54 years)
- `55_59` (55–59 years)
- `60_64` (60–64 years)
- `65_69` (65–69 years)
- `70_74` (70–74 years)
- `75_79` (75–79 years)
- `80plus` (80 years and above)

## Usage
Enables demographic profiling, public service planning (schools, health facilities, vaccines), dependency ratio calculations, and regional population distribution studies.
