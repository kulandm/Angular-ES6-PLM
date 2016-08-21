'use strict';

/**
 * @ngdoc property
 * @name Services.FlyoutService#flyoutId
 * @propertyOf Services.FlyoutService
 * @description `private` Keep track of flyout ids.
 */
let flyoutId = 0;

/**
 * @ngdoc property
 * @name Services.FlyoutService#openedFlyoutCount
 * @propertyOf Services.FlyoutService
 * @description `private` Keep track of currently opened flyouts.
 */
let openedFlyoutCount = 0;

/**
 * @ngdoc method
 * @name Services.FlyoutService#getId
 * @methodOf Services.FlyoutService
 * @description `private` Returns an integer id that can be assigned to flyout.
 *
 * @returns {Number} Flyout id.
 */
let getId = function () {
	return ++flyoutId;
};

/**
 * @ngdoc property
 * @name Services.FlyoutService#activeFlyoutMap
 * @propertyOf Services.FlyoutService
 * @description `private` A map keyed by flyout id that holds an object that
 * contains flyout element reference and config used for that flyout.
 */
let activeFlyoutMap = {};

/**
 * @ngdoc object
 * @name Services.FlyoutService
 *
 * @description This is a service to quickly create flyout window. It can be
 * used to create flyout window with custom contents. This service consists of
 * three methods: open (to open the flyout window), close (to close the window)
 * and cancel (to cancel the window).
 *
 * This service is loosely based on Angular UI's modal and tooltip controls.
 *
 * @example
 *
 * let flyoutInstance = FlyoutService.open({
 * 	templateUrl: 'some template',
 * 	scope: scope, // scope that will be used with the template
 * 	anchorPosition: {top: 10, bottom: 0, left: 100, right: 0, width: 20, height: 25},
 * 	flyoutWindowClass: 'custom', // custom class that will be applied on flyout window.
 * 	flyoutDialogClass: 'custom', // custom class that will be applied on flyout dialog.
 * 	placement: 'bottom' // 'bottom', 'top', 'right', 'left'.
 * 	showArrow: false
 * 	controller: someController // controller function or controller name can be given that can be used with template.
 * });
 *
 * TODO how to deal with scenario when window is resized while flyout
 * (or flyouts) are visible.
 */
class FlyoutService {

	/*
	 * @ngdoc method
	 * @name Services.FlyoutService#constructor
	 * @methodOf Services.FlyoutService
	 * @description The class constructor.
	 */
	constructor($injector, $document, $compile, $rootScope, $q, $http, $templateCache, $controller, EventService, RESTWrapperService) {
		this.$injector = $injector;
		this.$document = $document;
		this.$compile = $compile;
		this.$rootScope = $rootScope;
		this.$q = $q;
		this.$http = $http;
		this.$templateCache = $templateCache;
		this.$controller = $controller;
		this.EventService = EventService;
		this.RESTWrapperService = RESTWrapperService;
	}

