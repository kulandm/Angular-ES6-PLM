System.registerModule("com/autodesk/services/ValidationUtil.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/services/ValidationUtil.js";
  var underscoreModule = System.get("com/autodesk/UnderscoreService.js").default;
  var ValidationUtil = function() {
    function ValidationUtil($rootScope, _) {
      this._ = _;
      this.$rootScope = $rootScope;
    }
    return ($traceurRuntime.createClass)(ValidationUtil, {
      clearValidationErrors: function(fields, fieldProperty) {
        var fieldErrorProperty = fieldProperty || 'serverError';
        this._.each(fields, function(field) {
          field[fieldErrorProperty] = null;
        });
      },
      mapValidationErrors: function(fields, validations, options) {
        var $__3 = this;
        var unhandledValidations = [];
        var fieldErrorProperty = (options && options.fieldProperty) || 'serverError';
        var validationErrorProperty = (options && options.validationProperty) || 'message';
        this._.each(validations, function(validation) {
          var field = $__3._.find(fields, function(field) {
            return (options && options.predicate) ? options.predicate(field, validation) : field.urn === validation.field.urn;
          });
          if (field) {
            field[fieldErrorProperty] = (options && options.localizedError === true) ? $__3.localizeString(validation[validationErrorProperty], validation.arguments) : $__3.format(validation[validationErrorProperty], validation.arguments);
          } else {
            unhandledValidations.push(validation);
          }
        });
        return unhandledValidations;
      },
      localizeString: function(unLocalizedString, params) {
        var localizedStr = this.getNestedPropertyValue(this.$rootScope.bundle, unLocalizedString);
        return localizedStr ? this.format(localizedStr, params) : unLocalizedString;
      },
      getNestedPropertyValue: function(obj, str) {
        str = str.replace(/\[(\w+)\]/g, '.$1');
        str = str.replace(/^\./, '');
        var properties = str.split('.');
        for (var i = 0,
            n = properties.length; i < n; ++i) {
          var k = properties[i];
          if (k in obj) {
            obj = obj[k];
          } else {
            return;
          }
        }
        return obj;
      },
      format: function(str, params) {
        if (params) {
          return str.replace(/{(\d+)}/g, function(match, number) {
            return angular.isDefined(params[number]) ? params[number] : match;
          });
        }
        return str;
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, [underscoreModule.name]).factory('ValidationUtil', ['$rootScope', '_', function($rootScope, _) {
    return new ValidationUtil($rootScope, _);
  }]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/services/ValidationUtil.js
