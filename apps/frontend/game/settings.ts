const settingsBtn = document.getElementById("settingsBtn") as HTMLButtonElement | null;
const closeSettingsBtn = document.getElementById("closeSettingsBtn") as HTMLButtonElement | null;
const settingsDialog = document.getElementById("settingsDialog") as HTMLDialogElement | null;

settingsBtn?.addEventListener("click", () => {
  settingsDialog?.showModal();
});

closeSettingsBtn?.addEventListener("click", () => {
  settingsDialog?.close();
});

settingsDialog?.addEventListener("click", (event: MouseEvent) => {
  const rect = settingsDialog.getBoundingClientRect();
  const clickedInside =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;

  if (!clickedInside) {
    settingsDialog.close();
  }
});