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


/*Charater movement*/

const character = document.getElementById("character") as HTMLImageElement | null;

if (character) {
  type Direction = "front" | "back" | "left" | "right";

  type Zone = {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };

  let x = 20;
  let y = 60;

  let currentDirection: Direction = "front";
  let currentFrame = 0;
  let isMoving = false;

  const speed = 0.036;
  const frameDuration = 140;

  const keys = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  const sprites = {
    front: [
      "./character/Front_01.png",
      "./character/Front_02.png",
      "./character/Front_03.png",
    ],
    back: [
      "./character/Back_01.png",
      "./character/Back_02.png",
      "./character/Back_03.png",
    ],
    left: [
      "./character/Left_01.png",
      "./character/Left_02.png",
      "./character/Left_03.png",
    ],
    right: [
      "./character/Right_01.png",
      "./character/Right_02.png",
      "./character/Right_03.png",
    ],
  };

  const getIslandName = (): "rootsi" | "gotland" | "saaremaa" => {
    const file = window.location.pathname.toLowerCase();

    if (file.includes("rootsi")) return "rootsi";
    if (file.includes("gotland")) return "gotland";
    if (file.includes("saaremaa")) return "saaremaa";

    return "rootsi";
  };

  const currentIsland = getIslandName();

  const startPositions = {
    rootsi: { x: 74, y: 70 },
    gotland: { x: 48, y: 90 },
    saaremaa: { x: 50, y: 82 },
  };

  x = startPositions[currentIsland].x;
  y = startPositions[currentIsland].y;

  const walkableZonesByIsland: Record<"rootsi" | "gotland" | "saaremaa", Zone[]> = {
    rootsi: [
      { minX: 15, maxX: 78, minY: 27, maxY: 98 },
      { minX: 15, maxX: 18, minY: 12, maxY: 29 },
      { minX: 24, maxX: 88, minY: 12, maxY: 29 },
      { minX: 78, maxX: 88, minY: 8, maxY: 45 },
      { minX: 85, maxX: 95, minY: 28, maxY: 45 },
    ],

    gotland: [
      { minX: 36, maxX: 63, minY: 9, maxY: 98 },
      { minX: 30, maxX: 63, minY: 28, maxY: 45 },
      { minX: 39, maxX: 77, minY: 56, maxY: 74 },
      { minX: 43, maxX: 58, minY: 74, maxY: 98 },
      { minX: 45, maxX: 76, minY: 9, maxY: 23 },
    ],

    saaremaa: [
      { minX: 18, maxX: 88, minY: 18, maxY: 70 },
      { minX: 24, maxX: 36, minY: 70, maxY: 99 },
      { minX: 70, maxX: 89, minY: 20, maxY: 46 },
      { minX: 12, maxX: 26, minY: 28, maxY: 55 },
      { minX: 58, maxX: 84, minY: 70, maxY: 83 },
    ],
  };

  const currentZones = walkableZonesByIsland[currentIsland];

  const isWalkable = (testX: number, testY: number): boolean => {
    return currentZones.some((zone) => {
      return (
        testX >= zone.minX &&
        testX <= zone.maxX &&
        testY >= zone.minY &&
        testY <= zone.maxY
      );
    });
  };

  const renderCharacter = () => {
    character.style.left = `${x}%`;
    character.style.top = `${y}%`;
    character.src = sprites[currentDirection][currentFrame];
  };

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      keys.up = true;
      event.preventDefault();
    }
    if (event.key === "ArrowDown") {
      keys.down = true;
      event.preventDefault();
    }
    if (event.key === "ArrowLeft") {
      keys.left = true;
      event.preventDefault();
    }
    if (event.key === "ArrowRight") {
      keys.right = true;
      event.preventDefault();
    }
  });

  window.addEventListener("keyup", (event) => {
    if (event.key === "ArrowUp") keys.up = false;
    if (event.key === "ArrowDown") keys.down = false;
    if (event.key === "ArrowLeft") keys.left = false;
    if (event.key === "ArrowRight") keys.right = false;
  });

  let lastTime = 0;
  let lastFrameChange = 0;

  const gameLoop = (timestamp: number) => {
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    let nextX = x;
    let nextY = y;
    isMoving = false;

    if (keys.up) {
      nextY -= speed * delta;
      currentDirection = "back";
      isMoving = true;
    }

    if (keys.down) {
      nextY += speed * delta;
      currentDirection = "front";
      isMoving = true;
    }

    if (keys.left) {
      nextX -= speed * delta;
      currentDirection = "left";
      isMoving = true;
    }

    if (keys.right) {
      nextX += speed * delta;
      currentDirection = "right";
      isMoving = true;
    }

    if (isWalkable(nextX, y)) {
      x = nextX;
    }

    if (isWalkable(x, nextY)) {
      y = nextY;
    }

    if (isMoving) {
      if (timestamp - lastFrameChange > frameDuration) {
        currentFrame = (currentFrame + 1) % 3;
        lastFrameChange = timestamp;
      }
    } else {
      currentFrame = 0;
    }

    renderCharacter();
    requestAnimationFrame(gameLoop);
  };

  renderCharacter();
  requestAnimationFrame(gameLoop);
}
/*Movement end */