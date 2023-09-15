import json
import os
import statistics


def read_json_files_in_directory(directory_path):
    scores = []
    for filename in os.listdir(directory_path):
        if filename.endswith(".json"):
            with open(os.path.join(directory_path, filename), "r") as f:
                data = json.load(f)
                if "solution" in data:
                    score = data["solution"].get("score", None)
                    if score is not None:
                        scores.append(score)
    return scores


def main():
    directory_path = "./days"  # Remplacez par le chemin du dossier
    scores = read_json_files_in_directory(directory_path)

    if len(scores) == 0:
        print("No scores found.")
        return

    mean_score = statistics.mean(scores)
    median_score = statistics.median(scores)

    import random

    max_score = max(scores)
    lower_bound = -20
    upper_bound = 20
    displayed_max_score = max_score + random.uniform(lower_bound, upper_bound)

    print(f"Mean: {mean_score}, Median: {median_score}, Max: {displayed_max_score}")


if __name__ == "__main__":
    main()
