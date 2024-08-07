class MemoryGame {
    constructor() {
        this.grid = document.getElementById('grid');
        this.level = 1;
        this.gridSize = 4;
        this.levelContainer = document.getElementById('level');
        this.currentArray = {};
        this.currentCards = [];
        this.selections = 2;
        this.winBox = document.querySelector('.win-loss');
        this.movesAllowed = 20;
        this.progressMade = document.querySelector('.progress');
        this.progress = 0;
        this.lastSelection = -1;
        this.chosenCards = new Set();
        this.selectionsDone = 0;
        this.lastClickTime = 0;
        this.clickDelay = 500;

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

        this.init();
    }

    init() {
        this.levelContainer.innerText += ` ${this.level}`;
        this.createGrid(this.gridSize);
        this.updateMoves(this.movesAllowed);
        this.updateProgress(this.progress);
        this.addEventListeners();
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
        if (card === this.currentCards[this.lastSelection]) {
            alert("You cannot click on the same card twice in a row.");
            return;
        }
        this.selectionsDone++;
        this.chosenCards.add(card);
        card.classList.add('flip-card-clicked');
        if (this.selectionsDone == 2) {
            if (!this.isInnerHTMLsame()) {
                this.handleMismatch();
            } else {
                this.handleMatch(card);
            }
            this.selectionsDone = 0;
            this.checkGameStatus();
        }
    }

    handleMismatch() {
        this.chosenCards.forEach(card => {
            card.classList.add('flip-card-clicked');
        });
        setTimeout(() => {
            this.chosenCards.forEach(card => {
                card.classList.remove('flip-card-clicked');
            });
        }, 500);
        setTimeout(() => {
            this.chosenCards.clear();
        }, 500);
        this.lastSelection = -1;
    }

    handleMatch(card) {
        this.lastSelection = this.currentCards.indexOf(card);
        this.chosenCards.clear();
        this.progress++;
        this.updateProgress(this.progress);
    }

    checkGameStatus() {
        if (this.progress == Math.pow (this.gridSize, 2) / 2) {
            this.winBox.innerHTML = 'You Won!!!';
            this.makeUnclickable();
            this.level++;
        } else {
            this.movesAllowed--;
            this.updateMoves(this.movesAllowed);
            if (!this.movesAllowed) {
                this.winBox.innerHTML = 'You Lost!';
                this.makeUnclickable();
            }
        }
    }

    isInnerHTMLsame() {
        return [...this.chosenCards].every((element, index, array) => element.innerHTML === array[0].innerHTML);
    }

    makeUnclickable() {
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'transparent';
        overlay.style.zIndex = '9999';
        overlay.style.pointerEvents = 'all';
        document.body.appendChild(overlay);
    }
}

// Instantiate the game
const game = new MemoryGame();