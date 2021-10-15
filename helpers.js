const { log } = console,
	error = msg => { throw new Error(msg) },
	{ assign, keys, fromEntries } = Object,
	{ from } = Array,
	nullProto = {}.__proto__,
	objProto = Object.prototype,
	arrProto = Array.prototype,
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
		return function register(obj, value, { prop, func, def = false, enumerable = false, configurable = false, writable = false, get, set } = {}) {
			const proto = obj.prototype ?? obj.__proto__;
			[value, prop] = [getFunc(value), prop ?? funcName(value)]
			if (func) value.func = func
			else {
				const _func = {
					[prop]: function (...args) { return _func[prop].func(this, ...args) }
				}
				_func[prop].func = value
				func = value
				value = _func[prop]
			}
			(def ? obj : proto)._define(value,
				{ prop, enumerable, configurable, writable: writable || proto === nullProto, get, set })
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
	defineAll = (() => ({})._register(function defineAll(obj, desc) { return Object.defineProperties(obj, desc) }))(),
	getDesc = (() => ({})._register(function getDesc(obj, key) { return Object.getOwnPropertyDescriptor(obj, key) }))(),
	// Такой вариант функции присваивания позволяет копировать методы доступа.
	assignDefine = (() => ({})._register(function assignDefine(target, ...sources) {
		sources.forEach(source => target.defineAll(fromEntries(keys(source).map(key => [key, {}.getDesc.call(source, key)]))));
		return target;
	}))()

function filterObj(obj, cb) { return Object.fromEntries(Object.entries(obj).filter(cb)) }

Object.defineProperty(nullProto, 'filter', { value: function filter(cb) { return filterObj(this, cb) } })

const helpers = ({}).registerAll(
	{ getProto(obj = Object, i = 0) { return obj.protoList()[i] } },
	(function protoList(obj = Object) {
		const proto = obj.prototype ?? obj.__proto__
		if (proto) {
			this.objProto = this.objProto ?? proto
			this._protoList = this._protoList ?? []
			this._protoList.push(proto)
			protoList.call(this, proto)
		}
		if (proto == this.objProto) {
			const _protoList = this._protoList
			this.objProto = null
			this._protoList = []
			return _protoList
		}
	}).bind({}),
	{ reverse(obj) { return from(obj).reverse() } }
),
	nodeList = document.querySelectorAll('html'),
	html = nodeList[0],
	htmlEl = html.getProto(),
	create = (el = 'div') => document.createElement(el),
	nodeListHelpers = nodeList.registerAll(
		{ filter(obj, cb) { return [].filter.call(obj, cb) } },
		function clearClasses(target, ...classList) {
			target.filter(placeholder => {
				log(placeholder)
				let contains = false
				classList.forEach(_class => { if (placeholder.classList.contains(_class)) contains = true })
				return contains
			}).forEach(placeholder => placeholder.classList.remove(classList))
		}
	),
	htmlElHelpers = htmlEl.registerAll(
		function getAll(el = 'html', target = document) {
			if (el instanceof HTMLElement) [el, target] = arguments.reverse()
			return target.querySelectorAll(el)
		},
		{ getStyles(el) { return el.currentStyle || getComputedStyle(el, '') } }, // IE || другой браузер
		{ get(el = 'html', target = document) { return target.querySelector(el) } },
		{ addEvent(el, event, cb) { return (el ? el : document).addEventListener(event, cb) } },
		{ setHtml(target = '', pos = 'beforeend', html = '') { return (target ? target : document).insertAdjacentHTML(pos, html) } },
		{ getRect(el = document) { return el.getBoundingClientRect() } },
	)

const { getProto, protoList, reverse } = helpers,
	{ filter, clearClasses } = nodeListHelpers,
	{ getAll, getStyles, get, addEvent, setHtml, getRect } = htmlElHelpers

Object.defineProperty(nullProto, '_filter', {
	value: function filter(cb) { return filterObj(this, cb) },
	enumerable: false,
	writable: false
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

helpers.assignDefine(nodeListHelpers, htmlElHelpers)

log(helpers)

//log(nullProto)
//log(objProto)
//log(arrProto)

//log(Array.protoList())
//log(Array.prototype)

//log([].protoList())
//log([].prototype)

//log(filter)
//log(nodeList.filter)
//log({}.filter)
//log([].filter)
//log(Object.filter)

//log([].getProto())
//log([].getProto(1))
//log({}.prototype)
//log([].prototype)
//log(nodeList.__proto__)
//log(nodeList.prototype)

//log(Object.hasOwn('filter'))
//log({}.hasOwn('filter'))
//log(nodeList.hasOwn('filter'))
//log(nullProto.hasOwn('filter'))
//log(nodeList.__proto__.hasOwn('filter'))
