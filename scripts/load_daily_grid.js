daily_grid = ''
daily_hand = []
best_score_possible_dict = {}
day_counter = 0

function searchDayIndex() {
    const now = new Date();
    const then = new Date("2023-09-11T00:00:00+02:00");
    const diffInMs = now - then;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays;
}

function formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1; // Les mois sont indexés à partir de 0
    let year = date.getFullYear();

    // Ajoute un zéro devant les jours et les mois qui ont un seul chiffre
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return `${day}-${month}-${year}`;
}

async function loadDailyGrid() {
    today = new Date()
    today_date = formatDate(today)
    const response_today = await fetch(`days/grid_${today_date}.json`);
    const data_today = await response_today.json();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    yesterday_date = formatDate(yesterday)

    const response_yesterday = await fetch(`days/grid_${yesterday_date}.json`);
    const data_yesterday = await response_yesterday.json();

    return { "today": data_today, "yesterday": data_yesterday };
}

function addCaseIndication(square, case_pattern) {
    if (case_pattern == "2") {
        square.textContent = `MOT\nDOUBLE`;
    }
    else if (case_pattern == "3") {
        square.textContent = "MOT\nTRIPLE";
    }
    else if (case_pattern == "b") {
        square.textContent = "LETTRE\nDOUBLE";
    }
    else if (case_pattern == "c") {
        square.textContent = "LETTRE\nTRIPLE";
    }
}

async function create_grid() {
    getSevenLetters();
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            const square = document.createElement('div');
            const color = colors[pattern[j + 15 * i]];
            addCaseIndication(square, pattern[j + 15 * i]);
            square.className = `square ${color}`;
            square.setAttribute('tabindex', '0');

            set_base_letters(square, i, j);

            grid.appendChild(square);
        }
    }
    await loadLetterCount();
    update_letter_score();
    previous_solution_text()
}

function set_base_letters(square, i, j) {
    if (daily_grid[i * 15 + j] != ".") {
        square.textContent = daily_grid[i * 15 + j];
        square.classList.add('non-editable');
        square.classList.add('default');
        square.classList.add('letter');
    }
}

function previous_solution_text() {
    yesterday_solution_text = ""
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            if (daily_grid[i * 15 + j] != ".") {
                yesterday_solution_text += daily_grid[i * 15 + j].toLowerCase()
                continue
            }

            position_solution = best_score_possible_dict["position"]
            if (best_score_possible_dict["direction"] == "right") {
                if (i != position_solution[0]) {
                }
                if (j < position_solution[1] || j > position_solution[1] + best_score_possible_dict["word"].length) {
                }
                else {
                    index_word = j - position_solution[1]
                    yesterday_solution_text += best_score_possible_dict[index_word]
                }

            }
            else {
                if (j != position_solution[1]) {
                }
                else if (i < position_solution[0] || i > position_solution[0] + best_score_possible_dict["word"].length) {
                }
                else {
                    index_word = i - position_solution[0]
                    yesterday_solution_text += best_score_possible_dict["word"][index_word]
                }
            }
            yesterday_solution_text += "."
        }
        yesterday_solution_text += "\n"
    }
}

async function main() {
    day_counter = searchDayIndex();
    let daily_grid_json = await loadDailyGrid();
    daily_grid = daily_grid_json["today"]["grid"];
    daily_hand = daily_grid_json["today"]["hand"];
    best_score_possible_dict = daily_grid_json["today"]["solution"];
    create_grid()
    document.getElementById("title").textContent = `SCRABBLEBLE n°${day_counter} [+: ${best_score_possible_dict["score"]}, ++: ${best_score_possible_dict["best_score"]}]`

    yesterday_word = daily_grid_json["yesterday"]["solution"]["word"]
    yesterday_score = daily_grid_json["yesterday"]["solution"]["score"]
    yesterday_best_word = daily_grid_json["yesterday"]["solution"]["best_word"]
    yesterday_best_score = daily_grid_json["yesterday"]["solution"]["best_score"]
    document.getElementById("yesterdayAnswer").innerHTML = `<u>Hier</u> : ${yesterday_word}[${yesterday_score}] ou ${yesterday_best_word}[${yesterday_best_score}]`
}

main();