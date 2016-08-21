System.registerModule("com/autodesk/components/workspaceItem/viewBom/bomDataController.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewBom/bomDataController.js";
  var BOM_API_DATE_FORMAT = 'YYYY-MM-DD';
  var BomGraph = System.get("com/autodesk/models/bomGraph/bomGraph.model.js").default;
  var BomPath = System.get("com/autodesk/models/bomTable/bomPath.model.js").default;
  var BomConfigurationStateMachine = System.get("com/autodesk/models/bomGraph/bomConfigurationStateMachine.model.js").default;
  var BomUIFieldSemantics = System.get("com/autodesk/models/bomFields/BomUIFieldSemantics.service.js").default;
  var BomDataController = function() {
    function BomDataController(itemUrn) {
      this.configurationStateMachine = new BomConfigurationStateMachine(BOM_API_DATE_FORMAT);
      this.itemUrn = itemUrn;
      this.itemObj = null;
      this.bomGraph = new BomGraph();
      this.bomTable = new BomDataController.BomTable();
      this.viewDefs = null;
      this.currentViewDef = null;
      this.useBulkLoader = true;
      this.intialLoadDepth = 3;
    }
    return ($traceurRuntime.createClass)(BomDataController, {
      getItemObj: function() {
        return this.itemObj;
      },
      getGraph: function() {
        return this.bomGraph;
      },
      getTable: function() {
        return this.bomTable;
      },
      getConfigurationStateMachine: function() {
        return this.configurationStateMachine;
      },
      getViewDefs: function() {
        return this.viewDefs;
      },
      getCurrentViewDef: function() {
        return this.currentViewDef;
      },
      shouldUseBulkLoader: function() {
        return this.useBulkLoader;
      },
      getInitDepth: function() {
        return this.intialLoadDepth;
      },
      init: function() {
        var $__6 = this;
        var deferred = BomDataController.$q.defer();
        var itemListenerId = BomDataController.EventService.listen(("itemInstance:" + this.itemUrn + ":done"), function(event, itemObj) {
          BomDataController.EventService.unlisten(itemListenerId);
          $__6.itemObj = itemObj;
          var workspaceId = $__6.itemObj.getWorkspaceObj().getId();
          var itemId = $__6.itemObj.getId();
          var viewsListenerId = BomDataController.EventService.listen(("viewDefinitions:" + workspaceId + ":done"), function(event, viewDefsObj) {
            BomDataController.EventService.unlisten(viewsListenerId);
            $__6.viewDefs = viewDefsObj;
            var storedViewDefId;
            var useLocalStorage = BomDataController.LocalUserStorageService.canUseLocalStorage();
            if (useLocalStorage) {
              storedViewDefId = BomDataController.LocalUserStorageService.get($__6.viewDefs.buildViewStorageKey(workspaceId));
            }
            if (!storedViewDefId) {
              storedViewDefId = $__6.viewDefs.getDefaultView().getId();
              if (useLocalStorage) {
                BomDataController.LocalUserStorageService.set($__6.viewDefs.buildViewStorageKey(workspaceId), storedViewDefId);
              }
            }
            $__6.configurationStateMachine.setInitialState(itemId, storedViewDefId, $__6.itemObj.isWorking());
            deferred.resolve($__6.initBom());
          });
          BomDataController.ModelsManager.getViewDefs(workspaceId);
        });
        BomDataController.ModelsManager.getItem(this.itemUrn);
        return deferred.promise;
      },
      initBom: function() {
        var $__6 = this;
        var deferred = BomDataController.$q.defer();
        this.bomGraph.clear();
        this.bomTable.clear();
        this.currentViewDef = this.viewDefs.find(this.configurationStateMachine.viewDefId);
        this.bomTable.addColumnsForViewDefinition(this.currentViewDef);
        var toplineUrn = BomDataController.UrnParser.encode(this.itemObj.getUrn());
        var toplineConfigurationParams = this.configurationStateMachine.getTopLineQueryParams();
        if (this.shouldUseBulkLoader()) {
          this.handleBomBulkLoading(toplineUrn, toplineConfigurationParams).then(function(rootItemUrn) {
            if (rootItemUrn !== $__6.itemObj.getUrn()) {
              deferred.resolve($__6.updateTarget($__6.bomGraph.getRootNode().getResourceId()));
            } else {
              deferred.resolve();
            }
          });
        } else {
          this.loadBomRoot(toplineUrn, toplineConfigurationParams).then(function(bomRoot) {
            $__6.addPathToTable(BomPath.EmptyPath());
            if (bomRoot.getItemUrn() !== $__6.itemObj.getUrn()) {
              deferred.resolve($__6.updateTarget(bomRoot.getItemId()));
            } else {
              deferred.resolve();
            }
          });
        }
        return deferred.promise;
      },
      loadBomRoot: function(urn, bomConfiguration) {
        var $__6 = this;
        var deferred = BomDataController.$q.defer();
        var bomRootListenerId = BomDataController.EventService.listen(("bomRoot:" + urn + ":done"), function(event, bomRoot) {
          BomDataController.EventService.unlisten(bomRootListenerId);
          $__6.updateConfiguration(bomRoot.getDmsId(), bomRoot.getConfigDate(), bomRoot.getConfigBias());
          var rootNode = BomDataController.BomGraphBuilder.buildRootNode(bomRoot, $__6.currentViewDef);
          $__6.bomGraph.addNode(rootNode);
          $__6.bomGraph.setRootNodeId(rootNode.itemId);
          deferred.resolve(bomRoot);
        });
        BomDataController.ModelsManager.getBomRoot(urn, bomConfiguration);
        return deferred.promise;
      },
      updateConfiguration: function(itemId, configDate, configBias) {
        this.configurationStateMachine.setItemId(itemId);
        this.configurationStateMachine.setEffectiveDate(configDate);
        this.configurationStateMachine.setRevisionBias(configBias);
      },
      updateTarget: function(itemId) {
        var $__6 = this;
        var deferred = BomDataController.$q.defer();
        var itemListenerId = BomDataController.EventService.listen(("itemInstance:" + itemId + ":done"), function(event, itemObj) {
          BomDataController.EventService.unlisten(itemListenerId);
          $__6.itemObj = itemObj;
          $__6.configurationStateMachine.setIsWorkingRevision($__6.itemObj.isWorking());
          deferred.resolve(itemId);
        });
        BomDataController.ModelsManager.getItem(itemId);
        return deferred.promise;
      },
      addPathToTable: function(path) {
        if (!this.bomTable.rowExists(path)) {
          var newRow = BomDataController.BomTableRowBuilder.buildRowFromPath(path, this.bomGraph, this.currentViewDef);
          this.bomTable.addBomRow(newRow);
          BomDataController.EventService.send(BomDataController.BomMessageService.getBomRowAddedMessage(path));
        }
      },
      populateChildrenAndOutputToTable: function(row) {
        var $__6 = this;
        var deferred = BomDataController.$q.defer();
        var itemId = row.nodeId;
        var path = row.path;
        var bomNestedListenerId = BomDataController.EventService.listen(("bomNested:" + itemId + ":done"), function(event, bomNested) {
          BomDataController.EventService.unlisten(bomNestedListenerId);
          var bomItems = _.partition(bomNested.getBomItems(), function(bomItem) {
            return $__6.bomGraph.hasEdge(bomItem.id);
          });
          var existingBomItems = bomItems[0];
          var newBomItems = bomItems[1];
          $__6.fillTableFromPath(path);
          var chunkSize = 16;
          $__6.processListInChunks(chunkSize, newBomItems, function(chunk, message) {
            $__6.loadBomItems(bomNested, itemId, chunk).then(function() {
              chunk.forEach(function(bomItem) {
                $__6.fillTableFromPath(path.WithSucceedingEdge(bomItem.id));
              });
              BomDataController.EventService.send(message);
            });
          }, function(chunkIndex) {
            return BomDataController.BomMessageService.getBomNestedItemsChunkReceivedMessage((path.asString() + ":" + chunkIndex));
          }).then(function() {
            deferred.resolve();
          });
        });
        BomDataController.ModelsManager.getBomNested(itemId, this.configurationStateMachine.getFullConfiguration());
        return deferred.promise;
      },
      processListInChunks: function(chunkSize, list, callback, messageBuilder) {
        var chunkIndex = arguments[4] !== (void 0) ? arguments[4] : 0;
        var $__6 = this;
        var deferred = BomDataController.$q.defer();
        var chunk = list.slice(chunkIndex, chunkIndex + chunkSize);
        if (chunk.length > 0) {
          var chunkCompletedListenerId = BomDataController.EventService.listen(messageBuilder(chunkIndex), function(event) {
            BomDataController.EventService.unlisten(chunkCompletedListenerId);
            var newIndex = chunkIndex + chunkSize;
            if (newIndex < list.length) {
              $__6.processListInChunks(chunkSize, list, callback, messageBuilder, newIndex);
            } else {
              deferred.resolve();
            }
          });
          callback(chunk, messageBuilder(chunkIndex));
        }
        return deferred.promise;
      },
      loadBomItems: function(bomNested, parentItemId, bomItems) {
        var $__6 = this;
        var deferred = BomDataController.$q.defer();
        var loadedItems = [];
        var checkLoadComplete = function() {
          if (loadedItems.length === bomItems.length) {
            deferred.resolve();
          }
        };
        bomItems.forEach(function(bomItem) {
          var edgeNodePropertiesListenerId = BomDataController.EventService.listen(("bomNestedItem:" + bomItem.id + ":done"), function(event, edgeNodeProperties) {
            BomDataController.EventService.unlisten(edgeNodePropertiesListenerId);
            BomDataController.BomGraphBuilder.addEdgeNodeToGraph(edgeNodeProperties, $__6.currentViewDef, $__6.bomGraph);
            $__6.bomGraph.getNode(parentItemId).addOutEdge(bomItem.id);
            loadedItems.push(bomItem.id);
            checkLoadComplete();
          });
          BomDataController.ModelsManager.getBomNestedItem(bomNested, parentItemId.split('@')[1], bomItem.id, $__6.configurationStateMachine.getFullConfiguration());
        });
        return deferred.promise;
      },
      fillTableFromPath: function(path) {
        this.bomGraph.BFT(path, this.addPathToTable.bind(this));
      },
      loadItemRevisions: function(row, excludedStatuses) {
        if (!row.hasLoadedRevisions() && !row.isNewlyAdded) {
          var node = this.bomGraph.getNodeForPath(row.path);
          var urn = BomDataController.UrnParser.encode(node.item.urn);
          var nestedItemRevisionListener = BomDataController.EventService.listen(("itemRevisions:" + urn + ":done"), function(event, revisions) {
            BomDataController.EventService.unlisten(nestedItemRevisionListener);
            var versions = revisions.json.versions;
            versions = versions.filter(function(version) {
              return excludedStatuses.indexOf(version.status) === -1;
            });
            row.updateRevisionField(versions);
          });
          BomDataController.ModelsManager.getRevisions(undefined, urn);
        }
      },
      loadSubAssembly: function(row, depth) {
        var $__6 = this;
        var deferredObj = BomDataController.$q.defer();
        var rowNode = this.bomGraph.getNode(row.nodeId);
        var endPointLink = rowNode.getBulkBomLink();
        var itemUrn = rowNode.getItemUrn();
        var queryParams = this.configurationStateMachine.getFullConfiguration();
        queryParams.rootId = rowNode.getDmsId();
        queryParams.depth = depth;
        BomDataController.BulkBomLoader.loadBulkBom(itemUrn, endPointLink, queryParams).then(function(bulkBom) {
          BomDataController.BomGraphBuilder.populateBomGraph(bulkBom, $__6.currentViewDef, $__6.bomGraph);
          $__6.fillTableFromPath(row.path);
          $__6.bomTable.rows.forEach(function(row) {
            var rowNode = $__6.bomGraph.getNode(row.nodeId);
            row.isExpandable = rowNode.getOutDegree() > 0;
          });
          deferredObj.resolve();
        });
        return deferredObj.promise;
      },
      populateInitialBom: function(itemUrn, bulkEndpointLink, queryParams) {
        var $__6 = this;
        var deferredObj = BomDataController.$q.defer();
        queryParams.depth = this.getInitDepth();
        BomDataController.BulkBomLoader.loadBulkBom(itemUrn, bulkEndpointLink, queryParams).then(function(bulkBom) {
          $__6.updateConfiguration(bulkBom.getDmsId(), bulkBom.getConfigDate(), bulkBom.getConfigBias());
          $__6.bomGraph.setRootNodeId(bulkBom.getRootNodeId());
          BomDataController.BomGraphBuilder.populateBomGraph(bulkBom, $__6.currentViewDef, $__6.bomGraph);
          $__6.fillTableFromPath(BomPath.EmptyPath());
          deferredObj.resolve($__6.bomGraph.getRootNode().getItemUrn());
        });
        return deferredObj.promise;
      },
      loadAttachments: function() {
        var $__6 = this;
        var deferred = BomDataController.$q.defer();
        var attachmentField = this.currentViewDef.getFieldWithSemantics(BomUIFieldSemantics.ATTACHMENTS);
        var attachmentFieldId = attachmentField.getUrn();
        var attachmentLink = this.bomGraph.getRootNode().getField(attachmentFieldId).getValue().attachmentLink;
        var urnList = this.bomGraph.getNodeUrnList();
        var chunkSize = 24;
        var requestSize = 6;
        this.processListInChunks(chunkSize, urnList, function(chunk, message) {
          var itemCount = 0;
          var $__7 = function(i) {
            var smallerChunk = chunk.slice(i, i + requestSize);
            BomDataController.BomBulkAttachmentLoader.loadBulkAttachment(smallerChunk, attachmentLink).then(function(bulkAttachment) {
              bulkAttachment.getAttachmentLists().forEach(function(bomAttachmentList, itemId) {
                var fieldValue = $__6.bomGraph.getNode(itemId).getField(attachmentFieldId).getValue();
                fieldValue.count = bomAttachmentList.getSize();
                fieldValue.attachments = bomAttachmentList;
              });
              itemCount = itemCount + smallerChunk.length;
              if (itemCount === chunk.length) {
                BomDataController.EventService.send(message);
              }
            });
          };
          for (var i = 0; i < chunk.length; i += requestSize) {
            $__7(i);
          }
        }, function(chunkIndex) {
          return BomDataController.BomMessageService.getAttachmentChunkRecieved(("" + chunkIndex));
        }).then(function() {
          deferred.resolve();
        });
        return deferred.promise;
      },
      handleBomBulkLoading: function(toplineUrn, toplineConfigurationParams) {
        var $__6 = this;
        var deferred = BomDataController.$q.defer();
        this.populateInitialBom(toplineUrn, this.itemObj.getBomRootLink(), toplineConfigurationParams).then(function(rootItemUrn) {
          $__6.loadSubAssembly($__6.bomTable.getRowForPath(BomPath.EmptyPath()), undefined).then(function() {
            if ($__6.currentViewDef.hasAttachmentField()) {
              $__6.loadAttachments().then(function() {
                deferred.resolve(rootItemUrn);
              });
            } else {
              deferred.resolve(rootItemUrn);
            }
          });
        });
        return deferred.promise;
      }
    }, {});
  }();
  var BomDataControllerFactory = function($q, ModelsManager, EventService, UrnParser, BomTable, BomMessageService, BulkBomLoader, BomGraphBuilder, LocalUserStorageService, BomTableRowBuilder, BomBulkAttachmentLoader) {
    BomDataController.$q = $q;
    BomDataController.ModelsManager = ModelsManager;
    BomDataController.EventService = EventService;
    BomDataController.UrnParser = UrnParser;
    BomDataController.BomTable = BomTable;
    BomDataController.BomMessageService = BomMessageService;
    BomDataController.BulkBomLoader = BulkBomLoader;
    BomDataController.BomGraphBuilder = BomGraphBuilder;
    BomDataController.LocalUserStorageService = LocalUserStorageService;
    BomDataController.BomTableRowBuilder = BomTableRowBuilder;
    BomDataController.BomBulkAttachmentLoader = BomBulkAttachmentLoader;
    return BomDataController;
  };
  BomDataControllerFactory.$inject = ['$q', 'ModelsManager', 'EventService', 'UrnParser', 'BomTable', 'BomMessageService', 'BulkBomLoader', 'BomGraphBuilder', 'LocalUserStorageService', 'BomTableRowBuilder', 'BomBulkAttachmentLoader'];
  var $__default = BomDataControllerFactory;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewBom/bomDataController.js
