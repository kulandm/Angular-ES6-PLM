import BomTableColumn from 'com/autodesk/models/bomTable/bomTableColumn.model.js';
import BomUIFieldSemantics from 'com/autodesk/models/bomFields/BomUIFieldSemantics.service.js';

/**
 * @ngdoc object
 * @name Models.BomTableColumnBuilder
 * @description Service for building columns of the Bom Table
 */
class BomTableColumnBuilder {

    /**
     * @ngdoc method
     * @name Models.BomTableColumnBuilder#constructor
     * @methodOf Models.BomTableColumnBuilder
     * @description Service constructor
     */
    constructor(FieldTypes) {
        this.FieldTypes = FieldTypes;

        /**
         * @ngdoc property
         * @name Models.BomTableColumnBuilder#columnTemplates
         * @propertyOf Models.BomTableColumnBuilder
         * @description Templates for viewdef columns that require special handling
         */
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
            width: '60' // Width of 3-digit number + attachment icon
        });
        this.columnTemplates.set(BomUIFieldSemantics.CHANGE_PENDING, {
            cellTemplate: 'bomPendingChangeTemplate',
            headerCellTemplateClass: 'icon-plm-stamp',
            enableColumnResizing: false,
            width: '35' // Width of icon-plm-stamp
        });
    }

    /**
     * @ngdoc method
     * @name Models.BomTableColumnBuilder#buildColumnForViewDefField
     * @methodOf Models.BomTableColumnBuilder
     * @description Creates an instance of BomTableColumn for the given view def field
     * @param {ViewDefinitionField} viewDefField the view def field describing the column
     *
     * @returns {BomTableColumn} the newly created column
     */
    buildColumnForViewDefField(viewDefField) {
        let columnArgs = {
            displayName: viewDefField.getName(),
            fieldId: viewDefField.getUrn(),
            columnSemantics: viewDefField.getFieldSemantics()
        };

        if (this.columnTemplates.has(viewDefField.getFieldSemantics())) {
            let template = this.columnTemplates.get(viewDefField.getFieldSemantics());

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

        let column = new BomTableColumn(columnArgs);
        return column;
    }

    /**
     * @ngdoc method
     * @name Models.BomTableColumnBuilder#buildEditIndicatorColumn
     * @methodOf Models.BomTableColumnBuilder
     * @description Creates an instance of BomTableColumn for the edit indicator column
     *
     * @returns {BomTableColumn} the newly created column
     */
    buildEditIndicatorColumn() {
        return new BomTableColumn({
            displayName: ' ',
            field: 'indicator',
            enableSorting: false,
            suppressRemoveSort: true,
            cellTemplate: 'bomEditIndicatorTemplate',
            width: '5',
            enableColumnResizing: false
        });
    }

    /**
     * @ngdoc method
     * @name Models.BomTableColumnBuilder#buildRowSelectorColumn
     * @methodOf Models.BomTableColumnBuilder
     * @description Creates an instance of BomTableColumn for the row selector column
     *
     * @returns {BomTableColumn} the newly created column
     */
    buildRowSelectorColumn() {
        return new BomTableColumn({
            displayName: '',
            field: 'selector',
            enableSorting: false,
            suppressRemoveSort: true,
            cellTemplate: 'bomRowSelectorTemplate',
            enableColumnResizing: false,
            width: '50'
        });
    }

    /**
     * @ngdoc method
     * @name Models.BomTableColumnBuilder#buildRowIdColumn
     * @methodOf Models.BomTableColumnBuilder
     * @description Creates an instance of BomTableColumn for the row id (row number) column
     *
     * @returns {BomTableColumn} the newly created column
     */
    buildRowIdColumn() {
        return new BomTableColumn({
            displayName: '#',
            fieldId: BomUIFieldSemantics.BOM_ITEM_NUMBER,
            columnSemantics: BomUIFieldSemantics.BOM_ITEM_NUMBER,
            enableSorting: false,
            suppressRemoveSort: true,
            cellTemplate: 'bomRowIdTemplate',
            width: '10%'
        });
    }

    /**
     * @ngdoc method
     * @name Models.BomTableColumnBuilder#buildHeaderTemplate
     * @methodOf Models.BomTableColumnBuilder
     * @description Compiles an html string to for ui-grid header cell using a
     * class names and title attribute.
     *
     * @param {String} `className`  one or more space separated css class names.
     * @param {String} `titleText`  The text to be used as the title attribute of
     * template
     *
     * @returns {String} a template string with the className and titleText.
     */
    buildHeaderTemplate(className, titleText) {
        let template = `<div class="ui-grid-cell-contents header-cell icon"><span class="md ${className} bom-md-icon" title="${titleText}"></span></div>`;

        return template;
    }
}

angular.module(__moduleName, []).service('BomTableColumnBuilder', ['FieldTypes', BomTableColumnBuilder]);
