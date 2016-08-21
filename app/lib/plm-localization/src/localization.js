import LocalizationService from './localization.service.js';

angular.module(__moduleName, [
	'angular-locale-bundles',
	'tmh.dynamicLocale'
])
// .factory('LocalizationService', [
// 	'$rootScope',
// 	'$q',
// 	'localeBundleFactory',
// 	($rootScope, $q, localeBundleFactory) => new LocalizationService($rootScope, $q, localeBundleFactory, '')
// ])
.provider('LocalizationService', function () {
	let pathToLocaleBundles = '';

	this.setPathToLocaleBundles = (value) => {
		pathToLocaleBundles = value || '';
	};

	this.$get = [
		'$rootScope',
		'$q',
		'localeBundleFactory',
		 ($rootScope, $q, localeBundleFactory) => {
		return new LocalizationService($rootScope, $q, localeBundleFactory, pathToLocaleBundles);
	}];
})
.config([
	'localeBundleFactoryProvider',
	(localeBundleFactoryProvider) => {
		localeBundleFactoryProvider.bundleUrl('{{bundle}}.json');
		localeBundleFactoryProvider.bundleLocaleUrl('{{bundle}}_{{locale}}.json');
		localeBundleFactoryProvider.useAcceptLanguageHeader(true); // add the locale to the 'Accept-Language' header - default is true
		localeBundleFactoryProvider.enableHttpCache(true); // cache AJAX requests - default is true
		localeBundleFactoryProvider.responseTransformer((response) => {
			return response.data.body;
		});
	}
]);
