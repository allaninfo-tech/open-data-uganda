#!/usr/bin/env python3
"""
Build script for the Open Data Uganda web portal.
Syncs and packages datasets into site/data/ for Cloudflare Pages deployment.
"""

import json
import csv
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATASETS_DIR = BASE_DIR / "datasets"
SITE_DIR = BASE_DIR / "site"
SITE_DATA_DIR = SITE_DIR / "data"

def ensure_dir(path: Path):
    path.mkdir(parents=True, exist_ok=True)

def build_catalog_and_data():
    ensure_dir(SITE_DATA_DIR)
    
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
            "icon": "shopping-bag"
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

    # Process each dataset
    dataset_mappings = [
        ("demographics/uganda-district-population", "uganda-district-population"),
        ("economics/uganda-macroeconomic-indicators", "uganda-macroeconomic-indicators"),
        ("geospatial/uganda-districts", "uganda-districts"),
        ("geospatial/uganda-markets", "uganda-markets"),
        ("health/uganda-key-health-indicators", "uganda-key-health-indicators"),
        ("education/uganda-education-indicators", "uganda-education-indicators"),
    ]

    for rel_path, target_name in dataset_mappings:
        src_dir = DATASETS_DIR / rel_path
        src_csv = src_dir / "data.csv"
        src_jsonl = src_dir / "data.jsonl"
        
        # Copy CSV for direct download
        dest_csv = SITE_DATA_DIR / f"{target_name}.csv"
        shutil.copy2(src_csv, dest_csv)
        
        # Convert to compact JSON array for instant browser loading
        records = []
        with open(src_jsonl, "r", encoding="utf-8") as f:
            for line in f:
                s = line.strip()
                if s:
                    records.append(json.loads(s))
        
        dest_json = SITE_DATA_DIR / f"{target_name}.json"
        with open(dest_json, "w", encoding="utf-8") as f:
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
                # Keep essential search fields for high performance
                dict_records.append({
                    "headword": item.get("headword", ""),
                    "pos": item.get("pos"),
                    "definition": item.get("definition") or item.get("definition_clarifier") or "",
                    "clarifier": item.get("definition_clarifier"),
                    "example_runyankore": item.get("example_runyankore"),
                    "example_english": item.get("example_english"),
                    "section": item.get("letter_section")
                })

    dict_dest_json = SITE_DATA_DIR / "runyankore-rukiga-dictionary.json"
    with open(dict_dest_json, "w", encoding="utf-8") as f:
        json.dump(dict_records, f, ensure_ascii=False)
    print(f"Bundled dictionary: {len(dict_records)} words")

    # Also export dictionary as CSV for direct download
    dict_dest_csv = SITE_DATA_DIR / "runyankore-rukiga-dictionary.csv"
    with open(dict_dest_csv, "w", newline="", encoding="utf-8") as f:
        fields = ["headword", "pos", "definition", "clarifier", "example_runyankore", "example_english", "section"]
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(dict_records)

    # Save catalog.json
    catalog_dest = SITE_DATA_DIR / "catalog.json"
    with open(catalog_dest, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    print(f"Catalog saved to {catalog_dest}")

if __name__ == "__main__":
    print("Building web portal data assets...")
    build_catalog_and_data()
    print("Web assets ready!")
