System.registerModule("com/autodesk/models/bomGraph/bomField.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomGraph/bomField.model.js";
  var BomUIFieldSemantics = System.get("com/autodesk/models/bomFields/BomUIFieldSemantics.service.js").default;
  var BomField = function() {
    function BomField(args) {
      this.viewDefFieldInfo = args.viewDefFieldInfo;
      this.type = args.type;
      this.id = args.id;
      this.semantics = args.semantics;
      this.value = (typeof args.value === 'undefined') ? '' : args.value;
      this.metadata = (typeof args.metadata === 'undefined') ? {} : args.metadata;
      this.href = null;
    }
    return ($traceurRuntime.createClass)(BomField, {
      getViewDefFieldInfo: function() {
        return this.viewDefFieldInfo;
      },
      getId: function() {
        return this.id;
      },
      getFieldSemantics: function() {
        return this.semantics;
      },
      getValue: function() {
        return this.value;
      },
      updateFieldValue: function(valueSource) {
        if (valueSource && valueSource.has(this.getId())) {
          this.value = valueSource.get(this.getId());
          if (typeof this.value === 'number') {
            this.value = this.value.toString();
          }
        }
      },
      generateHref: function(urn) {
        var semantics = this.getFieldSemantics();
        if (semantics === BomUIFieldSemantics.DESCRIPTOR || semantics === BomUIFieldSemantics.CHANGE_PENDING) {
          if (semantics === BomUIFieldSemantics.CHANGE_PENDING && this.value !== 'false' && this.value.urn) {
            urn = this.value.urn;
          }
          var workspaceId = urn.split('.').reverse()[1];
          this.href = BomField.$state.href('details', {
            workspaceId: workspaceId,
            tab: 'details',
            view: 'full',
            mode: 'view',
            itemId: BomField.UrnParser.encode(urn)
          });
        }
      }
    }, {
      ItemNumberField: function() {
        var fieldArgs = {};
        fieldArgs.id = BomUIFieldSemantics.BOM_ITEM_NUMBER;
        fieldArgs.semantics = BomUIFieldSemantics.BOM_ITEM_NUMBER;
        fieldArgs.type = BomField.FieldTypes.NOOB;
        return new BomField(fieldArgs);
      },
      FromViewDefField: function(viewDefField) {
        var fieldArgs = {};
        fieldArgs.viewDefFieldInfo = viewDefField.getSelf();
        fieldArgs.type = viewDefField.getTypeId();
        fieldArgs.id = viewDefField.getUrn();
        fieldArgs.semantics = viewDefField.getFieldSemantics();
        fieldArgs.metadata = viewDefField;
        return new BomField(fieldArgs);
      }
    });
  }();
  var BomFieldFactory = function($state, UrnParser, FieldTypes) {
    BomField.$state = $state;
    BomField.UrnParser = UrnParser;
    BomField.FieldTypes = FieldTypes;
    return BomField;
  };
  BomFieldFactory.$inject = ['$state', 'UrnParser', 'FieldTypes'];
  var $__default = BomFieldFactory;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomGraph/bomField.model.js
