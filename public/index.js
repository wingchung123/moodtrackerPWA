var db;
const emotions = ['joy', 'sadness', 'anger', 'fear', 'disgust']
var SELECTEDEMOTION = ""
var CURRENTUSER;
var FULLRANGEMOVED = false;
var HEALTHYRANGEMOVED = false;
var BUSYRANGEMOVED = false;


$(document).ready( function() {


	// Setup app bar & tab bar
	$('.mdc-tab').css('margin-top', $('.mdc-top-app-bar').outerHeight() + 'px')
	$('#navBuffer').css('margin-bottom', $('.mdc-top-app-bar').outerHeight() + $('.mdc-tab').outerHeight() + 'px')
	$('#footerBuffer').css('margin-top', ($('#footer').outerHeight() + 5)+ 'px')

	tabBarScrollSetup()

	const mdcTopNavBar = new mdc.topAppBar.MDCTopAppBar(document.querySelector('.mdc-top-app-bar'))

	
	// const ripple = new mdc.ripple.MDCRipple(document.querySelector('.mdc-ripple-surface'))
	// console.log(ripple)

	// login screen setup
	usernameLoginSetup()


	// JS for IndexDB
	const dbPromise = createIndexedDB();
	dbPromise.onerror = (err) => {
		displayError("Error: local database could not be initialized.")
	}
	dbPromise.onsuccess = (evt) => {
		// console.log(evt)
		db = dbPromise.result;
		getCurrentUser().then((userObject) => {
			if (userObject) {
				console.log("This is the current user: " + userObject.username)
				CURRENTUSER = userObject.username
				showLandingPage()
			} else {
				console.log("No active users found.")
				promptForUser()
			}
		})

		setupNotificationToggle()
	}


	

	// adds tab listeners
	tabBarSwitchingSetup()

	// journal tab setup
	const journalTextField = new mdc.textField.MDCTextField(document.querySelector('#journalTextInput'))
	jorunalSubmitSetup() 

	// sets up listeners for emotion imgs
	setupEmotionsSelector()
	$('#mealsNone').click( (e) => {
		$('#mealsResponse input:checkbox:checked').each((i, element) => {
			if (element.value != 'no-meals') {
				$(element).prop('checked', false)
			}
		})
	})
	// set up sliders
	setupHealthySlider()
	setupFullSlider()
	setupBusySlider()
	// set up input text field
	const eventsTextField = new mdc.textField.MDCTextField(document.querySelector('#eventsInput'))

	questionsSubmitSetup()


})

function notificationToggle(bool) {
	if (bool) {
		$('#notificationToggle').bootstrapToggle('on')
	} else {
		$('#notificationToggle').bootstrapToggle('off')
	}
}

function requestNotification() {
	if (!("Notification" in window)) {
		console.log("Notification not supported")
	}
	else {

		if (Notification.permission === "denied") {
			displayWarning("Notifications denied. Please enable them in your browser. <a href='https://support.google.com/chrome/answer/3220216?co=GENIE.Platform%3DDesktop&hl=en' target='_blank'>Click here for Chrome instructions</a>")
			notificationToggle(false)
		} else if (Notification.permission === "default") {
			Notification.requestPermission().then(function (permission) {
				// If the user accepts, let's create a notification
				if (permission === "granted") {
					console.log("Granted notification permission")
					notificationToggle(true)
					setNotificationValue(true)
				} else {
					console.log("Permission denied")
					notificationToggle(false)
					setNotificationValue(false)
				}
			});
		} else {
			// notifications are enabled by the browser. need to set local variable to reflect user change
			// console.log("notifications were already enabled. Need to disable.")
			// displayWarning("To disable notifications, disable them in your browser. <a href='https://usa.kaspersky.com/blog/disable-browser-notifications/18276/' target='_blank'>Click here for more help</a>")
			console.log("Toggling local db notification value")
			setNotificationValue($('#notificationToggle').prop('checked'))
		}
	}
}

function getNotificationValue(){
	return new Promise( function(resolve) {
		getCurrentUser().then( (userObject) => {
			return resolve(userObject.notification)
		})
	})
}

function setNotificationValue(notificationValue){
	return new Promise( function(resolve) {
		let userObject = getCurrentUser().then( (userObject) => {
			userObject.notification = notificationValue
			addData('users', userObject).then((successBool) => {
				return resolve(successBool)
			})
		})
		
	})
}

