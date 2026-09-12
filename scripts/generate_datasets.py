#!/usr/bin/env python3
"""
Dataset generator script for Open Data Uganda.
Extracts, cleans, and standardizes datasets from verified open sources
(UBOS, UN OCHA, WFP, World Bank, WHO, UNESCO) into both CSV and JSONL formats.
"""

import os
import json
import csv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATASETS_DIR = BASE_DIR / "datasets"

STEPS_DIR = Path("/home/a-n/.gemini/antigravity/brain/5e49ee32-e351-479a-ab0c-290ab30adc11/.system_generated/steps")

def ensure_dir(path: Path):
    path.mkdir(parents=True, exist_ok=True)

def write_jsonl_and_csv(target_dir: Path, data: list[dict], fieldnames: list[str]):
    ensure_dir(target_dir)
    
    # Write CSV
    csv_file = target_dir / "data.csv"
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)
    print(f"Wrote {len(data)} rows to {csv_file}")

    # Write JSONL
    jsonl_file = target_dir / "data.jsonl"
    with open(jsonl_file, "w", encoding="utf-8") as f:
        for row in data:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
    print(f"Wrote {len(data)} rows to {jsonl_file}")

def build_districts_and_population():
    pop_step_file = STEPS_DIR / "43" / "content.md"
    with open(pop_step_file, encoding="utf-8") as f:
        lines = f.readlines()
    header_idx = [i for i, line in enumerate(lines) if "ADM2_EN" in line][0]
    reader = csv.DictReader(lines[header_idx:])
    raw_rows = list(reader)

    # 1. Geospatial Districts dataset
    districts = []
    seen = set()
    for row in raw_rows:
        pcode = row["ADM2_PCODE"].strip()
        if pcode not in seen:
            seen.add(pcode)
            districts.append({
                "district_name": row["ADM2_EN"].strip(),
                "district_pcode": pcode,
                "region_name": row["ADM1_EN"].strip(),
                "region_pcode": row["ADM1_PCODE"].strip(),
                "country_name": row["ADM0_EN"].strip(),
                "country_code": row["ADM0_PCODE"].strip(),
                "year_standard": int(row["\ufeffyear"].strip() if "\ufeffyear" in row else row["year"].strip())
            })
    districts.sort(key=lambda x: x["district_name"])
    
    districts_dir = DATASETS_DIR / "geospatial" / "uganda-districts"
    write_jsonl_and_csv(
        districts_dir,
        districts,
        ["district_name", "district_pcode", "region_name", "region_pcode", "country_name", "country_code", "year_standard"]
    )

    # 2. Demographics District Population dataset
    pop_records = []
    age_cohorts = [
        "00_04", "05_09", "10_14", "15_19", "20_24", "25_29",
        "30_34", "35_39", "40_44", "45_49", "50_54", "55_59",
        "60_64", "65_69", "70_74", "75_79", "80Plus"
    ]
    
    for row in raw_rows:
        yr = int(row["\ufeffyear"].strip() if "\ufeffyear" in row else row["year"].strip())
        rec = {
            "year": yr,
            "country": row["ADM0_EN"].strip(),
            "region": row["ADM1_EN"].strip(),
            "district": row["ADM2_EN"].strip(),
            "district_pcode": row["ADM2_PCODE"].strip(),
            "female_total": int(row["F_TL"]),
            "male_total": int(row["M_TL"]),
            "total_population": int(row["T_TL"])
        }
        for cohort in age_cohorts:
            rec[f"female_{cohort.lower()}"] = int(row[f"F_{cohort}"])
            rec[f"male_{cohort.lower()}"] = int(row[f"M_{cohort}"])
            rec[f"total_{cohort.lower()}"] = int(row[f"T_{cohort}"])
        pop_records.append(rec)
    
    pop_records.sort(key=lambda x: (x["region"], x["district"]))
    pop_fields = ["year", "country", "region", "district", "district_pcode", "female_total", "male_total", "total_population"]
    for cohort in age_cohorts:
        pop_fields.extend([f"female_{cohort.lower()}", f"male_{cohort.lower()}", f"total_{cohort.lower()}"])
    
    pop_dir = DATASETS_DIR / "demographics" / "uganda-district-population"
    write_jsonl_and_csv(pop_dir, pop_records, pop_fields)

