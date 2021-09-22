const computedStyle = el => el.currentStyle || getComputedStyle(el, ''), // IE || другой браузер
	colors = ['#5141ba', '#bd2c1c', '#5acaf2', '#e9fc12', '#24b561', '#0d4375', '#75450d']

const board = new boardPlugin({ /*colors, */squareSize: 20 })

board.init({ squares: 600, w: 600 })

console.log(board)

function boardPlugin({ board = '#board', w = 400, h, squares = 500, squareSize = 0, colors = [], transparency = false, bgSquareColor = '#1d1d1d', shadowSquareColor = '#000' } = {}) {
	if (!(this instanceof boardPlugin)) throw new Error('boardPlugin could be instanceof boardPlugin')
	
	this.init = ({ board, w, h, squares, squareSize, colors, transparency, bgSquareColor, shadowSquareColor } = {}) => {
		this.board = this.board || document.querySelector(board)
		this.w = w || this.w
		this.h = h || this.h
		this.squares = squares || this.squares
		this.squareSize = squareSize || this.squareSize
		this.colors = colors || this.colors
		this.transparency = transparency || this.transparency
		this.bgSquareColor = bgSquareColor || this.bgSquareColor
		this.shadowSquareColor = shadowSquareColor || this.shadowSquareColor

		if (this.board.childNodes.length > 0) this.board.innerHTML = ''
		this.board.style['max-width'] = `${this.w}px`

		const square = document.createElement('div')
		square.classList.add('square')
		this.board.append(square)

		if (square.offsetWidth !== square.offsetHeight) {
			throw new Error('Width and height of square could be equal')
		}

		const squareStyles = computedStyle(square)

		if (!(this.squareSize || square.offsetWidth)) {
			throw new Error('Size of square could be > 0')
		}

		this.squareSize = this.squareSize ? this.squareSize : square.offsetWidth
		this.squareCellSize = this.squareSize + parseInt(squareStyles.margin) * 2

		this.board.removeChild(square)

		this.squaresH = Math.floor(this.w / this.squareCellSize)
		this.squaresV = Math.floor(this.squares / this.squaresH)
		this.h = this.squaresV * this.squareCellSize
		this.squares = this.squaresH * this.squaresV

		run()
	}

	const run = () => {
		for (let i = 0; i < this.squares; i++) {
			const square = document.createElement('div')
			square.classList.add('square')
			if (!square.offsetWidth) square.style.width = square.style.height = `${this.squareSize}px`
			square.addEventListener('mouseover', () => setColor(square)) // наведение мыши на квадрат и назначение цвета
			square.addEventListener('mouseleave', () => removeColor(square)) // удаляем цвет и возвращаем базовый при убирание мыши
			this.board.append(square)
		}
	}

	const setColor = square => {
		const { hex, r, g, b, a } = getRandomColor(), // получаем цвет
			color = hex ? hex : `rgba(${r}, ${g}, ${b}, ${a})`
		// передаем параметр, вместо фиксированного цвета
		square.style.background = color
		square.style.boxShadow = `0 0 2px ${color}, 0 0 10px ${color}` // делаем цвета более объемными и делаем свечение
	}

	const removeColor = square => {
		square.style.background = this.bgSquareColor // возвращаем изначальный цвет квадрату
		square.style.boxShadow = `0 0 2px ${this.shadowSquareColor}`
	}

	const getRandomColor = () => {
		/* 
		Math.floor - округление в меньшую сторону
		Math.random - выдает рандомную строчку
		colors.length - получаем длину массива
		return colors[index] - возвращаем массив colors и динамический индекс [index], который мы получили
		*/
		return this.colors.length > 0 ? { hex: this.colors[Math.floor(Math.random() * this.colors.length)] } :
			{
				r: Math.floor(Math.random() * 255),
				g: Math.floor(Math.random() * 255),
				b: Math.floor(Math.random() * 255),
				a: !this.transparency ? 1 : Math.random().toFixed(2)
			}
	}

	this.init({ board, w, h, squares, squareSize, colors, transparency, bgSquareColor, shadowSquareColor })
}