function setupNotificationToggle(){
	if ("Notification" in window && Notification.permission === "granted") {
		getNotificationValue().then( (notificationValue) => {
			notificationToggle(notificationValue)
		})
	}

    $('#notificationToggle').change(function(event) {
    	console.log("toggle change event fired")

    	if (!("Notification" in window) ){
    		displayWarning("Notifications not supported")
    	} else if ( !($(this).prop('checked')) && Notification.permission === "denied" ) {
    		//do nothing
    		console.log("Permission is denied & toggle is disabled")

    	} else {
    		requestNotification();
    	}
    })
}

// Index DB Functions
function createIndexedDB() {
  if (!('indexedDB' in window)) {
  	console.log("Database is not supported");
  	return null;
  }
  
  let request = window.indexedDB.open('pwaDB', 1, function(upgradeDb) {
  	console.log("within upgrade function...")
    createObjectStores(upgradeDb)
  });

  request.onupgradeneeded = (evt) => {
  	let database = evt.target.result;

  	database.onerror = (error) =>{
  		console.log(error)
  		displayError("Error: unable to load database for upgrade.")
  	}

  	createObjectStores(database);
  }

  return request
}


function createTransaction(objectStore, permissions) {
	const transaction = db.transaction(objectStore, permissions)

	transaction.oncomplete = (event) => {
		console.log("Transaction complete!")
	}

	transaction.onerror = (error) => {
		console.log(error)
		displayError("Error: database transaction failed.")
	}

	return transaction.objectStore(objectStore);
}

function createObjectStores(upgradeDB) {
	if (!upgradeDB.objectStoreNames.contains('users')) {
    	console.log("adding users objectstore")
		const usersOS = upgradeDB.createObjectStore('users', {keyPath: 'username'});
		usersOS.createIndex("isActiveColumn", "isActive", {unique:false} )

    }

   	if (!upgradeDB.objectStoreNames.contains('journalEntries')) {
    	console.log("adding journal entry objectstore")
		const usersOS = upgradeDB.createObjectStore('journalEntries', {keyPath: ['username', 'timestamp']});

    }

    if (!upgradeDB.objectStoreNames.contains('questionEntries')) {
    	console.log("adding question entry objectstore")
		const usersOS = upgradeDB.createObjectStore('questionEntries', {keyPath: ['username', 'timestamp']});

    }
}

function createDateObject() {
	const d = new Date()
	let date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear()

	let timestamp = Date.now()

	return {
		"timestamp": timestamp,
		"date": date,
		"day": d.getDay(),
		"timezoneOffset": d.getTimezoneOffset()
	}
}


function addData(objstore, entry) {
	return new Promise( function(resolve) {
		let request;
		try {
			let objectStore = createTransaction(objstore, "readwrite")
			request = objectStore.put(entry)
		} catch (exception) {
			console.log(exception)
			displayError("Error: unable to write to local database")
			return resolve(false)
		}

		request.onsuccess = (evt) => {
			return resolve(true)
		}

		request.onerror = (err) => {
			console.log(err)
			displayError("Error: unable to write to local database")
			return resolve(false)
		}
	})
}


async function uploadData(table,data) {
	// console.log("table is: " + table)
	// console.log(data)
	let payload = {
		"type": table,
		"data": data
	}
	try {
		const response = await fetch('https://747uwmtyk1.execute-api.us-east-1.amazonaws.com/dev2/update-db', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(payload)
		})
		let resp = await response.json()
		return await parseAPICall(resp)
	} catch (e) {
		console.log(e)
		displayWarning('Unable to upload entry... Entry is stored locally and will be uploaded once internet connection resumes.')
		return false;
	}

}

function uploadAndAddData(table, obj) {
	return new Promise(function(resolve){
		uploadData(table, obj).then((isUploaded) => {
			obj.uploadedToCloud = isUploaded
			addData(table, obj).then((bool) => {
				// console.log("upload: " + isUploaded)
				// console.log("bool: " + bool)
				let uploadedSuccessfully = (isUploaded) ? 1:0
				let storedLocally = (bool) ? 1:0
				return resolve(uploadedSuccessfully + storedLocally)
			})
		})
	})
}

function parseAPICall(response) {
	if ('errorMessage' in response) {
		displayWarning('Unable to upload entry... Entry is stored locally and will be uploaded once internet connection resumes.')
		console.log(response)
		return false
	} else {
		return true
	}
}


// Error & Success message
function displayError(error){
	$('#errorAlert').removeClass('d-none').hide().fadeIn(1000);
	$('#errorAlertBody').html(error)
	document.getElementById('navBuffer').scrollIntoView();

}

function displaySuccess(success){
	$('#successAlert').removeClass('d-none').hide().fadeIn(1000);
	$('#successAlertBody').html(success)
	document.getElementById('navBuffer').scrollIntoView();

}

