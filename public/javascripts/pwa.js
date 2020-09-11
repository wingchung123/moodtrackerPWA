
document.addEventListener('DOMContentLoaded', init, false);


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

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
	//Prevents older chrome from automatically showing prompt
	e.preventDefault();

	//Stash event
	deferredPrompt = e;

	$('#button1').removeClass('d-none')
})

window.addEventListener('appinstalled', (e) => {
	app.logEvent('moodtracker', 'installed')
})

$('#button1').click(() => {
	deferredPrompt.prompt();
	deferredPrompt.userChoice.then((choiceResult) => {
		if (choiceResult.outcome === 'accepted') {
			console.log("User accepted A2HS prompt")
		}

		deferredPrompt = null
	})
})
