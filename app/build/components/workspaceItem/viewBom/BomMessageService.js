System.registerModule("com/autodesk/components/workspaceItem/viewBom/BomMessageService.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewBom/BomMessageService.js";
  var BomMessageService = function() {
    function BomMessageService() {}
    return ($traceurRuntime.createClass)(BomMessageService, {
      extractEventId: function(event) {
        return event.split(':')[1];
      },
      getViewDefinitionsReceivedMessage: function(wsId) {
        return ("viewDefinitions:" + wsId + ":done");
      },
      getViewDefinitionReceivedMessage: function(urn) {
        return ("viewDefinition:" + urn + ":done");
      },
      getViewDefinitionGetMessage: function(urn) {
        return ("viewDefinition:" + urn + ":get");
      },
      getBomTopLineReceivedMessage: function(itemId) {
        return ("bomRoot:" + itemId + ":done");
      },
      getBomNestedItemsChunkReceivedMessage: function(chunkId) {
        return ("bomNestedItems:" + chunkId + ":chunkReceived");
      },
      getBomRowAddedMessage: function(path) {
        return ("bomTableRow:" + path.asString() + ":created");
      },
      getBomSaveCompletedMessage: function() {
        return 'bomNestedItem:saveCompleted';
      },
      getBomNestedItemFetchSuccessMessage: function(fetchId) {
        return ("bomNestedItem:" + fetchId + ":done");
      },
      getBomChangeSendMessage: function(changeType, changeId) {
        if (changeType === 'edit') {
          return ("bomNestedItem:" + changeId + ":" + changeType);
        } else if (changeType === 'add') {
          return ("bomNestedItem:" + changeId + ":" + changeType);
        } else if (changeType === 'remove') {
          return ("bomNestedItem:" + changeId + ":" + changeType);
        } else {
          return null;
        }
      },
      getBomChangeSuccessMessage: function(changeType, changeId) {
        return (this.getBomChangeSendMessage(changeType, changeId) + "Done");
      },
      getBomChangeFailureMessage: function(changeType, changeId) {
        return (this.getBomChangeSendMessage(changeType, changeId) + "Failed");
      },
      getTopLineExpandedMessage: function(initCompleted) {
        return ("bomTableTopLineHasBeen:" + initCompleted + ":Expanded");
      },
      getViewDefFieldRecievedMessage: function(urn) {
        return ("viewDefinitionField:" + urn + ":done");
      },
      getViewDefFieldGetMessage: function(urn) {
        return ("viewDefinitionField:" + urn + ":get");
      },
      getBulkBomFetchedSuccessMessage: function(fetchId) {
        return ("bulkbom:" + fetchId + ":done");
      },
      getBulkAttachmentRecivedMessage: function(fetchId) {
        return ("bomBulkAttachment:" + fetchId + ":done");
      },
      getAttachmentChunkRecieved: function(chunkId) {
        return ("bomAttachmentChunk:" + chunkId + ":chunkReceived");
      }
    }, {});
  }();
  angular.module(__moduleName, []).service('BomMessageService', BomMessageService);
  var $__default = BomMessageService;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewBom/BomMessageService.js
