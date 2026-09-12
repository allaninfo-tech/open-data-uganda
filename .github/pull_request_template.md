## Description
<!-- Briefly describe the changes introduced by this pull request. If adding a new dataset, summarize what it covers and why it is useful. -->

## Dataset Checklist (if contributing a new or modified dataset)
Please ensure all items below are checked prior to requesting review:
- [ ] **Open Format:** Data is formatted as `.csv`, `.jsonl`, `.json`, or `.geojson` (no `.xlsx`, `.pdf`, etc.).
- [ ] **Encoding:** File is properly encoded in **UTF-8**.
- [ ] **No PII:** Confirmed that the data contains no Personally Identifiable Information (PII) or private data.
- [ ] **Directory Placement:** Located in the proper domain folder (e.g. `datasets/<domain>/<dataset-name>/`).
- [ ] **Documentation:** Includes a complete `README.md` with **Source**, **License**, **Timeframe**, and **Schema** table.
- [ ] **Repository Catalog:** Updated the root [`README.md`](README.md) Dataset Summary table.
- [ ] **Local Validation:** Ran `python scripts/validate_datasets.py` and all checks passed cleanly.
- [ ] **Cleaning Scripts:** (Optional but recommended) Included scraping or processing scripts in `scripts/`.

## Issue Reference
<!-- Link to any related issue (e.g., Closes #12, Fixes #3) -->
Closes #
