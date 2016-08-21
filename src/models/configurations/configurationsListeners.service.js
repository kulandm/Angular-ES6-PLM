/**
 * @ngdoc object
 * @name Models.ConfigurationsListeners
 * @description A class that registers the listeners
 *		for interacting with the Configurations REST services
 *	We use class syntax for convinience, but all the work is done in the constructor,
 *		where we register the needed listeners with EventService
 */
class ConfigurationsListeners {
    /**
	 * @ngdoc method
	 * @name Models.ConfigurationsListeners#constructor
	 * @methodOf Models.ConfigurationsListeners
	 * @description Registers the listeners
	 */
    constructor(EventService, Configurations) {
        this.EventService = EventService;
        this.Configurations = Configurations;

        this.getListener = this.registerGetListener();
	}

	/**
	 * @ngdoc method
	 * @name Models.ConfigurationsListeners#registerGetListener
	 * @methodOf Models.ConfigurationsListeners
	 * @description Registers the get listener
	 *	recieves 'configurations:(id):get' (where (id) is anything),
	 *		with a link to get, and any needed parameters
	 * @returns {String} the unique id of the listener
	 */
	registerGetListener() {
		return this.EventService.listen('configurations:*:get', (event, ...args) => {
			this.respondToGetListener(event, ...args);
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.ConfigurationsListeners#respondToGetListener
	 * @methodOf Models.ConfigurationsListeners
	 * @description response function for the get listener
	 *	Requests that Configurations fetch the provided link with the provided parameters
	 *	Then sends 'configurations:(id):done' (where (id) matches the id portion of event (i.e. 'configurations:(id):get'))
	 *		with an instance of Configurations
	 * @param {String} event the actual event that occured
	 * @param {String} link a link to get
	 * @param {Object} params extra parameters for the get
	 */
	respondToGetListener(event, link, params) {
		this.Configurations.fetch(link, params).then((obj) => {
			this.EventService.send(`configurations:${event.split(':')[1]}:done`, obj);
		});
	}
}

ConfigurationsListeners.$inject = ['EventService', 'Configurations'];

export default ConfigurationsListeners;
