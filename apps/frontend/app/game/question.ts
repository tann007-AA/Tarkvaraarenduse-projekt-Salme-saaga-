interface Question {
  question: string;
  answers: string[];
  correct: number;
}

abstract class Item {
  used = false;
  abstract readonly key: string;
  abstract use(game: VikingQuizGame, index?: number): string;
}

class Shield extends Item {
  readonly key = "shield";

  use(game: VikingQuizGame): string {
    if (this.used) return "Shield has already been used.";
    this.used = true;
    game.shieldOn = true;
    return "Shield is active. You get one extra try!";
  }
}

class Sword extends Item {
  readonly key = "sword";

  use(game: VikingQuizGame): string {
    if (this.used) return "Sword has already been used.";
    this.used = true;
    return game.removeWrongAnswers(2);
  }
}

class Spear extends Item {
  readonly key = "spear";

  use(game: VikingQuizGame): string {
    if (this.used) return "Spear has already been used.";
    this.used = true;
    return game.removeWrongAnswers(1);
  }
}

class Gold extends Item {
  readonly key = "gold";

  use(game: VikingQuizGame): string {
    if (this.used) return "Gold has already been used.";
    this.used = true;
    return "Correct answer: " + game.currentQuestion.answers[game.currentQuestion.correct];
  }
}

class Knife extends Item {
  readonly key = "knife";

  use(game: VikingQuizGame, index?: number): string {
    if (this.used && index === undefined) {
      return "Knife has already been used.";
    }

    if (index === undefined) {
      game.knifeMode = true;
      return "Click an answer to remove it.";
    }

    if (index === game.currentQuestion.correct) {
      game.knifeMode = false;
      return "That answer is correct, so you cannot remove it.";
    }

    game.removed.add(index);
    game.knifeMode = false;
    this.used = true;
    return "Removed answer.";
  }
}

class VikingQuizGame {
  questions: Question[];
  currentQuestionIndex = 0;

  removed = new Set<number>();
  shieldOn = false;
  knifeMode = false;
  shieldUsedWrong = false;
  answeredCorrectly = false;

  shield = new Shield();
  sword = new Sword();
  knife = new Knife();
  spear = new Spear();
  gold = new Gold();

  constructor(questions: Question[]) {
    this.questions = questions;
  }

  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  answer(index: number): string {
    if (this.removed.has(index)) {
      return "That answer is removed.";
    }

    if (index === this.currentQuestion.correct) {
      this.answeredCorrectly = true;
      return "Correct!";
    }

    if (this.shieldOn && !this.shieldUsedWrong) {
      this.shieldUsedWrong = true;
      this.shieldOn = false;
      return "Wrong, but shield gives you one extra try!";
    }

    return "Wrong answer.";
  }

  removeWrongAnswers(amount: number): string {
    let wrong: number[] = [];

    for (let i = 0; i < this.currentQuestion.answers.length; i++) {
      if (i !== this.currentQuestion.correct && !this.removed.has(i)) {
        wrong.push(i);
      }
    }

    wrong = wrong.sort(() => Math.random() - 0.5);

    for (let i = 0; i < amount && i < wrong.length; i++) {
      this.removed.add(wrong[i]);
    }

    return "Removed wrong answer(s).";
  }

  nextQuestion(): boolean {
    if (!this.answeredCorrectly) {
      return false;
    }

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.removed.clear();
      this.shieldOn = false;
      this.knifeMode = false;
      this.shieldUsedWrong = false;
      this.answeredCorrectly = false;
      return true;
    }

    return false;
  }
}

const questions: Question[] = [
  {
    question: "Which alphabet did the Vikings use?",
    answers: [
      "Latin alphabet",
      "Greek alphabet",
      "Runes / Younger Futhark",
      "Cyrillic alphabet"
    ],
    correct: 2
  },
  {
    question: "What was the name of Thor's hammer?",
    answers: [
      "Gungnir",
      "Mjolnir",
      "Excalibur",
      "Draupnir"
    ],
    correct: 1
  }
];

const game = new VikingQuizGame(questions);

const questionEl = document.getElementById("question") as HTMLParagraphElement;
const answersDiv = document.getElementById("answers") as HTMLDivElement;
const messageEl = document.getElementById("message") as HTMLParagraphElement;
const inventoryEl = document.getElementById("inventory") as HTMLParagraphElement;

