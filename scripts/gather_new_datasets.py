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

Standardized dataset for Uganda curated by the Open Data Uganda initiative.

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

# 1. Tourism: Uganda National Parks
def build_national_parks():
    parks = [
        {
            "park_id": "UGA-NP-001",
            "park_name": "Murchison Falls National Park",
            "region": "Northern",
            "districts": "Nwoya, Buliisa, Masindi, Kiryandongo",
            "established_year": 1952,
            "area_sq_km": 3893.0,
            "unesco_status": "No",
            "latitude": 2.2500,
            "longitude": 31.8000,
            "key_wildlife": "Rothschild Giraffes, Elephants, Nile Crocodiles, Shoebill Storks, Lions",
            "ecosystem": "Savanna, Borassus Palm forest, River Nile"
        },
        {
            "park_id": "UGA-NP-002",
            "park_name": "Queen Elizabeth National Park",
            "region": "Western",
            "districts": "Kasese, Kamwenge, Rubirizi, Rukungiri",
            "established_year": 1952,
            "area_sq_km": 1978.0,
            "unesco_status": "UNESCO Biosphere Reserve",
            "latitude": -0.2000,
            "longitude": 30.0000,
            "key_wildlife": "Tree-climbing Lions (Ishasha), Hippos, Elephants, Leopards, 600+ birds",
            "ecosystem": "Savanna, Wetlands, Kazinga Channel, Volcanic Crater Lakes"
        },
        {
            "park_id": "UGA-NP-003",
            "park_name": "Kidepo Valley National Park",
            "region": "Northern",
            "districts": "Kaabong, Karenga",
            "established_year": 1962,
            "area_sq_km": 1442.0,
            "unesco_status": "No",
            "latitude": 3.9000,
            "longitude": 33.8500,
            "key_wildlife": "Cheetahs, Lions, Ostriches, Bat-eared Foxes, Buffaloes, Zebras",
            "ecosystem": "Semi-arid savanna, Narus Valley, Kidepo sand rivers"
        },
        {
            "park_id": "UGA-NP-004",
            "park_name": "Mount Elgon National Park",
            "region": "Eastern",
            "districts": "Mbale, Kapchorwa, Sironko, Kween, Bukwo",
            "established_year": 1992,
            "area_sq_km": 1110.0,
            "unesco_status": "UNESCO Biosphere Reserve",
            "latitude": 1.1500,
            "longitude": 34.5500,
            "key_wildlife": "Mountain Elephants, Defassa Waterbucks, Black-and-white Colobus, 300+ birds",
            "ecosystem": "Montane forest, Moorland, Caldron volcano (Wagagai Peak 4321m)"
        },
        {
            "park_id": "UGA-NP-005",
            "park_name": "Rwenzori Mountains National Park",
            "region": "Western",
            "districts": "Kasese, Bundibugyo, Bunyangabu",
            "established_year": 1991,
            "area_sq_km": 996.0,
            "unesco_status": "UNESCO World Heritage Site",
            "latitude": 0.3800,
            "longitude": 29.9000,
            "key_wildlife": "Rwenzori Turaco, Giant Lobelias, Tree Hyraxes, Rwenzori Duikers",
            "ecosystem": "Glacial peaks (Margherita 5109m), Afro-alpine moorland, Bamboo"
        },
        {
            "park_id": "UGA-NP-006",
            "park_name": "Kibale National Park",
            "region": "Western",
            "districts": "Kabarole, Kyenjojo, Kamwenge",
            "established_year": 1993,
            "area_sq_km": 776.0,
            "unesco_status": "No",
            "latitude": 0.5000,
            "longitude": 30.4000,
            "key_wildlife": "1500+ Chimpanzees, 13 Primate species, Red Colobus, Forest Elephants",
            "ecosystem": "Medium altitude tropical moist evergreen and semi-deciduous forest"
        },
        {
            "park_id": "UGA-NP-007",
            "park_name": "Bwindi Impenetrable National Park",
            "region": "Western",
            "districts": "Kanungu, Kisoro, Rubanda",
            "established_year": 1991,
            "area_sq_km": 321.0,
            "unesco_status": "UNESCO World Heritage Site",
            "latitude": -1.0500,
            "longitude": 29.6500,
            "key_wildlife": "459 Mountain Gorillas (50% of global population), L'Hoest's Monkeys, 350+ birds",
            "ecosystem": "Afromontane rainforest, steep valleys, mist-covered canopies"
        },
        {
            "park_id": "UGA-NP-008",
            "park_name": "Lake Mburo National Park",
            "region": "Western",
            "districts": "Kiruhura, Mbarara, Isingiro",
            "established_year": 1983,
            "area_sq_km": 260.0,
            "unesco_status": "No",
            "latitude": -0.6000,
            "longitude": 30.9500,
            "key_wildlife": "Zebras, Impalas, Elands, Topis, Leopards, Hippos, 350+ birds",
            "ecosystem": "Acacia savanna, 5 inland lakes, Papyrus swamps"
        },
        {
            "park_id": "UGA-NP-009",
            "park_name": "Semuliki National Park",
            "region": "Western",
            "districts": "Bundibugyo",
            "established_year": 1993,
            "area_sq_km": 220.0,
            "unesco_status": "No",
            "latitude": 0.8000,
            "longitude": 30.0500,
            "key_wildlife": "Sempaya Hot Springs, Central African bird species, Pygmy Antelopes, De Brazza's Monkeys",
            "ecosystem": "Lowland tropical rainforest, Albertine Rift Valley floor"
        },
        {
            "park_id": "UGA-NP-010",
            "park_name": "Mgahinga Gorilla National Park",
            "region": "Western",
            "districts": "Kisoro",
            "established_year": 1991,
            "area_sq_km": 33.7,
            "unesco_status": "Part of Virunga Conservation Area",
            "latitude": -1.3667,
            "longitude": 29.6500,
            "key_wildlife": "Mountain Gorillas (Nyakagezi group), Golden Monkeys, 3 Virunga Volcanoes",
            "ecosystem": "Afro-alpine volcanic slopes, Bamboo forest, Ericaceous belt"
        }
    ]
    ensure_dataset(
        domain="tourism",
        slug="uganda-national-parks",
        title="Uganda National Parks & Wildlife Reserves",
        source="Uganda Wildlife Authority (UWA) / Ministry of Tourism, Wildlife and Antiquities",
        license_str="Creative Commons Attribution 4.0 International (CC-BY 4.0)",
        schema_desc="Complete geospatial registry of all 10 official National Parks of Uganda, covering established year, protected area size in square kilometers, UNESCO World Heritage and Biosphere status, geographic coordinates, and key iconic wildlife species.",
        records=parks
    )

