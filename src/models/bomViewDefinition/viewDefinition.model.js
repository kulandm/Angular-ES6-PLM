import BomUIFieldSemantics from 'com/autodesk/models/bomFields/BomUIFieldSemantics.service.js';
'use strict';

/**
 * @ngdoc object
 * @name Models.ViewDefinition
 *
 * @description This class wraps a ViewDefinition payload into an object
 *
 * ##Dependencies
 *
 */
class ViewDefinition {
    /**
     * @ngdoc method
     * @name Models.ViewDefinition#constructor
     * @methodOf Models.ViewDefinition
     * @description the instance contructor
     */
    constructor(json) {
        if (json) {
            /**
             * @ngdoc property
             * @name Models.ViewDefinition#__self__
             * @propertyOf Models.ViewDefinition
             * @description the __self__ object, holding link and urn
             */
            this.__self__ = json.__self__;

            /**
             * @ngdoc property
             * @name Models.ViewDefinition#name
             * @propertyOf Models.ViewDefinition
             * @description the name of the view
             */
            this.name = json.name;

            /**
             * @ngdoc property
             * @name Models.ViewDefinition#isDefault
             * @propertyOf Models.ViewDefinition
             * @description Bool indicating if the view is the default view
             */
            this.isDefault = json.isDefault;

            /**
             * @ngdoc property
             * @name Models.ViewDefinition#id
             * @propertyOf Models.ViewDefinition
             * @description The id of the view
             */
            this.id = json.id;

            /**
             * @ngdoc property
             * @name Models.ViewDefinition#fields
             * @propertyOf Models.ViewDefinition
             * @description An array of links to fields
             */
            this.fields = json.fields;
        }

        /**
         * @ngdoc property
         * @name Models.ViewDefinition#fieldsMap
         * @propertyOf Models.ViewDefinition
         * @description Map from urns to fields that have been loaded
         */
        this.fieldsMap = new Map();

        /**
         * @ngdoc property
         * @name Models.ViewDefinition#fieldsMap
         * @propertyOf Models.ViewDefinition
         * @description Sorted array of loaded fields
         */
        this.fieldsArray = [];

        /**
         * @ngdoc property
         * @name Models.ViewDefinition#json
         * @propertyOf Models.ViewDefinition
         * @description the raw json payload
         */
        this.json = json;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinition#getLink
     * @methodOf Models.ViewDefinition
     * @description The link of the view definition
     */
    getLink() {
        return this.__self__.link;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinition#getUrn
     * @methodOf Models.ViewDefinition
     * @description The Urn of the view definition
     */
    getUrn() {
        return this.__self__.urn;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinition#getName
     * @methodOf Models.ViewDefinition
     * @description The name of the view definition
     */
    getTitle() {
        return this.name;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinition#isDefaultView
     * @methodOf Models.ViewDefinition
     * @description Boolean marking if this view is the default view
     */
    isDefaultView() {
        return this.isDefault;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinition#hasAttachmentField
     * @methodOf Models.ViewDefinition
     * @description tells us whether or not this view definition has attachment.
     *
     * @returns {Boolean} true or false based on the presence of attachment.
     */
    hasAttachmentField() {
        return this.getFields().some((field) => {
            return field.getFieldSemantics() === BomUIFieldSemantics.ATTACHMENTS;
        });
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinition#getFieldWithSemantics
     * @methodOf Models.ViewDefinition
     * @description gets a field from the ViewDefinition with a given
     * semantics.
     *
     * @param {String} `semantics` the semantics of the field we are
     * looking for.
     *
     * @returns {ViewDefinitionField} instance of ViewDefinitionField.
     */
    getFieldWithSemantics(semantics) {
        return this.getFields().find((field) => {
            return field.getFieldSemantics() === semantics;
        });
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinition#getId
     * @methodOf Models.ViewDefinition
     * @description The id of the view
     */
    getId() {
        return this.id;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinition#getField
     * @methodOf Models.ViewDefinition
     * @description Returns the field corresponding to urn
     */
    getField(urn) {
        return this.fieldsMap.get(urn);
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinition#getFields
     * @methodOf Models.ViewDefinition
     * @description Returns the fields of the view that have been loaded as a sorted list,
     *    Ordered by their display order
     */
    getFields() {
        return this.fieldsArray;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinition#getFieldsMap
     * @methodOf Models.ViewDefinition
     * @description Returns the fields of the view as a map
     */
    getFieldsMap() {
        return this.fieldsMap;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinition#getEdgeFields
     * @methodOf Models.ViewDefinition
     * @description Returns the fields of the view that are edge fields
     *     Will return null until the fields are loaded
     */
    getEdgeFields() {
        return this.getFields().filter((field) => {
            return field.isBomField();
        });
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinition#getNodeFields
     * @methodOf Models.ViewDefinition
     * @description Returns the fields of the view that are node fields
     *     Will return null until the fields are loaded
     */
    getNodeFields() {
        return this.getFields().filter((field) => {
            return !field.isBomField();
        });
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinition#loadFields
     * @methodOf Models.ViewDefinition
     * @description Method to load the actual information for all the fields
     *
     * @returns {Promise} a promise that will resolve when all the fields have loaded
     */
    loadFields() {
        let deferred = ViewDefinition.$q.defer();

        let expectedFieldsCount = this.fields.length;

        let checkCompleted = () => {
            if (this.fieldsArray.length === expectedFieldsCount) {
                this.fieldsArray.sort((f1, f2) => {
                    return f1.getDisplayOrder() - f2.getDisplayOrder();
                });
                deferred.resolve();
            }
        };

        this.fields.forEach((field) => {
            let urn = ViewDefinition.UrnParser.encode(field.urn);
            let responseMessage = ViewDefinition.BomMessageService.getViewDefFieldRecievedMessage(urn);
            let viewDefFieldListenerId = ViewDefinition.EventService.listen(responseMessage, (event, viewDefField) => {
                ViewDefinition.EventService.unlisten(viewDefFieldListenerId);

                this.fieldsMap.set(viewDefField.getUrn(), viewDefField);
                this.fieldsArray.push(viewDefField);
                checkCompleted();
            });
            ViewDefinition.EventService.send(ViewDefinition.BomMessageService.getViewDefFieldGetMessage(urn), field.link.replace(/^\//, ''));
        });

        return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinition#fetch
     * @methodOf Models.ViewDefinition
     * @description static method to load the view
     *
     * @param {String} link The URL to use for fetching the data
     * @param {Object} params parametrs to send with the GET
     *
     * @returns {ViewDefinition} An object representation of the formatted data
     */
    static fetch(link, params) {
        let model = null;
        return ViewDefinition.RESTWrapperService.get(link, null, params, {
            skipCache: true
        }).then(function (payload) {
            model = new ViewDefinition(payload);
            return model.loadFields();
        }).then(() => {
            return model;
        });
    }
}

let ViewDefinitionFactory = ($q, RESTWrapperService, EventService, UrnParser, BomMessageService) => {
    ViewDefinition.$q = $q;
    ViewDefinition.RESTWrapperService = RESTWrapperService;
    ViewDefinition.EventService = EventService;
    ViewDefinition.UrnParser = UrnParser;
    ViewDefinition.BomMessageService = BomMessageService;

    return ViewDefinition;
};

export default angular.module(__moduleName, []).factory('ViewDefinition', ['$q', 'RESTWrapperService', 'EventService', 'UrnParser', 'BomMessageService', ViewDefinitionFactory]);
