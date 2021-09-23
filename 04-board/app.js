const { log } = console,
	error = msg => { throw new Error(msg) },
	getStyles = el => el.currentStyle || getComputedStyle(el, ''), // IE || другой браузер
	get = (el, target = document) => target.querySelector(el),
	getAll = (el, target = document) => target.querySelectorAll(el),
	addEvent = (el, event, cb) => (el ? el : document).addEventListener(event, cb),
	setHtml = (target = '', pos = 'beforeend', html = '') => (target ? target : document).insertAdjacentHTML(pos, html),
	create = (el = 'div') => document.createElement(el),
	getRect = (el = document) => el.getBoundingClientRect(),
	filter = (obj, cb) => [].filter.call(obj, cb),
	register = (obj, prop, value) => obj.__proto__[prop] = value,
	clearClasses = function (target, ...classList) {
		target.filter(placeholder => {
			let contains = false;
			classList.forEach(_class => { if (placeholder.classList.contains(_class)) contains = true });
			return contains;
		}).forEach(placeholder => placeholder.classList.remove(classList))
	}

const colors = ['#5141ba', '#bd2c1c', '#5acaf2', '#e9fc12', '#24b561', '#0d4375', '#75450d']

const board = new boardPlugin({ /*colors, */squareSize: 20 })
board.init({ squares: 600, w: 600 })

log(board)

function boardPlugin({ board = '#board', w = 400, h, squares = 500, squareSize = 0, colors = [], transparency = false, bgSquareColor = '#1d1d1d', shadowSquareColor = '#000' } = {}) {
	if (!(this instanceof boardPlugin)) error('boardPlugin could be instanceof boardPlugin')

	this.init = ({ board, w, h, squares, squareSize, colors, transparency, bgSquareColor, shadowSquareColor } = {}) => {
		this.board = this.board || get(board)
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

		const square = create()
		square.classList.add('square')
		this.board.append(square)

		const { width, height } = getRect(square)

		if (width !== height) {
			error('Width and height of square could be equal')
		}
		else if (!(this.squareSize || width)) {
			error('Size of square could be > 0')
		}

		const squareStyles = getStyles(square)

		this.squareSize = this.squareSize ? this.squareSize : width
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
			const square = create()
			square.classList.add('square')
			if (!square.offsetWidth) square.style.width = square.style.height = `${this.squareSize}px`
			addEvent(square, 'mouseover', setColor) // наведение мыши на квадрат и назначение цвета
			addEvent(square, 'mouseleave', removeColor) // удаляем цвет и возвращаем базовый при убирание мыши
			this.board.append(square)
		}
	}

	const setColor = ({ target }) => {
		const { hex, r, g, b, a } = getRandomColor(), // получаем цвет
			color = hex ? hex : `rgba(${r}, ${g}, ${b}, ${a})`
		target.style.background = color // передаем параметр, вместо фиксированного цвета
		target.style.boxShadow = `0 0 2px ${color}, 0 0 10px ${color}` // делаем цвета более объемными и делаем свечение
	}

	const removeColor = ({ target }) => {
		target.style.background = this.bgSquareColor // возвращаем изначальный цвет квадрату
		target.style.boxShadow = `0 0 2px ${this.shadowSquareColor}`
	}

	const getRandomColor = () => {
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
