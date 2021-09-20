const controls = document.querySelector('.controls')
const upBtn = document.querySelector('.up-button')
const downBtn = document.querySelector('.down-button')
const sidebar = document.querySelector('.sidebar')
const sidebarSlides = sidebar.querySelectorAll('div')
const container = document.querySelector('.container')
const mainSlide = document.querySelector('.main-slide')
const mainSlides = mainSlide.querySelectorAll('div')
const slidesCount = mainSlides.length
let activeSlideIndex = 0

const w = 1950,
	data = [
		{
			url: '1601574968106-b312ac309953',
			w: 1996,
			bg: '220.16deg, #FFE101 -8%, #F39102 138%'
		},
		{
			url: '1511447333015-45b65e60f6d5',
			w: 2023,
			bg: '221.87deg, #8308EA 1%, #5305AF 128%'
		},
		{
			url: '1501529301789-b48c1975542a',
			bg: '215.32deg, #F90306 -1%, #9E0706 124%'
		},
		{
			url: '1520263115673-610416f52ab6',
			bg: '229.99deg, #11DEE9 -26%, #017E8B 145%'
		}
	]

mainSlides.forEach((slide, i) => {
	slide.setAttribute('style', `background-image: url('https://images.unsplash.com/photo-${data[i].url}?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=${data[i].w || w}&q=80');`)
	sidebarSlides[slidesCount - 1 - i].setAttribute('style', `background: linear-gradient(${data[i].bg});`)
})

sidebar.style.top = `-${(slidesCount - 1) * 100}vh`

controls.addEventListener('click', ({ target }) => {
	if (action = target.dataset.action || target.parentNode.dataset.action) {
		changeSlide(action)
	}
	console.log(action)
	console.log(target.dataset)
	console.log(target)
})

//upBtn.addEventListener('click', () => {
//    changeSlide('up')
//}) 

//downBtn.addEventListener('click', () => {
//    changeSlide('down')
//}) 

function changeSlide(direction) {
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