function displayWarning(warning){
	$('#warningAlert').removeClass('d-none').hide().fadeIn(1000);
	$('#warningAlertBody').html(warning)
	document.getElementById('navBuffer').scrollIntoView();

}

function clearAlerts(){
	$('#successAlert').addClass('d-none')
	$('#errorAlert').addClass('d-none')
	$('#warningAlert').addClass('d-none')
}


// Submit button functions
function loadingSubmit(obj) {
	obj.prop("disabled", true);
	obj.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Loading...');
	clearAlerts()

}

function defaultSubmit(obj) {
	obj.prop("disabled", false);
	obj.html('Submit');
}


// User Functions
function createUser(username) {
	return new Promise( function(resolve) {
		let userObject = createDateObject()
		userObject.username = username
		userObject.isActive = "true"
		userObject.notification = "false"
		uploadAndAddData('users', userObject).then((successValue) => {
			return resolve(successValue)
		})


	})
}

function getCurrentUser() {
	return new Promise( function(resolve) {
		let objectStore = createTransaction('users', 'readonly')
		let currentUser;

		try {
			currentUser = objectStore.index('isActiveColumn').get("true")
		} catch (err) {
			console.log(err)
			displayError("Error: unable to get current user");
			return resolve(null);
		}

		currentUser.onsuccess = (evt) => {
			return resolve(evt.target.result);
		}

		currentUser.onerror = (err) => {
			console.log(err)
			displayError("Error: unable to get current user")
			return resolve(null);
		}
	})
}

function promptForUser() {
	$('#tabbar').addClass('d-none');
	$('#questions').addClass('d-none');
	$('#journal').addClass('d-none');
	$('#settings').addClass('d-none');
	$('#userLogin').removeClass('d-none');
}

function usernameLoginSetup() {
	// JS for username login screen
	const usernameInput = new mdc.textField.MDCTextField(document.querySelector('#username'))

	$('#usernameInput').on("keyup", function(event) {
	  // Number 13 is the "Enter" key on the keyboard
	  if (event.keyCode === 13) {
	    // Cancel the default action, if needed
	    event.preventDefault();
	    // Trigger the button element with a click
	    document.getElementById("usernameSubmit").click();
	  }
	});

	$('#usernameSubmit').click(function(event) {
		loadingSubmit($(this))
		createUser(usernameInput.value).then((userCreated) => {
			if(userCreated != 0) {
				CURRENTUSER = usernameInput.value;
				showLandingPage();
			} else {
				// error display should've been handled within promise
			}
		});
		
	})
}




// Page Navigation Functions
function showLandingPage(){
	setTimeout( function() {
		$('#tabbar').removeClass('d-none').hide().fadeIn(1000);
		$('#questions').removeClass('d-none').hide().fadeIn(1000);
		$('#userLogin').addClass('d-none');
		$('#journal').addClass('d-none');
		$('#settings').addClass('d-none');
	}, 300)
}

function switchTabs(tab) {

	clearAlerts()


	switch (tab){
		case 'questions':

			// Hide & fade in body content
			$('#questions').removeClass('d-none').hide().fadeIn(700);
			$('#userLogin').addClass('d-none');
			$('#journal').addClass('d-none');
			$('#settings').addClass('d-none');

			// Show indicators
			$('#questionsTab').addClass('mdc-tab--active')
			$('#questionsTab > .mdc-tab-indicator').addClass('mdc-tab-indicator--active')
			$('#journalTab').removeClass('mdc-tab--active')
			$('#journalTab > .mdc-tab-indicator').removeClass('mdc-tab-indicator--active')
			$('#settingsTab').removeClass('mdc-tab--active')
			$('#settingsTab > .mdc-tab-indicator').removeClass('mdc-tab-indicator--active')

			
			break;
		case 'journal':
			// Hide & fade in body content
			$('#journal').removeClass('d-none').hide().fadeIn(700);
			$('#userLogin').addClass('d-none');
			$('#questions').addClass('d-none');
			$('#settings').addClass('d-none');

			// Show indicators
			$('#journalTab').addClass('mdc-tab--active')
			$('#journalTab > .mdc-tab-indicator').addClass('mdc-tab-indicator--active')
			$('#questionsTab').removeClass('mdc-tab--active')
			$('#questionsTab > .mdc-tab-indicator').removeClass('mdc-tab-indicator--active')
			$('#settingsTab').removeClass('mdc-tab--active')
			$('#settingsTab > .mdc-tab-indicator').removeClass('mdc-tab-indicator--active')

			break;
		case 'settings':
			$('#settings').removeClass('d-none').hide().fadeIn(700);
			$('#userLogin').addClass('d-none');
			$('#journal').addClass('d-none');
			$('#questions').addClass('d-none');

			// Show indicators
			$('#settingsTab').addClass('mdc-tab--active')
			$('#settingsTab > .mdc-tab-indicator').addClass('mdc-tab-indicator--active')
			$('#questionsTab').removeClass('mdc-tab--active')
			$('#questionsTab > .mdc-tab-indicator').removeClass('mdc-tab-indicator--active')
			$('#journalTab').removeClass('mdc-tab--active')
			$('#journalTab > .mdc-tab-indicator').removeClass('mdc-tab-indicator--active')
			break;
	}
}

