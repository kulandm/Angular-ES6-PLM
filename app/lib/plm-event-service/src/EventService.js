System.get('com/autodesk/UnderscoreService.js');

/**
 * @ngdoc object
 * @name Services.EventService
 *
 * @description Handles events across PLM360
 * Based on the Mediator pattern, and https://github.com/FacultyCreative/angular-mediator/
 *
 * ##Dependencies
 *
 */

/**
 * @ngdoc property
 * @name Services.EventService#$listeners
 * @propertyOf Services.EventService
 * @description `private` List of listeners currently stored
 */
var $listeners = [];

/**
 * @ngdoc property
 * @name Services.EventService#$callbacks
 * @propertyOf Services.EventService
 * @description `private` List of methods that are going to be called when sending an item is performed
 */
var $callbacks = [];

/**
 * @ngdoc method
 * @name Services.EventService#regexSame
 * @methodOf Services.EventService
 * @description Checks if two regular expresions for equivalency
 * Adapted from http://stackoverflow.com/questions/10776600/testing-for-equality-of-regular-expressions
 *
 * @param {RegExp} 		regExp1 		The first regular expression
 * @param {RegExp} 		regExp2 		The second regular expression
 *
 * @returns {Boolean} 	If the regular expressions are equal or not
 * In this case, (/a/, /a/) // true  ||  (/a/gi, /a/ig) // true  ||  (/a/, /b/) // false
 *
 */
var regExpIsEqual = function (regExp1, regExp2) {
	var props = ['global', 'multiline', 'ignoreCase', 'source'];

	if ((regExp1.constructor === RegExp) && (regExp2.constructor === RegExp)) {
		for (var i = 0; i < props.length; i++) {
			var prop = props[i];
			if (regExp1[prop] !== regExp2[prop]) {
				return false;
			}
		}
		return true;
	}

	return false;
};

/**
 * @ngdoc method
 * @name Services.EventService#addListener
 * @methodOf Services.EventService
 * @description Registers an event for listening
 *
 * @param {String} 	eventId 		The id for the event, with each namespace separated by ":"
 *
 * @returns {RegExp} The regular expression to be acted on
 */
var addListener = function (_, eventId) {
	if (eventId.constructor === String) {
		eventId = regExpifyForListening(eventId);
	}

	// now it's a RegExp, push it to the list of listeners
	if (eventId.constructor === RegExp) {

		// check for duplicates in the array
		var duplicateFound = _.find($listeners, function (value, index) {
			return regExpIsEqual(value, eventId);
		});

		if (!duplicateFound) {
			$listeners.push(eventId);
		}
	}

	return eventId;
};

/**
 * @ngdoc method
 * @name Services.EventService#removeListenerEvent
 * @methodOf Services.EventService
 * @description Removes the specified listener
 *
 * @param {String|RegExp} 		eventId 		The name/id of the event (if String, will be converted to RegExp) to stop listenting for
 *
 */
var removeListenerEvent = function (_, eventId) {
	if (eventId.constructor === RegExp) {
		/* global $log */
		$log.error('Invalid, regular expressions not allowed');
	}

	if (eventId.constructor === String) {
		eventId = regExpifyForUnlistening(eventId);
	}

	// Remove listener from the 'listeners' array
	$listeners = _.reject($listeners, function (listener) { // return a new array with all listeners, minus the one requested
		var unRegExpifiedListener = unRegExpify(listener);

		if (unRegExpifiedListener.match(eventId) !== null) {
			_.each($callbacks, function (target, key) {
				if (key === listener) {
					delete $callbacks[key];
				}
			});
			return listener;
		}
	});
};

/**
 * @ngdoc method
 * @name Services.EventService#addCallBackFn
 * @methodOf Services.EventService
 * @description Adds the callback function to the listener
 * (only one unique callback per listeners - i.e. you can't add multiple strictly identical callbacks to the same listener)
 *
 * @param {String|RegExp} 		eventId 			The name/id of the event (if String, will be converted to RegExp)
 * @param {Function} 			callBackFn 		The function to call back when the event is broadcast by "send"
 * @param {Boolean} 				override 		If true, overrides the duplicate
 *
 */
