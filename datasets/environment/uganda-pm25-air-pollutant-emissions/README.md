# Uganda Fine Particulate Matter (PM2.5) Air Emissions

Machine Learning and research benchmark dataset curated for Uganda.

## Overview
Spatially geocoded emissions inventory of Fine Particulate Matter (PM2.5 air pollution) by county, municipality, and sector across Uganda, formatted for environmental science, spatial machine learning, and health exposure modeling.

## Source
Climate TRACE / UN OCHA Humanitarian Data Exchange (HDX)

## License
Creative Commons Attribution 4.0 International (CC-BY 4.0)

## Schema
| Field | Type | Description |
|---|---|---|
| `id` | String | Id |
| `location_name` | String | Location name |
| `sector` | String | Sector |
| `subsector` | String | Subsector |
| `pollutant` | String | Pollutant |
| `emissions_quantity_tonnes` | Float | Emissions quantity tonnes |
| `latitude` | Float | Latitude |
| `longitude` | Float | Longitude |
| `year` | Integer | Year |
