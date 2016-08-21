# PLM UI Underscore Service

This is essentially a thin wrapper of the [Underscore.js](http://underscorejs.org/) library.  It is done by mapping `window._` to an Angular service `_`.  

## Usage
Simply list `_` as a dependency within any angular entities, for example:
```
angular.controller('myController', [
    '_',
    function (_) {
        ...
        _.each(myArray, function (...) {
            ...
        });
        ...
    }
]);
```
