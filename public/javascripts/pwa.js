
document.addEventListener('DOMContentLoaded', init, false);

let deferredPrompt;
let SERVICEWORKER;
let FIREBASEMESSAGING;

$(document).ready( function() {

	const isIos = () => {
	  const userAgent = window.navigator.userAgent.toLowerCase();
	  return /iphone|ipad|ipod/.test( userAgent );
	}
	// Detects if device is in standalone mode
	const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);



	window.addEventListener('beforeinstallprompt', (e) => {
		//Prevents older chrome from automatically showing prompt
		e.preventDefault();

		//Stash event
		deferredPrompt = e;
		// showInstallPromotion();

		$('#installApp').removeClass('d-none')
		

	})

	window.addEventListener('appinstalled', (e) => {
		console.log("adding logs: ", CURRENTUSER)
		FIREBASEANALYTICS.logEvent('moodtracker_installed', CURRENTUSER)
	})

	$('#installApp').click(() => {
		installApp()
	})

	$('#modalInstall').click(() => {
		installApp()
	})

	$('#iosOkay').click(() => {
		$('#iosInstallModal').modal('hide')
	})


})

function installApp() {
	console.log("Installing app...")

	// Checks if should display install popup notification:
	if (isIos() && !isInStandaloneMode()) {
		$('#iosInstallModal').modal('show')
	} else if (!isIos()) {
		deferredPrompt.prompt();
		deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				console.log("User accepted A2HS prompt")
			}

			deferredPrompt = null
			$('#installAppModal').modal('hide')
		})
	}


}

function init() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then((reg) => {
        console.log('Service worker registered -->', reg);
        SERVICEWORKER = reg

        try {
	        FIREBASEMESSAGING = firebase.messaging();
			FIREBASEMESSAGING.useServiceWorker(SERVICEWORKER)
        } catch (e) {
        	console.log("Firebase error creating messaging service... Most likely offline.")
        }


      }, (err) => {
        console.error('Service worker not registered -->', err);
      });
  }
}

function generateMessageToken() {	
	try {
		FIREBASEMESSAGING.getToken().then( (token) => {
			console.log("***Firebase***: messaging token generated")
			setMessageToken(token).then((resultBool) => {
				if (resultBool) {
					console.log("***IndexDB***: token submitted to databases.")
				} else {
					console.log("***IndexDB***: unable to write message token to database")
					displayWarning("Unable to enable notifications.")
				}
			})
		}).catch( (err) => {
			console.log("Error getting messaging token...")
			console.log(err)
		})

		FIREBASEMESSAGING.onMessage(payload => {
			console.log("Message received. ", payload);
			navigator.serviceWorker.getRegistration().then(function(reg) {
		      let {title, ...options } = payload.notification;
		      options.icon = '/../images/icon2.png'
		      options.badge = '/../images/icon2.png'
		      reg.showNotification(title, options);
		    });
			
		})
	} catch (e) {
		console.log("***Firebase***: unable to generate message token")
		console.log(e)
	}

}

function deleteMessageToken() {
	try {
		token = FIREBASEMESSAGING.getToken().then( (token) => {

		FIREBASEMESSAGING.deleteToken(token).then( (bool) => {


			if (bool) {
				console.log('***Firebase***: Successfully deleted token')
				setMessageToken(token).then((resultBool) => {
					if (resultBool) {
						console.log("***IndexDB***: Token removed from databases.")
					} else {
						console.log("***IndexDB***: unable to remove message token to database")
					}
				})
			} else {
				console.log('***Firebase***: Error disabling messaging token')
			}
		})

		})
	} catch (e) {
		console.log("***Firebase***: error when deleting message token... Most likely offline")
		console.log(e)
	}
	

}