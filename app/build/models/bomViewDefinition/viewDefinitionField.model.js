System.registerModule("com/autodesk/models/bomViewDefinition/viewDefinitionField.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomViewDefinition/viewDefinitionField.model.js";
  var BomUIFieldSemantics = System.get("com/autodesk/models/bomFields/BomUIFieldSemantics.service.js").default;
  var ViewDefinitionField = function() {
    function ViewDefinitionField(json) {
      if (json) {
        this.__self__ = json.__self__;
        this.viewDefFieldId = json.viewDefFieldId;
        this.businessAspect = json.fieldTab;
        this.type = json.type;
        this.fieldTypeId = this.buildTypeId(this.type);
        this.htmlDisplayId = (typeof json.htmlDisplayId === 'undefined') ? null : json.htmlDisplayId;
        this.name = (typeof json.name === 'undefined') ? null : json.name;
        this.displayLength = (typeof json.displayLength === 'undefined') ? null : json.displayLength;
        this.displayOrder = (typeof json.displayOrder === 'undefined') ? null : json.displayOrder;
        this.isDefault = (typeof json.isDefault === 'undefined') ? null : json.isDefault;
        this.isTransient = (typeof json.isTransient === 'undefined') ? null : json.isTransient;
        this.label = (typeof json.label === 'undefined') ? null : json.label;
        this.description = (typeof json.description === 'undefined') ? null : json.description;
        this.defaultValue = (typeof json.defaultValue === 'undefined') ? null : json.defaultValue;
        this.unitOfMeasure = (typeof json.unitOfMeasure === 'undefined') ? null : json.unitOfMeasure;
        this.fieldLength = (typeof json.fieldLength === 'undefined') ? null : json.fieldLength;
        this.fieldPrecision = (typeof json.fieldPrecision === 'undefined') ? null : json.fieldPrecision;
        this.editability = (typeof json.editability === 'undefined') ? null : json.editability;
        this.visibility = (typeof json.visibility === 'undefined') ? null : json.visibility;
        this.derived = (typeof json.derived === 'undefined') ? null : json.derived;
        this.lookups = (typeof json.lookups === 'undefined') ? null : json.lookups;
        this.validators = (typeof json.validators === 'undefined') ? null : json.validators;
        this.visibleOnPreview = (typeof json.visibleOnPreview === 'undefined') ? null : json.visibleOnPreview;
        this.fieldSemantics = this.determineSemantics(this.businessAspect, this.name);
        this.fieldId = (typeof json.fieldId === 'undefined') ? null : json.fieldId;
      }
      this.json = json;
    }
    return ($traceurRuntime.createClass)(ViewDefinitionField, {
      determineSemantics: function(businessAspect, name) {
        var semanticsMap = new Map();
        semanticsMap.set('SYSTEMDescriptor', BomUIFieldSemantics.DESCRIPTOR);
        semanticsMap.set('STANDARD_BOMQuantity', BomUIFieldSemantics.QUANTITY);
        semanticsMap.set('SYSTEMRevision', BomUIFieldSemantics.REVISION);
        semanticsMap.set('SYSTEMChange Pending', BomUIFieldSemantics.CHANGE_PENDING);
        semanticsMap.set('SYSTEMAttachments', BomUIFieldSemantics.ATTACHMENTS);
        semanticsMap.set('STANDARD_BOMRevision Pinning', BomUIFieldSemantics.PINNING);
        var key = ("" + businessAspect + name);
        var semantics = semanticsMap.get(key) || null;
        if (!semantics) {
          semantics = BomUIFieldSemantics.BASIC;
        }
        return semantics;
      },
      getSelf: function() {
        return this.__self__;
      },
      getUrn: function() {
        return this.__self__.urn;
      },
      getLink: function() {
        return this.__self__.link;
      },
      getId: function() {
        return this.viewDefFieldId;
      },
      getDisplayOrder: function() {
        return this.displayOrder;
      },
      getType: function() {
        return this.type;
      },
      getTypeId: function() {
        return this.fieldTypeId;
      },
      buildTypeId: function(type) {
        return parseInt(type.urn.split('.').pop());
      },
      getBusinessAspect: function() {
        return this.businessAspect;
      },
      isBomField: function() {
        return (this.businessAspect === 'STANDARD_BOM') || (this.businessAspect === 'CUSTOM_BOM');
      },
      getFieldSemantics: function() {
        return this.fieldSemantics;
      },
      isAlwaysEditable: function() {
        if (this.fieldSemantics === BomUIFieldSemantics.QUANTITY || this.fieldSemantics === BomUIFieldSemantics.REVISION || this.fieldSemantics === BomUIFieldSemantics.PINNING) {
          return true;
        } else if (!this.isBomField()) {
          return false;
        } else {
          return this.editability === 'ALWAYS';
        }
      },
      isOnlyEditableOnCreate: function() {
        if (!this.isBomField()) {
          return false;
        }
        return this.editability === 'CREATE_ONLY';
      },
      isEditableOnCreate: function() {
        return this.isAlwaysEditable() || this.isOnlyEditableOnCreate();
      },
      getName: function() {
        return this.name;
      },
      getFieldId: function() {
        return this.fieldId;
      }
    }, {fetch: function(link, params) {
        var headers = {skipCache: true};
        return this.RESTWrapperService.get(link, null, params, headers).then(function(payload) {
          return new ViewDefinitionField(payload, link);
        });
      }});
  }();
  var ViewDefinitionFieldFactory = function(RESTWrapperService) {
    ViewDefinitionField.RESTWrapperService = RESTWrapperService;
    return ViewDefinitionField;
  };
  var $__default = angular.module(__moduleName, []).factory('ViewDefinitionField', ['RESTWrapperService', ViewDefinitionFieldFactory]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomViewDefinition/viewDefinitionField.model.js
