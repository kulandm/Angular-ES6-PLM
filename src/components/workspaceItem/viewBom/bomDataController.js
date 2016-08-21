const BOM_API_DATE_FORMAT = 'YYYY-MM-DD';

import BomGraph from 'com/autodesk/models/bomGraph/bomGraph.model.js';
import BomPath from 'com/autodesk/models/bomTable/bomPath.model.js';
import BomConfigurationStateMachine from 'com/autodesk/models/bomGraph/bomConfigurationStateMachine.model.js';
import BomUIFieldSemantics from 'com/autodesk/models/bomFields/BomUIFieldSemantics.service.js';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.BomDataController
 *
 * @description Controller for Bom data
 */
class BomDataController {
	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomDataController#constructor
	 * @methodOf Controllers.workspaceItem.BomDataController
	 *
	 * @description Constructs the BomDataController instance
	 */
    constructor(itemUrn) {
        /**
         * @ngdoc property
         * @name Controllers.workspaceItem.BomDataController#configurationStateMachine
         * @propertyOf Controllers.workspaceItem.BomDataController
         *
         * @description The state machine to track the current configuration of the Bom
         */
        this.configurationStateMachine = new BomConfigurationStateMachine(BOM_API_DATE_FORMAT);

        /**
         * @ngdoc property
         * @name Controllers.workspaceItem.BomDataController#itemUrn
         * @propertyOf Controllers.workspaceItem.BomDataController
         *
         * @description The urn to use to initialize the bom
         */
        this.itemUrn = itemUrn;

        /**
         * @ngdoc property
         * @name Controllers.workspaceItem.BomDataController#itemObj
         * @propertyOf Controllers.workspaceItem.BomDataController
         *
         * @description The item object for the current topline of the bom
         */
        this.itemObj = null;

        /**
         * @ngdoc property
         * @name Controllers.workspaceItem.BomDataController#bomGraph
         * @propertyOf Controllers.workspaceItem.BomDataController
         *
         * @description Simply the Bom Graph
         * This is the central location for storage and is traversed to output the Bom Table
         */
        this.bomGraph = new BomGraph();

        /**
         * @ngdoc property
         * @name Controllers.workspaceItem.BomDataController#bomTable
         * @propertyOf Controllers.workspaceItem.BomDataController
         *
         * @description Object holding the table columns and rows
         */
        this.bomTable = new BomDataController.BomTable();

        /**
         * @ngdoc property
         * @name Controllers.workspaceItem.BomDataController#viewDefs
         * @propertyOf Controllers.workspaceItem.BomDataController
         *
         * @description The view definitions that will be loaded
         */
        this.viewDefs = null;

        /**
         * @ngdoc property
         * @name Controllers.workspaceItem.BomDataController#currentViewDef
         * @propertyOf Controllers.workspaceItem.BomDataController
         *
         * @description The currently selected view definition
         */
        this.currentViewDef = null;

        /**
         * @ngdoc property
         * @name Controllers.workspaceItem.BomDataController#useBulkLoader
         * @propertyOf Controllers.workspaceItem.BomDataController
         *
         * @description Toggle for Bulk loading of the Bom. Currenly bom
         * will have attachments only when bulk loading is turned on.
         */
        this.useBulkLoader = true;

        /**
         * @ngdoc property
         * @name Controllers.workspaceItem.BomDataController#intialLoadDepth
         * @propertyOf Controllers.workspaceItem.BomDataController
         *
         * @description The initial depth to use when using the Bom Bulk Api.
         */
        this.intialLoadDepth = 3;
    }

    /**
     * @ngdoc method
     * @name Controllers.workspaceItem.BomDataController#getItemObj
     * @methodOf Controllers.workspaceItem.BomDataController
     * @description Returns the Item object associated with the current topline
     *
     * @returns {Item} the current item object
     */
    getItemObj() {
        return this.itemObj;
    }

