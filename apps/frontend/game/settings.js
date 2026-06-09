"use strict";
const settingsBtn = document.getElementById("settingsBtn");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const settingsDialog = document.getElementById("settingsDialog");
settingsBtn?.addEventListener("click", () => {
    settingsDialog?.showModal();
});
closeSettingsBtn?.addEventListener("click", () => {
    settingsDialog?.close();
});
settingsDialog?.addEventListener("click", (event) => {
    const rect = settingsDialog.getBoundingClientRect();
    const clickedInside = event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
    if (!clickedInside) {
        settingsDialog.close();
    }
});
