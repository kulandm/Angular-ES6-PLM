/**
 * @ngdoc object
 * @name Models.BulkBomListeners
 * @description A class that registers the listeners for interacting with the
 *  BulkBom endpoint
 */
class BulkBomListeners {

	/**
	 * @ngdoc method
	 * @name Models.BulkBomListeners#constructor
	 * @methodOf Models.BulkBomListeners
	 * @description Registers the listeners
	 */
	constructor(BulkBom, BomMessageService, EventService) {
		this.BulkBom = BulkBom;
		this.BomMessageService = BomMessageService;
		this.EventService = EventService;
        this.getListener = this.registerGetListener();
	}

    /**
	 * @ngdoc method
	 * @name Models.BulkBomListeners#registerGetListener
	 * @methodOf Models.BulkBomListeners
	 * @description Registers the get listener
	 *	recieves 'bulkBom:(id):get' (where (id) is anything),
	 *		with a link to get, and any needed parameters
	 * @returns {String} the unique id of the listener
	 */
	registerGetListener() {
		return this.EventService.listen('bulkBom:*:get', (event, ...args) => {
			this.respondToGetListener(event, ...args);
		});
	}

    /**
	 * @ngdoc method
	 * @name Models.BulkBomListeners#respondToGetListener
	 * @methodOf Models.BulkBomListeners
	 * @description response function for the get listener
	 *	Requests that BulkBom fetch the provided link with the provided parameters
	 *	Then sends 'bulkBom:(id):done' (where (id) matches the id portion of event (i.e. 'bulkBom:(id):get'))
	 *		with an instance of BulkBom
	 * @param {String} `event` the actual event that occured
	 * @param {String} `link` a link to get the BulkBom
	 * @param {Object} `params` extra parameters for the get
	 */
    respondToGetListener(event, link, params) {
      this.BulkBom.fetch(link, params).then((response) => {
        this.EventService.send(this.BomMessageService.getBulkBomFetchedSuccessMessage(this.BomMessageService.extractEventId(event)), response);
      });
    }
}

export default angular.module(__moduleName, []).service('BulkBomListeners', ['BulkBom', 'BomMessageService', 'EventService', BulkBomListeners]);
