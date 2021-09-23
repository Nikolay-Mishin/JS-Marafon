const { log } = console,
	get = (el, target = document) => target.querySelector(el),
	getAll = (el, target = document) => target.querySelectorAll(el),
	addEvent = (el, event, cb) => (el ? el : document).addEventListener(event, cb),
	create = (el = 'div') => document.createElement(el),
	filter = (obj, cb) => [].filter.call(obj, cb),
	register = (obj, prop, value) => obj.__proto__[prop] = value,
	define = (obj, prop = '', value = null, { enumerable = true, configurable = false, writable = false, get, set } = {}) => {
		const descDefault = { enumerable, configurable },
			desc = assign(descDefault, value ? { value, writable } : { get, set });
		return hasOwn(obj, prop) ? value : Object.defineProperty(obj, prop, desc);
	},
	clearClasses = function (target, ...classList) {
		target.filter(placeholder => {
			let contains = false;
			classList.forEach(_class => { if (placeholder.classList.contains(_class)) contains = true });
			return contains;
		}).forEach(placeholder => placeholder.classList.remove(classList))
	},
	protoList = (function _protoList(obj) {
		const proto = obj.__proto__;
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

log(Object)
log(({}).__proto__)

log(NodeList)
log(NodeList.__proto__.__proto__)

log(HTMLDivElement)
//log(HTMLDivElement.__proto__)
//log(HTMLDivElement.__proto__.__proto__)
//log(HTMLDivElement.__proto__.__proto__.__proto__)
//log(HTMLDivElement.__proto__.__proto__.__proto__.__proto__)
//log(HTMLDivElement.__proto__.__proto__.__proto__.__proto__.__proto__)
log(HTMLDivElement.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__)

const containers = getAll('.container'),
	container = get('.container'),
	title = getAll('title'),
	div = create(),
	h3 = create('h3'),
	body = create('body'),
	html = create('html'),
	_document = create('document'),
	textNode = document.createTextNode('А вот и я');

log(containers)
//log(containers.__proto__)
log(containers.__proto__.__proto__)

log(container)
log(container.__proto__)
//log(container.__proto__.__proto__)
//log(container.__proto__.__proto__.__proto__)
//log(container.__proto__.__proto__.__proto__.__proto__)
//log(container.__proto__.__proto__.__proto__.__proto__.__proto__)
log(container.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__)

log(title)
//log(title.__proto__)
log(title.__proto__.__proto__)

//log(div)
//log(div.__proto__)
//log(div.__proto__.__proto__)

//log(h3)
//log(h3.__proto__)
//log(h3.__proto__.__proto__)

//log(body)
//log(body.__proto__)
//log(body.__proto__.__proto__)

//log(html)
//log(html.__proto__)
//log(html.__proto__.__proto__)

//log(_document)
//log(_document.__proto__)
//log(_document.__proto__.__proto__)

//log(_document)
//log(_document.__proto__)
//log(_document.__proto__.__proto__)

log(textNode)
log(textNode.__proto__)
log(textNode.__proto__.__proto__)

register(containers, 'filter', function (cb) { return filter(this, cb) })
register(containers, 'clearClasses', function (...classList) { return clearClasses(this, ...classList) })

slidesPlugin(3)

function slidesPlugin(activeSlide = 0) {
	const container = get('.container'),
		slides = getAll('.slide'),
		w = 800,
		data = [
			{
				url: '1628107073262-e086371689a6'
			},
			{
				url: '1628106881749-88bf2fb79103'
			},
			{
				url: '1583435292794-4803a56c5043'
			},
			{
				url: '1589360395642-bfb140284700'
			},
			{
				url: '1628523300960-01e94dec7519',
				w: 335
			},
			{
				url: '1631295156305-6afe3f42b767',
				w: 357
			},
			{
				url: '1630090220340-367fba0abb53',
				w: 282
			},
			{
				url: '1630085808419-1a7029476a2f',
				w: 334
			}
		]

	slides[activeSlide].classList.add('active')

	slides.forEach((slide, i) => {
		slide.setAttribute('style', `background-image: url('https://images.unsplash.com/photo-${data[i].url}?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=${data[i].w || w}&q=80');`)
	})

	addEvent(container, 'click', ({ target }) => {
		if ((slide = target.classList.contains('slide')) || target.parentNode.classList.contains('slide')) {
			//get('.active', container).classList.remove('active')
			slides.clearClasses('active')
			slide = slide ? target : target.parentNode
			slide.classList.add('active')
		}
	})
}
