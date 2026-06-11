const backBtn = document.getElementById("backBtn") as HTMLButtonElement | null;

backBtn?.addEventListener("click", () => {
  window.location.href = "start.html";
});

const islandButtons = document.querySelectorAll<HTMLButtonElement>(".progress-step");

islandButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetPage = button.dataset.page;
    if (targetPage) {
      window.location.href = targetPage;
    }
  });
});

const markers = document.querySelectorAll<HTMLButtonElement>(".question-marker");
const levelScreen = document.querySelector<HTMLElement>(".level-screen");
const nextPage = levelScreen?.dataset.next ?? "gotland.html";

let currentMarkerIndex = 0;

if (markers.length > 0) {
  markers[0].classList.add("active");
}

markers.forEach((marker, index) => {
  marker.addEventListener("click", () => {
    if (index !== currentMarkerIndex) return;

    marker.classList.remove("active");
    currentMarkerIndex++;

    if (currentMarkerIndex < markers.length) {
      markers[currentMarkerIndex].classList.add("active");
    } else {
      window.location.href = nextPage;
    }
  });
});
/* UUE INTERAKTIIVSE LOOSÜSTEEMI ALGUS */

const draggableItems = document.querySelectorAll<HTMLElement>(".inventory-item");
const pot = document.getElementById("pot") as HTMLDivElement | null;
const dialogueText = document.getElementById("dialogueText") as HTMLParagraphElement | null;
const potStatus = document.getElementById("potStatus") as HTMLParagraphElement | null;
const potItemsList = document.getElementById("potItemsList") as HTMLUListElement | null;

const addedItems: string[] = [];
let foodCount = 0;

draggableItems.forEach((item) => {
  item.addEventListener("dragstart", (event) => {
    event.dataTransfer?.setData("text/plain", item.dataset.item || "");
    event.dataTransfer?.setData("item-type", item.dataset.type || "");
  });
});

pot?.addEventListener("dragover", (event) => {
  event.preventDefault();
  pot.classList.add("pot-hover");
});

pot?.addEventListener("dragleave", () => {
  pot.classList.remove("pot-hover");
});

pot?.addEventListener("drop", (event) => {
  event.preventDefault();
  pot.classList.remove("pot-hover");

  const itemName = event.dataTransfer?.getData("text/plain") || "";
  const itemType = event.dataTransfer?.getData("item-type") || "";

  if (!itemName || addedItems.includes(itemName)) {
    return;
  }

  addedItems.push(itemName);

  const listItem = document.createElement("li");
  listItem.textContent = itemName;
  potItemsList?.appendChild(listItem);

  if (itemType === "food") {
    foodCount++;

    if (dialogueText) {
      dialogueText.textContent = `${itemName} läks potti. Supp muutub tugevamaks.`;
    }

    if (potStatus) {
      if (foodCount === 1) {
        potStatus.textContent = "Supp kogub jõudu, aga vajab veel midagi rammusat.";
      } else if (foodCount === 2) {
        potStatus.textContent = "Nüüd on pada juba päris korralik.";
      } else {
        potStatus.textContent = "Supp on tugev ja vennad on homseks merereisiks peaaegu valmis.";
      }
    }
  }

  if (itemType === "wrong") {
    if (dialogueText) {
      if (itemName === "Nooleots") {
        dialogueText.textContent =
          'Ivar: "Björn, ma ütlesin, et meil on vaja rauda kõhtu, aga mitte päris nii otseselt! Hoia see nool parem vaenlase jaoks."';
      } else {
        dialogueText.textContent =
          'Gunnar turtsatab: "See asi ei käi patta. Proovi midagi söödavat."';
      }
    }

    if (potStatus) {
      potStatus.textContent = "See asi ei tee supile head. Proovi midagi söödavat.";
    }
  }
});

/* UUE INTERAKTIIVSE LOOSÜSTEEMI LÕPP */


/* BJÖRNI LIIKUMISE ALGUS */

const bjorn = document.getElementById("bjorn") as HTMLDivElement | null;
const sceneMap = document.querySelector(".scene-map") as HTMLDivElement | null;

if (bjorn && sceneMap) {
  let x = 12;
  let y = 68;
  const step = 2;

  const updateBjorn = () => {
    bjorn.style.left = `${x}%`;
    bjorn.style.top = `${y}%`;
  };

  updateBjorn();

  window.addEventListener("keydown", (event) => {
    const key = event.key;

    if (key === "ArrowUp") {
      y = Math.max(10, y - step);
    }

    if (key === "ArrowDown") {
      y = Math.min(85, y + step);
    }

    if (key === "ArrowLeft") {
      x = Math.max(5, x - step);
    }

    if (key === "ArrowRight") {
      x = Math.min(90, x + step);
    }

    if (
      key === "ArrowUp" ||
      key === "ArrowDown" ||
      key === "ArrowLeft" ||
      key === "ArrowRight"
    ) {
      event.preventDefault();
      bjorn.classList.add("moving");
      updateBjorn();

      window.setTimeout(() => {
        bjorn.classList.remove("moving");
      }, 120);
    }
  });
}

/* BJÖRNI LIIKUMISE LÕPP */