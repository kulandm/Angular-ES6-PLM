/**
 * @ngdoc object
 * @name Models.ViewDefinitionListeners
 * @description A class that registers the listeners
 *		for interacting with the BomView endpoint
 */
class ViewDefinitionListeners {

	/**
	 * @ngdoc method
	 * @name Models.ViewDefinitionListeners#constructor
	 * @methodOf Models.ViewDefinitionListeners
	 * @description Registers the listeners
	 */
	constructor(ViewDefinition, BomMessageService, EventService) {
		this.ViewDefinition = ViewDefinition;
		this.BomMessageService = BomMessageService;
		this.EventService = EventService;

        // Register Listeners
        this.getListener = this.registerGetListener();
	}

    /**
	 * @ngdoc method
	 * @name Models.ViewDefinitionListeners#registerGetListener
	 * @methodOf Models.ViewDefinitionListeners
	 * @description Registers the get listener
	 *	recieves 'viewDefinition:(urn):get',
     *      witha a link to the view definition
	 * @returns {String} the unique id of the listener
	 */
	registerGetListener() {
		// Listen for viewDefinition when this needs to be used
		return this.EventService.listen('viewDefinition:*:get', (event, ...args) => {
			this.respondToGetListener(event, ...args);
		});
	}

    /**
	 * @ngdoc method
	 * @name Models.ViewDefinitionsListeners#respondToGetListener
	 * @methodOf Models.ViewDefinitionsListeners
	 * @description response function for the get listener
	 *	Requests that ViewDefinition fetch the the views for the given workspace
	 *	Then sends 'viewDefinition:(wsId):done'
	 *		with an instance of ViewDefinition
     * @param {Object} event the event that was sent to request the view definition
	 * @param {String} viewDefLink the link to the view definition
	 * @param {Array} args any other parameters for getting the view definition
	 */
    respondToGetListener(event, viewDefLink, ...args) {
        this.ViewDefinition.fetch(viewDefLink, args).then((obj) => {
			this.EventService.send(this.BomMessageService.getViewDefinitionReceivedMessage(event.split(':')[1]), obj);
        });
    }
}

export default angular.module(__moduleName, []).service('ViewDefinitionListeners', ['ViewDefinition', 'BomMessageService', 'EventService', ViewDefinitionListeners]);
