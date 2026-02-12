// Load saved progress
let weeklyProgress = JSON.parse(localStorage.getItem("weeklyProgress")) || {
    tasks: [false, false, false, false, false],
    completedCount: 0
};
// ALWAYS recalc completedCount from tasks
weeklyProgress.completedCount = weeklyProgress.tasks.filter(t => t).length;
localStorage.setItem("weeklyProgress", JSON.stringify(weeklyProgress));

// DOM elements
const taskEls = [
    document.getElementById("task1"),
    document.getElementById("task2"),
    document.getElementById("task3"),
    document.getElementById("task4"),
    document.getElementById("task5")
];

const pentagonProgress = document.getElementById("pentagon-progress");
const trophyPopup = document.getElementById("trophy-popup");

// Pentagon points (in order)
const pentagonPoints = [
    [100, 20],
    [180, 75],
    [150, 160],
    [50, 160],
    [20, 75],
    [100, 20] // back to start
];

// Update UI on load
updateTaskList();
updatePentagon();

// Update task list text
function updateTaskList() {
    for (let i = 0; i < 5; i++) {
        if (weeklyProgress.tasks[i]) {
            taskEls[i].innerText = `Task ${i + 1}: ✔ Completed`;
            taskEls[i].style.color = "#00ff7f";
        } else {
            taskEls[i].innerText = `Task ${i + 1}: ❌ Not completed`;
            taskEls[i].style.color = "#ff4444";
        }
    }
}

// Draw pentagon progress line
function updatePentagon() {
    let completed = weeklyProgress.completedCount;

    if (completed === 0) {
        pentagonProgress.setAttribute("points", "");
        return;
    }

    let points = "";
    for (let i = 0; i <= completed; i++) {
        points += pentagonPoints[i][0] + "," + pentagonPoints[i][1] + " ";
    }

    pentagonProgress.setAttribute("points", points.trim());

    if (completed === 5) {
        showTrophy();
    }
}

// Show trophy popup
function showTrophy() {
    trophyPopup.classList.remove("hidden");

    // Confetti effect
    for (let i = 0; i < 50; i++) {
        createConfetti();
    }
}

// Simple confetti animation
function createConfetti() {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    document.body.appendChild(confetti);

    const size = Math.random() * 8 + 4;
    confetti.style.width = size + "px";
    confetti.style.height = size + "px";

    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.backgroundColor =
        ["#ff00cc", "#00ff7f", "#ffd700", "#6a00ff"][Math.floor(Math.random() * 4)];

    confetti.style.animationDuration = (Math.random() * 2 + 2) + "s";

    setTimeout(() => confetti.remove(), 4000);
}

// Start today's challenge
function startWeeklyTask() {
    let nextTaskIndex = weeklyProgress.tasks.indexOf(false);

    if (nextTaskIndex === -1) {
        alert("You already completed all 5 tasks this week!");
        return;
    }

    const diff = document.getElementById("weekly-difficulty").value;
    const op = document.getElementById("weekly-operation").value;

    // Save which task is being played
    localStorage.setItem("currentWeeklyTask", nextTaskIndex);

    // Start the challenge (always mixed mode: input + multiple)
    location.href = `play.html?mode=multiple&op=${op}&diff=${diff}&weekly=1`;
}

// When returning from play.html, mark task as completed
window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("weeklyComplete") === "1") {
        const taskIndex = Number(localStorage.getItem("currentWeeklyTask"));

        if (!weeklyProgress.tasks[taskIndex]) {
            weeklyProgress.tasks[taskIndex] = true;
            weeklyProgress.completedCount++;
            localStorage.setItem("weeklyProgress", JSON.stringify(weeklyProgress));
        }

        updateTaskList();
        updatePentagon();
    }
});
