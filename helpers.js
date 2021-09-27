const { log } = console,
	error = msg => { throw new Error(msg) },
	{ assign, keys, fromEntries } = Object,
	{ from } = Array,
	nullProto = {}.__proto__,
	getFunc = func => func[keys(func).shift()] || func,
	funcName = func => func.name.replace('bound ', '').trim(),
	hasOwn = (() => {
		if (!nullProto.hasOwnProperty('hasOwn')) {
			Object.defineProperty(nullProto, 'hasOwn', { value: function hasOwn(prop) { return this.hasOwnProperty(prop) } })
		}
		return (obj, prop) => obj.hasOwn(prop)
	})(),
	define = (() => {
		if (!nullProto.hasOwn('_define')) Object.defineProperty(nullProto, '_define', {
			value:
				function _define(value = null, { prop = '', enumerable = false, configurable = false, writable = false, get, set } = {}) { return define(this, ...arguments) }
		})
		return function define(obj, value = null, { prop = '', enumerable = false, configurable = false, writable = false, get, set } = {}) {
			prop = prop || value.name
			if (!obj.hasOwn(prop)) {
				const desc = assign({ enumerable, configurable }, get || set ? { get, set } : { value, writable })
				Object.defineProperty(obj, prop, desc)
			}
			return value
		}
	})(),
	register = (() => {
		nullProto._define(
			function _register({ prop, value, func, def, enumerable = false, configurable = false, writable = false, get, set } = {}) { return register(this, ...arguments) })
		return function register(obj, value, { prop, func, def, enumerable = false, configurable = false, writable = false, get, set } = {}) {
			obj = obj.__proto__
			value = getFunc(value)
			prop = prop || funcName(value)
			if (func) value.func = func
			else {
				const _func = {
					[prop]: function (...args) { return _func[prop].func(this, ...args) }
				}
				_func[prop].func = value
				func = value
				value = _func[prop]
			}
			if (obj && !obj.hasOwn(prop)) {
				def || obj === nullProto ? obj._define(value, { prop, enumerable, configurable, writable, get, set }) :
					obj[prop] = value
			}
			return func
		}
	})(),
	registerAll = (() => ({})._register(function registerAll(obj, ...funcList) {
		return fromEntries(funcList.map(func => {
			const { value, opts } = func
			func = getFunc(value || func)
			return [funcName(func), obj._register(func, opts || {})]
		}))
	}))(),
	getProto = ({})._register({ getProto(obj = Object, i = 0) { return protoList(obj)[i] } }),
	protoList = ({})._register((function protoList(obj = Object) {
		const proto = obj ? obj.__proto__ : null
		this.objProto = this.objProto || proto
		this._protoList = this._protoList || []
		if (proto) {
			this._protoList.push(proto)
			protoList.call(this, proto)
		}
		getProto
		if (proto == this.objProto) {
			const _protoList = this._protoList
			this.objProto = null
			this._protoList = []
			return _protoList
		}
	}).bind({})),
	nodeList = document.querySelectorAll('html'),
	html = nodeList[0],
	htmlEl = html.getProto(),
	reverse = ({})._register({ reverse(obj) { return from(obj).reverse() } }),
	getAll = htmlEl._register(function getAll(el = 'html', target = document) {
		if (el instanceof HTMLElement) [el, target] = arguments.reverse()
		return target.querySelectorAll(el)
	}),
	getStyles = htmlEl._register({ getStyles(el) { return el.currentStyle || getComputedStyle(el, '') } }), // IE || другой браузер
	get = htmlEl._register({ get(el = 'html', target = document) { return target.querySelector(el) } }),
	addEvent = htmlEl._register({ addEvent(el, event, cb) { return (el ? el : document).addEventListener(event, cb) } }),
	setHtml = htmlEl._register({ setHtml(target = '', pos = 'beforeend', html = '') {
		return (target ? target : document).insertAdjacentHTML(pos, html) } }),
	create = (el = 'div') => document.createElement(el),
	getRect = htmlEl._register({ getRect(el = document) { return el.getBoundingClientRect() } }),
	filter = nodeList._register({ filter(obj, cb) { return [].filter.call(obj, cb) } }),
	clearClasses = nodeList._register(function clearClasses(target, ...classList) {
		target.filter(placeholder => {
			let contains = false
			classList.forEach(_class => { if (placeholder.classList.contains(_class)) contains = true })
			return contains
		}).forEach(placeholder => placeholder.classList.remove(classList))
	})

html.classList.add('active')
log(html.classList)

log(nodeList.filter(el => el))

nodeList.clearClasses('active')
log(html.classList)

log(html.getAll('body'))

log(nullProto)

log(nodeList.getProto())
log(htmlEl.getProto())

log(nodeList.getProto().hasOwn('filter'))

const helpers = ({}).registerAll(
	{ getProto2(obj = Object, i = 0) { return protoList(obj)[i] } },
	(function protoList2(obj = Object) {
		const proto = obj ? obj.__proto__ : null
		this.objProto = this.objProto || proto
		this._protoList = this._protoList || []
		if (proto) {
			this._protoList.push(proto)
			protoList.call(this, proto)
		}
		getProto
		if (proto == this.objProto) {
			const _protoList = this._protoList
			this.objProto = null
			this._protoList = []
			return _protoList
		}
	}).bind({})
)

log(helpers)
