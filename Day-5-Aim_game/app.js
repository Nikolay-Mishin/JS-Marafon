const startBtn = document.querySelector('#start')
const screens = document.querySelectorAll('.screen')
const timeList = document.querySelector('#time-list')
const timeEl = document.querySelector('#time')
const board = document.querySelector('#board')

let time = 0
let score = 0

startBtn.addEventListener('click', (event) => {
    event.preventDefault() // отменяем поведение a по умолчанию
    screens[0].classList.add('up') // показываем следующий экран
})

timeList.addEventListener('click', event => {
    // мы добавили addEventListener на весь блок списка, а нам необходимо слушать событие только по одной кнопки
    // делаем через делегирование событий 
    // contains - позволяет проверить, содержит ли один элемент внутри себя другой
    // contains - у нас в примере метод проверяет, есть ли такой-то классс
    if (event.target.classList.contains('time-btn'))  {
        // мы получаем строчку
        // через функцию parseInt получаем число и записываем в переменную time
        time = parseInt(event.target.getAttribute('data-time'))
        screens[1].classList.add('up') 
        startGame()
    }
})

board.addEventListener('click', event => {
    if (event.target.classList.contains('circle')) {
      score++
      event.target.remove()
      createRandomCircle()
    }
})


// DEBUG
//  startGame()

function startGame() {
    // screens[1].classList.add('up') // переносим на 31 строку, чтобы не добавлялся лишний раз класс 
    // timeEl.innerHTML = '00:${time}' // заменили на setTime(time), чтобы не было повторов
    setInterval(decreaseTime, 1000) // задаем таймер
    createRandomCircle()
    setTime(time)
}

function decreaseTime () {
    if (time === 0) {
        finishGame()
    } else {
      let current = --time // уменьшаем текущее время
      if (current < 10) {
        current = `0${current}`
      }
      setTime(current)
    }
}

function setTime(value) {
    timeEl.innerHTML = `00:${value}`
}

function finishGame() {
    timeEl.parentNode.classList.add('hide')
    board.innerHTML = `<h1>Счет: <span class="primary"> ${score}</span><h1>`
}

function createRandomCircle() {
    const circle = document.createElement('div')
    const size = getRandomNumber(10, 60)
    // через деструктуризацию задаем рандомное положение кружка
    const {width, height} = board.getBoundingClientRect() 
    const x = getRandomNumber(0, width - size)
    const y = getRandomNumber(0, height - size)

    circle.classList.add('circle')
    circle.style.width = '${size}px'
    circle.style.height = '${size}px'
    circle.style.top = `${y}px`
    circle.style.left = `${x}px`

    board.append(circle)
}

// создание рандомных размеров для кружка
function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

