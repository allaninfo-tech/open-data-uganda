# Uganda Food & Commodity Markets Directory

This dataset contains 104 major food and commodity markets across Uganda, including their geographic coordinates (latitude and longitude), district, and regional locations.

## Source
Curated by the **United Nations World Food Programme (WFP)** as part of the Global Food Price Monitoring Database, in partnership with the **Uganda Bureau of Statistics (UBOS)** and FIT Uganda / Infotrade.

- **Primary Source:** [WFP - Uganda Food Prices & Markets](https://data.humdata.org/dataset/wfp-food-prices-for-uganda)

## License
Creative Commons Attribution for Intergovernmental Organisations ([CC BY-IGO 3.0](http://creativecommons.org/licenses/by/3.0/igo/legalcode)).

## Timeframe
Ongoing registry regularly updated through WFP and FAO market surveys (current as of 2026).

## Format
Provided in both `CSV` (`data.csv`) and `JSONL` (`data.jsonl`) formats with UTF-8 encoding.

## Schema
Each record contains the following fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `market_id` | integer | Unique identifier for the market assigned by WFP | `258` |
| `market_name` | string | Common/official name of the market | `Owino`, `Gulu`, `Mbarara` |
| `district` | string | District or municipality in which the market is situated | `Central Kampala`, `Gulu Municipality` |
| `region` | string | Administrative parent region or district name | `Kampala`, `Gulu` |
| `latitude` | float / null | Geographic latitude in decimal degrees (WGS84) | `0.32` |
| `longitude` | float / null | Geographic longitude in decimal degrees (WGS84) | `32.57` |
| `country_iso3` | string | ISO-3166-1 alpha-3 code | `UGA` |

## Usage
Can be mapped with GIS tools (QGIS, Mapbox, Leaflet) or linked to commodity pricing time series to analyze food security, price volatility, and supply chain logistics across Uganda.
