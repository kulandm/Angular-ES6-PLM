System.registerModule("com/autodesk/models/bomTable/bomTableColumnBuilder.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomTable/bomTableColumnBuilder.service.js";
  var BomTableColumn = System.get("com/autodesk/models/bomTable/bomTableColumn.model.js").default;
  var BomUIFieldSemantics = System.get("com/autodesk/models/bomFields/BomUIFieldSemantics.service.js").default;
  var BomTableColumnBuilder = function() {
    function BomTableColumnBuilder(FieldTypes) {
      this.FieldTypes = FieldTypes;
      this.columnTemplates = new Map();
      this.columnTemplates.set(BomUIFieldSemantics.DESCRIPTOR, {
        cellTemplate: 'bomItemDescriptorTemplate',
        headerCellTemplateClass: null,
        width: '20%'
      });
      this.columnTemplates.set(BomUIFieldSemantics.REVISION, {
        cellTemplate: 'bomRevisionTemplate',
        headerCellTemplateClass: null,
        width: '7%'
      });
      this.columnTemplates.set(BomUIFieldSemantics.PINNING, {
        cellTemplate: 'bomPinnedTemplate',
        headerCellTemplateClass: 'icon-a360-pin',
        enableColumnResizing: false,
        width: '35'
      });
      this.columnTemplates.set(BomUIFieldSemantics.ATTACHMENTS, {
        cellTemplate: 'bomAttachmentsTemplate',
        headerCellTemplateClass: 'md-attach-file',
        enableColumnResizing: false,
        width: '60'
      });
      this.columnTemplates.set(BomUIFieldSemantics.CHANGE_PENDING, {
        cellTemplate: 'bomPendingChangeTemplate',
        headerCellTemplateClass: 'icon-plm-stamp',
        enableColumnResizing: false,
        width: '35'
      });
    }
    return ($traceurRuntime.createClass)(BomTableColumnBuilder, {
      buildColumnForViewDefField: function(viewDefField) {
        var columnArgs = {
          displayName: viewDefField.getName(),
          fieldId: viewDefField.getUrn(),
          columnSemantics: viewDefField.getFieldSemantics()
        };
        if (this.columnTemplates.has(viewDefField.getFieldSemantics())) {
          var template = this.columnTemplates.get(viewDefField.getFieldSemantics());
          columnArgs.cellTemplate = template.cellTemplate;
          columnArgs.width = template.width;
          columnArgs.enableColumnResizing = template.enableColumnResizing;
          if (template.headerCellTemplateClass !== null) {
            columnArgs.headerCellTemplate = this.buildHeaderTemplate(template.headerCellTemplateClass, columnArgs.displayName);
          }
        } else {
          switch (viewDefField.getTypeId()) {
            case this.FieldTypes.PARAGRAPH:
              columnArgs.cellTemplate = 'bomRTFTemplate';
              break;
            case this.FieldTypes.CHECKBOX:
              columnArgs.cellTemplate = 'bomNoEditOnClickTemplate';
              break;
            case this.FieldTypes.PICKLIST:
            case this.FieldTypes.PICKLIST_LINKED:
            case this.FieldTypes.PICKLIST_DEFAULT:
            case this.FieldTypes.PICKLIST_DEFAULT_LINKED:
            case this.FieldTypes.PICKLIST_LATEST:
            case this.FieldTypes.PICKLIST_LRL:
            case this.FieldTypes.UOM:
            case this.FieldTypes.PICKLIST_WITH_FILTER:
            case this.FieldTypes.PICKLIST_FILTER_LINKED:
            case this.FieldTypes.SIMPLE_PICKLIST:
              columnArgs.cellTemplate = 'bomPicklistTemplate';
              break;
            default:
              break;
          }
        }
        var column = new BomTableColumn(columnArgs);
        return column;
      },
      buildEditIndicatorColumn: function() {
        return new BomTableColumn({
          displayName: ' ',
          field: 'indicator',
          enableSorting: false,
          suppressRemoveSort: true,
          cellTemplate: 'bomEditIndicatorTemplate',
          width: '5',
          enableColumnResizing: false
        });
      },
      buildRowSelectorColumn: function() {
        return new BomTableColumn({
          displayName: '',
          field: 'selector',
          enableSorting: false,
          suppressRemoveSort: true,
          cellTemplate: 'bomRowSelectorTemplate',
          enableColumnResizing: false,
          width: '50'
        });
      },
      buildRowIdColumn: function() {
        return new BomTableColumn({
          displayName: '#',
          fieldId: BomUIFieldSemantics.BOM_ITEM_NUMBER,
          columnSemantics: BomUIFieldSemantics.BOM_ITEM_NUMBER,
          enableSorting: false,
          suppressRemoveSort: true,
          cellTemplate: 'bomRowIdTemplate',
          width: '10%'
        });
      },
      buildHeaderTemplate: function(className, titleText) {
        var template = ("<div class=\"ui-grid-cell-contents header-cell icon\"><span class=\"md " + className + " bom-md-icon\" title=\"" + titleText + "\"></span></div>");
        return template;
      }
    }, {});
  }();
  angular.module(__moduleName, []).service('BomTableColumnBuilder', ['FieldTypes', BomTableColumnBuilder]);
  return {};
});
//# sourceURL=com/autodesk/models/bomTable/bomTableColumnBuilder.service.js
