# Runyankore-Rukiga Dictionary

This dataset contains words, parts of speech, and definitions for the Runyankore and Rukiga languages.

## Source
Extracted from a series of PDF dictionary pages (`runy2.pdf` through `runy107.pdf`).

## License
Creative Commons Attribution 4.0 International ([CC-BY 4.0](../../../LICENSE)).

## Format
The data is provided in `JSONL` (JSON Lines) format, where each line is a valid JSON object.

## Schema
Each record contains the following structure:
- `headword` (string): The dictionary word.
- `pos` (string/null): Part of speech (e.g., "n" for noun, "v" for verb).
- `sense_index` (integer): The definition sense index.
- `definition` (string): The primary definition in English.
- `definition_clarifier` (string/null): Further clarification of the definition.
- `domain` (string/null): The subject domain (e.g., "zoology", "botany").
- `cultural_note` (string/null): Cultural context if applicable.
- `plural` / `singular` (string/null): Plural/singular forms of the word.
- `variant` (string/null): Alternative spellings or variants.
- `example_runyankore` (string/null): An example sentence in Runyankore.
- `example_english` (string/null): The English translation of the example sentence.
- `usage_dialect` / `usage_register` (string/null): Dialect or register information.
- `etymology` (string/null): Word origin.
- `cross_ref` (string/null): Cross references to other words.
- `has_example` (boolean): Whether an example sentence exists.
- `word_length` (integer): Length of the headword.
- `word_class_prefix` (string/null): The noun class prefix.
- `letter_section` (string): The alphabetical section the word belongs to.
- `source_file` (string): The original PDF file the entry was extracted from.

## Processing
The original raw JSONL files were combined into `data.jsonl`, dropping any lines that were not valid dictionary entries (e.g., page numbers or headers). Out of 10,676 original lines, 10,671 valid entries were kept.
