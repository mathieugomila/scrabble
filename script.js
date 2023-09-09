const pattern = 
`3..b...3...b..3
.2...c...c...2.
..2...b.b...2..
b..2...b...2..b
....2.....2....
.c...c...c...c.
..b...b.b...b..
3..b...2...b..3
..b...b.b...b..
.c...c...c...c.
....2.....2....
b..2...b...2..b
..2...b.b...2..
.2...c...c...2.
3..b...3...b..3`.trim().replace(/\n/g, '');;
const colors = {".": 'white', "3": "red", "2": "pink", "b": "cyan", "c": "blue"};


const grid = document.getElementById('grid');

fetch('monFichier.json')
  .then(response => response.json())
  .then(data => {
    const scrabble_letter_score = data;
  });

for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
        const square = document.createElement('div');
        const color = colors[pattern[j + 15 * i]];
        square.className = `square ${color}`;
        square.addEventListener('click', function() {
            square.setAttribute('contenteditable', 'true');
            square.focus();
        });
        grid.appendChild(square);
    }
}
