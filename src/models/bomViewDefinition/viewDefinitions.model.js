'use strict';

/**
 * @ngdoc object
 * @name Models.ViewDefinitions
 *
 * @description This class wraps ViewDefinitions payload into an object
 */
class ViewDefinitions {
    /**
     * @ngdoc method
     * @name Models.ViewDefinitions#constructor
     * @methodOf Models.ViewDefinitions
     * @description The instance constructor
     */
    constructor(json) {
        if (json) {
            /**
             * @ngdoc property
             * @name Models.ViewDefinitions#__self__
             * @propertyOf Models.ViewDefinitions
             * @description the __self__ object, holding link and urn
             */
            this.__self__ = json.__self__;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitions#count
             * @propertyOf Models.ViewDefinitions
             * @description the number of views
             */
            this.count = json.count;

            /**
             * @ngdoc property
             * @name Models.ViewDefinitions#bomViews
             * @propertyOf Models.ViewDefinitions
             * @description The list of links and urns to views
             */
            this.bomViews = json.bomViews;
        }

        /**
         * @ngdoc property
         * @name Models.ViewDefinitions#viewsMap
         * @propertyOf Models.ViewDefinitions
         * @description Container for the views that will be loaded
         */
        this.viewsMap = new Map();

        /**
         * @ngdoc property
         * @name Models.ViewDefinitions#json
         * @propertyOf Models.ViewDefinitions
         * @description The json payload
         */
        this.json = json;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitions#getLink
     * @methodOf Models.ViewDefinitions
     * @description The link of the view definitions
     */
    getLink() {
        return this.__self__.link;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitions#getUrn
     * @methodOf Models.ViewDefinitions
     * @description The Urn of the view definitions
     */
    getUrn() {
        return this.__self__.urn;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitions#getCount
     * @methodOf Models.ViewDefinitions
     * @description The number of views
     */
    getCount() {
        return this.count;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitions#getViews
     * @methodOf Models.ViewDefinitions
     * @description The actual views
     *     Will be null until loadViews has been called and has completed loading
     */
    getViews() {
        let views = [];
        this.bomViews.forEach((view) => {
            if (this.viewsMap.has(view.urn)) {
                views.push(this.viewsMap.get(view.urn));
            }
        });

        return views;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitions#getViewsMap
     * @methodOf Models.ViewDefinitions
     * @description  getter function for the map that was used to store the views
     * that were returned by end point.
     *
     * @returns {object} a javascript map object containing all the views.
     */
    getViewsMap() {
        return this.viewsMap;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitions#getDefaultView
     * @methodOf Models.ViewDefinitions
     * @description Returns the default view
     *     Will be null until loadViews has been called and has completed loading
     * @returns {viewDefinition} the view that is the default view
     */
    getDefaultView() {
        let defaultView = null;
        this.getViewsMap().forEach((view, key) => {
            if (view.isDefaultView()) {
                defaultView = view;
            }
        });

        return defaultView;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitions#find
     * @methodOf Models.ViewDefinitions
     * @description Returns the view corresponding to id
     *     Will be null until loadViews has been called and has completed loading
     * @returns {viewDefinition} the view with id 'id'
     */
    find(id) {
        let foundView = null;
        this.getViewsMap().forEach((view, key) => {
            if (view.getId() === id) {
                foundView = view;
            }
        });
        return foundView;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitions#loadViews
     * @methodOf Models.ViewDefinitions
     * @description Method to load the actual information for all the views
     *
     * @returns {Promise} a promise that will resolve when all the views have loaded
     */
    loadViews() {
        let deferred = ViewDefinitions.$q.defer();
        let expectedViewsCount = this.bomViews.length;

        let checkCompleted = () => {
            if (this.viewsMap.size === expectedViewsCount) {
                deferred.resolve();
            }
        };

        this.bomViews.forEach((view) => {
            let urn = ViewDefinitions.UrnParser.encode(view.urn);
            let responseMessage = ViewDefinitions.BomMessageService.getViewDefinitionReceivedMessage(urn);
            let viewDefListenerId = ViewDefinitions.EventService.listen(responseMessage, (event, viewDef) => {
                ViewDefinitions.EventService.unlisten(viewDefListenerId);

                this.viewsMap.set(viewDef.getUrn(), viewDef);
                checkCompleted();
            });
            ViewDefinitions.EventService.send(ViewDefinitions.BomMessageService.getViewDefinitionGetMessage(urn), view.link.replace(/^\//, ''));
        });

        return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitions#buildViewStorageKey
     * @methodOf Models.ViewDefinitions
     * @description Builds a key for storing view definition information based on workspace
     *
     * @returns {String} a key
     */
    buildViewStorageKey(wsId) {
        return `workspace:${wsId}_bomView`;
    }

    /**
     * @ngdoc method
     * @name Models.ViewDefinitions#fetch
     * @methodOf Models.ViewDefinitions
     * @description static method to load the view
     *
     * @param {String} link The URL to use for fetching the data
     * @param {Object} params parametrs to send with the GET
     *
     * @returns {ViewDefinitions} An object representation of the formatted data
     */
    static fetch(link, params) {
        let model = null;
        return ViewDefinitions.RESTWrapperService.get(link, null, params, {
            skipCache: true
        }).then((payload) => {
            model = new ViewDefinitions(payload);
            return model.loadViews();
        }).then(() => {
            return model;
        });
    }
}

let ViewDefinitionsFactory = ($q, RESTWrapperService, EventService, UrnParser, BomMessageService) => {
    ViewDefinitions.$q = $q;
    ViewDefinitions.RESTWrapperService = RESTWrapperService;
    ViewDefinitions.EventService = EventService;
    ViewDefinitions.UrnParser = UrnParser;
    ViewDefinitions.BomMessageService = BomMessageService;

    return ViewDefinitions;
};

export default angular.module(__moduleName, []).factory('ViewDefinitions', ['$q', 'RESTWrapperService', 'EventService', 'UrnParser', 'BomMessageService', ViewDefinitionsFactory]);
