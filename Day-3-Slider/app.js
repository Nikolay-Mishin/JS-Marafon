const w = 2000,
	desc = 'History & Travel',
	data = [
		{
			url: '1628107073262-e086371689a6',
			bg: '220.16deg, #bf936c -8%, #271c0b 138%',
			title: 'Sunrays at St. Marks square'
		},
		{
			url: '1628106881749-88bf2fb79103',
			bg: '221.87deg, #605d4e 1%, #aba6a2 128%',
			title: 'St. Marks basilica at sunrise'
		},
		{
			url: '1583435292794-4803a56c5043',
			bg: '215.32deg, #e8be5d -1%, #201d1a 124%',
			title: 'Shwezigon Pagoda'
		},
		{
			url: '1589360395642-bfb140284700',
			bg: '229.99deg, #c9a15f -26%, #3c6114 145%',
			title: 'Leeds Castle taken from across the moat in late Autumn sunshine'
		},
		{
			url: '1628523300960-01e94dec7519',
			bg: '229.99deg, #947435 -26%, #ecd7d4 145%',
			title: 'Breathtaking Byzantine mosaics of the 14th century at the Chora Church, Istanbul'
		}
	]

const slidesPlugin = (slides = 2) => {
	if (slides < 2) throw new Error('slidesCount could not be < 2')
	
	const sidebar = document.querySelector('.sidebar'),
		controls = document.querySelector('.controls'),
		container = document.querySelector('.container'),
		mainSlide = document.querySelector('.main-slide')

	let sidebarHtml = '',
		slidesHtml = ''

	data.forEach((slide, i) => {
		slidesHtml += '<div></div>'
		sidebarHtml += `<div>
				<h1>${data[slides - 1 - i].title}</h1>
				<p>${data[slides - 1 - i].desc || desc}</p>
			</div>`
	})
	
	sidebar.insertAdjacentHTML('beforeend', sidebarHtml)
	mainSlide.insertAdjacentHTML('beforeend', slidesHtml)

	const sidebarSlides = sidebar.querySelectorAll('div'),
		mainSlides = mainSlide.querySelectorAll('div'),
		slidesCount = mainSlides.length
	let activeSlideIndex = 0

	const changeSlide = (direction) => {
		if (direction === 'up') {
			activeSlideIndex++
			if (activeSlideIndex === slidesCount) {
				activeSlideIndex = 0
			}
		} else if (direction === 'down') {
			activeSlideIndex--
			if (activeSlideIndex < 0) {
				activeSlideIndex = slidesCount - 1
			}
		}

		const height = container.clientHeight
		mainSlide.style.transform = `translateY(-${activeSlideIndex * height}px)`
		sidebar.style.transform = `translateY(${activeSlideIndex * height}px)`
	}

	mainSlides.forEach((slide, i) => {
		slide.setAttribute('style', `background-image: url('https://images.unsplash.com/photo-${data[i].url}?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=${data[i].w || w}&q=80');`)
		sidebarSlides[slidesCount - 1 - i].setAttribute('style', `background: linear-gradient(${data[i].bg});`)
	})

	sidebar.style.top = `-${(slidesCount - 1) * 100}vh`

	controls.addEventListener('click', ({ target }) => {
		if (action = target.dataset.action || target.parentNode.dataset.action) {
			changeSlide(action)
		}
	})
}

slidesPlugin(data.length)
