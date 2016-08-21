/**
 * @ngdoc object
 * @name Models.BomNestedItemListeners
 * @description A class that registers the listeners
 *		for interacting with the BomNestedItem REST services
 *	We use class syntax for convinience, but all the work is done in the constructor,
 *		where we register the needed listeners with EventService
 */
class BomNestedItemListeners {

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItemListeners#constructor
	 * @methodOf Models.BomNestedItemListeners
	 * @description Registers the listeners
	 */
	constructor(BomNestedItem, BomMessageService, EventService, UrlParser) {
		this.BomNestedItem = BomNestedItem;
		this.BomMessageService = BomMessageService;
		this.EventService = EventService;
		this.UrlParser = UrlParser;

		this.getListener = this.registerGetListener();
		this.addListener = this.registerAddListener();
		this.editListener = this.registerEditListener();
		this.deleteListener = this.registerDeleteListener();
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItemListeners#registerGetListener
	 * @methodOf Models.BomNestedItemListeners
	 * @description Registers the get listener
	 *	recieves 'bomNestedItem:(id):get' (where (id) is anything),
	 *		with a link to get, and any needed parameters
	 * @returns {String} the unique id of the listener
	 */
	registerGetListener() {
		return this.EventService.listen('bomNestedItem:*:get', (event, ...args) => {
			this.respondToGetListener(event, ...args);
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItemListeners#respondToGetListener
	 * @methodOf Models.BomNestedItemListeners
	 * @description response function for the get listener
	 *	Requests that BomNestedItem fetch the provided link with the provided parameters
	 *	Then sends 'bomNestedItem:(id):done' (where (id) matches the id portion of event (i.e. 'bomNestedItem:(id):get'))
	 *		with an instance of BomNestedItem
	 * @param {String} event the actual event that occured
	 * @param {String} link a link to get
	 * @param {Object} params extra parameters for the get
	 */
	respondToGetListener(event, link, params) {
		this.BomNestedItem.fetch(link, params).then((obj) => {
			this.EventService.send(this.BomMessageService.getBomNestedItemFetchSuccessMessage(this.BomMessageService.extractEventId(event)), obj);
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItemListeners#registerAddListener
	 * @methodOf Models.BomNestedItemListeners
	 * @description Registers the add listener
	 *	recieves 'bomNestedItem:(id):add' (where (id) is anything),
	 *		with a link to post to, the json of the item to post, and the configuration of the BOM
	 * @returns {String} the unique id of the listener
	 */
	registerAddListener() {
		return this.EventService.listen('bomNestedItem:*:add', (event, ...args) => {
			this.respondToAddListener(event, ...args);
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItemListeners#respondToAddListener
	 * @methodOf Models.BomNestedItemListeners
	 * @description Response function for the add listener
	 *	Requests that BomNestedItem post the json to link
	 *	Then
	 *		if the add succeeds, responds with 'bomNestedItem:(id):addDone' (where (id) matches the id portion of event (i.e. 'bomNestedItem:(id):add'))
	 *			with an instance of BomNestedItem
	 *		 if the add fails, responds with 'bomNestedItem:(id):addFailed' (where (id) matches the id portion of event (i.e. 'bomNestedItem:(id):add'))
	 *			with an instance of BomNestedItem with information provided by json (not corresponding to an actual item in the BOM), and an error object
	 * @param {String} event the actual event that occured
	 * @param {String} link the link to post to
	 * @param {Object} json the json to post
	 * @param {Object} configuration the configuration of the BOM
	 *
	 */
	respondToAddListener(event, link, json, configuration) {
		let model = new this.BomNestedItem(json);
		this.BomNestedItem.add(link, model).then((response) => {
			let url = this.UrlParser.parse(response.location).pathname.replace(/^\//, '');
			this.BomNestedItem.fetch(url, configuration).then((obj) => {
				this.EventService.send(this.BomMessageService.getBomChangeSuccessMessage('add', this.BomMessageService.extractEventId(event)), obj);
			});
		}, (error) => {
			this.EventService.send(this.BomMessageService.getBomChangeFailureMessage('add', this.BomMessageService.extractEventId(event)), error);
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItemListeners#registerEditListener
	 * @methodOf Models.BomNestedItemListeners
	 * @description Registers the edit listener
	 *	recieves 'bomNestedItem:(id):edit' (where (id) is anything),
	 *		with the json content of the patch
	 * @returns {String} the unique id of the listener
	 */
	registerEditListener() {
		return this.EventService.listen('bomNestedItem:*:edit', (event, ...args) => {
			this.respondToEditListener(event, ...args);
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItemListeners#respondToEditListener
	 * @methodOf Models.BomNestedItemListeners
	 * @description Response function for the edit listener
	 *	Requests that BomNestedItem patch the json to link
	 *	Then
	 *		if the edit succeeds, responds with 'bomNestedItem:(id):editDone' (where (id) matches the id portion of event (i.e. 'bomNestedItem:(id):edit'))
	 *		if the edit fails, responds with 'bomNestedItem:(id):editFailed' (where (id) matches the id portion of event (i.e. 'bomNestedItem:(id):edit'))
	 *			with the error
	 * @param {String} event the actual event that occured
	 * @param {Object} json the json to patch
	 */
	respondToEditListener(event, json) {
		let model = new this.BomNestedItem(json);
		this.BomNestedItem.edit(model).then((response) => {
			this.EventService.send(this.BomMessageService.getBomChangeSuccessMessage('edit', this.BomMessageService.extractEventId(event)));
		}, (error) => {
			this.EventService.send(this.BomMessageService.getBomChangeFailureMessage('edit', this.BomMessageService.extractEventId(event)), error);
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItemListeners#registerDeleteListener
	 * @methodOf Models.BomNestedItemListeners
	 * @description Registers the delete listener
	 *	recieves 'bomNestedItem:(id):remove' (where (id) is anything),
	 *		with the json content of the delete (minimally including the __self__ link)
	 * @returns {String} the unique id of the listener
	 */
	registerDeleteListener() {
		return this.EventService.listen('bomNestedItem:*:remove', (event, ...args) => {
			this.respondToDeleteListener(event, ...args);
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItemListeners#respondToDeleteListener
	 * @methodOf Models.BomNestedItemListeners
	 * @description Response function for the delete listener
	 *	Requests that BomNestedItem delete the item corresponding to json
	 *	Then
	 *		if the delete succeeds, responds with 'bomNestedItem:(id):removeDone' (where (id) matches the id portion of event (i.e. 'bomNestedItem:(id):remove'))
	 *		if the delete fails, responds with 'bomNestedItem:(id):removeFailed' (where (id) matches the id portion of event (i.e. 'bomNestedItem:(id):remove'))
	 *			with the error
	 * @param {String} event the actual event that occured
	 * @param {Object} json the json to delete
	 */
	respondToDeleteListener(event, json) {
		let model = new this.BomNestedItem({
			__self__: json.__self__
		});
		this.BomNestedItem.delete(model).then((response) => {
			this.EventService.send(this.BomMessageService.getBomChangeSuccessMessage('remove', this.BomMessageService.extractEventId(event)));
		}, (error) => {
			this.EventService.send(this.BomMessageService.getBomChangeFailureMessage('remove', this.BomMessageService.extractEventId(event)), error);
		});
	}
}

export default angular.module(__moduleName, []).service('BomNestedItemListeners', ['BomNestedItem', 'BomMessageService', 'EventService', 'UrlParser', BomNestedItemListeners]);
