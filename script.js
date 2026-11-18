const passages = [
    "Good ideas become useful when we turn them into small, thoughtful actions. Stay curious, keep learning, and make progress one keystroke at a time.",
    "A calm mind and steady practice can make difficult things feel easier. Focus on accuracy first, and speed will grow with every attempt.",
    "Technology is at its best when it helps people solve real problems. Build with care, communicate clearly, and keep improving your work.",
    "Every expert was once a beginner. Take your time, find your rhythm, and remember that a little practice today can make tomorrow easier."
  ];
  
  const passageElement = document.querySelector("#passage");
  const inputElement = document.querySelector("#typing-input");
  const timeElement = document.querySelector("#time");
  const wpmElement = document.querySelector("#wpm");
  const accuracyElement = document.querySelector("#accuracy");
  const resultElement = document.querySelector("#result");
  const restartButton = document.querySelector("#restart-button");
  const durationButtons = document.querySelectorAll(".duration-button");
  
  let passage = "";
  let duration = 15;
  let timeLeft = duration;
  let startedAt = null;
  let timerId = null;
  let finished = false;
  
  function choosePassage() {
    const availablePassages = passages.filter((item) => item !== passage);
    passage = availablePassages[
      Math.floor(Math.random() * availablePassages.length)
    ];
  }
  
  function renderPassage() {
    const typed = inputElement.value;
  
    passageElement.innerHTML = [...passage]
      .map((character, index) => {
        let className = "";
  
        if (index < typed.length) {
          className = typed[index] === character ? "correct" : "incorrect";
        } else if (index === typed.length) {
          className = "current";
        }
  
        const safeCharacter = character === " " ? "&nbsp;" : escapeHtml(character);
        return `<span class="${className}">${safeCharacter}</span>`;
      })
      .join("");
  }
  
  function escapeHtml(character) {
    const characters = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
  
    return characters[character] || character;
  }
  
  function getCorrectCharacters(typed) {
    let correct = 0;
  
    for (let index = 0; index < typed.length; index++) {
      if (typed[index] === passage[index]) {
        correct++;
      }
    }
  
    return correct;
  }
  
  function updateStats() {
    const typed = inputElement.value;
    const correct = getCorrectCharacters(typed);
    const accuracy = typed.length
      ? Math.round((correct / typed.length) * 100)
      : 100;
  
    const elapsedSeconds = startedAt
      ? Math.max((Date.now() - startedAt) / 1000, 1)
      : 0;
  
    // Standard WPM calculation: five correctly typed characters = one word.
    const wpm = elapsedSeconds
      ? Math.round((correct / 5) / (elapsedSeconds / 60))
      : 0;
  
    timeElement.textContent = timeLeft;
    wpmElement.textContent = wpm;
    accuracyElement.textContent = accuracy;
  }
  
  function startTimer() {
    if (startedAt !== null || finished) return;
  
    startedAt = Date.now();
  
    timerId = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      timeLeft = Math.max(duration - elapsed, 0);
  
      updateStats();
  
      if (timeLeft <= 0) {
        endTest("Time’s up! Press Restart to try again.");
      }
    }, 200);
  }
  
  function endTest(message) {
    if (finished) return;
  
    finished = true;
    window.clearInterval(timerId);
    inputElement.disabled = true;
    resultElement.textContent = message;
    updateStats();
  }
  
  function resetTest(focusInput = true) {
    window.clearInterval(timerId);
    choosePassage();
  
    timeLeft = duration;
    startedAt = null;
    timerId = null;
    finished = false;
  
    inputElement.value = "";
    inputElement.disabled = false;
    resultElement.textContent = "";
  
    renderPassage();
    updateStats();
  
    if (focusInput) {
      inputElement.focus();
    }
  }
  
  inputElement.addEventListener("input", () => {
    if (finished) return;
  
    if (inputElement.value.length > 0) {
      startTimer();
    }
  
    renderPassage();
    updateStats();
  
    if (inputElement.value.length >= passage.length) {
      endTest("Passage complete! Nice work.");
    }
  });
  
  durationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      durationButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      duration = Number(button.dataset.duration);
      resetTest(false);
    });
  });
  
  restartButton.addEventListener("click", () => {
    resetTest();
  });
  
  resetTest(false);