    /**
     * @ngdoc method
     * @name Controllers.workspaceItem.BomDataController#getGraph
     * @methodOf Controllers.workspaceItem.BomDataController
     * @description Returns the current bom graph
     *
     * @returns {BomGraph} the graph
     */
    getGraph() {
        return this.bomGraph;
    }

    /**
     * @ngdoc method
     * @name Controllers.workspaceItem.BomDataController#getTable
     * @methodOf Controllers.workspaceItem.BomDataController
     * @description Returns the current bom table
     *
     * @returns {BomTable} the table
     */
    getTable() {
        return this.bomTable;
    }

    /**
     * @ngdoc method
     * @name Controllers.workspaceItem.BomDataController#getConfigurationStateMachine
     * @methodOf Controllers.workspaceItem.BomDataController
     * @description Returns the current configuration state machine
     *
     * @returns {BomConfigurationStateMachine} the configuration state machine
     */
    getConfigurationStateMachine() {
        return this.configurationStateMachine;
    }

    /**
     * @ngdoc method
     * @name Controllers.workspaceItem.BomDataController#getViewDefs
     * @methodOf Controllers.workspaceItem.BomDataController
     * @description Returns all the view definitions
     *
     * @returns {viewDefinitions} the view definitions instance
     */
    getViewDefs() {
        return this.viewDefs;
    }

    /**
     * @ngdoc method
     * @name Controllers.workspaceItem.BomDataController#getCurrentViewDef
     * @methodOf Controllers.workspaceItem.BomDataController
     * @description Returns the currently selected view definitions
     *
     * @returns {viewDefinition} the currently selected view definition
     */
    getCurrentViewDef() {
        return this.currentViewDef;
    }

    /**
     * @ngdoc method
     * @name Controllers.workspaceItem.BomDataController#shouldUseBulkLoader
     * @methodOf Controllers.workspaceItem.BomDataController
     * @description Tells us whether or not to use Bulk loading for bom.
     *
     * @returns {Boolean} true if bulk loading is on for bom, and false otherwise.
     */
    shouldUseBulkLoader() {
        return this.useBulkLoader;
    }

    /**
     * @ngdoc method
     * @name Controllers.workspaceItem.BomDataController#getInitDepth
     * @methodOf Controllers.workspaceItem.BomDataController
     * @description getter for the initial loading depth of Bom.
     *
     * @returns {Number} the initial bom depth.
     */
    getInitDepth() {
        return this.intialLoadDepth;
    }

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomDataController#init
	 * @methodOf Controllers.workspaceItem.BomDataController
	 *
	 * @description Does the initial load of the Bom
	 *  Steps:
	 *      1. Load the item associated with the Bom
	 *      2. Load the view definitions associated with the Bom
	 *      3. Load the Bom corresponding to the item
	 *          if there is a viewDefId stored in the user's local storage, use that as the view
	 *          Otherwise, use the default view
	 */
	init() {
		let deferred = BomDataController.$q.defer();

		let itemListenerId = BomDataController.EventService.listen(`itemInstance:${this.itemUrn}:done`, (event, itemObj) => {
			BomDataController.EventService.unlisten(itemListenerId);

			this.itemObj = itemObj;
			let workspaceId = this.itemObj.getWorkspaceObj().getId();
			let itemId = this.itemObj.getId();

			let viewsListenerId = BomDataController.EventService.listen(`viewDefinitions:${workspaceId}:done`, (event, viewDefsObj) => {
				BomDataController.EventService.unlisten(viewsListenerId);
				this.viewDefs = viewDefsObj;

				let storedViewDefId;
				let useLocalStorage = BomDataController.LocalUserStorageService.canUseLocalStorage();
				if (useLocalStorage) {
					storedViewDefId = BomDataController.LocalUserStorageService.get(this.viewDefs.buildViewStorageKey(workspaceId));
				}

				if (!storedViewDefId) {
					storedViewDefId = this.viewDefs.getDefaultView().getId();

					if (useLocalStorage) {
						BomDataController.LocalUserStorageService.set(this.viewDefs.buildViewStorageKey(workspaceId), storedViewDefId);
					}
				}

				this.configurationStateMachine.setInitialState(itemId, storedViewDefId, this.itemObj.isWorking());

				deferred.resolve(this.initBom());
			});
			BomDataController.ModelsManager.getViewDefs(workspaceId);
		});

		BomDataController.ModelsManager.getItem(this.itemUrn);

		return deferred.promise;
	}

