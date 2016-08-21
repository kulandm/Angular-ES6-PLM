System.registerModule("com/autodesk/models/bomTable/bomFieldData.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomTable/bomFieldData.js";
  var BomUIFieldSemantics = System.get("com/autodesk/models/bomFields/BomUIFieldSemantics.service.js").default;
  var BomFieldDataFactory = function() {
    function BomFieldDataFactory($rootScope, $filter, FieldData, FieldTypes, Workspace) {
      this.$rootScope = $rootScope;
      this.$filter = $filter;
      this.FieldTypes = FieldTypes;
      this.FieldData = FieldData;
      this.Workspace = Workspace;
      this.workspaceModel = new Workspace();
    }
    return ($traceurRuntime.createClass)(BomFieldDataFactory, {
      fromField: function(field) {
        var args = this.buildFieldDataArgs(field);
        var fieldData = this.FieldData.fromFieldData(args.typeId, args);
        var bomFieldData = this.decorateFieldData(fieldData, field);
        return bomFieldData;
      },
      decorateFieldData: function(instance, field) {
        var $__3 = this;
        var semantics = field.getFieldSemantics();
        instance.getFieldSemantics = function() {
          return semantics;
        };
        var id = field.getId();
        instance.getFieldId = function() {
          return id;
        };
        var viewDefFieldInfo = field.getViewDefFieldInfo();
        instance.getViewDefFieldInfo = function() {
          return viewDefFieldInfo;
        };
        switch (instance.typeId) {
          case this.FieldTypes.PICKLIST:
          case this.FieldTypes.PICKLIST_LINKED:
          case this.FieldTypes.PICKLIST_DEFAULT:
          case this.FieldTypes.PICKLIST_DEFAULT_LINKED:
          case this.FieldTypes.PICKLIST_LATEST:
          case this.FieldTypes.PICKLIST_LRL:
          case this.FieldTypes.UOM:
          case this.FieldTypes.PICKLIST_WITH_FILTER:
          case this.FieldTypes.PICKLIST_FILTER_LINKED:
            instance.metadata.picklistLoaderWithFiltering = function(query) {
              return $__3.workspaceModel.getPicklistValuesWithFiltering(instance.metadata.lookups, query);
            };
            break;
          default:
            break;
        }
        return instance;
      },
      buildFieldDataArgs: function(field) {
        var fieldDataArgs = {
          value: field.value,
          typeId: field.type,
          metadata: field.metadata
        };
        if (field.getFieldSemantics() === BomUIFieldSemantics.DESCRIPTOR) {
          fieldDataArgs.value = {
            descriptor: field.value,
            href: field.href
          };
        } else if (field.getFieldSemantics() === BomUIFieldSemantics.CHANGE_PENDING) {
          fieldDataArgs.typeId = this.FieldTypes.NOOB;
          if (field.value !== '') {
            fieldDataArgs.value = {
              title: field.value.title,
              href: field.href
            };
          }
        } else if (field.getFieldSemantics() === BomUIFieldSemantics.BOM_ITEM_NUMBER) {
          if (angular.isDefined(fieldDataArgs.value.itemNumber)) {
            fieldDataArgs.value.itemNumber = fieldDataArgs.value.itemNumber.toString();
          }
        } else if (field.getFieldSemantics() === BomUIFieldSemantics.REVISION) {
          fieldDataArgs.typeId = this.FieldTypes.SELECTION;
          fieldDataArgs.value = this.formatRevisionValue(field.value);
        } else if (field.getFieldSemantics() === BomUIFieldSemantics.PINNING) {
          fieldDataArgs.typeId = this.FieldTypes.NOOB;
        } else if (field.getFieldSemantics() === BomUIFieldSemantics.ATTACHMENTS) {
          fieldDataArgs.typeId = this.FieldTypes.NOOB;
        } else {
          switch (field.type) {
            case this.FieldTypes.PARAGRAPH:
              fieldDataArgs.value = this.$filter('lineBreakFilter')(field.value);
              break;
            default:
              break;
          }
        }
        return fieldDataArgs;
      },
      formatRevisionValue: function(fieldValue) {
        var newValue = fieldValue;
        if (fieldValue !== '') {
          if (fieldValue === 'WIP') {
            newValue = {title: this.$rootScope.bundle.revision.working};
          } else {
            newValue = {title: fieldValue};
          }
        }
        return newValue;
      }
    }, {});
  }();
  angular.module(__moduleName, []).service('BomFieldData', ['$rootScope', '$filter', 'FieldData', 'FieldTypes', 'Workspace', BomFieldDataFactory]);
  return {};
});
//# sourceURL=com/autodesk/models/bomTable/bomFieldData.js
