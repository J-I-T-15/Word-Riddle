const inputs = document.querySelector(".inputs"),
hintTag = document.querySelector(".hint span"),
guessLeft = document.querySelector(".guess-left span"),
wrongLetter = document.querySelector(".wrong-letter span"),
resetBtn = document.querySelector(".reset-btn"),
typingInput = document.querySelector(".typing-input"),
correctSound = document.getElementById("correctSound"),
wrongSound = document.getElementById("wrongSound");

let word, maxGuesses, incorrectLetters = [], correctLetters = [];

// Function to select a random word and reset the game
function randomWord() {
    let ranItem = wordList[Math.floor(Math.random() * wordList.length)];
    word = ranItem.word;
    maxGuesses = word.length >= 5 ? 8 : 6;
    correctLetters = [];
    incorrectLetters = [];
    hintTag.innerText = ranItem.hint;
    guessLeft.innerText = maxGuesses;
    wrongLetter.innerText = incorrectLetters.join(", ");

    let html = "";
    for (let i = 0; i < word.length; i++) {
        html += `<input type="text" disabled>`;
    }
    inputs.innerHTML = html;
}

// Initialize the game with user input
function initGame(e) {
    let key = e.target.value.toLowerCase();
    if (key.match(/^[a-z]+$/) && !incorrectLetters.includes(key) && !correctLetters.includes(key)) {
        if (word.includes(key)) {
            // If correct, reveal the letters
            for (let i = 0; i < word.length; i++) {
                if (word[i] === key) {
                    correctLetters.push(key);
                    inputs.querySelectorAll("input")[i].value = key;
                }
            }
            // Uncomment if you have sound files for correct guesses
            // correctSound.play();  // Play correct guess sound
        } else {
            // If wrong, decrease guesses and update incorrect letters
            maxGuesses--;
            incorrectLetters.push(key);
            // Uncomment if you have sound files for wrong guesses
            // wrongSound.play();  // Play wrong guess sound
        }
        guessLeft.innerText = maxGuesses;
        wrongLetter.innerText = incorrectLetters.join(", ");
    }
    typingInput.value = ""; // Clear input field

    setTimeout(() => {
        if (correctLetters.length === new Set(word).size) { // All unique letters guessed
            showPopup(`Congrats! You found the word ${word.toUpperCase()}`);
            randomWord();
        } else if (maxGuesses < 1) {
            showPopup(`Game over! The word was ${word.toUpperCase()}`);
            for (let i = 0; i < word.length; i++) {
                inputs.querySelectorAll("input")[i].value = word[i];
            }
        }
    }, 100);
}

// Function to display popup messages
function showPopup(message) {
    let popup = document.createElement('div');
    popup.id = "popup";
    popup.classList.add('active');
    popup.innerHTML = `<p>${message}</p><button onclick="closePopup()">OK</button>`;
    document.body.appendChild(popup);
}

// Function to close popup
function closePopup() {
    let popup = document.getElementById('popup');
    if (popup) {
        popup.remove();
    }
}

// Event listeners for game control
resetBtn.addEventListener("click", randomWord);
typingInput.addEventListener("input", initGame);
inputs.addEventListener("click", () => typingInput.focus());
document.addEventListener("keydown", () => typingInput.focus());

// Start the game when the page loads
randomWord();