    /**
     * @ngdoc method
     * @name Controllers.workspaceItem.BomDataController#initBom
     * @methodOf Controllers.workspaceItem.BomDataController
     *
     * @description Completely rebuilds the bom according to the current state of the configuration machine
     */
    initBom() {
        let deferred = BomDataController.$q.defer();

        this.bomGraph.clear();
        this.bomTable.clear();
        this.currentViewDef = this.viewDefs.find(this.configurationStateMachine.viewDefId);
        this.bomTable.addColumnsForViewDefinition(this.currentViewDef);

        let toplineUrn = BomDataController.UrnParser.encode(this.itemObj.getUrn());
        let toplineConfigurationParams = this.configurationStateMachine.getTopLineQueryParams();

        if (this.shouldUseBulkLoader()) {
            this.handleBomBulkLoading(toplineUrn, toplineConfigurationParams).then((rootItemUrn) => {
                if (rootItemUrn !== this.itemObj.getUrn()) {
                    deferred.resolve(this.updateTarget(this.bomGraph.getRootNode().getResourceId()));
                } else {
                    deferred.resolve();
                }
            });
        } else {
            this.loadBomRoot(toplineUrn, toplineConfigurationParams).then((bomRoot) => {
                this.addPathToTable(BomPath.EmptyPath());
                // If our current item doesn't match the new topline's item, Update our target
                if (bomRoot.getItemUrn() !== this.itemObj.getUrn()) {
                    deferred.resolve(this.updateTarget(bomRoot.getItemId()));
                } else {
                    deferred.resolve();
                }
            });
        }
        return deferred.promise;
    }

