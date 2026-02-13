
// Read URL parameters
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get("mode");        // input or multiple
const op = urlParams.get("op");            // addition, subtraction, etc.
const diff = urlParams.get("diff");        // easy, medium, hard

// DOM elements
const questionEl = document.getElementById("question");
const counterEl = document.getElementById("counter");

const inputContainer = document.getElementById("input-container");
const multipleContainer = document.getElementById("multiple-container");

const answerInput = document.getElementById("answer-input");
const choiceButtons = document.querySelectorAll(".choice-btn");

const okBtn = document.getElementById("ok-btn");
const endScreen = document.getElementById("end-screen");

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

// Generate a random number
function rand(max) {
    return Math.floor(Math.random() * max) + 1;
}

// Generate a new question
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

    generateQuestion();
}

// Show end screen
function showEndScreen() {
    document.querySelector(".game-container").innerHTML = `
        <h2>Done!</h2>
        <p>You finished all 20 questions!</p>
        <button class="menu-btn" onclick="location.href='game.html'">Play Again</button>
        <button class="menu-btn" onclick="location.href='index.html'">Back to Home</button>
    `;
}

// OK button for input mode
okBtn.onclick = () => {
    if (mode === "input") {
        checkAnswer(Number(answerInput.value));
    }
};

// INITIAL SETUP
if (mode === "multiple") {
    inputContainer.style.display = "none";
    multipleContainer.style.display = "block";
} else {
    inputContainer.style.display = "block";
    multipleContainer.style.display = "none";
}

generateQuestion();