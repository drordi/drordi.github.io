let currentWord = "";
let questionIndex = findGetParameter('board');
let questionObj = boards[questionIndex];
let question = questionObj.q;
let solution = questionObj.solution;
let currentBoard = [];
let nRows = solution.length;
let nCols = solution[0].length;
let answerIndex = 0;
let answer = questionObj.a;
let win = false;
let selectedTile = null;
let selectedRow = null;
let selectedCol = null;
let selectedDirection = null;
let showHint = false;

function prepareSolution() {
    let solutionBoard = [];
    solution.forEach((row) => {
        solutionBoard.push(row.split('').map(c => (c === 'ץ') ? null : c));
    });
    solution = solutionBoard;
    console.log("solution board", solution);
}

function setup() {
    prepareSolution();
    currentBoard = [];
    for (let i = 0; i < nRows; i++) {
        let row = [];
        for (let j = 0; j < nCols; j++) {
                row.push(null);
        }
        currentBoard.push(row);
    }

    document.getElementById('question').innerText = question;
    let tilesHTML = '';
    for (let i = 0; i < nRows; i++) {
        tilesHTML += `<div class="row" id="row${i}">`;
        for (let j = 0; j < nCols; j++) {
            if (solution[i][j]) {
                tilesHTML += `<div class="tile free" id="tile${i}${j}" data-animation="idle" onClick="clickTile(${i},${j})"></div>\n`
            } else {
                tilesHTML += `<div class="tile blocked" id="tile${i}${j}" data-animation="idle" onClick="clickTile(${i},${j})"></div>\n`
            }
        }
        tilesHTML += "</div>";
    }
    document.getElementById('board').innerHTML = tilesHTML;

    if (questionObj.title) {
        document.getElementById('page-title').innerText = questionObj.title;
    }

    if (markAsStarted()) {
        console.log("reset question");
        saveUserData(); //save with empty data - reset
    } else {
        loadUserData();
    }

    if (findGetParameter('test') === '1') {
        for (let i = 0; i < nRows; i++) {
            for (let j = 0; j < nCols; j++) {
                paintLetter(i,j,solution[i][j]);     
            }
        }
    }

    // if (questionObj.hint) {
    //     document.getElementById('hint-title').hidden = false;
    // }
}

function clickTile(row, col, direction) {
    console.log(arguments.callee.name, row, col);
    let tileId = `tile${row}${col}`;
    let clickedTile = document.getElementById(tileId);
    if (!clickedTile.classList.contains('blocked')) {
        if (clickedTile.classList.contains('selected')) {
            selectedTile.classList.remove('selected'); 
            selectedTile = null; 
            selectedRow = null;
            selectedCol = null;
            selectedDirection = null;
            return;
        }
        if (selectedTile) {
            selectedTile.classList.remove('selected');    
        }
        selectedTile = document.getElementById(tileId);
        selectedTile.classList.add('selected');
        selectedDirection = direction;
        selectedRow = row;
        selectedCol = col;
    }
}

function paintLetter(row, col, value) {
    console.log(arguments.callee.name);
    if (solution[row][col]) {
        let tile = document.getElementById(`tile${row}${col}`);
        currentBoard[row][col] = value;
        tile.setAttribute('data-animation', 'pop');
        tile.style.border = "solid rgb(34, 34, 34)";
        tile.innerHTML = value;//print letter in Tile
    }
}

function clickLetter(value) {
    console.log(arguments.callee.name);
    if (selectedTile) {
        // value = changeToFinal(value);
        paintLetter(selectedRow, selectedCol, value);
        // currentBoard[selectedRow][selectedCol] = value;
        // selectedTile.setAttribute('data-animation', 'pop');
        // selectedTile.style.border = "solid rgb(34, 34, 34)";
        // selectedTile.innerHTML = value;//print letter in Tile

        let hasNextRow = selectedRow+1 < nRows && solution[selectedRow+1][selectedCol];
        let nextRowShouldBeFilled = hasNextRow && !currentBoard[selectedRow+1][selectedCol];
        let hasNextCol = selectedCol+1 < nCols && solution[selectedRow][selectedCol+1];
        if (hasNextRow && (selectedDirection === 'row' || !hasNextCol || 
        (!selectedDirection && nextRowShouldBeFilled))) {
            clickTile(selectedRow+1,selectedCol, 'row');
        } else if (hasNextCol) {
            clickTile(selectedRow,selectedCol+1, 'col');
        }
        saveUserData();
    }
    console.log(currentBoard);
}

function changeToFinal(value) {
    console.log(arguments.callee.name);
    if (currentWord.length === answer.length - 1) {
        if (value === 'פ') { value = 'ף'; };
        if (value === 'נ') { value = 'ן'; };
        if (value === 'מ') { value = 'ם'; };
        if (value === 'כ') { value = 'ך'; };
        if (value === 'צ') { value = 'ץ'; };

    }
    return value;
}

