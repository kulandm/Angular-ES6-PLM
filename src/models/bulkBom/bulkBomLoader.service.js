/**
 * @ngdoc object
 * @name Models.BulkBomLoader
 * @description A service that is used to load the BulkBom.
 */
class BulkBomLoader {

  /**
   * @ngdoc method
   * @name Models.BulkBomLoader#constructor
   * @methodOf Models.BulkBomLoader
   * @description Intializes the service object.
   */
  constructor(BomMessageService, EventService, BulkBom, $q, UrnParser) {
    this.BomMessageService = BomMessageService;
    this.EventService = EventService;
    this.BulkBom = BulkBom;
    this.$q = $q;
    this.UrnParser = UrnParser;
  }

  /**
   * @ngdoc method
   * @name Models.BulkBomLoader#loadBulkBom
   * @methodOf Models.BulkBomLoader
   * @description makes a request for a Bulkbom using the `bulkBomEndPointLink` and
   * `queryParameters`.
   *
   * @param {String} `eventId` The unique id that will be used to broadcast the
   * request for loading the BulkBom. (We are using the urn of item).
   * @param {String} `bulkBomEndPointLink` the endpoint link for the bulk bom.
   * @param {Object} `queryParameters` the parameters that needs to be passed to the
   * endpoint in order to make the request properly.
   *
   * @returns {Promise} A promise that eventually resolves to the fetched BulkBom.
   */
  loadBulkBom(eventId, bulkBomEndPointLink, queryParameters = {}) {
    let deferredObj = this.$q.defer();
    eventId = this.UrnParser.encode(eventId);
    
    let fetchCompleteMessage = this.BomMessageService.getBulkBomFetchedSuccessMessage(eventId);
    let bulkBomLoaderListenerId = this.EventService.listen(fetchCompleteMessage, (event, bulkBomObj) => {
      this.EventService.unlisten(bulkBomLoaderListenerId);
      deferredObj.resolve(bulkBomObj);
    });

    this.requestForBulkBom(eventId, bulkBomEndPointLink, queryParameters);

    return deferredObj.promise;
  }

  /**
   * @ngdoc method
   * @name Models.BulkBomLoader#requestForBulkBom
   * @methodOf Models.BulkBomLoader
   * @description Will send message requesting for getting the `BulkBom` using
   * the `queryParameters` and `itemId`.
   *
   * @param {String} `eventId` The unique id that will be used to broadcast the
   * request for loading the BulkBom. (We are using the urn of item).
   * @param {String} `itemId` the bulk bom endpoint link.
   * @param {Object} `queryParameters` the query parameters to be sent to the
   * end point.
   */
  requestForBulkBom(eventId, bulkBomEndPointLink, queryParameters) {
    this.EventService.send(`bulkBom:${eventId}:get`, bulkBomEndPointLink, queryParameters);
  }
}

export default angular.module(__moduleName, []).service('BulkBomLoader', ['BomMessageService', 'EventService', 'BulkBom', '$q', 'UrnParser', BulkBomLoader]);
