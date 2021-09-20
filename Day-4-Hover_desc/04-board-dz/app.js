const board = document.querySelector('#board');
const colors = ['#FFFF33', '#FF9900', '#FF6666', '#FF3366', '#6699CC', '#FF00FF', '#CC9966', '#6600CC', '#00FFCC', '#999999', '#00FF33', '#0033CC', '#99FF00', '#FF0033', '#00FF66', '#666600']
const SQUARES_NUMBER = 340

for (let i = 0; i < SQUARES_NUMBER; i++) {
    const square = document.createElement('div')
    square.classList.add('square')
    square.addEventListener('mouseover', () => 
    setColor(square)) 
    square.addEventListener('mouseleave', () => 
    removeColor(square)) 
    board.append(square)
}

function setColor(square) {
const color = getRandomColor() 
square.style.backgroundColor = color 
square.style.boxShadow = `0 0 2px ${color},
0 0 10px ${color}`
}

function removeColor(square) {
    square.style.backgroundColor = '#1d1d1d' 
    square.style.boxShadow = `0 0 2px #000`
}

function getRandomColor() {
   const index =  Math.floor(Math.random() * colors.length)
   return colors[index]
}