function isBoardFilled() {
    for (let i = 0; i < nRows; i++) {
        for (let j = 0; j < nCols; j++) {
            if (solution[i][j] && !currentBoard[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function sendWord() {
    console.log(arguments.callee.name,);

    if (win === false) {
        if (isBoardFilled()) {
            checkSolution();//compares words and does the rest fills tiles accordingly
            saveUserData();//saves answers to localStorage
        }
        else { //checks if there are enough letters
            // animateWakeUp();
            openNotification("עליך למלא את כל התשבץ")
        }
    } else {
        window.location.href = '../../project35/index.html';
    }
}

function toggleHint() {
    if (showHint) {
        document.getElementById('hint').innerHTML = "";
        showHint = false;
    } else {
        if (questionObj.hint) {
            document.getElementById('hint').innerHTML = questionObj.hint;
        } else if (questionObj.hintImage) {
            document.getElementById('hint').innerHTML = `<img class="hint-image" src="${questionObj.hintImage}"/>`;;
        }
        showHint = true;
    }
}

function openNotification(message) {
    document.getElementById('notify').style.height = "5%";
    document.getElementById('notify').innerHTML = message;

    setTimeout(function () {
        document.getElementById('notify').style.height = "0%";
    }, 2000);

}

function animateWakeUp() {
    console.log(arguments.callee.name);
    for (i = 1; i <= answer.length; i++) {
        setAnimation(i, 'wakeup');
        function setAnimation(k, animation) {
            document.getElementById(`tile1${i}`).classList.add(animation)
        };
    }
    setTimeout(function () {
        for (j = 1; j <= 5; j++) {
            document.getElementById(`tile1${j}`).setAttribute('data-animation', 'idle');
            document.getElementById(`tile1${j}`).classList.remove('wakeup');
        }
    }, 800);
}

function eraseLetter() {
    console.log(arguments.callee.name);
    if (selectedTile) {
        selectedTile.innerHTML = '';
        selectedTile.setAttribute('data-animation', 'idle');
        selectedTile.style.border = "solid rgb(212, 212, 212)";
        currentBoard[selectedRow][selectedCol] = null;
    }
    let hasPrevRow = selectedRow > 0 && currentBoard[selectedRow-1][selectedCol];
    let hasPrevCol = selectedCol > 0 && currentBoard[selectedRow][selectedCol-1];
    if (hasPrevRow && (selectedDirection === 'row' || 
    (!selectedDirection) && !hasPrevCol)) {
            clickTile(selectedRow-1,selectedCol, 'row');
    } else if (hasPrevCol && (selectedDirection === 'col' || 
    (!selectedDirection) && !hasPrevRow)) {
        clickTile(selectedRow,selectedCol-1, 'col');
    }
    saveUserData();
}

function checkSolution() {
    console.log(arguments.callee.name);

    let solved = true;
    for (let i = 0; i < nRows; i++) {
        for (let j = 0; j < nCols; j++) {
            if (solution[i][j] !== currentBoard[i][j]) {
                solved = false;
                console.log("invalid solution", solution[i][j], currentBoard[i][j]);
                break;
            }
        }
    }
    
    if (solved) {
        onWin();
    } else {
        animateWakeUp();
    }
}

function onWin() {
    win = true;

    //color green indices on top of all else:
    for (let i = 0; i < nRows; i++) {
        for (let j = 0; j < nCols; j++) {
            if (solution[i][j]) {
                let tile = document.getElementById(`tile${i}${j}`);
                tile.setAttribute('data-animation', 'flip-in');
                tile.style.backgroundColor = "rgb(98, 159, 91)";//green
                // tile.style.border = "solid rgb(98, 159, 91)";//green border
                tile.style.color = "white"; // color text white
            }
        }
    }

    markAsComplete();
    let winMessage = pickMessage();
    openNotificationLong(winMessage, true);
    document.getElementById("send").innerHTML = "!סיימתי";
}

function pickMessage() {
    let messageArray = ['!שיחקת אותה','!הצלחת'];
    randIndex = Math.floor(Math.random() * (messageArray.length));

    return messageArray[randIndex]
}

function saveUserData() {
    localStorage.setItem(`questionObj_${questionIndex}`, JSON.stringify({board: currentBoard}));
}

// loadUserData loads the data saved on localStorage and fills the tiles with older answers. this only happens if the day is today.
function loadUserData() {
    if (localStorage.getItem(`questionObj_${questionIndex}`)) {
        let obj = JSON.parse(localStorage.getItem(`questionObj_${questionIndex}`));
        console.log(arguments.callee.name, obj);
        if (obj.board) {
            for (let i = 0; i < nRows; i++) {
                for (let j = 0; j < nCols; j++) {
                    paintLetter(i,j,obj.board[i][j]);
                    // currentBoard[i][j] = obj.board[i][j];
                    // clickTile(i,j);
                    // clickLetter(obj.board[i][j]);             
                }
            }
        }
    }
}

function compareLetters(letterA, letterB) {
    console.log(arguments.callee.name);
    if (letterA === letterB | (letterA === "נ" && letterB === "ן") | (letterA === "צ" && letterB === "ץ") | (letterA === "פ" && letterB === "ף") | (letterA === "כ" && letterB === "ך") | (letterA === "מ" && letterB === "ם")) {
        return true;
    }
    else if ((letterB === "נ" && letterA === "ן") | (letterB === "צ" && letterA === "ץ") | (letterB === "פ" && letterA === "ף") | (letterB === "כ" && letterA === "ך") | (letterB === "מ" && letterA === "ם")) {
        return true
    }
    else {
        return false;

    }
}




setup();



