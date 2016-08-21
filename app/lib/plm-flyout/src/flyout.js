import RESTWrapperService from 'com/autodesk/RESTWrapperService.js';
import EventService from 'com/autodesk/EventService.js';
import FlyoutService from './flyout.service.js';
import FlyoutDirective from './flyout.directive.js';

angular.module(__moduleName, [
    'com/autodesk/RESTWrapperService.js',
    'com/autodesk/EventService.js'
])
.provider('FlyoutService', function () {
	this.$get = [
        '$injector',
    	'$document',
    	'$compile',
    	'$rootScope',
    	'$q',
    	'$http',
    	'$templateCache',
    	'$controller',
    	'EventService',
    	'RESTWrapperService',
	    ($injector, $document, $compile, $rootScope, $q, $http, $templateCache, $controller, EventService, RESTWrapperService) => {
		return new FlyoutService($injector, $document, $compile, $rootScope, $q, $http, $templateCache, $controller, EventService, RESTWrapperService);
	}];
})
.directive('flyoutWindow', FlyoutDirective.directiveFactory)
/**
 * This code is based on AngularJS UI 'modalTransclude' directive. This is a supporting directive for flyout window directive
 * {@link Directives.flyoutWindow}. It should only be used with flyout window directive only. The main purpose of this directive
 * is to deal with the scope issues when we template is transcluded to the flyout window.
 * For details see {@link https://github.com/angular-ui/bootstrap/issues/2110}.
 */
.directive('flyoutTransclude', function () {
	return {
		link: function ($scope, $element, $attrs, controller, $transclude) {
			$transclude($scope.$parent, function (clone) {
				$element.empty();
				$element.append(clone);
			});
		}
	};
})
.constant('FlyoutWindowConstants', {
	DEFAULT_BASE_CLASS: 'flyout' // The default class name that will be used with flyout widget
});
