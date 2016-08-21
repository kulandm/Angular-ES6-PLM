/**
 * @ngdoc object
 * @name Models.ViewDefinitionsListeners
 * @description A class that registers the listeners
 *		for interacting with the BomViews endpoint
 */
class ViewDefinitionsListeners {

	/**
	 * @ngdoc method
	 * @name Models.ViewDefinitionsListeners#constructor
	 * @methodOf Models.ViewDefinitionsListeners
	 * @description Registers the listeners
	 */
	constructor(ViewDefinitions, BomMessageService, EventService) {
		this.ViewDefinitions = ViewDefinitions;
		this.BomMessageService = BomMessageService;
		this.EventService = EventService;

        // Register Listeners
        this.getListener = this.registerGetListener();
	}

    /**
	 * @ngdoc method
	 * @name Models.ViewDefinitionsListeners#registerGetListener
	 * @methodOf Models.ViewDefinitionsListeners
	 * @description Registers the get listener
	 *	recieves 'viewDefinitions:(wsId):get',
     *      witha a link to the view definitions
	 * @returns {String} the unique id of the listener
	 */
	registerGetListener() {
		// Listen for viewDefinitions when this needs to be used
		return this.EventService.listen('viewDefinitions:*:get', (event, ...args) => {
			this.respondToGetListener(event, ...args);
		});
	}

    /**
	 * @ngdoc method
	 * @name Models.ViewDefinitionsListeners#respondToGetListener
	 * @methodOf Models.ViewDefinitionsListeners
	 * @description response function for the get listener
	 *	Requests that ViewDefinitions fetch the all the views for the given workspace
	 *	Then sends 'viewDefinitions:(wsId):done'
	 *		with an instance of ViewDefinitions
     * @param {Object} event the event that was sent to request the view definitions
	 * @param {String} viewDefsLink the link to the view definitions
	 * @param {Array} args any other parameters for getting the view definitions
	 */
    respondToGetListener(event, viewDefsLink, ...args) {
        this.ViewDefinitions.fetch(viewDefsLink, args).then((obj) => {
            this.EventService.send(this.BomMessageService.getViewDefinitionsReceivedMessage(event.split(':')[1]), obj);
        });
    }
}

export default angular.module(__moduleName, []).service('ViewDefinitionsListeners', ['ViewDefinitions', 'BomMessageService', 'EventService', ViewDefinitionsListeners]);
