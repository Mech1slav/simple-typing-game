document.addEventListener("DOMContentLoaded", function() {
    let words = [];
    let currentWordIndex = 0;
    let currentWord = '';
    let typedWord = '';
    let timerInterval;
    let timerValue;
    let totalCorrectWordsCount = 0;
    let roundCorrectWordsCount = 0;

    const startScreen = document.getElementById("start-screen");
    const gameScreen = document.getElementById("game");
    const resultScreen = document.getElementById("result-screen");

    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
    const resultMessage = document.getElementById("result-message");

    function showStartScreen() {
        startScreen.style.display = "block";
        gameScreen.style.display = "none";
        resultScreen.style.display = "none";
    }

    function showGameScreen() {
        startScreen.style.display = "none";
        gameScreen.style.display = "block";
        resultScreen.style.display = "none";
        fetchWords();
    }

    function showResultScreen(message) {
        startScreen.style.display = "none";
        gameScreen.style.display = "none";
        resultScreen.style.display = "block";
        resultMessage.textContent = `${message} Количество правильно введенных слов: ${totalCorrectWordsCount}`;
    }

    function fetchWords() {
        fetch('/words')
            .then(response => response.text())
            .then(text => {
                words = text.split(' ');
                while (words.length < 5) {
                    words = words.concat(words);
                }
                words = words.slice(0, 5); // Убедимся, что всегда 5 слов
                currentWordIndex = 0;
                currentWord = words[currentWordIndex];
                typedWord = '';
                roundCorrectWordsCount = 0;
                updateDisplay();
                startTimer();
            });
    }

    function startTimer() {
        const timerElement = document.querySelector('.timer');
        timerValue = currentWord.length * 0.5;
        timerElement.textContent = timerValue.toFixed(1);

        timerInterval = setInterval(() => {
            timerValue -= 0.1;
            if (timerValue <= 0) {
                clearInterval(timerInterval);
                totalCorrectWordsCount += roundCorrectWordsCount;
                showResultScreen("Время вышло!");
            } else {
                timerElement.textContent = timerValue.toFixed(1);
            }
        }, 100);
    }

    function updateDisplay() {
        const wordsContainer = document.getElementById("words");
        wordsContainer.innerHTML = words.map((word, index) => {
            if (index === currentWordIndex) {
                return `<span class="word current-word">${currentWord}<span class="timer"></span></span>`;
            }
            return `<span class="word">${word}</span>`;
        }).join(' ');

        const inputContainer = document.getElementById("input-container");
        inputContainer.innerHTML = '';
        for (let i = 0; i < currentWord.length; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = '1';
            input.classList.add('char-input');
            input.dataset.index = i;
            input.value = typedWord[i] || '';
            inputContainer.appendChild(input);
        }
        document.querySelector('.char-input').focus();
    }

    document.getElementById("input-container").addEventListener("input", function(e) {
        const target = e.target;
        if (target.classList.contains('char-input')) {
            const index = parseInt(target.dataset.index, 10);
            const value = target.value;
            if (value.length > 0 && currentWord[index] === value) {
                typedWord = typedWord.substring(0, index) + value + typedWord.substring(index + 1);
                target.style.color = 'green';
                if (index < currentWord.length - 1) {
                    document.querySelector(`.char-input[data-index="${index + 1}"]`).focus();
                } else if (typedWord === currentWord) {
                    clearInterval(timerInterval);
                    roundCorrectWordsCount++;
                    words.splice(currentWordIndex, 1);
                    if (words.length === 0) {
                        totalCorrectWordsCount += roundCorrectWordsCount;
                        fetchWords();
                    } else {
                        if (currentWordIndex >= words.length) {
                            currentWordIndex = 0;
                        }
                        currentWord = words[currentWordIndex];
                        typedWord = '';
                        updateDisplay();
                        startTimer();
                    }
                }
            } else {
                target.style.color = 'red';
                target.value = '';
            }
        }
    });

    startButton.addEventListener("click", showGameScreen);
    restartButton.addEventListener("click", showStartScreen);

    showStartScreen();
});
