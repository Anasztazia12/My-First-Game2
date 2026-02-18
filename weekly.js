// Load saved weekly progress
let weeklyProgress = JSON.parse(localStorage.getItem("weeklyProgress")) || { completed: 0 };

// DOM
const progressText = document.getElementById("weekly-progress");
const pentagonProgress = document.getElementById("pentagon-progress");
const trophyPopup = document.getElementById("trophy-popup");

// Pentagon points
const pentagonPoints = [
    [100, 20],
    [180, 75],
    [150, 160],
    [50, 160],
    [20, 75],
    [100, 20]
];

// Update UI: csak a heti progress, trophy külön
function updateProgressUI() {
    const completed = weeklyProgress.completed;
    
    // Heti progress szöveg
    if(progressText) progressText.innerText = `Heti haladás: ${completed}/5`;
    
    // Pentagon csík
    if(pentagonProgress) {
        let points = "";
        for (let i = 0; i <= completed; i++) {
            points += `${pentagonPoints[i][0]},${pentagonPoints[i][1]} `;
        }
        pentagonProgress.setAttribute("points", points.trim());
    }

    // Trophy csak ha completed = 5
    if(completed === 5) {
        showTrophy();
    } else {
        if(trophyPopup) trophyPopup.classList.add("hidden");
    }
}

// Show trophy
function showTrophy() {
    if(trophyPopup) trophyPopup.classList.remove("hidden");
    for (let i = 0; i < 50; i++) createConfetti();
}

// Confetti
function createConfetti() {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    document.body.appendChild(confetti);
    const size = Math.random()*8 + 4;
    confetti.style.width = size + "px";
    confetti.style.height = size + "px";
    confetti.style.left = Math.random()*window.innerWidth + "px";
    confetti.style.backgroundColor = ["#ff00cc","#00ff7f","#ffd700","#6a00ff"][Math.floor(Math.random()*4)];
    confetti.style.animationDuration = (Math.random()*2+2)+"s";
    setTimeout(()=>confetti.remove(),4000);
}

// Start daily challenge
function startWeeklyTask() {
    if(weeklyProgress.completed >= 5){
        alert("You already completed all 5 tasks this week!");
        return;
    }

    const mode = document.getElementById("weekly-mode").value;
    const diff = document.getElementById("weekly-difficulty").value;
    const op = document.getElementById("weekly-operation").value;

    localStorage.setItem("doingWeekly","1");
    location.href = `play.html?mode=${mode}&op=${op}&diff=${diff}&weekly=1`;
}

// Handle return from play.html (update progress azonnal)
window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);

    if(urlParams.get("weeklyComplete")==="1" && localStorage.getItem("doingWeekly")==="1"){
        if(weeklyProgress.completed < 5) weeklyProgress.completed++;
        localStorage.setItem("weeklyProgress", JSON.stringify(weeklyProgress));
        localStorage.removeItem("doingWeekly");
        updateProgressUI(); // itt frissül azonnal
    } else {
        updateProgressUI(); // betöltéskor is mutassa az aktuális progress
    }
});

// INITIAL
updateProgressUI();