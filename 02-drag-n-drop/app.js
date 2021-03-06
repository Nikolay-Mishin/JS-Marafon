const item = get('.item'),
	placeholders = getAll('.placeholder')
	
register(placeholders, 'filter', function (cb) { return filter(this, cb) }) // NodeList
register(placeholders, 'clearClasses', function (...classList) { return clearClasses(this, ...classList) })

addEvent(item, 'dragstart', dragstart)
addEvent(item, 'dragend', dragend)

placeholders.forEach(placeholder => {
	addEvent(placeholder, 'dragover', dragover)
	addEvent(placeholder, 'dragenter', dragenter)
	addEvent(placeholder, 'dragleave', dragleave)
	addEvent(placeholder, 'drop', drop)
})

function dragstart({ target }) {
	target.classList.add('hold')
	setTimeout(() => target.classList.add('hide'))
}

function dragend({ target }) {
	//target.classList.remove('hold', 'hide')
	target.className = 'item'
}

function dragover(event) {
	event.preventDefault()
	placeholders.filter(placeholder => !placeholder.isEqualNode(event.target))
		.forEach(placeholder => placeholder.classList.add('drop'))
}

function dragenter({ target }) {
	target.classList.add('hovered')
	target.classList.remove('drop')
}

function dragleave({ target }) {
	target.classList.remove('hovered')
	target.classList.add('drop')
}

function drop({ target }) {
	target.classList.remove('hovered')
	placeholders.clearClasses('drop')
	target.append(item)
}
