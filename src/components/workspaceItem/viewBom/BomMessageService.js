/**
 * @ngdoc object
 * @name Services.BomMessageService
 *
 * @description This service builds messages to send to and recieve from event service
 *
 */
class BomMessageService {

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#constructor
	 * @methodOf Services.BomMessageService
	 * @description The class constructor
	 */
	constructor() {

	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#extractEventId
	 * @methodOf Services.BomMessageService
	 * @description Extracts the unique identifier of the event
	 * @param {String} event An event of the form "eventNamepace:UNIQUEID:eventName"
	 */
	extractEventId(event) {
		return event.split(':')[1];
	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#getViewDefinitionsReceivedMessage
	 * @methodOf Services.BomMessageService
	 * @description Returns a message that indicates that a viewDefinitions payload was recieved
	 * @param {String} wsId the wsId for the view definitions
	 *
	 * @return {String} the message
	 */
	getViewDefinitionsReceivedMessage(wsId) {
		return `viewDefinitions:${wsId}:done`;
	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#getViewDefinitionReceivedMessage
	 * @methodOf Services.BomMessageService
	 * @description Returns a message that indicates that a viewDefinition payload was recieved
	 * @param {String} urn the urn for the view def
	 *
	 * @return {String} the message
	 */
	getViewDefinitionReceivedMessage(urn) {
		return `viewDefinition:${urn}:done`;
	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#getViewDefinitionGetMessage
	 * @methodOf Services.BomMessageService
	 * @description Returns a message that indicates that a viewDefinition should be loaded
	 * @param {String} urn the urn for the view def
	 *
	 * @return {String} the message
	 */
	getViewDefinitionGetMessage(urn) {
		return `viewDefinition:${urn}:get`;
	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#getBomTopLineReceivedMessage
	 * @methodOf Services.BomMessageService
	 * @description Returns a message that indicates that the top line of the Bom was fetched
	 * @param {String} itemId the id used to fetch the bom top line
	 *		 which may not be the id of the item returned
	 *
	 * @return {String} the message
	 */
	getBomTopLineReceivedMessage(itemId) {
		return `bomRoot:${itemId}:done`;
	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#getBomNestedItemsChunkReceivedMessage
	 * @methodOf Services.BomMessageService
	 * @description Returns a message that indicates that a chunk of bom items was fetched
	 * @param {String} chunkId A unique id that will identify the chunk
	 *
	 * @return {String} the message
	 */
	getBomNestedItemsChunkReceivedMessage(chunkId) {
		return `bomNestedItems:${chunkId}:chunkReceived`;
	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#getBomRowAddedMessage
	 * @methodOf Services.BomMessageService
	 * @description Returns a message that indicates that a row was added to the bomTable
	 * @param {BomPath} path the path to the row that was added
	 *
	 * @return {String} the message
	 */
	getBomRowAddedMessage(path) {
		return `bomTableRow:${path.asString()}:created`;
	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#getBomChangeSendMessage
	 * @methodOf Services.BomMessageService
	 * @description Returns a message that indicates that all changes to the bom
	 *		returned either success or failure
	 *
	 * @return {String} the message
	 */
	getBomSaveCompletedMessage() {
		return 'bomNestedItem:saveCompleted';
	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#getBomNestedItemFetchSuccessMessage
	 * @methodOf Services.BomMessageService
	 * @description Returns a message that indicates that a BomNestedItem has been fetched
	 * @param {String} fetchId the id for the fetch
	 *
	 * @return {String} the message
	 */
	getBomNestedItemFetchSuccessMessage(fetchId) {
		return `bomNestedItem:${fetchId}:done`;
	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#getBomChangeSendMessage
	 * @methodOf Services.BomMessageService
	 * @description Returns a message that indicates that a bom change should be persisted
	 * @param {String} changeType the type of change
	 * @param {String} changeId the unique identifier of the change
	 *
	 * @return {String} the message
	 */
	getBomChangeSendMessage(changeType, changeId) {
		if (changeType === 'edit') {
			return `bomNestedItem:${changeId}:${changeType}`;
		} else if (changeType === 'add') {
			return `bomNestedItem:${changeId}:${changeType}`;
		} else if (changeType === 'remove') {
			return `bomNestedItem:${changeId}:${changeType}`;
		} else {
			return null;
		}
	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#getBomChangeSuccessMessage
	 * @methodOf Services.BomMessageService
	 * @description Returns a message that indicates that a bom change was successfully persisted
	 * @param {String} changeType the type of change
	 * @param {String} changeId the unique identifier of the change
	 *
	 * @return {String} the message
	 */
	getBomChangeSuccessMessage(changeType, changeId) {
		return `${this.getBomChangeSendMessage(changeType, changeId)}Done`;
	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#getBomChangeFailureMessage
	 * @methodOf Services.BomMessageService
	 * @description Returns a message that indicates that a bom change failed to persist persisted
	 * @param {String} changeType the type of change
	 * @param {String} changeId the unique identifier of the change
	 *
	 * @return {String} the message
	 */
	getBomChangeFailureMessage(changeType, changeId) {
		return `${this.getBomChangeSendMessage(changeType, changeId)}Failed`;
	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#getTopLineExpandedMessage
	 * @methodOf Services.BomMessageService
	 * @description Returns a message that indicates that the top line of the bom table has been expanded
	 * @param {Boolean} true or false depending on what the status of the expansion
	 *
	 * @return {String} the message
	 */
	getTopLineExpandedMessage(initCompleted) {
		return `bomTableTopLineHasBeen:${initCompleted}:Expanded`;
	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#getViewDefFieldRecievedMessage
	 * @methodOf Services.BomMessageService
	 * @description Returns a message by creating a string using urn
	 * indicating that field has been received from the server.
	 *
	 * @param {String} urn the urn of the field
	 *
	 * @return {String} the message
	 */
	getViewDefFieldRecievedMessage(urn) {
		return `viewDefinitionField:${urn}:done`;
	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#getViewDefFieldGetMessage
	 * @methodOf Services.BomMessageService
	 * @description Returns a message by creating a string using urn
	 * indicating that field metadata has been requested
	 *
	 * @param {String} urn the urn of the field
	 *
	 * @return {String} the message
	 */
	getViewDefFieldGetMessage(urn) {
		return `viewDefinitionField:${urn}:get`;
	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#getBulkBomFetchedSuccessMessage
	 * @methodOf Services.BomMessageService
	 * @description Returns a message that indicates that a BulkBom has been fetched
	 * @param {String} fetchId the id for the fetch
	 *
	 * @return {String} the message
	 */
	getBulkBomFetchedSuccessMessage(fetchId) {
		return `bulkbom:${fetchId}:done`;
	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#getBulkAttachmentRecivedMessage
	 * @methodOf Services.BomMessageService
	 * @description Returns a message that indicates that a attachments has been fetched
	 * @param {String} fetchId the id for the fetch
	 *
	 * @return {String} the message
	 */
	getBulkAttachmentRecivedMessage(fetchId) {
		return `bomBulkAttachment:${fetchId}:done`;
	}

	/**
	 * @ngdoc method
	 * @name Services.BomMessageService#getAttachmentChunkRecieved
	 * @methodOf Services.BomMessageService
	 * @description Returns a message that indicates that a attachment chunk has been fetched.
	 * @param {String} chunkId the id for the chunk being fetched.
	 *
	 * @return {String} the message
	 */
	getAttachmentChunkRecieved(chunkId) {
		return `bomAttachmentChunk:${chunkId}:chunkReceived`;
	}
}

angular.module(__moduleName, []).service('BomMessageService', BomMessageService);

export default BomMessageService;
