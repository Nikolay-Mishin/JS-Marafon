const filter = (obj, cb) => [].filter.call(obj, cb),
	register = (obj, prop, value) => obj.__proto__[prop] = value,
	clearClasses = function (target, ...classList) {
		target.filter(placeholder => {
			let contains = false;
			classList.forEach(_class => { if (placeholder.classList.contains(_class)) contains = true });
			return contains;
		}).forEach(placeholder => placeholder.classList.remove(classList))
	},
	containers = document.querySelectorAll('.container')

register(containers, 'filter', function (cb) { return filter(this, cb) })
register(containers, 'clearClasses', function (...classList) { return clearClasses(this, ...classList) })

slidesPlugin(3)

function slidesPlugin(activeSlide = 0) {
	const container = document.querySelector('.container'),
		slides = document.querySelectorAll('.slide'),
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

	container.addEventListener('click', ({ target }) => {
		if ((slide = target.classList.contains('slide')) || target.parentNode.classList.contains('slide')) {
			//container.querySelector('.active').classList.remove('active')
			slides.clearClasses('active')
			slide = slide ? target : target.parentNode
			slide.classList.add('active')
		}
	})
}
