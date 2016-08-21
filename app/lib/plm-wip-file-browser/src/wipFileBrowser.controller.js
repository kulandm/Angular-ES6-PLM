'use strict';

System.get('com/autodesk/UnderscoreService.js');
System.get('com/autodesk/EventService.js');

/**
 * @ngdoc object
 * @name Controllers.WipFileBrowserController
 *
 * @description
 * ##Dependencies
 *
 */
class WipFileBrowserController {
	/*
	 * @ngdoc method
	 * @name Controllers.WipFileBrowserController#constructor
	 * @methodOf Controllers.WipFileBrowserController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope, $document, $timeout, $q, EventService, _, WipSearchService, WipApiService) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$document = $document;
		this.$timeout = $timeout;
		this.EventService = EventService;
		this._ = _;
		this.WipSearchService = WipSearchService;
		this.WipApiService = WipApiService;
		this.$q = $q;

		// Listeners IDs
		this.wipFileBrowserListenerId;

		/**
		 * @ngdoc property
		 * @name Controllers.WipFileBrowserController#breadcrumbData
		 * @propertyOf Controllers.WipFileBrowserController
		 * @description Stores breadcrumb data that are drilled down.
		 */
		this.breadcrumbData = [];

		/**
		 * @ngdoc property
		 * @name Controllers.WipFileBrowserController#selectedFiles
		 * @propertyOf Controllers.WipFileBrowserController
		 * @description Stores list of selected files.
		 */
		this.selectedFiles = new Set();

		/**
		 * @ngdoc property
		 * @name Controllers.WipFileBrowserController#isDataAvailable
		 * @propertyOf Controllers.WipFileBrowserController
		 * @description {Boolean} checks for data retrieved from the endpoint
		 */
		this.isDataAvailable = true;

		/**
		 * @ngdoc property
		 * @name Controllers.WipFileBrowserController#tableColumns
		 * @propertyOf Controllers.WipFileBrowserController
		 * @description Stores the details of the table's default fields.
		 */
		this.tableColumns = [{
			field: 'item',
			displayName: '',
			cellTemplate: 'checkboxTemplate',
			enableColumnResizing: false,
			width: '60'
		}, {
			field: 'item',
			displayName: this.$rootScope.bundle.wip.attachments.name,
			cellTemplate: 'linkTemplate'
		}, {
			field: 'createdUserName',
			displayName: this.$rootScope.bundle.wip.attachments.owner
		}, {
			field: 'item.type',
			displayName: this.$rootScope.bundle.wip.attachments.type,
			width: '80'
		}, {
			field: 'size',
			displayName: this.$rootScope.bundle.wip.attachments.size,
			cellFilter: 'fileSizeFilter',
			width: '80'
		}, {
			field: 'lastModifiedTime',
			displayName: this.$rootScope.bundle.wip.attachments.lastUpdated,
			cellTemplate: 'dateTemplate'
		}];

		/**
		 * @ngdoc property
		 * @name Controllers.WipFileBrowserController#searchTableColumns
		 * @propertyOf Controllers.WipFileBrowserController
		 * @description Stores the details of the table's default fields.
		 */
		this.searchTableColumns = [{
			field: 'item',
			displayName: '',
			cellTemplate: 'checkboxTemplate',
			enableColumnResizing: false,
			width: '60'
		}, {
			field: 'item',
			displayName: this.$rootScope.bundle.wip.attachments.name,
			cellTemplate: 'linkTemplate'
		}, {
			field: 'fileLocation',
			displayName: this.$rootScope.bundle.wip.attachments.location
		}];

		/**
		 * @ngdoc property
		 * @name Controllers.WipFileBrowserController#tableData
		 * @propertyOf Controllers.WipFileBrowserController
		 * @description Stores table data of the table's default fields.
		 */
		this.tableData = [];

		/**
		 * @ngdoc property
		 * @name Controllers.WipFileBrowserController#searchTableData
		 * @propertyOf Controllers.WipFileBrowserController
		 * @description Stores search table data of the search table's fields.
		 */
		this.searchTableData = [];

		EventService.send('wipFileBrowserItems:get');
		this.wipFileBrowserListenerId = EventService.listen(`wipFileBrowserItems:done`, (event, itemObj) => {
			this.parseWipFileBrowserContents(itemObj);
			this.isDataAvailable = this.tableData.length > 0;
		});