var addCallBackFn = function (eventId, callBackFn, override) {
	// there are no actors for this eventId yet, so create the array
	if (!$callbacks[eventId]) {
		$callbacks[eventId] = {};
	}

	/****
	commenting duplicate check out, because it's not guaranteed that the exact same method should be overriden
	***/
	// iterates through each callback in the list looking for duplicates
	/*var duplicateCheck = false;
	_.each($callbacks[eventId], function (value, key) {
		if (value.toString() === callBackFn.toString()) {
			duplicateCheck = true;

			if (override === true) {
				$callbacks[eventId][key] = callBackFn;
			}
		}
	});*/

	// add the callback to the array for that specific event, if the function doesn't already exists on the list
	// if (!duplicateCheck) {
	var id = (new Date()).getTime() + '-' + Math.random();
	$callbacks[eventId][id] = callBackFn;
	// }
	return id;
};

/**
 * @ngdoc method
 * @name Services.EventService#listen
 * @methodOf Services.EventService
 * @description Removes the specified listener
 *
 * @param {String} 		listenerId 		The id of the listener to stop listening
 */
var removeCallBackFn = function (_, listenerId) {
	// Remove listener from the 'listeners' array
	_.each($listeners, function (listener) { // return a new array with all listeners, minus the one requested
		_.each($callbacks[listener], function (target, key) {
			if (key === listenerId) {
				delete $callbacks[listener][key];
			}
		});
	});
};

/**
 * @ngdoc method
 * @name Services.EventService#callRegExps
 * @methodOf Services.EventService
 * @description Call the actors for an event name. Matches each listener against RegEx event name,
 * if a strict match is found, iterates though actors array where key matches event name
 * and calls each actor function, passing original event and arguments.
 * This function takes evendId as the name/id of the event, and an Object which are the arguments originally sent with the event
 *
 */
var callRegExps = function () {
	var _ = arguments[0];
	var args = _.flatten(arguments, true);
	args.splice(0, 1);
	var eventId = args[0];

	_.each($listeners, function (listener) {
		if (eventId.match(listener)) {
			_.each($callbacks[listener], function (target) {
				if (target) {
					target.apply(target, args);
				}
			});
		}
	});
};

/**
 * @ngdoc method
 * @name Services.EventService#regExpifyForListening
 * @methodOf Services.EventService
 * @description Convert wildcard (*) and globstar (**) pattern strings to RegExp, or convert a String to RegExp, for adding listener purposes
 *
 * @param {RegExp} 		watchPattern 		The RegExp to be matched
 *
 * @returns {RegExp} 							The new RegExp
 *
 */
var regExpifyForListening = function (watchPattern) {
	if (watchPattern.match(/\*{3,}/)) {
		$log.error('Invalid wildcard pattern "' + watchPattern + '"');
	}

	var matcher = watchPattern
		.replace(/\*{2}/g, '.*')
		.replace(/\*{1}/g, '[^:/?&;]*')
		.replace(/\./, '.*');

	// adds the \b to specify that it's a boundary - so "test" doesn't match with "testing", only with "test"
	return new RegExp('^' + matcher + '\\b');
};

/**
 * @ngdoc method
 * @name Services.EventService#regExpifyForUnlistening
 * @methodOf Services.EventService
 * @description Convert wildcard (*) and globstar (**) pattern strings to RegExp, or convert a String to RegExp, for removing listener purposes
 *
 * @param {RegExp} 		watchPattern 		The RegExp to be matched
 *
 * @returns {RegExp} 							The new RegExp
 */
var regExpifyForUnlistening = function (watchPattern) {
	if (watchPattern.match(/\*{3,}/)) {
		$log.error('Invalid wildcard pattern "' + watchPattern + '"');
	}

	// var matcher = watchPattern.replace(/\*/g, '[?[a-zA-Z0-9:*]*')
	var matcher = watchPattern.replace(/\*/g, '(?:[a-zA-Z0-9:*]*)');

	// returns the regexp with all the "*" changed to the char class
	return new RegExp(matcher);
};

/**
 * @ngdoc method
 * @name Services.EventService#unRegExpify
 * @methodOf Services.EventService
 * @description Converts a RegExp to String, remove the ^ and \b
 *
 * @param {RegExp} 		regExp 		 		The RegExp to be matched
 *
 * @returns {String} 							The string
 */
var unRegExpify = function (regExp) {
	if (regExp.constructor !== RegExp) {
		$log.error('Invalid argument, should be regular expression');
	}

	var matcher = /[^\\/^.][a-zA-Z0-9:*.]*[^\\:/.?&;]/g;

	regExp = regExp.toString();

	var cleanStr = regExp.replace(/\[\^\:\/\.\?\&\;\]\**/g, '*');
	var regExpAsString = cleanStr.match(matcher);

	return regExpAsString[0];
};

