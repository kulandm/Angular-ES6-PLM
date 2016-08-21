import BomUIFieldSemantics from 'com/autodesk/models/bomFields/BomUIFieldSemantics.service.js';

/**
 * @ngdoc object
 * @name Models.ViewDefinitionField
 * @description The Dao for ViewDefinitionField
 */
class ViewDefinitionField {

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#constructor
     * @methodOf Models.ViewDefinitionField
     * @description Initializes a ViewDefinitionField object with using a payload
     * `json` and the endpoint `link` of the field.
     *
     * @param {Object} json the JSON payload for a ViewDefinitionField
     */
    constructor(json) {
        if (json) {
            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#__self__
             * @propertyOf Models.ViewDefinitionField
             * @description The self data for the field
             */
            this.__self__ = json.__self__;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#viewDefFieldId
             * @propertyOf Models.ViewDefinitionField
             * @description The unique identifier for the field
             */
            this.viewDefFieldId = json.viewDefFieldId;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#fieldTab
             * @propertyOf Models.ViewDefinitionField
             * @description The tab where this field resides
             */
            this.businessAspect = json.fieldTab;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#type
             * @propertyOf Models.ViewDefinitionField
             * @description The type information about the ViewDefinitionField
             */
            this.type = json.type;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#fieldTypeId
             * @propertyOf Models.ViewDefinitionField
             * @description The id of the data type of this ViewDefinitionField
             */
            this.fieldTypeId = this.buildTypeId(this.type);

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#htmlDisplayId
             * @propertyOf Models.ViewDefinitionField
             * @description The html display Id of the ViewDefinitionField
             */
            this.htmlDisplayId = (typeof json.htmlDisplayId === 'undefined') ? null : json.htmlDisplayId;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#name
             * @propertyOf Models.ViewDefinitionField
             * @description The name of the ViewDefinitionField
             */
            this.name = (typeof json.name === 'undefined') ? null : json.name;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#displayLength
             * @propertyOf Models.ViewDefinitionField
             * @description The display length of the ViewDefinitionField
             */
            this.displayLength = (typeof json.displayLength === 'undefined') ? null : json.displayLength;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#displayOrder
             * @propertyOf Models.ViewDefinitionField
             * @description The display order of the ViewDefinitionField
             */
            this.displayOrder = (typeof json.displayOrder === 'undefined') ? null : json.displayOrder;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#isDefault
             * @propertyOf Models.ViewDefinitionField
             * @description is it a default field
             */
            this.isDefault = (typeof json.isDefault === 'undefined') ? null : json.isDefault;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#isTransient
             * @propertyOf Models.ViewDefinitionField
             * @description Tells us whether or not the ViewDefinitionField is transient
             */
            this.isTransient = (typeof json.isTransient === 'undefined') ? null : json.isTransient;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#label
             * @propertyOf Models.ViewDefinitionField
             * @description The label of the ViewDefinitionField
             */
            this.label = (typeof json.label === 'undefined') ? null : json.label;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#description
             * @propertyOf Models.ViewDefinitionField
             * @description The description of the ViewDefinitionField
             */
            this.description = (typeof json.description === 'undefined') ? null : json.description;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#defaultValue
             * @propertyOf Models.ViewDefinitionField
             * @description The default value of the ViewDefinitionField for all of its
             * occurance.
             */
            this.defaultValue = (typeof json.defaultValue === 'undefined') ? null : json.defaultValue;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#unitOfMeasure
             * @propertyOf Models.ViewDefinitionField
             * @description The unit of measure  of the ViewDefinitionField
             */
            this.unitOfMeasure = (typeof json.unitOfMeasure === 'undefined') ? null : json.unitOfMeasure;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#fieldLength
             * @propertyOf Models.ViewDefinitionField
             * @description The length of the ViewDefinitionField
             */
            this.fieldLength = (typeof json.fieldLength === 'undefined') ? null : json.fieldLength;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#fieldPrecision
             * @propertyOf Models.ViewDefinitionField
             * @description Precision of the ViewDefinitionField if the field is numeric
             */
            this.fieldPrecision = (typeof json.fieldPrecision === 'undefined') ? null : json.fieldPrecision;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#editability
             * @propertyOf Models.ViewDefinitionField
             * @description The of the editability of the ViewDefinitionField.
             * It can be always editable, or never editable or editable on creation.
             */
            this.editability = (typeof json.editability === 'undefined') ? null : json.editability;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#visibility
             * @propertyOf Models.ViewDefinitionField
             * @description Determines whether or not this ViewDefinitionField is
             * always visible or only when creating and editing an item.
             */
            this.visibility = (typeof json.visibility === 'undefined') ? null : json.visibility;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#derived
             * @propertyOf Models.ViewDefinitionField
             * @description Whether or not the ViewDefinitionField is derived
             */
            this.derived = (typeof json.derived === 'undefined') ? null : json.derived;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#lookups
             * @propertyOf Models.ViewDefinitionField
             * @description if the ViewDefinitionField is a picklist then the api
             * link to the picklist that is going to be used to populate this
             * ViewDefinitionField.
             */
            this.lookups = (typeof json.lookups === 'undefined') ? null : json.lookups;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#visibility
             * @propertyOf Models.ViewDefinitionField
             * @description api link to all the validators associated with the
             * ViewDefinitionField
             */
            this.validators = (typeof json.validators === 'undefined') ? null : json.validators;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#visibleOnPreview
             * @propertyOf Models.ViewDefinitionField
             * @description is the ViewDefinitionField visible on data-card preview
             */
            this.visibleOnPreview = (typeof json.visibleOnPreview === 'undefined') ? null : json.visibleOnPreview;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#fieldSemantics
             * @propertyOf Models.ViewDefinitionField
             * @description the semantics of the field for UI purposes
             */

            this.fieldSemantics = this.determineSemantics(this.businessAspect, this.name);

            /**
             * @ngdoc property
             * @name Models.ViewDefinitionField#fieldId
             * @propertyOf Models.ViewDefinitionField
             * @description Id that automatically gets created using the field
             * name. This id is uniqute to workspace but not accross all the
             * business aspects .
             */
            this.fieldId = (typeof json.fieldId === 'undefined') ? null : json.fieldId;
        }

        /**
         * @ngdoc property
         * @name Models.ViewDefinitionField#json
         * @propertyOf Models.ViewDefinitionField
         * @description The payload that is returned.
         */
        this.json = json;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#determineSemantics
     * @methodOf Models.ViewDefinitionField
     * @description Determines the semantics of a field
     *    NOTE: Should eventually match the server-side enum,
     *      but currently indexing based on arbitrary key that may break due to localization
     *        since the server does not yet return that information
     */
    determineSemantics(businessAspect, name) {
        let semanticsMap = new Map();

        semanticsMap.set('SYSTEMDescriptor', BomUIFieldSemantics.DESCRIPTOR);
        semanticsMap.set('STANDARD_BOMQuantity', BomUIFieldSemantics.QUANTITY);
        semanticsMap.set('SYSTEMRevision', BomUIFieldSemantics.REVISION);
        semanticsMap.set('SYSTEMChange Pending', BomUIFieldSemantics.CHANGE_PENDING);
        semanticsMap.set('SYSTEMAttachments', BomUIFieldSemantics.ATTACHMENTS);
        semanticsMap.set('STANDARD_BOMRevision Pinning', BomUIFieldSemantics.PINNING);

        let key = `${businessAspect}${name}`;
        let semantics = semanticsMap.get(key) || null;
        if (!semantics) {
            semantics = BomUIFieldSemantics.BASIC;
        }
        return semantics;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#getSelf
     * @methodOf Models.ViewDefinitionField
     * @description Returns the field's self information
     *
     * @returns {Object} the self information
     */
    getSelf() {
        return this.__self__;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#getUrn
     * @methodOf Models.ViewDefinitionField
     * @description Returns the field urn
     *
     * @returns {String} the urn
     */
    getUrn() {
        return this.__self__.urn;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#getLink
     * @methodOf Models.ViewDefinitionField
     * @description Returns the field link
     *
     * @returns {String} the link
     */
    getLink() {
        return this.__self__.link;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#getId
     * @methodOf Models.ViewDefinitionField
     * @description Returns the unique identifier of the field
     *
     * @returns {String} the unique id
     */
    getId() {
        return this.viewDefFieldId;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#getDisplayOrder
     * @methodOf Models.ViewDefinitionField
     * @description Returns the display order index
     *
     * @returns {Integer} the display order index
     */
    getDisplayOrder() {
        return this.displayOrder;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#getType
     * @methodOf Models.ViewDefinitionField
     * @description Returns the type information for the field
     *
     * @returns {Object} the type information for the field
     */
    getType() {
        return this.type;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#getTypeId
     * @methodOf Models.ViewDefinitionField
     * @description returns the id of the type
     *
     * @returns {Int} the id of the type
     */
    getTypeId() {
        return this.fieldTypeId;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#buildTypeId
     * @methodOf Models.ViewDefinitionField
     * @description Gets the id # of the type from the type information
     *
     * @returns {Int} the type id
     */
    buildTypeId(type) {
        return parseInt(type.urn.split('.').pop());
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#getBusinessAspect
     * @methodOf Models.ViewDefinitionField
     * @description Returns the business aspect this field corresponds to
     * @returns {String} the business aspect
     */
    getBusinessAspect() {
        return this.businessAspect;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#isEdgeField
     * @methodOf Models.ViewDefinitionField
     * @description Returns true if the field is a bom field
     */
    isBomField() {
        return (this.businessAspect === 'STANDARD_BOM') || (this.businessAspect === 'CUSTOM_BOM');
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#getFieldSemantics
     * @methodOf Models.ViewDefinitionField
     * @description returns the semantics of the field is
     *    for UI purposes
     *
     * @returns {Object} the semantics of the field
     */
    getFieldSemantics() {
        return this.fieldSemantics;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#isAlwaysEditable
     * @methodOf Models.ViewDefinitionField
     * @description Checks whether or not the ViewDefinitionField is always editable.
     *  Fields with the semantics of QUANTITY, REVISION, and PINNING are always edtiable
     *
     * @returns {Boolean} true if the ViewDefinitionField is always editable.
     */
    isAlwaysEditable() {
        if (this.fieldSemantics === BomUIFieldSemantics.QUANTITY ||
                this.fieldSemantics === BomUIFieldSemantics.REVISION ||
                this.fieldSemantics === BomUIFieldSemantics.PINNING) {
            return true;
        } else if (!this.isBomField()) {
            return false;
        } else {
            return this.editability === 'ALWAYS';
        }
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#isOnlyEditableOnCreate
     * @methodOf Models.ViewDefinitionField
     * @description Checks whether or not the ViewDefinitionField is only editable on creation.
     *
     * @returns {Boolean} true if the ViewDefinitionField is only editable on create.
     */
    isOnlyEditableOnCreate() {
        if (!this.isBomField()) {
            return false;
        }
        return this.editability === 'CREATE_ONLY';
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#isOnlyEditableOnCreate
     * @methodOf Models.ViewDefinitionField
     * @description Checks whether or not the ViewDefinitionField is editable on creation,
     *  This is the case if it is always editable, or if is editable on create only
     *
     * @returns {Boolean} true if the ViewDefinitionField is editable on create.
     */
    isEditableOnCreate() {
        return this.isAlwaysEditable() || this.isOnlyEditableOnCreate();
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#getName
     * @methodOf Models.ViewDefinitionField
     * @description getter method for accessing the name of the ViewDefinitionField
     *
     * @returns {String} The name of the ViewDefinitionField
     */
    getName() {
        return this.name;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#getFieldId
     * @methodOf Models.ViewDefinitionField
     * @description getter method for accessing the fieldId of the ViewDefinitionField
     *
     * @returns {String} The field id of the ViewDefinitionField
     */
    getFieldId() {
        return this.fieldId;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitionField#fetch
     * @methodOf Models.ViewDefinitionField
     * @description Makes a request to the end point `link` using the `params` in
     *	order to load a ViewDefinitionField
     *
     * @param {String} link The URL to use for fetching the data
     * @param {Object} params parametrs to send with the GET
     *
     * @returns {Object} A Promise that may be resolved to get a an instance of
     * ViewDefinitionField .
     */
    static fetch(link, params) {
        let headers = {
            skipCache: true
        };

        return this.RESTWrapperService.get(link, null, params, headers).then((payload) => {
            return new ViewDefinitionField(payload, link);
        });
    }
}

/**
 * @ngdoc function
 * @name ViewDefinitionField
 * @description Factory for creating ViewDefinitionField
 *
 * @param {Object} RESTWrapperService singleton object that is used to make api
 * calls to the endpoints
 * @param {Object} BomUIFieldCategories categories for fields
 *      currently unused until v3 payload provides enough information
 *
 * @returns {Object} ViewDefinitionField Object
 */
let ViewDefinitionFieldFactory = (RESTWrapperService) => {
    ViewDefinitionField.RESTWrapperService = RESTWrapperService;

    return ViewDefinitionField;
};

export default angular.module(__moduleName, []).factory('ViewDefinitionField', ['RESTWrapperService', ViewDefinitionFieldFactory]);
