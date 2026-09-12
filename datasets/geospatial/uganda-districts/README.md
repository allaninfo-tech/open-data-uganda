# Uganda Administrative Districts (COD-AB)

This dataset contains the official list of Uganda's 135 administrative districts (Admin Level 2), including standard P-codes, parent regions (Admin Level 1), and country-level identifiers.

## Source
Extracted from the Uganda Common Operational Datasets for Administrative Boundaries (COD-AB), maintained by the **Uganda Bureau of Statistics (UBOS)** with quality assurance and publication by the **United Nations Office for the Coordination of Humanitarian Affairs (UN OCHA)** and the **Humanitarian Data Exchange (HDX)**.

- **Primary Source:** Uganda Bureau of Statistics (UBOS)
- **Portal:** [HDX - Uganda Subnational Administrative Boundaries](https://data.humdata.org/dataset/cod-ab-uga)

## License
Creative Commons Attribution for Intergovernmental Organisations ([CC BY-IGO 3.0](http://creativecommons.org/licenses/by/3.0/igo/legalcode)).

## Timeframe
Reflects the 135-district administrative structure officially verified and validated as of 2022–2025.

## Format
Provided in both `CSV` (`data.csv`) and `JSONL` (`data.jsonl`) formats with UTF-8 encoding.

## Schema
Each record contains the following fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `district_name` | string | Official name of the district | `Kampala`, `Buikwe`, `Gulu` |
| `district_pcode` | string | Standard OCHA Administrative P-Code for the district | `UG1008`, `UG1001` |
| `region_name` | string | Name of the parent region (Admin 1) | `Central`, `Eastern`, `Northern`, `Western` |
| `region_pcode` | string | Standard OCHA P-Code for the region | `UG1`, `UG2`, `UG3`, `UG4` |
| `country_name` | string | Country name | `Uganda` |
| `country_code` | string | ISO country code | `UG` |
| `year_standard` | integer | Reference year for the administrative boundary standard | `2022` |

## Usage
Suitable for tabular joining with demographic, health, agricultural, and socio-economic datasets using the `district_pcode` or `district_name` keys.
