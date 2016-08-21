System.get('com/autodesk/UnderscoreService.js');
System.get('com/autodesk/EventService.js');

/**
 * @ngdoc object
 * @name Miscellaneous.LoadingDataService
 *
 * @description This service is injected whenever there's need to broadcast request/response events, and state change events
 *
 * ##Dependencies
 *
 */

class LoadingDataService {

	/*
	 * @ngdoc method
	 * @name Miscellaneous.LoadingDataService#constructor
	 * @methodOf Miscellaneous.LoadingDataService
	 * @description The class constructor.
	 */
	constructor(EventService) {
		this.EventService = EventService;
	}

	/**
	 * @ngdoc method
	 * @name Miscellaneous.LoadingDataService#stateChangeStart
	 * @methodOf Miscellaneous.LoadingDataService
	 * @description Broadcast the event notifying that a state change has started
	 *
	 */
	stateChangeStart(event, toState, toParams, fromState, fromParams) {
		this.EventService.send('state:change:start', [toState, toParams, fromState, fromParams]);
	}

	/**
	 * @ngdoc method
	 * @name Miscellaneous.LoadingDataService#stateChangeSwitch
	 * @methodOf Miscellaneous.LoadingDataService
	 * @description Broadcast the event notifying that a state change has started in-between start and success
	 *
	 */
	stateChangeSwitch(event, toState, toParams, fromState, fromParams) {
		this.EventService.send('state:change:switch', [toState, toParams, fromState, fromParams]);
	}

	/**
	 * @ngdoc method
	 * @name Miscellaneous.LoadingDataService#stateChangeFinished
	 * @methodOf Miscellaneous.LoadingDataService
	 * @description Broadcast the event notifying that a state change has completed successfully
	 *
	 */
	stateChangeFinished(event, toState, toParams, fromState, fromParams) {
		// not using success here to avoid conflicting with notifications
		this.EventService.send('state:change:done', [toState, toParams, fromState, fromParams]);
	}

	/**
	 * @ngdoc method
	 * @name Miscellaneous.LoadingDataService#stateChangeError
	 * @methodOf Miscellaneous.LoadingDataService
	 * @description Broadcast the event notifying that a state change has not completed successfully
	 *
	 */
	stateChangeError(event, toState, toParams, fromState, fromParams) {
		// a message here, because the :error is going to be caught by the notifications service (do we want that?)
		//this.EventService.send('state:change:error', ['Uh, oh, something has blown up!', toState, toParams, fromState, fromParams]);
	}

	/**
	 * @ngdoc method
	 * @name Miscellaneous.LoadingDataService#dataLoading
	 * @methodOf Miscellaneous.LoadingDataService
	 * @description Broadcast the event notifying that a request was, uh, requested
	 *
	 * @param {Object} params The parameter to configure the data loading
	 */
	dataRequest(params) {
		this.EventService.send('data:request', {
			url: params.url,
			requests: params.requests,
			requestsArr: params.requestsArr
		});
	}

	/**
	 * @ngdoc method
	 * @name Miscellaneous.LoadingDataService#dataLoaded
	 * @methodOf Miscellaneous.LoadingDataService
	 * @description Broadcast the event notifying that a request has completed
	 *
	 * @param {Object} params The parameter to configure the data loading
	 */
	dataResponse(params) {
		this.EventService.send('data:response', {
			url: params.url,
			requests: params.requests,
			requestsArr: params.requestsArr
		});
	}
}

export default angular.module(__moduleName, [
	'com/autodesk/EventService.js'
]).factory('LoadingDataService', [
	'EventService',
	(EventService) => new LoadingDataService(EventService)
]);