const shieldBtn = document.getElementById("shieldBtn") as HTMLButtonElement;
const swordBtn = document.getElementById("swordBtn") as HTMLButtonElement;
const knifeBtn = document.getElementById("knifeBtn") as HTMLButtonElement;
const spearBtn = document.getElementById("spearBtn") as HTMLButtonElement;
const goldBtn = document.getElementById("goldBtn") as HTMLButtonElement;
const nextBtn = document.getElementById("nextBtn") as HTMLButtonElement;

function updateQuestion(): void {
  questionEl.textContent = game.currentQuestion.question;
}

function updateInventory(): void {
  const available: string[] = [];

  if (!game.shield.used) available.push("Shield");
  if (!game.sword.used) available.push("Sword");
  if (!game.knife.used) available.push("Knife");
  if (!game.spear.used) available.push("Spear");
  if (!game.gold.used) available.push("Gold");

}

function updateItemButtons(): void {
  shieldBtn.disabled = game.shield.used;
  swordBtn.disabled = game.sword.used;
  knifeBtn.disabled = game.knife.used;
  spearBtn.disabled = game.spear.used;
  goldBtn.disabled = game.gold.used;
}

function showAnswers(): void {
  answersDiv.innerHTML = "";

  for (let i = 0; i < game.currentQuestion.answers.length; i++) {
    const btn = document.createElement("button");
    btn.textContent = game.currentQuestion.answers[i];

    if (game.removed.has(i)) {
      btn.disabled = true;
      btn.classList.add("removed");
    }

    if (game.answeredCorrectly) {
      btn.disabled = true;
    }

    btn.addEventListener("click", () => {
      if (game.knifeMode) {
        messageEl.textContent = game.knife.use(game, i);
      } else {
        const result = game.answer(i);

        if (result === "Correct!") {
          if (game.currentQuestionIndex === 0) {
            messageEl.textContent = "Correct! Vikings used runes.";
          } else if (game.currentQuestionIndex === 1) {
            messageEl.textContent = "Correct! Thor's hammer was Mjolnir.";
          } else {
            messageEl.textContent = "Correct!";
          }

          nextBtn.style.display = "inline-block";
        } else {
          messageEl.textContent = result;
        }
      }

      updateItemButtons();
      updateInventory();
      showAnswers();
    });

    answersDiv.appendChild(btn);
  }
}

function goToNextQuestion(): void {
  if (!game.answeredCorrectly) {
    messageEl.textContent = "You can move on only after choosing the correct answer.";
    return;
  }
  const hasNext = game.nextQuestion();
  
  if (hasNext) {
    updateQuestion();
    showAnswers();
    updateItemButtons();
    updateInventory();
    messageEl.textContent = "Next question!";
    nextBtn.style.display = "none";
  } else {
    questionEl.textContent = "You finished the quiz!";
    answersDiv.innerHTML = "";
    messageEl.textContent = "Well done, brave Viking!";
    nextBtn.style.display = "none";
  }
}


shieldBtn.addEventListener("click", () => {
  if (game.answeredCorrectly) return;
  messageEl.textContent = game.shield.use(game);
  updateItemButtons();
  updateInventory();
});

swordBtn.addEventListener("click", () => {
  if (game.answeredCorrectly) return;
  messageEl.textContent = game.sword.use(game);
  updateItemButtons();
  updateInventory();
  showAnswers();
});

knifeBtn.addEventListener("click", () => {
  if (game.answeredCorrectly) return;
  messageEl.textContent = game.knife.use(game);
  updateItemButtons();
  updateInventory();
});

spearBtn.addEventListener("click", () => {
  if (game.answeredCorrectly) return;
  messageEl.textContent = game.spear.use(game);
  updateItemButtons();
  updateInventory();
  showAnswers();
});

goldBtn.addEventListener("click", () => {
  if (game.answeredCorrectly) return;
  messageEl.textContent = game.gold.use(game);
  updateItemButtons();
  updateInventory();
});

nextBtn.addEventListener("click", () => {
  goToNextQuestion();
});

updateQuestion();
showAnswers();
updateItemButtons();
updateInventory();
nextBtn.style.display = "none";