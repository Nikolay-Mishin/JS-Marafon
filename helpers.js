const { log } = console,
	error = msg => { throw new Error(msg) },
	{ assign } = Object,
	getProto = (obj, i = 0) => protoList(obj)[i],
	protoList = (function protoList(obj) {
		const proto = obj ? obj.__proto__ : null
		this.objProto = this.objProto || proto
		this.protoList = this.protoList || []
		if (proto) {
			this.protoList.push(proto)
			protoList.call(this, proto)
		}
		if (proto == this.objProto) {
			const _protoList = this.protoList
			this.objProto = null
			this.protoList = []
			return _protoList
		}
	}).bind({}),
	objProto = getProto(Object, 1),
	hasOwn = (obj, prop) => {
		const hasOwn = (obj, prop) => obj.hasOwnProperty(prop)
		if (!objProto.hasOwnProperty('hasOwn')) {
			Object.defineProperty(objProto, 'hasOwn', { value: function (prop) { return hasOwn(this, prop) } })
		}
		return hasOwn(obj, prop);
	},
	define = (obj, value = null, { prop = '', enumerable = false, configurable = false, writable = false, get, set } = {}) => {
		prop = prop || value.name
		if (!hasOwn(obj, prop)) {
			Object.defineProperty(obj, prop, assign({ enumerable, configurable }, get || set ? { get, set } : { value, writable }))
		}
		return value
	},
	register = define(objProto,
		function register(obj, { prop, value, func, def, enumerable = false, configurable = false, writable = false, get, set } = {}) {
			prop = prop || (value || func).name
			if (value && func) value.func = func
			else if (func) {
				const _func = {
					[prop]: function (...args) { log(this); return _func[prop].func(this, ...args) }
				}
				_func[prop].func = func
				value = _func[prop]
			}
			if (obj.__proto__ && !hasOwn(obj.__proto__, prop)) {
				!def ? obj.__proto__[prop] = value :
					define(obj.__proto__, value, { prop, enumerable, configurable, writable, get, set })
			}
			return func ? func : value;
		}
	),
	nodeList = document.querySelectorAll('html'),
	html = nodeList[0],
	htmlEl = getProto(html),
	getAll = register(htmlEl, {
		func: function getAll(el = 'html', target = document) {
			if (el instanceof HTMLElement) {
				const _el = target
				target = el
				el = _el
			}
			return target.querySelectorAll(el)
		}
	}),
	getStyles = el => el.currentStyle || getComputedStyle(el, ''), // IE || другой браузер
	get = (el = 'html', target = document) => target.querySelector(el),
	addEvent = (el, event, cb) => (el ? el : document).addEventListener(event, cb),
	setHtml = (target = '', pos = 'beforeend', html = '') => (target ? target : document).insertAdjacentHTML(pos, html),
	create = (el = 'div') => document.createElement(el),
	getRect = (el = document) => el.getBoundingClientRect(),
	filter = register(nodeList, {
		func: function filter(obj, cb) { return [].filter.call(obj, cb) }
	}),
	clearClasses = register(nodeList, {
		func: function clearClasses(target, ...classList) {
			target.filter(placeholder => {
				let contains = false
				classList.forEach(_class => { if (placeholder.classList.contains(_class)) contains = true })
				return contains
			}).forEach(placeholder => placeholder.classList.remove(classList))
		}
	})

html.classList.add('active')
log(html.classList)

log(nodeList.filter(function (el) { return el }))

nodeList.clearClasses('active')
log(html.classList)

log(html.getAll('body'))

log(objProto)

log(protoList(nodeList))
log(protoList(html))

log(objProto.hasOwn('hasOwn'))
log(getProto(nodeList).hasOwn('filter'))
