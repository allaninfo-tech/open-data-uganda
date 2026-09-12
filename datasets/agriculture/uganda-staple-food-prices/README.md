# Uganda Staple Food Commodity Prices

Standardized dataset for Uganda curated by the Open Data Uganda initiative.

## Overview
Market-level retail and wholesale food price records tracking essential Ugandan staple commodities (Maize, Beans, Rice, Cassava flour, Sugar) in UGX and USD across major trading hubs (Owino Kampala, Busia, Gulu, Mbarara, Arua, Jinja).

## Source
UN World Food Programme (WFP) / Humanitarian Data Exchange (HDX)

## License
Creative Commons Attribution 3.0 Intergovernmental (CC BY-IGO 3.0)

## Schema
| Field | Type | Description |
|---|---|---|
| `date` | String | Date |
| `region` | String | Region |
| `district` | String | District |
| `market_name` | String | Market name |
| `commodity` | String | Commodity |
| `unit` | String | Unit |
| `price_type` | String | Price type |
| `price_ugx` | Float | Price ugx |
| `price_usd` | Float | Price usd |
