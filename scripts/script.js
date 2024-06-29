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

let emoji_above_max = "😳😳🤯🤯😳😳"
let emoji_max = "🏆🏆🏆";
let emoji_90_pourcent = "🥵🥵🥵";
let emoji_75_pourcent = "🤒🤒🤒";
let emoji_noob = "🤣🤣👎👎🤣🤣"
let emoji_default = "🥱🥱😐😐🥱🥱"

let has_used_helper = false

const colors = { ".": 'white', "3": "red", "2": "pink", "b": "cyan", "c": "blue" };

const grid = document.getElementById('grid');

load_buttons();

function load_buttons() {
    document.getElementById("validateButton").addEventListener("click", async function () {
        if (current_score > 0) {



            let max_point = best_score_possible_dict["score"];
            emoji = emoji_default
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
            else if (current_score <= 0.4 * max_point) {
                emoji = emoji_noob;
            }

            let text = `#SCRABBLEBLE jour n°${day_counter}\n\nScore: ${current_score} ${emoji}\n\nhttps://scrabble.pheargame.net`;

            if (has_used_helper) {
                text += "\n\nUSING HELP"
            }


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

    document.getElementById("helperButton").addEventListener("click", async function () {
        let today_word = best_score_possible_dict["word"];
        let today_score = best_score_possible_dict["score"];
        let today_best_word = best_score_possible_dict["best_word"];
        let today_best_score = best_score_possible_dict["best_score"];

        // Give some hint, just the first letter with ____ behind
        let word_helper = today_word[0] + "*".repeat(today_word.length - 2) + today_word.slice(-1);
        let best_word_helper = today_best_word[0] + "*".repeat(today_best_word.length - 2) + today_best_word.slice(-1);
        // yesterday_word = daily_grid_json["yesterday"]["solution"]["word"]
        // yesterday_score = daily_grid_json["yesterday"]["solution"]["score"]
        // yesterday_best_word = daily_grid_json["yesterday"]["solution"]["best_word"]
        // yesterday_best_score = daily_grid_json["yesterday"]["solution"]["best_score"]
        let text = `INDICE : ${word_helper}[${today_score}] ou ${best_word_helper}[${today_best_score}]`;
        has_used_helper = true;
        document.getElementById("helperButton").firstChild.nodeValue = text;
    }
    );
}

function square_add_modified_letter(square, content) {
    square.classList.add('modified');
    square.classList.add('letter');

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


var dark_value_bg = 70
var dark_value_contrast = 200
var light_value_bg = 255
var light_value_contrast = 50
var is_night = false;


var night_mode_button = document.getElementById('night_mode_button');

night_mode_button.addEventListener('click', function () {
    is_night = !is_night
    change_theme_color(is_night)
});

function change_theme_color(is_night_mode) {
    let root = document.documentElement;

    if (is_night_mode) {
        root.style.setProperty('--background_custom_color', `rgb(${dark_value_bg}, ${dark_value_bg}, ${dark_value_bg})`);
        root.style.setProperty('--contrast_custom_color', `rgb(${dark_value_contrast}, ${dark_value_contrast}, ${dark_value_contrast})`);
        document.getElementById('night_mode_button_image').src = "images/day.png"
        document.getElementById('night_mode_button').style.backgroundColor = "rgb(153, 217, 234)"
    }

    else {
        root.style.setProperty('--background_custom_color', `rgb(${light_value_bg}, ${light_value_bg}, ${light_value_bg})`);
        root.style.setProperty('--contrast_custom_color', `rgb(${light_value_contrast}, ${light_value_contrast}, ${light_value_contrast})`);
        document.getElementById('night_mode_button_image').src = "images/night.png"
        document.getElementById('night_mode_button').style.backgroundColor = "rgb(0, 0, 0)"
    }
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    is_night = true
    change_theme_color(is_night)
} else {
    change_theme_color(is_night)
}
