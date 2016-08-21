/**
 * @ngdoc object
 * @name Services.LocalUserStorageService
 *
 * @description A utility service that stores non-secure data specific to the user
 *		locally
 */
class LocalUserStorageService {
	/**
	 * @ngdoc method
	 * @name Services.LocalUserStorageService#constructor
	 * @methodOf Services.LocalUserStorageService
	 * @description The class constructor
	 *		Immediately loads the current user
	 */
	constructor($window, $q, EventService, ModelsManager) {
		this.$window = $window;
		this.$q = $q;
		this.EventService = EventService;
		this.ModelsManager = ModelsManager;

		/**
		 * @ngdoc property
		 * @name Services.LocalUserStorageService#userKey
		 * @propertyOf Services.LocalUserStorageService
		 * @description The key used to store the current user
		 */
		this.userKey = null;
		this.loadUser();
	}

	/**
	 * @ngdoc method
	 * @name Services.LocalUserStorageService#loadUser
	 * @methodOf Services.LocalUserStorageService
	 * @description Loads the current user
	 */
	loadUser() {
		let userListenerId = this.EventService.listen('currentUser:currentUser:done', (event, userObj) => {
			this.EventService.unlisten(userListenerId);
			this.userKey = `$$USER_${userObj.getId()}`;
		});
		this.ModelsManager.getCurrentUser();
	}

	/**
	 * @ngdoc method
	 * @name Services.LocalUserStorageService#canUseLocalStorage
	 * @methodOf Services.LocalUserStorageService
	 * @description Becase browsers have weird ways fo dealing with localStorage, we need to check if we can use it
	 *	Source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
	 *	Does not guarantee that there will be enough room in localStorage for all the data
	 *
	 * @returns {Boolean} True if local storage can be used
	 */
	canUseLocalStorage() {
		try {
			let storage = this.$window.localStorage;
			let x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);
			return true;
		} catch (e) {
			return false;
		}
	}

	/**
	 * @ngdoc method
	 * @name Services.LocalUserStorageService#getUserDataStorage
	 * @methodOf Services.LocalUserStorageService
	 * @description Gets the object that stores the user data
	 *			If no object exists, creates one, stores it, and returns it
	 *		Assumes that local storage is available
	 *
	 * @returns {Object} An object corresponding to the current user
	 */
	getUserDataStorage() {
		let storage = this.$window.localStorage;
		let data = storage.getItem(this.userKey);
		if (!data) {
			let dataMap = {};
			storage.setItem(this.userKey, JSON.stringify(dataMap));
			return dataMap;
		} else {
			return JSON.parse(data);
		}
	}

	/**
	 * @ngdoc method
	 * @name Services.LocalUserStorageService#get
	 * @methodOf Services.LocalUserStorageService
	 * @description Get the value stored for the given key
	 *		Assumes that local storage is available
	 * @param {String} key The key corresponding to the requested data
	 *
	 * @returns {Object} The requested object
	 */
	get(key) {
		return this.getUserDataStorage()[key];
	}

	/**
	 * @ngdoc method
	 * @name Services.LocalUserStorageService#set
	 * @methodOf Services.LocalUserStorageService
	 * @description Stores the value with the provided key in the user's local storage
	 *		Assumes that local storage is available
	 * @param {String} key The key to use (must be usable as a key of an object)
	 * @param {Object} value An object that will be stored
	 *				The object must be stringifyable by JSON
	 */
	set(key, value) {
		let currentData = this.getUserDataStorage();
		currentData[key] = value;
		this.$window.localStorage.setItem(this.userKey, JSON.stringify(currentData));
	}
}

LocalUserStorageService.$inject = ['$window', '$q', 'EventService', 'ModelsManager'];

angular.module(__moduleName, []).service('LocalUserStorageService', LocalUserStorageService);
