// Load saved weekly progress
let weeklyProgress = JSON.parse(localStorage.getItem("weeklyProgress")) || {
    completed: 0   // 0–5
};

// DOM elements
const progressText = document.getElementById("weekly-progress");
const pentagonProgress = document.getElementById("pentagon-progress");
const trophyPopup = document.getElementById("trophy-popup");

// Pentagon points (5 sides)
const pentagonPoints = [
    [100, 20],
    [180, 75],
    [150, 160],
    [50, 160],
    [20, 75],
    [100, 20] // close shape
];

// Update UI on load
updateProgressUI();

// Update progress text + pentagon + trophy
function updateProgressUI() {
    const completed = weeklyProgress.completed;

    // Update text
    progressText.innerText = `Weekly progress: ${completed}/5`;

    // Draw pentagon progress
    if (completed === 0) {
        pentagonProgress.setAttribute("points", "");
    } else {
        let points = "";
        for (let i = 0; i <= completed; i++) {
            points += `${pentagonPoints[i][0]},${pentagonPoints[i][1]} `;
        }
        pentagonProgress.setAttribute("points", points.trim());
    }

    // Show trophy only when fully completed
    if (completed === 5) {
        showTrophy();
    }
}

// Show trophy + confetti
function showTrophy() {
    trophyPopup.classList.remove("hidden");

    for (let i = 0; i < 50; i++) {
        createConfetti();
    }
}

// Confetti animation
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
    if (weeklyProgress.completed >= 5) {
        alert("You already completed all 5 tasks this week!");
        return;
    }

    const mode = document.getElementById("weekly-mode").value;
    const diff = document.getElementById("weekly-difficulty").value;
    const op = document.getElementById("weekly-operation").value;

    // Save that we are doing a weekly task
    localStorage.setItem("doingWeekly", "1");

    // Start game
    location.href = `play.html?mode=${mode}&op=${op}&diff=${diff}&weekly=1`;
}

// When returning from play.html
window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("weeklyComplete") === "1") {
        if (localStorage.getItem("doingWeekly") === "1") {

            // Add 1 progress
            if (weeklyProgress.completed < 5) {
                weeklyProgress.completed++;
            }

            // Save
            localStorage.setItem("weeklyProgress", JSON.stringify(weeklyProgress));
            localStorage.removeItem("doingWeekly");

            // Update UI
            updateProgressUI();
        }
    }
});