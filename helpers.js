const { log } = console,
	error = msg => { throw new Error(msg) },
	hasOwn = (obj, prop) => obj.hasOwnProperty(prop),
	register = (obj, { value, prop, _, def = false, enumerable = true, configurable = false, writable = false, get, set } = {}) => {
		//const func = {
		//	[value.name]: function (...args) { log(this); log(args); log([value.name]); log([value.name]._); /*return [value.name]._(this, ...args)*/ }
		//}
		//func[value.name]._ = _
		//log(func[value.name].name)
		//log(func[value.name])
		//log(func[value.name]._)
		//func[value.name]()
		prop = prop || value.name
		if (_) value._ = _
		if (obj.__proto__ && !hasOwn(obj.__proto__, prop)) {
			!def ? obj.__proto__[prop] = value :
				define(obj.__proto__, value, { prop, enumerable, configurable, writable, get, set })
		}
		return _ ? _ : value;
	},
	define = (obj, value = null, { prop = '', enumerable = true, configurable = false, writable = false, get, set } = {}) => {
		prop = prop || value.name
		return hasOwn(obj, prop) ? value :
			Object.defineProperty(obj, prop, assign({ enumerable, configurable }, get || set ? { get, set } : { value, writable }))
	},
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
	getAll = register(getProto(document.querySelectorAll('html')[0]), {
		value: function getAll(el = 'html') { log(this); return getAll._(el, this) },
		_: (el = 'html', target = document) => target.querySelectorAll(el)
	}),
	nodeList = getAll(),
	html = nodeList[0],
	htmlEl = getProto(html),
	getStyles = el => el.currentStyle || getComputedStyle(el, ''), // IE || другой браузер
	get = (el = 'html', target = document) => target.querySelector(el),
	addEvent = (el, event, cb) => (el ? el : document).addEventListener(event, cb),
	setHtml = (target = '', pos = 'beforeend', html = '') => (target ? target : document).insertAdjacentHTML(pos, html),
	create = (el = 'div') => document.createElement(el),
	getRect = (el = document) => el.getBoundingClientRect(),
	filter = register(nodeList, {
		value: function filter(cb) { log(this); return filter._(this, cb) },
		_: (obj, cb) => [].filter.call(obj, cb)
	}),
	clearClasses = register(nodeList, {
		value: function clearClasses(...classList) { log(this); return clearClasses._(this, ...classList) },
		_: (target, ...classList) => {
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
