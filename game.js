const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get("mode");
const op = urlParams.get("op");
const diff = urlParams.get("diff");

const questionEl = document.getElementById("question");
const counterEl = document.getElementById("counter");

const inputContainer = document.getElementById("input-container");
const multipleContainer = document.getElementById("multiple-container");

const answerInput = document.getElementById("answer-input");
const choiceButtons = document.querySelectorAll(".choice-btn");

const okBtn = document.getElementById("ok-btn");

let currentQuestion = 0;
let correctAnswer = 0;

const ranges = {
    easy: 100,
    medium: 500,
    hard: 2000
};

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
    currentQuestion++;

    if (currentQuestion > 20) {
        showEndScreen();
        return;
    }

    counterEl.innerText = `Question ${currentQuestion} / 20`;

    let a, b, product;

    switch (op) {
        case "addition":
            a = rand(10, ranges[diff]);
            b = rand(10, ranges[diff]);
            correctAnswer = a + b;
            questionEl.innerText = `${a} + ${b} = ?`;
            break;

        case "subtraction":
            a = rand(10, ranges[diff]);
            b = rand(10, a);
            correctAnswer = a - b;
            questionEl.innerText = `${a} - ${b} = ?`;
            break;

        case "multiplication":
            a = rand(1, 12);
            b = rand(1, 12);
            correctAnswer = a * b;
            questionEl.innerText = `${a} × ${b} = ?`;
            break;

        case "division":
            b = rand(1, 12);
            correctAnswer = rand(1, 12);
            product = correctAnswer * b;
            questionEl.innerText = `${product} ÷ ${b} = ?`;
            break;

        case "mixed":
            const ops = ["+", "-", "×", "÷"];
            const pick = ops[Math.floor(Math.random() * ops.length)];

            if (pick === "+") {
                a = rand(10, ranges[diff]);
                b = rand(10, ranges[diff]);
                correctAnswer = a + b;
                questionEl.innerText = `${a} + ${b} = ?`;
            }

            if (pick === "-") {
                a = rand(10, ranges[diff]);
                b = rand(10, a);
                correctAnswer = a - b;
                questionEl.innerText = `${a} - ${b} = ?`;
            }

            if (pick === "×") {
                a = rand(1, 12);
                b = rand(1, 12);
                correctAnswer = a * b;
                questionEl.innerText = `${a} × ${b} = ?`;
            }

            if (pick === "÷") {
                b = rand(1, 12);
                correctAnswer = rand(1, 12);
                product = correctAnswer * b;
                questionEl.innerText = `${product} ÷ ${b} = ?`;
            }
            break;
    }

    if (mode === "multiple") setupMultipleChoice();
}

function setupMultipleChoice() {
    let answers = [correctAnswer];

    while (answers.length < 3) {
        let offset = rand(5, 30);
        let wrong = Math.random() < 0.5
            ? correctAnswer - offset
            : correctAnswer + offset;

        if (wrong > 0 && !answers.includes(wrong)) {
            answers.push(wrong);
        }
    }

    answers.sort(() => Math.random() - 0.5);

    choiceButtons.forEach((btn, i) => {
        btn.innerText = answers[i];
        btn.onclick = () => checkAnswer(answers[i]);
    });
}

function checkAnswer(value) {
    if (mode === "input") {
        value = Number(answerInput.value);
    }

    answerInput.value = "";
    generateQuestion();
}

function showEndScreen() {
    document.querySelector(".game-container").innerHTML = `
        <h2>🎉 Kész vagy!</h2>
        <p>Megcsináltad a 20 kérdést!</p>
        <button class="menu-btn" onclick="location.href='game.html'">Új játék</button>
        <button class="menu-btn" onclick="location.href='index.html'">Főmenü</button>
    `;
}

okBtn.onclick = () => {
    if (mode === "input") {
        checkAnswer(Number(answerInput.value));
    }
};

if (mode === "multiple") {
    inputContainer.style.display = "none";
    multipleContainer.style.display = "block";
} else {
    inputContainer.style.display = "block";
    multipleContainer.style.display = "none";
}

generateQuestion();
