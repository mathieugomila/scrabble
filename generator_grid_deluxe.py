from solver import solve, Direction
import numpy as np
from random import choice, randrange
from unidecode import unidecode

class BagIsEmpty(Exception):
    pass

class Bag():

    _alphabet = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    _counts = [9,2,2,3,15,2,2,2,8,1,1,5,3,6,6,2,1,6,6,6,6,2,1,1,1,1]

    def __init__(self):
        self.bag = {}
        for l, c in zip(self._alphabet, self._counts):
            self.bag[l] = c
    
    def __len__(self):
        return sum(self.bag.values())
    
    def pull(self, letter=None) -> str:
        """ if letter None, pulls a random letter from the bag """
        if len(self)==0: raise BagIsEmpty
        if letter is None: letter = np.random.choice(tuple(self.bag.keys()), p=np.array(tuple(self.bag.values()), dtype=float)/len(self))
        assert self.bag[letter] > 0, f"There is no letter '{letter}' in the bag!"
        self.bag[letter] -= 1
        return letter
    
class Dictionary(set):
    def __init__(self, file="ods6.txt"):
        with open(file, "r", encoding="utf-8") as fp:
            lines = fp.readlines()
        super().__init__(unidecode(line.strip()).upper() for line in lines if "-" not in line)
    
    def search(self, substring):
        matches = []
        for word in self:
            if substring in word:
                matches.append(word)
        return matches

class Game:
    def __init__(self, n_players=1, generator_dictionary_file="liste_francais.txt", scrabble_dictionary_file="ods6.txt"): 
        self.n_players = n_players
        self.bag = Bag()
        self.gen_dico = Dictionary(generator_dictionary_file)
        self.scrabble_dico = Dictionary(scrabble_dictionary_file)
        self.grid = np.full((15,15), ".")
        self.player_hands = [[self.bag.pull() for i in range(7)] for j in range(n_players)]
        self.round = 0

    def __str__(self) -> str:
        return str(self.grid)
    
    def _first_round(self, player=0):
        ## this is to pick a random first word to be put on the grid ##
        dico_l = list(self.gen_dico)
        hand = self.player_hands[player]
        while True:
            hand_2 = hand.copy()
            ridx = randrange(len(dico_l))
            ok = True
            for l in (word := dico_l[ridx]):
                if l not in hand_2:
                    ok = False
                    break
                else: hand_2.remove(l)
            if ok: 
                random_word = word
                for l in word:
                    hand.remove(l)
                break
        ## ##

        ## now select a random direction and offset and put the word on the grid ##
        random_dir = choice(tuple(Direction))
        rand_offset = randrange(len(random_word))
        for k, letter in enumerate(random_word):
            if random_dir == Direction.LR:
                self.grid[7, 7-rand_offset+k] = letter
            else:
                self.grid[7-rand_offset+k, 7] = letter
        ## ##

        ## refill hand ##
        while len(hand) != 7:
            hand.append(self.bag.pull())
        ## ##

    def step(self, player) -> None:
        """
        player: index of the player whose turn it is
        """
        if self.round == 0:
            self._first_round()
        else:
            hand = self.player_hands[player]
            matches = solve(self.grid, hand, self.gen_dico)
            rand_match = choice(matches)
            for k, letter in enumerate(rand_match.word):
                if rand_match.direction == Direction.LR:
                    self.grid[rand_match.position[0], rand_match.position[1]+k] = letter
                else:
                    self.grid[rand_match.position[0]+k, rand_match.position[1]] = letter
            for pulled_letter in rand_match.pulled_letters: hand.remove(pulled_letter)
            while len(hand) != 7:
                hand.append(self.bag.pull())
        self.round += 1

    def make_json(self, player=0, with_solutions=True) -> str:
        from numpyencoder import NumpyEncoder
        import json
        hand = self.player_hands[player]
        d = {
            "grid": "".join(self.grid.flatten()),
            "hand": hand
        }
        if with_solutions:
            solutions = solve(self.grid, hand, self.scrabble_dico)
            solutions_jsonifiable = [
                {
                    "word": s.word,
                    "position": s.position,
                    "direction": "right" if s.direction == Direction.LR else "down",
                    "score": s.score,
                    "pulled_letters": s.pulled_letters
                }
                for s in solutions
            ]
            d["solutions"] = solutions_jsonifiable
        return json.dumps(d, indent=4, cls=NumpyEncoder)

if __name__ == "__main__":
    game = Game(4)
    for i in range(10):
        game.step(i%4)
        print(game)
    print(game.make_json())