# angular-locale-bundles

> Internationalization and localization service and directive for AngularJs

[![Build Status](https://travis-ci.org/AresProjectManagement/angular-locale-bundles.png?branch=master)](https://travis-ci.org/AresProjectManagement/angular-locale-bundles)
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/AresProjectManagement/angular-locale-bundles/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

## Installation

Download [angular-locale-bundles.js](https://github.com/AresProjectManagement/angular-locale-bundles/blob/master/src/angular-locale-bundles.js) or install with bower.

```bash
$ bower install angular-locale-bundles --save
```

Load the `angular-locale-bundles` modules into your app and configure...

```javascript
angular.module('app', ['angular-locale-bundles'])
    .config(['localeBundleFactoryProvider', function (localeBundleFactoryProvider) {
        // URL pattern to fetch locale bundles.  Placeholders: {{bundle}}
        localeBundleFactoryProvider.bundleUrl('/i18n/{{bundle}}.json');

        // URL pattern to fetch locale bundles.  Placeholders: {{bundle}} and {{locale}}
        localeBundleFactoryProvider.bundleLocaleUrl('/i18n/{{bundle}}-{{locale}}.json');

        // Add the locale to the 'Accept-Language' header.  Default is true.
        localeBundleFactoryProvider.useAcceptLanguageHeader(true);

        // Cache AJAX requests.  Default is true.
        localeBundleFactoryProvider.enableHttpCache(true);

        // Transform responses.  Default returns 'response.data'.
        localeBundleFactoryProvider.responseTransformer(function (response) {
            return response.data.body;
        });
    }]);
```

## Usage

### `locale-bundle` directive

Use the `locale-bundle` directive to apply a locale bundle's translations to the scope of the directive.  The directive also
sets a `$watch` for `<prefix>.locale` and applies the new locale into the scope.

```html
<header>
    <select ng-model="bundle.locale" ng-options="locale.value as locale.name for locale in locales"></select>
</header>

<!-- fetch the `hero-unit` bundle and apply the current scope prefixed with `bundle.` (default) -->
<div class="hero-unit" locale-bundle="hero-unit">
    <h1>{{ bundle.greeting }}</h1>

    <p>{{ bundle.numbersLabel }}</p>
    <ul>
        <li ng-repeat="number in numbers">{{number}}</li>
    </ul>

    <h3>{{ bundle.enjoy.coding }}</h3>
</div>

<!-- fetch the `footer` bundle and apply the current scope prefixed with `translations.` -->
<footer locale-bundle="footer as translations">
    <select ng-model="translations.locale" ng-options="locale.value as locale.name for locale in locales"></select>
    <p>
        <small>{{ translations.copyright }}</small>
    </p>
</footer>

```

### `localeBundleFactory` service

Use `localeBundleFactory` to manually fetch locale bundles and apply them to scopes.

```javascript
angular.module('angularLocaleBundlesApp')
    .controller('MainCtrl', ['$scope', 'localeBundleFactory', function ($scope, localeBundleFactory) {

        $scope.numbers = localeBundleFactory('numbers', 'en_US').translations;

        $scope.$watch('bundle.locale', function (locale) {
            $scope.numbers = localeBundleFactory('numbers', locale).translations;
        });

        $scope.locales = [
            {name: 'default', value: ''},
            {name: 'English (US)', value: 'en_US'},
            {name: 'English (AU)', value: 'en_AU'},
            {name: 'Spanish (US)', value: 'es_US'}
        ];

    }]);
```

### `LocaleBundle` API

#### `translations`
A [promise](http://docs.angularjs.org/api/ng.$q) that resolves the bundle's translations.

#### `addToScope(scope, prefix)`
Adds the bundle's translations to the given scope with given prefix.  Default prefix is `bundle.`.

#### `get(translation)`
Returns a [promise](http://docs.angularjs.org/api/ng.$q) that resolves a translation value.

### Sample App

See https://github.com/AresProjectManagement/angular-locale-bundles/tree/master/app.

## Contributing

### Prerequisites

The project requires [Bower](http://bower.io), [Grunt](http://gruntjs.com), and [PhantomJS](http://phantomjs.org).  Once you have installed them, you can build, test, and run the project.

### Build & Test

To build and run tests, run either...

```bash
$ make install
```

or

```bash
$ npm install
$ bower install
$ grunt build
```

### Demo & Develop

To run a live demo or do some hackery, run...

```bash
$ grunt server
```

## License

MIT
