'use strict';

angular.module('plm360.workspaceItems', [])

/**
 * @ngdoc object
 * @name Controllers.WorkspaceItemsController
 *
 * @description This controller corresponds to /workspaceItems/{workspaceId}.
 *
 * ##Dependencies
 *
 */
.controller('WorkspaceItemsController', ['$scope', '$rootScope', '$log', '$state', '$stateParams', '$location', '$window', '$q', 'EventService', 'ModelsManager', 'LocalizationService', '$timeout', '$mdSidenav', '$mdComponentRegistry', 'uiGridConstants', 'FieldTypes', '_', 'PLMPermissions', function ($scope, $rootScope, $log, $state, $stateParams, $location, $window, $q, EventService, ModelsManager, LocalizationService, $timeout, $mdSidenav, $mdComponentRegistry, uiGridConstants, FieldTypes, _, PLMPermissions) {
	// listeners IDs
	var viewsListenerId;
	var refreshViewTableau;
	var workspaceListenerId;
	var currentUserListenerId;
	var itemsListenerId;
	var workspacePermissionErrorListenerId;
	var workspaceTableauUpdateListener;

	/**
  * @ngdoc property
  * @name Controllers.WorkspaceItemsController#regExpUrnUnique
  * @propertyOf Controllers.WorkspaceItemsController
  * @description Reg exp used to transform urn into a valid field ID.
  */
	var regExpUrnUnique = /(\.|\:)+/g;

	// flag to check whether we have the metadata, and holds metadata
	$scope.workspaceMetadata = false;

	/**
  * @ngdoc property
  * @name Controllers.WorkspaceItemsController#getTableauToDisplay
  * @propertyOf Controllers.WorkspaceItemsController
  * @description A tableau to display at the dropdow of tableaus (this logic is separated so be able to test it)
  */
	$scope.getTableauToDisplay = function (allTableaus) {

		// loading the default tableau at the action dropdown
		var tableau = _.find(allTableaus.tableaus, function (tableauObj) {
			return tableauObj.type === 'DEFAULT';
		});
		// showing the first tableau if it doesn´t have a DEFUALT one
		if (!angular.isDefined(tableau)) {
			tableau = _.sortBy(allTableaus.tableaus, function (tableauObj) {
				return tableauObj.title;
			}).shift();
		}

		return tableau;
	};

	/**
  * @ngdoc method
  * @name Controllers.WorkspaceItemsController#ngInit
  * @methodOf Controllers.WorkspaceItemsController
  * @description Initialization function
  */
	$scope.init = function () {
		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#workspaceId
   * @propertyOf Controllers.WorkspaceItemsController
   * @description The workspace Id of the current selected workspace
   */
		$scope.workspaceId = $stateParams.workspaceId;

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#workspaceObj
   * @propertyOf Controllers.WorkspaceItemsController
   * @description The workspace object
   */
		$scope.workspaceObj = false;

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#bundle
   * @propertyOf Controllers.WorkspaceItemsController
   * @description Ties to localization bundle of rootScope
   */
		$scope.bundle = $rootScope.bundle;

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#viewName
   * @propertyOf Controllers.WorkspaceItemsController
   * @description The name of the currently selected view
   */
		$scope.viewName = '';

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#viewId
   * @propertyOf Controllers.WorkspaceItemsController
   * @description The id of the currently selected view
   */
		$scope.viewId = null;

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#defaultViewId
   * @propertyOf Controllers.WorkspaceItemsController
   * @description The id of the default view
   */
		$scope.defaultViewId = null;

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#views
   * @propertyOf Controllers.WorkspaceItemsController
   * @description An object containing the list of all views available in this workspace
   */
		$scope.views = [];

		// Listeners to the new tableau (old view objects based on reports)
		viewsListenerId = EventService.listen('workspaceTableau:' + $scope.workspaceId + ':getAllTableauDone', function (event, allTableaus) {
			EventService.unlisten(viewsListenerId);

			allTableaus.tableaus = _.each(allTableaus.tableaus, function (tableau) {
				// backward compatibility
				tableau.id = parseInt(tableau.link.slice(tableau.link.lastIndexOf('/') + 1, tableau.link.length));
			});

			var tableau = $scope.getTableauToDisplay(allTableaus);

			$scope.views = allTableaus.tableaus;
			$scope.viewId = tableau.id;
			$scope.defaultViewId = tableau.id;

			$scope.viewChange($scope.viewId);
		}, true);
		ModelsManager.getAllWorkspaceTableaus($stateParams.workspaceId);

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#viewData
   * @propertyOf Controllers.WorkspaceItemsController
   * @description The metadata of the current view
   */
		$scope.viewData = {};

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#viewsFields
   * @propertyOf Controllers.WorkspaceItemsController
   * @description The available fields to be selected
   */
		// $scope.viewsFields = WorkspaceViewsFields.originalElement;
		// _.each($scope.viewsFields, function (value, key) {
		// 	$scope.viewsFields[LocalizationService.translate(key)] = value;
		// 	delete $scope.viewsFields[key];
		// 	_.each(value, function (field) {
		// 		$scope.viewsFieldsFlat.push(field);
		// 	});
		// });

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#viewDirty
   * @propertyOf Controllers.WorkspaceItemsController
   * @description A boolean flag set to true or false if the current view has been modified
   */
		// $scope.viewDirty = false;

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#viewsShown
   * @propertyOf Controllers.WorkspaceItemsController
   * @description The flag representing whether the list of views are displayed
   */
		// $scope.viewsShown = false;

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#pageNumber
   * @propertyOf Controllers.WorkspaceItemsController
   * @description The page to fetch data from
   */
		$scope.pageNumber = 0;

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#itemQuantity
   * @propertyOf Controllers.WorkspaceItemsController
   * @description Amount of items to fetch
   */
		$scope.itemQuantity = 100;

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#tableData
   * @propertyOf Controllers.WorkspaceItemsController
   * @description An array holding the parsed data for the table
   */
		$scope.tableData = {
			columns: [],
			rows: []
		};

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#workspaceName
   * @propertyOf Controllers.WorkspaceItemsController
   * @description The name of the workspace that these items belong to
   */
		$scope.workspaceName = '';

		// If the user doesn't have 'View items' permission for this
		// workspace, go to the dashboard and show the permission error
		// modal
		workspacePermissionErrorListenerId = EventService.listen('workspaceInstance:' + $scope.workspaceId + ':permissionError', function () {
			$state.go('dashboard');
			EventService.send('workspaceInstance:' + $scope.workspaceId + ':permissionDenied', $scope.workspaceId);
		});

		workspaceListenerId = EventService.listen('workspaceInstance:' + $scope.workspaceId + ':done', function (event, WorkspaceObj) {
			$scope.workspaceName = WorkspaceObj.getDisplayName();
			$scope.workspaceObj = WorkspaceObj;
		}, true);

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#dateOptions
   * @propertyOf Controllers.WorkspaceItemsController
   * @description The options for calendar
   */
		$scope.dateOptions = {
			'year-format': 'yyyy',
			'starting-day': 1
		};

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#dateFormat
   * @propertyOf Controllers.WorkspaceItemsController
   * @description Stores the date format
   */
		$scope.dateFormat = 'yyyy';

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#dateAndHourFormat
   * @propertyOf Controllers.WorkspaceItemsController
   * @description Stores the date format, plus hour format
   */
		$scope.dateAndHourFormat = 'yyyy hh:mm a';

		/**
   * @ngdoc property
   * @name Controllers.WorkspaceItemsController#hasAddItemsPermission
   * @propertyOf Controllers.WorkspaceItemsController
   * @description Flag representing the user permissions for adding items in the workspace.
   */
		$scope.hasAddItemsPermission = false;

		currentUserListenerId = EventService.listen('currentUser:currentUser:done', function (event, UserObj) {
			$scope.dateFormat = UserObj.getDateFormat();
			$scope.dateAndHourFormat = UserObj.getDateFormat() + ' hh:mm a';

			// TODO: We should change this approach and use the is-permitted directive, it was not used at this stage, because
			// it has some issues when the evaluated value is received after the element was removed.

			// is-permitted directive problem:

			// The value required to enable/disable the button is the boolean returned by the UserObj.hasPermission method.
			// This value is retrieved after the directive's html was rendered, so the button element is removed anyway even if finally
			// the value is truthy; the directive observes ($observe) the workspace id value for changes but not the isPermitted arg,
			// we can add this functionality and observe as well this argument but since the element was already removed, we face a new
			// controversy: we could change the directive to save the element's parent, and append it again once we know that it is permitted
			// or hide the element.
			// The problem with the first approach is that we should know the position in which the element used to be, to know whether we should
			// appending it, prepending it, or whatever. The other solution would be to change the way we remove the element, and
			// not removing it, but hiding it instead. I would vote for this last one.
			// Since the directive is already being used, any change to it would require extra care to not break stuff somewhere.

			$scope.hasAddItemsPermission = UserObj.hasPermission(PLMPermissions.ADD_ITEMS);
		}, true);

		workspaceTableauUpdateListener = EventService.listen('workspaceTableau:' + $scope.workspaceId + ':update', function (evt, currentConfig) {
			var wtLink = ModelsManager.getAppModel().getWorkspaceTableau($scope.workspaceId) + '/' + $scope.viewId;
			EventService.send('workspaceTableau:' + $scope.workspaceId + ':updateTableau', wtLink, currentConfig);
		});
		// refreshing the view after update from flyout
		refreshViewTableau = EventService.listen('workspaceTableau:' + $scope.workspaceId + ':updateDone', function (evt) {
			$scope.viewChange($scope.viewId);
		});
		ModelsManager.getWorkspace($stateParams.workspaceId);
		ModelsManager.getCurrentUser();
	};

	/**
  * @ngdoc method
  * @name Controllers.WorkspaceItemsController#triggerAddItem
  * @methodOf Controllers.WorkspaceItemsController
  * @description Navigates to the create item view
  */
	$scope.triggerAddItem = function () {
		if ($scope.hasAddItemsPermission) {
			$state.go('add-item', {
				workspaceId: $scope.workspaceId,
				itemId: null
			});
		}
	};

	/**
  * @ngdoc method
  * @name Controllers.WorkspaceItemsController#viewChange
  * @methodOf Controllers.WorkspaceItemsController
  * @description Handles view change to reset the data
  *
  * @param {integer} viewLink The Id of the view to be loaded
  */
	$scope.viewChange = function (viewId) {
		if (!$scope.workspaceObj) {
			$timeout(function () {
				$scope.viewChange(viewId);
			}, 0);
			return;
		}

		$scope.workspaceObj.getSectionsMeta().then(function () {
			$scope.workspaceMetadata = $scope.workspaceObj.getSectionsMetadata();
			$scope.tableData.columns = [];
			$scope.viewId = viewId;
			$scope.selectedFilterColumns = $scope.viewData.displayFieldsList;

			$scope.viewName = _.find($scope.views, function (view) {
				return view.id === $scope.viewId;
			}).title;

			$scope.getWorkspaceItemsData();
		});
	};

	/**
  * @ngdoc method
  * @name Controllers.WorkspaceItemsController#isViewSelected
  * @methodOf Controllers.WorkspaceItemsController
  * @description Checks whether a view is selected, (technically this is not a method of the controller but of
  * the $scope), left it this way beacuse of ngdoc failure
  */
	$scope.isViewSelected = function (viewId) {
		if (angular.isDefined($scope.viewId)) {
			return viewId === $scope.viewId ? 'selected' : '';
		}
	};

	$scope.currentOrder;
	$scope.currentColumnId;

	/**
  * @ngdoc method
  * @name Controllers.WorkspaceItemsController#getWorkspaceItemsData
  * @methodOf Controllers.WorkspaceItemsController
  * @description THIS IS A TEMPORARY METHOD UNTIL THIS CONTROLLER
  * GETS TRANSLATED MOVED TO ES6.
  *
  * TODO There's a lot more cleanup that needs to be done in this messy controller :(
  */
	$scope.getWorkspaceItemsData = function (order, columnId) {
		var deferred = $q.defer();

		columnId = angular.isDefined(columnId) ? columnId.split('-').pop() : undefined;

		if (order !== $scope.currentOrder || columnId !== $scope.currentColumnId) {
			// Assigns the new vars locally
			$scope.currentOrder = order;
			$scope.currentColumnId = columnId;

			$scope.pageNumber = 1;

			// Resets the data
			$scope.tableData.rows = [];
		} else {
			++$scope.pageNumber;
		}

		var itemsListenerId = EventService.listen('items:' + $scope.workspaceId + ':done', function (event, obj) {
			EventService.unlisten(itemsListenerId);
			// Pull from service which configuration need to show
			var workspaceTableau = EventService.listen('workspaceTableau:' + $scope.workspaceId + '@' + $scope.viewId + ':getTableauDone', function (event, tableauConfig) {
				EventService.unlisten(workspaceTableau);
				// This is a bit ugly, but will get better once this is moved to an ES6 promise
				if ($scope.parseWorkspaceItems(obj.getFullList(), $scope.itemQuantity, tableauConfig)) {
					deferred.resolve();
				} else {
					deferred.reject();
				}
			}, true);
			ModelsManager.getWorkspaceTableau($scope.workspaceId, $scope.viewId, false);
		});
		ModelsManager.getItems($scope.workspaceId, $scope.viewId, order, columnId, $scope.pageNumber, $scope.itemQuantity);

		return deferred.promise;
	};

	/**
  * @ngdoc method
  * @name Controllers.WorkspaceItemsController#parseWorkspaceItems
  * @methodOf Controllers.WorkspaceItemsController
  * @description Parses the list of items fetched from the endpoint, constrained to the view, for proper displaying in the view
  *
  * @param {Object} 	data 			The list of items
  * @param {Integer}	itemQuantity 	The amount of items to be retrieved from each batch
  * @param {Object} 	tableau 		The data from the backend
  */
	$scope.parseWorkspaceItems = function (data, itemQuantity, tableau) {
		if (angular.isDefined(data)) {

			$scope.totalItemCount = data.total || 0;

			var columns = _.chain(tableau).map(function (group) {
				return _.chain(group.fields).filter(function (field) {
					// fields with no display order are filters
					return field.visible && angular.isDefined(field.displayOrder);
				}).map(function (field) {
					return {
						index: field.displayOrder,
						id: field.field.urn.replace(regExpUrnUnique, '-'),
						urn: field.field.urn,
						displayName: field.field.title,
						sort: field.sort ? field.sort : undefined
					};
				}).value();
			}).flatten().sortBy('index').value();

			_.each(columns, function (column, columnIndex) {
				// If the column header is already defined, don't push it again
				var gridCol = _.find($scope.tableData.columns, function (existingCol) {
					return existingCol.field === column.id;
				});

				if (gridCol === undefined) {
					var uiGridCol = {
						displayName: column.displayName,
						suppressRemoveSort: true,
						field: column.id,
						urn: column.urn,
						cellTemplate: columnIndex === 0 ? 'itemsLinkRenderer' : 'itemsOtherRenderer'
					};

					if (angular.isDefined(column.sort)) {
						uiGridCol.sort = {
							direction: column.sort.direction.toLowerCase() === 'asc' ? 'asc' : 'desc',
							priority: 1 + (column.sort.order ? column.sort.order : 0)
						};
						// This is a previous comment:
						// --> Temporary, just to set the first column as the current one being sorted by (which is the default from the backend)
						$scope.currentOrder = uiGridCol.sort.direction;
						$scope.currentColumnId = column.id;
					}

					$scope.tableData.columns.push(uiGridCol);
				}
			});

			// Asighed the tableau to the scope of the controller for being able to access it inside the uigrid component
			$scope.tableau = tableau;
			$scope.tableauCallback = 'workspaceTableau:' + $scope.workspaceId + ':update';

			// Open tableau configuration widget
			var uiGridColEmpty = {
				displayName: '',
				name: 'columnButtton',
				field: '',
				visible: true,
				enableSorting: false,
				enableFiltering: false,
				enableHiding: false,
				enableColumnResizing: false,
				width: 40,
				headerCellTemplate: '<workspace-tableau-flyout columns="grid.appScope.tableau" callback="grid.appScope.tableauCallback" />'
			};
			$scope.tableData.columns.push(uiGridColEmpty);

			// temporarily holding parsed rows
			var parsedRows = [];
			if ($scope.pageNumber > 1) {
				parsedRows = $scope.tableData.rows;
			}

			var processField = function processField(fieldId, field, fieldDef, item) {
				var fieldValue = field.value === '' ? '' : field.value;
				var fieldType = FieldTypes.NOOB;
				var itemId = item && item.item && item.item.link && item.item.link.substring(item.item.link.lastIndexOf('/') + 1);
				fieldType = fieldDef.fieldMetadata.type.link;
				fieldType = parseInt(fieldType.substring(fieldType.lastIndexOf('/') + 1));
				// well let's format the json so that our fieldView directive knows what to do
				// TODO: let's have the endpoint return properly
				if (fieldType === FieldTypes.MULTISELECT || fieldType === FieldTypes.MULTISELECT_LINKED) {
					// multiselect currently is using formatted html with <BR>
					var values = fieldValue.split('<BR/>');
					_.each(values, function (val, ind) {
						values[ind] = {
							title: val
						};
					});
					fieldValue = values;
				} else if (fieldType === FieldTypes.IMAGE) {
					// images only has the id number in this payload, let's construct something
					if (fieldValue !== '') {
						item.fields.forEach(function (val, index) {
							if (val.value === fieldValue) {
								$scope.tableData.columns[index].cellTemplate = 'itemsThumbnailRenderer';

								if (index === 0) {
									$scope.tableData.columns[0].cellTemplate = 'itemsLinkedThumbnailRenderer';
								}
							}
						});
						fieldValue = {
							link: '/api/v2/workspaces/' + $scope.workspaceId + '/items/' + itemId + '/field-values/' + field.id + '/image/' + fieldValue
						};
						fieldValue.listMode = 1;
					} else {
						fieldType = FieldTypes.NOOB;
					}
				} else if (fieldType === FieldTypes.FLASH) {
					// flashes only has the id number in this payload, let's construct something
					if (fieldValue !== '') {

						fieldValue = {
							link: '/api/v2/workspaces/' + $scope.workspaceId + '/items/' + itemId + '/field-values/' + field.id + '/image/' + fieldValue + '?attachment=1'
						};
					} else {
						fieldType = FieldTypes.NOOB;
					}
				}
				return [fieldType, fieldValue];
			};

			// builds the data
			_.each(data.items, function (item, itemIndex) {
				// loops through each object available in the list
				var parsedItem = {};
				var parsedUiGridRow = {};

				_.each(item.fields, function (field, fieldIndex) {
					// loops through each object's list of fields
					var fieldValue = field.value === '' ? '' : field.value;

					var fieldType = FieldTypes.SINGLE_LINE_TEXT; // default to single line text for system fields

					_.each($scope.workspaceMetadata, function (section) {
						_.each(section.definition.fields, function (fieldDef) {
							var ret = [fieldType, fieldValue];
							if (fieldDef.type === 'FIELD') {
								if (fieldDef.urn === field.urn) {
									ret = processField(field.urn, field, fieldDef, item);
									fieldType = ret[0];
									fieldValue = ret[1];
								}
							} else {
								_.each(fieldDef.definition.fields, function (row) {
									_.each(row, function (col) {
										if (col !== null) {
											if (col.urn === field.urn) {
												ret = processField(col.urn, field, col, item);
												fieldType = ret[0];
												fieldValue = ret[1];
											}
										}
									});
								});
							}
						});
					});
					var fieldKeyId = field.urn.replace(regExpUrnUnique, '-');
					if (fieldIndex === 0) {
						parsedItem[fieldKeyId] = {
							value: fieldValue,
							metadata: {
								dataTypeId: fieldType === FieldTypes.IMAGE ? FieldTypes.IMG_THUMB : fieldType
							},
							href: $state.href('details', {
								tab: 'details',
								view: 'split',
								mode: 'view',
								itemId: item.urn
							}),
							urn: item.urn
						};
					} else {
						parsedItem[fieldKeyId] = {
							value: fieldValue,
							metadata: {
								dataTypeId: fieldType
							}
						};
					}

					parsedUiGridRow[fieldKeyId] = parsedItem[fieldKeyId];
				});

				parsedRows.push(parsedUiGridRow);
			});
			$scope.tableData.rows = parsedRows;
		}

		// Just temporary, until this method gets nuked
		if (_.size(data.items) < itemQuantity) {
			return false;
		} else {
			return true;
		}
	};

	$scope.$on('$destroy', function () {
		EventService.unlisten(viewsListenerId);
		EventService.unlisten(workspaceListenerId);
		EventService.unlisten(currentUserListenerId);
		EventService.unlisten(workspacePermissionErrorListenerId);
		EventService.unlisten(workspaceTableauUpdateListener);
		EventService.unlisten(refreshViewTableau);
	});
}]);
//# sourceMappingURL=WorkspaceItemsController.js.map
