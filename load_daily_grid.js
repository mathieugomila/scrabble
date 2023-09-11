daily_grid = ''
daily_hand = []
day_counter = 0

function searchDayIndex() {
    const now = new Date();
    const then = new Date("2023-09-11T00:00:00+02:00");
    const diffInMs = now - then;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays;
}

async function loadDailyGrid() {
    let diffInDays = searchDayIndex();
    const response = await fetch(`days/grid_${diffInDays}.json`);
    const data = await response.json();
    return data;
}

function create_grid() {
    getSevenLetters();
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            const square = document.createElement('div');
            const color = colors[pattern[j + 15 * i]];
            square.className = `square ${color}`;
            square.setAttribute('tabindex', '0');
            square.setAttribute('contenteditable', 'true');
            square.addEventListener('click', function () {
                square_click(square);
                updateHand();
                checkGridAndCalculateScore();
            });
            square.addEventListener('input', function () {
                square_input(square);
                updateHand();
                checkGridAndCalculateScore();

            });

            set_base_letters(square, i, j);

            grid.appendChild(square);
        }
    }
}

async function main() {
    let daily_grid_json = await loadDailyGrid();
    daily_grid = daily_grid_json["grid"];
    daily_hand = daily_grid_json["hand"]
    day_counter = searchDayIndex;
    create_grid()
}

main();