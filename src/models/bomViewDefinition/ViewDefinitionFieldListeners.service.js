/**
 * @ngdoc object
 * @name Models.ViewDefinitionFieldListeners
 * @description A class that registers the listeners
 *		for interacting with the Bom View Definition field endpoint
 */
class ViewDefinitionFieldListeners {

  /**
   * @ngdoc method
   * @name Models.ViewDefinitionFieldListeners#constructor
   * @methodOf Models.ViewDefinitionFieldListeners
   * @description Registers the listeners
   */
  constructor(ViewDefinitionField, BomMessageService, EventService) {
    this.ViewDefinitionField = ViewDefinitionField;
    this.BomMessageService = BomMessageService;
    this.EventService = EventService;

    this.getListener = this.registerGetListener();
  }

  /**
   * @ngdoc method
   * @name Models.ViewDefinitionFieldListeners#registerGetListener
   * @methodOf Models.ViewDefinitionFieldListeners
   * @description Registers the get listener recieves 'viewDefinitionField:(urn):get',
   * with a link to the view definition field
   *
   * @returns {String} the unique id of the listener
   */
  registerGetListener() {
    return this.EventService.listen('viewDefinitionField:*:get', (event, ...args) => {
      this.respondToGetListener(event, ...args);
    });
  }

  /**
   * @ngdoc method
   * @name Models.ViewDefinitionFieldListeners#respondToGetListener
   * @methodOf Models.ViewDefinitionFieldListeners
   * @description responds to the `event` by calling the fetch method of the
   * viewDefinitionField endpoint `viewDefFieldLink` with the parameters `args`.
   * Then sends'viewDefinitionField:(fieldId):done' message with an instance
   * of ViewDefinitionField
   *
   * @param {Object} event the event that was sent to request the view definition field
   * @param {String} viewDefFieldLink end point link for fetching the field
   * @param {Array} Other query parameters needed in order to make the call.
   */
  respondToGetListener(event, viewDefFieldLink, ...args) {
    this.ViewDefinitionField.fetch(viewDefFieldLink, args).then((viewDefField) => {
      this.EventService.send(this.BomMessageService.getViewDefFieldRecievedMessage(event.split(':')[1]), viewDefField);
    });
  }
}

export default angular.module(__moduleName, []).service('ViewDefinitionFieldListeners', ['ViewDefinitionField', 'BomMessageService', 'EventService', ViewDefinitionFieldListeners]);