		$scope.$on('$destroy', () => {
			EventService.unlisten(this.wipFileBrowserListenerId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipFileBrowserController#parseWipFileBrowserContents
	 * @methodOf Controllers.WipFileBrowserController
	 * @description Initialize the table data.
	 *
	 * @param {Object} wipFileBrowserContents The items to be added to tableData.
	 *
	 * @return {Object} A promise that will be resolved when the table data is loaded.
	 */
	parseWipFileBrowserContents(wipFileBrowserContents) {
		// Iterate through each folder
		// TODO: filter by "properties.folderType.value === "groupfolder".
		this._.each(wipFileBrowserContents.getFolders(), (folder, elementIndex) => {
			this.tableData.push({
				item: {
					title: folder.title,
					type: 'Folder', // Need to hardcode as we know it is a folder and the value is not returned from api
					urn: folder.urn
				},
				createdUserName: folder.createUserName,
				size: '',
				lastModifiedTime: folder.lastModifiedTime
			});
		});

		// Iterate through each versioned file
		this._.each(wipFileBrowserContents.getVersionedFiles(), (file, elementIndex) => {
			this.tableData.push({
				item: {
					title: file.versionedFile.title,
					type: file.versionedFile.fileType,
					urn: file.lineage.urn, // Need to fetch the urn from lineage(origin)
					mimeType: file.versionedFile.mimeType
				},
				createdUserName: file.versionedFile.createUserName,
				size: file.versionedFile.fileSize,
				lastModifiedTime: file.versionedFile.lastModifiedTime
			});
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipFileBrowserController#browseFolder
	 * @methodOf Controllers.WipFileBrowserController
	 * @description Lists Files/Folders inside a specific folder after clicking it.
	 *
	 * @param {Object} folderObj The object that contains folder values.
	 */
	browseFolder(folderObj) {
		// Clear the tableData before pushing new files/folders in to it
		this.tableData = [];

		// Reset the isDataAvailable value to show preloader
		this.isDataAvailable = true;

		this.EventService.send('wipFileBrowserItems:get', folderObj);

		// Updates the breadcrumb data
		this.breadcrumbData.push(folderObj);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipFileBrowserController#selectFile
	 * @methodOf Controllers.WipFileBrowserController
	 * @description Lists Files/Folders inside a specific folder after clicking it.
	 *
	 * @param {Object} fileObj The object that contains file values.
	 */
	selectFile(fileObj) {
		if (fileObj.selected) {
			this.selectedFiles.add(fileObj);
		} else {
			this.selectedFiles.delete(this._.find([...this.selectedFiles], {
				urn: fileObj.urn
			}));
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipFileBrowserController#isChecked
	 * @methodOf Controllers.WipFileBrowserController
	 * @description Lists Files/Folders inside a specific folder after clicking it.
	 *
	 * @param {Object} fileObj The object that contains file values.
	 *
	 * @return {Object} The Selected File when the urn matches.
	 */
	isChecked(fileObj) {
		return this._.find([...this.selectedFiles], {
			urn: fileObj.urn
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipFileBrowserController#search
	 * @methodOf Controllers.WipFileBrowserController
	 * @description initialize data and call the searchSDK query.
	 *
	 * @param {String} query The object that contains values for search.
	 */
	search(query) {
		if (!query) {
			return; // return if no query
		}

		// initialize data
		this.isDataAvailable = true;
		this.searchTableData = [];
		this.searchView = true;

		let currentFolder = this.breadcrumbData[this.breadcrumbData.length - 1];
		let folderUrn = currentFolder ? currentFolder.urn : '';

		// Run the query & check that query was executed
		this.WipSearchService.query(query, folderUrn, this.searchCallback.bind(this));
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipFileBrowserController#searchCallback
	 * @methodOf Controllers.WipFileBrowserController
	 * @description Display the search results
	 *
	 * @param {String} err error message, null if no error
	 * @param {Object} data from endpoint
	 */
	searchCallback(err, data) {
		if (err) {
			this.cancelSearch();
			return;
		}

		let lineageUrns = [];
		let tempSearchTableData = data.queryResults.filter(item =>	// TODO: replace tempSearchTableData with this.searchTableData in PLM-14633, PLM-14633 will replace file location with data from search endpont which only will be available in next sprint.
			item.stringFields && item.stringFields['adsk.wip.lineageUrn']
		).map(item => {
			lineageUrns.push(item.stringFields['adsk.wip.lineageUrn'].value);
			return {
				item: {
					title: item.title.replace(/[]/g, ''), // Looks the same but are 2 different characters surrounding query
					urn: item.stringFields['adsk.wip.lineageUrn'].value,
					mimeType: item.stringFields['adsk.wip.mimeType'].value
				}
			};
		});

		// TODO: uncomment in PLM-14633
		// this.isDataAvailable = this.searchTableData.length > 0;
		// this.$scope.$apply();

		// return if no data is availabile.
		if (tempSearchTableData.length === 0) {
			this.isDataAvailable = false;
			return;
		}

		// Get parent of the file
		// TODO: remove in PLM-14633
		let getFilesAndFolderInfoPromises = [];
		let filesParentsMap = new Map();
		for (let i = 0; i < 2 && lineageUrns.length > 0; i++) { // handles the max 50 urn bug for entities/get and max 100 results in search data
			getFilesAndFolderInfoPromises.push(
				this.populateRelationsMap(filesParentsMap, lineageUrns.splice(0, 50)).then(
					data => this.populateRelationsMap(filesParentsMap, data.parentFoldersUrn)
				)
			);
		}

		this.$q.all(getFilesAndFolderInfoPromises).then(() => {
			tempSearchTableData.forEach(row => row.fileLocation = this.getParentTitle(row.item.urn, filesParentsMap));
			this.searchTableData = tempSearchTableData;
			this.isDataAvailable = this.searchTableData.length > 0;
		});
	}

	// TODO: Remove this function in PLM-14633
	/**
	 * @ngdoc method
	 * @name Controllers.WipFileBrowserController#populateRelationsMap
	 * @methodOf Controllers.WipFileBrowserController
	 * @description populates a map to link a file or folder to it's parents folder
	 *
	 * @param {Map} map The map to be populated
	 * @param {Array} urns A list of urns of items for finding their parents folder
	 */
	populateRelationsMap(map, urns) {
		return this.WipApiService.getFiles(urns).then(files => {
			files.data.versionedFiles.forEach(item => {
				map.set(item.lineage.urn, {
					urn: item.lineage.urn,
					parentUrn: item.lineage.parentFolderUrn,
					title: item.lineage.title
				});
			});

			files.data.folders.forEach(item => {
				map.set(item.urn, {
					urn: item.urn,
					parentUrn: item.parentFolderUrn,
					title: item.title
				});
			});

			let newParentsUrn = [];
			map.forEach((value, key, obj) => {
				if (value.parentUrn && !obj.has(value.parentUrn)) {
					newParentsUrn.push(value.parentUrn);
				}
			});

			return this.$q.resolve({
				map: map,
				parentFoldersUrn: this._.uniq(newParentsUrn)
			});
		});
	}

	// TODO: Remove this function in PLM-14633
	/**
	 * @ngdoc method
	 * @name Controllers.WipFileBrowserController#getParentTitle
	 * @methodOf Controllers.WipFileBrowserController
	 * @description Get the parent folder title base on the item's urn
	 *
	 * @param {String} itemUrn Urn of the item
	 * @param {Map} relationMap A Map to find their relationship
	 */
	getParentTitle(itemUrn, relationMap) {
		let item = relationMap.get(itemUrn);
		if (item && item.urn) {
			let parent = relationMap.get(item.parentUrn);
			if (parent && parent.title) {
				return parent.title;
			}
		}
		return this.$rootScope.bundle.breadcrumb.home;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipFileBrowserController#cancelSearch
	 * @methodOf Controllers.WipFileBrowserController
	 * @description return from search view
	 */
	cancelSearch() {
		this.searchView = false;
		this.searchQuery = '';
		this.searchTableData = [];
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipFileBrowserController#isLoading
	 * @methodOf Controllers.WipFileBrowserController
	 * @description determine if loading icon should be shown
	 */
	isLoading() {
		return (this.searchView && this.searchTableData.length === 0) || (!this.searchView && this.tableData.length === 0);
	}

}

export default WipFileBrowserController;