function tabBarScrollSetup() {
	if ($('.smart-scroll').length > 0) { // check if element exists
	    var last_scroll_top = 0;
	    $(window).on('scroll', function() {
	        scroll_top = $(this).scrollTop();
	        if(scroll_top < last_scroll_top) {
	            $('.smart-scroll').removeClass('scrolled-down').addClass('scrolled-up');
	        }
	        else {
	            $('.smart-scroll').removeClass('scrolled-up').addClass('scrolled-down');
	        }
	        last_scroll_top = scroll_top;
	    });
	}
}

function tabBarSwitchingSetup(){

	$('#questionsTab').click(function(event) {
		switchTabs('questions')
	})
	$('#journalTab').click(function(event) {
		switchTabs('journal')
	})
	$('#settingsTab').click(function(event) {
		switchTabs('settings')
	})

}


// Journal Functions
function jorunalSubmitSetup() {
	// JS for username login screen
	const journalTextInput = new mdc.textField.MDCTextField(document.querySelector('#journalTextInput'))

	// $('#journalTextInput').on("keyup", function(event) {
	//   // Number 13 is the "Enter" key on the keyboard
	//   if (event.keyCode === 13) {
	//     // Cancel the default action, if needed
	//     event.preventDefault();
	//     // Trigger the button element with a click
	//     document.getElementById("journalSubmit").click();
	//   }
	// });

	$('#journalSubmit').click(function(event) {
		loadingSubmit($(this))
		createJournalEntry(CURRENTUSER, journalTextInput.value).then((journalEntrySubmitted) => {
			if (journalEntrySubmitted != 0 ) {
				defaultSubmit($(this))
				displaySuccess("Jorunal Entry Submitted.")
				journalTextInput.value = ""
				console.log('jounral submitted...')
			} else {
				console.log('failed to submit journal entry')
			}
		})

		
	})
}


function createJournalEntry(username, journalEntry) {

	return new Promise( function(resolve) {
		setTimeout( function() {
			let journalObject = createDateObject();
			journalObject.username = username
			journalObject.entry = journalEntry
			uploadAndAddData("journalEntries", journalObject).then((successValue) => {
				return resolve(successValue)
			})}, 300)
	})
}


// Questions Functions
function setupEmotionsSelector(){
	emotions.forEach(function(emotion) {
		let selector = '#' + emotion
		$(selector).click(function(e) {
			clearEmotionSelection()
			$(selector).removeClass('not-selected')
			SELECTEDEMOTION = emotion
		})
	})
}

function clearEmotionSelection(){
	emotions.forEach(function(emotion) {
		let selector = '#' + emotion
		$(selector).addClass('not-selected')
	})
	SELECTEDEMOTION = ""
}

function clearQuestionsSelection(){
	clearEmotionSelection()

	$('input[name=activeOptions]:checked').prop('checked', false)
	$('#mealsResponse input:checkbox:checked').each((i, e) => { $(e).prop('checked', false)})
	$('input[name=snackOptions]:checked').prop('checked', false)


	FULLRANGEMOVED = false
	resetSlider('full')

	HEALTHYRANGEMOVED = false
	resetSlider('healthy')


	BUSYRANGEMOVED = false
	resetSlider('busy')
	$('input[name=productiveOptions]:checked').prop('checked', false)

	const eventsTextField = new mdc.textField.MDCTextField(document.querySelector('#eventsInput'))
	eventsTextField.value = ""

}

function createQuestionsEntry(username, questionRespObj) {

	return new Promise( function(resolve) {
		setTimeout( function() {
			let questionObject = Object.assign(createDateObject(), questionRespObj);
			questionObject.username = username
			uploadAndAddData("questionEntries", questionObject).then((successValue) => {
				return resolve(successValue)
			})}, 300)
	})
}

