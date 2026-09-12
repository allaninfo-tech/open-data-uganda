import os
import json
import csv
import urllib.request

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASETS_DIR = os.path.join(BASE_DIR, "datasets")

def ensure_dataset(domain, slug, title, source, license_str, schema_desc, records):
    target_dir = os.path.join(DATASETS_DIR, domain, slug)
    os.makedirs(target_dir, exist_ok=True)
    
    if not records:
        print(f"Skipping {slug}: no records")
        return
        
    fieldnames = list(records[0].keys())
    
    # Write CSV
    csv_path = os.path.join(target_dir, "data.csv")
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)
        
    # Write JSONL
    jsonl_path = os.path.join(target_dir, "data.jsonl")
    with open(jsonl_path, "w", encoding="utf-8") as f:
        for r in records:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
            
    # Write README.md
    readme_path = os.path.join(target_dir, "README.md")
    readme_content = f"""# {title}

Machine Learning and research benchmark dataset curated for Uganda.

## Overview
{schema_desc}

## Source
{source}

## License
{license_str}

## Schema
| Field | Type | Description |
|---|---|---|
"""
    for k in fieldnames:
        sample_val = records[0].get(k)
        val_type = "Integer" if isinstance(sample_val, int) else ("Float" if isinstance(sample_val, float) else "String")
        readme_content += f"| `{k}` | {val_type} | {k.replace('_', ' ').capitalize()} |\n"

    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(readme_content)
        
    print(f"✔ Successfully generated {domain}/{slug} ({len(records)} records)")

# 1. NLP / Machine Learning: Sunbird AI Multilingual Parallel Text
def build_multilingual_corpus():
    test_url = "https://raw.githubusercontent.com/SunbirdAI/salt-data-archive/main/v1.2/salt-test-v1.2.jsonl"
    dev_url = "https://raw.githubusercontent.com/SunbirdAI/salt-data-archive/main/v1.2/salt-dev-v1.2.jsonl"
    
    records = []
    
    def process_url(url, split_name):
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            lines = r.readlines()
            for idx, line in enumerate(lines):
                item = json.loads(line)
                txt = item.get("text", {})
                records.append({
                    "id": f"SALT-{split_name.upper()}-{idx+1:04d}",
                    "split": split_name,
                    "english": txt.get("eng", "").strip(),
                    "luganda": txt.get("lug", "").strip(),
                    "runyankore_rukiga": txt.get("nyn", "").strip(),
                    "acholi": txt.get("ach", "").strip(),
                    "ateso": txt.get("teo", "").strip(),
                    "lugbara": txt.get("lgg", "").strip(),
                })

    try:
        print("Fetching SALT test split...")
        process_url(test_url, "test")
        print("Fetching SALT dev split...")
        process_url(dev_url, "dev")
        
        ensure_dataset(
            domain="language",
            slug="uganda-multilingual-nlp-parallel-corpus",
            title="Uganda Multilingual Parallel NLP Benchmark (SALT)",
            source="Sunbird AI / Makerere University AI Lab (SALT Benchmark)",
            license_str="Creative Commons Attribution 4.0 International (CC-BY 4.0)",
            schema_desc="A multi-way parallel evaluation benchmark corpus designed specifically for Machine Learning, Natural Language Processing (NLP), and Neural Machine Translation (NMT) across five major indigenous Ugandan languages (Luganda, Runyankore-Rukiga, Acholi, Ateso, Lugbara) paired symmetrically with English.",
            records=records
        )
    except Exception as e:
        print("Error fetching NLP corpus:", e)

# 2. Environmental ML / Air Pollution: Fine Particulate Matter PM2.5 Emissions
def build_pm25_emissions():
    url = "https://data.humdata.org/dataset/b7ea8d51-a57f-4a0d-9513-54ab2ed321da/resource/36e255d1-743b-466a-98b4-cde9435776d8/download/uga_pm2_5_source.csv"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        print("Fetching Uganda PM2.5 emissions...")
        with urllib.request.urlopen(req, timeout=20) as r:
            content = r.read().decode("utf-8")
            reader = csv.DictReader(content.splitlines())
            records = []
            for row in reader:
                centroid = row.get("centroid", "")
                lon, lat = None, None
                if "longitude" in centroid and "latitude" in centroid:
                    try:
                        # simple dict parse
                        import ast
                        coords = ast.literal_eval(centroid)
                        lon = round(coords.get("longitude", 0.0), 4)
                        lat = round(coords.get("latitude", 0.0), 4)
                    except Exception:
                        pass
                        
                try:
                    emiss_qty = float(row.get("emissionsQuantity") or 0.0)
                    if emiss_qty > 0:
                        records.append({
                            "id": row.get("id"),
                            "location_name": row.get("name"),
                            "sector": row.get("sector"),
                            "subsector": row.get("subsector"),
                            "pollutant": row.get("gas"),
                            "emissions_quantity_tonnes": round(emiss_qty, 2),
                            "latitude": lat,
                            "longitude": lon,
                            "year": int(row.get("year") or 2024)
                        })
                except ValueError:
                    continue
                    
            # Sort by emissions descending
            records.sort(key=lambda x: x["emissions_quantity_tonnes"], reverse=True)
            
            ensure_dataset(
                domain="environment",
                slug="uganda-pm25-air-pollutant-emissions",
                title="Uganda Fine Particulate Matter (PM2.5) Air Emissions",
                source="Climate TRACE / UN OCHA Humanitarian Data Exchange (HDX)",
                license_str="Creative Commons Attribution 4.0 International (CC-BY 4.0)",
                schema_desc="Spatially geocoded emissions inventory of Fine Particulate Matter (PM2.5 air pollution) by county, municipality, and sector across Uganda, formatted for environmental science, spatial machine learning, and health exposure modeling.",
                records=records[:1000] # Top 1,000 emission sources
            )
    except Exception as e:
        print("Error fetching PM2.5 emissions:", e)

if __name__ == "__main__":
    print("Building ML-ready datasets...")
    build_multilingual_corpus()
    build_pm25_emissions()
    print("ML datasets generation complete!")
