import numpy as np
from enum import Enum
from dataclasses import dataclass, asdict

class Direction(Enum):
    LR=1    # left-right
    UD=2    # up-down

grid_magic_cells = np.array(
    list("3..b...3...b..3.2...c...c...2...2...b.b...2..b..2...b...2..b....2.....2.....c...c...c...c...b...b.b...b..3..b...2...b..3..b...b.b...b...c...c...c...c.....2.....2....b..2...b...2..b..2...b.b...2...2...c...c...2.3..b...3...b..3")
    ).reshape(15, 15)
# 2 = mot x2
# 3 = mot x3
# b = lettre x2
# c = lettre x3

@dataclass
class Solution:
    word: str
    position: tuple[int, int]
    direction: Direction
    score: int
    pulled_letters: tuple[str]

def backtracking_r(grid:np.ndarray, hand:list, positions, direction, wordlist:list, matches:set, dictionary:set):
    for direction in (Direction if direction is None else (direction,)):
        c_grid = grid.copy()
        c_hand = hand.copy()
        for letter in hand:
            for position in positions:
                c_grid[position] = letter
                c_hand.remove(letter)

                ## vérifier si le mot constitué orthogonalement (s'il fait plus qu'une lettre) est dans le dico, sinon continue ##
                ortho_word = letter
                if direction == Direction.LR:
                    # on doit checker ORTHOGONALEMENT
                    for i in range(position[0]-1, -1, -1):
                        if (l := c_grid[i, position[1]]) != ".":
                            ortho_word = l + ortho_word
                        else:
                            break
                    for i in range(position[0]+1, grid.shape[0], +1):
                        if (l := c_grid[i, position[1]]) != ".":
                            ortho_word = ortho_word + l
                        else:
                            break
                else: # direction UD
                    for j in range(position[1]-1, -1, -1):
                        if (l := c_grid[position[0], j]) != ".":
                            ortho_word = l + ortho_word
                        else:
                            break
                    for j in range(position[1]+1, grid.shape[1], +1):
                        if (l := c_grid[position[0], j]) != ".":
                            ortho_word = ortho_word + l
                        else:
                            break
                if len(ortho_word)>1 and ortho_word not in dictionary: 
                    c_grid[position] = "."
                    c_hand.append(letter)
                    continue
                ## ##

                ## si le mot actuel est valide, l'ajouter à matches ##
                # (c'est le même code que pour vérifier le mot orthogonal, mais en inversant les directions) et on tient compte des positions de début et fin du mot
                cur_word = letter
                start_pos = end_pos = position
                if direction == Direction.UD:
                    for i in range(position[0]-1, -1, -1):
                        if (l := c_grid[i, position[1]]) != ".":
                            cur_word = l + cur_word
                            start_pos = (i, start_pos[1])
                        else:
                            break
                    for i in range(position[0]+1, grid.shape[0], +1):
                        if (l := c_grid[i, position[1]]) != ".":
                            cur_word = cur_word + l
                            end_pos = (i, end_pos[1])
                        else:
                            break
                else: # direction LR
                    for j in range(position[1]-1, -1, -1):
                        if (l := c_grid[position[0], j]) != ".":
                            cur_word = l + cur_word
                            start_pos = (start_pos[0], j)
                        else:
                            break
                    for j in range(position[1]+1, grid.shape[1], +1):
                        if (l := c_grid[position[0], j]) != ".":
                            cur_word = cur_word + l
                            end_pos = (end_pos[0], j)
                        else:
                            break
                if cur_word in dictionary:
                    matches.add((cur_word, start_pos, direction))
                ## ##

                ## get new positions to try ##
                new_positions = []
                if direction == Direction.LR:
                    if 1 <= start_pos[1] and c_grid[p := (start_pos[0], start_pos[1]-1)] == ".": # peut on aller à gauche du mot actuel ?
                        new_positions.append(p)
                    if end_pos[1] <= grid.shape[1]-2 and c_grid[p := (end_pos[0], end_pos[1]+1)]: # à droite ?
                        new_positions.append(p)
                else: # UD
                    if 1 <= start_pos[0] and c_grid[p := (start_pos[0]-1, start_pos[1])] == ".": # en haut ?
                        new_positions.append(p)
                    if end_pos[0] <= grid.shape[0]-2 and c_grid[p := (end_pos[0]+1, end_pos[1])]: # en bas ?
                        new_positions.append(p)

                if len(new_positions) == 0:
                    c_grid[position] = "."
                    c_hand.append(letter)
                    continue
                ## ##

                ## get les mots possibles ##
                new_wordlist = []
                for word in wordlist:
                    if cur_word in word and word != cur_word:
                        new_wordlist.append(word)
                ## ##
                
                if len(new_wordlist) == 0: 
                    c_grid[position] = "."
                    c_hand.append(letter)
                    continue

                backtracking_r(c_grid, c_hand, new_positions, direction, new_wordlist, matches, dictionary)

                c_grid[position] = "."
                c_hand.append(letter)

