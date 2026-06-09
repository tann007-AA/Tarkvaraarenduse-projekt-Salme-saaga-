"use strict";
const playerNameText = document.getElementById("playerNameText");
const modeText = document.getElementById("modeText");
const beginJourneyBtn = document.getElementById("beginJourneyBtn");
const backToMenuBtn = document.getElementById("backToMenuBtn");
const params = new URLSearchParams(window.location.search);
const playerName = params.get("name") ?? "Viking";
const mode = params.get("mode") ?? "singleplayer";
if (playerNameText) {
    playerNameText.textContent = playerName;
}
if (modeText) {
    modeText.textContent = mode === "school" ? "School Mode" : "Singleplayer";
}
beginJourneyBtn?.addEventListener("click", () => {
    window.location.href = "level.html";
});
backToMenuBtn?.addEventListener("click", () => {
    window.location.href = "start.html";
});
