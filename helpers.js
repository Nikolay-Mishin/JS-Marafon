const { log } = console,
	error = msg => { throw new Error(msg) },
	getStyles = el => el.currentStyle || getComputedStyle(el, ''), // IE || другой браузер
	get = (el, target = document) => target.querySelector(el),
	getAll = (el, target = document) => target.querySelectorAll(el),
	getHtmlAll = () => getAll('html'),
	getHtml = () => htmlAll[0],
	addEvent = (el, event, cb) => (el ? el : document).addEventListener(event, cb),
	setHtml = (target = '', pos = 'beforeend', html = '') => (target ? target : document).insertAdjacentHTML(pos, html),
	create = (el = 'div') => document.createElement(el),
	getRect = (el = document) => el.getBoundingClientRect(),
	filter = (obj, cb) => [].filter.call(obj, cb),
	clearClasses = function (target, ...classList) {
		target.filter(placeholder => {
			let contains = false;
			classList.forEach(_class => { if (placeholder.classList.contains(_class)) contains = true });
			return contains;
		}).forEach(placeholder => placeholder.classList.remove(classList))
	},
	register = (obj, prop, value) => obj.__proto__[prop] = value,
	define = (obj, prop = '', value = null, { enumerable = true, configurable = false, writable = false, get, set } = {}) => {
		const descDefault = { enumerable, configurable },
			desc = assign(descDefault, value ? { value, writable } : { get, set });
		return hasOwn(obj, prop) ? value : Object.defineProperty(obj, prop, desc);
	},
	getProto = (obj, i = 0) => protoList(obj, i)
	protoList = (function _protoList(obj) {
		const proto = obj ? obj.__proto__ : null;
		this.objProto = this.objProto || proto;
		this.protoList = this.protoList || [];
		if (proto) {
			this.protoList.push(proto);
			_protoList.call(this, proto);
		}
		if (proto == this.objProto) {
			const protoList = this.protoList;
			this.objProto = null;
			this.protoList = [];
			return protoList;
		}
	}).bind({})
