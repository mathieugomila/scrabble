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

async function loadDailyGrid(today_day) {
    const response_today = await fetch(`days/grid_${today_day}.json`);
    const data_today = await response_today.json();

    const response_yesterday = await fetch(`days/grid_${today_day - 1}.json`);
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
            square.addEventListener('click', function () {
                square_click(square);
                updateHand();
                checkGridAndCalculateScore();
                square.focus();
                update_letter_score();
            });

            set_base_letters(square, i, j);

            grid.appendChild(square);
        }
    }
    await loadLetterCount();
    update_letter_score();
}

async function main() {
    day_counter = searchDayIndex();
    let daily_grid_json = await loadDailyGrid(day_counter);
    daily_grid = daily_grid_json["today"]["grid"];
    daily_hand = daily_grid_json["today"]["hand"];
    best_score_possible_dict = daily_grid_json["today"]["solution"];
    create_grid()
    document.getElementById("title").querySelector('h2').innerText = `SCRABBLEBLE n°${day_counter}`
}

main();