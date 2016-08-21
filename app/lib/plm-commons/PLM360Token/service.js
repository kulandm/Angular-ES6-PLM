'use strict';

/**
 * @ngdoc Service
 * @name PLM360.Token.service
 *
 * @description This defines service for managing PLM token
 *
 * ##Dependencies
 *
 */
var PLM360Token = angular.module('PLM360.Token', []);

PLM360Token.factory('PLM360.Token.service', [
 '$http',
 '$q',
 'TokenService',
 function ($http, $q, TokenService) {
        /**
         * @ngdoc property
         * @name PLM360.Token.service#tokenUrl
         * @propertyOf PLM360.Token.service
         * @description `private` The api endpoint in PLM for retrieving bearer token
         */
        var tokenUrl = '/api/rest/v1/token';        

        /*
         * service object to expose the public methods
         *
         */
        return {

            /*
             * @ngdoc method
             * @name PLM360.Token.service#get
             * @methodOf PLM360.Token.service
             * @description Retrieves the token
             * Promise resolves the only the access_token when tokenOnly paramter set, else resolves the entire token (token_type, access_token, expire_in)
             *
             * @params  {Boolean} tokenOnly - Default true, when true returns only the access_token, else resolves the entire token object
             * @returns {Object} The Promise of the ajax call
             *
             */
            get: function (config) {
                var lastToken;

                // The below code is temporary as we need to migrate existing token string to new token string format
                // we are doing this as only strings can be stored in Local storage
                // TODO: remove the below logic(in about 2 weeks from 10th may 2016) and just assign lastToken after json parsing
                if(TokenService.get() && TokenService.get().indexOf('token_type') > -1) {
                    // We need to parse as the localstorage object is stringified
                    lastToken = JSON.parse(TokenService.get());

                } else {
                    lastToken = '';
                }
                
                //Accepted Config Value to return just the access token - Defaults to true
                var tokenOnly = (config && config.hasOwnProperty('tokenOnly') && typeof config.tokenOnly !== 'undefined' ? config.tokenOnly : true);
                //Accepted Config Value to force a new access token - Defaults to false
                var forceNew = (config && config.hasOwnProperty('forceNew') && typeof config.forceNew !== 'undefined' ? config.forceNew : false);

                //If we have a token, its not expired, and we werent requested to generate a new token, just return the cached token
                if (lastToken && (new Date()).getTime() < (lastToken.valid_till) && !forceNew) {
                    return tokenOnly ? $q.when(lastToken.access_token) : $q.when(lastToken);
                }

                var deferred = $q.defer();

                $http.get(tokenUrl).then(function (ret) {
                    // Calculate actual expiry time and add it to the object
                    // Expires_in *1000 to convert to milliseconds (expires_in normally in seconds)
                    ret.data.valid_till = new Date().getTime() + (ret.data.expires_in * 1000);
                    // Need to Stringify the object to store it in localstorage
                    TokenService.set(JSON.stringify(ret.data));
                    return tokenOnly ? deferred.resolve(ret.data.access_token) : deferred.resolve(ret.data);

                }, function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }
        };
 }
]);