function questionsSubmitSetup() {
	$('#questionsSubmit').click(function(event) {
		loadingSubmit($(this))
		
		// console.log(getQuestionsValues())
		// console.log('Were all questions answered? ' + questionsAnswered() )

		if (questionsAnswered()) {
			createQuestionsEntry(CURRENTUSER, getQuestionsValues()).then((questionEntrySubmitted) => {
				if(questionEntrySubmitted != 0) {
					defaultSubmit($(this))
					displaySuccess("Questions Entry Submitted.")
					clearQuestionsSelection()
					console.log('question responses submitted')

				}
			})
		} else {
			defaultSubmit($(this))
			displayWarning("Please answer all required questions.")

		}
		
	})
}

function getQuestionsValues() {
	let questionsObject = {}

	questionsObject.selectedEmotion = SELECTEDEMOTION;
	questionsObject.activeResponse = $('input[name=activeOptions]:checked').val()
	questionsObject.mealsResponse = []
	$('#mealsResponse input:checkbox:checked').each((i, element) => {
		questionsObject.mealsResponse.push(element.value)
	})
	questionsObject.snackResponse = $('input[name=snackOptions]:checked').val()
	questionsObject.fullResponse = $('#fullRange').val()
	questionsObject.healthyResponse = $('#healthyRange').val()

	questionsObject.busyResponse = $('#busyRange').val()
	questionsObject.productiveResponse = $('input[name=productiveOptions]:checked').val()

	let eventsTextField = new mdc.textField.MDCTextField(document.querySelector('#eventsInput'))
	questionsObject.specialEvents = eventsTextField.value


	return questionsObject

}



function questionsAnswered(){
	let allQuestionsAnswered = true;

	allQuestionsAnswered = (SELECTEDEMOTION!="" && allQuestionsAnswered) ? true:false
	allQuestionsAnswered = (typeof $('input[name=activeOptions]:checked').val()!= 'undefined' && allQuestionsAnswered) ? true:false

	let count = 0
	$('#mealsResponse input:checkbox:checked').each((i, element) => { count++;})
	allQuestionsAnswered = (count!=0 && allQuestionsAnswered) ? true:false

	allQuestionsAnswered = (typeof $('input[name=snackOptions]:checked').val()!= 'undefined' && allQuestionsAnswered) ? true:false
	allQuestionsAnswered = (FULLRANGEMOVED && allQuestionsAnswered) ? true:false
	allQuestionsAnswered = (HEALTHYRANGEMOVED && allQuestionsAnswered) ? true:false

	allQuestionsAnswered = (BUSYRANGEMOVED && allQuestionsAnswered) ? true:false
	allQuestionsAnswered = (typeof $('input[name=productiveOptions]:checked').val()!= 'undefined' && allQuestionsAnswered) ? true:false

	return allQuestionsAnswered
}


function setupBusySlider() {
	// $('#busyDisplay').html("Not busy at all");
	$('#busyRange').on('input', function() {
		let displayText = ""
		switch (this.value) {
			case "1":
				displayText = "Not busy at all"
				break;

			case "2":
				displayText = "A little busy"
				break;

			case "3":
				displayText = "Somewhat busy"
				break;
			case "4":
				displayText = "Very busy"
				break;
			case "5":
				displayText = "Extremely busy"
				break
		}
	  $('#busyDisplay').html(displayText);
	  BUSYRANGEMOVED = true
  	  $(this).css('--slider-color', '#3681ff')

	})
}


function setupFullSlider() {
	// $('#fullDisplay').html("Not a lot");
	$('#fullRange').on('input', function() {
		let displayText = ""
		switch (this.value) {
			case "1":
				displayText = "Not a lot"
				break;

			case "2":
				displayText = "Just enough"
				break;

			case "3":
				displayText = "A little more than I should've"
				break;
			case "4":
				displayText = "Ate too much"
				break;
		}
	  $('#fullDisplay').html(displayText);
	  FULLRANGEMOVED = true
	  $(this).css('--slider-color', '#3681ff')
	})
}


function setupHealthySlider() {
	// $('#healthyDisplay').html($('#healthyRange').val());
	$('#healthyRange').on('input', function() {
	  $('#healthyDisplay').html(this.value);
	  HEALTHYRANGEMOVED = true;
  	  $(this).css('--slider-color', '#3681ff')

	})
}

function resetSlider(sliderName) {
	let rangeSelector = '#' + sliderName + 'Range'
	let displaySelector = '#' + sliderName + 'Display'

	$(rangeSelector).val(1)
	$(rangeSelector).css('--slider-color', '#82B1FF')
	$(displaySelector).html("")
}