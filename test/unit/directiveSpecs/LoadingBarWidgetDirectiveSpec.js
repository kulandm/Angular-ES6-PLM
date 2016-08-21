'use strict';

describe('LoadingBarWidgetDirective',function () {
    var el, scope, $compile, $rootScope, $timeout, mockAuthenticationService, mockLoadingBarWidgetConfig;

    beforeEach(module('plm360', 'partials/loadingBar.html'));

    beforeEach(function () {
        mockAuthenticationService = sinon.stub({
            isLogged: function () {
                return false;
            },
            unsetReAuth: function () {}
        });
        mockLoadingBarWidgetConfig = {
            DEFAULT_TIMEOUT: 1,                   // the default timeout for animations and waiting for requests/responses to stop happening
            FINISH_ALL_CSS_ANIMATIONS_TIMEOUT: 1  // the timeout to wait for all CSS transitions to finish (width and height)
        };

        module(function ($provide) {
            $provide.value('AuthenticationService', mockAuthenticationService);
            $provide.value('LoadingBarWidgetConfig', mockLoadingBarWidgetConfig);
        });
    });

    beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $compile = _$compile_;
        $timeout = _$timeout_;
    }));

    beforeEach(function () {
        scope.isDataLoading = false;

        // create and compile directive
        el = angular.element('<loading-bar-widget></loading-bar-widget>');
        $compile(el)(scope);
        scope.$digest();
    });
});
