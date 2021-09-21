// const colors = ['#fdbb2d', '#2dfd6b', '#2dfdec', '#bb2dfd', '#f9fd2d']
const computedStyle = el => el.currentStyle || getComputedStyle(el, ''), // IE || другой браузер
	colors = ['#e74c3c', '#8e44ad', '#3498bd', '#e67e22', '#2ecc71']

const board = new boardPlugin({ colors })
console.log(board)

board.init({ squares: 1000, w: 1000 })

function boardPlugin({ board, squares, colors, transparency, w, h, bgSquareColor, shadowSquareColor } = {}) {
	if (!(this instanceof boardPlugin)) throw new Error('boardPlugin could be instanceof boardPlugin')
	
	this.init = ({ board, squares, colors, transparency, w, h } = {}) => {
		this.board = document.querySelector(board || '#board')
		this.squares = squares || 500
		this.colors = colors || []
		this.transparency = transparency || false
		this.w = w || 400
		this.h = h
		this.bgSquareColor = bgSquareColor || '#1d1d1d'
		this.shadowSquareColor = shadowSquareColor || '#000'

		if (this.board.childNodes.length > 0) this.board.innerHTML = ''
		this.board.style['max-width'] = `${this.w}px`

		const square = document.createElement('div')
		square.classList.add('square')
		this.board.append(square)

		const squareStyles = computedStyle(square),
			margin = parseInt(squareStyles.margin)

		this.squareSize = square.offsetWidth + margin * 2
		this.squaresH = Math.floor(this.w / this.squareSize)
		this.squaresV = Math.floor(this.squares / this.squaresH)

		this.board.removeChild(square)

		this.h = this.squaresV * this.squareSize
		this.squares = this.squaresH * this.squaresV

		run()
	}

	const run = () => {
		for (let i = 0; i < this.squares; i++) {
			const square = document.createElement('div')
			square.classList.add('square')
			square.addEventListener('mouseover', () => setColor(square)) // наведение мыши на квадрат и назначение цвета
			square.addEventListener('mouseleave', () => removeColor(square)) // удаляем цвет и возвращаем базовый при убирание мыши
			this.board.append(square)
		}
	}

	const setColor = (square) => {
		const { color, r, g, b, a } = getRandomColor() // получаем цвет
		// передаем параметр, вместо фиксированного цвета
		square.style.backgroundColor = color ? color : `rgba(${r}, ${g}, ${b}, ${a})` 
		square.style.boxShadow = `0 0 2px ${color}, 0 0 10px ${color}` // делаем цвета более объемными и делаем свечение
	}

	const removeColor = (square) => {
		square.style.backgroundColor = '#1d1d1d' // возвращаем изначальный цвет квадрату
		square.style.boxShadow = `0 0 2px #000`
	}

	const getRandomColor = () => {
		/* 
		Math.floor - округление в меньшую сторону
		Math.random - выдает рандомную строчку
		colors.length - получаем длину массива
		return colors[index] - возвращаем массив colors и динамический индекс [index], который мы получили
		*/
		if (this.colors.length > 0) {
			const index = Math.floor(Math.random() * this.colors.length)
			return { color: this.colors[index] }
		}

		const r = Math.round(Math.random() * 255),
			g = Math.floor(Math.random() * 255),
			b = Math.floor(Math.random() * 255),
			a = Math.random().toFixed(2)
		
		return { r, g, b, a: this.transparency ? a : 1 }
	}

	this.init({ board, squares, colors, transparency, w, h, bgSquareColor, shadowSquareColor })
}
