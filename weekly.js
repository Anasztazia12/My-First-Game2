// Load saved weekly progress
let weeklyProgress = JSON.parse(localStorage.getItem("weeklyProgress")) || {
    completed: 0
};

// DOM elements
const progressText = document.getElementById("weekly-progress");
const pentagonProgress = document.getElementById("pentagon-progress");
const trophyPopup = document.getElementById("trophy-popup");

// Pentagon points (5 points + back to start)
const pentagonPoints = [
    [100, 20],
    [180, 75],
    [150, 160],
    [50, 160],
    [20, 75],
    [100, 20]
];

// Update weekly UI
function updateProgressUI() {
    const completed = weeklyProgress.completed;

    // Update progress text
    progressText.innerText = `Weekly progress: ${completed}/5`;

    // Update pentagon progress line
    if (completed === 0) {
        pentagonProgress.setAttribute("points", "");
    } else {
        let points = "";
        for (let i = 0; i <= completed; i++) {
            points += `${pentagonPoints[i][0]},${pentagonPoints[i][1]} `;
        }
        pentagonProgress.setAttribute("points", points.trim());
    }

    // Show trophy if all 5 tasks done
    if (completed >= 5) {
        showTrophy();
    }
}

// Show trophy + confetti animation
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

    // Mark that user is doing a weekly task
    localStorage.setItem("doingWeekly", "1");

    // Redirect to play.html with parameters
    location.href = `play.html?mode=${mode}&op=${op}&diff=${diff}&weekly=1`;
}

// Handle return from play.html after completing weekly task
window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("weeklyComplete") === "1") {
        if (localStorage.getItem("doingWeekly") === "1") {
            // Increase progress if less than 5
            if (weeklyProgress.completed < 5) {
                weeklyProgress.completed++;
            }

            // Save updated progress
            localStorage.setItem("weeklyProgress", JSON.stringify(weeklyProgress));
            localStorage.removeItem("doingWeekly");

            // Update UI
            updateProgressUI();
        }
    }
});

// INITIAL UI update
updateProgressUI();