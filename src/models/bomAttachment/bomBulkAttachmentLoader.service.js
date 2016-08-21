/**
 * @ngdoc object
 * @name Models.BomBulkAttachmentLoader
 * @description Service for loading bom attachments using the Bulk api.
 */
class BomBulkAttachmentLoader {

    /**
     * @ngdoc method
     * @name Models.BomBulkAttachmentLoader#constructor
     * @methodOf Models.BomBulkAttachmentLoader
     * @description Intializes the service object.
     */
    constructor(BomMessageService, EventService, $q) {
        this.BomMessageService = BomMessageService;
        this.EventService = EventService;
        this.$q = $q;
    }

    /**
     * @ngdoc method
     * @name Models.BomBulkAttachmentLoader#loadBulkAttachment
     * @methodOf Models.BomBulkAttachmentLoader
     * @description makes a request for a Bulkbom using the `bulkBomEndPointLink` and
     * `queryParameters`.
     *
     * @param {Array} `urnList` an array of item urns whose attachments will be fetched.
     * @param {String} `attachmentsEndPoint` the endpoint link for attachments.
     * @param {Object} `queryParameters` the parameters that needs to be passed to the
     * endpoint in order to make the request properly.
     *
     * @returns {Promise} A promise that eventually resolves to the fetched BulkBom.
     */
    loadBulkAttachment(urnList, attachmentsEndPoint, queryParameters) {
        let deferredObj = this.$q.defer();
        let eventId = this.buildEventId(urnList);
        let attachMentsReievedMessage = this.BomMessageService.getBulkAttachmentRecivedMessage(eventId);
        let attachmentsListenerId = this.EventService.listen(attachMentsReievedMessage, (event, bomAttachmentsObj) => {
            this.EventService.unlisten(attachmentsListenerId);
            deferredObj.resolve(bomAttachmentsObj);
        });

        this.requestForAttachments(eventId, urnList, attachmentsEndPoint, queryParameters);

        return deferredObj.promise;
    }

    /**
     * @ngdoc method
     * @name Models.BomBulkAttachmentLoader#requestForAttachments
     * @methodOf Models.BomBulkAttachmentLoader
     * @description Will send message requesting for getting the `BomAttachments`.
     *
     * @param {String} `eventId` uniquely identifies this message.
     * @param {Array} `urnList` an array of item urns whose attachments will be fetched.
     * @param {String} `attachmentsEndPoint` the endpoint link for attachments.
     * @param {Object} `queryParameters` the query parameters to be sent to the end point.
     */
    requestForAttachments(eventId, urnList, attachmentsEndPoint, queryParameters) {
        let urnListObj = {
            list: urnList
        };
        this.EventService.send(`bomBulkAttachment:${eventId}:get`, urnListObj, attachmentsEndPoint, queryParameters);
    }

    /**
     * @ngdoc method
     * @name Models.BomBulkAttachmentLoader#buildEventId
     * @methodOf Models.BomBulkAttachmentLoader
     * @description Builds an event id using all the dms ids from
     * the `urnList`.
     *
     * @param {Array} `urnList` A list of item urns.
     *
     * @returns {String} Can be used as an event id.
     */
    buildEventId(urnList = []) {
		return urnList.map((urn) => urn.split('.').pop()).join(',');
    }
}

BomBulkAttachmentLoader.$inject = ['BomMessageService', 'EventService', '$q'];

export default BomBulkAttachmentLoader;
