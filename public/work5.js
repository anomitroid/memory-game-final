class MemoryGame {
    constructor() {
        this.grid = document.getElementById('grid');
        this.levelContainer = document.getElementById('level');
        this.winBox = document.querySelector('.win-loss');
        this.progressMade = document.querySelector('.progress');
        this.newGameButton = document.getElementById('new-game');
        this.newGameButton.addEventListener('click', () => this.newGame());
        
        this.currentArray = {};
        this.currentCards = [];
        this.chosenCards = new Set();
        this.lastClickTime = 0;

        this.level = 1;
        this.progress = 0;
        this.selectionsDone = 0;
        this.lastSelection = -1;
        this.overlay = null;

        this.images = {
            1: 'images/img1.svg',
            2: 'images/img2.svg',
            3: 'images/img3.svg',
            4: 'images/img4.svg',
            5: 'images/img5.svg',
            6: 'images/img6.svg',
            7: 'images/img7.svg',
            8: 'images/img8.svg',
            9: 'images/img9.svg',
            10: 'images/img10.svg',
            11: 'images/img11.svg',
            12: 'images/img12.svg',
            13: 'images/img13.svg',
            14: 'images/img14.svg',
            15: 'images/img15.svg',
            16: 'images/img16.svg',
            17: 'images/img17.svg',
            18: 'images/img18.svg',
            19: 'images/img19.svg',
            20: 'images/img20.svg',
            21: 'images/img21.svg',
            22: 'images/img22.svg',
            23: 'images/img23.svg',
            24: 'images/img24.svg',        
        };

        this.levelConfig = [
            { gridSize: 2, movesAllowed: 10, flipSpeed: 1000 },
            { gridSize: 2, movesAllowed: 5, flipSpeed: 1000 },
            { gridSize: 2, movesAllowed: 3, flipSpeed: 500 },
            { gridSize: 4, movesAllowed: 50, flipSpeed: 500 },
            { gridSize: 4, movesAllowed: 40, flipSpeed: 500 },
            { gridSize: 4, movesAllowed: 30, flipSpeed: 500 },
            { gridSize: 4, movesAllowed: 20, flipSpeed: 500 },
            { gridSize: 4, movesAllowed: 15, flipSpeed: 500 },
            { gridSize: 6, movesAllowed: 70, flipSpeed: 400 },
            { gridSize: 6, movesAllowed: 60, flipSpeed: 400 },
            { gridSize: 6, movesAllowed: 50, flipSpeed: 400 },
            { gridSize: 6, movesAllowed: 40, flipSpeed: 400 },
            { gridSize: 6, movesAllowed: 30, flipSpeed: 400 },
        ];

        this.setLevelParameters();
        this.init();
        this.loadGameState();

        this.modal = document.getElementById('gameModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalMessage = document.getElementById('modalMessage');
        this.modalClose = document.getElementById('modalClose');
        this.modalClose.addEventListener('click', () => this.closeModal());
    }

    async loadGameState() {
        const response = await fetch('/api/gameState');
        const gameState = await response.json();
        if (Object.keys(gameState).length > 0) {
            this.level = gameState.level;
            this.progress = gameState.progress;
            this.currentArray = gameState.currentArray;
            this.chosenCards = new Set(gameState.chosenCards);
            this.setLevelParameters();
            this.restoreGrid(gameState.gridState);
            this.movesAllowed = gameState.movesAllowed; // Make sure this line is present
            this.updateMoves(this.movesAllowed); // Update the moves display
        } else {
            this.init();
        }
    }

    async saveGameState() {
        const gameState = {
            level: this.level,
            progress: this.progress,
            movesAllowed: this.movesAllowed, // Make sure this line is present
            currentArray: this.currentArray,
            chosenCards: Array.from(this.chosenCards).map(card => this.currentCards.indexOf(card)),
            gridState: this.currentCards.map(card => ({
                num: card.dataset.num,
                flipped: card.classList.contains('flip-card-clicked')
            }))
        };
        await fetch('/api/gameState', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameState),
        });
    }

    restoreGrid(gridState) {
        this.grid.innerHTML = '';
        this.currentCards = [];
        gridState.forEach(cardState => {
            const [card] = this.createCard([cardState.num], 0);
            if (cardState.flipped) {
                card.classList.add('flip-card-clicked');
            }
            this.currentCards.push(card);
            this.grid.appendChild(card);
        });
        this.updateMoves(this.movesAllowed);
        this.updateProgress(this.progress);
        this.levelContainer.innerText = `Level: ${this.level}`;
        this.addEventListeners();
    }

    setLevelParameters() {
        const config = this.levelConfig[Math.min(this.level - 1, this.levelConfig.length - 1)];
        this.gridSize = config.gridSize;
        this.movesAllowed = config.movesAllowed;
        this.flipSpeed = config.flipSpeed;
        this.clickDelay = this.flipSpeed / 2;
    }

    init() {
        this.resetGame();
        this.createGrid(this.gridSize);
        this.updateMoves(this.movesAllowed);
        this.updateProgress(this.progress);
        this.addEventListeners();
        this.makeClickable(); 
    }

    resetGame() {
        this.grid.innerHTML = '';
        this.currentCards = [];
        this.chosenCards.clear();
        this.progress = 0;
        this.selectionsDone = 0;
        this.lastSelection = -1;
        this.levelContainer.innerText = `Level: ${this.level}`;
        this.movesAllowed = this.levelConfig[this.level - 1].movesAllowed;
    }

    newGame() {
        if (confirm("Are you sure you want to start a new game? Your current progress will be lost.")) {
            this.level = 1;
            this.setLevelParameters();
            this.init();
            this.saveGameState();
        }
    }

    updateMoves(movesAllowed) {
        this.winBox.innerHTML = `Moves Left: ${movesAllowed}`;
    }

    updateProgress(progress) {
        this.progressMade.innerHTML = `Pairs Found: ${progress}`;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    chooseRandomImages(r) {
        let values = Object.values(this.images);
        values = this.shuffleArray(values);
        return values.slice(0, r);
    }

    generateRandomArray(n) {
        const set = new Set();
        while (set.size < n / 2) {
            const randomNumber = Math.floor(Math.random() * 100);
            set.add(randomNumber);
        }
        const array = [...set, ...set];
        const chosenImages = this.chooseRandomImages(n / 2);
        Array.from(set).forEach((element, index) => this.currentArray[element] = chosenImages[index]);
        return this.shuffleArray(array);
    }

    createCard(randomArray, arrayIndex) {
        const card = document.createElement('div');
        card.classList.add('flip-card');
        card.style.flex = `0 0 calc(100% / ${this.gridSize})`;
        const innerCard = document.createElement('div');
        innerCard.classList.add('flip-card-inner');
        const frontCard = document.createElement('div');
        frontCard.classList.add('flip-card-front');
        const backCard = document.createElement('div');
        backCard.classList.add('flip-card-back');
        const img = document.createElement('img');
        img.src = this.currentArray[randomArray[arrayIndex]];
        backCard.appendChild(img);
        card.dataset.num = randomArray[arrayIndex++];
        card.appendChild(innerCard);
        innerCard.appendChild(backCard);
        innerCard.appendChild(frontCard);
        return [card, arrayIndex];
    }

    createGrid(gridSize) {
        const gridSqNumber = gridSize * gridSize;
        const randomArray = this.generateRandomArray(gridSqNumber);
        let arrayIndex = 0;
        for (let i = 0; i < gridSqNumber; i++) {
            let card;
            [card, arrayIndex] = this.createCard(randomArray, arrayIndex);
            this.currentCards.push(card);
            this.grid.appendChild(card);
        }
    }

    addEventListeners() {
        this.currentCards.forEach(card => {
            card.addEventListener('click', () => this.runSelectionCheck(card));
        });
    }

    runSelectionCheck(card) {
        const now = Date.now();
        if (now - this.lastClickTime < this.clickDelay) return;
        this.lastClickTime = now;
    
        if (this.chosenCards.has(card) || this.selectionsDone >= 2) {
            return; // Ignore clicks on already selected cards or when two cards are already flipped
        }
    
        this.selectionsDone++;
        this.chosenCards.add(card);
        card.classList.add('flip-card-clicked');
    
        if (this.selectionsDone == 2) {
            this.makeUnclickable(); // Prevent further clicks during evaluation
            setTimeout(() => {
                if (!this.isInnerHTMLsame()) {
                    this.handleMismatch();
                } else {
                    this.handleMatch(card);
                }
                this.selectionsDone = 0;
                this.checkGameStatus();
                this.makeClickable(); // Re-enable clicks after evaluation
            }, this.flipSpeed);
        }
        this.saveGameState();
    }

    handleMismatch() {
        this.chosenCards.forEach(card => {
            card.classList.remove('flip-card-clicked');
        });
        this.chosenCards.clear();
        this.lastSelection = -1;
        this.saveGameState();
    }
    
    handleMatch(card) {
        this.lastSelection = this.currentCards.indexOf(card);
        this.chosenCards.clear();
        this.progress++;
        this.updateProgress(this.progress);
        this.saveGameState();
    }

    checkGameStatus() {
        if (this.progress == this.gridSize * this.gridSize / 2) {
            this.makeUnclickable();
            this.showModal('You Won!', `Congratulations! You've completed Level ${this.level}. Click close to start the next level.`);
        } else {
            this.movesAllowed--;
            this.updateMoves(this.movesAllowed);
            this.saveGameState();
            if (!this.movesAllowed) {
                this.makeUnclickable();
                this.showModal('Game Over', 'You ran out of moves. Click close to try again.');
            }
        }
    }

    isInnerHTMLsame() {
        return [...this.chosenCards].every((element, index, array) => element.innerHTML === array[0].innerHTML);
    }

    makeUnclickable() {
        this.grid.style.pointerEvents = 'none';
    }
    
    makeClickable() {
        this.grid.style.pointerEvents = 'auto';
    }

    showModal(title, message) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.modal.style.display = 'block';
    }
    
    closeModal() {
        this.modal.style.display = 'none';
        if (this.modalTitle.textContent === 'You Won!') {
            this.level++;
            this.setLevelParameters();
            this.init();
        } else if (this.modalTitle.textContent === 'Game Over') {
            this.init();
        }
    }

}

// Instantiate the game
const game = new MemoryGame();

window.onbeforeunload = function() {
    return "Are you sure you want to leave this page?";
};