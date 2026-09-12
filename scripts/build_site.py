#!/usr/bin/env python3
"""
Build script for the Open Data Uganda web portal.
Syncs and packages datasets into site/data/ and web/public/data/ for Cloudflare Pages deployment.
"""

import json
import csv
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATASETS_DIR = BASE_DIR / "datasets"
SITE_DATA_DIR = BASE_DIR / "site" / "data"
WEB_DATA_DIR = BASE_DIR / "web" / "public" / "data"

def ensure_dir(path: Path):
    path.mkdir(parents=True, exist_ok=True)

def build_catalog_and_data():
    ensure_dir(SITE_DATA_DIR)
    ensure_dir(WEB_DATA_DIR)
    
    catalog = [
        {
            "id": "uganda-district-population",
            "title": "Uganda District Population Statistics",
            "domain": "Demographics",
            "source": "Uganda Bureau of Statistics (UBOS) / UNFPA",
            "license": "CC BY-IGO 3.0",
            "timeframe": "2022–2023",
            "description": "Subnational population estimates for all 135 districts in Uganda, disaggregated by gender and 16 five-year age cohorts (0–4 to 80+).",
            "csv_file": "data/uganda-district-population.csv",
            "json_file": "data/uganda-district-population.json",
            "type": "demographics",
            "icon": "users"
        },
        {
            "id": "uganda-macroeconomic-indicators",
            "title": "Uganda Macroeconomic Indicators",
            "domain": "Economics",
            "source": "World Bank Open Data",
            "license": "CC-BY 4.0",
            "timeframe": "1960–present",
            "description": "Historical annual time series tracking Gross Domestic Product (GDP), annual GDP growth %, per capita income, inflation (CPI %), and total population.",
            "csv_file": "data/uganda-macroeconomic-indicators.csv",
            "json_file": "data/uganda-macroeconomic-indicators.json",
            "type": "timeseries",
            "icon": "trending-up"
        },
        {
            "id": "uganda-districts",
            "title": "Uganda Administrative Districts (COD-AB)",
            "domain": "Geospatial",
            "source": "Uganda Bureau of Statistics (UBOS) / UN OCHA",
            "license": "CC BY-IGO 3.0",
            "timeframe": "2022–2025",
            "description": "Complete directory of Uganda's 135 administrative districts with official P-codes, parent regions (Central, Eastern, Northern, Western), and country standards.",
            "csv_file": "data/uganda-districts.csv",
            "json_file": "data/uganda-districts.json",
            "type": "geospatial",
            "icon": "map"
        },
        {
            "id": "uganda-markets",
            "title": "Uganda Food & Commodity Markets",
            "domain": "Geospatial",
            "source": "World Food Programme (WFP)",
            "license": "CC BY-IGO 3.0",
            "timeframe": "2026",
            "description": "Geocoded registry of 104 major food, livestock, and commodity markets across Uganda with GPS coordinates, district, and region.",
            "csv_file": "data/uganda-markets.csv",
            "json_file": "data/uganda-markets.json",
            "type": "map_points",
            "icon": "store"
        },
        {
            "id": "uganda-staple-food-prices",
            "title": "Uganda Staple Food Commodity Prices",
            "domain": "Agriculture",
            "source": "UN World Food Programme (WFP) / HDX",
            "license": "CC BY-IGO 3.0",
            "timeframe": "2015–2024",
            "description": "Market-level retail and wholesale food price records tracking staple commodities (Maize, Beans, Rice, Cassava flour, Sugar) in UGX and USD across key trading hubs (Owino Kampala, Busia, Gulu, Mbarara, Arua, Jinja).",
            "csv_file": "data/uganda-staple-food-prices.csv",
            "json_file": "data/uganda-staple-food-prices.json",
            "type": "table",
            "icon": "wheat"
        },
        {
            "id": "uganda-key-health-indicators",
            "title": "Uganda Key Health Indicators",
            "domain": "Health",
            "source": "WHO / World Bank",
            "license": "CC-BY 4.0",
            "timeframe": "1960–2024",
            "description": "Six-decade trajectory of life expectancy at birth (years) and infant mortality rates (per 1,000 live births) in Uganda.",
            "csv_file": "data/uganda-key-health-indicators.csv",
            "json_file": "data/uganda-key-health-indicators.json",
            "type": "timeseries",
            "icon": "heart-pulse"
        },
        {
            "id": "uganda-education-indicators",
            "title": "Uganda Education Indicators",
            "domain": "Education",
            "source": "UNESCO UIS / World Bank EdStats",
            "license": "CC-BY 4.0",
            "timeframe": "1971–2017",
            "description": "Historical Gross Enrollment Ratio (GER %) for primary education tracking access trends before and after Universal Primary Education (UPE).",
            "csv_file": "data/uganda-education-indicators.csv",
            "json_file": "data/uganda-education-indicators.json",
            "type": "timeseries",
            "icon": "graduation-cap"
        },
        {
            "id": "uganda-energy-and-electricity",
            "title": "Uganda Energy & Electricity Access Indicators",
            "domain": "Infrastructure",
            "source": "World Bank Open Data / SE4ALL",
            "license": "CC-BY 4.0",
            "timeframe": "1991–2024",
            "description": "Historical annual trajectory of electricity electrification rates across Uganda, disaggregated by national total, urban centers, and rural communities, alongside renewable energy shares.",
            "csv_file": "data/uganda-energy-and-electricity.csv",
            "json_file": "data/uganda-energy-and-electricity.json",
            "type": "timeseries",
            "icon": "zap"
        },
        {
            "id": "uganda-digital-and-telecom",
            "title": "Uganda Digital & Telecommunications Indicators",
            "domain": "Technology",
            "source": "World Bank Open Data / ITU",
            "license": "CC-BY 4.0",
            "timeframe": "1995–2024",
            "description": "30-year annual time series tracking mobile cellular phone subscriptions per 100 people, internet penetration (% of population), and fixed broadband subscriptions.",
            "csv_file": "data/uganda-digital-and-telecom.csv",
            "json_file": "data/uganda-digital-and-telecom.json",
            "type": "timeseries",
            "icon": "smartphone"
        },
        {
            "id": "uganda-national-parks",
            "title": "Uganda National Parks & Wildlife Reserves",
            "domain": "Tourism",
            "source": "Uganda Wildlife Authority (UWA) / Ministry of Tourism",
            "license": "CC-BY 4.0",
            "timeframe": "Comprehensive",
            "description": "Official geospatial registry of all 10 National Parks in Uganda, detailing established years, area size in sq km, UNESCO World Heritage and Biosphere status, geographic coordinates, and key iconic wildlife species.",
            "csv_file": "data/uganda-national-parks.csv",
            "json_file": "data/uganda-national-parks.json",
            "type": "map_points",
            "icon": "trees"
        },
        {
            "id": "uganda-forest-and-land-cover",
            "title": "Uganda Forest & Land Cover Indicators",
            "domain": "Environment",
            "source": "World Bank Open Data / FAO",
            "license": "CC-BY 4.0",
            "timeframe": "1990–2023",
            "description": "Historical time series tracking changes in forest canopy cover (% of land area) and agricultural land utilization in Uganda over three decades.",
            "csv_file": "data/uganda-forest-and-land-cover.csv",
            "json_file": "data/uganda-forest-and-land-cover.json",
            "type": "timeseries",
            "icon": "leaf"
        },
        {
            "id": "runyankore-rukiga-dictionary",
            "title": "Runyankore-Rukiga Dictionary",
            "domain": "Language",
            "source": "Lexical Reference Series",
            "license": "CC-BY 4.0",
            "timeframe": "Comprehensive",
            "description": "A comprehensive bilingual dictionary of 10,671 words in the Runyankore and Rukiga languages with parts of speech, English definitions, and usage examples.",
            "csv_file": "data/runyankore-rukiga-dictionary.csv",
            "json_file": "data/runyankore-rukiga-dictionary.json",
            "type": "dictionary",
            "icon": "book-open"
        }
    ]

    # Process all tabular and timeseries datasets
    dataset_mappings = [
        ("demographics/uganda-district-population", "uganda-district-population"),
        ("economics/uganda-macroeconomic-indicators", "uganda-macroeconomic-indicators"),
        ("geospatial/uganda-districts", "uganda-districts"),
        ("geospatial/uganda-markets", "uganda-markets"),
        ("agriculture/uganda-staple-food-prices", "uganda-staple-food-prices"),
        ("health/uganda-key-health-indicators", "uganda-key-health-indicators"),
        ("education/uganda-education-indicators", "uganda-education-indicators"),
        ("infrastructure/uganda-energy-and-electricity", "uganda-energy-and-electricity"),
        ("technology/uganda-digital-and-telecom", "uganda-digital-and-telecom"),
        ("tourism/uganda-national-parks", "uganda-national-parks"),
        ("environment/uganda-forest-and-land-cover", "uganda-forest-and-land-cover"),
    ]

    for rel_path, target_name in dataset_mappings:
        src_dir = DATASETS_DIR / rel_path
        src_csv = src_dir / "data.csv"
        src_jsonl = src_dir / "data.jsonl"
        
        # Copy CSV to both output destinations
        shutil.copy2(src_csv, SITE_DATA_DIR / f"{target_name}.csv")
        shutil.copy2(src_csv, WEB_DATA_DIR / f"{target_name}.csv")
        
        # Parse JSONL to compact JSON array
        records = []
        with open(src_jsonl, "r", encoding="utf-8") as f:
            for line in f:
                s = line.strip()
                if s:
                    records.append(json.loads(s))
        
        # Write JSON to both output destinations
        for out_dir in [SITE_DATA_DIR, WEB_DATA_DIR]:
            with open(out_dir / f"{target_name}.json", "w", encoding="utf-8") as f:
                json.dump(records, f, ensure_ascii=False)
            
        print(f"Bundled {target_name}: {len(records)} records")

    # Process Runyankore-Rukiga dictionary
    dict_src_jsonl = DATASETS_DIR / "language" / "runyankore-rukiga-dictionary" / "data.jsonl"
    dict_records = []
    with open(dict_src_jsonl, "r", encoding="utf-8") as f:
        for line in f:
            s = line.strip()
            if s:
                item = json.loads(s)
                dict_records.append({
                    "headword": item.get("headword", ""),
                    "pos": item.get("pos"),
                    "definition": item.get("definition") or item.get("definition_clarifier") or "",
                    "clarifier": item.get("definition_clarifier"),
                    "example_runyankore": item.get("example_runyankore"),
                    "example_english": item.get("example_english"),
                    "section": item.get("letter_section")
                })

    for out_dir in [SITE_DATA_DIR, WEB_DATA_DIR]:
        with open(out_dir / "runyankore-rukiga-dictionary.json", "w", encoding="utf-8") as f:
            json.dump(dict_records, f, ensure_ascii=False)
            
        with open(out_dir / "runyankore-rukiga-dictionary.csv", "w", newline="", encoding="utf-8") as f:
            fields = ["headword", "pos", "definition", "clarifier", "example_runyankore", "example_english", "section"]
            writer = csv.DictWriter(f, fieldnames=fields)
            writer.writeheader()
            writer.writerows(dict_records)
            
    print(f"Bundled dictionary: {len(dict_records)} words")

    # Save catalog.json to both directories
    for out_dir in [SITE_DATA_DIR, WEB_DATA_DIR]:
        catalog_dest = out_dir / "catalog.json"
        with open(catalog_dest, "w", encoding="utf-8") as f:
            json.dump(catalog, f, indent=2, ensure_ascii=False)
        print(f"Catalog saved to {catalog_dest}")

if __name__ == "__main__":
    print("Building web portal data assets for 12 datasets...")
    build_catalog_and_data()
    print("All web assets successfully generated!")
