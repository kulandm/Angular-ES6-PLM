/**
 * @ngdoc object
 * @name Models.BomRootListeners
 * @description A class that registers the listeners
 *		for interacting with the BomRoot REST services
 *	We use class syntax for convinience, but all the work is done in the constructor,
 *		where we register the needed listeners with EventService
 */
class BomRootListeners {

	/**
	 * @ngdoc method
	 * @name Models.BomRootListeners#constructor
	 * @methodOf Models.BomRootListeners
	 * @description Registers the listeners
	 */
	constructor(BomRoot, BomMessageService, EventService) {
		this.BomRoot = BomRoot;
		this.BomMessageService = BomMessageService;
		this.EventService = EventService;

        // Register Listeners
        this.getListener = this.registerGetListener();
	}

    /**
	 * @ngdoc method
	 * @name Models.BomRootListeners#registerGetListener
	 * @methodOf Models.BomRootListeners
	 * @description Registers the get listener
	 *	recieves 'bomRoot:(id):get' (where (id) is anything),
	 *		with a link to get, and any needed parameters
	 * @returns {String} the unique id of the listener
	 */
	registerGetListener() {
		return this.EventService.listen('bomRoot:*:get', (event, ...args) => {
			this.respondToGetListener(event, ...args);
		});
	}

    /**
	 * @ngdoc method
	 * @name Models.BomRootListeners#respondToGetListener
	 * @methodOf Models.BomRootListeners
	 * @description response function for the get listener
	 *	Requests that BomRoot fetch the provided link with the provided parameters
	 *	Then sends 'bomRoot:(id):done' (where (id) matches the id portion of event (i.e. 'bomRoot:(id):get'))
	 *		with an instance of BomRoot
	 * @param {String} event the actual event that occured
	 * @param {String} link a link to get
	 * @param {Object} params extra parameters for the get
	 */
    respondToGetListener(event, eventId, params) {
        this.BomRoot.fetch(eventId, params).then((obj) => {
            this.EventService.send(this.BomMessageService.getBomTopLineReceivedMessage(this.BomMessageService.extractEventId(event)), obj);
        });
    }
}

export default angular.module(__moduleName, []).service('BomRootListeners', ['BomRoot', 'BomMessageService', 'EventService', BomRootListeners]);