    /**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomDataController#loadBomRoot
	 * @methodOf Controllers.workspaceItem.BomDataController
	 * @description Loads the root node and adds it to the graph,
	 *      handling any changes to the configuration that may have occured
	 * @param {String} urn that we need to use to call to get the root node
	 *	It doesn't matter what this is, so long as it is part of the lineage
	 *		of the item we want
	 * @param {Object} bomConfiguration The configuration to use to load the root
	 *
	 * @returns {Promise} A promise that resolves when the root node has been placed in the graph
	 *      With the BomRoot object
	 */
	loadBomRoot(urn, bomConfiguration) {
		let deferred = BomDataController.$q.defer();

		let bomRootListenerId = BomDataController.EventService.listen(`bomRoot:${urn}:done`, (event, bomRoot) => {
			BomDataController.EventService.unlisten(bomRootListenerId);
            // Update the current Bom configuration with information from top line provided
            this.updateConfiguration(bomRoot.getDmsId(), bomRoot.getConfigDate(), bomRoot.getConfigBias());
			// Update the Graph
			let rootNode = BomDataController.BomGraphBuilder.buildRootNode(bomRoot, this.currentViewDef);
			this.bomGraph.addNode(rootNode);
			this.bomGraph.setRootNodeId(rootNode.itemId);

			deferred.resolve(bomRoot);
		});
		BomDataController.ModelsManager.getBomRoot(urn, bomConfiguration);

		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomDataController#updateConfiguration
	 * @methodOf Controllers.workspaceItem.BomDataController
	 * @description Updates the configuration using the provided bomRoot
	 *		Does not update isWorkingRevision, since that requires the Item object
	 * @param {BomRoot} bomRoot the root item to use for the configuration
	 */
	updateConfiguration(itemId, configDate, configBias) {
		this.configurationStateMachine.setItemId(itemId);
		this.configurationStateMachine.setEffectiveDate(configDate);
		this.configurationStateMachine.setRevisionBias(configBias);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomDataController#updateTarget
	 * @methodOf Controllers.workspaceItem.BomDataController
	 * @description Updates the current item to reflect the new top-line of the Bom
	 *			and Sets the configuration's working revsion flag
	 * @param {String} itemId that we want to update to
	 */
	updateTarget(itemId) {
		let deferred = BomDataController.$q.defer();

		let itemListenerId = BomDataController.EventService.listen(`itemInstance:${itemId}:done`, (event, itemObj) => {
			BomDataController.EventService.unlisten(itemListenerId);

			// Update with new target Item details
			this.itemObj = itemObj;

			// Update the working status for the configuration
			this.configurationStateMachine.setIsWorkingRevision(this.itemObj.isWorking());

			deferred.resolve(itemId);
		});
		BomDataController.ModelsManager.getItem(itemId);

		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomDataController#addPathToTable
	 * @methodOf Controllers.workspaceItem.BomDataController
	 *
	 * @description if a row corresponding to 'path' does not exist in the table,
	 *	Turns a BomPath into a row and adds it to the table
	 *
	 * @param {BomPath} the requested Path
	 */
	addPathToTable(path) {
		if (!this.bomTable.rowExists(path)) {
			let newRow = BomDataController.BomTableRowBuilder.buildRowFromPath(path, this.bomGraph, this.currentViewDef);
			this.bomTable.addBomRow(newRow);
			// Notify that the row at 'path' has been added
			BomDataController.EventService.send(BomDataController.BomMessageService.getBomRowAddedMessage(path));
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomDataController#populateChildrenAndOutputToTable
	 * @methodOf Controllers.workspaceItem.BomDataController
	 *
	 * @description For a given node builds up the children (outgoing edges and nodes) and updates the table to display
	 *
	 * Works by fetching the children of the input row.
	 * We begin by outputing any children who are already in the graph to the table
	 * Then, for any children who are not loaded, we load their details in chunks
	 *	and output them to the graph
	 *		We have to load in chunks because the browser will only process ~5 requests at a time
	 *			and we have a limit of 15 seconds before a request times out
	 *			If we sent all the requests at once, some of them would timeout
	 * @param {BomTableRow} row The row whose children should be loaded
	 */
	populateChildrenAndOutputToTable(row) {
		let deferred = BomDataController.$q.defer();

		let itemId = row.nodeId;
		let path = row.path;

		let bomNestedListenerId = BomDataController.EventService.listen(`bomNested:${itemId}:done`, (event, bomNested) => {
			BomDataController.EventService.unlisten(bomNestedListenerId);

			// Now that we have the children, for each, lets populate the edges and nodes with the retrieved data
			let bomItems = _.partition(bomNested.getBomItems(), (bomItem) => {
				return this.bomGraph.hasEdge(bomItem.id);
			});
			let existingBomItems = bomItems[0];
			let newBomItems = bomItems[1];

			// First output any children that already exist in the graph
			this.fillTableFromPath(path);

			// Then we load the bomItems in chunks
			//	Chunking is required because requests will timeout if they are waiting too long,
			//		and the browser can only send ~5 at a time
			let chunkSize = 16;
			this.processListInChunks(chunkSize, newBomItems, (chunk, message) => {
					this.loadBomItems(bomNested, itemId, chunk).then(() => {
						chunk.forEach((bomItem) => {
							this.fillTableFromPath(path.WithSucceedingEdge(bomItem.id));
						});
						BomDataController.EventService.send(message);
					});
				}, (chunkIndex) => {
					// Path is included with the message so there won't be collisions if multiple calls
					//	are running at the same time
					return BomDataController.BomMessageService.getBomNestedItemsChunkReceivedMessage(`${path.asString()}:${chunkIndex}`);
				}
			).then(() => {
				deferred.resolve();
			});
		});
		BomDataController.ModelsManager.getBomNested(itemId, this.configurationStateMachine.getFullConfiguration());

		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomDataController#processListInChunks
	 * @methodOf Controllers.workspaceItem.BomDataController
	 *
	 * @description Recursive function that processes a list in chunks of chunkSize
	 *	blocking the loading of each chunk until the previous chunk has been processed
	 *	We take the list in the range [chunkIndex, chunkIndex + chunkSize) and apply the callback.
	 *		When we hear that processing the chunk has completed
	 *			(via listening for the message created by messageBuilder using the chunk index)
	 *			if we are still within the bounds of the list, we recursively call for the next chunk
	 *
	 * @param {Number} chunkSize The size of chunk that the list should be split into
	 * @param {Array} list The list of itmes to process
	 * @param {Function} callback A function that takes two parameters:
	 *				chunk: the items in the current chunk
	 *				onReturnMessage: the message that should be sent when the chunk is finished processing
	 * @param {Function} messageBuilder A function that takes one parameter:
	 *				chunkIndex
	 *			and returns a message that distinguishes the chunk at the index
	 * @param {Number} chunkIndex The index tracking where the chunk should start
	 */
	processListInChunks(chunkSize, list, callback, messageBuilder, chunkIndex = 0) {
		let deferred = BomDataController.$q.defer();

		let chunk = list.slice(chunkIndex, chunkIndex + chunkSize);

		if (chunk.length > 0) {
			let chunkCompletedListenerId = BomDataController.EventService.listen(messageBuilder(chunkIndex), (event) => {
				BomDataController.EventService.unlisten(chunkCompletedListenerId);
				let newIndex = chunkIndex + chunkSize;
				if (newIndex < list.length) {
					this.processListInChunks(chunkSize, list, callback, messageBuilder, newIndex);
				} else {
					deferred.resolve();
				}
			});

			callback(chunk, messageBuilder(chunkIndex));
		}

		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomDataController#loadBomItems
	 * @methodOf Controllers.workspaceItem.BomDataController
	 *
	 * @description Loads a list of bom items
	 *
	 * Graph Example
	 * (Parent Node)	<- Input Node (OutEdges are added to node)
	 * |
	 * |				<- Edge (Edge Created, All properties populated)
	 * |
	 * V
	 * (Child Node)		<- Node (Node Created, All properties except OutEdges populated)
	 *
	 * The details that come back for each item is a union of the Edge and Node properties.
	 * These are used to create the edge and node which are added to the graph and we update the parent's outedges
	 *
	 * @param {BomNested} bomNested the BomNested where the link to each item is found
	 * @param {String} parentItemId the item id (currently in wsId@dmsId) format of the parent item
	 * @param {Array} bomItems an array of objects with id properties, where id is the dms id of the item
	 *
	 * @returns {Promise} A promise that will be resolved when all the items have loaded
	 */
	loadBomItems(bomNested, parentItemId, bomItems) {
		let deferred = BomDataController.$q.defer();

		let loadedItems = [];

		let checkLoadComplete = () => {
			if (loadedItems.length === bomItems.length) {
				deferred.resolve();
			}
		};

		bomItems.forEach((bomItem) => {
			let edgeNodePropertiesListenerId = BomDataController.EventService.listen(`bomNestedItem:${bomItem.id}:done`, (event, edgeNodeProperties) => {
				BomDataController.EventService.unlisten(edgeNodePropertiesListenerId);
				// Build the edge and node
				BomDataController.BomGraphBuilder.addEdgeNodeToGraph(edgeNodeProperties, this.currentViewDef, this.bomGraph);

				// Add this child to the parent's list of outedges
				this.bomGraph.getNode(parentItemId).addOutEdge(bomItem.id);

				loadedItems.push(bomItem.id);
				checkLoadComplete();
			});
			BomDataController.ModelsManager.getBomNestedItem(bomNested, parentItemId.split('@')[1], bomItem.id, this.configurationStateMachine.getFullConfiguration());
		});

		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomDataController#fillTableFromPath
	 * @methodOf Controllers.workspaceItem.BomDataController
	 * @description For a given path, adds it and its children to the table
	 *
	 * @param {BomPath} path Path to the current row
	 */
	fillTableFromPath(path) {
		this.bomGraph.BFT(path, this.addPathToTable.bind(this));
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomDataController#loadItemRevisions
	 * @methodOf Controllers.workspaceItem.BomDataController
	 * @description Load the revisions for a row,
	 *	if that row does not already have revisions loaded
	 * @param {BomTableRow} row the row to load revisions for
	 * @param {Array} excludedStatuses Array of strings indicating revisions that should be excluded
	 */
	loadItemRevisions(row, excludedStatuses) {
		if (!row.hasLoadedRevisions() && !row.isNewlyAdded) {
			let node = this.bomGraph.getNodeForPath(row.path);
			let urn = BomDataController.UrnParser.encode(node.item.urn);
			let nestedItemRevisionListener = BomDataController.EventService.listen(`itemRevisions:${urn}:done`, (event, revisions) => {
				BomDataController.EventService.unlisten(nestedItemRevisionListener);

				let versions = revisions.json.versions;

				versions = versions.filter((version) => {
					return excludedStatuses.indexOf(version.status) === -1;
				});

				row.updateRevisionField(versions);
			});
			BomDataController.ModelsManager.getRevisions(undefined, urn);
		}
	}

    /**
     * @ngdoc method
     * @name Controllers.workspaceItem.BomDataController#loadBulkBomAndFillTable
     * @methodOf Controllers.workspaceItem.BomDataController
     * @description Loads the subassebmly of the node represented by the `row` upto
	 * the `depth`, and then fills the table starting at the path to that leads to
	 * to node of the `row` and updates the previously built rows in order to make
	 * sure that they states are correct after the fetching of subassebmly.
     *
     * @param {BomTableRow} `row` the BomTableRow whose node's subassebmly is to
     * be populated.
     * @param {Number} `depth` upto what depth should the sub assembly be fetched.
     *
     * @returns {Promise} a promise that eventually resolves after the subassebmly
     * upto the provided `depth` has been populated for the node.
     */
    loadSubAssembly(row, depth) {
        let deferredObj = BomDataController.$q.defer();
        let rowNode = this.bomGraph.getNode(row.nodeId);
        let endPointLink = rowNode.getBulkBomLink();
        let itemUrn = rowNode.getItemUrn();
        let queryParams = this.configurationStateMachine.getFullConfiguration();

        queryParams.rootId = rowNode.getDmsId();
        queryParams.depth = depth;
        BomDataController.BulkBomLoader.loadBulkBom(itemUrn, endPointLink, queryParams).then((bulkBom) => {
            BomDataController.BomGraphBuilder.populateBomGraph(bulkBom, this.currentViewDef, this.bomGraph);
            this.fillTableFromPath(row.path);
            this.bomTable.rows.forEach((row) => {
                let rowNode = this.bomGraph.getNode(row.nodeId);
                row.isExpandable = rowNode.getOutDegree() > 0;
            });
            deferredObj.resolve();
        });

        return deferredObj.promise;
    }

    /**
     * @ngdoc method
     * @name Controllers.workspaceItem.BomDataController#populateInitialBom
     * @methodOf Controllers.workspaceItem.BomDataController
     * @description Loads BOM data upto the specfied initial depth, updates the
	 * configuration state machine using the information from the fetched payload,
	 * and populates `this.bomGraph` and `this.bomTable` from the data.
     *
     * @param {String} `itemUrn` The urn of the item for which the Bom is
     * being populated.
     * @param {String} `bulkEndpointLink` the link to which to make the request.
     * @param {Object} `queryParams` the parameters to be sent to the endpiont.
     *
     * @returns {Promise} a promise that eventually resolves to the urn of the root
     * item.
     */
    populateInitialBom(itemUrn, bulkEndpointLink, queryParams) {
        let deferredObj = BomDataController.$q.defer();

        queryParams.depth = this.getInitDepth();
        BomDataController.BulkBomLoader.loadBulkBom(itemUrn, bulkEndpointLink, queryParams).then((bulkBom) => {
            this.updateConfiguration(bulkBom.getDmsId(), bulkBom.getConfigDate(), bulkBom.getConfigBias());
            this.bomGraph.setRootNodeId(bulkBom.getRootNodeId());
            BomDataController.BomGraphBuilder.populateBomGraph(bulkBom, this.currentViewDef, this.bomGraph);
            this.fillTableFromPath(BomPath.EmptyPath());
            deferredObj.resolve(this.bomGraph.getRootNode().getItemUrn());
        });

        return deferredObj.promise;
    }

    /**
     * @ngdoc method
     * @name Controllers.workspaceItem.BomDataController#loadAttachments
     * @methodOf Controllers.workspaceItem.BomDataController
     * @description Loads the attachments for the bom graph using the bulk attachment endpoint.
     * Sends a list of item urns and gets the attachment associated with them and then updates
     * the bom graph appropriately.
     *
     * @returns {Promise} a promise that eventually resolves once all the attachments has been
     * loaded.
     */
    loadAttachments() {
        let deferred = BomDataController.$q.defer();
        let attachmentField = this.currentViewDef.getFieldWithSemantics(BomUIFieldSemantics.ATTACHMENTS);
        let attachmentFieldId = attachmentField.getUrn();
        let attachmentLink = this.bomGraph.getRootNode().getField(attachmentFieldId).getValue().attachmentLink;
        let urnList = this.bomGraph.getNodeUrnList();
        let chunkSize = 24;
        let requestSize = 6;

        this.processListInChunks(chunkSize, urnList, (chunk, message) => {
            let itemCount = 0;
            for (let i = 0; i < chunk.length; i += requestSize) {
                let smallerChunk = chunk.slice(i, i + requestSize);
                BomDataController.BomBulkAttachmentLoader.loadBulkAttachment(smallerChunk, attachmentLink).then((bulkAttachment) => {
                    bulkAttachment.getAttachmentLists().forEach((bomAttachmentList, itemId) => {
                        let fieldValue = this.bomGraph.getNode(itemId).getField(attachmentFieldId).getValue();
                        fieldValue.count = bomAttachmentList.getSize();
                        fieldValue.attachments = bomAttachmentList;
                    });
                    itemCount = itemCount + smallerChunk.length;
                    if (itemCount === chunk.length) {
                        BomDataController.EventService.send(message);
                    }
                });
            }
        }, (chunkIndex) => {
            return BomDataController.BomMessageService.getAttachmentChunkRecieved(`${chunkIndex}`);
        }).then(() => {
            deferred.resolve();
        });

        return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name Controllers.workspaceItem.BomDataController#handleBomBulkLoading
     * @methodOf Controllers.workspaceItem.BomDataController
     * @description Handles the bulk loading of the bom.
     *
     * @param {String} `toplineUrn` the urn of the top line item.
     * @param {Object} `toplineConfigurationParams` the configuration for the top line of BOM.
     *
     * @returns {Promise} a promise that eventually to the urn of the root item in the bom.
     */
    handleBomBulkLoading(toplineUrn, toplineConfigurationParams) {
        let deferred = BomDataController.$q.defer();

        this.populateInitialBom(toplineUrn, this.itemObj.getBomRootLink(), toplineConfigurationParams).then((rootItemUrn) => {
            this.loadSubAssembly(this.bomTable.getRowForPath(BomPath.EmptyPath()), undefined).then(() => {
                if (this.currentViewDef.hasAttachmentField()) {
                    this.loadAttachments().then(() => {
                        deferred.resolve(rootItemUrn);
                    });
                } else {
                    deferred.resolve(rootItemUrn);
                }
            });
        });

        return deferred.promise;
    }
}

let BomDataControllerFactory = ($q, ModelsManager, EventService, UrnParser, BomTable, BomMessageService, BulkBomLoader, BomGraphBuilder, LocalUserStorageService, BomTableRowBuilder, BomBulkAttachmentLoader) => {
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

export default BomDataControllerFactory;
