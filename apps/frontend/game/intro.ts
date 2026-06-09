const playerNameText = document.getElementById("playerNameText") as HTMLSpanElement | null;
const modeText = document.getElementById("modeText") as HTMLSpanElement | null;
const beginJourneyBtn = document.getElementById("beginJourneyBtn") as HTMLButtonElement | null;
const backToMenuBtn = document.getElementById("backToMenuBtn") as HTMLButtonElement | null;

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