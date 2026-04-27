# Contributing to Open Data Uganda

First off, thank you for considering contributing to Open Data Uganda! We aim to make data about Uganda accessible to everyone, and your contributions are what make this possible.

## How to Add a Dataset

1. **Fork this Repository**: Create your own copy of the repository.
2. **Create a Branch**: Make a new branch for your dataset (e.g., `add-kampala-hospitals-dataset`).
3. **Format the Data**:
   - Save your data in an open, machine-readable format such as `.csv`, `.json`, `.jsonl`, or `.geojson`.
   - Avoid proprietary formats like `.xlsx` or `.pdf`.
   - Ensure the data is encoded in **UTF-8**.
4. **Place it in the Correct Domain**: Find the appropriate directory under `datasets/` (e.g., `health/`, `education/`) and create a subfolder for your dataset.
5. **Add Metadata**: In your dataset's folder, include a `README.md` or `datapackage.json`. This MUST include:
   - **Source:** Where did the data come from? (e.g., Government Portal, self-scraped, etc.)
   - **License:** What is the specific license for this data?
   - **Timeframe:** When was the data collected?
   - **Schema:** A brief explanation of the columns or fields.
6. **Include Scripts (Optional but Recommended)**: If you used a script to scrape or clean the data, please include it in the `scripts/` folder or alongside your data.
7. **Submit a Pull Request (PR)**: Open a PR detailing what the dataset is and why it's useful.

## Quality & Privacy Checks

Before submitting, please ensure:
- The data **DOES NOT** contain Personally Identifiable Information (PII) unless it is already public record.
- The data is clean and properly formatted.
- You have the right to share the data (respect existing copyright/licenses).

Once your PR is open, our automated checks will run to validate the file formats. A maintainer will review your PR and merge it into the main repository.
