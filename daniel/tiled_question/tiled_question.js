let currentWord = "";
let questionIndex = findGetParameter('question');
let questionObj = questions[questionIndex];
let question = questionObj.q;
let isChainMode = !!questionObj.answers;
let answerIndex = 0;
let answer = questionObj.a;
let prevAnswer = "";
if (isChainMode) {
    answer = questionObj.answers[answerIndex];
}
let isTilesMode = questionObj.inputType !== 'standard' && !isChainMode;
// let nChars = answer.replace(/\s+/g, '');
let win = false;

function setupTiles() {
    if (document.getElementById('keyboard-keys').hidden) {
        let tilesHTML = '';
        for (let i = 0; i < answer.length; i++) {
            if (answer[i] === ' ') {
                // tilesHTML += `<div class="tile" id="tile1${i+1}" data-animation="idle"></div>\n`
            } else {
                tilesHTML += `<div class="tile" id="tile1${i + 1}" data-animation="idle"></div>\n`
            }
        }
        document.getElementById('row1').innerHTML = tilesHTML;
        document.getElementById('keyboard-keys').hidden = false;
    }
}

function setup() {
    if (markAsStarted()) {
        console.log("reset question");
        saveUserData(); //save with empty data - reset
    } else {
        loadUserData();
    }

    document.getElementById('question').innerText = question;
    if (!win) {
        if (isTilesMode) {
            setupTiles();
        } else {
            document.getElementById('standard-input').hidden = false;
        }
    }

    if (questionObj.title) {
        document.getElementById('page-title').innerText = questionObj.title;
    }

    if (questionObj.info) {
        document.getElementById('instructions-content').innerText = questionObj.info;
    }

    setImage(questionObj.image);
}

function setImage(imageURL) {
    if (imageURL) {
        document.getElementById('image-placeholder').innerHTML =
            `<img class="question-image center" src="${imageURL}"/>`;
    }
}

