const filter = (obj, cb) => [].filter.call(obj, cb),
	register = (obj, prop, value) => obj.__proto__[prop] = value,
	item = document.querySelector('.item'),
	placeholders = document.querySelectorAll('.placeholder'),
	clearClasses = function (target, ...classList) { target.filter(placeholder => {
			let contains = false;
			classList.forEach(_class => { if (placeholder.classList.contains(_class)) contains = true });
			return contains;
		}).forEach(placeholder => placeholder.classList.remove(classList))
	}

register(placeholders, 'filter', function (cb) { return filter(this, cb) }) // NodeList
register(placeholders, 'clearClasses', function (...classList) { return clearClasses(this, ...classList) })

item.addEventListener('dragstart', dragstart)
item.addEventListener('dragend', dragend)

placeholders.forEach(placeholder => {
	placeholder.addEventListener('dragover', dragover)
	placeholder.addEventListener('dragenter', dragenter)
	placeholder.addEventListener('dragleave', dragleave)
	placeholder.addEventListener('drop', drop)
})

function dragstart({ target }) {
	target.classList.add('hold')
	setTimeout(() => target.classList.add('hide'), 0)
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


