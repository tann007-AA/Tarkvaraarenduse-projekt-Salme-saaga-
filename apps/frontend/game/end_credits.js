"use strict";
const skipCreditsBtn = document.getElementById("skipCreditsBtn");
const crawl = document.querySelector(".crawl");
function goToStart() {
    window.location.href = "start.html";
}
skipCreditsBtn?.addEventListener("click", goToStart);
crawl?.addEventListener("animationend", goToStart);
