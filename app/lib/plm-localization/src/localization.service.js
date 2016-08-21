/**
 * @ngdoc object
 * @name Miscellaneous.LocalizationService
 *
 * @description Handles application-wide localization strings
 *
 * ##Dependencies
 *
 */
class LocalizationService {
	/*
	 * @ngdoc method
	 * @name Miscellaneous.LocalizationService#constructor
	 * @methodOf Miscellaneous.LocalizationService
	 * @description The class constructor.
	 */
	constructor($rootScope, $q, localeBundleFactory, pathToLocaleBundles) {
		var that = this;
		this.$rootScope = $rootScope;
		this.$q = $q;
		this.localeBundleFactory = localeBundleFactory;
		this.deferred = this.$q.defer();
		this.localeBundleFactory(pathToLocaleBundles + '/translations/localizationBundleGeneral', '').translations.then(function (data) {
			angular.copy(data, that.$rootScope.localizationBundleGeneral);
			that.deferred.resolve();
		});
	}

	/**
	* @ngdoc method
	* @name Miscellaneous.LocalizationService#init
	* @methodOf Miscellaneous.LocalizationService
	* @description Initialization method to be called by other classes to ensure the locale file is loaded before using it
	*
	* @returns {Object} A promise which will be resolved when the locale file is loaded
	*/
	init() {
		return this.deferred.promise;
	}

	/**
	* @ngdoc method
	* @name Miscellaneous.LocalizationService#translate
	* @methodOf Miscellaneous.LocalizationService
	* @description Given a string of key, translate it into the actual string
	*
	* @param {String} key The key to be converted into a string using the locale file
	*
	* @returns {String} The string that the key represents, undefined if key does not exist
	*/
	translate(key) {
		if (!angular.isString(key)) {
			return undefined;
		}
		var keys = key.split('.');
		var val = this.$rootScope.bundle;
		for (var i = 0; i < keys.length; i++) {
			val = val[keys[i]];
		}
		return val;
	}
}

export default LocalizationService;
