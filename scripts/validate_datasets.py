#!/usr/bin/env python3
"""
Open Data Uganda - Automated Dataset Validation Suite.
Validates:
1. JSONL files: UTF-8 encoding, line-by-line JSON parseability, non-emptiness.
2. CSV files: UTF-8 encoding, CSV standard structure, non-emptiness, valid header.
3. Dataset Metadata: Presence of README.md with mandatory sections (Source, License, Schema).

Can be run locally with:
    python scripts/validate_datasets.py
And runs as the core validator in GitHub Actions CI.
"""

import sys
import os
import json
import csv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATASETS_DIR = BASE_DIR / "datasets"

GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

def print_header(title: str):
    print(f"\n{BOLD}{CYAN}=== {title} ==={RESET}")

def validate_jsonl(file_path: Path) -> tuple[bool, int, str]:
    """Validates that a file is non-empty and every line is valid JSON."""
    count = 0
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            for line_idx, line in enumerate(f, 1):
                s = line.strip()
                if not s:
                    continue
                try:
                    json.loads(s)
                    count += 1
                except json.JSONDecodeError as e:
                    return False, count, f"Line {line_idx}: Invalid JSON ({e.msg})"
        if count == 0:
            return False, 0, "File is empty"
        return True, count, "Valid"
    except Exception as e:
        return False, 0, f"Error reading file: {e}"

def validate_csv(file_path: Path) -> tuple[bool, int, str]:
    """Validates that a CSV is non-empty, parseable, and has a header."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            header = next(reader, None)
            if not header or not any(header):
                return False, 0, "Missing or empty header row"
            count = 0
            for row in reader:
                if row:
                    count += 1
            if count == 0:
                return False, 0, "Header present but zero data rows"
            return True, count, "Valid"
    except Exception as e:
        return False, 0, f"CSV parsing error: {e}"

def validate_metadata(readme_path: Path) -> tuple[bool, str]:
    """Checks for presence of essential sections in dataset README."""
    if not readme_path.is_file():
        return False, "Missing README.md"
    try:
        content = readme_path.read_text(encoding="utf-8").lower()
        required_sections = ["source", "license", "schema"]
        missing = [s for s in required_sections if s not in content]
        if missing:
            return False, f"Missing required sections: {', '.join(missing)}"
        return True, "Complete metadata"
    except Exception as e:
        return False, f"Error reading README.md: {e}"

def main():
    print(f"{BOLD}Open Data Uganda - Repository Dataset Validation{RESET}")
    print(f"Scanning directory: {DATASETS_DIR}\n")

    if not DATASETS_DIR.exists():
        print(f"{RED}Error: datasets/ directory does not exist!{RESET}", file=sys.stderr)
        sys.exit(1)

    errors = []
    dataset_dirs = sorted([d for d in DATASETS_DIR.glob("*/*") if d.is_dir()])
    
    if not dataset_dirs:
        print(f"{RED}Error: No dataset subdirectories found under datasets/*/*{RESET}", file=sys.stderr)
        sys.exit(1)

    results_table = []

    for d in dataset_dirs:
        domain = d.parent.name
        dataset_name = d.name
        readme_file = d / "README.md"
        
        # 1. Metadata check
        meta_ok, meta_msg = validate_metadata(readme_file)
        if not meta_ok:
            errors.append(f"{domain}/{dataset_name}: {meta_msg}")

        # 2. Files scan
        formats = []
        total_records = 0
        file_status = True

        # Check JSONL if present
        jsonl_files = list(d.glob("*.jsonl"))
        for jf in jsonl_files:
            ok, count, msg = validate_jsonl(jf)
            if ok:
                formats.append(f"JSONL ({count})")
                total_records = max(total_records, count)
            else:
                file_status = False
                errors.append(f"{domain}/{dataset_name}/{jf.name}: {msg}")

        # Check CSV if present
        csv_files = list(d.glob("*.csv"))
        for cf in csv_files:
            ok, count, msg = validate_csv(cf)
            if ok:
                formats.append(f"CSV ({count})")
                total_records = max(total_records, count)
            else:
                file_status = False
                errors.append(f"{domain}/{dataset_name}/{cf.name}: {msg}")

        if not jsonl_files and not csv_files:
            file_status = False
            errors.append(f"{domain}/{dataset_name}: No CSV or JSONL data files found")

        status_str = f"{GREEN}PASS{RESET}" if (meta_ok and file_status) else f"{RED}FAIL{RESET}"
        results_table.append({
            "domain": domain,
            "dataset": dataset_name,
            "records": total_records,
            "formats": ", ".join(formats) if formats else "None",
            "metadata": f"{GREEN}OK{RESET}" if meta_ok else f"{RED}INCOMPLETE{RESET}",
            "status": status_str
        })

    # Display Report Table
    print(f"{BOLD}{'Domain':<15} {'Dataset':<35} {'Records':<10} {'Formats':<22} {'Metadata':<12} {'Status'}{RESET}")
    print("-" * 105)
    for r in results_table:
        print(f"{r['domain']:<15} {r['dataset']:<35} {str(r['records']):<10} {r['formats']:<22} {r['metadata']:<21} {r['status']}")
    print("-" * 105)

    if errors:
        print_header("Validation Failures")
        for err in errors:
            print(f"  {RED}✖{RESET} {err}")
        print(f"\n{RED}{BOLD}Validation Failed with {len(errors)} error(s).{RESET}\n")
        sys.exit(1)
    else:
        print(f"\n{GREEN}{BOLD}✔ All {len(dataset_dirs)} datasets passed validation successfully!{RESET}\n")
        sys.exit(0)

if __name__ == "__main__":
    main()
