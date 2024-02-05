function showPopup() {
    document.getElementById('popup-container').style.display = 'flex';
    document.getElementById('popup').innerHTML = `
    <h2>Choose Game Mode:</h2>
    <button class="PVPAI" onclick="window.open('pvp.html', '_self');">
    Player vs Player
    </button>
    <button class="PVPAI" onclick="showDifficultyPopup()">
    Player vs AI
    </button><br>
    <button onclick="closePopup()"> Back </button>`;
}

function chooseDifficulty(value) {
    localStorage.setItem('difficulty', value);
    window.open('pvai.html', '_self');
}

function showDifficultyPopup() {
    document.getElementById('popup-container').style.display = 'flex';
    document.getElementById('popup').innerHTML = `
        <h2>Select Difficulty:</h2>
        <button class="CD" onclick="chooseDifficulty('1')">Easy</button><br>
        <button class="CD" onclick="chooseDifficulty('2')">Difficult</button><br>
        <button class="CD" onclick="chooseDifficulty('3')">Expert</button><br>
        <button onclick="closePopup()">Close</button>`;
}

function closePopup() {
    document.getElementById('popup-container').style.display = 'none';
}
