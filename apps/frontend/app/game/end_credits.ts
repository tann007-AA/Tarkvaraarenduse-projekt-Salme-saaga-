const skipCreditsBtn = document.getElementById("skipCreditsBtn") as HTMLButtonElement | null;
const crawl = document.querySelector(".crawl") as HTMLDivElement | null;

function goToStart(): void {
  window.location.href = "start.html";
}

skipCreditsBtn?.addEventListener("click", goToStart);
crawl?.addEventListener("animationend", goToStart);