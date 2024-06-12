// Global variables
const cardListSource = ['./img/square.png', './img/triangle.png', './img/circle.png', './img/star.png', './img/arrow.png', './img/cross.png', './img/diamond.png', './img/hexagon.png', './img/oval.png', './img/right triangle.png', './img/trapezoid.png', './img/semi circle.png', './img/octagon.png', './img/parallelogram.png', './img/rectangle.png', './img/pentagon.png', './img/diamond2.png', './img/moon.png', './img/oval2.png', './img/heart.png', './img/round-rectangle.png', './img/annulus.png', './img/product.png', './img/half-annulus.png'];
const gameCards = [];
const showingCards = [];
const recordArr = [];
const record = {
  4: 0,
  8: 0,
  16: 0,
  32: 0
}; // Record best points for each select game
let numOfCards;
let numOfClicks = 0;
let counter = 0; // to count found pairs of card
let gameboard = document.getElementById('gameboard');

// Card constructor
function CardObj(id, src, isShown = false, isFound = false) {
  this.id = id,
  this.src = src,
  this.isShown = isShown,
  this.isFound = isFound
}

// Random function according to select num of cards
function randomId(num) {
  const arr = [];
  const arrTemp = [];
  let i = 0;
  while (i < num) {
    let j = Math.floor((Math.random()*num), 0);
    while (!arrTemp.includes(j)) {
      arrTemp.push(j);
      arr.push(Math.floor(arrTemp[i] / 2));// for each of 2 cards have same image id
      i++;
    }
  }
  return arr;
}

//Create array of cards
function createCardArray(num) {
  const cardArray = [];
  let arrNum = randomId(num);
  for (let i = 0; i < num; i++) {
    let src = cardListSource[arrNum[i]];
    let card = new CardObj(i,src);
    cardArray.push(card);
  }
  return cardArray;
}

// Create gameboard with select number of cards
function createGameboard(num) {
  const arr = createCardArray(num);
  gameCards.push(...arr)
  gameboard.innerHTML = '';
  let temp = '';
  for (let i = 0; i < num; i++) {
    //let id = document.getElementById(`${i}`);
    temp += `
      <div class="card-container">
        <div class="card-box" id="box${i}">
          <div class="front">
            <img src="./img/joker.png" alt=${i} class='${i}'>
          </div>
          <div class="back">
            <img src='./img/joker.png' alt=${i}' class='${i}' id='${i}'>
          </div>        
        </div>  
      </div>
    `;
  }
  gameboard.innerHTML += temp;
}

// Get event id by click
function getClickCard(e) {
  document.getElementById('select-game').removeEventListener('click', getSelectGame);// prevent player accidentally click other game during playing  
  let id = parseInt(e.target.className);
  if (!isNaN(id)) {
    if (gameCards[id].isFound) {
      activeCard.removeEventListener('click', getClickCard);
    } else {
      numOfClicks ++; // get click times
      checkClickCard(id);
    }
  }
}

// Toggle show card
function toggleCard(id) {
  let img = document.getElementById(id);
  let activeCard = document.getElementById(`box${id}`);

  if (gameCards[id].isShown === false) {    
    img.src = gameCards[id].src;
    gameCards[id].isShown = true;
    activeCard.classList.add('active');  

  } else {
    img.src = './img/joker.png';
    gameCards[id].isShown = false;
    activeCard.classList.remove('active');  
  }
}

function updateShowingCard(id) {
  showingCards.push(gameCards[id]);
}

// Checking click card event
function checkClickCard(id) {
  let numOfShowingCards = showingCards.length;
  switch (numOfShowingCards) {
    case (0):
      toggleCard(id);
      updateShowingCard(id);
      break;

    case (1):
      toggleCard(id); 
      if (showingCards[0].id === gameCards[id].id) {
        showingCards.length = 0;
         break;
      }
      updateShowingCard(id);
      if (showingCards[0].src === showingCards[1].src) {   
        counter += 2;   
        let src = showingCards[0].src;        
        gameCards.forEach(card => {          
          if (card.src === src) {
            card.isFound = true
          }          
        })
        showingCards.length = 0;
        if (counter === gameCards.length) {  
          recordArr.push([numOfCards, numOfClicks]);      
          document.getElementById('alert').innerHTML = `YOU WON! with ${numOfClicks} clicks`;
          getRecord(numOfCards, recordArr);
          displayRecord(numOfCards);
          numOfClicks = 0;
          counter = 0;
          gameboard.removeEventListener('click', getClickCard);
          document.getElementById('select-game').addEventListener('click', getSelectGame);
          gameboard.addEventListener('click', getClickCard);
        }   
      } 
      break;

    case (2):
      toggleCard(showingCards[0].id);
      toggleCard(showingCards[1].id);
      if (showingCards.includes(gameCards[id])) {
        showingCards.length = 0;
        break;
      }
      showingCards.length = 0;
      toggleCard(id);
      updateShowingCard(id);
  }
}

// Get record after each game
function getRecord(num, arr) {
  const bestPoints = [];
  for (let i of arr) {
    if (i[0] === num) {
      bestPoints.push(i[1]);
    }    
  }
  let bestPoint =  bestPoints.reduce((acc, current) => Math.min(acc, current));
  record[num] = bestPoint;
}

// Show best playing on browser
function displayRecord(num) {
  if (record[num] != 0) {
    let currentRecord = document.getElementById('record');
    if (record[num]) {
      currentRecord.innerHTML = `Best playing: ${record[num]} clicks`;
    }    
  }
}

// Reset game
function reset() {
  gameCards.length = 0;
  showingCards.length = 0;
  numOfClicks = 0;
  counter = 0;
  document.getElementById('alert').innerHTML = '';
  document.getElementById('record').innerHTML = '';
}

// Choose difficulty of game
function getSelectGame(e) {
  reset();
  let getCLickId = e.target.id;
  numOfCards = parseInt(getCLickId.slice(4, getCLickId.length));
  let mainBoard = document.querySelector('.main');
  if (numOfCards === 40) {
    mainBoard.style.maxWidth = '1400px';
  } else if ((numOfCards === 8)) {
    mainBoard.style.maxWidth = '550px';
  } else {
    mainBoard.style.maxWidth = '1100px';
  }

  displayRecord(numOfCards);// show previous record
  createGameboard(numOfCards);  
  gameboard.addEventListener('click', getClickCard);
}

// Reload game after click "Restart"
function reloadGame() {  
  reset();
  displayRecord(numOfCards);
  createGameboard(numOfCards);
  document.getElementById('select-game').addEventListener('click', getSelectGame);
  gameboard.addEventListener('click', getClickCard);
}

function start() {
  document.getElementById('select-game').addEventListener('click', getSelectGame);
  document.getElementById('restart').addEventListener('click', reloadGame);
}

start();