"use strict";
const guideBtn = document.getElementById("guideBtn");
const closeGuideBtn = document.getElementById("closeGuideBtn");
const readyBtn = document.getElementById("readyBtn");
const guideDialog = document.getElementById("guideDialog");
guideBtn?.addEventListener("click", () => {
    guideDialog?.showModal();
});
closeGuideBtn?.addEventListener("click", () => {
    guideDialog?.close();
});
readyBtn?.addEventListener("click", () => {
    guideDialog?.close();
});
guideDialog?.addEventListener("click", (event) => {
    if (event.target === guideDialog) {
        guideDialog.close();
    }
});
