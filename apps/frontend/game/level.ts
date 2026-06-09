const backBtn = document.getElementById("backBtn") as HTMLButtonElement | null;

backBtn?.addEventListener("click", () => {
  window.location.href = "start.html";
});