const grid2 = document.getElementById('grid2');

let scrabble_letter_count = {};
let hand_letters_base = []
let hand_letters = []


async function loadData() {
    const response = await fetch('letters_count.json');
    const data = await response.json();
    return data;
}

async function main() {
    scrabble_letter_count = await loadData();

    //console.log(`${scrabble_letter_count}`);

    for (let i = 0; i < 7; i++) {
        const square = document.createElement('div');
        square.className = `square hand`;
        square.setAttribute('tabindex', '0');


        grid2.appendChild(square);

        new_letter = pullLetter();
        hand_letters.push(new_letter);
        hand_letters_base.push(new_letter);

        square.textContent = new_letter;
        square.classList.add('non-editable');
        square.classList.add('letter');

    }

    //console.log(hand_letters);
}

function pullLetter() {
    let pool = [];

    for (let letter in scrabble_letter_count) {
        for (let i = 0; i < scrabble_letter_count[letter]; i++) {
            pool.push(letter);
        }
    }

    //console.log(`${scrabble_letter_count}`);
    if (pool.length === 0) return null;

    let randomIndex = Math.floor(Math.random() * pool.length);
    let drawnLetter = pool[randomIndex];


    // Diminuer le compte
    scrabble_letter_count[drawnLetter]--;

    return drawnLetter;
}

function updateHand(e) {
    let squares = document.querySelectorAll('.square.hand');
    let hand_temp = hand_letters_base.slice();

    let modified_squares = document.querySelectorAll('.square.modified');
    for (let i = 0; i < modified_squares.length; i++) {
        const square = modified_squares[i];
        let index = hand_temp.indexOf(square.textContent);

        if (index !== -1) {

            hand_temp[index] = ".";
        }
    }
    for (let i = 0; i < 7; i++) {
        if (hand_temp[i] == ".") {
            squares[i].classList.add('used');
        }
        else {
            squares[i].classList.remove('used');
        }
    }

    let alignement = checkAlignment();
    let no_space = checkNoEmptyBetween();

    console.log(alignement, no_space);


    if (alignement["is_aligned"] && no_space) {
        if (alignement["type"] == "col") {
            retrieveWordCol(get_modified_index(), 0);
        }
        else {
            retrieveWordRow(get_modified_index(), 0);
        }
    }
    //retrieveWordCol();
}

function get_modified_index() {
    const modifiedSquares = document.querySelectorAll('.square.modified');
    let index_minimum = Infinity;

    for (let i = 0; i < modifiedSquares.length; i++) {
        const index = Array.from(squares).indexOf(modifiedSquares[i]);
        if (index < index_minimum) {
            index_minimum = index;
        }
    }

    return index_minimum
}

function retrieveWordRow(pos_index, changement) {
    row = Math.floor(pos_index / 15);

    let index_start = pos_index;

    const allSquares = document.querySelectorAll('.square');
    while (index_start - 1 >= 15 * row) {
        if (allSquares[index_start - 1].classList.contains('letter')) {
            index_start -= 1;
        }
        else {
            break;
        }
    }

    let index_end = index_start;

    while (index_end + 1 < row * 15 + 15) {
        if (allSquares[index_end + 1].classList.contains('letter')) {
            index_end += 1;
        }
        else {
            break;
        }
    }

    let word = ""

    for (let index_word = index_start; index_word <= index_end; index_word++) {
        word += allSquares[index_word].textContent;

        if (changement == 0) {
            retrieveWordCol(index_word, 1);
        }
    }

    if (changement == 0 || (changement == 1 && length(word) > 1)) {

        console.log(word);
    }
}

function retrieveWordCol(pos_index, changement) {
    col = pos_index % 15;

    let index_start = pos_index;

    const allSquares = document.querySelectorAll('.square');
    while (index_start - 15 >= 0) {
        if (allSquares[index_start - 15].classList.contains('letter')) {
            index_start -= 15;
        }
        else {
            break;
        }
    }

    let index_end = index_start;

    while (index_end + 15 < 15 * 15) {
        if (allSquares[index_end + 15].classList.contains('letter')) {
            index_end += 15;
        }
        else {
            break;
        }
    }

    let word = ""

    for (let index_word = index_start; index_word <= index_end; index_word += 15) {
        word += allSquares[index_word].textContent;

        if (changement == 0) {
            retrieveWordRow(index_word, 1);
        }
    }

    if (changement == 0 || (changement == 1 && word.length > 1)) {
        console.log(word);
    }
}

main();