class EventService {

	/*
	 * @ngdoc method
	 * @name Services.EventService#constructor
	 * @methodOf Services.EventService
	 * @description The class constructor
	 */
	constructor($log, _) {
		this.$log = $log;
		this._ = _;
	}

	/*
	 * @ngdoc method
	 * @name Services.EventService#listen
	 * @methodOf Services.EventService
	 * @description Subscribes to listening to the event
	 * When listening to an event, you call the EventService and then specify the event id you want to listen for,
	 * separated by colons, followed by the "act" method (described below). E.g.:
	 *
	 * EventService.listen('item:change:save', function (event, params) {...})
	 * 	Listen to all events of the specified type
	 * EventService.listen('item:change:*', function (event, params) {...})
	 * 	Listen to all events of the type, taking into account the structure of the namespaces
	 * EventService.listen('item:*:save', function (event, params) {...})
	 * 	Listen to all events of the type, using as wildcard any one namespace between them
	 * EventService.listen('item:**:save', function (event, params) {...})
	 * 	Listen to all events of the type, using as wildcard any number of namespaces between them
	 * EventService.listen('**:save', function (event, params) {...})\
	 * 	Listen to all events of the specified type across the application, no matter the number of separators
	 *
	 * @param 	{Object} 	eventId			The id of the event to subscribe to
	 * @param 	{Function} 	callBackFn		The call back function to be attached to the event
	 * @param 	{Boolean} 	override			The flag for determining whether to override the previous same function attached
	 *
	 * @returns {String} 						A unique ID of the current listener
	 *
	 */
	listen(eventId, callBackFn, override) {
		if (angular.isUndefined(eventId)) {
			this.$log.error('ERROR! You must pass an event name to listen for!', callBackFn);

			return;
		}

		return addCallBackFn(addListener(this._, eventId), callBackFn, override);
	}

	/*
	 * @ngdoc method
	 * @name Services.EventService#unlisten
	 * @methodOf Services.EventService
	 * @description Unsubscribes specific listener from listening
	 *
	 * @param 	{String} 	listenerId			The id of the listener returned from calling EventService.listen
	 *
	 * @returns {Object} 						The EventService
	 *
	 */
	unlisten(listenerId) {
		if (angular.isUndefined(listenerId)) {
			this.$log.error('ERROR! You must pass a listener id to unlisten for!');

			return;
		}

		removeCallBackFn(this._, listenerId);

		return this;
	}

	/*
	 * @ngdoc method
	 * @name Services.EventService#unlistenEvent
	 * @methodOf Services.EventService
	 * @description Unsubscribes to listening to the event - same structure of wildcards as "listen" is supported
	 * Warning: for this implementation, unlistening to an event actually unsubscribes all listeners from that event
	 * E.g.: unlisten('item:pin:*') unsubcribes all actors that are listening to this event.
	 *
	 * @param 	{Object} 	eventId			The id of the event to unsubscribe from
	 *
	 * @returns {Object} 						The EventService
	 *
	 */
	unlistenEvent(eventId) {
		if (angular.isUndefined(eventId)) {
			this.$log.error('ERROR! You must pass an event name to unlisten for!');

			return;
		}

		removeListenerEvent(this._, eventId);

		return this;
	}

	/**
	 * @ngdoc method
	 * @name Services.EventService#send
	 * @methodOf Services.EventService
	 * @description Broadcast the passed event to the listeners list
	 * This method can take an arbitrary number of arguments, but the first one MUST be
	 * the id of the event, separated by colons (:) for each namespace. The second one usually is the message that is going
	 * to be displayed (but it can by anything). These arguments will all be passed along to the listener
	 *
	 * @returns {Object} 						The EventService
	 *
	 */
	send() {
		var args = this._.flatten(arguments, true);

		var eventId = args[0];

		if (angular.isUndefined(eventId)) {
			this.$log.error('ERROR! You must pass an event name to send!', args);

			return;
		}

		args.splice(0, 1);

		callRegExps(this._, eventId, args);

		return this;
	}
}

export default angular.module(__moduleName, [
	'com/autodesk/UnderscoreService.js'
]).factory('EventService', ['$log', '_', ($log, _) => new EventService($log, _)]);
