System.registerModule("com/autodesk/CWSFieldAdapter.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/CWSFieldAdapter.js";
  var FieldSelectorInterface = System.get("com/autodesk/FieldSelectorInterface.js").FieldSelectorInterface;
  var FieldSelectorCustomError = System.get("com/autodesk/FieldSelectorCustomError.js").FieldSelectorCustomError;
  var CWSFieldAdapterText = System.get("com/autodesk/CWSFieldAdapterText.js").CWSFieldAdapterText;
  var CWSFieldAdapterNumber = System.get("com/autodesk/CWSFieldAdapterNumber.js").CWSFieldAdapterNumber;
  var CWSFieldAdapterPicklist = System.get("com/autodesk/CWSFieldAdapterPicklist.js").CWSFieldAdapterPicklist;
  var CWSFieldAdapter = function($__super) {
    function CWSFieldAdapter(data) {
      $traceurRuntime.superConstructor(CWSFieldAdapter).call(this, data);
      var that = this;
      var prop;
      var descriptor;
      that.__origin = data;
      that.type = 'FIELD';
      that.description = that.__origin.title;
      var instance = null;
      switch (that.__origin.type) {
        case 'text':
          instance = new CWSFieldAdapterText(that);
          break;
        case 'number':
          instance = new CWSFieldAdapterNumber(that);
          break;
        case 'picklist':
          instance = new CWSFieldAdapterPicklist(that);
          break;
        default:
          throw new FieldSelectorCustomError('Unsupported field type', 'CWSFieldAdapter');
          break;
      }
      for (prop in instance) {
        descriptor = Object.getOwnPropertyDescriptor(instance, prop);
        Object.defineProperty(that, prop, descriptor);
      }
    }
    return ($traceurRuntime.createClass)(CWSFieldAdapter, {getOriginData: function() {
        return this.__origin;
      }}, {}, $__super);
  }(FieldSelectorInterface);
  return {get CWSFieldAdapter() {
      return CWSFieldAdapter;
    }};
});
//# sourceURL=com/autodesk/CWSFieldAdapter.js
;

System.registerModule("com/autodesk/CWSFieldAdapterGeneric.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/CWSFieldAdapterGeneric.js";
  var CWSFieldAdapterGeneric = function() {
    function CWSFieldAdapterGeneric(upperThat) {
      Object.assign(this, upperThat);
      var that = this;
      that.metadata = {dataTypeId: null};
      that.fieldMetadata = {
        visibility: 'ALWAYS',
        readOnly: that.__origin.readOnly
      };
      if (that.__origin.required) {
        that.fieldMetadata.validationRules = {required: true};
      }
      Object.defineProperty(that, 'title', {
        enumerable: true,
        get: function() {
          return that.__origin.displayName;
        },
        set: function(value) {
          that.__origin.displayName = value;
        }
      });
    }
    return ($traceurRuntime.createClass)(CWSFieldAdapterGeneric, {}, {});
  }();
  return {get CWSFieldAdapterGeneric() {
      return CWSFieldAdapterGeneric;
    }};
});
//# sourceURL=com/autodesk/CWSFieldAdapterGeneric.js
;

System.registerModule("com/autodesk/CWSFieldAdapterNumber.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/CWSFieldAdapterNumber.js";
  var CWSFieldAdapterGeneric = System.get("com/autodesk/CWSFieldAdapterGeneric.js").CWSFieldAdapterGeneric;
  angular.module(__moduleName, []).factory('CWSFieldAdapterNumber', [function() {
    return CWSFieldAdapterNumber;
  }]);
  var CWSFieldAdapterNumber = function($__super) {
    function CWSFieldAdapterNumber(upperThat) {
      $traceurRuntime.superConstructor(CWSFieldAdapterNumber).call(this, upperThat);
      var that = this;
      that.metadata.dataTypeId = 2;
      that.fieldMetadata.fieldLength = 15;
      that.__origin.internalValue = null;
      var setValue = function(value) {
        var valueToShow = (angular.isDefined(value) && (value !== '')) ? value : null;
        that.__origin.valueToShow = valueToShow;
        that.__origin.internalValue = valueToShow !== null && !isNaN(valueToShow) ? 1 * valueToShow : null;
      };
      setValue(that.__origin.valueToShow);
      Object.defineProperty(that, 'value', {
        enumerable: true,
        get: function() {
          return that.__origin.valueToShow !== null ? that.__origin.valueToShow.toString() : '';
        },
        set: setValue
      });
    }
    return ($traceurRuntime.createClass)(CWSFieldAdapterNumber, {}, {}, $__super);
  }(CWSFieldAdapterGeneric);
  return {get CWSFieldAdapterNumber() {
      return CWSFieldAdapterNumber;
    }};
});
//# sourceURL=com/autodesk/CWSFieldAdapterNumber.js
;

System.registerModule("com/autodesk/CWSFieldAdapterPicklist.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/CWSFieldAdapterPicklist.js";
  var CWSFieldAdapterGeneric = System.get("com/autodesk/CWSFieldAdapterGeneric.js").CWSFieldAdapterGeneric;
  var CWSFieldAdapterPicklist = function($__super) {
    function CWSFieldAdapterPicklist(upperThat) {
      var $__3,
          $__4,
          $__5,
          $__6;
      $traceurRuntime.superConstructor(CWSFieldAdapterPicklist).call(this, upperThat);
      var that = this;
      that.metadata.dataTypeId = 666;
      Object.defineProperty(that, 'value', {
        enumerable: true,
        get: ($__3 = this, function() {
          return ($__3.__origin.options.filter(function(option) {
            return option.selected;
          })).shift();
        }),
        set: ($__4 = this, function(value) {
          value = (value === undefined) ? '' : '' + value;
          $__4.__origin.options.forEach(function(option) {
            option.selected = (option.value === value) ? true : false;
          });
        })
      });
      Object.defineProperty(that, 'options', {
        enumerable: true,
        get: ($__5 = this, function() {
          return $__5.__origin.options;
        }),
        set: ($__6 = this, function(value) {
          if (Array.isArray(value)) {
            $__6.__origin.options = value;
          } else if (value !== undefined && value !== null) {
            if (Array.isArray($__6.__origin.options)) {
              $__6.__origin.options.push(value);
            } else {
              $__6.__origin.options = [value];
            }
          }
        })
      });
    }
    return ($traceurRuntime.createClass)(CWSFieldAdapterPicklist, {}, {}, $__super);
  }(CWSFieldAdapterGeneric);
  return {get CWSFieldAdapterPicklist() {
      return CWSFieldAdapterPicklist;
    }};
});
//# sourceURL=com/autodesk/CWSFieldAdapterPicklist.js
;

System.registerModule("com/autodesk/CWSFieldAdapterText.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/CWSFieldAdapterText.js";
  var CWSFieldAdapterGeneric = System.get("com/autodesk/CWSFieldAdapterGeneric.js").CWSFieldAdapterGeneric;
  angular.module(__moduleName, []).factory('CWSFieldAdapterText', [function() {
    return CWSFieldAdapterText;
  }]);
  var CWSFieldAdapterText = function($__super) {
    function CWSFieldAdapterText(upperThat) {
      $traceurRuntime.superConstructor(CWSFieldAdapterText).call(this, upperThat);
      var that = this;
      that.metadata.dataTypeId = 4;
      that.fieldMetadata.fieldLength = 4999;
      Object.defineProperty(this, 'value', {
        enumerable: true,
        get: function() {
          return that.__origin.valueToShow;
        },
        set: function(value) {
          that.__origin.valueToShow = value;
        }
      });
    }
    return ($traceurRuntime.createClass)(CWSFieldAdapterText, {}, {}, $__super);
  }(CWSFieldAdapterGeneric);
  return {get CWSFieldAdapterText() {
      return CWSFieldAdapterText;
    }};
});
//# sourceURL=com/autodesk/CWSFieldAdapterText.js
;

System.registerModule("com/autodesk/FieldSelectorCustomError.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/FieldSelectorCustomError.js";
  var FieldSelectorCustomError = function() {
    function FieldSelectorCustomError(message, className) {
      this.message = (message) ? message : 'Error';
      this.class = (className) ? className : null;
    }
    return ($traceurRuntime.createClass)(FieldSelectorCustomError, {}, {});
  }();
  return {get FieldSelectorCustomError() {
      return FieldSelectorCustomError;
    }};
});
//# sourceURL=com/autodesk/FieldSelectorCustomError.js
;

System.registerModule("com/autodesk/FieldSelectorFactory.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/FieldSelectorFactory.js";
  var PLMFieldAdapter = System.get("com/autodesk/PLMFieldAdapter.js").PLMFieldAdapter;
  var CWSFieldAdapter = System.get("com/autodesk/CWSFieldAdapter.js").CWSFieldAdapter;
  var FieldSelectorCustomError = System.get("com/autodesk/FieldSelectorCustomError.js").FieldSelectorCustomError;
  var FieldSelectorFactory = function() {
    function FieldSelectorFactory() {
      return function(data, sourceType) {
        switch (sourceType) {
          case 'PLM':
            return new PLMFieldAdapter(data);
            break;
          case 'CWS':
            return new CWSFieldAdapter(data);
            break;
          default:
            throw new FieldSelectorCustomError('Unsupported source type', 'FieldSelectorFactory');
            break;
        }
      };
    }
    return ($traceurRuntime.createClass)(FieldSelectorFactory, {}, {});
  }();
  var $__default = angular.module(__moduleName, []).factory('FieldSelectorFactory', [function() {
    return new FieldSelectorFactory();
  }]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/FieldSelectorFactory.js
;

System.registerModule("com/autodesk/FieldSelectorInterface.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/FieldSelectorInterface.js";
  var FieldSelectorCustomError = System.get("com/autodesk/FieldSelectorCustomError.js").FieldSelectorCustomError;
  var FieldSelectorInterface = function() {
    function FieldSelectorInterface(data) {}
    return ($traceurRuntime.createClass)(FieldSelectorInterface, {getOriginData: function() {
        throw new FieldSelectorCustomError('must implement', 'getOriginData');
      }}, {});
  }();
  return {get FieldSelectorInterface() {
      return FieldSelectorInterface;
    }};
});
//# sourceURL=com/autodesk/FieldSelectorInterface.js
;

System.registerModule("com/autodesk/PLMFieldAdapter.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/PLMFieldAdapter.js";
  var FieldSelectorInterface = System.get("com/autodesk/FieldSelectorInterface.js").FieldSelectorInterface;
  var PLMFieldAdapter = function($__super) {
    function PLMFieldAdapter(data) {
      $traceurRuntime.superConstructor(PLMFieldAdapter).call(this, data);
      angular.extend(this, data);
    }
    return ($traceurRuntime.createClass)(PLMFieldAdapter, {}, {}, $__super);
  }(FieldSelectorInterface);
  return {get PLMFieldAdapter() {
      return PLMFieldAdapter;
    }};
});
//# sourceURL=com/autodesk/PLMFieldAdapter.js
;

