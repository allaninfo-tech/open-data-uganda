#!/usr/bin/env python3
"""
Utility script to query the World Bank Open Data API for Uganda (country code: UGA)
and export indicators into CSV or JSONL.

Usage:
    python scripts/fetch_worldbank_indicators.py --indicator NY.GDP.MKTP.CD --output gdp.csv
    python scripts/fetch_worldbank_indicators.py --indicator FP.CPI.TOTL.ZG --format jsonl
"""

import argparse
import csv
import json
import sys
import urllib.request
import urllib.error

WORLD_BANK_API_URL = "https://api.worldbank.org/v2/country/UGA/indicator/{indicator}?format=json&per_page=100"

def fetch_indicator(indicator_code: str):
    url = WORLD_BANK_API_URL.format(indicator=indicator_code)
    req = urllib.request.Request(url, headers={"User-Agent": "OpenDataUganda/1.0"})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if len(data) < 2 or not data[1]:
                print(f"Error: No data found for indicator {indicator_code}", file=sys.stderr)
                sys.exit(1)
            return data[1]
    except urllib.error.URLError as e:
        print(f"Network error fetching indicator {indicator_code}: {e}", file=sys.stderr)
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Fetch Uganda indicators from World Bank API")
    parser.add_argument("--indicator", required=True, help="World Bank indicator code (e.g. NY.GDP.MKTP.CD)")
    parser.add_argument("--format", choices=["csv", "jsonl", "json"], default="csv", help="Output format")
    parser.add_argument("--output", help="Output filename (prints to stdout if omitted)")
    
    args = parser.parse_args()
    raw_data = fetch_indicator(args.indicator)
    
    # Clean rows: keep year and value, sorted chronologically
    records = []
    for item in raw_data:
        val = item.get("value")
        if val is not None:
            records.append({
                "year": int(item["date"]),
                "indicator_code": args.indicator,
                "indicator_name": item["indicator"]["value"],
                "value": val
            })
    records.sort(key=lambda r: r["year"])
    
    if args.format == "csv":
        out = sys.stdout if not args.output else open(args.output, "w", newline="", encoding="utf-8")
        writer = csv.DictWriter(out, fieldnames=["year", "indicator_code", "indicator_name", "value"])
        writer.writeheader()
        writer.writerows(records)
        if args.output:
            out.close()
            print(f"Successfully wrote {len(records)} records to {args.output}")
    elif args.format == "jsonl":
        out = sys.stdout if not args.output else open(args.output, "w", encoding="utf-8")
        for r in records:
            out.write(json.dumps(r, ensure_ascii=False) + "\n")
        if args.output:
            out.close()
            print(f"Successfully wrote {len(records)} records to {args.output}")
    elif args.format == "json":
        out = sys.stdout if not args.output else open(args.output, "w", encoding="utf-8")
        json.dump(records, out, indent=2, ensure_ascii=False)
        out.write("\n")
        if args.output:
            out.close()
            print(f"Successfully wrote {len(records)} records to {args.output}")

if __name__ == "__main__":
    main()
