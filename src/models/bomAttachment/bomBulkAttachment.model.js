import BomAttachmentList from 'com/autodesk/models/bomAttachment/bomAttachmentList.model.js';

/**
 * @ngdoc object
 * @name Models.BomBulkAttachment
 * @description The Dao for BomBulkAttachment
 */
class BomBulkAttachment {

    /**
     * @ngdoc method
     * @name Models.BomBulkAttachment#constructor
     * @methodOf Models.BomBulkAttachment
     * @description Initializes a BomBulkAttachment object
     *
     * @param {Object} `json` the JSON payload for a BomBulkAttachment
     * @param {Object} `itemList` List of item urns.
     */
    constructor(json, itemList = []) {
        if (json) {
            /**
             * @ngdoc property
             * @name Models.BomBulkAttachment#attachmentLists
             * @propertyOf Models.BomBulkAttachment
             * @description a map(itemUrn -> BomAttachmentList) whose keys are the urn of the
             *item and values are instances of BomAttachmentList associated with that item.
             */
            this.attachmentLists = new Map();
            json.forEach((array) => {
                let newList = new BomAttachmentList(array, array[0].itemId);
                this.attachmentLists.set(newList.getItemId(), newList);
            });

            /**
             * @ngdoc property
             * @name Models.BomBulkAttachment#itemUrnList
             * @propertyOf Models.BomBulkAttachment
             * @description List of the item urns that were sent to the server to fetch
             * the attachments.
             */
            this.itemUrnList = itemList;
        }
        /**
         * @ngdoc property
         * @name Models.BomBulkAttachment#json
         * @propertyOf Models.BomBulkAttachment
         * @description The raw payload as returned by the endpoint
         */
        this.json = json;
    }

    /**
     * @ngdoc method
     * @name Models.BomBulkAttachment#getItemUrnList
     * @methodOf Models.BomBulkAttachment
     * @description getter for the item urn list.
     *
     * @returns {Array} list of item urns
     */
    getItemUrnList() {
        return this.itemUrnList;
    }

    /**
     * @ngdoc method
     * @name Models.BomBulkAttachment#getAttachmentLists
     * @methodOf Models.BomBulkAttachment
     * @description getter for the attachment lists
     *
     * @returns {Map} of BomAttachmentList
     */
    getAttachmentLists() {
        return this.attachmentLists;
    }

    /**
     * @ngdoc method
     * @name Models.BomBulkAttachment#fetch
     * @methodOf Models.BomBulkAttachment
     * @description Posts a list of item urns `itemUrnList` to the `attachmentsEndpoint`
     * and builds a BomBulkAttachment instance using the response returned from the post.
     *
     * @param {Array} `itemUrnList` List item urns whose attachments is to be fetched.
     * @param {String} `attachmentsEndpoint` the link to send the request to.
     * @param {Object} `params` any additional parameter that needs to be passed to the endpoint.
     *
     * @returns {Object} A Promise that may be resolved to get a an instance of
     * BomBulkAttachment .
     */
    static fetch(itemUrnList = [], attachmentsEndpoint, params = {}) {
        let requestHeaders = {
            'Content-Type': 'application/vnd.autodesk.plm.attachments.bulk+json',
            Accept: 'application/vnd.autodesk.plm.attachments.bulk+json',
            skipCache: true
        };
        return this.RESTWrapperService.post(itemUrnList, attachmentsEndpoint, null, null, requestHeaders).then((response) => {
            return new BomBulkAttachment(response, itemUrnList);
        });
    }
}

/**
 * @ngdoc function
 * @name BomBulkAttachmentFactory
 * @description Sets the injected services on the BomBulkAttachment Class object, then returns that object
 */
let BomBulkAttachmentFactory = (RESTWrapperService) => {
    BomBulkAttachment.RESTWrapperService = RESTWrapperService;

    return BomBulkAttachment;
};

BomBulkAttachmentFactory.$inject = ['RESTWrapperService'];

export default BomBulkAttachmentFactory;
