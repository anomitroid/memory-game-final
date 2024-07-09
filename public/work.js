const grid = document.getElementById ('grid'); 
let level = 1;
let gridSize = 4;
const levelContainer = document.getElementById ('level');

levelContainer.innerText += ` ` + level.toString (); 

let currentArray = {};
let currentCards = [];

let selections = 2;

const winBox = document.querySelector ('.win-loss');
let movesAllowed = 50;
const updateMoves = (movesAllowed) => winBox.innerHTML = `Moves Left: ${movesAllowed}`;
const progressMade = document.querySelector ('.progress');
let progress = 0;
const updateProgress = (progress) => progressMade.innerHTML = `Pairs Found: ${progress}`;

const images = {
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

function shuffleArray (array) { 
    for (let i = array.length - 1; i > 0; i --) {
        const j = Math.floor (Math.random () * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function chooseRandomImages (r) {
    let values = Object.values (images);
    values = shuffleArray (values);
    const uniqueImages = values.slice (0, r);
    console.log (values);
    return uniqueImages;
}

function generateRandomArray (n) {
    const set = new Set ();
    while (set.size < n / 2) {
        const randomNumber = Math.floor (Math.random () * 100);
        set.add (randomNumber);
    }
    const array = [...set, ...set];
    const chosenImages = chooseRandomImages (n / 2);
    console.log (chosenImages);
    Array.from(set).forEach ((element, index) => currentArray[element] = chosenImages[index]);
    console.log (currentArray);
    return shuffleArray (array);
}

function createCard (randomArray, arrayIndex) {
    const card = document.createElement ('div');
    card.classList.add ('flip-card');
    card.style.flex = '0 0 calc(100% / ' + gridSize + ')'; 
    const innerCard = document.createElement ('div');
    innerCard.classList.add ('flip-card-inner');
    const frontCard = document.createElement ('div');
    frontCard.classList.add ('flip-card-front');
    const backCard = document.createElement ('div');
    backCard.classList.add ('flip-card-back');
    const img = document.createElement ('img');
    img.src = currentArray [randomArray [arrayIndex]];
    backCard.appendChild (img);
    card.dataset.num = randomArray [arrayIndex ++];
    card.appendChild (innerCard);
    innerCard.appendChild (backCard);
    innerCard.appendChild (frontCard);
    return [card, arrayIndex];
}

function createGrid (gridSize) { 
    const gridSqNumber = gridSize * gridSize;
    const randomArray = generateRandomArray (gridSqNumber);
    let arrayIndex = 0;
    for (let i = 0; i < gridSqNumber; i ++) {
        let card; 
        [card, arrayIndex] = createCard (randomArray, arrayIndex);
        currentCards.push (card);
        grid.appendChild (card);
    }
}

(function () {
    createGrid (gridSize);
    updateMoves (movesAllowed);
    updateProgress (progress);
}) ();

let lastSelection = -1;
let chosenCards = new Set ();
let selectionsDone = 0;

currentCards.forEach(card => {
    card.addEventListener('click', () => runSelectionCheck (card));
});

let lastClickTime = 0;
const clickDelay = 500;

function runSelectionCheck (card) {
    const now = Date.now ();
    if (now - lastClickTime < clickDelay) return ;
    lastClickTime = now;
    if (card === currentCards[lastSelection]) {
        alert ("you cannot click on the same card twice in a row.");
        return ;
    }
    selectionsDone ++;
    chosenCards.add (card);
    card.classList.add ('flip-card-clicked');
    if (selectionsDone == 2) {
        if (!isInnerHTMLsame ()) {
            chosenCards.forEach (card => {
                card.classList.add ('flip-card-clicked');
            });
            setTimeout (() => {
                chosenCards.forEach (card => {
                    card.classList.remove ('flip-card-clicked');
                });
            }, 500);
            setTimeout (() => {
                chosenCards.clear ();
            }, 500);
            lastSelection = -1;
        }
        else {
            lastSelection = currentCards.indexOf (card);
            chosenCards.clear ();
            progress ++;
            updateProgress (progress);
        }
        selectionsDone = 0;
        if (progress == gridSize * 2) {
            winBox.innerHTML = 'You Won!!!';
            makeUnclickable ();
            level ++;
        }
        else {
            movesAllowed --;
            updateMoves (movesAllowed);
            if (!movesAllowed) {
                winBox.innerHTML = 'You Lost!';
                makeUnclickable ();
            }
        }
    }
}

const isInnerHTMLsame = () => [...chosenCards].every ((element, index, array) => element.innerHTML === array[0].innerHTML);

function makeUnclickable () {
    const overlay = document.createElement ('div');
    overlay.id = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'transparent';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'all';
    document.body.appendChild (overlay)
}