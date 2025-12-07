from pathlib import Path
import json

FILE_TO_CONVERT: Path = Path("./data/ods8.txt")
OUTPUT_FILE: Path = Path("output_fr_3_to_7.json")
MIN_LETTER: int = 3
MAX_LETTER: int = 7

with open(FILE_TO_CONVERT) as file:
    lines = [line.rstrip() for line in file]

output_dict = {}

for line in lines:
    if not (MIN_LETTER <= len(line) <= MAX_LETTER):
        continue

    first_two_letters: str = line[:1]

    if first_two_letters not in output_dict:
        output_dict[first_two_letters] = []

    output_dict[first_two_letters].append(line)

OUTPUT_FILE.write_text(json.dumps(output_dict), encoding="utf-8")
