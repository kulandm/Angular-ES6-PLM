'use strict';

/**
 * @ngdoc Service
 * @name ADSK.HttpInterceptorService.service
 *
 * @description This defines service for managing Http Interceptors
 * Usage: It is assumed that the application will handle setting of interceptors through provider with the following
 * httpInterceptor.config(function ($httpProvider) {
 * 		$httpProvider.interceptors.push('httpInterceptor');
 * })
 *
 * where httpInterceptor is the angular service defined according to angular docs, in whose methods the ADSKHttpInterceptor handle functions will be called
 *
 * ##Dependencies
 *
 */
var ADSKHttpInterceptor = angular.module('ADSK.HttpInterceptorService', []);

ADSKHttpInterceptor.factory('ADSK.HttpInterceptorService.service', [
	function () {

		/**
		 * @ngdoc property
		 * @name ADSK.HttpInterceptorService#responseErrorHandler
		 * @propertyOf ADSK.HttpInterceptorService.service
		 * @description `private` The handlers for error in response
		 */
		var responseErrorHandlerObj = {};

		/**
		 * @ngdoc property
		 * @name ADSK.HttpInterceptorService#responseHandler
		 * @propertyOf ADSK.HttpInterceptorService.service
		 * @description `private` The handlers for response
		 */
		var responseHandlerObj = {};

		/**
		 * @ngdoc property
		 * @name ADSK.HttpInterceptorService#requestErrorHandler
		 * @propertyOf ADSK.HttpInterceptorService.service
		 * @description `private` The handlers for error in request
		 */
		var requestErrorHandlerObj = {};

		/**
		 * @ngdoc property
		 * @name ADSK.HttpInterceptorService#requestHandler
		 * @propertyOf ADSK.HttpInterceptorService.service
		 * @description `private` The handlers for request
		 */
		var requestHandlerObj = {};

		/**
		 * @ngdoc method
		 * @name ADSK.HttpInterceptorService#sanitizeId
		 * @propertyOf ADSK.HttpInterceptorService.service
		 * @description `private` Sanitizes ID so that they're unified without leading slash
		 */
		function sanitizeId (id) {
			if (angular.isDefined(id) && typeof(id) === 'string' && id.indexOf('/') === 0) {
				return id.substring(1);
			}
			return id;
		}
		
		
		return {

			/*
			 * @ngdoc method
			 * @name ADSK.HttpInterceptorService#setHandlers
			 * @methodOf ADSK.HttpInterceptorService.service
			 * @description Sets the handlers for the next request
			 *
			 * @param {String} id The unique identifier for the request (preferably endpoint URL)
			 * @param {Function} respErrHandler The handler function to be used in response error
			 * @param {Function} respHandler The handler function to be used in response
			 * @param {Function} reqErrHandler The handler function to be used in request error
			 * @param {Function} reqHandler The handler function to be used in request
			 *
			 */
			setHandlers: function (id, respErrHandler, respHandler, reqErrHandler, reqHandler) {
				if (!angular.isDefined(id) || id === '') {
					return;
				}
				id = sanitizeId(id);
				if (angular.isDefined(respErrHandler)) {
					responseErrorHandlerObj[id] = respErrHandler;
				}
				if (angular.isDefined(respHandler)) {
					responseHandlerObj[id] = respHandler;
				}
				if (angular.isDefined(reqErrHandler)) {
					requestErrorHandlerObj[id] = reqErrHandler;
				}
				if (angular.isDefined(reqHandler)) {
					requestHandlerObj[id] = reqHandler;
				}
			},

			/*
			 * @ngdoc method
			 * @name ADSK.HttpInterceptorService#handleResponseError
			 * @methodOf ADSK.HttpInterceptorService.service
			 * @description Calls handler for response error
			 *
			 * @param {Object} rejection The object returned by the $http service
			 *
			 */
			handleResponseError: function (id, rejection) {
				id = sanitizeId(id);
				if (angular.isDefined(responseErrorHandlerObj) && angular.isDefined(responseErrorHandlerObj[id])) {
					responseErrorHandlerObj[id](rejection);
				}
			},

			/*
			 * @ngdoc method
			 * @name ADSK.HttpInterceptorService#handleResponse
			 * @methodOf ADSK.HttpInterceptorService.service
			 * @description Calls handler for response
			 *
			 * @param {Object} response The object returned by the $http service
			 *
			 */
			handleResponse: function (id, response) {
				id = sanitizeId(id);
				if (angular.isDefined(responseHandlerObj) && angular.isDefined(responseHandlerObj[id])) {
					responseHandlerObj[id](response);
				}
			},

			/*
			 * @ngdoc method
			 * @name ADSK.HttpInterceptorService#handleRequestError
			 * @methodOf ADSK.HttpInterceptorService.service
			 * @description Calls handler for request error
			 *
			 * @param {Object} rejection The object returned by the $http service
			 *
			 */
			handleRequestError: function (id, rejection) {
				id = sanitizeId(id);
				if (angular.isDefined(requestErrorHandlerObj) && angular.isDefined(requestErrorHandlerObj[id])) {
					requestErrorHandlerObj[id](rejection);
				}
			},

			/*
			 * @ngdoc method
			 * @name ADSK.HttpInterceptorService#handleRequest
			 * @methodOf ADSK.HttpInterceptorService.service
			 * @description Calls handler for request
			 *
			 * @param {Object} config The object returned by the $http service
			 *
			 */
			handleRequest: function (id, config) {
				id = sanitizeId(id);
				if (angular.isDefined(requestHandlerObj) && angular.isDefined(requestHandlerObj[id])) {
					requestHandlerObj[id](config);
				}
			}
		};
	}
]);