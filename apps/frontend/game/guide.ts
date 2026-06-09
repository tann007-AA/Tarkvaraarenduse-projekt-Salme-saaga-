const guideBtn = document.getElementById("guideBtn") as HTMLButtonElement | null;
const closeGuideBtn = document.getElementById("closeGuideBtn") as HTMLButtonElement | null;
const readyBtn = document.getElementById("readyBtn") as HTMLButtonElement | null;
const guideDialog = document.getElementById("guideDialog") as HTMLDialogElement | null;

guideBtn?.addEventListener("click", () => {
  guideDialog?.showModal();
});

closeGuideBtn?.addEventListener("click", () => {
  guideDialog?.close();
});

readyBtn?.addEventListener("click", () => {
  guideDialog?.close();
});

guideDialog?.addEventListener("click", (event: MouseEvent) => {
  if (event.target === guideDialog) {
    guideDialog.close();
  }
});