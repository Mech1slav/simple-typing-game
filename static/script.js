document.addEventListener("DOMContentLoaded", function() {
    let words = [];
    let currentWordIndex = 0;
    let currentWord = '';
    let typedWord = '';

    function fetchWords() {
        fetch('/words')
            .then(response => response.text())
            .then(text => {
                words = text.split(' ');
                currentWordIndex = 0;
                currentWord = words[currentWordIndex];
                typedWord = '';
                updateDisplay();
            });
    }

    function updateDisplay() {
        const wordsContainer = document.getElementById("words");
        wordsContainer.innerHTML = words.map((word, index) => {
            if (index === currentWordIndex) {
                return `<span class="word current-word">${currentWord}</span>`;
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
                    setTimeout(() => {
                        words.splice(currentWordIndex, 1);
                        if (words.length === 0) {
                            fetchWords();
                        } else {
                            if (currentWordIndex >= words.length) {
                                currentWordIndex = 0;
                            }
                            currentWord = words[currentWordIndex];
                            typedWord = '';
                            updateDisplay();
                        }
                    }, 50);
                }
            } else {
                target.style.color = 'red';
                target.value = '';
            }
        }
    });

    fetchWords();
});
