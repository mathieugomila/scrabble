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
const colors = { ".": 'white', "3": "red", "2": "pink", "b": "cyan", "c": "blue" };


const grid = document.getElementById('grid');

fetch('letters_score.json')
    .then(response => response.json())
    .then(data => {
        const scrabble_letter_score = data;
    });

for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
        const square = document.createElement('div');
        const color = colors[pattern[j + 15 * i]];
        square.className = `square ${color}`;
        square.setAttribute('tabindex', '0');
        square.addEventListener('click', function () {
            square.setAttribute('contenteditable', 'true');
            square.focus();
        });
        square.addEventListener('input', function (e) {
            square.textContent = square.textContent.toUpperCase();
            if (hand_letters.includes(square.textContent)) {

                if (square.textContent.length > 1) {
                    square.textContent = square.textContent.slice(-1);
                }

                const range = document.createRange();
                const sel = window.getSelection();
                if (square.childNodes.length > 0) {
                    range.setStart(square.childNodes[0], 1);
                }
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }

            if (square.textContent.trim() == '' || square.textContent.length > 1) {
                square.classList.remove('modified');
                square.classList.remove('letter');
                square.textContent = "";
            } else {
                square.classList.add('modified');
                square.classList.add('letter');
            }

            updateHand(e);

        });
        square.addEventListener('focus', function () {
            if (!square.classList.contains('non-editable')) {
                square.setAttribute('contenteditable', 'true');
            }
        });

        square.addEventListener('blur', function () {
            square.removeAttribute('contenteditable');
        });


        if (i == 2 && j == 2) {
            square.textContent = "C";
            square.classList.add('non-editable');
            square.classList.add('letter');
            square.contentEditable = false;
        }


        grid.appendChild(square);
    }
}

let squares = document.querySelectorAll('.square');
document.addEventListener('keydown', function (e) {
    let focused = document.activeElement;
    let index = Array.from(squares).indexOf(focused);

    if (index !== -1) {
        let nextIndex;
        switch (e.key) {
            case 'ArrowUp': nextIndex = index - 15; break;
            case 'ArrowDown': nextIndex = index + 15; break;
            case 'ArrowLeft': nextIndex = index - 1; break;
            case 'ArrowRight': nextIndex = index + 1; break;
        }

        if (nextIndex >= 0 && nextIndex < squares.length) {
            squares[nextIndex].focus();
        }
    }
});

function checkAlignment() {
    const modifiedSquares = document.querySelectorAll('.square.modified');
    let rows = new Set();
    let cols = new Set();

    for (let i = 0; i < modifiedSquares.length; i++) {
        const index = Array.from(squares).indexOf(modifiedSquares[i]);
        const row = Math.floor(index / 15);
        const col = index % 15;

        rows.add(row);
        cols.add(col);
    }

    if (rows.size === 1 && cols.size >= 1) {
        return { "is_aligned": true, type: "row" };
    }
    if (cols.size === 1 && rows.size >= 1) {
        return { "is_aligned": true, type: "col" };
    }
    return { "is_aligned": false, type: "" };
}

function checkNoEmptyBetween() {
    const modifiedSquares = document.querySelectorAll('.square.modified');
    let minRow = 15, maxRow = -1, minCol = 15, maxCol = -1;

    for (let i = 0; i < modifiedSquares.length; i++) {
        const index = Array.from(squares).indexOf(modifiedSquares[i]);
        const row = Math.floor(index / 15);
        const col = index % 15;

        minRow = Math.min(minRow, row);
        maxRow = Math.max(maxRow, row);
        minCol = Math.min(minCol, col);
        maxCol = Math.max(maxCol, col);
    }

    if (maxRow - minRow > 0 && maxCol - minCol > 0) {
        return false; // Diagonal, invalide
    }

    for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
            const index = row * 15 + col;
            const square = squares[index];
            if (!square.classList.contains('modified') && square.textContent === '') {
                return false; // Case vide trouvée
            }
        }
    }

    return true;
}





document.addEventListener('keydown', function (e) {
    if (e.code === 'Enter') {
        getModifiedSquares();  // Votre fonction
    }
});



