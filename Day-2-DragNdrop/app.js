const item = document.querySelector('.item'),
	placeholders = document.querySelectorAll('.placeholder'),
	dragStart = (event) => {
		//console.log('drag start', event.target)
		//console.log('drag start', this)
		event.target.classList.add('hold')
		setTimeout(() => event.target.classList.add('hide'), 0)
	},
	dragEnd = (event) => {
		//console.log('drag end')
		//event.target.classList.remove('hold', 'hide')
		event.target.className = 'item'
	},
	dragOver = (event) => {
		//console.log('drag over')
		event.preventDefault()
	},
	dragEnter = (event) => {
		event.target.classList.add('hovered')
		//console.log('drag enter')
	},
	dragLeave = (event) => {
		event.target.classList.remove('hovered')
		//console.log('drag leave')
	},
	dragDrop = (event) => {
		//console.log('drag drop')
		event.target.classList.remove('hovered')
		event.target.append(item)
	}

item.addEventListener('dragstart', dragStart)
item.addEventListener('dragend', dragEnd)

placeholders.forEach((placeholder) => {
	//console.log(placeholder)
	placeholder.addEventListener('dragover', dragOver)
	placeholder.addEventListener('dragenter', dragEnter)
	placeholder.addEventListener('dragleave', dragLeave)
	placeholder.addEventListener('drop', dragDrop)
})
