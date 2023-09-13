const grid2 = document.getElementById('grid2');

let scrabble_letter_count = {};
let scrabble_letter_score = {};
let hand_letters_base = [];
let hand_letters = [];
let letter_modified = []
let words_list = [];

let score = 0;

let error_messages = []


async function loadLetterCount() {
    const response = await fetch('letters_count.json');
    const data = await response.json();
    return data;
}

async function readLetterScore() {
    const response = await fetch('letters_score.json');
    const data = await response.json();
    return data;
}

async function loadLetterScore() {
    scrabble_letter_score = await readLetterScore();
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
        square.setAttribute("draggable", "true");
        square.id = `draggableItem_${i}`;
    }

    await loadLetterCount();
    update_letter_score();
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
    let squares = document.querySelectorAll('.square.hand');
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
        if (letter_modified[i] == ".") {
            squares[i].classList.add('used');
        }
        else {
            squares[i].classList.remove('used');
        }
    }
}

document.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("DraggedItem", event.target.id);
});

document.addEventListener("dragover", function (event) {
    event.preventDefault();
});

document.addEventListener("drop", function (event) {
    let droppedElement = document.getElementById(event.dataTransfer.getData('DraggedItem'));
    drop_letter = droppedElement.firstChild.nodeValue;
    let targetElement = event.target;
    if (!targetElement.classList.contains("hand") && targetElement.classList.contains("square") && !targetElement.classList.contains("non-editable")) {
        square_add_modified_letter(targetElement, drop_letter);
        updateHand();
        checkGridAndCalculateScore();
        update_letter_score();
    }

    if (targetElement.classList.contains("hand")) {
        let all_squares = document.querySelectorAll('.hand');
        let index_destination_letter = Array.from(all_squares).indexOf(targetElement);
        let index_dragged_letter = Array.from(all_squares).indexOf(droppedElement);

        console.log(index_dragged_letter, index_destination_letter);

        let temp_base = hand_letters_base[index_destination_letter];
        let temp = hand_letters[index_destination_letter];

        hand_letters_base[index_destination_letter] = hand_letters_base[index_dragged_letter];
        hand_letters[index_destination_letter] = hand_letters[index_dragged_letter];

        hand_letters_base[index_dragged_letter] = temp_base;
        hand_letters[index_dragged_letter] = temp;

        console.log(document.querySelectorAll('.hand'));

        let element1 = all_squares[index_destination_letter];
        let element2 = all_squares[index_dragged_letter];

        let parent = element1.parentNode;
        let clone1 = element1.cloneNode(true);
        let clone2 = element2.cloneNode(true);

        element1.replaceWith(clone2);
        element2.replaceWith(clone1);

        updateHand();
        checkGridAndCalculateScore();
        update_letter_score();
    }

});