# 2. Infrastructure: Uganda Energy and Electricity Access
def build_energy_electricity():
    def fetch_wb(ind):
        url = f"https://api.worldbank.org/v2/country/UGA/indicator/{ind}?format=json&per_page=60"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(req, timeout=10) as r:
                res = json.loads(r.read().decode("utf-8"))
                return {int(d["date"]): d["value"] for d in res[1] if d.get("value") is not None}
        except Exception as e:
            print(f"Error fetching {ind}: {e}")
            return {}
            
    access_tot = fetch_wb("EG.ELC.ACCS.ZS")
    access_rur = fetch_wb("EG.ELC.ACCS.RU.ZS")
    access_urb = fetch_wb("EG.ELC.ACCS.UR.ZS")
    renew_elec = fetch_wb("EG.ELC.RNWX.ZS")
    renew_cons = fetch_wb("EG.FEC.RNEW.ZS")
    
    years = sorted(list(set(access_tot.keys()) | set(access_urb.keys())))
    records = []
    for yr in years:
        records.append({
            "year": yr,
            "electricity_access_total_pct": round(access_tot.get(yr, 0.0), 2) if yr in access_tot else None,
            "electricity_access_urban_pct": round(access_urb.get(yr, 0.0), 2) if yr in access_urb else None,
            "electricity_access_rural_pct": round(access_rur.get(yr, 0.0), 2) if yr in access_rur else None,
            "renewable_electricity_output_pct": round(renew_elec.get(yr, 0.0), 2) if yr in renew_elec else None,
            "renewable_energy_consumption_pct": round(renew_cons.get(yr, 0.0), 2) if yr in renew_cons else None,
        })
        
    ensure_dataset(
        domain="infrastructure",
        slug="uganda-energy-and-electricity",
        title="Uganda Energy & Electricity Access Indicators",
        source="World Bank Open Data / SE4ALL Global Tracking Framework",
        license_str="Creative Commons Attribution 4.0 International (CC-BY 4.0)",
        schema_desc="Historical annual trajectory (1991–2024) of electricity electrification rates across Uganda, disaggregated by national total, urban centers, and rural communities, alongside renewable energy shares.",
        records=records
    )

# 3. Technology: Digital & Telecom
def build_digital_telecom():
    def fetch_wb(ind):
        url = f"https://api.worldbank.org/v2/country/UGA/indicator/{ind}?format=json&per_page=60"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(req, timeout=10) as r:
                res = json.loads(r.read().decode("utf-8"))
                return {int(d["date"]): d["value"] for d in res[1] if d.get("value") is not None}
        except Exception as e:
            print(f"Error fetching {ind}: {e}")
            return {}
            
    mob = fetch_wb("IT.CEL.SETS.P2")
    net = fetch_wb("IT.NET.USER.ZS")
    bbnd = fetch_wb("IT.NET.BBND.P2")
    
    years = [y for y in range(1995, 2025) if y in mob or y in net]
    years.sort()
    records = []
    for yr in years:
        records.append({
            "year": yr,
            "mobile_subscriptions_per_100": round(mob.get(yr, 0.0), 2) if yr in mob else None,
            "internet_users_pct": round(net.get(yr, 0.0), 2) if yr in net else None,
            "fixed_broadband_per_100": round(bbnd.get(yr, 0.0), 2) if yr in bbnd else None,
        })
        
    ensure_dataset(
        domain="technology",
        slug="uganda-digital-and-telecom",
        title="Uganda Digital & Telecommunications Indicators",
        source="World Bank Open Data / International Telecommunication Union (ITU)",
        license_str="Creative Commons Attribution 4.0 International (CC-BY 4.0)",
        schema_desc="30-year annual time series (1995–2024) tracking mobile cellular adoption, internet penetration (% of population), and fixed broadband subscriptions in Uganda.",
        records=records
    )

