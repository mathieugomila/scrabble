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

load_button();


function load_button() {
    document.getElementById("validateButton").addEventListener("click", async function () {
        if (current_score > 0) {

            console.log(current_score)
            let text = `#SCRABBLEBLE jour n°${day_counter()} \nScore: ${current_score}\n\nhttps://scrabble.pheargame.net`;
            try {
                await navigator.clipboard.writeText(text);
                console.log('Texte copié');
                document.getElementById("validateButton").textContent = `Score copié dans le presse-papier`;
            } catch (err) {
                console.log('Erreur, texte non copié', err);
            }
        }
    });
}

function square_input(square) {
    square.textContent = square.textContent.toUpperCase();
    if (letter_modified.includes(square.textContent)) {

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

        square.classList.add('modified');
        square.classList.add('letter');
    }
    else {
        square.classList.remove('modified');
        square.classList.remove('letter');
        square.textContent = "";
    }

    if (square.textContent.trim() == '' || square.textContent.length > 1) {
        square.classList.remove('modified');
        square.classList.remove('letter');
        square.textContent = "";
    }
}

function square_click(square) {
    if (square.classList.contains('modified')) {
        square.classList.remove('modified');
        square.classList.remove('letter');
        square.textContent = "";
    }
    square.focus();
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

function set_base_letters(square, i, j) {
    if (daily_grid[i * 15 + j] != ".") {
        square.textContent = daily_grid[i * 15 + j];
        square.classList.add('non-editable');
        square.classList.add('default');
        square.classList.add('letter');
        square.contentEditable = false;
        square.removeAttribute('contenteditable');
    }
}



document.addEventListener('keydown', function (e) {
    if (e.code === 'Enter') {
        getModifiedSquares();  // Votre fonction
    }
});

