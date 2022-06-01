let puzzleId = findGetParameter('puzzle');

let puzzle = puzzles[puzzleId];
let fixedGrid = puzzle.grid;
let grid = [[],[],[],[],[],[],[],[],[]];
let selectedTile = null;
let selectedControl = null;
let nFilledSquares = 0;
let win = false;

const SUDOKU_STATE = "sudoku_state";



function loadGame() {
    if (puzzle.title) {
        document.getElementById('page-title').innerText = puzzle.title;
    }

    if (markAsStarted()) {
        console.log("reset sudoku");
        saveState(); //save with empty data - reset
    } else {
        loadState();
    }

    for (let row = 1; row < 10; row++) {
        for (let col = 1; col < 10; col++) {
            fillSquare(row, col, fixedGrid[row-1][col-1], true);
            fillSquare(row, col, grid[row-1][col-1], true);
        }
    }

    if (findGetParameter('test') === '1' && puzzle.solution) {
        for (let row = 1; row < 10; row++) {
            for (let col = 1; col < 9; col++) {
                fillSquare(row, col, puzzle.solution[row-1][col-1], false);
            }
        }
    }

    nFilledSquares = 0;
    for (let row = 1; row < 10; row++) {
        for (let col = 1; col < 10; col++) {
            if (grid[row-1][col-1]) {
                nFilledSquares++;
            }
        }
    }

    checkSolution();
}

function resetGame() {
    for (let row = 1; row < 10; row++) {
        for (let col = 1; col < 10; col++) {
            removeSquare(row, col);
        }
    }
    checkSolution();
}

function isFixedTile(row, col) {
    return !!fixedGrid[row-1][col-1];
}

function isFilled(row, col) {
    return !!grid[row-1][col-1];
}

function checkSolution() {
    console.log("checkSolution", nFilledSquares);
    if (nFilledSquares === 81) {
        let isValid = true;
        for (let i = 1; i < 10; i++) {
            let rowTiles = [];
            let colTiles = [];
            let squareTiles = [];
            for (let j = 1; j < 10; j++) {
                rowTiles[grid[i-1][j-1]-1] = true;
                colTiles[grid[j-1][i-1]-1] = true;
                // console.log(Math.floor((i-1)/3)*3+Math.floor((j-1)/3), ((i-1)%3)*3+(j-1)%3);
                squareTiles[grid[Math.floor((i-1)/3)*3+Math.floor((j-1)/3)][((i-1)%3)*3+(j-1)%3]-1] = true;
                // removeSquare(Math.floor((i-1)/3)*3+Math.floor((j-1)/3)+1,((i-1)%3)*3+(j-1)%3 + 1);
            }

            for (let index = 0; index < 9; index++) {
                if (!rowTiles[index] || !colTiles[index] || !squareTiles[index]) {
                    isValid = false;
                    console.log("sudoku solution invalid", rowTiles, colTiles, squareTiles);    
                }
            }
        }

        if (isValid) {
            win = true;
            console.log("sudoku solution valid", grid);
            document.getElementById('send').classList.remove('hidden');
            markAsComplete();
        } else {
            win = false;
            console.log("invalid");
            document.getElementById('send').classList.add('hidden');
        }

        let message = pickMessage();
        openNotificationLong(message, win);
    }
}

function pickMessage() {
    let messageArray = [];
    if (win) {
        messageArray = ['אליפות! הצלחת!', 'יגעת והצלחת - תאמין', 'סודוקו תמונות זה חופררר'];
    } else {
        messageArray = ['לא מאמין שזה לא נכון', 'חזרה לשולחן השרטוטים', 'סודוקו תמונות זה קשההה', 'ידעתי שפספסתי אבנר איפשהו'];
    }
    return messageArray[Math.floor(Math.random() * (messageArray.length))]
}

function fillSquare(row, col, numberToFill, isSetup) {
    if (win) {
        return;
    }
    if (numberToFill && (isSetup || !isFixedTile(row, col))) {
        let el = document.getElementById(`${row}${col}`);
        if (isFixedTile(row,col)) {
            el.classList.add("fixed");
        } else {
            el.classList.add("manually-filled");
        }
        el.classList.remove(`image-${grid[row-1][col-1]}`);
        // for (let i=1; i<10; i++) {
        //     el.classList.remove(`image-${i}`);
        // }
        el.classList.add(`image-${numberToFill}`);
        el.innerHTML = `<img class="tile-image" src="./tile_images/${numberToFill}.jpeg"/>`;
        if (!grid[row-1][col-1]) {
            nFilledSquares++;
        }
        grid[row-1][col-1] = numberToFill;
        saveState();
        checkSolution();
    }
}

function removeSquare(row, col) {
    if (win) {
        return;
    }
    // console.log(row, col);
    let el = document.getElementById(`${row}${col}`);
    if (isFilled(row, col) && !isFixedTile(row, col)) {
        el.classList.remove("manually-filled");
        el.classList.remove(`image-${grid[row-1][col-1]}`);
        el.innerHTML = '';
        if (grid[row-1][col-1]) {
            nFilledSquares--;
        }
        grid[row-1][col-1] = null;

        saveState();
    }
}

function loadState() {
    if (localStorage.getItem(`${SUDOKU_STATE}_${puzzleId}`)) {
        grid = JSON.parse(localStorage.getItem(`${SUDOKU_STATE}_${puzzleId}`));
    }
}

function saveState() {
    localStorage.setItem(`${SUDOKU_STATE}_${puzzleId}`, JSON.stringify(grid));
}

function clickControl(controlTile) {
    if (selectedControl) {
        document.getElementById(`c${selectedControl}`).classList.remove(`selected`);
    }
    if (selectedControl === controlTile) {
        selectedControl = null; //deselect
    } else {
        selectedControl = controlTile;
        document.getElementById(`c${controlTile}`).classList.add(`selected`);
    }
    console.log("selected control",selectedControl);
}

function clickTile(tileNum) {
    let row = parseInt(tileNum[0]);
    let col = parseInt(tileNum[1]);
    if (selectedControl) {
        if (selectedControl === 'x') {
            removeSquare(row, col);
        } else {
            if (grid[row-1][col-1] === selectedControl) {
                removeSquare(row, col, selectedControl);
            } else {
                fillSquare(row, col, selectedControl, false);
            }
        }
    }
}

function submit() {
    if (win) {
        window.location.href = '../../project35/index.html';
    }
}

loadGame();