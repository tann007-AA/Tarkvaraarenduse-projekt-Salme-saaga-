const continueBtn = document.getElementById("continueBtn") as HTMLButtonElement | null;

continueBtn?.addEventListener("click", () => {
  window.location.href = "end_credits.html";
});