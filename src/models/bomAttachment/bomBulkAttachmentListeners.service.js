/**
 * @ngdoc object
 * @name Models.BomBulkAttachmentListeners
 * @description A class that registers the listeners for interacting with the
 *  BomBulkAttachment endpoint
 */
class BomBulkAttachmentListeners {

    /**
     * @ngdoc method
     * @name Models.BomBulkAttachmentListeners#constructor
     * @methodOf Models.BomBulkAttachmentListeners
     * @description Registers the listeners
     */
    constructor(BomMessageService, EventService, BomBulkAttachment) {
        this.BomMessageService = BomMessageService;
        this.EventService = EventService;
        this.BomBulkAttachment = BomBulkAttachment;

        this.getListener = this.registerGetListener();
    }

    /**
     * @ngdoc method
     * @name Models.BomBulkAttachmentListeners#registerGetListener
     * @methodOf Models.BomBulkAttachmentListeners
     * @description Registers the get listener
     *	recieves 'BomBulkAttachment:(id):get' (where (id) is anything),
     *		with a link to get, and any needed parameters
     * @returns {String} the unique id of the listener
     */
    registerGetListener() {
        return this.EventService.listen('bomBulkAttachment:*:get', (event, ...args) => {
            this.respondToGetListener(event, ...args);
        });
    }

    /**
     * @ngdoc method
     * @name Models.BomBulkAttachmentListeners#respondToGetListener
     * @methodOf Models.BomBulkAttachmentListeners
     * @description response function for the get listener
     *	Requests that BomBulkAttachment fetch the provided link with the provided parameters
     *	Then sends 'bomBulkAttachment:(id):done' (where (id) matches the id portion of event (i.e. 'bomBulkAttachment:(id):get'))
     *		with an instance of BomBulkAttachment
     * @param {String} `event` the actual event that occured
     * @param {String} `link` a link to get the BomBulkAttachment
     * @param {Object} `params` extra parameters for the get
     */
    respondToGetListener(event, itemUrnList, link, params) {
        this.BomBulkAttachment.fetch(itemUrnList.list, link, params).then((response) => {
            this.EventService.send(this.BomMessageService.getBulkAttachmentRecivedMessage(this.BomMessageService.extractEventId(event)), response);
        });
    }
}

BomBulkAttachmentListeners.$inject = ['BomMessageService', 'EventService', 'BomBulkAttachment'];

export default BomBulkAttachmentListeners;
