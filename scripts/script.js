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

let emoji_above_max = "😳😳🦊🦊🪳🪳😳😳"
let emoji_max = "🏆🏆🏆";
let emoji_90_pourcent = "🥵🥵🥵";
let emoji_75_pourcent = "🤒🤒🤒";
let emoji_noob = "🤣🤣👎👎🤣🤣"


const colors = { ".": 'white', "3": "red", "2": "pink", "b": "cyan", "c": "blue" };

const grid = document.getElementById('grid');

load_button();
square_movement_arrow();

function load_button() {
    document.getElementById("validateButton").addEventListener("click", async function () {
        if (current_score > 0) {



            let max_point = best_score_possible_dict["score"];
            emoji = ""
            if (current_score > max_point) {
                emoji = emoji_above_max;
            }
            else if (current_score == max_point) {
                emoji = emoji_max;
            }
            else if (current_score >= 0.9 * max_point) {
                emoji = emoji_90_pourcent;
            }
            else if (current_score >= 0.75 * max_point) {
                emoji = emoji_75_pourcent;
            }
            else if (current_score <= 0.1 * max_point) {
                emoji = emoji_noob;
            }

            let text = `#SCRABBLEBLE jour n°${day_counter}\n\nScore: ${current_score} ${emoji}\n\nhttps://scrabble.pheargame.net`;


            try {
                await navigator.clipboard.writeText(text);
                validate_button_pushed = true;
                console.log('Texte copié');
                document.getElementById("validateButton").firstChild.nodeValue = `Score copié dans le presse-papier`;
            } catch (err) {
                console.log('Erreur, texte non copié', err);
            }
        }
    });
}

function square_add_modified_letter(square, content) {
    square.classList.add('modified');
    square.classList.add('letter');

    // if (!square.querySelector('.score')) {
    //     let letterSpan = document.createElement("span");
    //     letterSpan.classList.add("score");
    //     square.appendChild(letterSpan);
    //     square.querySelector(".score").textContent = scrabble_letter_score[square.firstChild.nodeValue];
    // }

    if (!square.firstChild) {
        square.textContent = "coucou";
    }

    square.firstChild.nodeValue = content;

    if (square.firstChild.nodeValue.length > 1) {
        square.firstChild.nodeValue = square.firstChild.nodeValue.slice(-1);
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

function square_input(square, e) {
    if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
        square.classList.remove('modified');
        square.classList.remove('letter');
        square.textContent = "";
        return;
    }


    square.firstChild.nodeValue = square.firstChild.nodeValue.toUpperCase();
    if (letter_modified.includes(square.firstChild.nodeValue[square.firstChild.nodeValue.length - 1]) || (square.firstChild.nodeValue.length > 1 && square.firstChild.nodeValue[0] == square.firstChild.nodeValue[1])) {



        square_add_modified_letter(square, square.firstChild.nodeValue);


    }
    else {
        square.classList.remove('modified');
        square.classList.remove('letter');
        let all_squares = document.querySelectorAll('.square');
        let index = Array.from(all_squares).indexOf(square);
        square.textContent = "";
        addCaseIndication(square, pattern[index]);
    }

    if (square.classList.contains("letters") && (firstChild.nodeValue.trim() == '' || square.firstChild.nodeValue.length > 1)) {
        square.classList.remove('modified');
        square.classList.remove('letter');
        let all_squares = document.querySelectorAll('.square');
        let index = Array.from(all_squares).indexOf(square);
        square.textContent = "";
        addCaseIndication(square, pattern[index]);
    }


}

function square_click(square) {
    if (square.classList.contains('modified')) {
        square.classList.remove('modified');
        square.classList.remove('letter');
        let all_squares = document.querySelectorAll('.square');
        let index = Array.from(all_squares).indexOf(square);
        square.textContent = "";
        addCaseIndication(square, pattern[index]);
    }
    square.focus();
}

function square_movement_arrow() {
    document.addEventListener('keydown', function (e) {
        let squares = document.querySelectorAll('.square');

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
}

function update_letter_score() {
    let squares = document.querySelectorAll('.square');
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('letter')) {
            if (!squares[i].querySelector('score')) {
                let letterSpan = document.createElement("span");
                letterSpan.classList.add("score");
                squares[i].appendChild(letterSpan);
            }
            if (squares[i].querySelector('.score')) {
                squares[i].querySelector(".score").textContent = scrabble_letter_score[squares[i].firstChild.nodeValue];
            }

        }
    }
}



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
