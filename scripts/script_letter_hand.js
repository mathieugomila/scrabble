const grid2 = document.getElementById('grid2');

let scrabble_letter_count = {};
let scrabble_letter_score = {};
let hand_letters_base = [];
let hand_letters = [];
let letter_modified = []
let words_list = [];

let score = 0;

let error_messages = []

let previous_letter_click = null


async function loadLetterCount() {
    const response = await fetch('data/letters_count.json');
    const data = await response.json();
    return data;
}

async function readLetterScore() {
    const response = await fetch('data/letters_score.json');
    const data = await response.json();
    return data;
}

async function loadLetterScore() {
    scrabble_letter_score = await readLetterScore();
}



async function readWordsList() {
    const response = await fetch('data/ods8.txt');
    const data = await response.text();
    const words = data.split('\n');
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].replace('\r', '')
    }
    return words;
}

async function loadWordsList() {
    words_list = await readWordsList();
    console.log(words_list)
}

async function main() {
    scrabble_letter_count = await loadLetterCount();
}


main();
loadLetterScore();
loadWordsList();

async function getSevenLetters() {
    for (let i = 0; i < 7; i++) {
        const square = document.createElement('div');
        square.className = `square hand`;
        square.setAttribute('tabindex', '0');


        grid2.appendChild(square);

        hand_letters.push(daily_hand[i]);
        hand_letters_base.push(daily_hand[i]);

        square.textContent = daily_hand[i];
        square.classList.add('non-editable');
        square.classList.add('letter');
        square.id = i;
    }

    await loadLetterCount();
    update_letter_score();
    add_click_detection();
}

var flush_button = document.getElementById('flush_button');

flush_button.addEventListener('click', function () {
    let modified_squares = document.querySelectorAll('.square.modified');
    for (let i = 0; i < modified_squares.length; i++) {
        const square = modified_squares[i];
        remove_square(square)
    }
    updateHand()
    checkGridAndCalculateScore()
    update_letter_score()
});

function add_click_detection() {

    let letters = document.getElementsByClassName('square');


    if (typeof window.ontouchstart !== 'undefined') {
        for (var i = 0; i < letters.length; i++) {
            letters[i].addEventListener('touchstart', click_behaviour);
        }
    } else {
        for (var i = 0; i < letters.length; i++) {
            letters[i].addEventListener('mousedown', click_behaviour);
        }
    }
}

function click_behaviour(event) {
    if (previous_letter_click === null) {
        // If letter from put by user
        if (!event.target.classList.contains("hand") && event.target.classList.contains("modified")) {
            console.log(`remove letter ${event.target}`)
            remove_square(event.target)
        }
        // If first click on hand
        if (event.target.classList.contains("hand")) {
            console.log(`Click on letter in hand with index ${event.target.id}`)
            previous_letter_click = event.target.id
        }
    }
    else {
        if (!event.target.classList.contains("hand") && !event.target.classList.contains("letter")) {
            console.log(`add letter ${previous_letter_click}`)
            square_add_modified_letter(event.target, hand_letters_base[previous_letter_click])
            previous_letter_click = null
        }
        else if (event.target.classList.contains("hand")) {
            console.log(`switch letter position in hand ${previous_letter_click} --> ${event.target.id}`)
            // switch letters
            switch_letter(previous_letter_click, event.target.id)
            previous_letter_click = null
        }
    }
    updateHand()
    checkGridAndCalculateScore()
    update_letter_score()
}

function remove_square(square) {
    if (!square.classList.contains('modified')) {
        return
    }
    square.classList.remove('modified');
    square.classList.remove('letter');
    let all_squares = document.querySelectorAll('.square');
    let index = Array.from(all_squares).indexOf(square);
    square.textContent = "";
    addCaseIndication(square, pattern[index]);
}


function pullOneLetter() {
    let pool = [];

    for (let letter in scrabble_letter_count) {
        for (let i = 0; i < scrabble_letter_count[letter]; i++) {
            pool.push(letter);
        }
    }

    if (pool.length === 0) return null;

    let randomIndex = Math.floor(Math.random() * pool.length);
    let drawnLetter = pool[randomIndex];


    // Diminuer le compte
    scrabble_letter_count[drawnLetter]--;

    return drawnLetter;
}

function updateHand() {
    // Search for leters in board and update hand
    let hand_squares = document.querySelectorAll('.square.hand');
    letter_modified = hand_letters_base.slice();
    error_messages = []
    let modified_squares = document.querySelectorAll('.square.modified');
    for (let i = 0; i < modified_squares.length; i++) {
        const square = modified_squares[i];
        let index = letter_modified.indexOf(square.firstChild.nodeValue);

        if (index !== -1) {

            letter_modified[index] = ".";
        }
    }
    for (let i = 0; i < 7; i++) {
        hand_squares[i].textContent = hand_letters[i]
        if (letter_modified[i] == ".") {
            hand_squares[i].classList.add('used');
        }
        else {
            hand_squares[i].classList.remove('used');
        }
    }
}

function switch_letter(index_from, index_to) {
    hand_letters_base_buffer = hand_letters_base[index_from]
    hand_letters_base[index_from] = hand_letters_base[index_to]
    hand_letters_base[index_to] = hand_letters_base_buffer

    hand_letters_buffer = hand_letters[index_from]
    hand_letters[index_from] = hand_letters[index_to]
    hand_letters[index_to] = hand_letters_buffer

    letter_modified_buffer = letter_modified[index_from]
    letter_modified[index_from] = letter_modified[index_to]
    letter_modified[index_to] = letter_modified_buffer

    checkGridAndCalculateScore();
    update_letter_score();
}



