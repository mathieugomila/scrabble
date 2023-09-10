import random
import json

from itertools import permutations

from unidecode import unidecode

import random

def load_words(file_path):
    with open(file_path, 'r') as f:
        words = [line.strip() for line in f]
    return [unidecode(words[i]).upper() for i in range(len(words))]
    
def load_letters(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)
    
def pull_letter(letters):
    available = [[letter] * freq for letter, freq in letters.items() if freq > 0]
    flatten_list = [item for sublist in available for item in sublist]
    if not flatten_list:
        return None
    picked = random.choice(flatten_list)
    letters[picked[0]] -= 1
    return picked[0]

def pull_letters(letters):
    pulled_letters = ""
    for _ in range(0, 7):
        pulled_letters += pull_letter(letters)
    return pulled_letters

def check_word_empty(word, grid, x, y, orientation):
    for i in range(len(word)):
        if orientation == "vertical":
            if grid[x + i][y] != " ":
                return False
        if orientation == "horizontal":
            if grid[x][y+i] != " ":
                return False
    return True

def place_word(word, grid, x, y, orientation):
    for i in range(len(word)):
        if orientation == "vertical":
            grid[x + i][y] = word[i]
        if orientation == "horizontal":
            grid[x][y+i] = word[i]

def generate_grid():
    grid = [[' ' for _ in range(15)] for _ in range(15)]
    return grid

def print_grid(grid):
    for row in grid:
        row_print = ""
        for col in row:
            if col == " ":
                row_print += "."
            else:
                row_print += col
        print(row_print)

def find_words(letters, valid_words):
    found_words = set()
    for i in range(2, len(letters) + 1):
        for perm in permutations(letters, i):
            word = ''.join(perm)
            if word in valid_words:
                found_words.add(word)
    return found_words


def place_word_around_letter(letters, grid, x, y, available_words):
    if grid[x][y] == " ":
        return False
    letters_with_letter = letters + grid[x][y]
    searched_all_possible_words = find_words(letters_with_letter, available_words)
    sorted_set = sorted(searched_all_possible_words, key=len, reverse=True)
    print(sorted_set)


    num = random.random()
    if num > 0.5:
        print("vertical")
        for possible_word in sorted_set:
            if grid[x][y] in possible_word:
                index_letter_already_here = possible_word.index(grid[x][y])
                word_is_ok = True

                if len(possible_word) < 4:
                    continue

                if x - index_letter_already_here < 0 or x - index_letter_already_here + len(possible_word) > 15:
                    continue

                if 0 <= x - index_letter_already_here + len(possible_word) < 15 and grid[x - index_letter_already_here + len(possible_word)][y] != " ":
                    continue

                if 0 <= x - index_letter_already_here -1 < 15 and grid[x - index_letter_already_here - 1][y] != " ":
                    continue

                for i in range(len(possible_word)):
                    if (grid[x-index_letter_already_here +i][y] != " " or grid[x-index_letter_already_here +i][y-1] != " " or grid[x-index_letter_already_here +i][y+1] != " ") and i != index_letter_already_here:
                        word_is_ok = False
                if word_is_ok:
                    place_word(possible_word, grid, x-index_letter_already_here, y, "vertical")
                    return True
    print("horizontal")
    for possible_word in sorted_set:
        if grid[x][y] in possible_word:
            index_letter_already_here = possible_word.index(grid[x][y])
            word_is_ok = True

            if len(possible_word) < 4:
                continue

            if y - index_letter_already_here < 0 or y - index_letter_already_here + len(possible_word) > 15:
                continue

            if 0 <= y - index_letter_already_here + len(possible_word) < 15 and grid[x][y - index_letter_already_here + len(possible_word)] != " ":
                continue

            if 0 <= y - index_letter_already_here - 1 < 15 and grid[x][y - index_letter_already_here - 1] != " ":
                continue


            for i in range(len(possible_word)):
                if (grid[x][y-index_letter_already_here +i] != " " or grid[x+1][y-index_letter_already_here +i] != " " or grid[x-1][y-index_letter_already_here +i] != " ") and i != index_letter_already_here:
                    word_is_ok = False
            if word_is_ok:
                place_word(possible_word, grid, x, y-index_letter_already_here, "horizontal")
                return True
    return False


def place_random_word(letters, grid, available_words):
    for i in range(0, 15):
        for j in range(0, 15):
            result = place_word_around_letter(letters, grid, i, j, available_words)
            if result == True:
                return


if __name__ == "__main__":
    available_words = load_words("liste_francais.txt")  # Mettez votre propre chemin de fichier ici
    all_letters = load_letters("letters_count.json")
    grid = generate_grid()

    pulled_letters = pull_letters(all_letters)
    print(pulled_letters)
    all_words = find_words(pulled_letters, available_words)

    print("all words", all_words)

    longest_word = max(all_words, key=len)
    place_word(longest_word, grid, 7, 7, "horizontal")
    print_grid(grid)

    for i in range(0, 30):
        pulled_letters = pull_letters(all_letters)
        print(pulled_letters)
        place_random_word(pulled_letters, grid, available_words)
        print_grid(grid)


    #grid = generate_grid(words)
    #print_grid(grid)
