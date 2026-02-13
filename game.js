const inputContainer = document.getElementById("input-container");
const multipleContainer = document.getElementById("multiple-container");
//Switch UI based on mode
if (mode === "multiple") {
    inputContainer.style.display = "none";
    multipleContainer.style.display = "block";
} else {
    inputContainer.style.display = "block";
    multipleContainer.style.display = "none";
}

// Read URL parameters
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get("mode");      // input or multiple
const operation = urlParams.get("op");   // addition, subtraction, etc.
const difficulty = urlParams.get("diff"); // easy, medium, hard

// DOM elements
const questionEl = document.getElementById("question");
const counterEl = document.getElementById("counter");
const resultEl = document.getElementById("result");
const answerInput = document.getElementById("answer-input");
const choicesDiv = document.getElementById("choices");
const choice1 = document.getElementById("choice1");
const choice2 = document.getElementById("choice2");
const choice3 = document.getElementById("choice3");
const submitBtn = document.getElementById("submit-btn");
const endScreen = document.getElementById("end-screen");
const finalScoreEl = document.getElementById("final-score");

// Sounds
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

let currentQuestion = 1;
let score = 0;
let correctAnswer = 0;

// Difficulty ranges
function getMaxNumber() {
    if (difficulty === "easy") return 20;
    if (difficulty === "medium") return 60;
    return 150; // hard
}

// Generate numbers based on difficulty
function generateNumbers() {
    const max = getMaxNumber();
    const num1 = Math.floor(Math.random() * max) + 1;
    const num2 = Math.floor(Math.random() * max) + 1;
    return [num1, num2];
}

// Generate a question
function generateQuestion() {
    resultEl.innerText = "";
    answerInput.value = "";

    counterEl.innerText = `Question ${currentQuestion} / 20`;

    let num1, num2;
    [num1, num2] = generateNumbers();

    let opSymbol = "+";

    if (operation === "addition") {
        correctAnswer = num1 + num2;
        opSymbol = "+";
    }
    else if (operation === "subtraction") {
        const a = Math.max(num1, num2);
        const b = Math.min(num1, num2);
        correctAnswer = a - b;
        num1 = a;
        num2 = b;
        opSymbol = "-";
    }
    else if (operation === "multiplication") {
        correctAnswer = num1 * num2;
        opSymbol = "×";
    }
    else if (operation === "division") {
        num2 = Math.floor(Math.random() * 12) + 1;
        const multiplier = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * multiplier;
        correctAnswer = num1 / num2;
        opSymbol = "÷";
    }
    else if (operation === "mixed") {
        const ops = ["+", "-", "×", "÷"];
        opSymbol = ops[Math.floor(Math.random() * ops.length)];

        if (opSymbol === "+") correctAnswer = num1 + num2;
        if (opSymbol === "-") {
            const a = Math.max(num1, num2);
            const b = Math.min(num1, num2);
            correctAnswer = a - b;
            num1 = a;
            num2 = b;
        }
        if (opSymbol === "×") correctAnswer = num1 * num2;
        if (opSymbol === "÷") {
            num2 = Math.floor(Math.random() * 12) + 1;
            const multiplier = Math.floor(Math.random() * 12) + 1;
            num1 = num2 * multiplier;
            correctAnswer = num1 / num2;
        }
    }

    questionEl.innerText = `${num1} ${opSymbol} ${num2} = ?`;

    if (mode === "multiple") {
        setupMultipleChoice();
    }
}

// Multiple choice setup
function setupMultipleChoice() {
    answerInput.classList.add("hidden");
    choicesDiv.classList.remove("hidden");
    submitBtn.classList.add("hidden");

    const wrong1 = correctAnswer + (Math.floor(Math.random() * 5) + 1);
    const wrong2 = correctAnswer - (Math.floor(Math.random() * 5) + 1);

    let answers = [correctAnswer, wrong1, wrong2];

    answers.sort(() => Math.random() - 0.5);

    choice1.innerText = answers[0];
    choice2.innerText = answers[1];
    choice3.innerText = answers[2];
}

// Check input mode answer
function checkInputAnswer() {
    const userAnswer = Number(answerInput.value);
    if (answerInput.value === "") return;

    if (userAnswer === correctAnswer) {
        score++;
        resultEl.innerText = "Correct!";
        resultEl.style.color = "#00ff7f";
        correctSound.play();
    } else {
        resultEl.innerText = `Wrong! Correct answer: ${correctAnswer}`;
        resultEl.style.color = "#ff4444";
        wrongSound.play();
    }

    nextQuestion();
}

// Check multiple choice answer
function checkChoiceAnswer(value) {
    if (Number(value) === correctAnswer) {
        score++;
        resultEl.innerText = "Correct!";
        resultEl.style.color = "#00ff7f";
        correctSound.play();
    } else {
        resultEl.innerText = `Wrong! Correct answer: ${correctAnswer}`;
        resultEl.style.color = "#ff4444";
        wrongSound.play();
    }

    nextQuestion();
}

// Move to next question
function nextQuestion() {
    currentQuestion++;

    if (currentQuestion > 20) {
        endGame();
    } else {
        setTimeout(generateQuestion, 700);
    }
}

// End game
function endGame() {
    questionEl.classList.add("hidden");
    answerInput.classList.add("hidden");
    choicesDiv.classList.add("hidden");
    submitBtn.classList.add("hidden");
    counterEl.classList.add("hidden");
    resultEl.classList.add("hidden");

    endScreen.classList.remove("hidden");
    finalScoreEl.innerText = `You scored ${score} out of 20!`;

    // If this game was started from Weekly Challenge
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("weekly") === "1") {
        setTimeout(() => {
            location.href = "weekly.html?weeklyComplete=1";
        }, 2000);
    }
}

// Event listeners
submitBtn.addEventListener("click", checkInputAnswer);

answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkInputAnswer();
});

choice1.addEventListener("click", () => checkChoiceAnswer(choice1.innerText));
choice2.addEventListener("click", () => checkChoiceAnswer(choice2.innerText));
choice3.addEventListener("click", () => checkChoiceAnswer(choice3.innerText));

// Start game
generateQuestion();
