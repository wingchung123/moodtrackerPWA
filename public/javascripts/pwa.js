
document.addEventListener('DOMContentLoaded', init, false);

let deferredPrompt;
let SERVICEWORKER;
let FIREBASEMESSAGING;

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
        SERVICEWORKER = reg

        FIREBASEMESSAGING = firebase.messaging();
		FIREBASEMESSAGING.useServiceWorker(SERVICEWORKER)

      }, (err) => {
        console.error('Service worker not registered -->', err);
      });
  }
}

function generateMessageToken() {
	console.log("generating message token")

	FIREBASEMESSAGING.getToken().then( (token) => {
		console.log("token generated")
		setMessageToken(token).then((resultBool) => {
			if (resultBool) {
				console.log("token submitted to databases.")
			} else {
				console.log("unable to write message token to database")
				displayWarning("Unable to enable notifications.")
			}
		})
	}).catch( (err) => {
		console.log("Error getting messaging token...")
		console.log(err)
	})

	FIREBASEMESSAGING.onMessage(payload => {
		console.log("Message received. ", payload);
		// const {title, ...options } = payload.notification;
	})
}

function deleteMessageToken() {

	token = FIREBASEMESSAGING.getToken().then( (token) => {

		FIREBASEMESSAGING.deleteToken(token).then( (bool) => {


			if (bool) {
				console.log('Successfully deleted token')
				setMessageToken(token).then((resultBool) => {
					if (resultBool) {
						console.log("Token removed from databases.")
					} else {
						console.log("unable to remove message token to database")
					}
				})
			} else {
				console.log('Error disabling messaging token')
			}
		})

	})

}