function showPopup() {
    document.getElementById('popup-container').style.display = 'flex';
    document.getElementById('popup').innerHTML = `
        <h2>Choose Game Mode:</h2>
        <button onclick="window.open('pvp.html', '_self');">Player vs Player</button>
        <button onclick="showDifficultyPopup()">Player vs AI</button>
        <button onclick="closePopup()">Close</button>`;
}

function chooseDifficulty(value) {
    localStorage.setItem('difficulty', value);
    window.open('pvai.html', '_self');
}

function showDifficultyPopup() {
    document.getElementById('popup-container').style.display = 'flex';
    document.getElementById('popup').innerHTML = `
        <h2>Select Difficulty:</h2>
        <button onclick="chooseDifficulty('1')">Easy</button>
        <button onclick="chooseDifficulty('2')">Difficult</button>
        <button onclick="chooseDifficulty('3')">Expert</button>
        <button onclick="closePopup()">Close</button>`;
}

function closePopup() {
    document.getElementById('popup-container').style.display = 'none';
}