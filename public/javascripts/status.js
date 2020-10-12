// document.addEventListener('DOMContentLoaded', init, false);

const OBJECTSTORES = ['users', 'journalEntries', 'questionEntries']

function checkOnlineStatus() {
	if (!navigator.onLine) {
		$('#footer').removeClass('d-none')
	} else {
		console.log("back online... check to see if there needs to be anything uploaded.")
		let successfulUploads = true
		OBJECTSTORES.forEach( (objStore) => {
			let store = createTransaction(objStore, 'readwrite')
			let index = store.index('uploadedToCloud')

			let allRecords = index.getAll(IDBKeyRange.only(0))

			allRecords.onsuccess = (evt) => {
				// console.log('able to get records for ' + objStore + '...')
				// console.log(allRecords)

				if (allRecords.result.length > 0) {
					allRecords.result.forEach( (obj) => {
						uploadAndAddData(objStore, obj).then((successBool) => {
							if (!successBool) {
								console.log('Error: unable to upload to cloud')
								successfulUploads = false
							} else {
								// console.log('able to upload to cloud')
							}
						})
					})

				} else {
					console.log("***IndexDB***: Table " + objStore + " is up to date with the cloud!")
				}
			}

			allRecords.onerror = (err) => {
				console.log('***IndexDB***: unable to get all records')
			}
		})

		if (successfulUploads) {
			displaySuccess("Previous offline entires have been uploaded to the cloud.")
		}
	}
}