# 4. Environment: Forest and Land Cover
def build_environment():
    def fetch_wb(ind):
        url = f"https://api.worldbank.org/v2/country/UGA/indicator/{ind}?format=json&per_page=60"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(req, timeout=10) as r:
                res = json.loads(r.read().decode("utf-8"))
                return {int(d["date"]): d["value"] for d in res[1] if d.get("value") is not None}
        except Exception as e:
            print(f"Error fetching {ind}: {e}")
            return {}
            
    frst = fetch_wb("AG.LND.FRST.ZS")
    agri = fetch_wb("AG.LND.AGRI.ZS")
    
    years = [y for y in range(1990, 2024) if y in frst or y in agri]
    years.sort()
    records = []
    for yr in years:
        records.append({
            "year": yr,
            "forest_area_pct": round(frst.get(yr, 0.0), 2) if yr in frst else None,
            "agricultural_land_pct": round(agri.get(yr, 0.0), 2) if yr in agri else None,
        })
        
    ensure_dataset(
        domain="environment",
        slug="uganda-forest-and-land-cover",
        title="Uganda Forest & Land Cover Indicators",
        source="World Bank Open Data / Food and Agriculture Organization (FAO)",
        license_str="Creative Commons Attribution 4.0 International (CC-BY 4.0)",
        schema_desc="Historical time series (1990–2023) tracking changes in forest canopy cover (% of land area) and agricultural land utilization in Uganda.",
        records=records
    )

# 5. Agriculture: WFP Staple Food Prices (Benchmark Markets)
def build_food_prices():
    url = "https://data.humdata.org/dataset/883929b1-521e-4834-97f5-0ccc2df75b89/resource/e082d683-cad5-4dcd-bf54-db76ae254d33/download/wfp_food_prices_uga.csv"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            content = r.read().decode("utf-8")
            reader = csv.DictReader(content.splitlines())
            
            # Select key staples: Maize, Beans, Rice, Cassava flour, Sugar
            target_commodities = {"Maize", "Beans", "Rice", "Cassava flour", "Sugar"}
            key_markets = {"Owino", "Busia", "Gulu", "Mbarara", "Arua", "Fort Portal", "Jinja"}
            
            records = []
            for row in reader:
                comm = row.get("commodity")
                mkt = row.get("market")
                if comm in target_commodities and (mkt in key_markets or not key_markets):
                    try:
                        price = float(row.get("price") or 0)
                        usd = float(row.get("usdprice") or 0)
                        if price > 0:
                            records.append({
                                "date": row.get("date"),
                                "region": row.get("admin1"),
                                "district": row.get("admin2"),
                                "market_name": mkt,
                                "commodity": comm,
                                "unit": row.get("unit"),
                                "price_type": row.get("pricetype"),
                                "price_ugx": round(price, 2),
                                "price_usd": round(usd, 3)
                            })
                    except ValueError:
                        continue
                        
            # Sort by date descending
            records.sort(key=lambda x: x["date"], reverse=True)
            # Sample to keep responsive and fast (e.g. latest 2,500 records)
            selected = records[:2500]
            selected.sort(key=lambda x: (x["date"], x["market_name"], x["commodity"]))
            
            ensure_dataset(
                domain="agriculture",
                slug="uganda-staple-food-prices",
                title="Uganda Staple Food Commodity Prices",
                source="UN World Food Programme (WFP) / Humanitarian Data Exchange (HDX)",
                license_str="Creative Commons Attribution 3.0 Intergovernmental (CC BY-IGO 3.0)",
                schema_desc="Market-level retail and wholesale food price records tracking essential Ugandan staple commodities (Maize, Beans, Rice, Cassava flour, Sugar) in UGX and USD across major trading hubs (Owino Kampala, Busia, Gulu, Mbarara, Arua, Jinja).",
                records=selected
            )
    except Exception as e:
        print(f"Error fetching food prices: {e}")

if __name__ == "__main__":
    print("Building new datasets...")
    build_national_parks()
    build_energy_electricity()
    build_digital_telecom()
    build_environment()
    build_food_prices()
    print("All done!")
