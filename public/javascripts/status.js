document.addEventListener('DOMContentLoaded', init, false);

function init() {
	if (!navigator.onLine) {
		$('#footer').removeClass('d-none')
	}

}