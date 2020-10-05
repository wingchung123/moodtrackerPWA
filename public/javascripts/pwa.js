
document.addEventListener('DOMContentLoaded', init, false);

let deferredPrompt;


$(document).ready( function() {


	window.addEventListener('beforeinstallprompt', (e) => {
		//Prevents older chrome from automatically showing prompt
		e.preventDefault();

		//Stash event
		deferredPrompt = e;
		// showInstallPromotion();

		$('#installApp').removeClass('d-none')
		
		//Install prompt
		console.log('showing modal...')
		$('#installAppModal').modal('show')
	})

	window.addEventListener('appinstalled', (e) => {
		app.logEvent('moodtracker', 'installed')
	})

	$('#installApp').click(() => {
		installApp()
	})

	$('#modalInstall').click(() => {
		installApp()
	})


})

function installApp() {
	console.log("Installing app...")
	deferredPrompt.prompt();
	deferredPrompt.userChoice.then((choiceResult) => {
		if (choiceResult.outcome === 'accepted') {
			console.log("User accepted A2HS prompt")
		}

		deferredPrompt = null
		$('#installAppModal').modal('hide')
	})
}

function init() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then((reg) => {
        console.log('Service worker registered -->', reg);
      }, (err) => {
        console.error('Service worker not registered -->', err);
      });
  }
}