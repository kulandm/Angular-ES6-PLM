'use strict';

/**
 * @ngdoc object
 * @name Services.CommentsService
 *
 * @description Handles communication with A360 Commenting Service
 *
 * ##Dependencies
 *
 */
/* global plm360 */
var CommentsService = plm360.factory('CommentsService', [
	'$http',
	'$q',
	'PLM360.Token.service',
	'_',
	function ($http, $q, PLMTokenService, _) {

		/**
		 * @ngdoc property
		 * @name Services.CommentsService#commentingServiceBase
		 * @propertyOf Services.CommentsService
		 * @description `private` The base URL for the commenting service
		 */
		var commentingServiceBase = 'https://developer-stg.api.autodesk.com/comments/v2/resources/';

		/*
		 * CommentsService object to expose the public methods
		 *
		 */
		return {

			/*
			 * @ngdoc method
			 * @name Services.CommentsService#get
			 * @methodOf Services.CommentsService
			 * @description Retrieves from comments service given urn
			 *
			 * @param 	{String} 	urn			The urn of the item
			 *
			 * @returns {Object} 						The Promise of the ajax call
			 *
			 */
			get: function (urn) {
				var deferred = $q.defer();
				PLMTokenService.get().then(function (token) {
					$http({
						method: 'GET',
						url: commentingServiceBase + urn,
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + token
						}
					}).then(function (comments) {
						deferred.resolve(comments);
					});
				});
				return deferred.promise;
			},

			/*
			 * @ngdoc method
			 * @name Services.CommentsService#postReply
			 * @methodOf Services.CommentsService
			 * @description Post replies to comment to comments service
			 *
			 * @param 	{Object} 	comment			The comment object
			 * @param	{Array} 	tags			The tags to be added to the comment (ex. used for tagging revision in item), in the format of array
			 *										[{name:"name",value:"value"}]
			 *
			 * @returns {Object} 						The Promise of the ajax call
			 *
			 */
			postReply: function (comment, tags) {
				var deferred = $q.defer();
				PLMTokenService.get().then(function (token) {
					$http({
						method: 'POST',
						url: commentingServiceBase + comment.encodedId,
						data: {
							body: comment.replyText,
							tags: tags
						},
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + token
						}
					}).then(function (postRet) {
						deferred.resolve(postRet);
					});
				});
				return deferred.promise;
			},

			/*
			 * @ngdoc method
			 * @name Services.CommentsService#postReply
			 * @methodOf Services.CommentsService
			 * @description Post replies to comment to comments service
			 *
			 * @param 	{String} 	urn			The urn of the item
			 * @param 	{String} 	commentText			The comment string to be posted
			 * @param	{Array} 	tags			The tags to be added to the comment (ex. used for tagging revision in item), in the format of array
			 *										[{name:"name",value:"value"}]
			 *
			 * @returns {Object} 						The Promise of the ajax call
			 *
			 */
			postComment: function (urn, commentText, tags) {
				var deferred = $q.defer();
				PLMTokenService.get().then(function (token) {
					$http({
						method: 'POST',
						url: commentingServiceBase + urn,
						data: {
							body: commentText,
							tags: tags
						},
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + token
						}
					}).then(function (postRet) {
						deferred.resolve(postRet);
					});
				});
				return deferred.promise;
			}
		};
	}
]);
