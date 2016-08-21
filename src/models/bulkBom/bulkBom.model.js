/**
 * @ngdoc object
 * @name Models.BulkBom
 * @description The Dao for BulkBom
 */
class BulkBom {

    /**
     * @ngdoc method
     * @name Models.BulkBom#constructor
     * @methodOf Models.BulkBom
     * @description Initializes a BulkBom object with properties from the payload
     *
     * @param {Object} json the JSON payload for a BulkBom
     *
     */
    constructor(json) {
        if (json) {
            /**
             * @ngdoc property
             * @name Models.BulkBom#configuration
             * @propertyOf Models.BulkBom
             * @description The configuration for the BulkBom
             */
            this.configuration = (typeof json.config === 'undefined') ? null : json.config;

            /**
             * @ngdoc property
             * @name Models.BulkBom#nodes
             * @propertyOf Models.BulkBom
             * @description list of all the items in the bom
             */
            this.nodes = (typeof json.nodes === 'undefined') ? [] : json.nodes;

            /**
             * @ngdoc property
             * @name Models.BulkBom#edges
             * @propertyOf Models.BulkBom
             * @description list of all the items in the bom
             */
            this.edges = (typeof json.edges === 'undefined') ? [] : json.edges;

            /**
             * @ngdoc property
             * @name Models.BulkBom#rootNodeId
             * @propertyOf Models.BulkBom
             * @description id of the root node (this is the urn of item).
             */
            this.rootNodeId = (typeof json.root === 'undefined') ? null : json.root;
        }

        /**
         * @ngdoc property
         * @name Models.BulkBom#json
         * @propertyOf Models.BulkBom
         * @description The raw payload as returned by the endpoint
         */
        this.json = json;
    }

    /**
     * @ngdoc method
     * @name Models.BulkBom#getConfiguration
     * @methodOf Models.BulkBom
     * @description Returns the configuration used to fetch the BOM
     *
     * @returns {Object} The configuration object.
     */
    getConfiguration() {
        return this.configuration;
    }

    /**
	 * @ngdoc method
	 * @name Models.BulkBom#getConfigDate
	 * @methodOf Models.BulkBom
	 * @description Returns the date corresponding to this BOM
	 *
	 * @returns {String} Date corresponding to this BOM
	 */
    getConfigDate() {
        return this.configuration.bomViewDate;
    }

    /**
	 * @ngdoc method
	 * @name Models.BulkBom#getConfigBias
	 * @methodOf Models.BulkBom
	 * @description Returns the bias for this Bom
	 *
	 * @returns {String} Bias for this BOM
	 */
    getConfigBias() {
        return this.configuration.bias;
    }

    /**
     * @ngdoc method
     * @name Models.BulkBom#getNodes
     * @methodOf Models.BulkBom
     * @description getter for all the Nodes in the BulkBom.
     *
     * @returns {Array} List of BOM nodes
     */
    getNodes() {
        return this.nodes;
    }

    /**
     * @ngdoc method
     * @name Models.BulkBom#getEdges
     * @methodOf Models.BulkBom
     * @description getter for all the Nodes in the BulkBom.
     *
     * @returns {Array} List of BOM edges.
     */
    getEdges() {
        return this.edges;
    }

    /**
     * @ngdoc method
     * @name Models.BulkBom#getRootNodeId
     * @methodOf Models.BulkBom
     * @description getter for all the root node id in the BulkBom.
     *
     * @returns {String} id the of the root node of the bulk bom.
     */
    getRootNodeId() {
        return this.rootNodeId;
    }

    /**
     * @ngdoc method
     * @name Models.BulkBom#getDmsId
     * @methodOf Models.BulkBom
     * @description Gets the dms id for the root
     *
     * @returns {String} The dms id for the root
     */
    getDmsId() {
        return this.rootNodeId.split('.').pop();
    }

    /**
     * @ngdoc method
     * @name Models.BulkBom#fetch
     * @methodOf Models.BulkBom
     * @description Makes a request to the end point `link` using the `params` in
     *	order to load the BulkBom.
     *
     * @param {String} link The URL to use for fetching the data
     * @param {Object} params parametrs to send with the GET
     *
     * @returns {Object} A Promise that may be resolved to get a an instance of
     * BulkBom .
     */
    static fetch(link, params = {}) {
        let requestHeaders = {
            Accept: 'application/vnd.autodesk.plm.bom.bulk+json',
            skipCache: true
        };

        return this.RESTWrapperService.get(link, null, params, null, requestHeaders).then((payload) => {
            return new BulkBom(payload);
        });
    }
}

/**
 * @ngdoc function
 * @name BulkBomFactory
 * @description Sets the injected services on the BulkBom Class object, then returns that object
 */
let BulkBomFactory = (BomMessageService, EventService, UrlParser, RESTWrapperService) => {
    BulkBom.BomMessageService = BomMessageService;
    BulkBom.EventService = EventService;
    BulkBom.UrlParser = UrlParser;
    BulkBom.RESTWrapperService = RESTWrapperService;

    return BulkBom;
};

export default angular.module(__moduleName, []).factory('BulkBom', ['BomMessageService', 'EventService', 'UrlParser', 'RESTWrapperService', BulkBomFactory]);
