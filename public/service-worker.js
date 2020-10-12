importScripts('https://www.gstatic.com/firebasejs/7.22.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-messaging.js');

var db;
const CACHE_NAME = 'moodtracker-cache';
const toCache = [
  '/',
  '/index.html',
  '/404.html',

  '/images/icon.png',
  '/images/icon-192x192.png',
  '/images/icon-256x256.png',
  '/images/icon-384x384.png',
  '/images/icon-512x512.png',

  '/images/anger.png',
  '/images/disgust.png',
  '/images/fear.png',
  '/images/joy.png',
  '/images/sadness.png',
  '/images/splash_screen.png',
  '/images/maskable_icon.png',

  '/javascripts/pwa.js',
  '/javascripts/status.js',
  '/javascripts/pwa.webmanifest',
  '/javascripts/bootstrap.min.js',
  '/javascripts/bootstrap.min.js.map',
  '/javascripts/jquery.min.js',
  '/javascripts/material-components-web.min.js',
  '/javascripts/bootstrap-toggle.min.js',
  '/javascripts/bootstrap-toggle.min.js.map',
  

  '/index.js',
  '/stylesheets/bootstrap-toggle.min.css',

  '/stylesheets/style.css',
  '/stylesheets/mdc.css',
  '/stylesheets/material-components-web.min.css.map',
  '/stylesheets/bootstrap.min.css',
  '/stylesheets/bootstrap.min.css.map'
];




self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(toCache)
      })
      .then(self.skipWaiting())
  )
})

self.addEventListener('fetch', function(event) {
 event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.match(event.request)
          })
      })
  )

})

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key)
            return caches.delete(key)
          }
        }))
      })
      .then(() => self.clients.claim())
  )
})


var firebaseConfig = {
  apiKey: "AIzaSyDjhgUUZomqoW1mKb7jbAuSRUKne4mxTZA",
  authDomain: "moodtracker-289303.firebaseapp.com",
  databaseURL: "https://moodtracker-289303.firebaseio.com",
  projectId: "moodtracker-289303",
  storageBucket: "moodtracker-289303.appspot.com",
  messagingSenderId: "323129063823",
  appId: "1:323129063823:web:2a7dcddca434ec95e3b3fa",
  measurementId: "G-58YL9HJYLS"
};

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload => {
    const notification = JSON.parse(payload.data.notification);
    const notificationTitle = notification.title;
    const notificationOptions = {
    body: notification.body,
    icon: '/images/icon-192x192.png',
    badge: '/images/icon-192x192.png'
  };

  // JS for IndexDB
  const dbPromise = createIndexedDB();
  dbPromise.onerror = (err) => {
    console.log("Error: local database could not be initialized.")
  }
  dbPromise.onsuccess = (evt) => {
    // console.log(evt)
    db = dbPromise.result;
    getCurrentUser().then((userObject) => {
      if (userObject) {
        console.log("This is the current user: " + userObject.username)
        if (userObject.notification) {
            //Show the notification
            return self.registration.showNotification(
              notificationTitle,
              notificationOptions
            );
        } else {
          console.log("Notification set to false")
        }
      } else {
        console.log("No active users found.")
      }
    })
  }



});


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


function getNotificationSetting(){
  return new Promise( function(resolve) {
    getCurrentUser().then( (userObject) => {
      return resolve(typeof userObject === 'undefined' ? false:userObject.notification)
    })
  })
}