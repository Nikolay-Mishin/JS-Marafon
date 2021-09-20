const board = document.querySelector('#board');
// const colors = ['#fdbb2d', '#2dfd6b', '#2dfdec', '#bb2dfd', '#f9fd2d']
const colors = ['#e74c3c', '#8e44ad', '#3498bd', '#e67e22', '#2ecc71']
const SQUARES_NUMBER = 500

for (let i = 0; i < SQUARES_NUMBER; i++) {
    const square = document.createElement('div')
    square.classList.add('square')
    square.addEventListener('mouseover', () => 
    setColor(square)) // наведение мыши на квадрат и назначение цвета
    square.addEventListener('mouseleave', () => 
    removeColor(square)) // удаляем цвет и возвращаем базовый при убирание мыши
    board.append(square)
}

function setColor(square) {
const color = getRandomColor() // получаем цвет
square.style.backgroundColor = color // передаем параметр, вместо фиксированного цвета
square.style.boxShadow = `0 0 2px ${color},
0 0 10px ${color}` // делаем цвета более объемными и делаем свечение
}

function removeColor(square) {
    square.style.backgroundColor = '#1d1d1d' // возвращаем изначальный цвет квадрату
    square.style.boxShadow = `0 0 2px #000`
}

function getRandomColor() {
   /* 
   Math.floor - округление в меньшую сторону
   Math.random - выдает рандомную строчку
   colors.length - получаем длину массива
   return colors[index] - возвращаем массив colors и динамический индекс [index], который мы получили
   */
   const index =  Math.floor(Math.random() * colors.length)
   return colors[index]
}