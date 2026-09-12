# Contributing to Open Data Uganda

Thank you for your interest in contributing to **Open Data Uganda**! We aim to make public data about Uganda accessible, transparent, and machine-readable for developers, researchers, journalists, and policy makers worldwide.

---

## Code of Conduct

This project and everyone participating in it is governed by the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to `allan.info.comp@gmail.com`.

---

## Dataset Acceptance Criteria

To maintain repository quality and reliability, all submitted datasets must meet the following criteria:

1. **Relevance:** Pertains directly to Uganda (national, regional, district, or municipal level).
2. **Open & Permissive License:** Must be released under an open license (e.g., CC0, CC-BY, CC-BY-IGO, ODC-ODbL, or verified Public Domain).
3. **Machine-Readable Formats:** Strictly `.csv`, `.jsonl`, `.json`, or `.geojson`. Proprietary formats (such as `.xlsx`, `.docx`, or `.pdf`) will be rejected.
4. **Encoding:** Files must be encoded in **UTF-8** with standard line endings (`LF`).
5. **No Personally Identifiable Information (PII):** Must not contain private contact information, medical records, or confidential individual identities. See [SECURITY.md](SECURITY.md).
6. **Documentation:** Every dataset folder must include a complete `README.md` with **Source**, **License**, **Timeframe**, and **Schema** definitions.

---

## Step-by-Step Submission Guide

### 1. Fork and Clone
```bash
git clone https://github.com/<your-username>/open-data-uganda.git
cd open-data-uganda
git checkout -b add-<dataset-name>
```

### 2. Add the Dataset
Create a subfolder in the appropriate domain directory under `datasets/`:
```text
datasets/
  ├── <domain>/              # e.g., geospatial, health, economics
  │   └── <dataset-name>/    # e.g., uganda-hospitals
  │       ├── README.md      # Metadata documentation
  │       ├── data.csv       # Tabular data (optional if JSONL provided)
  │       └── data.jsonl     # JSON lines format (optional if CSV provided)
```

### 3. Add Dataset Documentation (`README.md`)
In your dataset's folder, include a `README.md` containing at minimum:
```markdown
# Dataset Name

Brief description of what this dataset contains and why it is useful.

## Source
Origin organization, agency, or portal URL.

## License
License name and link to terms.

## Timeframe
Collection date or period covered.

## Schema
Table or list of all fields and data types:
| Field | Type | Description |
|---|---|---|
| `name` | string | Description... |
```

### 4. Update Root Catalog
Add an entry for your new dataset in the root [`README.md`](README.md) under **Dataset Summary**.

### 5. Validate Locally
Before committing, run the test suite locally to ensure your files conform to all standards:
```bash
python scripts/validate_datasets.py
```
Fix any reported errors before submitting.

### 6. Submit a Pull Request
Push your branch to your fork and open a Pull Request against `main`. Fill in the [Pull Request Template](.github/pull_request_template.md).

---

## Reporting Issues or Requesting Data
- **To request a new dataset:** Open a [Dataset Request issue](../../issues/new?template=dataset_request.yml).
- **To report data errors:** Open a [Data Bug Report](../../issues/new?template=data_bug_report.yml).
- **To report data privacy or PII concerns:** Follow the private reporting steps in [SECURITY.md](SECURITY.md).