def _letter_score(letter):
    if letter in "AEILNORSTU": return 1
    if letter in "DGM": return 2
    if letter in "BCP": return 3
    if letter in "FHV": return 4
    if letter in "JQ": return 8
    if letter in "KWXYZ": return 10

def compute_score_and_pulled_letters(grid, word, position, direction, hand_size=7, return_pulled_letters=False):
    word_multiplier = 1
    word_score = 0
    total_score = 0
    pulled_letters = []
    for k, letter in enumerate(word):
        magic = grid_magic_cells[position]

        letter_score = _letter_score(letter)
        if grid[position] == ".":
            word_multiplier *= 2 if magic=="2" else (3 if magic=="3" else 1)
            letter_score *= (2 if magic=="b" else (3 if magic=="c" else 1))
            pulled_letters.append(letter)
        word_score += letter_score

        if grid[position] == ".":
            ortho_multiplier = 2 if magic=="2" else (3 if magic=="3" else 1)
            ortho_score = _letter_score(letter) * (2 if magic=="b" else (3 if magic=="c" else 1))
            there_is_an_ortho_word = False  # do not count this score if it's actually just one letter!
            if direction == Direction.LR:
                # on doit checker ORTHOGONALEMENT
                for i in range(position[0]-1, -1, -1):
                    if (l := grid[i, position[1]]) != ".":
                        ortho_score += _letter_score(l)
                        there_is_an_ortho_word = True
                    else:
                        break
                for i in range(position[0]+1, grid.shape[0], +1):
                    if (l := grid[i, position[1]]) != ".":
                        ortho_score += _letter_score(l)
                        there_is_an_ortho_word = True
                    else:
                        break
            else: # direction UD
                for j in range(position[1]-1, -1, -1):
                    if (l := grid[position[0], j]) != ".":
                        ortho_score += _letter_score(l)
                        there_is_an_ortho_word = True
                    else:
                        break
                for j in range(position[1]+1, grid.shape[1], +1):
                    if (l := grid[position[0], j]) != ".":
                        ortho_score += _letter_score(l)
                        there_is_an_ortho_word = True
                    else:
                        break
            if there_is_an_ortho_word:
                ortho_score *= ortho_multiplier
                total_score += ortho_score
            
        position = (position[0]+1, position[1]) if direction==Direction.UD else (position[0], position[1]+1)
    
    total_score += word_multiplier * word_score
    if len(pulled_letters) == hand_size: total_score += 50
    return total_score, pulled_letters

def solve(grid:np.ndarray, hand:list[str], dictionary:set) -> list[Solution]:

    dot_indices = np.where(grid == ".")
    adjacent_dots = []
    _directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    for dot_row, dot_col in zip(*dot_indices):
        # Check adjacent cells
        for dr, dc in _directions:
            adj_row, adj_col = dot_row + dr, dot_col + dc
            # Check if adjacent cell is within bounds and contains a letter
            if (
                0 <= adj_row < grid.shape[0] and
                0 <= adj_col < grid.shape[1] and
                grid[adj_row, adj_col].isalpha()
            ):
                adjacent_dots.append((dot_row, dot_col))
                break
    
    matches = set()
    backtracking_r(grid, hand, adjacent_dots, None, dictionary, matches, dictionary)

    solutions = []
    for word, position, direction in matches:
        solutions.append(Solution(word, position, direction, *compute_score_and_pulled_letters(grid, word, position, direction)))
    solutions = sorted(solutions, key=lambda s: s.score, reverse=False)

    return solutions

if __name__ == "__main__":
    daily_grid_str = ".PARAT..C..L....I...RADE.DOSERCEUX.O..N..I....U...U..T.ORALE.....V..S...N...ALPHA....SITES...R....B.U.A.I..METS.GOLF.N.T...N....U.F...E...DEDANS.I............E.T................................................................"
    hand_letters = ["F", "V", "M", "L", "A", "E", "Q"]
    daily_grid = np.array(list(daily_grid_str)).reshape((15, 15))
    with open("ods6.txt", "r") as fp:
        lines = fp.readlines()
    dictionary = set(line[:-1] for line in lines)
    solutions = solve(daily_grid, hand_letters, dictionary)
    import pandas as pd
    print(pd.DataFrame([asdict(s) for s in solutions]).tail(30))
