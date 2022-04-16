const config = {
    cellWidth: 40,
    rows: 10,
    columns: 10,
    speedIncreaseFactor: 10,
}
const currentLocation = {row: 0, column: 0};
const foodLocation = {row: -1, column: -1};
const score = {point: 0};
const path = [{...currentLocation}];

function createCell() {
    const cell = document.createElement('div');
    cell.className = 'cell';
    return cell;
}

function renderCell(row, column) {
    const board = document.getElementById('board');
    const cell = createCell();
    cell.style.left = String(config.cellWidth * column) + 'px';
    cell.style.top = String(config.cellWidth * row) + 'px';
    cell.id = `${row}${column}`;
    if (column > 0)
        cell.style.borderLeft = String(0);
    if (row > 0)
        cell.style.borderTop = String(0);
    board.appendChild(cell);
}

function getDirection(key) {
    if (key === 'ArrowUp') return 'up';
    if (key === 'ArrowDown') return 'down';
    if (key === 'ArrowRight') return 'right';
    if (key === 'ArrowLeft') return 'left';
    return null;
}

function updateScore(score) {
    const element = document.getElementById('score');
    element.innerText = `Your Score is ${score}`;
}

function initializeGame() {
    let interval;
    updateScore(0);
    printFood();
    lightCell(0, 0);
    document.addEventListener('keydown', ({key}) => {
        const direction = getDirection(key);
        if (direction) {
            if (interval) clearInterval(interval);
            interval = moveAndLight(currentLocation, direction, path);
        }
    })
}

function printBoard() {
    const board = document.getElementById('board');
    board.style.width = String(config.cellWidth * config.columns) + 'px';
    for (let i = 0; i < config.rows; i++) {
        for (let j = 0; j < config.columns; j++) {
            renderCell(i, j);
        }
    }
    initializeGame();
}

function moveAndLight(currentLocation, direction, path) {
    const interval = setInterval(() => {
        if (currentLocation.row === foodLocation.row && currentLocation.column === foodLocation.column) {
            score.point += 1;
            printFood();
            updateScore(score.point);
        }
        if (direction === 'right') {
            lightCell(currentLocation.row, currentLocation.column++);
        }
        if (direction === 'down') {
            lightCell(currentLocation.row++, currentLocation.column);
        }
        if (direction === 'up') {
            lightCell(currentLocation.row--, currentLocation.column);
        }
        if (direction === 'left') {
            lightCell(currentLocation.row, currentLocation.column--);
        }
        if (path.some((value) => value.row === currentLocation.row && value.column === currentLocation.column)) {
            gameOver();
        }
        path.push({...currentLocation});
        if (currentLocation.column === config.columns
            || currentLocation.row === config.rows
            || currentLocation.column < 0
            || currentLocation.row < 0) {
            clearInterval(interval);
            gameOver();
        }
        if (path.length > score.point + 2) {
           const [value] = path.splice(0, 1);
           dimCell(value.row, value.column);
        }
    }, 500 - (config.speedIncreaseFactor*score.point));
    return interval;
}

function lightCell(row, column) {
    const element = document.getElementById(`${row}${column}`)
    element.style.backgroundColor = 'green';
}

function dimCell(row, column) {
    const element = document.getElementById(`${row}${column}`)
    element.style.transition = 'background-color 0.2s';
    element.style.removeProperty('background-color');
}

function printFood() {
    if (foodLocation.row !== -1 && foodLocation.column !== -1) {
        dimCell(foodLocation.row, foodLocation.column);
    }
    let row = Math.floor(Math.random() * config.rows);
    let column = Math.floor(Math.random() * config.rows);
    while (path.some((value) => value.row === row && value.column === column)) {
        row = Math.floor(Math.random() * config.rows);
        column = Math.floor(Math.random() * config.rows);
    }
    const element = document.getElementById(`${row}${column}`)
    element.style.backgroundColor = 'pink';
    foodLocation.row = row;
    foodLocation.column = column;
}

function gameOver() {
    alert(`Game Over! Your Score was ${score.point}`);
    location.reload();
}

printBoard();