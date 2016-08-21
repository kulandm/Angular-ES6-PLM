import BomUIFieldSemantics from 'com/autodesk/models/bomFields/BomUIFieldSemantics.service.js';

/**
 * @ngdoc object
 * @name Factories.BomFieldDataFactory
 * @description Factory that wraps a FieldData instance with bom specific properties,
 *     for use in BomTabl3
 */
class BomFieldDataFactory {

    /**
     * @ngdoc method
     * @name Factories.BomFieldDataFactory#constructor
     * @methodOf Factories.BomFieldDataFactory
     * @description factory constrctor for dependency injection
     */
    constructor($rootScope, $filter, FieldData, FieldTypes, Workspace) {
        this.$rootScope = $rootScope;
        this.$filter = $filter;
        this.FieldTypes = FieldTypes;
        this.FieldData = FieldData;
        this.Workspace = Workspace;

        /**
         * @ngdoc property
         * @name Factories.BomFieldDataFactory#workspaceModel
         * @propertyOf Factories.BomFieldDataFactory
         * @description A workspace model with no data, to give access to picklist loading methods
         */
        this.workspaceModel = new Workspace();
    }

    /**
     * @ngdoc method
     * @name Factories.BomFieldDataFactory#fromField
     * @methodOf Factories.BomFieldDataFactory
     * @description Builds the BomFieldData instance from the field
     */
    fromField(field) {
        let args = this.buildFieldDataArgs(field);
        let fieldData = this.FieldData.fromFieldData(args.typeId, args);
        let bomFieldData = this.decorateFieldData(fieldData, field);

        return bomFieldData;
    }

    /**
     * @ngdoc method
     * @name Factories.BomFieldDataFactory#decorateFieldData
     * @methodOf Factories.BomFieldDataFactory
     * @description Adds bom specific properties to instance
     *  Adds the following properties:
     *      getFieldSemantics() - a method that returns the semantics of the field
     *      getFieldId() - a method that returns the id of the field
     *      getViewDefFieldInfo() - a method that returns the link to the view definition
     *      if the field is a picklist, then the following properties are defined
     *          picklistLoaderWithFiltering() - a method used by the new picklist widget to load options asynchronously
     *
     * @param {FieldData} instance an instance of a fieldData class
     * @param {Object} field An object that provides any necessary properties
     */
    decorateFieldData(instance, field) {
        let semantics = field.getFieldSemantics();
        instance.getFieldSemantics = () => {
            return semantics;
        };

        let id = field.getId();
        instance.getFieldId = () => {
            return id;
        };

        let viewDefFieldInfo = field.getViewDefFieldInfo();
        instance.getViewDefFieldInfo = () => {
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
					instance.metadata.picklistLoaderWithFiltering = (query) => {
						return this.workspaceModel.getPicklistValuesWithFiltering(instance.metadata.lookups, query);
					};
					break;

				default:
					break;
			}

        return instance;
    }

    /**
     * @ngdoc method
     * @name Factories.BomFieldDataFactory#buildFieldDataArgs
     * @methodOf Factories.BomFieldDataFactory
     * @description Builds arguments object that will be provided to FieldData constructor
     * @param {Object} field An object that provides any necessary properties
     */
    buildFieldDataArgs(field) {
        let fieldDataArgs = {
            value: field.value,
            typeId: field.type,
            metadata: field.metadata
        };

        // Descriptor and Change Order require extra information in their value
        if (field.getFieldSemantics() === BomUIFieldSemantics.DESCRIPTOR) {
            fieldDataArgs.value = {
                descriptor: field.value,
                href: field.href
            };
        } else if (field.getFieldSemantics() === BomUIFieldSemantics.CHANGE_PENDING) {
            // Change pending is converted to a NOOB, since its type returns as 5
            //  Which translates to MONEY
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
            // Revision field is handled specially - backend field is a string
            //  but we want a selection box
            fieldDataArgs.typeId = this.FieldTypes.SELECTION;
            fieldDataArgs.value = this.formatRevisionValue(field.value);
        } else if (field.getFieldSemantics() === BomUIFieldSemantics.PINNING) {
            // Pinning is converted to a NOOB, since its type returns as 5
            //  Which translates to MONEY
            fieldDataArgs.typeId = this.FieldTypes.NOOB;
        } else if (field.getFieldSemantics() === BomUIFieldSemantics.ATTACHMENTS) {
            // Attachments is converted to a NOOB, since its type returns as 5
            //  Which translates to MONEY
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
    }

    /**
     * @ngdoc method
     * @name Factories.BomFieldDataFactory#formatRevisionValue
     * @methodOf Factories.BomFieldDataFactory
     * @description Formats the revision fields value,
     *     changing it if the value is specially displayed:
     *      If an item is revisioned but unreleased, the value returned from the server is 'WIP',
     *         but the actual display value should be 'Working'
     * @param {Object} fieldValue the original value of the revision
     *
     * @returns {Object} the new value
     */
    formatRevisionValue(fieldValue) {
        let newValue = fieldValue;
        if (fieldValue !== '') {
            if (fieldValue === 'WIP') {
                newValue = {
                    title: this.$rootScope.bundle.revision.working
                };
            } else {
                newValue = {
                    title: fieldValue
                };
            }
        }

        return newValue;
    }
}

angular.module(__moduleName, []).service('BomFieldData', ['$rootScope', '$filter', 'FieldData', 'FieldTypes', 'Workspace', BomFieldDataFactory]);
