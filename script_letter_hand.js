const grid2 = document.getElementById('grid2');

let scrabble_letter_count = {};
let scrabble_letter_score = {};
let hand_letters_base = [];
let hand_letters = [];
let letter_modified = []
let words_list = [];

let score = 0;

let error_messages = []


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
    letter_modified = hand_letters_base.slice();
    error_messages = []
    let modified_squares = document.querySelectorAll('.square.modified');
    for (let i = 0; i < modified_squares.length; i++) {
        const square = modified_squares[i];
        let index = letter_modified.indexOf(square.textContent);

        if (index !== -1) {

            letter_modified[index] = ".";
        }
    }
    for (let i = 0; i < 7; i++) {
        if (letter_modified[i] == ".") {
            squares[i].classList.add('used');
        }
        else {
            squares[i].classList.remove('used');
        }
    }

    let alignement = checkAlignment();
    let no_space = checkNoEmptyBetween();

    let current_score = 0;


    if (alignement["is_aligned"] && no_space) {
        if (alignement["type"] == "col") {
            current_score = retrieveWordCol(get_modified_index(), 0);

        }
        else {
            current_score = retrieveWordRow(get_modified_index(), 0);
        }
    }
    else {
        error_messages.push("Les lettres doivent etre toutes alignées sans espace");
    }

    console.log(`Score ${current_score}`);
    document.getElementById("validateButton").textContent = `VALIDER (SCORE = ${current_score})`;

    let modifiedMessages = error_messages.map(msg => "&nbsp;&nbsp;&nbsp;&nbsp;-" + msg);
    document.getElementById("errorText").innerHTML = "Information:<br>" + modifiedMessages.join("<br>");

    document.getElementById("validateButton").addEventListener("click", async function () {
        if (current_score > 0) {

            let text = `Bravo, votre score du jour : ${current_score}`;
            try {
                await navigator.clipboard.writeText(text);
                console.log('Texte copié');
            } catch (err) {
                console.log('Erreur, texte non copié', err);
            }
        }
    });
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

    let other_score = 0;
    let current_word_score = 0;
    let current_word_multiplier = 1;

    for (let index_word = index_start; index_word <= index_end; index_word++) {
        word += allSquares[index_word].textContent;

        if (changement == 0) {
            let counter_letter = count_letter(allSquares[index_word].textContent, index_word);
            current_word_score += counter_letter["score"];
            current_word_multiplier *= counter_letter["multiplier"];
            other_score += retrieveWordCol(index_word, 1);
        }
        else {
            let counter_letter = count_letter(allSquares[index_word].textContent, index_word);
            current_word_score += counter_letter["score"];
        }
    }

    if (word.length == 1) {
        current_word_score = 0;
    }
    else {

        if (words_list.includes(word)) {
            console.log(`${word} existe`);
        }
        else {
            console.log(`${word} n'existe pas`);
            error_messages.push(`${word} n'existe pas`);
            current_word_score = 0;
        }
    }

    let global_score = current_word_multiplier * current_word_score + other_score;


    return global_score;
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

    let other_score = 0;
    let current_word_score = 0;
    let current_word_multiplier = 1;

    for (let index_word = index_start; index_word <= index_end; index_word += 15) {
        word += allSquares[index_word].textContent;

        if (changement == 0) {
            let counter_letter = count_letter(allSquares[index_word].textContent, index_word);
            current_word_score += counter_letter["score"];
            current_word_multiplier *= counter_letter["multiplier"];
            other_score += retrieveWordRow(index_word, 1);
        }
        else {
            let counter_letter = count_letter(allSquares[index_word].textContent, index_word);
            current_word_score += counter_letter["score"];
        }
    }
    if (word.length == 1) {
        current_word_score = 0;
    }
    else {

        if (words_list.includes(word)) {
            console.log(`${word} existe`);
        }
        else {
            console.log(`${word} n'existe pas`);
            error_messages.push(`${word} n'existe pas`);
            current_word_score = 0;
        }
    }

    let global_score = current_word_multiplier * current_word_score + other_score;

    return global_score;
}

async function readDataScore() {
    const response = await fetch('letters_score.json');
    const data = await response.json();
    return data;
}

async function loadLetterScore() {
    scrabble_letter_score = await readDataScore();
}

function count_letter(letter, index) {
    let multiplier = 1;
    let global_multiplier = 1;
    if (pattern[index] == "2") {
        global_multiplier = 2;
    }
    if (pattern[index] == "3") {
        global_multiplier = 3;
    }
    if (pattern[index] == "b") {
        multiplier = 2;
    }
    if (pattern[index] == "c") {
        multiplier = 3;
    }


    const allSquares = document.querySelectorAll('.square');
    if (!allSquares[index].classList.contains('modified')) {
        multiplier = 1;
        global_multiplier = 1;
    }


    console.log(letter, global_multiplier, multiplier, scrabble_letter_score[letter]);

    // get value for current letter
    return { "multiplier": global_multiplier, "score": multiplier * scrabble_letter_score[letter] };
}

async function readWordsList() {
    const response = await fetch('ods6.txt');
    const data = await response.text();
    const words = data.split('\n');
    return words;
}

async function loadWordsList() {
    words_list = await readWordsList();
}

main();
loadLetterScore();
loadWordsList()