	/**
	 * @ngdoc method
	 * @name Services.FlyoutService#getTemplatePromise
	 * @methodOf Services.FlyoutService
	 * @description Returns template promise based on the flyout config option.
	 *
	 * @param {Object} options Config option of flyout
	 *
	 * @returns {Promise} Template promise
	 *
	 * TODO Can we move the template resolution from flyout service (manager) to
	 * flyout directive so that its the responsibility of the instance to resolve it??
	 */
	 getTemplatePromise(options) {
		return options.template ? this.$q.when(options.template) :
			this.$http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl, {cache: this.$templateCache})
				.then(result => result.data);
	}

	/**
	 * @ngdoc method
	 * @name Services.FlyoutService#openFlyout
	 * @methodOf Services.FlyoutService
	 * @description Creates {@link Directives.flyoutWindow) according to
	 * flyout config options
	 *
	 * @param {Object} flyoutWindowConfig Object representing the config of flyout window.
	 */
	openFlyout(flyoutWindowConfig) {
		let body = this.$document.find('body').eq(0);

		// Add anchor element to the scope so that it can be passed to the
		// flyout window component.
		flyoutWindowConfig.scope.anchorEl = flyoutWindowConfig.anchorEl;

		let angularDomEl = angular.element('<div flyout-window></div>');

		angularDomEl.attr({
			'anchor-el': 'anchorEl',
			placement: flyoutWindowConfig.placement,
			'flyout-class': flyoutWindowConfig.flyoutClass,
			'show-arrow': flyoutWindowConfig.showArrow,
			'flyout-id': flyoutWindowConfig.flyoutId,
			'flyout-order': ++openedFlyoutCount,
			'backdrop-option': flyoutWindowConfig.backdropOption,
			'base-class': flyoutWindowConfig.baseClass,
			'disable-default-z-index-allocation': flyoutWindowConfig.disableDefaultZIndexAllocation,
			'flyout-rendered': 'flyoutRendered(flyoutId)'
		}).html(flyoutWindowConfig.content);

		let flyoutWindowEl = this.$compile(angularDomEl)(flyoutWindowConfig.scope);
		body.append(flyoutWindowEl);

		activeFlyoutMap[flyoutWindowConfig.flyoutId] = {
			element: flyoutWindowEl,
			config: flyoutWindowConfig
		};
	}

	/**
	 * @ngdoc method
	 * @name Services.FlyoutService#removeFlyout
	 * @methodOf Services.FlyoutService
	 * @description Removes currently active flyout window
	 *
	 * @param {Number} flyoutId ID of the flyout
	 */
	removeFlyout(flyoutId) {
		if (activeFlyoutMap[flyoutId]) {
			activeFlyoutMap[flyoutId].element.remove();
			activeFlyoutMap[flyoutId].config.scope.$destroy();

			delete activeFlyoutMap[flyoutId];
			openedFlyoutCount--;
		}
	}

	/**
	 * @ngdoc method
	 * @name Services.FlyoutService#getResolvePromises
	 * @methodOf Services.FlyoutService
	 * @description List of objects that will be resolved and passed to the
	 * controller as locals; it is equivalent of the resolve property
	 * for AngularJS routes
	 *
	 * @param {Object[]} resolves List of resolves
	 *
	 * @returns {Promise[]} Resolve promises
	 */
	getResolvePromises(resolves) {
		let promisesArr = [];
		angular.forEach(resolves, value => {
			if (angular.isFunction(value) || angular.isArray(value)) {
				promisesArr.push(this.$q.when(this.$injector.invoke(value)));
			}
		});
		return promisesArr;
	}

	/**
	 * @ngdoc method
	 * @name Services.FlyoutService#open
	 * @methodOf Services.FlyoutService
	 * @description Opens a flyout window based on the given config object.
	 *
	 * @param {Object} config Flyout config object.
	 * Config option consists of the following options:
	 * 	templateUrl		A path to a template representing flyout's content
	 * 	template		Inline template representing the flyout's content.
	 * 	scope			A scope instance to be used for the flyout's content.
	 * 					This is optional, will be $rootScope by default.
	 * 	controller		A controller for a flyout instance. This is optional.
	 * 	anchorEl		An element to which the flyout will be anchored.
	 * 	placement		How to position flyout according to anchor element.
	 * 					Defaults to "bottom", but also accepts "top".
	 *					For more information, see {@link FlyoutWindowDirective}.
	 * 	flyoutClass		The custom css class that will be applied on flyout
	 * 					element. This is optional.
	 * 	showArrow		Defaults to false. Set to true to show arrow pointing
	 * 					towards the anchored element. This is optional.
	 * 	backdropOption	A number to determine backdrop behaviour.
	 * 					1 = hide backdrop of flyout window. This is optional.
	 * 	baseClass		The name of the class that will be applied to flyout
	 * 					window elements. This is optional.
	 * 	disableDefaultZIndexAllocation True, to disable default z-index
	 * 					allocation by flyout window directive. This is optional.
	 * 	resolve			The resolve that needs to be associated with the controller.
	 *
	 * @returns {Object} An object containing flyout related promises and functions.
	 * It will contain the following properties:
	 * 	closed		A promise that will be resolved when flyout window is closed.
	 * 	opened		A promise that will be resolved when flyout window is opened.
	 * 	cancel		A method that can be called to explicitly cancel the flyout window.
	 * 	closed		A method that can be called to explicitly close the flyout window.
	 * 				Note: The difference between cancel and close is how promises are resolved.
	 * 	hide		A method that can be called to hide the flyout window.
	 * 	show		A method that can be called to show the flyout window.
	 * 	isHidden	A method that will return true if flyout is currently hidden.
	 */
	open(config) {
		let flyoutClosedDeferred = this.$q.defer();
		let flyoutOpenedDeferred = this.$q.defer();
		let flyoutId = getId();

		let flyoutInstance = {
			id: flyoutId,
			closed: flyoutClosedDeferred.promise,
			opened: flyoutOpenedDeferred.promise,
			cancel: (message) => {
				this.cancel(flyoutId, message);
			},
			close: (result) => {
				this.close(flyoutId, result);
			},
			hide: () => {
				this.hide(flyoutId);
			},
			show: () => {
				this.show(flyoutId);
			},
			isHidden: () => {
				return this.isHidden(flyoutId);
			},
			isActive: () => {
				return this.isActive(flyoutId);
			}
		};

		if (!config.anchorEl) {
			throw new Error('anchorEl is required.');
		}

		// Verify options
		if (!config.template && !config.templateUrl) {
			throw new Error('One of template or templateUrl options is required.');
		}

		this.getTemplatePromise(config).then(tpl => {
			this.RESTWrapperService.allSettled(this.getResolvePromises(config.resolve)).then(resolveResults => {
				let flyoutScope = (config.scope || this.$rootScope).$new();
				flyoutScope.$close = flyoutInstance.close;
				flyoutScope.$cancel = flyoutInstance.cancel;

				let ctrlLocals = {};
				let resolveIter = 0;

				if (config.controller) {
					ctrlLocals.$scope = flyoutScope;
					ctrlLocals.$flyoutInstance = flyoutInstance;
					angular.forEach(config.resolve, (value, key) => {
						ctrlLocals[key] = resolveResults[resolveIter++].value;
					});

					flyoutScope[config.controllerAs] = this.$controller(config.controller, ctrlLocals);
				}

				/**
				 * @ngdoc method
				 * @name Services.FlyoutService#flyoutRendered
				 * @methodOf Services.FlyoutService
				 * @description Function to be called when flyout is rendered.
				 * This function will resolve flyout opened promise.
				 */
				flyoutScope.flyoutRendered = (flyoutId) => {
					flyoutOpenedDeferred.resolve(activeFlyoutMap[flyoutId].element);
				};

				this.openFlyout({
					scope: flyoutScope,
					deferred: flyoutClosedDeferred,
					content: tpl, // tplAndResolves[0],
					placement: config.placement || 'bottom',
					flyoutClass: config.flyoutClass,
					showArrow: config.showArrow,
					backdropOption: angular.isNumber(config.backdropOption) ? config.backdropOption : 1,
					baseClass: config.baseClass,
					disableDefaultZIndexAllocation: config.disableDefaultZIndexAllocation,
					flyoutId: flyoutId,
					anchorEl: config.anchorEl
				});

				activeFlyoutMap[flyoutId].instance = flyoutInstance;
			});
		}, (error) => {
			flyoutOpenedDeferred.reject(error);
		});

		return flyoutInstance;
	}

	/**
	 * @ngdoc method
	 * @name Services.FlyoutService#cancel
	 * @methodOf Services.FlyoutService
	 * @description Explicitly cancel the currently active flyout window.
	 *
	 * @param {Number} flyoutId ID of the flyout
	 * @param {String} message The reason for cancelling the flyout. This is optional.
	 */
	cancel(flyoutId, message) {
		if (activeFlyoutMap[flyoutId]) {
			activeFlyoutMap[flyoutId].config.deferred.reject(message);
			this.removeFlyout(flyoutId);
		}
	}

	/**
	 * @ngdoc method
	 * @name Services.FlyoutService#close
	 * @methodOf Services.FlyoutService
	 * @description Explicitly close the flyout window based on the given flyout id.
	 *
	 * @param {Number} flyoutId ID of the flyout
	 * @param {Object} result The object representing the result. This is optional.
	 */
	close(flyoutId, result) {
		if (activeFlyoutMap[flyoutId]) {
			activeFlyoutMap[flyoutId].config.deferred.resolve(result);
			this.removeFlyout(flyoutId);
		}
	}

	/**
	 * @ngdoc method
	 * @name Services.FlyoutService#hide
	 * @methodOf Services.FlyoutService
	 * @description Hides the flyout window based on the given flyout id
	 * and send hide event.
	 *
	 * @param {Number} flyoutId ID of the flyout
	 */
	hide(flyoutId) {
		if (activeFlyoutMap[flyoutId]) {
			activeFlyoutMap[flyoutId].element.addClass('hidden');
			this.EventService.send(`flyout:${flyoutId}:hide`);
		}
	}

	/**
	 * @ngdoc method
	 * @name Services.FlyoutService#show
	 * @methodOf Services.FlyoutService
	 * @description Show the flyout window based on the given flyout id
	 * and send show event.
	 *
	 * @param {Number} flyoutId ID of the flyout
	 */
	show(flyoutId) {
		if (activeFlyoutMap[flyoutId]) {
			activeFlyoutMap[flyoutId].element.removeClass('hidden');
			this.EventService.send(`flyout:${flyoutId}:show`);
		}
	}

	/**
	 * @ngdoc method
	 * @name Services.FlyoutService#isHidden
	 * @methodOf Services.FlyoutService
	 * @description True, if a flyout (given by flyoutId) is hidden.
	 *
	 * @param {Number} flyoutId ID of the flyout
	 *
	 * @result {Boolean} True, if flyout window is hidden.
	 */
	isHidden(flyoutId) {
		if (activeFlyoutMap[flyoutId]) {
			return activeFlyoutMap[flyoutId].element.hasClass('hidden');
		}

		throw new Error('no flyout found for id', flyoutId);
	}

	/**
	 * @ngdoc method
	 * @name Services.FlyoutService#isActive
	 * @methodOf Services.FlyoutService
	 * @description True, if a flyout (given by flyoutId) is active.
	 *
	 * @param {Number} flyoutId ID of the flyout
	 *
	 * @result {Boolean} True, if flyout window is active.
	 */
	isActive(flyoutId) {
		return !!activeFlyoutMap[flyoutId];
	}

	/**
	 * @ngdoc method
	 * @name Services.FlyoutService#get
	 * @methodOf Services.FlyoutService
	 * @description Get a flyout instance by a given flyout id.
	 *
	 * @param {Number} flyoutId ID of the flyout
	 *
	 * @returns {Object} An object containing flyout related promises and
	 * functions. For details of the object property, see {@link FlyoutService#open}
	 */
	get(flyoutId) {
		return activeFlyoutMap[flyoutId] ? activeFlyoutMap[flyoutId].instance : null;
	}
}

export default FlyoutService;
