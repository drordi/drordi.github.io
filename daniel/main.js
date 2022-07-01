let solved_riddles = [];
let startedRiddles = [];

function loadState() {
    if (localStorage.getItem(SOLVED_RIDDLES)) {
        solved_riddles = localStorage.getItem(SOLVED_RIDDLES).split(",");
    }

    if (localStorage.getItem(STARTED_RIDDLES)) {
        startedRiddles = localStorage.getItem(STARTED_RIDDLES).split(",");
    }
    updateView();
}


function updateView() {
    for (let i=1; i<37; i++) {
        if (isRiddleSolved(i.toString())) {
            document.getElementById(i.toString()).classList.add("solved");
        } else {
            document.getElementById(i.toString()).classList.remove("solved");
        }
    }
}

function saveState() {
    localStorage.setItem(SOLVED_RIDDLES, solved_riddles.join(","));
    localStorage.setItem(STARTED_RIDDLES, startedRiddles.join(","));
    updateView();
}

function clickTile(tileNum) {
    let isSolved = isRiddleSolved(tileNum);
    let isStarted = isRiddleStarted(tileNum);
    console.log("DIM DIM isSolved", isSolved);
    console.log("DIM DIM isStarted", isStarted);
    // if (!isSolved) {
        window.location.href = riddles[parseInt(tileNum)-1].url + `&riddle=${tileNum}`;
    // }
}

function resetGame() {
    if (confirm("האם ברצונך לאפס ולהתחיל מהתחלה?")) {
        solved_riddles = [];
        startedRiddles = [];
        saveState();
    } else {

    }
}

loadState();