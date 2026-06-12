"use strict";
const playBtn = document.getElementById("playBtn");
const closePlayBtn = document.getElementById("closePlayBtn");
const playDialog = document.getElementById("playDialog");
const singleplayerTab = document.getElementById("singleplayerTab");
const schoolModeTab = document.getElementById("schoolModeTab");
const singleplayerFields = document.getElementById("singleplayerFields");
const schoolModeFields = document.getElementById("schoolModeFields");
const vikingName = document.getElementById("vikingName");
const password = document.getElementById("password");
const roomCode = document.getElementById("roomCode");
const startAdventureBtn = document.getElementById("startAdventureBtn");
const playForm = document.getElementById("playForm");
let currentMode = "singleplayer";
function updateMode(mode) {
    currentMode = mode;
    if (singleplayerTab && schoolModeTab) {
        singleplayerTab.classList.toggle("active", mode === "singleplayer");
        schoolModeTab.classList.toggle("active", mode === "school");
    }
    if (singleplayerFields && schoolModeFields) {
        singleplayerFields.hidden = mode !== "singleplayer";
        schoolModeFields.hidden = mode !== "school";
    }
    updateStartButtonState();
}
function updateStartButtonState() {
    if (!startAdventureBtn || !vikingName)
        return;
    const hasName = vikingName.value.trim().length > 0;
    const hasPassword = password ? password.value.trim().length > 0 : false;
    const hasRoomCode = roomCode ? roomCode.value.trim().length > 0 : false;
    const isValid = currentMode === "singleplayer"
        ? hasName && hasPassword
        : hasName && hasRoomCode;
    startAdventureBtn.classList.toggle("enabled", isValid);
    startAdventureBtn.disabled = !isValid;
}
playBtn?.addEventListener("click", () => {
    playDialog?.showModal();
    updateMode("singleplayer");
});
closePlayBtn?.addEventListener("click", () => {
    playDialog?.close();
});
singleplayerTab?.addEventListener("click", () => {
    updateMode("singleplayer");
});
schoolModeTab?.addEventListener("click", () => {
    updateMode("school");
});
vikingName?.addEventListener("input", updateStartButtonState);
password?.addEventListener("input", updateStartButtonState);
roomCode?.addEventListener("input", updateStartButtonState);
playForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = vikingName?.value.trim() ?? "";
    const enteredPassword = password?.value.trim() ?? "";
    const enteredRoomCode = roomCode?.value.trim() ?? "";
    const valid = currentMode === "singleplayer"
        ? name.length > 0 && enteredPassword.length > 0
        : name.length > 0 && enteredRoomCode.length > 0;
    if (!valid)
        return;
    const params = new URLSearchParams({
        name,
        mode: currentMode
    });
    window.location.href = `intro.html?${params.toString()}`;
});
playDialog?.addEventListener("click", (event) => {
    if (event.target === playDialog) {
        playDialog.close();
    }
});