function clickLetter(value) {
    console.log(arguments.callee.name);
    currentRow = document.getElementById(`row1`)
    for (let i = 1; i <= answer.length; i++) {
        let tile = `tile1${i}`;
        if (document.getElementById(`${tile}`).innerHTML == '') {
            value = changeToFinal(value);
            currentWord += value;//add letter to currentWord
            document.getElementById(tile).setAttribute('data-animation', 'pop');
            document.getElementById(tile).style.border = "solid rgb(34, 34, 34)";
            document.getElementById(tile).innerHTML = value;//print letter in Tile
            break;
        }
    }
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
function sendWord(e) {
    console.log(arguments.callee.name, e && e.preventDefault);

    if (e && e.preventDefault) {
        e.preventDefault();
    }

    if (win === false) {
        if (isTilesMode) {
            if (currentWord.length === answer.length) {
                compareWords();//compares words and does the rest fills tiles accordingly
                saveUserData();//saves answers to localStorage
            }
            else { //checks if there are enough letters
                animateWakeUp();
                openNotification("אין מספיק אותיות")
            }
        } else {
            compareWords();//compares words and does the rest fills tiles accordingly
            saveUserData();//saves answers to localStorage
        }
    } else {
        window.location.href = '../index.html';
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
    if (isTilesMode) {
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
}

function eraseLetter() {
    console.log(arguments.callee.name);
    if (currentWord != '') {
        let tile = `tile1${currentWord.length}`;
        document.getElementById(tile).innerHTML = '';
        document.getElementById(tile).setAttribute('data-animation', 'idle');
        document.getElementById(tile).style.border = "solid rgb(212, 212, 212)";
        currentWord = currentWord.substring(0, currentWord.length - 1);

    }
}

function compareWords() {
    console.log(arguments.callee.name);

    let solved = true;
    if (isTilesMode) {
        for (i = 0; i <= currentWord.length; i++) {
            //if letter exists in place:
            if (!compareLetters(currentWord[i], answer[i])) {
                solved = false;
                break;
            }
        }
    } else {
        currentWord = document.getElementById('answer-input').value;
        if (Array.isArray(answer)) {
            solved = answer.some((a) => a.toLowerCase() === currentWord.toLowerCase());
        } else {
            solved = (currentWord.toLowerCase() === answer.toLowerCase());
        }
    }

    if (findGetParameter('test') === '1') {
        solved = true;
    }

    //if sentWord is correct display final message and update win:
    if (solved) {

        if (isTilesMode) {
            //color green indices on top of all else:
            for (i = 0; i < currentWord.length; i++) {
                document.getElementById(`tile1${i + 1}`).setAttribute('data-animation', 'flip-in');
                document.getElementById(`tile1${i + 1}`).style.backgroundColor = "rgb(98, 159, 91)";//green
                document.getElementById(`tile1${i + 1}`).style.border = "solid rgb(98, 159, 91)";//green border
            }
            // color text white
            document.getElementById(`row1`).style.color = "white";
        }

        if (isChainMode) {
            answerIndex++;
            prevAnswer = currentWord;
            document.getElementById('answer-input').value = "";
            setPrevAnswer();
            if (answerIndex < questionObj.answers.length) {
                answer = questionObj.answers[answerIndex];
                currentWord = "";
                return;
            }
        }

        onWin();
    } else {
        animateWakeUp();
        if (!isTilesMode) {
            openNotification(pickFailMessage());
            document.getElementById('answer-input').value = "";
        }
    }
}

function onWin() {
    win = true;

    document.getElementById('answer-input').hidden = true;

    setTimeout(() => { setImage(questionObj.imageAnswer) }, 1000);
    if (questionObj.answerDesc) {
        setTimeout(() => {
            document.getElementById('prev-answer').hidden = false;
            document.getElementById("prev-answer").innerText = questionObj.answerDesc;
        }, 1000);
    }
    markAsComplete();
    let winMessage = pickMessage();
    openNotificationLong(winMessage, true);
    document.getElementById("send").innerHTML = "!סיימתי";
}

function setPrevAnswer() {
    if (isChainMode && prevAnswer) {
        document.getElementById("prev-answer").hidden = false;
        document.getElementById("prev-answer").innerText = `התשובה הקודמת: ${prevAnswer}`;
    }
}

function pickMessage() {
    let messageArray = ['!שיחקת אותה','!הצלחת', '!מדהים', '!גאה בך'];
    randIndex = Math.floor(Math.random() * (messageArray.length));

    return messageArray[randIndex]
}

function pickFailMessage() {
    let messageArray = ['אופס! נסי שוב', 'נסי כיוון אחר','עדיין לא שם','מתקרר', 'Nope', '?יש גלגל הצלה', 'Help!', '?מותר חבר טלפוני'];
    randIndex = Math.floor(Math.random() * (messageArray.length));

    return messageArray[randIndex]
}

function saveUserData() {
    if (isChainMode) {
        localStorage.setItem(`questionObj_${questionIndex}`, JSON.stringify({answerIndex, prevAnswer}));
    }
}

// loadUserData loads the data saved on localStorage and fills the tiles with older answers. this only happens if the day is today.
function loadUserData() {
    if (isChainMode) {
        if (localStorage.getItem(`questionObj_${questionIndex}`)) {
            let obj = JSON.parse(localStorage.getItem(`questionObj_${questionIndex}`));
            console.log(arguments.callee.name, obj);
            answerIndex = obj.answerIndex;
            answer = questionObj.answers[answerIndex];
            prevAnswer = obj.prevAnswer || "";
            setPrevAnswer();
            if (answerIndex === questionObj.answers.length) {
                onWin();
            }
        }
    } else if (isRiddleSolved(findGetParameter('riddle'))) {
        answer = questionObj.a;
        currentWord = answer;
        if (isTilesMode) {
            setupTiles();
            for (let i = 0; i < answer.length; i++) {
                let tile = `tile1${i+1}`;
                document.getElementById(tile).innerHTML = answer[i];//print letter in Tile
                document.getElementById(`tile1${i + 1}`).setAttribute('data-animation', 'flip-in');
                document.getElementById(`tile1${i + 1}`).style.backgroundColor = "rgb(98, 159, 91)";//green
                document.getElementById(`tile1${i + 1}`).style.border = "solid rgb(98, 159, 91)";//green border
            }
            // color text white
            document.getElementById(`row1`).style.color = "white";
        } else {
            document.getElementById("prev-answer").hidden = false;
            document.getElementById("prev-answer").innerText = `התשובה: ${answer}`;
        }
        onWin();
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



