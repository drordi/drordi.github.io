const SOLVED_RIDDLES = "solved_riddles";
const STARTED_RIDDLES = "started_riddles";

function findGetParameter(parameterName) {
    let url = new URL(location.href);
    return url.searchParams.get(parameterName);
}
function markAsComplete() {
    let nRiddle = findGetParameter('riddle');
    let solvedRiddles = localStorage.getItem('solved_riddles').split(",");
    if (solvedRiddles.indexOf(nRiddle) === -1) {
        solvedRiddles.push(nRiddle);
        localStorage.setItem(SOLVED_RIDDLES, solvedRiddles);
    }
}

function markAsStarted() {
    let nRiddle = findGetParameter('riddle');
    let startedRiddles = localStorage.getItem(STARTED_RIDDLES).split(",");
    let notYetStarted = (startedRiddles.indexOf(nRiddle) === -1);
    if (notYetStarted) {
        startedRiddles.push(nRiddle);
        localStorage.setItem(STARTED_RIDDLES, startedRiddles);
    }
    return notYetStarted;
}

function isRiddleSolved(nRiddle) {
    if (localStorage.getItem(SOLVED_RIDDLES)) {
        return localStorage.getItem(SOLVED_RIDDLES).split(",").indexOf(nRiddle) >= 0;
    }
}

function isRiddleStarted(nRiddle) {
    if (localStorage.getItem(STARTED_RIDDLES)) {
        return localStorage.getItem(STARTED_RIDDLES).split(",").indexOf(nRiddle) >= 0;
    }
}

function openNotificationLong(message, isWin) {
    document.getElementById('notify').style.height = "5%";
    if (isWin) {
        document.getElementById('notify').style.backgroundColor = "rgb(98, 159, 91)";
    } else {
        document.getElementById('notify').style.backgroundColor = "rgba(43, 43, 43, 0.6)";
    }
    document.getElementById('notify').innerHTML = message;
}

function openInstructions() {
    if (document.getElementById('instructions').style.visibility === "hidden") {
        document.getElementById('instructions').style.visibility = "visible";
    }
    else {
        document.getElementById('instructions').style.visibility = "hidden";
    }
}