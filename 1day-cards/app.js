const slides = document.querySelectorAll('.slide') 

for (const slide of slides) {
    slide.addEventListener('click', () => {
        clearActiveClasses()
        slide.classList.add('active')
        console.log()
        slide.getElementsByClassName('caption')[0].classList.add('active')
    })
}

function clearActiveClasses() {
    slides.forEach((slide) => {
        slide.classList.remove('active')
        slide.getElementsByClassName('caption')[0].classList.remove('active')
    })
}