const { log } = console,
	error = msg => { throw new Error(msg) }

const getFunc = func => func[keys(func).shift()] ?? func

const { assign, keys, values, fromEntries, entries, getPrototypeOf } = Object,
	{ isArray, from } = Array,
	nullProto = {}.__proto__,
	objProto = Object.prototype,
	arrProto = Array.prototype,
	funcName = func => func.name.replace('bound ', '').trim(),
	is = (context, obj) => (function (obj) { return obj != null && obj.constructor === this; }).call(context, obj),
	isObject = obj => is(Object, obj),
	isFunc = obj => is(Function, obj),
	// return {} => __proto__ = obj
	// new Object(obj) - return obj => __proto__ = obj.__proto__
	createObj = (proto = Object, props) => Object.create(proto, props),
	createAssign = (proto = Object, ...assignList) => assign(createObj(proto), ...assignList),
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
			function _register({ prop, value, def, enumerable = false, configurable = false, writable = false, get, set } = {}) { return register(this, ...arguments) }
		);
		return function register(obj, value, { prop, def = false, enumerable = false, configurable = false, writable = false, get, set } = {}) {
			const proto = obj.prototype ?? obj.__proto__;
			[value, prop] = [getFunc(value), prop ?? funcName(value)]

			const func = value,
				_func = {
					[prop]: function (...args) { return _func[prop].func(this, ...args) }
				}

			_func[prop].func = value
			value = _func[prop];

			(def ? obj : proto)._define(value,
				{ prop, enumerable, configurable, writable: writable || proto === nullProto, get, set })

			return func
		};
	})(),
	registerAll = (() => ({})._register(function registerAll(obj, ...funcList) {
		return fromEntries(funcList.map(func => {
			const { value, opts = {} } = func
			func = getFunc(value || func)
			return [funcName(func), obj._register(func, opts)]
		}))
	}))()

function filterObj(obj, cb) { return Object.fromEntries(Object.entries(obj).filter(cb)) }

Object.defineProperty(nullProto, 'filter', { value: function filter(cb) { return filterObj(this, cb) } })

const helpers = ({}).registerAll(
	log,
	assign, keys, values, fromEntries, entries, getPrototypeOf, isArray, from,
	funcName, is, isObject, isFunc,
	function getProto(obj = Object, i = 0) { return obj.protoList()[i] },
	(function protoList(obj = Object) {
		const proto = obj.prototype ?? obj.__proto__
		if (proto) {
			this.objProto = this.objProto ?? proto
			this._protoList = this._protoList ?? []
			this._protoList.push(proto)
			protoList.call(this, proto)
		}
		if (proto == this.objProto) {
			const _protoList = this._protoList;
			[this.objProto, this._protoList] = [null, []]
			return _protoList
		}
	}).bind({}),
	function forEach(obj, cb) { for (let key in obj) cb(obj[key], key) },
	function defineAll(obj, desc) { return Object.defineProperties(obj, desc) },
	function getDesc(obj, key) { return Object.getOwnPropertyDescriptor(obj, key) },
	// Такой вариант функции присваивания позволяет копировать методы доступа
	function assignDefine(target, ...sources) {
		sources.forEach(source => defineAll(target, fromEntries(keys(source).map(key => [key, getDesc(source, key)]))))
		return target
	},
	function toJson(item, space = null, replacer = null) { return JSON.stringify(item, replacer, space) },
	function isJson(item) { return item.jsonParse() ? true : false },
	function jsonParse(item) {
		try {
			item = JSON.parse(item)
		}
		catch (e) {
			return null
		}
		return item
	},
	function empty(obj) { return(obj.isObject() ? obj.keys() : obj).length == 0 },
	function _filter(obj, cb) { return obj.entries().filter(cb).fromEntries() },
	function concat(...list) { return [].concat.apply([], ...list) },
	function slice(obj, i = 0) { return [].slice.call(obj, i) },
	function $delete(obj, ...keys) { keys.forEach(key => delete obj[key]); return obj },
	function reverse(obj, cb = null, $this = obj) {
		const oldLength = obj.length
		if (!oldLength) obj.length = obj.keys().length
		obj = obj.isObject() ? [].reverse.call(obj) : from(obj, cb ?? (v => v), $this).reverse()
		if (!oldLength && obj.isObject()) obj.$delete('length')
		return obj
	},
	function renameKeys(obj, { keyList, searchVal = '^_|\W', replaceVal = '' } = {}) {
		keyList = keyList ?? arguments.slice(1)
		const newKeys = keyList.map((key, i) => {
			key = key.replace(new RegExp(searchVal), replaceVal)
			obj[key] = obj[keyList[i]]
			return key
		})
		$delete(obj, ...keyList)
		return newKeys
	}
)

const nodeList = document.querySelectorAll('html'),
	html = nodeList[0],
	htmlEl = html.getProto(),
	create = {}._register(function create(el = 'div') { return document.createElement(el) }),
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
			log([el, target])
			return target.querySelectorAll(el)
		},
		{ getStyles(el) { return el.currentStyle || getComputedStyle(el, '') } }, // IE || другой браузер
		{ get(el = 'html', target = document) { return target.querySelector(el) } },
		{ addEvent(el, event, cb) { return (el ? el : document).addEventListener(event, cb) } },
		function setHtml(target = '', pos = 'beforeend', html = '') {
			return (target ? target : document).insertAdjacentHTML(pos, html);
		},
		{ getRect(el = document) { return el.getBoundingClientRect() } },
	)

const {
	getProto, protoList, forEach, defineAll, getDesc, assignDefine,
	toJson, isJson, jsonParse, empty, _filter, concat, slice, $delete, reverse, renameKeys,
} = helpers,
	{ filter, clearClasses } = nodeListHelpers,
	{ getAll, getStyles, get, addEvent, setHtml, getRect } = htmlElHelpers

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
