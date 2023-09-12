let current_score = 0;

function checkGridAndCalculateScore() {
    let all_squares = document.querySelectorAll('.square');
    let alignement = checkAlignment(all_squares);
    let no_space = checkNoEmptyBetween(all_squares);
    let adjacent_to_basic = checkWorldNextToOther(all_squares);

    current_score = 0;

    if (alignement["is_aligned"] && no_space && adjacent_to_basic) {
        if (alignement["type"] == "col") {
            current_score = retrieveWordCol(getModifiedIndex(), 0);

        }
        else {
            current_score = retrieveWordRow(getModifiedIndex(), 0);
        }
    }
    else {
        if (!no_space) {
            error_messages.push("Les lettres doivent être toutes alignées sans espace");
        }
        if (!adjacent_to_basic) {
            error_messages.push("Les lettres doivent toucher un mot qui est déjà présent");
        }
    }

    if (hand_letters.every(el => el === ".")) {
        current_score += 50;
    }

    console.log(`Score ${current_score}`);
    if (current_score > 0) {
        document.getElementById("validateButton").firstChild.nodeValue = `VALIDER (SCORE = ${current_score})`;
    }
    else {
        document.getElementById("validateButton").firstChild.nodeValue = "Positionnez vos lettres"
    }

    let modifiedMessages = error_messages.map(msg => "&nbsp;&nbsp;&nbsp;&nbsp;-" + msg);
    document.getElementById("errorText").innerHTML = "<u>Information :<u><br>" + modifiedMessages.join("<br>");
}

function getModifiedIndex() {
    const modifiedSquares = document.querySelectorAll('.square.modified');
    let index_minimum = Infinity;

    let squares = document.querySelectorAll('.square');

    for (let i = 0; i < modifiedSquares.length; i++) {
        const index = Array.from(squares).indexOf(modifiedSquares[i]);
        if (index < index_minimum) {
            index_minimum = index;
        }
    }

    return index_minimum;
}

function count_letter(letter, index) {
    let multiplier = 1;
    let global_multiplier = 1;
    if (pattern[index] == "2") {
        global_multiplier = 2;
    }
    else if (pattern[index] == "3") {
        global_multiplier = 3;
    }
    else if (pattern[index] == "b") {
        multiplier = 2;
    }
    else if (pattern[index] == "c") {
        multiplier = 3;
    }


    const allSquares = document.querySelectorAll('.square');
    if (!allSquares[index].classList.contains('modified')) {
        multiplier = 1;
        global_multiplier = 1;
    }


    return { "multiplier": global_multiplier, "score": multiplier * scrabble_letter_score[letter] };
}

function retrieveWordRow(pos_index, changement, orientation) {
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

    let is_current_word_modified = false;
    for (let index_word = index_start; index_word <= index_end; index_word++) {
        word += allSquares[index_word].firstChild.nodeValue;

        if (changement == 0) {
            let counter_letter = count_letter(allSquares[index_word].firstChild.nodeValue, index_word);
            current_word_score += counter_letter["score"];
            current_word_multiplier *= counter_letter["multiplier"];
            other_score += retrieveWordCol(index_word, 1);
        }
        else {

            let counter_letter = count_letter(allSquares[index_word].firstChild.nodeValue, index_word);
            current_word_score += counter_letter["score"];
        }
        if (allSquares[index_word].classList.contains('modified')) {
            is_current_word_modified = true
        }
    }

    if (word.length == 1 || !is_current_word_modified) {
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

    let is_current_word_modified = false;
    for (let index_word = index_start; index_word <= index_end; index_word += 15) {
        word += allSquares[index_word].firstChild.nodeValue;

        if (changement == 0) {
            let counter_letter = count_letter(allSquares[index_word].firstChild.nodeValue, index_word);
            current_word_score += counter_letter["score"];
            current_word_multiplier *= counter_letter["multiplier"];
            other_score += retrieveWordRow(index_word, 1);
        }
        else {

            let counter_letter = count_letter(allSquares[index_word].firstChild.nodeValue, index_word);
            current_word_score += counter_letter["score"];
        }
        if (allSquares[index_word].classList.contains('modified')) {
            is_current_word_modified = true
        }
    }
    if (word.length == 1 || !is_current_word_modified) {
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