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
        document.getElementById("words").innerHTML = words.map((word, index) => {
            if (index === currentWordIndex) {
                return `<span class="word current-word">${currentWord}</span>`;
            }
            return `<span class="word">${word}</span>`;
        }).join(' ');
        document.getElementById("input").value = typedWord;
    }

    document.getElementById("input").addEventListener("input", function(e) {
        const inputVal = e.target.value;
        if (inputVal.length > typedWord.length) {
            const nextChar = inputVal[inputVal.length - 1];
            if (currentWord.startsWith(nextChar)) {
                typedWord += nextChar;
                currentWord = currentWord.slice(1);
            } else {
                e.target.value = typedWord; // Prevent incorrect character from being added
            }
        } else {
            typedWord = inputVal;
        }

        if (currentWord.length === 0) {
            words.splice(currentWordIndex, 1); // Remove the correctly typed word
            if (words.length === 0) {
                fetchWords(); // Fetch new words when the current batch is completed
            } else {
                if (currentWordIndex >= words.length) {
                    currentWordIndex = 0; // Wrap around to the beginning if needed
                }
                currentWord = words[currentWordIndex];
                typedWord = '';
                updateDisplay();
            }
        } else {
            updateDisplay();
        }
    });

    fetchWords();
});
