// Read URL parameters
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get("mode");        // input or multiple
const op = urlParams.get("op");            // addition, subtraction, etc.
const diff = urlParams.get("diff");        // easy, medium, hard
const isWeekly = urlParams.get("weekly") === "1";

// DOM elements
const questionEl = document.getElementById("question");
const counterEl = document.getElementById("counter");
const inputContainer = document.getElementById("input-container");
const multipleContainer = document.getElementById("multiple-container");
const answerInput = document.getElementById("answer-input");
const choiceButtons = document.querySelectorAll(".choice-btn");
const okBtn = document.getElementById("ok-btn");

// Sounds
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

// Game state
let currentQuestion = 0;
let correctAnswer = 0;

// Difficulty ranges
const ranges = {
    easy: 20,
    medium: 60,
    hard: 150
};

// Generate random number
function rand(max) {
    return Math.floor(Math.random() * max) + 1;
}

// Generate new question
function generateQuestion() {
    currentQuestion++;
    if (currentQuestion > 20) {
        showEndScreen();
        return;
    }

    counterEl.innerText = `Question ${currentQuestion} / 20`;

    let a = rand(ranges[diff]);
    let b = rand(ranges[diff]);

    switch (op) {
        case "addition":
            correctAnswer = a + b;
            questionEl.innerText = `${a} + ${b} = ?`;
            break;
        case "subtraction":
            correctAnswer = a - b;
            questionEl.innerText = `${a} - ${b} = ?`;
            break;
        case "multiplication":
            correctAnswer = a * b;
            questionEl.innerText = `${a} × ${b} = ?`;
            break;
        case "division":
            correctAnswer = a;
            let product = a * b;
            questionEl.innerText = `${product} ÷ ${b} = ?`;
            break;
        case "mixed":
            const ops = ["+", "-", "×", "÷"];
            const pick = ops[Math.floor(Math.random() * 4)];
            if (pick === "+") {
                correctAnswer = a + b;
                questionEl.innerText = `${a} + ${b} = ?`;
            }
            if (pick === "-") {
                correctAnswer = a - b;
                questionEl.innerText = `${a} - ${b} = ?`;
            }
            if (pick === "×") {
                correctAnswer = a * b;
                questionEl.innerText = `${a} × ${b} = ?`;
            }
            if (pick === "÷") {
                correctAnswer = a;
                let product2 = a * b;
                questionEl.innerText = `${product2} ÷ ${b} = ?`;
            }
            break;
    }

    if (mode === "multiple") {
        setupMultipleChoice();
    }
}

// Setup multiple choice answers
function setupMultipleChoice() {
    let answers = [correctAnswer];
    while (answers.length < 3) {
        let wrong = correctAnswer + Math.floor(Math.random() * 10) - 5;
        if (wrong !== correctAnswer && wrong >= 0) answers.push(wrong);
    }
    answers.sort(() => Math.random() - 0.5);

    choiceButtons.forEach((btn, i) => {
        btn.innerText = answers[i];
        btn.onclick = () => checkAnswer(answers[i]);
    });
}

// Check answer
function checkAnswer(value) {
    if (mode === "input") {
        value = Number(answerInput.value);
    }

    if (value === correctAnswer) {
        correctSound.play();
    } else {
        wrongSound.play();
    }

    answerInput.value = "";

    // Weekly progress increment
    if (isWeekly) incrementWeeklyProgress();

    generateQuestion();
}

// Weekly progress functions
function incrementWeeklyProgress() {
    let weeklyCount = Number(localStorage.getItem("weeklyCurrent") || 0);
    if (weeklyCount < 5) {
        weeklyCount++;
        localStorage.setItem("weeklyCurrent", weeklyCount);
        updateWeeklyPentagon(weeklyCount);
    }
    if (weeklyCount === 5) {
        showWeeklyTrophy();
    }
}

function updateWeeklyPentagon(count) {
    const pentagonProgress = document.getElementById("pentagon-progress");
    const pentagonPoints = [
        [100, 20],
        [180, 75],
        [150, 160],
        [50, 160],
        [20, 75],
        [100, 20]
    ];
    let points = "";
    for (let i = 0; i <= count; i++) points += `${pentagonPoints[i][0]},${pentagonPoints[i][1]} `;
    if (pentagonProgress) pentagonProgress.setAttribute("points", points.trim());

    const progressText = document.getElementById("weekly-progress");
    if (progressText) progressText.innerText = `Heti haladás: ${count}/5`;
}

function showWeeklyTrophy() {
    const trophyPopup = document.getElementById("trophy-popup");
    if (trophyPopup) trophyPopup.classList.remove("hidden");
    for (let i = 0; i < 50; i++) createConfetti();
}

// Confetti
function createConfetti() {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    document.body.appendChild(confetti);
    const size = Math.random() * 8 + 4;
    confetti.style.width = size + "px";
    confetti.style.height = size + "px";
    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.backgroundColor = ["#ff00cc","#00ff7f","#ffd700","#6a00ff"][Math.floor(Math.random()*4)];
    confetti.style.animationDuration = (Math.random()*2+2)+"s";
    setTimeout(()=>confetti.remove(),4000);
}

// End screen for daily 20 questions
function showEndScreen() {
    document.querySelector(".game-container").innerHTML = `
        <h2>You finished all 20 questions!</h2>
        <button class="menu-btn" onclick="location.href='game.html'">Play Again</button>
        <button class="menu-btn" onclick="location.href='index.html'">Back to Home</button>
    `;
}

// OK button
okBtn.onclick = () => {
    if (mode === "input") checkAnswer(Number(answerInput.value));
};

// INITIAL DISPLAY
if (mode === "multiple") {
    inputContainer.style.display = "none";
    multipleContainer.style.display = "block";
} else {
    inputContainer.style.display = "block";
    multipleContainer.style.display = "none";
}

generateQuestion();