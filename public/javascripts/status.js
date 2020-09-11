document.addEventListener('DOMContentLoaded', init, false);

function init() {
	const statusElem = document.querySelector('.page-status')

	if (!navigator.onLine) {
		statusElem.innerHTML = 'offline'
	}

}