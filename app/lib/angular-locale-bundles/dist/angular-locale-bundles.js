/**! 
 * @license angular-locale-bundles v0.1.7
 * Copyright (c) 2013 Ares Project Management LLC <code@prismondemand.com>. https://github.com/AresProjectManagement/angular-locale-bundles
 * License: MIT
 */
(function () {
    'use strict';

    var LocaleBundle = function ($http, $parse, $log, apiUrl, options) {
        var _self = this,
            _options = angular.extend({
                responseTransformer: function (response) {
                    return response.data;
                },
                httpOpts: undefined,
                translations: undefined
            }, options);

        this.translations = (_options.translations && _options.translations.then) ?
            _options.translations :
            $http.get(apiUrl, _options.httpOpts)
                .then(_options.responseTransformer, function () {
                    return {};
                });

        function checkParent(key, scope) {
            var parts = key.split('.');
            parts.pop();
            var parentKey = parts.join('.');
            return !angular.isString($parse(parentKey)(scope));
        }

        this.addToScope = function (scope, prefix) {
            prefix = prefix || 'bundle';
            _self.translations.then(function (translations) {
                angular.forEach(translations, function (value, key) {
                    var path = prefix + '.' + key;
                    if (checkParent(path, scope)) {
                        $parse(path).assign(scope, value);
                    } else {
                        $log.warn('Cannot set `' + path + '` to `' + value + '`. Parent is already set to a string primitive.');
                    }
                });
            });
        };

        this.get = function (key) {
            return _self.translations.then(function (translations) {
                return translations[key] || key;
            }, function () {
                return key;
            });
        };

        this.filter = function (predicate) {
            var opts = angular.copy(_options);
            opts.translations = _self.translations.then(function (translations) {
                var filtered = {};
                angular.forEach(translations, function (value, key) {
                    if (predicate(value, key)) {
                        filtered[key] = value;
                    }
                });
                return filtered;
            });
            return new LocaleBundle($http, $parse, $log, apiUrl, opts);
        };

    };

    var localeBundleFactoryProvider = function () {
        var _bundleUrl,
            _bundleLocaleUrl,
            _httpOpts = {},
            _useAcceptLang = true,
            _httpCache = true,
            _responseTransformer = function (response) {
                return response.data;
            };

        this.httpConfig = function (httpConfig) {
            angular.extend(_httpOpts, httpConfig);
        };

        this.bundleUrl = function (url) {
            _bundleUrl = url;
        };

        this.bundleLocaleUrl = function (url) {
            _bundleLocaleUrl = url;
        };

        this.responseTransformer = function (transformer) {
            _responseTransformer = transformer;
        };

        this.useAcceptLanguageHeader = function (enable) {
            _useAcceptLang = enable;
        };

        this.enableHttpCache = function (cache) {
            _httpCache = cache;
        };

        this.$get = function ($http, $parse, $log) {
            return function (bundle, locale) {
                var url = _createUrl(bundle, locale);
                var httpOpts = {
                    headers: locale && _useAcceptLang ? {'Accept-Language': locale} : undefined,
                    cache: _httpCache
                };

                angular.extend(httpOpts, _httpOpts);

                return new LocaleBundle($http, $parse, $log, url, {
                    httpOpts: httpOpts,
                    responseTransformer: _responseTransformer
                });
            };
        };
        this.$get.$inject = ['$http', '$parse', '$log'];

        function _createUrl(bundle, locale) {
            if (locale) {
                return _bundleLocaleUrl.replace('{{bundle}}', bundle || '').replace('{{locale}}', locale || '');
            }
            return _bundleUrl.replace('{{bundle}}', bundle || '');
        }

    };

    var localeBundleDirective = function (localeBundleFactory) {

        function parseLocaleBundleAttr(attr) {
            if (!attr || attr.trim().length === 0) {
                return null;
            }

            var details = {
                    bundle: attr,
                    prefix: 'bundle'
                },
                parts = [];

            if (attr.indexOf(' as ') > -1) {
                parts = attr.split(/\s+as\s+/);
                details.bundle = parts[0];
                details.prefix = parts[1];
            }

            return details;
        }

        return {
            link: function (scope, element, attrs) {
                var bundleDetails = parseLocaleBundleAttr(attrs.localeBundle);
                if (!bundleDetails) {
                    return;
                }

                localeBundleFactory(bundleDetails.bundle).addToScope(scope, bundleDetails.prefix);
                scope.$watch(bundleDetails.prefix + '.locale', function (locale) {
                    if (!locale || locale.trim().length === 0) {
                        localeBundleFactory(bundleDetails.bundle).addToScope(scope, bundleDetails.prefix);
                    } else {
                        localeBundleFactory(bundleDetails.bundle, locale).addToScope(scope, bundleDetails.prefix);
                    }
                });
            }
        };
    };

    angular.module('angular-locale-bundles', [])
        .provider('localeBundleFactory', localeBundleFactoryProvider)
        .directive('localeBundle', ['localeBundleFactory', localeBundleDirective]);


}());