def build_markets():
    markets_file = STEPS_DIR / "67" / "content.md"
    with open(markets_file, encoding="utf-8") as f:
        lines = f.readlines()
    header_idx = [i for i, line in enumerate(lines) if "market_id" in line][0]
    reader = csv.DictReader(lines[header_idx:])
    raw_rows = list(reader)
    
    markets = []
    for row in raw_rows:
        markets.append({
            "market_id": int(row["market_id"]),
            "market_name": row["market"].strip(),
            "district": row["admin2"].strip(),
            "region": row["admin1"].strip(),
            "latitude": float(row["latitude"]) if row["latitude"] else None,
            "longitude": float(row["longitude"]) if row["longitude"] else None,
            "country_iso3": row["countryiso3"].strip()
        })
    markets.sort(key=lambda x: x["market_name"])
    
    markets_dir = DATASETS_DIR / "geospatial" / "uganda-markets"
    write_jsonl_and_csv(
        markets_dir,
        markets,
        ["market_id", "market_name", "district", "region", "latitude", "longitude", "country_iso3"]
    )

def extract_worldbank_indicator(step_num: int):
    path = STEPS_DIR / str(step_num) / "content.md"
    with open(path, encoding="utf-8") as f:
        text = f.read()
    start = text.find('[')
    end = text.rfind(']') + 1
    data = json.loads(text[start:end])
    return {item["date"]: item["value"] for item in data[1]}

def build_economics():
    # 23: GDP current USD
    # 73: GDP growth %
    # 75: Inflation CPI %
    # 77: Total Population
    gdp_data = extract_worldbank_indicator(23)
    growth_data = extract_worldbank_indicator(73)
    infl_data = extract_worldbank_indicator(75)
    pop_data = extract_worldbank_indicator(77)

    all_years = sorted(list(gdp_data.keys()), key=lambda y: int(y))
    records = []
    for yr in all_years:
        gdp = gdp_data.get(yr)
        pop = pop_data.get(yr)
        growth = growth_data.get(yr)
        infl = infl_data.get(yr)
        
        per_capita = None
        if gdp is not None and pop is not None and pop > 0:
            per_capita = round(gdp / pop, 2)
        
        records.append({
            "year": int(yr),
            "gdp_current_usd": round(gdp, 2) if gdp is not None else None,
            "gdp_growth_annual_pct": round(growth, 4) if growth is not None else None,
            "gdp_per_capita_usd": per_capita,
            "inflation_cpi_annual_pct": round(infl, 4) if infl is not None else None,
            "population_total": int(pop) if pop is not None else None
        })
    
    econ_dir = DATASETS_DIR / "economics" / "uganda-macroeconomic-indicators"
    write_jsonl_and_csv(
        econ_dir,
        records,
        ["year", "gdp_current_usd", "gdp_growth_annual_pct", "gdp_per_capita_usd", "inflation_cpi_annual_pct", "population_total"]
    )

def build_health():
    # 79: Life Expectancy
    # 81: Infant Mortality
    life_data = extract_worldbank_indicator(79)
    infant_data = extract_worldbank_indicator(81)

    all_years = sorted(list(life_data.keys()), key=lambda y: int(y))
    records = []
    for yr in all_years:
        le = life_data.get(yr)
        im = infant_data.get(yr)
        if le is not None or im is not None:
            records.append({
                "year": int(yr),
                "life_expectancy_years": round(le, 3) if le is not None else None,
                "infant_mortality_per_1000_live_births": round(im, 2) if im is not None else None
            })
    
    health_dir = DATASETS_DIR / "health" / "uganda-key-health-indicators"
    write_jsonl_and_csv(
        health_dir,
        records,
        ["year", "life_expectancy_years", "infant_mortality_per_1000_live_births"]
    )

def build_education():
    # 83: Primary Enrollment Gross %
    prim_data = extract_worldbank_indicator(83)

    all_years = sorted(list(prim_data.keys()), key=lambda y: int(y))
    records = []
    for yr in all_years:
        pe = prim_data.get(yr)
        if pe is not None:
            records.append({
                "year": int(yr),
                "primary_enrollment_gross_pct": round(pe, 4)
            })
    
    edu_dir = DATASETS_DIR / "education" / "uganda-education-indicators"
    write_jsonl_and_csv(
        edu_dir,
        records,
        ["year", "primary_enrollment_gross_pct"]
    )

if __name__ == "__main__":
    print("Building datasets...")
    build_districts_and_population()
    build_markets()
    build_economics()
    build_health()
    build_education()
    print("All datasets successfully generated!")