System.registerModule("com/autodesk/autoFocus.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/autoFocus.directive.js";
  function AutoFocus($timeout) {
    var directive = {
      restrict: 'A',
      link: function(scope, element, attributes) {
        attributes.$observe('autoFocus', function(value) {
          if (value === 'true') {
            $timeout(function() {
              $(element).trigger('click');
            });
          }
        });
      }
    };
    return directive;
  }
  AutoFocus.$inject = ['$timeout'];
  var $__default = AutoFocus;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/autoFocus.directive.js
;

System.registerModule("com/autodesk/autoNumberField/autoNumberField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/autoNumberField/autoNumberField.directive.js";
  function AutoNumberField() {
    return {
      restrict: 'E',
      templateUrl: 'autoNumberField/autoNumberField.html',
      scope: {
        fieldData: '=',
        fieldMeta: '=',
        editView: '='
      }
    };
  }
  var $__default = AutoNumberField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/autoNumberField/autoNumberField.directive.js
;

System.registerModule("com/autodesk/autoTextField/autoTextField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/autoTextField/autoTextField.directive.js";
  function AutoTextField() {
    return {
      restrict: 'E',
      templateUrl: 'autoTextField/autoTextField.html',
      scope: {
        fieldData: '=',
        fieldMeta: '=',
        editView: '='
      }
    };
  }
  var $__default = AutoTextField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/autoTextField/autoTextField.directive.js
;

System.registerModule("com/autodesk/checkboxField/checkboxField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/checkboxField/checkboxField.directive.js";
  function CheckboxField() {
    return {
      restrict: 'E',
      templateUrl: 'checkboxField/checkboxField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '=',
        waiting: '='
      }
    };
  }
  var $__default = CheckboxField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/checkboxField/checkboxField.directive.js
;

System.registerModule("com/autodesk/csvField/csvField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/csvField/csvField.directive.js";
  function CsvField() {
    return {
      restrict: 'E',
      templateUrl: 'csvField/csvField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '='
      },
      link: function(scope, element, attrs) {
        if (scope.fieldData && angular.isUndefined(scope.fieldData.originalValue)) {
          scope.fieldData.originalValue = scope.fieldData.value;
        }
        scope.$watch('fieldData', function(newVal) {
          if (newVal && angular.isUndefined(scope.fieldData.originalValue)) {
            scope.fieldData.originalValue = scope.fieldData.value;
          }
        });
      }
    };
  }
  var $__default = CsvField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/csvField/csvField.directive.js
;

System.registerModule("com/autodesk/customValidators/baseFieldValidation.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/customValidators/baseFieldValidation.js";
  var BaseFieldValidation = function() {
    function BaseFieldValidation(validatorDataObj, metadata, element, bundle) {
      this.validatorDataObj = validatorDataObj;
      this.metadata = metadata;
      this.elementToDecorate = element;
      this.invalid = false;
      this.bundle = bundle;
    }
    return ($traceurRuntime.createClass)(BaseFieldValidation, {
      perform: function(fieldData) {},
      remove: function() {
        this.invalid = false;
      }
    }, {});
  }();
  var $__default = BaseFieldValidation;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/customValidators/baseFieldValidation.js
;

System.registerModule("com/autodesk/customValidators/fieldValidator.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/customValidators/fieldValidator.directive.js";
  var FieldValidatorService = System.get("com/autodesk/customValidators/fieldValidator.service.js").default;
  function FieldValidatorDirective() {
    return {link: function(scope, ele) {
        var fieldValidatorList = [];
        var fieldValidatorService = new FieldValidatorService(scope.$root.bundle);
        var performValidation = function(fieldValue) {
          var validationErrors = _.filter(_.map(fieldValidatorList, function(fieldValidator) {
            return fieldValidator.perform(fieldValue);
          }), function(invalid) {
            return invalid;
          });
          if (scope.fieldSelectorCtrl.fieldMeta) {
            scope.fieldSelectorCtrl.fieldMeta.validationErrors = validationErrors;
          }
        };
        scope.$watch('fieldSelectorCtrl.fieldData', performValidation, true);
        scope.$watch('fieldSelectorCtrl.fieldMeta', function() {
          _.each(fieldValidatorList, function(fieldValidator) {
            return fieldValidator.remove();
          });
          if (scope.fieldSelectorCtrl.fieldMeta && scope.fieldSelectorCtrl.fieldMeta.validatorsMeta) {
            fieldValidatorList = _.map(scope.fieldSelectorCtrl.fieldMeta.validatorsMeta, function(validator) {
              return fieldValidatorService.fromFieldValidatorData(validator, scope.fieldSelectorCtrl.fieldMeta, ele);
            });
          }
          performValidation(scope.fieldSelectorCtrl.fieldData);
        }, true);
        scope.$on('$destory', function() {
          _.each(fieldValidatorList, function(fieldValidator) {
            return fieldValidator.remove();
          });
          fieldValidatorList = [];
        });
      }};
  }
  var $__default = FieldValidatorDirective;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/customValidators/fieldValidator.directive.js
;

System.registerModule("com/autodesk/customValidators/fieldValidator.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/customValidators/fieldValidator.service.js";
  var BaseFieldValidation = System.get("com/autodesk/customValidators/baseFieldValidation.js").default;
  var RequiredFieldValidation = System.get("com/autodesk/customValidators/requiredFieldValidation.js").default;
  var MaxLengthFieldValidation = System.get("com/autodesk/customValidators/maxLengthFieldValidation.js").default;
  var FieldValidatorService = function() {
    function FieldValidatorService(bundle) {
      this.bundle = bundle;
    }
    return ($traceurRuntime.createClass)(FieldValidatorService, {fromFieldValidatorData: function(fieldValidatorDataObj, metadata, el) {
        switch (fieldValidatorDataObj.validatorName.toUpperCase()) {
          case 'REQUIRED':
          case 'DROPDOWNSELECTION':
            return new RequiredFieldValidation(fieldValidatorDataObj, metadata, el, this.bundle);
          case 'MAXLENGTH':
            return new MaxLengthFieldValidation(fieldValidatorDataObj, metadata, el, this.bundle);
          default:
            return new BaseFieldValidation(fieldValidatorDataObj, metadata, el, this.bundle);
        }
      }}, {});
  }();
  var $__default = FieldValidatorService;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/customValidators/fieldValidator.service.js
;

System.registerModule("com/autodesk/customValidators/genericServerError.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/customValidators/genericServerError.directive.js";
  function GenericServerError() {
    return {
      require: 'ngModel',
      link: function(scope, ele, attrs, ngModelController) {
        scope.$watch('fieldData.serverError', function(newValue) {
          ngModelController.$setValidity('serverError', !newValue);
          if (newValue) {
            ngModelController.$error.serverError = newValue;
          }
          scope.fieldData.$invalid = ngModelController.$invalid;
        });
      }
    };
  }
  var $__default = GenericServerError;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/customValidators/genericServerError.directive.js
;

System.registerModule("com/autodesk/customValidators/maxLengthFieldValidation.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/customValidators/maxLengthFieldValidation.js";
  var BaseFieldValidation = System.get("com/autodesk/customValidators/baseFieldValidation.js").default;
  var CSS_CLASS = 'max-length-validation';
  var MaxLengthFieldValidation = function($__super) {
    function MaxLengthFieldValidation() {
      var $__3;
      ($__3 = $traceurRuntime.superConstructor(MaxLengthFieldValidation)).call.apply($__3, $traceurRuntime.spread([this], arguments));
      this.elementToDecorate.addClass(CSS_CLASS);
    }
    return ($traceurRuntime.createClass)(MaxLengthFieldValidation, {
      perform: function(fieldData) {
        return this.invalid = (fieldData.value + '').length > this.validatorDataObj.variables.maxlength ? true : false;
      },
      remove: function() {
        $traceurRuntime.superGet(this, MaxLengthFieldValidation.prototype, "remove").call(this);
        this.elementToDecorate.removeClass(CSS_CLASS);
      }
    }, {}, $__super);
  }(BaseFieldValidation);
  var $__default = MaxLengthFieldValidation;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/customValidators/maxLengthFieldValidation.js
;

System.registerModule("com/autodesk/customValidators/requiredFieldValidation.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/customValidators/requiredFieldValidation.js";
  var BaseFieldValidation = System.get("com/autodesk/customValidators/baseFieldValidation.js").default;
  var CSS_CLASS = 'required-field';
  var CSS_CLASS_INVALID = 'required-field-invalid';
  var RequiredFieldValidation = function($__super) {
    function RequiredFieldValidation() {
      var $__3;
      ($__3 = $traceurRuntime.superConstructor(RequiredFieldValidation)).call.apply($__3, $traceurRuntime.spread([this], arguments));
      if (this.metadata.allowPlaceholderChange === true) {
        this._placeholder = this.metadata.placeholder;
        this.metadata.placeholder = this.bundle.text.requiredFieldPlaceHolder;
      }
      this.elementToDecorate.addClass(CSS_CLASS);
    }
    return ($traceurRuntime.createClass)(RequiredFieldValidation, {
      perform: function(fieldData) {
        this.invalid = fieldData.value === null || fieldData.value === undefined || fieldData.value === '';
        if (this.invalid) {
          this.elementToDecorate.addClass(CSS_CLASS_INVALID);
        } else {
          this.elementToDecorate.removeClass(CSS_CLASS_INVALID);
        }
        return this.invalid;
      },
      remove: function() {
        $traceurRuntime.superGet(this, RequiredFieldValidation.prototype, "remove").call(this);
        if (this.metadata.allowPlaceholderChange === true) {
          this.metadata.placeholder = this._placeholder;
        }
        this.elementToDecorate.removeClass(CSS_CLASS);
      }
    }, {}, $__super);
  }(BaseFieldValidation);
  var $__default = RequiredFieldValidation;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/customValidators/requiredFieldValidation.js
;

System.registerModule("com/autodesk/dateField/dateField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/dateField/dateField.directive.js";
  function DateField($filter, $timeout, EventService, ModelsManager) {
    return {
      restrict: 'E',
      templateUrl: 'dateField/dateField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '=',
        waiting: '='
      },
      link: function(scope, element, attrs) {
        scope.dateFormat = null;
        scope.dateFormatMask = null;
        scope.overMe = false;
        scope.formattedDate = {value: null};
        scope.datePickerStatus = {open: false};
        scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 0,
          showWeeks: false,
          formatDayHeader: 'EEE'
        };
        scope.clear = function() {
          return scope.fieldData.value = '';
        };
        scope.showClear = function(show) {
          return scope.overMe = show;
        };
        var currentUserListenerId = EventService.listen('currentUser:currentUser:done', function(event, userObj) {
          EventService.unlisten(currentUserListenerId);
          scope.dateFormat = userObj.getDateFormat();
          scope.dateFormatMask = scope.dateFormat.replace(/[mdyhsS]/gi, '9');
          if (scope.editView === true && angular.isDefined(scope.fieldData) && (scope.fieldData !== null) && angular.isDefined(scope.fieldData.value) && (scope.fieldData.value !== '') && (scope.fieldData.value !== null)) {
            scope.formattedDate.value = $filter('date')(scope.fieldData.value, scope.dateFormat);
          }
        }, true);
        ModelsManager.getCurrentUser();
        scope.$watch('fieldData.value', function(newVal, oldVal) {
          scope.formattedDate.value = $filter('date')(newVal, scope.dateFormat);
        });
        scope.handleDatePicker = function(event) {
          if (!scope.waiting) {
            if (event.type === 'click' && !(scope.datePickerStatus.open && event.srcElement.nodeName === 'INPUT')) {
              $timeout(function() {
                scope.datePickerStatus.open = !scope.datePickerStatus.open;
              }, 100);
            }
          }
        };
        scope.formatDate = function(newVal) {
          if (angular.isDefined(newVal) && newVal !== null && newVal !== '') {
            if (newVal.constructor !== Date) {
              if (angular.isDefined(newVal.indexOf) && newVal.indexOf(',') > -1) {
                scope.fieldData.value = new Date(newVal);
              } else {
                var day = newVal.substr(scope.dateFormat.indexOf('dd'), 2);
                var month = newVal.substr(scope.dateFormat.indexOf('MM'), 2);
                var year = newVal.substr(scope.dateFormat.indexOf('yyyy'), 4);
                scope.fieldData.value = new Date(year, (Number(month) - 1), day);
              }
            } else {
              scope.fieldData.value = newVal;
            }
          } else {
            scope.fieldData.value = null;
          }
        };
      }
    };
  }
  var $__default = DateField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/dateField/dateField.directive.js
;

System.registerModule("com/autodesk/dateFormatter/dateFormatter.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/dateFormatter/dateFormatter.directive.js";
  var DateFormatter = function() {
    function DateFormatter($filter) {
      this.restrict = 'A';
      this.require = 'ngModel';
    }
    return ($traceurRuntime.createClass)(DateFormatter, {link: function(scope, element, attrs, ctrl) {
        ctrl.$formatters.unshift(function(date) {
          return moment(date, 'YYYY-MM-DD').format(attrs.dateFormatter);
        });
        ctrl.$parsers.unshift(function(date) {
          return moment(date, attrs.dateFormatter).format('YYYY-MM-DD');
        });
      }}, {directiveFactory: function($filter) {
        DateFormatter.instance = new DateFormatter($filter);
        return DateFormatter.instance;
      }});
  }();
  DateFormatter.directiveFactory.$inject = ['$filter'];
  var $__default = DateFormatter;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/dateFormatter/dateFormatter.directive.js
;

System.registerModule("com/autodesk/dateFormatter/dateFormatter.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/dateFormatter/dateFormatter.js";
  var DateFormatter = System.get("com/autodesk/dateFormatter/dateFormatter.directive.js").default;
  angular.module(__moduleName, []).directive('dateFormatter', DateFormatter.directiveFactory);
  return {};
});
//# sourceURL=com/autodesk/dateFormatter/dateFormatter.js
;

System.registerModule("com/autodesk/editOnClick.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/editOnClick.directive.js";
  function EditOnClick($document, $parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var editStartHandler = $parse(attrs.onEditStart);
        var editEndHandler = $parse(attrs.onEditEnd);
        function handleEditEnable(event) {
          attrs.$set('editView', 'true');
          if (angular.isDefined(attrs.onEditStart)) {
            editStartHandler(scope);
          }
          scope.$apply();
          element.off('click', handleEditEnable);
          setTimeout(function() {
            $document.on('click', handleEditDisable);
          }, 0);
        }
        function handleEditDisable(event) {
          var target = $(event.target).closest('[edit-on-click]');
          if (target.length > 0 && (target[0] === element[0] || $.contains(target[0], element[0]))) {
            return;
          }
          attrs.$set('editView', 'false');
          if (angular.isDefined(attrs.onEditEnd)) {
            editEndHandler(scope);
          }
          scope.$apply();
          element.on('click', handleEditEnable);
          $document.off('click', handleEditDisable);
        }
        attrs.$observe('editOnClick', function(newValue) {
          if (newValue === 'true') {
            attrs.$set('editView', 'false');
            element.on('click', handleEditEnable);
          } else {
            attrs.$set('editView', 'false');
            element.off('click', handleEditEnable);
          }
        });
      }
    };
  }
  EditOnClick.$inject = ['$document', '$parse'];
  var $__default = EditOnClick;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/editOnClick.directive.js
;

System.registerModule("com/autodesk/emailField/emailField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/emailField/emailField.directive.js";
  function EmailField() {
    return {
      restrict: 'E',
      templateUrl: 'emailField/emailField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '='
      }
    };
  }
  var $__default = EmailField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/emailField/emailField.directive.js
;

System.registerModule("com/autodesk/fieldData/baseFieldData.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/fieldData/baseFieldData.model.js";
  var BaseFieldData = function() {
    function BaseFieldData(args) {
      this.value = args.value;
      this.originalValue = angular.copy(this.value);
      this.typeId = parseInt(args.typeId);
      this.fieldMetadata = (typeof args.fieldMetadata === 'undefined') ? {} : args.fieldMetadata;
      this.metadata = (typeof args.metadata === 'undefined') ? {} : args.metadata;
      this.serverError = args.serverError;
    }
    return ($traceurRuntime.createClass)(BaseFieldData, {
      getValue: function() {
        return this.value;
      },
      updateValue: function(newValue) {
        this.value = newValue;
      },
      isDirty: function() {
        return this.isConsequentialChange(this.originalValue, this.value);
      },
      isConsequentialChange: function(oldValue, newValue) {
        return !angular.equals(newValue, oldValue);
      }
    }, {});
  }();
  var $__default = BaseFieldData;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/fieldData/baseFieldData.model.js
;

System.registerModule("com/autodesk/fieldData/dateFieldData.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/fieldData/dateFieldData.model.js";
  var BaseFieldData = System.get("com/autodesk/fieldData/baseFieldData.model.js").default;
  var DateFieldData = function($__super) {
    function DateFieldData(args) {
      $traceurRuntime.superConstructor(DateFieldData).call(this, args);
      var DEFAULT_FORMAT = 'YYYY-MM-DD';
      this.originalDateFormat = angular.isUndefined(args.originalDateFormat) ? DEFAULT_FORMAT : args.originalDateFormat;
    }
    return ($traceurRuntime.createClass)(DateFieldData, {
      isNullDate: function(value) {
        return !angular.isDefined(value) || value === null || value === '';
      },
      isDateDefined: function(value) {
        return !this.isNullDate(value);
      },
      isConsequentialChange: function(oldValue, newValue) {
        if (this.isDateDefined(oldValue) && this.isDateDefined(newValue)) {
          var formattedOldValue = moment(oldValue, this.originalDateFormat);
          var formattedNewValue = moment(newValue, this.originalDateFormat);
          return !moment(formattedNewValue).isSame(formattedOldValue, 'day');
        } else if (this.isNullDate(oldValue) && this.isNullDate(newValue)) {
          return false;
        } else {
          return !angular.equals(oldValue, newValue);
        }
      }
    }, {}, $__super);
  }(BaseFieldData);
  var $__default = DateFieldData;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/fieldData/dateFieldData.model.js
;

System.registerModule("com/autodesk/fieldData/fieldData.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/fieldData/fieldData.js";
  var BaseFieldData = System.get("com/autodesk/fieldData/baseFieldData.model.js").default;
  var FloatFieldData = System.get("com/autodesk/fieldData/floatFieldData.model.js").default;
  var MoneyFieldData = System.get("com/autodesk/fieldData/moneyFieldData.model.js").default;
  var DateFieldData = System.get("com/autodesk/fieldData/dateFieldData.model.js").default;
  var PicklistFieldData = System.get("com/autodesk/fieldData/picklistFieldData.model.js").default;
  var SelectionFieldData = System.get("com/autodesk/fieldData/selectionFieldData.model.js").default;
  var FieldDataFactory = function() {
    function FieldDataFactory(FieldTypes) {
      this.FieldTypes = FieldTypes;
    }
    return ($traceurRuntime.createClass)(FieldDataFactory, {fromFieldData: function(fieldTypeId, args) {
        var typeId = parseInt(fieldTypeId);
        if (angular.isUndefined(args.typeId)) {
          args.typeId = typeId;
        }
        switch (typeId) {
          case this.FieldTypes.PICKLIST_DEFAULT:
          case this.FieldTypes.PICKLIST:
          case this.FieldTypes.PICKLIST_DEFAULT_LINKED:
          case this.FieldTypes.PICKLIST_LINKED:
          case this.FieldTypes.PICKLIST_LATEST:
          case this.FieldTypes.PICKLIST_LRL:
          case this.FieldTypes.MULTISELECT:
          case this.FieldTypes.MULTISELECT_LINKED:
          case this.FieldTypes.PICKLIST_FILTERED:
          case this.FieldTypes.PICKLIST_FILTER_LINKED:
          case this.FieldTypes.PICKLIST_WITH_FILTER:
          case this.FieldTypes.RADIO:
          case this.FieldTypes.RADIO_LINKED:
            return new PicklistFieldData(args);
          case this.FieldTypes.FLOAT:
            return new FloatFieldData(args);
          case this.FieldTypes.MONEY:
          case this.FieldTypes.MONEY_EXTENDED:
            return new MoneyFieldData(args);
          case this.FieldTypes.DATE:
            return new DateFieldData(args);
          case this.FieldTypes.SELECTION:
            return new SelectionFieldData(args);
          default:
            return new BaseFieldData(args);
        }
      }}, {});
  }();
  FieldDataFactory.$inject = ['FieldTypes'];
  angular.module(__moduleName, []).service('FieldData', FieldDataFactory).value('BaseFieldData', BaseFieldData).value('FloatFieldData', FloatFieldData).value('MoneyFieldData', MoneyFieldData).value('DateFieldData', DateFieldData).value('PicklistFieldData', PicklistFieldData).value('SelectionFieldData', SelectionFieldData);
  return {};
});
//# sourceURL=com/autodesk/fieldData/fieldData.js
;

System.registerModule("com/autodesk/fieldData/floatFieldData.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/fieldData/floatFieldData.model.js";
  var BaseFieldData = System.get("com/autodesk/fieldData/baseFieldData.model.js").default;
  var FloatFieldData = function($__super) {
    function FloatFieldData(args) {
      $traceurRuntime.superConstructor(FloatFieldData).call(this, args);
      this.precision = this.metadata.fieldPrecision;
      this.updateValue(this.value);
    }
    return ($traceurRuntime.createClass)(FloatFieldData, {
      getValue: function() {
        return FloatFieldData.removeTrailingZeroes(this.formatFloat(this.value));
      },
      updateValue: function(newValue) {
        this.value = FloatFieldData.removeTrailingZeroes(this.formatFloat(newValue));
      },
      formatFloat: function(value) {
        return FloatFieldData.formatFloatWithPrecision(value, this.precision);
      },
      isConsequentialChange: function(oldValue, newValue) {
        return FloatFieldData.removeTrailingZeroes(this.formatFloat(oldValue)) !== FloatFieldData.removeTrailingZeroes(this.formatFloat(newValue));
      }
    }, {
      removeTrailingZeroes: function(value) {
        if (value !== undefined && value !== null && value.indexOf('.') !== -1) {
          return value.replace(/0*$/, '').replace(/\.$/, '');
        } else {
          return value;
        }
      },
      formatFloatWithPrecision: function(value, fieldPrecision) {
        if (typeof fieldPrecision === 'undefined' || fieldPrecision === null) {
          return value;
        }
        if (value === undefined || value === null || value === '') {
          return value;
        }
        var parsed = Number(value);
        if (!Number.isNaN(parsed)) {
          return parsed.toFixed(fieldPrecision);
        } else {
          return value;
        }
      }
    }, $__super);
  }(BaseFieldData);
  var $__default = FloatFieldData;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/fieldData/floatFieldData.model.js
;

System.registerModule("com/autodesk/fieldData/moneyFieldData.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/fieldData/moneyFieldData.model.js";
  var FloatFieldData = System.get("com/autodesk/fieldData/floatFieldData.model.js").default;
  var MoneyFieldData = function($__super) {
    function MoneyFieldData(args) {
      $traceurRuntime.superConstructor(MoneyFieldData).call(this, args);
    }
    return ($traceurRuntime.createClass)(MoneyFieldData, {}, {}, $__super);
  }(FloatFieldData);
  var $__default = MoneyFieldData;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/fieldData/moneyFieldData.model.js
;

System.registerModule("com/autodesk/fieldData/picklistFieldData.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/fieldData/picklistFieldData.model.js";
  var BaseFieldData = System.get("com/autodesk/fieldData/baseFieldData.model.js").default;
  var PicklistFieldData = function($__super) {
    function PicklistFieldData(args) {
      $traceurRuntime.superConstructor(PicklistFieldData).call(this, args);
      this.link = args.link;
      this.urn = args.urn;
    }
    return ($traceurRuntime.createClass)(PicklistFieldData, {}, {}, $__super);
  }(BaseFieldData);
  var $__default = PicklistFieldData;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/fieldData/picklistFieldData.model.js
;

System.registerModule("com/autodesk/fieldData/selectionFieldData.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/fieldData/selectionFieldData.model.js";
  var BaseFieldData = System.get("com/autodesk/fieldData/baseFieldData.model.js").default;
  var SelectionFieldData = function($__super) {
    function SelectionFieldData(args) {
      $traceurRuntime.superConstructor(SelectionFieldData).call(this, args);
      this.options = args.options;
    }
    return ($traceurRuntime.createClass)(SelectionFieldData, {isConsequentialChange: function(oldValue, newValue) {
        if (oldValue && newValue) {
          return oldValue.title !== newValue.title;
        } else {
          return $traceurRuntime.superGet(this, SelectionFieldData.prototype, "isConsequentialChange").call(this, oldValue, newValue);
        }
      }}, {}, $__super);
  }(BaseFieldData);
  var $__default = SelectionFieldData;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/fieldData/selectionFieldData.model.js
;

System.registerModule("com/autodesk/fieldErrorIndicator.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/fieldErrorIndicator.directive.js";
  function FieldErrorIndicator() {
    return {
      scope: {
        form: '=',
        fieldId: '@'
      },
      templateUrl: 'fieldErrorIndicator.html',
      link: function(scope, ele, attrs) {
        scope.getFormField = function(form, fieldId) {
          return form[fieldId];
        };
      }
    };
  }
  var $__default = FieldErrorIndicator;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/fieldErrorIndicator.directive.js
;

System.registerModule("com/autodesk/fieldSelector.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/fieldSelector.controller.js";
  var FieldSelectorController = function() {
    function FieldSelectorController($scope, FieldTypes, EventService) {
      var $__2 = this;
      this.typeId = parseInt(this.unparsedTypeId);
      this.FieldTypes = FieldTypes;
      this.EventService = EventService;
      this.$scope = $scope;
      if (angular.isDefined(this.fieldMeta) && this.fieldMeta.derived && angular.isDefined(this.fieldId)) {
        this.derivedListener = this.EventService.listen(("derivedFields:" + this.fieldId + ":update"), function(event, value) {
          $__2.fieldData.value = (value === null) ? '' : value;
        });
        this.$scope.$on('$destroy', function() {
          $__2.EventService.unlisten($__2.derivedListener);
        });
      }
      if (!this.unparsedTypeId) {
        var unregister = $scope.$watch(function(scope) {
          return $__2.unparsedTypeId;
        }, function(newValue, oldValue) {
          if (newValue) {
            $__2.typeId = parseInt($__2.unparsedTypeId);
            unregister();
          }
        });
      }
      this.selectionOnChange = function(data) {
        if (data) {
          if (!$__2.fieldData.value) {
            $__2.fieldData.value = {};
          }
          if (angular.isDefined($__2.fieldMeta) && angular.isDefined($__2.fieldMeta.pivotLink)) {
            $__2.fieldMeta.picklistPivotLoader(data.link).then(pivotFieldsIterator);
          }
          $__2.fieldData.value.title = data.title;
          $__2.fieldData.value.link = data.link;
        } else if (data === null) {
          $__2.fieldData.value = null;
          if (angular.isDefined($__2.fieldMeta) && angular.isDefined($__2.fieldMeta.pivotLink)) {
            $__2.fieldMeta.picklistPivotLoader().then(pivotFieldsIterator);
          }
        }
      };
      var pivotFieldsIterator = function(payload) {
        _.each(payload.sections, function(section) {
          _.each(section.fields, function(field) {
            $__2.EventService.send(("derivedFields:" + field.urn + ":update"), field.value);
          });
        });
      };
    }
    return ($traceurRuntime.createClass)(FieldSelectorController, {}, {});
  }();
  var $__default = FieldSelectorController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/fieldSelector.controller.js
;

System.registerModule("com/autodesk/fieldSelector.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/fieldSelector.directive.js";
  function FieldSelector() {
    return {
      restrict: 'E',
      controller: 'FieldSelectorController',
      controllerAs: 'fieldSelectorCtrl',
      bindToController: true,
      templateUrl: 'fieldSelector.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        unparsedTypeId: '=typeId',
        fieldMeta: '=',
        placeholder: '@',
        editView: '@',
        simpleSelect: '@',
        waiting: '=',
        picklistOnChange: '&'
      }
    };
  }
  var $__default = FieldSelector;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/fieldSelector.directive.js
;

System.registerModule("com/autodesk/fieldSelector.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/fieldSelector.js";
  var ModelsManager = System.get("com/autodesk/apiModelsManager.js").default;
  var UrnParser = System.get("com/autodesk/UrnParser.js").default;
  var EventService = System.get("com/autodesk/EventService.js").default;
  var LocalizationService = System.get("com/autodesk/localization.js").default;
  var PicklistUtilsService = System.get("com/autodesk/picklistUtils.service.js").default;
  var FieldSelectorController = System.get("com/autodesk/fieldSelector.controller.js").default;
  var FieldSelectorDirective = System.get("com/autodesk/fieldSelector.directive.js").default;
  var FieldSelectorFactory = System.get("com/autodesk/FieldSelectorFactory.js").default;
  var FieldDataFactory = System.get("com/autodesk/fieldData/fieldData.js").default;
  var AutoFocusDirective = System.get("com/autodesk/autoFocus.directive.js").default;
  var EditOnClickDirective = System.get("com/autodesk/editOnClick.directive.js").default;
  var FieldErrorIndicatorDirective = System.get("com/autodesk/fieldErrorIndicator.directive.js").default;
  var FilteredPicklistFieldService = System.get("com/autodesk/filteredPicklistField/filteredPicklistField.service.js").default;
  var GenericServerErrorDirective = System.get("com/autodesk/customValidators/genericServerError.directive.js").default;
  var FieldValidatorDirective = System.get("com/autodesk/customValidators/fieldValidator.directive.js").default;
  var AutoNumberFieldDirective = System.get("com/autodesk/autoNumberField/autoNumberField.directive.js").default;
  var AutoTextFieldDirective = System.get("com/autodesk/autoTextField/autoTextField.directive.js").default;
  var CheckboxFieldDirective = System.get("com/autodesk/checkboxField/checkboxField.directive.js").default;
  var CsvFieldDirective = System.get("com/autodesk/csvField/csvField.directive.js").default;
  var DateFieldDirective = System.get("com/autodesk/dateField/dateField.directive.js").default;
  var EmailFieldDirective = System.get("com/autodesk/emailField/emailField.directive.js").default;
  var FilteredPicklistFieldDirective = System.get("com/autodesk/filteredPicklistField/filteredPicklistField.directive.js").default;
  var FlashFieldDirective = System.get("com/autodesk/flashField/flashField.directive.js").default;
  var FloatFieldDirective = System.get("com/autodesk/floatField/floatField.directive.js").default;
  var ImageFieldDirective = System.get("com/autodesk/imageField/imageField.directive.js").default;
  var IntegerFieldDirective = System.get("com/autodesk/integerField/integerField.directive.js").default;
  var LongFieldDirective = System.get("com/autodesk/longField/longField.directive.js").default;
  var MoneyFieldDirective = System.get("com/autodesk/moneyField/moneyField.directive.js").default;
  var MultiPicklistFieldDirective = System.get("com/autodesk/multiPicklistField/multiPicklistField.directive.js").default;
  var ParagraphFieldDirective = System.get("com/autodesk/paragraphField/paragraphField.directive.js").default;
  var ParagraphWithoutLineBreaksFieldDirective = System.get("com/autodesk/paragraphWithoutLineBreaksField/paragraphWithoutLineBreaksField.directive.js").default;
  var PicklistFieldDirective = System.get("com/autodesk/picklistField/picklistField.directive.js").default;
  var RadioFieldDirective = System.get("com/autodesk/radioField/radioField.directive.js").default;
  var RichTextFieldDirective = System.get("com/autodesk/richTextField/richTextField.directive.js").default;
  var SimplePicklistFieldDirective = System.get("com/autodesk/simplePicklistField/simplePicklistField.directive.js").default;
  var SingleLineFieldDirective = System.get("com/autodesk/singleLineField/singleLineField.directive.js").default;
  var UrlFieldDirective = System.get("com/autodesk/urlField/urlField.directive.js").default;
  var SelectionFieldDirective = System.get("com/autodesk/selectionField/selectionField.directive.js").default;
  var GenericPicklistFieldDirective = System.get("com/autodesk/genericPicklistField/genericPicklistField.directive.js").default;
  angular.module(__moduleName, ['ngAnimate', 'ngAria', 'ngMaterial', 'textAngular', 'ui.router', 'com/autodesk/fieldData/fieldData.js', 'com/autodesk/FieldSelectorFactory.js', 'com/autodesk/filteredPicklistField/filteredPicklistField.service.js', 'com/autodesk/UrnParser.js', 'com/autodesk/apiModelsManager.js', 'com/autodesk/EventService.js', 'com/autodesk/localization.js']).controller('FieldSelectorController', FieldSelectorController).service('PicklistUtils', PicklistUtilsService).directive('fieldSelector', FieldSelectorDirective).directive('autoFocus', AutoFocusDirective).directive('autoNumberField', AutoNumberFieldDirective).directive('autoTextField', AutoTextFieldDirective).directive('checkboxField', CheckboxFieldDirective).directive('csvField', CsvFieldDirective).directive('dateField', DateFieldDirective).directive('editOnClick', EditOnClickDirective).directive('emailField', EmailFieldDirective).directive('fieldErrorIndicator', FieldErrorIndicatorDirective).directive('fieldValidator', FieldValidatorDirective).directive('filteredPicklistField', FilteredPicklistFieldDirective).directive('flashField', FlashFieldDirective).directive('floatField', FloatFieldDirective).directive('genericServerError', GenericServerErrorDirective).directive('imageField', ImageFieldDirective).directive('integerField', IntegerFieldDirective).directive('longField', LongFieldDirective).directive('moneyField', MoneyFieldDirective).directive('multiPicklistField', MultiPicklistFieldDirective).directive('paragraphField', ParagraphFieldDirective).directive('paragraphWithoutLineBreaksField', ParagraphWithoutLineBreaksFieldDirective).directive('picklistField', PicklistFieldDirective).directive('radioField', RadioFieldDirective).directive('richTextField', RichTextFieldDirective).directive('simplePicklistField', SimplePicklistFieldDirective).directive('singleLineField', SingleLineFieldDirective).directive('urlField', UrlFieldDirective).directive('selectionField', SelectionFieldDirective).directive('genericPicklistField', GenericPicklistFieldDirective).config(function($provide) {
    $provide.decorator('taOptions', ['$delegate', function(taOptions) {
      taOptions.forceTextAngularSanitize = true;
      taOptions.keyMappings = [];
      taOptions.toolbar = [['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre'], ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'], ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent', 'html']];
      taOptions.classes = {
        focussed: 'focussed',
        toolbar: 'btn-toolbar',
        toolbarGroup: 'btn-group',
        toolbarButton: 'btn btn-default',
        toolbarButtonActive: 'active',
        disabled: 'disabled',
        textEditor: 'form-control',
        htmlEditor: 'form-control'
      };
      return taOptions;
    }]);
    $provide.decorator('taTools', ['$delegate', function(taTools) {
      taTools.bold.iconclass = 'md-format-bold';
      taTools.italics.iconclass = 'md-format-italic';
      taTools.underline.iconclass = 'md-format-underline';
      taTools.ul.iconclass = 'md-format-list-bulleted';
      taTools.ol.iconclass = 'md-format-list-numbered';
      taTools.undo.iconclass = 'md-undo';
      taTools.redo.iconclass = 'md-redo';
      taTools.justifyLeft.iconclass = 'md-format-align-left';
      taTools.justifyRight.iconclass = 'md-format-align-right';
      taTools.justifyCenter.iconclass = 'md-format-align-center';
      taTools.justifyFull.iconclass = 'md-format-align-justify';
      taTools.indent.iconclass = 'md-format-indent-increase';
      taTools.outdent.iconclass = 'md-format-indent-decrease';
      taTools.clear.iconclass = 'md-format-clear';
      delete taTools.html.iconclass;
      taTools.html.buttontext = '&lt; &#47; &gt;';
      return taTools;
    }]);
  }).constant('FieldTypes', {
    NOOB: 0,
    INTEGER: 1,
    FLOAT: 2,
    DATE: 3,
    SINGLE_LINE_TEXT: 4,
    MONEY: 5,
    PICKLIST_DEFAULT: 6,
    SIMPLE_PICKLIST: 666,
    SELECTION: 700,
    PICKLIST_DEFAULT_LINKED: 7,
    PARAGRAPH: 8,
    CHECKBOX: 9,
    RADIO: 10,
    AUTONUM: 11,
    AUTOTEXT: 12,
    MULTISELECT: 13,
    PICKLIST_WITH_FILTER: 14,
    IMAGE: 15,
    IMG_THUMB: 10396,
    URL: 16,
    PARAGRAPH_WITHOUT_LINE_BREAKS: 17,
    EMAIL: 18,
    CSV: 19,
    PICKLIST: 20,
    FLASH: 21,
    PICKLIST_LATEST: 22,
    PICKLIST_LINKED: 23,
    PICKLIST_LRL: 24,
    RADIO_LINKED: 25,
    PICKLIST_FILTER_LINKED: 26,
    MULTISELECT_LINKED: 27,
    UOM: 28,
    PICKLIST_FILTERED: 29,
    LONG: 30,
    MONEY_EXTENDED: 31,
    DERIVED: 32
  });
  return {};
});
//# sourceURL=com/autodesk/fieldSelector.js
;

System.registerModule("com/autodesk/filteredPicklistField/filteredPicklistField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/filteredPicklistField/filteredPicklistField.directive.js";
  function FilteredPicklistField($timeout, $rootScope, $state, FilteredPicklistFieldService, EventService, PicklistUtils) {
    var fplCounter = 0;
    var directive = {
      restrict: 'E',
      templateUrl: 'filteredPicklistField/filteredPicklistField.html',
      scope: {
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '=',
        waiting: '='
      },
      link: function(scope) {
        scope.bundle = $rootScope.bundle;
        scope.uid = ("filteredPicklist-" + fplCounter.toString());
        ++fplCounter;
        var fplListener = null;
        var fplId = FilteredPicklistFieldService.extractIdFromLink(scope.fieldData.fieldMetadata.__self__);
        scope.getTheLink = function(obj) {
          if (obj) {
            return PicklistUtils.buildLink(obj);
          }
        };
        scope.getOptions = function() {
          FilteredPicklistFieldService.getOptions(scope.fieldData).then(function(options) {
            $timeout(function() {
              scope.fieldData.options.items = options.json.items;
            }, 50);
          });
        };
        scope.clearValue = function() {
          $(("#" + scope.uid)).dropdown('set selected', '');
          scope.fieldData.value = '';
          FilteredPicklistFieldService.saveValue(scope.fieldData, '');
        };
        scope.$watch('editView', function() {
          if (scope.editView) {
            FilteredPicklistFieldService.register(scope.fieldData);
            if (scope.fieldData.value !== null) {
              $(("#" + scope.uid)).dropdown('set selected', scope.fieldData.value);
            }
            fplListener = EventService.listen(("fpl:" + fplId + ":update"), function(event, value) {
              if (value) {
                $timeout(function() {
                  scope.fieldData.value = value;
                  $(("#" + scope.uid)).dropdown('set selected', scope.fieldData.value);
                  scope.$apply();
                }, 0);
              }
            });
            $timeout(function() {
              $(("#" + scope.uid)).dropdown({onChange: function(value) {
                  var selectedValue;
                  if (scope.fieldData.options.items.length === 1) {
                    selectedValue = angular.isObject(scope.fieldData.options.items[0]) ? scope.fieldData.options.items[0].title : scope.fieldData.options.items[0];
                  } else {
                    selectedValue = value;
                  }
                  FilteredPicklistFieldService.saveValue(scope.fieldData, selectedValue);
                }}).dropdown('set selected', scope.fieldData.value);
            }, 50);
          } else {
            if (fplListener !== null) {
              EventService.unlisten(fplListener);
              fplListener = null;
            }
          }
        });
        scope.$on('$destroy', function() {
          if (fplListener !== null) {
            EventService.unlisten(fplListener);
          }
        });
      }
    };
    return directive;
  }
  FilteredPicklistField.$inject = ['$timeout', '$rootScope', '$state', 'FilteredPicklistFieldService', 'EventService', 'PicklistUtils'];
  var $__default = FilteredPicklistField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/filteredPicklistField/filteredPicklistField.directive.js
;

System.registerModule("com/autodesk/filteredPicklistField/filteredPicklistField.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/filteredPicklistField/filteredPicklistField.service.js";
  var FilteredPicklistFieldService = function() {
    function FilteredPicklistFieldService($document, EventService, ModelsManager, $q) {
      this.$document = $document;
      this.EventService = EventService;
      this.ModelsManager = ModelsManager;
      this.$q = $q;
      this.picklists = {};
    }
    return ($traceurRuntime.createClass)(FilteredPicklistFieldService, {
      validateData: function(fplData) {
        return !!(fplData && (fplData.mainItemId || fplData.mainWorkspaceId) && fplData.fieldMetadata && fplData.fieldMetadata.__self__ && fplData.fieldMetadata.picklist);
      },
      extractIdFromLink: function(link) {
        return (link && link.substring && link.lastIndexOf && (link.lastIndexOf('/') > -1) && link.substring(link.lastIndexOf('/') + 1)) || null;
      },
      buildRequestParams: function(groupPicklist) {
        var requestParams = null;
        var relatedFpls = this.picklists[groupPicklist];
        if (relatedFpls) {
          requestParams = {};
          angular.forEach(relatedFpls, function(fpl) {
            if (fpl.value !== null && fpl.value !== '') {
              requestParams[fpl.id] = fpl.value.title || fpl.value;
            }
          });
        }
        return requestParams;
      },
      saveValue: function(fplData, selectedValue) {
        if (!fplData || !this.validateData(fplData)) {
          return null;
        }
        var groupPicklist = fplData.fieldMetadata.picklist;
        var relatedFpls = this.picklists[groupPicklist];
        var thisFplId = this.extractIdFromLink(fplData.fieldMetadata.__self__);
        if (relatedFpls && thisFplId) {
          var parsedSelectedValue = _.find(fplData.options.items, function(item) {
            if ((angular.isObject(item)) && (item.urn === selectedValue)) {
              return item;
            }
          });
          relatedFpls[thisFplId].value = (angular.isDefined(parsedSelectedValue)) ? parsedSelectedValue : selectedValue;
          fplData.value = (angular.isDefined(parsedSelectedValue)) ? parsedSelectedValue : selectedValue;
        }
      },
      notifyRelatedFpls: function(fplData, selectedValue) {
        if (!fplData || !this.validateData(fplData)) {
          return null;
        }
        var picklistSelectionListener;
        var picklistSelectionMethod;
        var fplUrn = fplData.mainItemId;
        if (angular.isDefined(fplData.mainItemId)) {
          picklistSelectionListener = 'picklistselection';
          picklistSelectionMethod = 'getPicklistSelection';
          fplUrn = fplData.mainItemId;
        } else {
          picklistSelectionListener = 'picklistWorkspaceSelection';
          picklistSelectionMethod = 'getPicklistWorkspaceSelection';
          fplUrn = fplData.mainWorkspaceId;
        }
        var groupPicklist = fplData.fieldMetadata.picklist;
        var relatedFpls = this.picklists[groupPicklist];
        var thisFplId = this.extractIdFromLink(fplData.fieldMetadata.__self__);
        var that = this;
        if (relatedFpls && selectedValue) {
          var requestParams = this.buildRequestParams(groupPicklist);
          this.EventService.listen((picklistSelectionListener + ":" + thisFplId + ":done"), function(event, uniqueValueFpls) {
            if (uniqueValueFpls && uniqueValueFpls.json && uniqueValueFpls.json.length > 0) {
              angular.forEach(uniqueValueFpls.json, function(uniqueValueFpl, index) {
                if (!isNaN(index) && uniqueValueFpl.__self__) {
                  var uniqueValueFplId = that.extractIdFromLink(uniqueValueFpl.__self__);
                  if (relatedFpls[uniqueValueFplId]) {
                    relatedFpls[uniqueValueFplId].value = uniqueValueFpl.value;
                    that.EventService.send(("fpl:" + uniqueValueFplId + ":update"), uniqueValueFpl.value);
                  }
                }
              });
            }
          });
          if (angular.isDefined(fplData.mainItemId)) {
            this.ModelsManager[picklistSelectionMethod](fplUrn, thisFplId, requestParams);
          } else {
            that.EventService.send(("fpl:" + thisFplId + ":update"), selectedValue);
          }
        }
      },
      getOptions: function(fplData) {
        var that = this;
        var deferred = this.$q.defer();
        if (!fplData || !this.validateData(fplData)) {
          deferred.reject();
        } else {
          var picklistOptionsListener;
          var picklistOptionsMethod;
          var fplUrn;
          if (angular.isDefined(fplData.mainItemId)) {
            picklistOptionsListener = 'picklistoptions';
            picklistOptionsMethod = 'getPicklistOptions';
            fplUrn = fplData.mainItemId;
          } else {
            picklistOptionsListener = 'picklistWorkspaceOptions';
            picklistOptionsMethod = 'getPicklistWorkspaceOptions';
            fplUrn = fplData.mainWorkspaceId;
          }
          var fplId = this.extractIdFromLink(fplData.fieldMetadata.__self__);
          var groupPicklist = fplData.fieldMetadata.picklist;
          var requestParams = this.buildRequestParams(groupPicklist);
          if (requestParams[fplId]) {
            delete requestParams[fplId];
          }
          var optionsListener = this.EventService.listen(((picklistOptionsListener + ":" + fplId + ":done")), (function(event, optionsObj) {
            that.EventService.unlisten(optionsListener);
            deferred.resolve(optionsObj);
          }));
          this.ModelsManager[picklistOptionsMethod](fplUrn, fplId, requestParams);
        }
        return deferred.promise;
      },
      register: function(fplData) {
        if (!fplData || !this.validateData(fplData)) {
          return null;
        }
        var picklist = fplData.fieldMetadata.picklist;
        var fplId = this.extractIdFromLink(fplData.fieldMetadata.__self__);
        if (this.picklists[picklist] && this.picklists[picklist][fplId]) {
          delete this.picklists[picklist];
        }
        if (!this.picklists[picklist]) {
          this.picklists[picklist] = {};
        }
        if (!this.picklists[picklist][fplId]) {
          this.picklists[picklist][fplId] = {
            id: fplId,
            value: fplData.value || null
          };
          fplData.options.items = [];
        }
      },
      getRegisteredPicklists: function() {
        return this.picklists;
      }
    }, {});
  }();
  angular.module('plm360.filteredPicklistService', []).factory('FilteredPicklistFieldService', ['$document', 'EventService', 'ModelsManager', '$q', function($document, EventService, ModelsManager, $q) {
    return new FilteredPicklistFieldService($document, EventService, ModelsManager, $q);
  }]);
  var $__default = angular.module(__moduleName, ['plm360.filteredPicklistService']);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/filteredPicklistField/filteredPicklistField.service.js
;

System.registerModule("com/autodesk/flashField/flashField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/flashField/flashField.directive.js";
  function FlashField() {
    var directive = {
      restrict: 'E',
      templateUrl: 'flashField/flashField.html',
      scope: {
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '='
      },
      link: function(scope) {}
    };
    return directive;
  }
  var $__default = FlashField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/flashField/flashField.directive.js
;

System.registerModule("com/autodesk/floatField/floatField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/floatField/floatField.directive.js";
  var FloatFieldData = System.get("com/autodesk/fieldData/floatFieldData.model.js").default;
  function FloatField() {
    return {
      restrict: 'E',
      templateUrl: 'floatField/floatField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '='
      },
      link: function(scope, element, attrs) {
        var consumeNewFieldData = function(fieldData) {
          if (fieldData) {
            formatFieldValue();
            updateFormattedValue(fieldData.value);
            if (typeof fieldData.originalValue === 'undefined') {
              fieldData.originalValue = fieldData.value;
            }
          }
        };
        var formatFieldValue = function() {
          if (scope.fieldData) {
            if (scope.fieldData.updateValue) {
              scope.fieldData.updateValue(scope.fieldData.value);
            } else {
              var model = new FloatFieldData({
                value: scope.fieldData.value,
                metadata: scope.fieldMeta
              });
              model.updateValue(scope.fieldData.value);
              scope.fieldData.value = model.getValue();
            }
          }
        };
        var updateFormattedValue = function(fieldValue) {
          if (typeof scope.fieldMeta.fieldPrecision !== 'undefined') {
            scope.fieldData.formattedValue = FloatFieldData.formatFloatWithPrecision(fieldValue, scope.fieldMeta.fieldPrecision);
          } else {
            scope.fieldData.formattedValue = fieldValue;
          }
        };
        consumeNewFieldData(scope.fieldData);
        scope.$watch('fieldData', function(newFieldData) {
          consumeNewFieldData(newFieldData);
        });
        scope.$watch('editView', function(newValue, oldValue) {
          if (!newValue && newValue !== oldValue) {
            formatFieldValue();
            updateFormattedValue(scope.fieldData.value);
          }
        });
        scope.$watch('fieldData.value', function(newValue, oldValue) {
          if (!scope.editView) {
            formatFieldValue();
            updateFormattedValue(scope.fieldData.value);
          }
        });
      }
    };
  }
  var $__default = FloatField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/floatField/floatField.directive.js
;

System.registerModule("com/autodesk/genericPicklistField/genericPicklistField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/genericPicklistField/genericPicklistField.directive.js";
  function GenericPicklistField($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'genericPicklistField/genericPicklistField.html',
      bindToController: {
        fieldId: '@',
        fieldData: '<',
        fieldMeta: '<',
        placeholder: '@',
        editView: '=',
        waiting: '=',
        onChange: '&'
      },
      controllerAs: 'ctrl',
      link: function(scope, element, attrs, ctrl) {
        var dropdownEl;
        var alertHtmlClass = 'alertCount';
        var alertHtmlEl = angular.element('<div class="header"></div>');
        alertHtmlEl.addClass(alertHtmlClass);
        scope.setSelected = function(value) {
          dropdownEl.dropdown('set selected', value);
        };
        scope.clearSelected = function() {
          dropdownEl.dropdown('clear');
        };
        scope.getText = function() {
          return dropdownEl.dropdown('get text');
        };
        scope.getValue = function() {
          return dropdownEl.dropdown('get value');
        };
        scope.removeLoadingClass = function() {
          $timeout(function() {
            dropdownEl.removeClass('loading');
          }, 2000);
        };
        scope.setCharacterLimitAlert = function(countReturned, totalCount) {
          var modifiedHtmlEl;
          var alertStr;
          alertStr = ctrl.bundle.picklist.moreResults.replace('{0}', countReturned).replace('{1}', totalCount);
          modifiedHtmlEl = alertHtmlEl.text(alertStr);
          if (dropdownEl.find((".menu > ." + alertHtmlClass)).length === 0) {
            $timeout(function() {
              dropdownEl.find('.menu').prepend(modifiedHtmlEl);
            }, 100);
          }
        };
        scope.unsetCharacterLimitAlert = function() {
          if (dropdownEl.find((".menu > ." + alertHtmlClass)).length > 0) {
            dropdownEl.find('.menu').find(("." + alertHtmlClass)).remove();
          }
        };
        scope.setThrottling = function() {
          var dropDownSettings = ctrl.dropdownSettings();
          dropDownSettings.apiSettings.throttle = 1000;
          dropdownEl.dropdown(dropDownSettings);
        };
        $timeout(function() {
          scope.$watch(function() {
            return ctrl.editView;
          }, function(isEditView) {
            if (isEditView) {
              dropdownEl = $(element).find('.ui.dropdown');
              dropdownEl.dropdown(ctrl.dropdownSettings());
              if (angular.isObject(ctrl.fieldData.value)) {
                scope.setSelected(ctrl.setPreSelectedValue(ctrl.fieldData.value));
              } else if (ctrl.hasDefaultValue()) {
                scope.setSelected(ctrl.setPreSelectedValue(ctrl.fieldData.defaultValue));
                ctrl.onSelectionChange(ctrl.selectedValue.link, ctrl.selectedValue.title);
              }
            } else {
              if (ctrl.hasDefaultValue() && ctrl.fieldMeta.readOnly) {
                ctrl.onSelectionChange(ctrl.fieldData.defaultValue.link, ctrl.fieldData.defaultValue.title);
              }
            }
          });
        }, 0);
      },
      controller: function($rootScope, $scope, $filter, PicklistUtils, LocalizationService) {
        var ctrl = this;
        LocalizationService.init().then(function() {
          ctrl.bundle = $rootScope.bundle;
          if (ctrl.placeholder === '' || (!ctrl.fieldMeta.placeholder)) {
            ctrl.placeholderText = ctrl.bundle.picklist.selectValue;
          } else {
            ctrl.placeholderText = ctrl.placeholder ? ctrl.placeholder : ctrl.fieldMeta.placeholder;
          }
        });
        ctrl.maxResults = 25;
        ctrl.currentCount = 0;
        ctrl.totalCount = 0;
        ctrl.showClearButton = false;
        ctrl.selectedValue = {};
        ctrl.isSelectedValue = false;
        ctrl.uniqueId = ctrl.fieldData.link ? ctrl.fieldData.link.replace(/\//g, '_') : Math.floor(Math.random() * 100000);
        ctrl.dropdownSettings = function() {
          return {
            action: 'activate',
            apiSettings: {
              beforeSend: function(settings) {
                if (settings.urlData.query.length > 0) {
                  ctrl.showClearButton = false;
                }
                if (((settings.urlData.query.length === 0) && !ctrl.hasSelectedValue()) || (settings.urlData.query.length > 0)) {
                  return settings;
                } else {
                  $scope.removeLoadingClass();
                  if ((ctrl.currentCount > 0) && (ctrl.totalCount > 0)) {
                    $scope.setCharacterLimitAlert(ctrl.currentCount, ctrl.totalCount);
                  }
                  return false;
                }
              },
              interruptRequests: true,
              onResponse: ctrl.transformResponse,
              responseAsync: ctrl.responseAsync
            },
            duration: 100,
            onChange: ctrl.onSelectionChange,
            onShow: function() {
              if ((ctrl.currentCount > 0) && (ctrl.totalCount > 0)) {
                $scope.setCharacterLimitAlert(ctrl.currentCount, ctrl.totalCount);
              }
              $scope.setThrottling();
              if (angular.isDefined(ctrl.selectedValue.link)) {
                $scope.setSelected(ctrl.selectedValue.link);
              }
            },
            onHide: function() {
              $scope.removeLoadingClass();
              $scope.unsetCharacterLimitAlert();
              if ($scope.getText() === ctrl.placeholderText) {
                ctrl.showClearButton = false;
              } else {
                ctrl.showClearButton = true;
              }
            },
            message: {noResults: (ctrl.bundle) ? ctrl.bundle.picklist.noResults : 'No results found.'}
          };
        };
        if (angular.isDefined(ctrl.fieldData.value) && ctrl.fieldData.value !== null) {
          ctrl.itemLink = PicklistUtils.buildLink(ctrl.fieldData.value);
        }
        ctrl.hasDefaultValue = function() {
          return (angular.isDefined(ctrl.fieldData.defaultValue) && angular.isObject(ctrl.fieldData.defaultValue));
        };
        ctrl.hasSelectedValue = function() {
          return ($scope.getValue() !== '');
        };
        ctrl.addFieldIfNotPresent = function() {
          var items = arguments[0] !== (void 0) ? arguments[0] : [];
          var fieldObj = arguments[1] !== (void 0) ? arguments[1] : {};
          var modifiedArr = items;
          var found = modifiedArr.some(function(item) {
            return (item.link === fieldObj.link);
          });
          if (!found) {
            modifiedArr.unshift(fieldObj);
            if (modifiedArr.length > ctrl.maxResults) {
              modifiedArr.pop();
            }
          }
          return modifiedArr;
        };
        ctrl.setPreSelectedValue = function(fieldObj) {
          if (angular.isObject(fieldObj)) {
            ctrl.selectedValue.title = ctrl.parseOptionText(fieldObj);
            ctrl.selectedValue.link = fieldObj.link;
            ctrl.showClearButton = true;
            ctrl.isSelectedValue = true;
            return ctrl.selectedValue.link;
          }
        };
        ctrl.parseOptionText = function(fieldObj) {
          var revisionTag = angular.isDefined(fieldObj.version) ? (" " + fieldObj.version) : '';
          var archivedTag = (angular.isDefined(fieldObj.deleted) && (fieldObj.deleted)) ? (" [" + ctrl.bundle.text.archived.uppercase + "]") : '';
          var originalStr = fieldObj.title + revisionTag + archivedTag;
          var escapedStr = $filter('escapeHtmlEntities')(originalStr);
          if ((escapedStr.indexOf('&amp;lt;') !== -1) && (escapedStr.indexOf('&amp;gt;') !== -1)) {
            return originalStr;
          } else {
            return escapedStr;
          }
        };
        ctrl.onSelectionChange = function(value, text, htmlEl) {
          if ((value !== '') && angular.isDefined(text)) {
            ctrl.selectedValue.title = text;
            ctrl.selectedValue.link = value;
            ctrl.showClearButton = true;
            ctrl.isSelectedValue = true;
            ctrl.onChange({data: ctrl.selectedValue});
          }
        };
        ctrl.clearValues = function(event) {
          if (ctrl.isSelectedValue) {
            $scope.clearSelected();
            ctrl.onChange({data: null});
            delete ctrl.selectedValue.title;
            delete ctrl.selectedValue.link;
            ctrl.showClearButton = false;
            ctrl.isSelectedValue = false;
          }
        };
        ctrl.responseAsync = function(settings, callback) {
          if (angular.isDefined(settings.urlData)) {
            ctrl.fieldMeta.picklistLoaderWithFiltering(settings.urlData.query).then(function(response) {
              var modifiedResponse = response.items;
              $scope.unsetCharacterLimitAlert();
              if ((settings.urlData.query.length === 0) && angular.isDefined(ctrl.selectedValue.link) && (ctrl.selectedValue.link !== null)) {
                modifiedResponse = ctrl.addFieldIfNotPresent(response.items, ctrl.selectedValue);
              }
              if (angular.isDefined(response.totalCount) && (response.totalCount >= 1)) {
                $scope.setCharacterLimitAlert(modifiedResponse.length, response.totalCount);
              }
              ctrl.totalCount = response.totalCount;
              ctrl.currentCount = modifiedResponse.length;
              callback(modifiedResponse);
            });
          }
        };
        ctrl.transformResponse = function() {
          var data = arguments[0] !== (void 0) ? arguments[0] : {};
          var transformedResponse = {
            success: true,
            results: []
          };
          _.each(data, function(value, index) {
            transformedResponse.results.push({
              name: ctrl.parseOptionText(value),
              value: value.link
            });
          });
          return transformedResponse;
        };
      }
    };
  }
  GenericPicklistField.$inject = ['$timeout'];
  var $__default = GenericPicklistField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/genericPicklistField/genericPicklistField.directive.js
;

System.registerModule("com/autodesk/imageField/imageField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/imageField/imageField.directive.js";
  function ImageField($mdDialog, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'imageField/imageField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '='
      },
      link: function(scope, el, attrs) {
        scope.hasLinkedThumbnail = angular.isDefined(attrs.linkedThumbnail) ? attrs.linkedThumbnail === 'true' : false;
        function adjustImageDimensions(scope, element) {
          var mdDialog = angular.element(element.children()[0]);
          var mdContent = angular.element(mdDialog.children()[0]);
          var myElement = angular.element(mdContent.children()[0]);
          var heightINeed = myElement[0].offsetHeight;
          var image = myElement.children()[0];
          var imageHeight = image.clientHeight;
          var imageWidth = image.clientWidth;
          if (imageHeight > imageWidth && imageHeight > heightINeed) {
            myElement[0].style.height = heightINeed + 'px';
            mdContent[0].style.display = 'none';
            $timeout(function() {
              mdContent[0].style.display = 'flex';
              mdDialog.addClass('visible');
            }, 100);
          } else {
            mdDialog.addClass('visible');
          }
        }
        scope.openImage = function(imagePath) {
          $mdDialog.show({
            controller: function($scope, $mdDialog) {
              $scope.imagePath = imagePath;
              $scope.closeDialog = function() {
                $mdDialog.hide();
              };
            },
            onComplete: adjustImageDimensions,
            templateUrl: 'imageField/imageModal.html'
          });
        };
      }
    };
  }
  var $__default = ImageField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/imageField/imageField.directive.js
;

System.registerModule("com/autodesk/integerField/integerField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/integerField/integerField.directive.js";
  function IntegerField() {
    return {
      restrict: 'E',
      templateUrl: 'integerField/integerField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '='
      },
      link: function(scope, element, attrs) {}
    };
  }
  var $__default = IntegerField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/integerField/integerField.directive.js
;

System.registerModule("com/autodesk/longField/longField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/longField/longField.directive.js";
  function LongField() {
    return {
      restrict: 'E',
      templateUrl: 'longField/longField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '='
      },
      link: function(scope, element, attrs) {}
    };
  }
  var $__default = LongField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/longField/longField.directive.js
;

System.registerModule("com/autodesk/moneyField/moneyField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/moneyField/moneyField.directive.js";
  var MoneyFieldData = System.get("com/autodesk/fieldData/moneyFieldData.model.js").default;
  function MoneyField() {
    return {
      restrict: 'E',
      templateUrl: 'moneyField/moneyField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '='
      },
      link: function(scope, element, attrs) {
        var consumeNewFieldData = function(fieldData) {
          if (fieldData) {
            formatFieldValue();
            updateFormattedValue(fieldData.value);
            if (typeof fieldData.originalValue === 'undefined') {
              fieldData.originalValue = fieldData.value;
            }
          }
        };
        var formatFieldValue = function() {
          if (scope.fieldData) {
            if (scope.fieldData.updateValue) {
              scope.fieldData.updateValue(scope.fieldData.value);
            } else {
              var model = new MoneyFieldData({
                value: scope.fieldData.value,
                metadata: scope.fieldMeta
              });
              model.updateValue(scope.fieldData.value);
              scope.fieldData.value = model.getValue();
            }
          }
        };
        var updateFormattedValue = function(fieldValue) {
          if (typeof fieldValue === 'undefined' || fieldValue === null || fieldValue === '') {
            scope.fieldData.formattedValue = scope.fieldData.value;
            return;
          }
          var fracDigits = scope.fieldMeta.fieldPrecision | 0;
          var intlNumFormatOptions = {
            minimumFractionDigits: fracDigits,
            maximumFractionDigits: fracDigits
          };
          scope.fieldData.formattedValue = new Intl.NumberFormat('en-US', intlNumFormatOptions).format(fieldValue);
          if (scope.fieldData.formattedValue === 'NaN') {
            scope.fieldData.formattedValue = scope.fieldData.value;
          }
        };
        consumeNewFieldData(scope.fieldData);
        scope.$watch('fieldData', function(newFieldData) {
          consumeNewFieldData(newFieldData);
        });
        scope.$watch('editView', function(newValue, oldValue) {
          if (!newValue && newValue !== oldValue) {
            formatFieldValue();
            updateFormattedValue(scope.fieldData.value);
          }
        });
        scope.$watch('fieldData.value', function(newValue, oldValue) {
          if (!scope.editView) {
            formatFieldValue();
            updateFormattedValue(scope.fieldData.value);
          }
        });
      }
    };
  }
  var $__default = MoneyField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/moneyField/moneyField.directive.js
;

System.registerModule("com/autodesk/multiPicklistField/multiPicklistField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/multiPicklistField/multiPicklistField.directive.js";
  function MultiPicklistField($timeout, $state, PicklistUtils, $filter) {
    return {
      restrict: 'E',
      templateUrl: 'multiPicklistField/multiPicklistField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '=',
        waiting: '='
      },
      link: function(scope, element, attrs) {
        scope.doneLoad = false;
        scope.fieldTitle = '';
        scope.uid = scope.fieldData.link ? scope.fieldData.link.replace(/\//g, '_') : Math.random() * 100000;
        _.each(scope.fieldData.options.items, function(option) {
          option.version = angular.isDefined(option.version) ? (" " + $filter('escapeHtmlEntities')(option.version)) : null;
        });
        if (angular.isDefined(scope.fieldData.value) && _.isArray(scope.fieldData.value)) {
          if (!scope.fieldData.options || !scope.fieldData.options.items) {
            scope.fieldData.options.items = [];
          }
          _.each(scope.fieldData.value, function(option) {
            option.version = angular.isDefined(option.version) ? (" " + $filter('escapeHtmlEntities')(option.version)) : null;
          });
          scope.fieldData.options.items = scope.fieldData.options.items.concat(scope.fieldData.options.items, scope.fieldData.value);
        }
        if (scope.fieldData.value !== null) {
          for (var i = 0; i < scope.fieldData.value.length; i++) {
            scope.fieldTitle += (scope.fieldData.value[i].title + ",");
            scope.fieldData.value[i].itemLink = PicklistUtils.buildLink(scope.fieldData.value[i]);
          }
          scope.fieldTitle = scope.fieldTitle.replace(/(,,)+/g, ',');
          scope.fieldTitle = scope.fieldTitle.substring(0, scope.fieldTitle.length - 1);
        }
        scope.$watch('editView', function() {
          if (scope.editView) {
            scope.doSearch = function(text, ele) {
              var searchText = text;
              $timeout(function() {
                if (searchText === text && searchText !== '') {
                  var url = scope.fieldData.fieldMetadata.picklist.replace('picklists', 'lookups');
                  ele.dropdown('refresh');
                  ele.dropdown('show');
                }
              }, 1500);
            };
            $timeout(function() {
              $(("#" + scope.uid + ".ui.multiple.dropdown")).dropdown({
                onAdd: function(addedValue, addedText, $addedChoice) {
                  var added = false;
                  _.each(scope.fieldData.value, function(ele, key) {
                    if (ele.link === addedValue) {
                      added = true;
                    }
                  });
                  if (!added) {
                    scope.fieldData.value = scope.fieldData.value || [];
                    scope.fieldData.value.push({
                      link: addedValue,
                      title: addedText
                    });
                  }
                  scope.$apply();
                },
                onRemove: function(removedValue, removedText, $removedChoice) {
                  _.each(scope.fieldData.value, function(ele, key) {
                    if (ele && ele.link === removedValue) {
                      scope.fieldData.value.splice(key, 1);
                      return;
                    }
                  });
                  if (!scope.fieldData.value.length) {
                    scope.fieldData.value = '';
                  }
                  scope.$apply();
                }
              });
              $(("#" + scope.uid + ".ui.multiple.dropdown, #" + scope.uid + ".ui.multiple.dropdown > *")).on('click', function() {
                if (!scope.doneLoad && scope.fieldMeta.picklistLoader) {
                  scope.doneLoad = true;
                  scope.fieldMeta.picklistLoader(function(res) {
                    _.each(res, function(option) {
                      option.version = angular.isDefined(option.version) ? (" " + $filter('escapeHtmlEntities')(option.version)) : null;
                    });
                    scope.fieldData.options.items = res;
                  });
                }
              });
              if (_.isArray(scope.fieldData.value)) {
                var args = _.map(scope.fieldData.value, function(value) {
                  return value.link;
                });
                $(("#" + scope.uid + ".ui.multiple.dropdown")).dropdown('set selected', args);
              }
              $(("#" + scope.uid + ".ui.dropdown input.search")).keyup('input', function(event) {
                scope.doSearch($(("#" + scope.uid + ".ui.dropdown input.search")).val(), $(("#" + scope.uid + ".ui.dropdown")));
              });
            }, 0);
          }
        });
      }
    };
  }
  MultiPicklistField.$inject = ['$timeout', '$state', 'PicklistUtils', '$filter'];
  var $__default = MultiPicklistField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/multiPicklistField/multiPicklistField.directive.js
;

System.registerModule("com/autodesk/paragraphField/paragraphField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/paragraphField/paragraphField.directive.js";
  function ParagraphField() {
    return {
      restrict: 'E',
      templateUrl: 'paragraphField/paragraphField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '='
      }
    };
  }
  var $__default = ParagraphField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/paragraphField/paragraphField.directive.js
;

System.registerModule("com/autodesk/paragraphWithoutLineBreaksField/paragraphWithoutLineBreaksField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/paragraphWithoutLineBreaksField/paragraphWithoutLineBreaksField.directive.js";
  function ParagraphWithoutLineBreaksField() {
    return {
      restrict: 'E',
      templateUrl: 'paragraphWithoutLineBreaksField/paragraphWithoutLineBreaksField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '='
      },
      link: function() {}
    };
  }
  var $__default = ParagraphWithoutLineBreaksField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/paragraphWithoutLineBreaksField/paragraphWithoutLineBreaksField.directive.js
;

System.registerModule("com/autodesk/picklistField/picklistField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/picklistField/picklistField.directive.js";
  function PicklistField($timeout, $state, PicklistUtils, FieldTypes) {
    return {
      restrict: 'E',
      templateUrl: 'picklistField/picklistField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '=',
        waiting: '=',
        onChange: '&',
        typeId: '='
      },
      link: function(scope, element, attrs) {
        scope.doneLoad = false;
        scope.showLoader = false;
        scope.uid = scope.fieldData.link ? scope.fieldData.link.replace(/\//g, '_') : Math.floor(Math.random() * 100000);
        scope.$watch('fieldData', function() {
          if ((scope.typeId === FieldTypes.UOM) && scope.fieldData.options && scope.fieldData.options.items) {
            scope.fieldData.defaultValue = scope.fieldData.options.items[0];
          }
          if (angular.isDefined(scope.fieldData.value) && scope.fieldData.value !== null) {
            scope.itemLink = PicklistUtils.buildLink(scope.fieldData.value);
          }
          if (angular.isDefined(scope.fieldData.defaultValue) && angular.isObject(scope.fieldData.defaultValue)) {
            var defaultValue = scope.fieldData.defaultValue.link;
            if (!scope.fieldData.options || !scope.fieldData.options.items) {
              scope.fieldData.options.items = [];
            }
            var found = _.some(scope.fieldData.options.items, function(option) {
              return (option.link === defaultValue);
            });
            if (!found) {
              scope.fieldData.options.items.push(scope.fieldData.defaultValue);
            }
          }
        });
        scope.$watch('editView', function() {
          if (scope.editView) {
            if (!scope.doneLoad && angular.isDefined(scope.fieldMeta) && angular.isDefined(scope.fieldMeta.picklistLoader) && scope.fieldMeta.loadOnEditMode === true) {
              scope.doneLoad = true;
              scope.showLoader = true;
              scope.fieldMeta.picklistLoader(function(res) {
                scope.showLoader = false;
                scope.fieldData.options.items = res;
                $timeout(function() {
                  $(("#" + scope.uid + ".ui.single.dropdown")).dropdown("toggle").dropdown('set selected', scope.fieldData.value ? (scope.fieldData.value.title || scope.fieldData.value) : scope.getDefaultValue());
                }, 500);
              });
            }
            scope.getDefaultValue = function() {
              var shortcut = scope.fieldData.options;
              var defaultVal = scope.fieldData.defaultValue ? scope.fieldData.defaultValue.link : undefined;
              var source = (shortcut && shortcut.items) ? shortcut.items : [];
              var found = _.find(source, function(option) {
                return (option.link === defaultVal) ? option : null;
              });
              return found ? found.link : undefined;
            };
            scope.doSearch = function(text, ele) {
              var searchText = text;
              $timeout(function() {
                if (searchText === text && searchText !== '') {
                  var url = scope.fieldData.fieldMetadata.picklist.replace('picklists', 'lookups');
                  ele.dropdown('refresh');
                  ele.dropdown('show');
                }
              }, 1500);
            };
            $timeout(function() {
              $(("#" + scope.uid + ".ui.single.dropdown")).dropdown({
                onChange: function(value, text, $choice) {
                  var oldValue = _.clone(scope.fieldData.value);
                  if (scope.fieldData.value) {
                    scope.fieldData.value.title = text;
                    scope.fieldData.value.link = value;
                  } else {
                    scope.fieldData.value = {
                      title: text,
                      link: value
                    };
                  }
                  if (!_.isEqual(oldValue, scope.fieldData.value)) {
                    scope.$apply(function() {
                      scope.onChange(scope.fieldData.value, oldValue);
                    });
                  }
                },
                onShow: function() {
                  if (angular.isDefined(scope.fieldMeta) && scope.fieldMeta.loadOnEditMode === true && scope.showLoader === true) {
                    return false;
                  }
                }
              }).dropdown('set selected', scope.fieldData.value ? (scope.fieldData.value.title || scope.fieldData.value) : scope.getDefaultValue());
              $(("#" + scope.uid + ".ui.single.dropdown, #" + scope.uid + ".ui.single.dropdown > *")).on('click', function() {
                if (!scope.doneLoad && angular.isDefined(scope.fieldMeta) && angular.isDefined(scope.fieldMeta.picklistLoader)) {
                  scope.doneLoad = true;
                  scope.showLoader = true;
                  scope.fieldMeta.picklistLoader(function(res) {
                    scope.showLoader = false;
                    scope.fieldData.options.items = res;
                  });
                }
              });
              if (_.isArray(scope.fieldData.value)) {
                var args = _.map(scope.fieldData.value, function(value) {
                  return value.title;
                });
                $(("#" + scope.uid + ".ui.multiple.dropdown")).dropdown('set selected', args);
              }
              $(("#" + scope.uid + ".ui.dropdown input.search")).keyup('input', function(event) {
                scope.doSearch($(("#" + scope.uid + ".ui.dropdown input.search")).val(), $(("#" + scope.uid + ".ui.dropdown")));
              });
            }, 0);
          }
        });
      }
    };
  }
  PicklistField.$inject = ['$timeout', '$state', 'PicklistUtils', 'FieldTypes'];
  var $__default = PicklistField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/picklistField/picklistField.directive.js
;

System.registerModule("com/autodesk/picklistUtils.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/picklistUtils.service.js";
  var PicklistUtils = function() {
    function PicklistUtils($state, UrnParser) {
      this.$state = $state;
      this.UrnParser = UrnParser;
    }
    return ($traceurRuntime.createClass)(PicklistUtils, {buildLink: function(value) {
        var resourceId = null;
        if (angular.isDefined(value.link) && (value.link !== null) && angular.isString(value.link) && (value.link.indexOf('items') !== -1)) {
          if (value.resourceId || value.urn) {
            var urn = value.resourceId ? this.UrnParser.decode(value.resourceId) : value.urn;
            var workspaceId = urn.split('.').reverse()[1];
            return this.$state.href('details', {
              workspaceId: workspaceId,
              itemId: this.UrnParser.encode(urn),
              tab: 'details',
              view: 'full',
              mode: 'view'
            });
          }
        }
        return null;
      }}, {});
  }();
  PicklistUtils.$inject = ['$state', 'UrnParser'];
  var $__default = PicklistUtils;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/picklistUtils.service.js
;

System.registerModule("com/autodesk/radioField/radioField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/radioField/radioField.directive.js";
  function RadioField($state, $timeout, $document, _, PicklistUtils, $filter) {
    return {
      restrict: 'E',
      templateUrl: 'radioField/radioField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '=',
        waiting: '='
      },
      link: function(scope) {
        _.each(scope.fieldData.options.items, function(option) {
          option.version = angular.isDefined(option.version) ? (" " + $filter('escapeHtmlEntities')(option.version)) : '';
        });
        scope.makeSelectedOptionFirst = function() {
          scope.fieldData.options.items = _.without(scope.fieldData.options.items, scope.fieldData.value);
          scope.fieldData.options.items.unshift(scope.fieldData.value);
        };
        if ((scope.fieldData.value !== null) && (scope.fieldData.value !== '')) {
          scope.fieldData.value.version = angular.isDefined(scope.fieldData.value.version) ? (" " + $filter('escapeHtmlEntities')(scope.fieldData.value.version)) : null;
          scope.itemLink = PicklistUtils.buildLink(scope.fieldData.value);
          if (scope.fieldMeta.isRadioButtonInGrid) {
            scope.fieldData.value = _.find(scope.fieldData.options.items, function(item) {
              return item.link === scope.fieldData.value.link;
            });
            scope.fieldData.originalValue = scope.fieldData.value;
            scope.makeSelectedOptionFirst();
          }
        }
        if (scope.editView && angular.isDefined(scope.fieldMeta.defaultValue) && (scope.fieldMeta.defaultValue !== null) && (scope.fieldMeta.defaultValue !== '0') && (scope.fieldData.value === '')) {
          scope.fieldData.value = {link: scope.fieldMeta.defaultValue.link};
        }
        scope.onRadioButtonChange = function(itemLink) {
          scope.fieldData.value = _.find(scope.fieldData.options.items, function(item) {
            return item.link === itemLink;
          });
        };
        scope.updateAndClose = function() {
          $timeout(function() {
            $document.triggerHandler('click');
          });
          scope.makeSelectedOptionFirst();
        };
      }
    };
  }
  RadioField.$inject = ['$state', '$timeout', '$document', '_', 'PicklistUtils', '$filter'];
  var $__default = RadioField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/radioField/radioField.directive.js
;

System.registerModule("com/autodesk/richTextField/richTextField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/richTextField/richTextField.directive.js";
  function RichTextField() {
    var directive = {
      restrict: 'E',
      templateUrl: 'richTextField/richTextField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '='
      },
      link: function(scope, element, attrs) {
        scope.$watch('editView', function() {
          element.find('button').attr('md-prevent-menu-close', 'md-prevent-menu-close');
        });
      }
    };
    return directive;
  }
  var $__default = RichTextField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/richTextField/richTextField.directive.js
;

System.registerModule("com/autodesk/selectionField/selectionField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/selectionField/selectionField.directive.js";
  function SelectionField($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'selectionField/selectionField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '=',
        waiting: '='
      },
      link: function(scope, element, attrs) {
        scope.$watch('editView', function() {
          if (scope.editView) {
            scope.fieldData.uid = (new Date()).getTime();
            $timeout(function() {
              var el = $(("#" + scope.fieldData.uid + ".ui.single.dropdown"));
              el.dropdown({onChange: function(value, text, $choice) {
                  var selected = scope.fieldData.options.filter(function(option) {
                    return option.title === value;
                  });
                  if (selected.length > 0) {
                    scope.fieldData.value = selected[0];
                    scope.$apply();
                  }
                }}).dropdown('set selected', scope.fieldData.value ? scope.fieldData.value.title : undefined);
            }, 0);
          }
        });
      }
    };
  }
  SelectionField.$inject = ['$timeout'];
  var $__default = SelectionField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/selectionField/selectionField.directive.js
;

System.registerModule("com/autodesk/simplePicklistField/simplePicklistField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/simplePicklistField/simplePicklistField.directive.js";
  function SimplePicklistField($timeout, $rootScope) {
    return {
      restrict: 'E',
      templateUrl: 'simplePicklistField/simplePicklistField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '=',
        waiting: '='
      },
      link: function(scope, element, attrs) {
        scope.bundle = $rootScope.bundle;
        scope.fieldData.uid = (new Date()).getTime();
        scope.$watch('editView', function() {
          if (scope.editView) {
            $timeout(function() {
              $(("#" + scope.fieldData.uid + ".ui.single.dropdown")).dropdown({onChange: function(value, text, $choice) {
                  scope.fieldData.value = value ? value : undefined;
                  scope.$apply();
                }}).dropdown('set selected', _.isObject(scope.fieldData.value) ? (scope.fieldData.value.value) : undefined);
            }, 50);
          }
        });
      }
    };
  }
  SimplePicklistField.$inject = ['$timeout', '$rootScope'];
  var $__default = SimplePicklistField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/simplePicklistField/simplePicklistField.directive.js
;

System.registerModule("com/autodesk/singleLineField/singleLineField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/singleLineField/singleLineField.directive.js";
  function SingleLineField() {
    return {
      restrict: 'E',
      templateUrl: 'singleLineField/singleLineField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '=',
        waiting: '='
      },
      link: function(scope, element, attrs) {
        if (scope.fieldData && angular.isUndefined(scope.fieldData.originalValue)) {
          scope.fieldData.originalValue = scope.fieldData.value;
        }
        scope.$watch('fieldData', function(newVal) {
          if (newVal && angular.isUndefined(scope.fieldData.originalValue)) {
            scope.fieldData.originalValue = scope.fieldData.value;
          }
        });
      }
    };
  }
  var $__default = SingleLineField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/singleLineField/singleLineField.directive.js
;

System.registerModule("com/autodesk/urlField/urlField.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/urlField/urlField.directive.js";
  function UrlField() {
    return {
      restrict: 'E',
      templateUrl: 'urlField/urlField.html',
      scope: {
        fieldId: '@',
        fieldData: '=',
        fieldMeta: '=',
        placeholder: '@',
        editView: '=',
        waiting: '='
      },
      link: function(scope) {
        scope.hrefValue = null;
        if (angular.isDefined(scope.fieldData)) {
          if (scope.fieldData.value.match(/^https?:\/\//) === null) {
            scope.hrefValue = 'http://' + scope.fieldData.value;
          } else {
            scope.hrefValue = scope.fieldData.value;
          }
        }
      }
    };
  }
  var $__default = UrlField;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/urlField/urlField.directive.js
;

System.get("com/autodesk/fieldSelector.js");angular.module("com/autodesk/fieldSelector.js").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('autoNumberField/autoNumberField.html',
    "<span class=\"field-plain-text\">{{fieldData.value}}</span>"
  );


  $templateCache.put('autoTextField/autoTextField.html',
    "<span class=\"field-plain-text\">{{fieldData.value}}</span>"
  );


  $templateCache.put('checkboxField/checkboxField.html',
    "<span class=\"field-plain-text\"><span><input type=\"checkbox\" class=\"form-control\" name=\"{{fieldId}}\" ng-model=\"fieldData.value\" ng-true-value=\"'true'\" ng-false-value=\"'false'\" ng-disabled=\"!editView\" placeholder=\"{{placeholder || fieldMeta.placeholder}}\" generic-server-error></span></span>"
  );


  $templateCache.put('csvField/csvField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\"><span ng-switch-when=\"false\">{{fieldData.value || fieldMeta.placeholder}}</span> <span ng-switch-when=\"true\"><input type=\"text\" name=\"{{fieldId}}\" ng-model=\"fieldData.value\" ng-model-options=\"{allowInvalid: true}\" ng-maxlength=\"fieldMeta.fieldLength\" maxlength=\"{{fieldMeta.fieldLength}}\" placeholder=\"{{placeholder || fieldMeta.placeholder}}\" generic-server-error></span></span>"
  );


  $templateCache.put('dateField/dateField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\" ng-class=\"{'datepicker-active': datePickerStatus.open}\"><span ng-switch-when=\"false\"><span ng-if=\"fieldData.value\">{{fieldData.value | date: dateFormat}}</span> <span ng-if=\"!fieldData.value\">{{placeholder || fieldMeta.placeholder}}</span></span> <span ng-switch-when=\"true\"><div class=\"datepicker\"><div class=\"datepicker-external\"><input type=\"text\" name=\"{{fieldId}}\" class=\"form-control\" tabindex=\"-1\" ng-class=\"(waiting) ? 'datepicker-input-disabled' : ''\" ng-model=\"formattedDate.value\" ng-blur=\"formatDate(formattedDate.value)\" ng-readonly=\"false\" ng-mouseenter=\"showClear(true)\" ng-mouseleave=\"showClear(false)\" ng-disabled=\"fieldMeta.isDisabled || datePickerStatus.open\" placeholder=\"{{dateFormat}}\" ui-mask=\"{{dateFormatMask}}\" ui-mask-placeholder ui-mask-placeholder-char=\"_\" model-view-value=\"true\" generic-server-error> <span class=\"md-icon md-clear x-clear\" ng-mouseenter=\"showClear(true)\" ng-mouseleave=\"showClear(false)\" ng-click=\"clear()\" ng-show=\"overMe\"></span><md-button class=\"md-default-theme choose-date\" ng-class=\"{'datepicker-button-disabled': waiting}\" ng-disabled=\"fieldMeta.isDisabled || datePickerStatus.open\" ng-click=\"handleDatePicker($event)\" aria-label=\"Open Datepicker\"><span class=\"md md-lg md-event-note\"></span></md-button></div><div ng-model=\"formattedDate.value\" ng-change=\"formatDate(formattedDate.value)\" is-open=\"datePickerStatus.open\" datepicker-popup=\"{{dateFormat}}\" datepicker-options=\"dateOptions\" current-text=\"{{$root.bundle.button.today}}\" clear-text=\"{{$root.bundle.button.clear}}\" close-text=\"{{$root.bundle.button.close}}\" min-date=\"{{fieldMeta.datePickerMinDate}}\"></div></div></span></span>"
  );


  $templateCache.put('emailField/emailField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\"><span ng-switch-when=\"false\"><a ng-if=\"fieldData.value\" ng-href=\"mailto:{{fieldData.value}}\">{{fieldData.value}}</a> <span ng-if=\"!fieldData.value\">{{fieldMeta.placeholder}}</span></span> <span ng-switch-when=\"true\"><input type=\"text\" name=\"{{fieldId}}\" ng-model=\"fieldData.value\" ng-model-options=\"{allowInvalid: true}\" ng-maxlength=\"fieldMeta.fieldLength\" maxlength=\"{{fieldMeta.fieldLength}}\" placeholder=\"{{placeholder || fieldMeta.placeholder}}\" generic-server-error></span></span>"
  );


  $templateCache.put('fieldErrorIndicator.html',
    "<span class=\"md md-icon md-error\" ng-show=\"getFormField(form, fieldId).$error.serverError\"><md-tooltip md-direction=\"top\"><div ng-repeat=\"error in getFormField(form, fieldId).$error.serverError\">{{error}}</div></md-tooltip></span>"
  );


  $templateCache.put('fieldSelector.html',
    "<div ng-if=\"fieldSelectorCtrl.editView === 'true' || fieldSelectorCtrl.fieldMeta.visibility !== 'EDIT_ONLY'\" class=\"field-selector\" ng-class=\"{'edit-view': fieldSelectorCtrl.editView === 'true'}\" field-validator><!-- INTEGER --><integer-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.INTEGER\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></integer-field><!-- FLOAT --><float-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.FLOAT\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></float-field><!-- DATE --><date-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.DATE\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></date-field><!-- SINGLE LINE TEXT --><single-line-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.SINGLE_LINE_TEXT\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></single-line-field><!-- MONEY --><money-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.MONEY\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></money-field><!-- PARAGRAPH --><!--<paragraph-field\n" +
    "		ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PARAGRAPH\"\n" +
    "		field-id=\"{{fieldSelectorCtrl.fieldId}}\"\n" +
    "		field-data=\"fieldSelectorCtrl.fieldData\"\n" +
    "		field-meta=\"fieldSelectorCtrl.fieldMeta\"\n" +
    "		placeholder=\"{{fieldSelectorCtrl.placeholder}}\"\n" +
    "		edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\">\n" +
    "	</paragraph-field>--><!-- RICH TEXT FIELD --><rich-text-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PARAGRAPH\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></rich-text-field><!-- CHECKBOX --><checkbox-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.CHECKBOX\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></checkbox-field><!-- RADIO --><radio-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.RADIO || fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.RADIO_LINKED\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"waiting\"></radio-field><!-- AUTONUM --><auto-number-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.AUTONUM\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></auto-number-field><!-- AUTOTEXT --><auto-text-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.AUTOTEXT\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></auto-text-field><!-- IMAGE --><image-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.IMAGE || fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.IMG_THUMB\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" ng-attr-linked-thumbnail=\"{{fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.IMG_THUMB}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></image-field><!-- URL --><url-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.URL\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></url-field><!-- PARAGRAPH WITHOUT LINE BREAKS --><paragraph-without-line-breaks-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PARAGRAPH_WITHOUT_LINE_BREAKS\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></paragraph-without-line-breaks-field><!-- EMAIL --><email-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.EMAIL\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></email-field><!-- CSV --><csv-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.CSV\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></csv-field><!-- ########################## SINGLE PICKLISTs ########################## --><!-- PICKLIST, REGULAR WIDGET, NO BACKEND QUERYING --><picklist-field ng-if=\"(fieldSelectorCtrl.simpleSelect === 'true')\n" +
    "				&& (fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PICKLIST\n" +
    "				|| fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PICKLIST_LINKED\n" +
    "				|| fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PICKLIST_DEFAULT\n" +
    "				|| fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PICKLIST_DEFAULT_LINKED\n" +
    "				|| fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PICKLIST_LATEST\n" +
    "				|| fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PICKLIST_LRL\n" +
    "				|| fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.UOM)\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\" on-change=\"fieldSelectorCtrl.picklistOnChange()\" type-id=\"fieldSelectorCtrl.typeId\"></picklist-field><!-- (ALL TYPES BELOW HAVE BACKEND QUERYING ENABLED IN THE ENDPOINT) --><!-- PICKLIST --><!-- PICKLIST LATEST --><!-- PICKLIST LINKED --><!-- PICKLIST LRL --><!-- PICKLIST DISPLAY FIRST VALUE AS DEFAULT --><!-- PICKLIST DEFAULT --><!-- PICKLIST DEFAULT LINKED --><!-- UOM --><!-- PICKLIST WITH SEARCH FILTER --><!-- PICKLIST WITH SEARCH FILTER LINKED --><generic-picklist-field ng-if=\"(fieldSelectorCtrl.simpleSelect !== 'true')\n" +
    "				&& (fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PICKLIST\n" +
    "				|| fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PICKLIST_LINKED\n" +
    "				|| fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PICKLIST_DEFAULT\n" +
    "				|| fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PICKLIST_DEFAULT_LINKED\n" +
    "				|| fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PICKLIST_LATEST\n" +
    "				|| fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PICKLIST_LRL\n" +
    "				|| fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.UOM\n" +
    "				|| fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PICKLIST_WITH_FILTER\n" +
    "				|| fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PICKLIST_FILTER_LINKED)\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\" on-change=\"fieldSelectorCtrl.selectionOnChange(data)\"></generic-picklist-field><!-- CWS PICKLIST --><simple-picklist-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.SIMPLE_PICKLIST\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></simple-picklist-field><!-- ? --><selection-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.SELECTION\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"waiting\"></selection-field><!-- ########################## MULTI PICKLISTs ########################## --><!-- MULTISELECT LINKED --><!-- MULTISELECT --><multi-picklist-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.MULTISELECT\n" +
    "			|| fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.MULTISELECT_LINKED\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></multi-picklist-field><!-- FLASH @deprecated --><flash-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.FLASH\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\"></flash-field><!-- LONG --><long-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.LONG\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></long-field><!-- MONEY EXTENDED --><money-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.MONEY_EXTENDED\" field-id=\"{{fieldSelectorCtrl.fieldId}}\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></money-field><!-- PICKLIST FILTERED --><filtered-picklist-field ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.PICKLIST_FILTERED\" field-data=\"fieldSelectorCtrl.fieldData\" field-meta=\"fieldSelectorCtrl.fieldMeta\" placeholder=\"{{fieldSelectorCtrl.placeholder}}\" edit-view=\"fieldSelectorCtrl.editView === 'true' && !fieldSelectorCtrl.fieldMeta.readOnly\" waiting=\"fieldSelectorCtrl.waiting\"></filtered-picklist-field><!-- DERIVED --><span ng-if=\"fieldSelectorCtrl.typeId === fieldSelectorCtrl.FieldTypes.DERIVED\"><span ng-if=\"!fieldSelectorCtrl.fieldData.value.link\">{{fieldSelectorCtrl.fieldData.value}}</span> <span ng-if=\"fieldSelectorCtrl.fieldData.value.link\">{{fieldSelectorCtrl.fieldData.value.title}}</span></span></div>"
  );


  $templateCache.put('filteredPicklistField/filteredPicklistField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\"><span ng-switch-when=\"false\" title=\"{{fieldData.value.title || fieldData.value}}\"><a ng-if=\"getTheLink(fieldData.value)\" class=\"href-truncation\" ng-href=\"{{getTheLink(fieldData.value)}}\">{{fieldData.value.title || fieldData.value || fieldMeta.placeholder}} <span ng-if=\"fieldData.value.revision\">{{fieldData.value.revision}}</span> <span ng-if=\"fieldData.value.deleted\">[{{$root.bundle.text.archived.uppercase}}]</span></a> <span ng-if=\"!getTheLink(fieldData.value)\" class=\"text-truncation\">{{fieldData.value.title || fieldData.value || fieldMeta.placeholder}} <span ng-if=\"fieldData.value.revision\">{{fieldData.value.revision}}</span> <span ng-if=\"fieldData.value.deleted\">[{{$root.bundle.text.archived.uppercase}}]</span></span></span> <span ng-switch-when=\"true\"><div class=\"fpl-wrapper\"><div class=\"fpl-wrapper-field\"><div id=\"{{uid}}\" name=\"{{fieldData.urn}}\" class=\"ui fluid search selection single dropdown\" ng-click=\"getOptions()\"><input type=\"hidden\"> <i class=\"dropdown icon\"></i><div class=\"default text\">{{fieldData.value.title || fieldData.value || fieldMeta.placeholder}}</div><div class=\"menu\"><div class=\"item\" data-value=\"{{option.title || option}}\" ng-repeat=\"option in fieldData.options.items track by $index\">{{option.title || option}}</div></div></div></div><div class=\"fpl-wrapper-button\"><md-button id=\"clear-{{fieldData.uid}}\" class=\"md-flat md-mini\" ng-click=\"clearValue()\"><md-icon class=\"md-close\" aria-label=\"Clear\"></md-icon></md-button></div></div></span></span>"
  );


  $templateCache.put('flashField/flashField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\"><span ng-switch-when=\"false\"><a ng-if=\"fieldData.value && fieldData.value.link\" href=\"{{fieldData.value.link}}\"><image ng-src=\"images/icon_flash.png\"></image></a></span> <span ng-switch-when=\"true\"><a ng-if=\"fieldData.value && fieldData.value.link\" href=\"{{fieldData.value.link}}\"><image ng-src=\"images/icon_flash.png\"></image></a></span></span>"
  );


  $templateCache.put('floatField/floatField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\"><span ng-switch-when=\"false\">{{fieldData.formattedValue || fieldMeta.placeholder}}</span> <span ng-switch-when=\"true\"><input type=\"text\" name=\"{{fieldId}}\" ng-model=\"fieldData.value\" ng-model-options=\"{allowInvalid: true}\" ng-maxlength=\"fieldMeta.fieldLength\" maxlength=\"{{fieldMeta.fieldLength}}\" placeholder=\"{{placeholder || fieldMeta.placeholder}}\" generic-server-error></span></span>"
  );


  $templateCache.put('genericPicklistField/genericPicklistField.html',
    "<span ng-switch on=\"ctrl.editView\" class=\"field-plain-text\" ng-class=\"{'edit-mode': ctrl.editView}\"><!-- VIEW mode --><span ng-switch-when=\"false\" title=\"{{ctrl.fieldData.value.title || ctrl.fieldData.value}}\"><a ng-if=\"ctrl.itemLink\" class=\"href-truncation\" ng-href=\"{{ctrl.itemLink}}\">{{ctrl.fieldData.value.title || ctrl.fieldData.value || ctrl.fieldData.defaultValue.title || ctrl.fieldData.defaultValue || ctrl.placeholder || ctrl.fieldMeta.placeholder}} <span ng-if=\"ctrl.fieldData.value.version\">{{ctrl.fieldData.value.version}}</span> <span ng-if=\"ctrl.fieldData.value.deleted\">[{{ctrl.bundle.text.archived.uppercase}}]</span></a> <span ng-if=\"!ctrl.itemLink\" class=\"text-truncation\">{{ctrl.fieldData.value.title || ctrl.fieldData.value || ctrl.fieldData.defaultValue.title || ctrl.fieldData.defaultValue || ctrl.placeholder || ctrl.fieldMeta.placeholder}} <span ng-if=\"ctrl.fieldData.value.version\">{{ctrl.fieldData.value.version}}</span> <span ng-if=\"ctrl.fieldData.value.deleted\">[{{ctrl.bundle.text.archived.uppercase}}]</span></span></span><!-- CREATE/EDIT modes --> <span ng-switch-when=\"true\"><div id=\"{{ctrl.uniqueId}}\" class=\"ui fluid search selection dropdown\"><input type=\"hidden\" name=\"ctrl.fieldId\"> <button class=\"clear-button clear-{{ctrl.uniqueId}} zmdi zmdi-close\" ng-hide=\"!ctrl.showClearButton\" ng-click=\"ctrl.clearValues($event)\"></button> <i class=\"dropdown icon\"></i><div class=\"text\" ng-class=\"{'default': !ctrl.isSelectedValue}\" ng-bind-html=\"!ctrl.isSelectedValue ? ctrl.placeholderText : (ctrl.selectedValue.title || ctrl.selectedValue.value)\"></div><div class=\"menu\"></div></div></span></span>"
  );


  $templateCache.put('imageField/imageField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\"><span ng-switch-when=\"false\"><div class=\"image-field-wrapper\"><span ng-if=\"fieldData.value.listMode && hasLinkedThumbnail\"><img class=\"image-field-thumbnail\" ng-src=\"{{fieldData.value.link}}\" title=\"{{fieldData.value.link}}\"></span> <a ng-if=\"fieldData.value.listMode && !hasLinkedThumbnail\" href=\"javascript:;\" ng-click=\"openImage(fieldData.value.link);event.stopPropagation();\" title=\"{{fieldData.value.link}}\"><img class=\"image-field-thumbnail\" ng-src=\"{{fieldData.value.link}}\" title=\"{{fieldData.value.link}}\"></a> <a ng-if=\"!fieldData.value.listMode\" href=\"javascript:;\" ng-click=\"openImage(fieldData.value.link);event.stopPropagation();\" title=\"{{fieldData.value.link}}\"><img ng-src=\"{{fieldData.value.link}}\" title=\"{{fieldData.value.link}}\"></a></div></span> <span ng-switch-when=\"true\"><!-- TODO: not yet implemented --><img ng-src=\"{{fieldData.value.link}}\"></span></span>"
  );


  $templateCache.put('imageField/imageModal.html',
    "<md-dialog aria-label=\"image-modal\" class=\"image-modal-dialog\"><md-content layout=\"column\" class=\"image-modal\"><div><img ng-src=\"{{imagePath}}\"></div><div class=\"permission-dialog-actions\"><md-button class=\"md-secondary\" ng-click=\"closeDialog();\">{{$root.bundle.button.close}}</md-button></div></md-content></md-dialog>"
  );


  $templateCache.put('integerField/integerField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\"><span ng-switch-when=\"false\">{{fieldData.value || fieldMeta.placeholder}}</span> <span ng-switch-when=\"true\"><input type=\"text\" name=\"{{fieldId}}\" ng-model=\"fieldData.value\" ng-model-options=\"{allowInvalid: true}\" ng-maxlength=\"fieldMeta.fieldLength\" maxlength=\"{{fieldMeta.fieldLength}}\" placeholder=\"{{placeholder || fieldMeta.placeholder}}\" generic-server-error></span></span>"
  );


  $templateCache.put('longField/longField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\"><span ng-switch-when=\"false\">{{fieldData.value || fieldMeta.placeholder}}</span> <span ng-switch-when=\"true\"><input type=\"text\" name=\"{{fieldId}}\" ng-model=\"fieldData.value\" ng-model-options=\"{allowInvalid: true}\" ng-maxlength=\"fieldMeta.fieldLength\" maxlength=\"{{fieldMeta.fieldLength}}\" placeholder=\"{{placeholder || fieldMeta.placeholder}}\" generic-server-error></span></span>"
  );


  $templateCache.put('moneyField/moneyField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\"><span ng-switch-when=\"false\">{{fieldData.formattedValue || fieldMeta.placeholder}}</span> <span ng-switch-when=\"true\"><input type=\"text\" name=\"{{fieldId}}\" ng-model=\"fieldData.value\" ng-model-options=\"{allowInvalid: true}\" ng-maxlength=\"fieldMeta.fieldLength\" maxlength=\"{{fieldMeta.fieldLength}}\" placeholder=\"{{placeholder || fieldMeta.placeholder}}\" generic-server-error></span></span>"
  );


  $templateCache.put('multiPicklistField/multiPicklistField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\"><span ng-switch-when=\"false\" title=\"{{fieldTitle}}\"><span ng-repeat=\"field in fieldData.value\"><div><a class=\"href-truncation\" ng-if=\"field.itemLink\" href=\"{{field.itemLink}}\">{{field.title}} <span ng-if=\"field.version\">{{field.version}}</span> <span ng-if=\"field.deleted\">[{{$root.bundle.text.archived.uppercase}}]</span></a> <span class=\"text-truncation\" ng-if=\"!field.itemLink\">{{field.title}} <span ng-if=\"field.version\">{{field.version}}</span> <span ng-if=\"field.deleted\">[{{$root.bundle.text.archived.uppercase}}]</span></span><br ng-if=\"!$last\"></div></span></span> <span ng-switch-when=\"true\"><div id=\"{{uid}}\" class=\"ui fluid multiple search selection dropdown\"><input type=\"hidden\" name=\"{{fieldId}}\" ng-model=\"fieldData.value\" generic-server-error> <i class=\"dropdown icon\"></i><div class=\"default text\"></div><div class=\"menu\"><div class=\"item\" data-value=\"{{field.link}}\" ng-repeat=\"field in fieldData.options.items track by $index\">{{field.title}} <span ng-if=\"item.version\">{{field.version}}</span> <span ng-if=\"field.deleted\">[{{$root.bundle.text.archived.uppercase}}]</span></div></div></div></span></span>"
  );


  $templateCache.put('paragraphField/paragraphField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\"><pre ng-switch-when=\"false\" title=\"{{fieldData.value}}\">{{fieldData.value || fieldMeta.placeholder}}</pre><span ng-switch-when=\"true\"><textarea name=\"{{fieldId}}\" ng-model=\"fieldData.value\" ng-maxlength=\"fieldMeta.fieldLength\" maxlength=\"{{fieldMeta.fieldLength}}\" placeholder=\"{{placeholder || fieldMeta.placeholder}}\" generic-server-error></textarea></span></span>"
  );


  $templateCache.put('paragraphWithoutLineBreaksField/paragraphWithoutLineBreaksField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\"><span ng-switch-when=\"false\" title=\"{{fieldData.value}}\">{{fieldData.value || fieldMeta.placeholder}}</span> <span ng-switch-when=\"true\"><textarea name=\"{{fieldId}}\" ng-model=\"fieldData.value\" ng-maxlength=\"fieldMeta.fieldLength\" maxlength=\"{{fieldMeta.fieldLength}}\" placeholder=\"{{placeholder || fieldMeta.placeholder}}\" generic-server-error></textarea></span></span>"
  );


  $templateCache.put('picklistField/picklistField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\"><span ng-switch-when=\"false\" title=\"{{fieldData.value.title || fieldData.value}}\"><a ng-if=\"itemLink\" class=\"href-truncation\" ng-href=\"{{itemLink}}\">{{fieldData.value.title || fieldData.value || placeholder || fieldMeta.placeholder}} <span ng-if=\"fieldData.value.revision\">{{fieldData.value.revision}}</span> <span ng-if=\"fieldData.value.deleted\">[{{bundle.text.archived.uppercase}}]</span></a> <span ng-if=\"!itemLink\" class=\"text-truncation\">{{fieldData.value.title || fieldData.value || placeholder || fieldMeta.placeholder}} <span ng-if=\"fieldData.value.revision\">{{fieldData.value.revision}}</span> <span ng-if=\"fieldData.value.deleted\">[{{bundle.text.archived.uppercase}}]</span></span></span> <span ng-switch-when=\"true\"><div id=\"{{uid}}\" class=\"ui fluid search selection single dropdown\" ng-class=\"{'loading': showLoader === true}\"><input type=\"hidden\" name=\"{{fieldId}}\" ng-model=\"fieldData.value\" generic-server-error> <i class=\"dropdown icon\"></i><div class=\"default text\">{{fieldData.value.title || fieldData.value || placeholder || fieldMeta.placeholder}}</div><div class=\"menu\"><div class=\"item\" data-value=\"{{field.link}}\" ng-repeat=\"field in fieldData.options.items\">{{field.title}}</div></div></div></span></span>"
  );


  $templateCache.put('radioField/radioField.html',
    "<span ng-switch on=\"editView\" class=\"field-radio field-plain-text\"><span ng-switch-when=\"false\"><a ng-if=\"itemLink\" class=\"href-truncation\" href=\"{{itemLink}}\" title=\"{{fieldData.value.title || fieldData.value || fieldMeta.placeholder}}\">{{fieldData.value.title || fieldData.value || fieldMeta.placeholder}} <span ng-if=\"fieldData.value.version\">{{fieldData.value.version}}</span> <span ng-if=\"fieldData.value.deleted\">[{{$root.bundle.text.archived.uppercase}}]</span></a> <span ng-if=\"!itemLink\" class=\"text-truncation\" title=\"{{fieldData.value.title || fieldData.value || fieldMeta.placeholder}}\">{{fieldData.value.title || fieldData.value || fieldMeta.placeholder}} <span ng-if=\"fieldData.value.version\">{{fieldData.value.version}}</span> <span ng-if=\"fieldData.value.deleted\">[{{$root.bundle.text.archived.uppercase}}]</span></span></span> <span ng-switch-when=\"true\"><!-- Hidden input field is added to keep track of custom validations --><input type=\"hidden\" name=\"{{fieldId}}\" ng-model=\"fieldData.value\" generic-server-error><!-- To trigger the popup/menu in GRIDs --><div id=\"grid-radio-field\" class=\"ui vertical menu\" ng-if=\"fieldMeta.isRadioButtonInGrid\"><md-radio-group md-no-ink ng-model=\"fieldData.value\" ng-change=\"updateAndClose()\"><md-radio-button class=\"item\" ng-repeat=\"item in fieldData.options.items\" ng-value=\"item\" aria-label=\"{{item.title}}\" title=\"{{item.title}}\">{{item.title}} <span ng-if=\"item.version\">{{item.version}}</span> <span ng-if=\"item.deleted\">[{{$root.bundle.text.archived.uppercase}}]</span></md-radio-button></md-radio-group></div><!-- For non-GRIDs --><span class=\"field-radio-item\" ng-if=\"!fieldMeta.isRadioButtonInGrid\" ng-repeat=\"item in fieldData.options.items\"><input type=\"radio\" name=\"{{fieldData.urn}}\" id=\"{{fieldData.urn.concat(item.link)}}\" ng-change=\"onRadioButtonChange(item.link)\" ng-model=\"fieldData.value.link\" value=\"{{item.link}}\"><label for=\"{{fieldData.urn.concat(item.link)}}\">{{item.title}} <span ng-if=\"item.version\">{{item.version}}</span> <span ng-if=\"item.deleted\">[{{$root.bundle.text.archived.uppercase}}]</span></label></span></span></span>"
  );


  $templateCache.put('richTextField/richTextField.html',
    "<span ng-switch on=\"editView\"><span ng-switch-when=\"false\"><span ng-bind-html=\"fieldData.value\"></span></span> <span ng-switch-when=\"true\"><input type=\"hidden\" ng-model=\"fieldData.value\" name=\"{{fieldId}}\" generic-server-error><div text-angular ng-model=\"fieldData.value\" placeholder=\"{{placeholder || fieldMeta.placeholder}}\"></div></span></span>"
  );


  $templateCache.put('selectionField/selectionField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\"><span ng-switch-when=\"false\" title=\"{{fieldData.value.title}}\"><span class=\"text-truncation\">{{fieldData.value.title}}</span></span> <span ng-switch-when=\"true\"><div id=\"{{fieldData.uid}}\" class=\"ui fluid search selection single dropdown\"><input type=\"hidden\" name=\"{{fieldData.uid}}\"> <i class=\"dropdown icon\"></i><div class=\"default text\">{{fieldData.value.title || placeholder}}</div><div class=\"menu\"><div class=\"item\" data-value=\"{{option.title}}\" ng-repeat=\"option in fieldData.options\">{{option.title}}</div></div></div></span></span>"
  );


  $templateCache.put('simplePicklistField/simplePicklistField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\"><span ng-switch-when=\"false\" title=\"{{fieldData.value.displayValue || fieldData.value}}\"><a ng-if=\"editView\" class=\"href-truncation\" ng-class=\"{'deleted-value': fieldData.value.deleted}\">{{fieldData.value.displayValue || fieldData.value.value}}</a> <span ng-if=\"!editView\" class=\"text-truncation\" ng-class=\"{'deleted-value': fieldData.value.deleted}\">{{fieldData.value.displayValue || fieldData.value.value}}</span></span> <span ng-switch-when=\"true\"><div id=\"{{fieldData.uid}}\" class=\"ui fluid search selection single dropdown\"><input type=\"hidden\" ng-model=\"fieldData.value\" name=\"{{fieldId}}\" generic-server-error> <i class=\"dropdown icon\"></i><div class=\"default text\" ng-class=\"{'deleted-value': fieldData.value.deleted}\">{{fieldData.value.displayValue || fieldData.value.value || bundle.classifications.fields.picklist.placeholder}}</div><div class=\"menu\"><div class=\"item\" data-value=\"{{option.value}}\" ng-repeat=\"option in fieldData.options track by $index\" ng-disabled=\"{{option.deleted}}\" ng-class=\"{'deleted-value': option.deleted}\">{{option.displayValue || option.value}}</div></div></div></span></span>"
  );


  $templateCache.put('singleLineField/singleLineField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\"><span ng-switch-when=\"false\" title=\"{{fieldData.value}}\">{{fieldData.value || placeholder || fieldMeta.placeholder}}</span> <span ng-switch-when=\"true\"><input type=\"text\" name=\"{{fieldId}}\" ng-model=\"fieldData.value\" ng-model-options=\"{allowInvalid: true}\" ng-maxlength=\"fieldMeta.fieldLength\" maxlength=\"{{fieldMeta.fieldLength}}\" placeholder=\"{{placeholder || fieldMeta.placeholder}}\" ng-disabled=\"waiting\" generic-server-error></span></span>"
  );


  $templateCache.put('urlField/urlField.html',
    "<span ng-switch on=\"editView\" class=\"field-plain-text\"><span ng-switch-when=\"false\"><a ng-if=\"fieldData.value\" ng-href=\"{{hrefValue}}\" target=\"_blank\" class=\"href-truncation\">{{fieldData.value}}</a> <span ng-if=\"!fieldData.value\">{{fieldMeta.placeholder}}</span></span> <span ng-switch-when=\"true\"><input type=\"text\" class=\"form-control\" name=\"{{fieldId}}\" ng-model=\"fieldData.value\" ng-model-options=\"{allowInvalid: true}\" ng-maxlength=\"fieldMeta.fieldLength\" maxlength=\"{{fieldMeta.fieldLength}}\" ng-disabled=\"waiting\" placeholder=\"{{placeholder || fieldMeta.placeholder}}\" generic-server-error></span></span>"
  );
}]);