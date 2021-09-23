const colors = ['#5141ba', '#bd2c1c', '#5acaf2', '#e9fc12', '#24b561', '#0d4375', '#75450d']

const game = new aimGame({ minSize: 5, maxSize: 80, message: 'GameOver', boardW: 600, boardH: 600, timerList: [10, 20, 30, 40, 50, 60] })

console.log(game)

function aimGame({ start = '#start', screen = '.screen', timeList = '#time-list', timeEl = '#time', board = '#board', timeBtn = 'time-btn', circle = 'circle', colors = [], ping = 1000, minSize = 10, maxSize = 60, message = 'Счет', boardW, boardH, timerList = [10, 20, 30] } = {}) {
	if (!(this instanceof aimGame)) throw new Error('aimGame could be instanceof aimGame')

	let time = 0
	let score = 0

	this.init = ({ start, screen, timeList, timeEl, board, timeBtn, circle, colors, ping, minSize, maxSize, message, boardW, boardH, timerList } = {}) => {
		this.startBtn = document.querySelector(start)
		this.screens = document.querySelectorAll(screen)
		this.timeList = document.querySelector(timeList)
		this.timeEl = document.querySelector(timeEl)
		this.board = document.querySelector(board)

		this.timeBtn = timeBtn
		this.circle = circle
		this.colors = colors
		this.ping = ping
		this.minSize = minSize
		this.maxSize = maxSize
		this.message = message
		this.boardW = boardW
		this.boardH = boardH

		this.timerList = timerList

		if (this.boardW) this.board.style.width = `${this.boardW}px`
		if (this.boardH) this.board.style.height = `${this.boardH}px`

		if (this.timerList.length > 0) {
			timeHtml = ''
			this.timerList.forEach(time => timeHtml += `<li>
				<button class="time-btn" data-time="${time}">
					${time} сек
				</button>
			</li>`)

			this.timeList.insertAdjacentHTML('beforeend', timeHtml)
		}
	}

	this.init({ start, screen, timeList, timeEl, board, timeBtn, circle, colors, ping, minSize, maxSize, message, boardW, boardH, timerList })

	this.startBtn.addEventListener('click', (event) => {
		event.preventDefault() // отменяем поведение a по умолчанию
		this.screens[0].classList.add('up') // показываем следующий экран
	})

	this.timeList.addEventListener('click', ({ target }) => {
		// мы добавили addEventListener на весь блок списка, а нам необходимо слушать событие только по одной кнопки
		// делаем через делегирование событий 
		// contains - позволяет проверить, содержит ли один элемент внутри себя другой
		// contains - у нас в примере метод проверяет, есть ли такой-то классс
		if (target.classList.contains(this.timeBtn)) {
			// мы получаем строчку
			// через функцию parseInt получаем число и записываем в переменную time
			time = parseInt(target.getAttribute('data-time'))
			this.screens[1].classList.add('up')
			startGame()
		}
	})

	this.board.addEventListener('click', ({ target }) => {
		if (target.classList.contains(this.circle)) {
			score++
			target.remove()
			createRandomCircle()
		}
	})

	const startGame = () => {
		setInterval(timer, this.ping) // задаем таймер
		createRandomCircle()
		setTime(time)
	}

	const timer = () => {
		if (time === 0) {
			finishGame()
		}
		else {
			let current = --time // уменьшаем текущее время
			if (current < 10) {
				current = `0${current}`
			}
			setTime(current)
		}
	}

	const setTime = value => this.timeEl.innerHTML = `00:${value}`

	const finishGame = () => {
		this.timeEl.parentNode.classList.add('hide')
		this.board.innerHTML = `<h1>${this.message}: <span class="primary"> ${score}</span><h1>`
	}

	const createRandomCircle = () => {
		const circle = document.createElement('div')
		const size = getRandomNumber(this.minSize, this.maxSize)
		// через деструктуризацию задаем рандомное положение кружка
		const { width, height } = this.board.getBoundingClientRect()
		const x = getRandomNumber(0, width - size)
		const y = getRandomNumber(0, height - size)
		const { hex, r, g, b, a } = getRandomColor(), // получаем цвет
			color = hex ? hex : `rgba(${r}, ${g}, ${b}, ${a})`

		circle.classList.add('circle')
		circle.style.width = `${size}px`
		circle.style.height = `${size}px`
		circle.style.left = `${x}px`
		circle.style.top = `${y}px`
		circle.style.background = color

		this.board.append(circle)
	}

	// создание рандомных размеров для кружка
	const getRandomNumber = (min, max) => Math.round(Math.random() * (max - min) + min)

	const getRandomColor = () => {
		return this.colors.length > 0 ? { hex: this.colors[Math.floor(Math.random() * this.colors.length)] } :
			{
				r: Math.floor(Math.random() * 255),
				g: Math.floor(Math.random() * 255),
				b: Math.floor(Math.random() * 255),
				a: !this.transparency ? 1 : Math.random().toFixed(2)
			}
	}
}
