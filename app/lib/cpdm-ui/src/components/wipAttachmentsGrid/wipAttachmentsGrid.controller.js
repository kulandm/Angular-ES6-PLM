/**
 * @ngdoc object
 * @name Controllers.WipAttachmentsGridController
 *
 * @description This controller is responsible for fetching the data for WIP
 * attachments.
 */
class WipAttachmentsGridController {

	/*
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#constructor
	 * @methodOf Controllers.WipAttachmentsGridController
	 * @description The class constructor.
	 */
	constructor($rootScope, $scope, $stateParams, $q, cpdmAttachmentsService, LocalizationService, FlyoutService, EventService, NotificationService, NotificationTypes, Attachment, AttachmentVersion, FieldTypes, FieldData, uiGridConstants, $mdDialog, FileOverviewService, ModelsManager, $window, _) {
		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$stateParams = $stateParams;
		this.$q = $q;
		this.Attachment = Attachment;
		this.AttachmentVersion = AttachmentVersion;
		this.FieldTypes = FieldTypes;
		this.FieldData = FieldData;
		this.EventService = EventService;
		this.FlyoutService = FlyoutService;
		this.cpdmAttachmentsService = cpdmAttachmentsService;
		this.NotificationService = NotificationService;
		this.NotificationTypes = NotificationTypes;
		this.$mdDialog = $mdDialog;
		this.FileOverviewService = FileOverviewService;
		this.ModelsManager = ModelsManager;
		this.$window = $window;
		this._ = _;

		/**
		 * @ngdoc property
		 * @name Controllers.WipAttachmentsGridController#isCurrentlySaving
		 * @propertyOf Controllers.WipAttachmentsGridController
		 * @description This would be telling if the user is currently performing the save action
		 */
		this.isCurrentlySaving = false;

		/**
		 * @ngdoc property
		 * @name Controllers.WipAttachmentsGridController#bulkSaveSuccessNotification
		 * @propertyOf Controllers.WipAttachmentsGridController
		 * @description This would be the value when all the items have been saved successfully
		 */
		this.bulkSaveSuccessNotification = $rootScope.bundle.notification.allAttachmentsSave.success;

		/**
		 * @ngdoc property
		 * @name Controllers.WipAttachmentsGridController#bulkErrorNotification
		 * @propertyOf Controllers.WipAttachmentsGridController
		 * @description This would be the value when all the items have not been saved successfully
		 */
		this.bulkErrorNotification = $rootScope.bundle.notification.allAttachmentsSave.error;

		/**
		 * @ngdoc property
		 * @name Controllers.WipAttachmentsGridController#bulkSuccessAndErrorNotification
		 * @propertyOf Controllers.WipAttachmentsGridController
		 * @description This would be the value when some items have been saves successfully and some have errors
		 */
		this.bulkSuccessAndErrorNotification = $rootScope.bundle.notification.allAttachmentsSave.errorAndSuccess;

		/**
		 * @ngdoc property
		 * @name Controllers.WipAttachmentsGridController#isAnySaveSuccess
		 * @propertyOf Controllers.WipAttachmentsGridController
		 * @description This is a boolean variable checking if there was any save which was a success
		 */
		this.isAnySaveSuccess = false;

		/**
		 * @ngdoc property
		 * @name Controllers.WipAttachmentsGridController#isAnySaveSuccess
		 * @propertyOf Controllers.WipAttachmentsGridController
		 * @description This is a boolean variable checking if there was any save which was a failure
		 */
		this.isAnySaveFailed = false;

		this.$scope.$watch('wipAttachmentsGridCtrl.isItemLocked', () => {
			// If item is not loaded then no need to update the row object property as it will be updated once loading is
			// complete.
			if (this.isItemLoaded) {
				this.updatePinDisplayState();
				this.updatePinnedVersion();
			}
		});

		/**
		 * @ngdoc property
		 * @name Controllers.WipAttachmentsGridController#fileOverviewHost
		 * @propertyOf Controllers.WipAttachmentsGridController
		 * @description The reference of the a360 host url that will be used to open file overview.
		 */
		this.fileOverviewHost;

		/**
		 * @ngdoc property
		 * @name Controllers.WipAttachmentsGridController#gridApiInterface
		 * @propertyOf Controllers.WipAttachmentsGridController
		 * @description The api interface of grid ui to control column
		 * visibility based on permissions.
		 */
		this.gridApiInterface;

		/**
		 * @ngdoc property
		 * @name Controllers.WipAttachmentsGridController#tableColumns
		 * @propertyOf Controllers.WipAttachmentsGridController
		 * @description list of columns of attachment grid.
		 */
		this.tableColumns = [];

		/**
		 * @ngdoc property
		 * @name Controllers.WipAttachmentsGridController#tableData
		 * @propertyOf Controllers.WipAttachmentsGridController
		 * @description list of rows of attachment grid.
		 */
		this.tableData = [];

		/**
		 * @ngdoc property
		 * @name Controllers.WipAttachmentsGridController#selectedItems
		 * @propertyOf Controllers.WipAttachmentsGridController
		 * @description Stores the selected items.
		 */
		this.selectedItems = new Set();

		this.checkWipAttachmentEditFeature().then(result => {
			/**
			 * @ngdoc property
			 * @name Controllers.WipAttachmentsGridController#isWipAttachmentEditEnabled
			 * @propertyOf Controllers.WipAttachmentsGridController
			 * @description It will store the result of feature toggle for wip attachments edit feature
			 * visibility based on permissions.
			 */
			this.isWipAttachmentEditEnabled = result;
			this.tableColumns[3].visible = result;
		});

		LocalizationService.init().then(() => {
			this.tableColumns = [
				{
					field: 'indicator',
					displayName: '',
					cellTemplate: 'indicatorTemplate',
					enableColumnResizing: false,
					enableSorting: false,
					// TODO width should be handled from template / styling instead of controller.
					width: '5'
				},
				{
					field: 'selection',
					headerCellTemplate: 'checkboxHeaderTemplate',
					cellTemplate: 'checkboxTemplate',
					enableColumnResizing: false,
					enableSorting: false,
					// TODO width should be handled from template / styling instead of controller.
					width: '70'
				},
				{
					field: 'fileInfo.name',
					displayName: $rootScope.bundle.wip.attachments.name,
					enableSorting: true,
					sort: {
						direction: uiGridConstants.DESC
					},
					cellTemplate: 'attachmentNameTemplate',
					// TODO width should be handled from template / styling instead of controller.
					width: '30%'
				},
				{
					field: 'pinningPolicy',
					fieldMeta: {},
					displayName: '',
					headerCellTemplate:'pinningHeaderTemplate',
					cellTemplate: 'pinningTemplate',
					dataType: FieldTypes.PICKLIST,
					width: '10%',
					options: {
						items: [
							{
								link: this.pinningPolicies.ON_LOCK,
								title: this.$rootScope.bundle.wip.attachments.onLock
							},
							{
								link: this.pinningPolicies.TO_VERSION,
								title: this.$rootScope.bundle.wip.attachments.toVersion
							},
							{
								link: this.pinningPolicies.FLOAT,
								title: this.$rootScope.bundle.wip.attachments.float
							}
						]
					},
					visible: false
				},
				{
					field: 'fileInfo.version',
					displayName: $rootScope.bundle.wip.attachments.version,
					dataType: FieldTypes.PICKLIST,
					cellTemplate: 'versionTemplate',
					width: '7%'
				},
				{
					field: 'fileInfo.createUserName',
					displayName: $rootScope.bundle.wip.attachments.createdBy
				},
				{
					field: 'fileInfo.fileType',
					displayName: $rootScope.bundle.wip.attachments.type,
					cellTemplate: 'attachmentTypeNameTemplate'
				},
				{
					field: 'fileInfo.fileSize',
					displayName: $rootScope.bundle.wip.attachments.size,
					cellFilter: 'fileSizeFilter'
				},
				{
					field: 'fileInfo.createTime',
					displayName: $rootScope.bundle.wip.attachments.createdOn,
					cellTemplate: 'attachmentDateTemplate'
				}
			];

			this.getData();
		});

		FileOverviewService.getHost().then((host) => {
			this.fileOverviewHost = host;
		});

		/**
		 * @ngdoc property
		 * @name Controllers.WipAttachmentsGridController#pinningPolicies
		 * @propertyOf Controllers.WipAttachmentsGridController
		 * @description The types of pin policies.
		 */
		this.pinningPolicies = {
			ON_LOCK: $rootScope.bundle.wip.attachments.onLock,
			TO_VERSION: $rootScope.bundle.wip.attachments.toVersion,
			FLOAT: $rootScope.bundle.wip.attachments.float
		};

		/**
		 * @ngdoc property
		 * @name Controllers.WipAttachmentsGridController#toolTipFlyout
		 * @propertyOf Controllers.WipAttachmentsGridController
		 *
		 * @description Flyout instance for the pin policy flyout
		 */
		this.toolTipFlyout = null;

		/**
		 * @ngdoc property
		 * @name Controllers.WipAttachmentsGridController#isItemLoaded
		 * @propertyOf Controllers.WipAttachmentsGridController
		 * @description A boolean variable to indicate the items are loaded.
		 */
		this.isItemLoaded;

		let removeAttachmentsListener = EventService.listen(`wipAttachment:${this.itemId}:remove`, () => {
			$mdDialog.show({
				templateUrl: 'components/wipAttachmentsDeleteDialog/wipAttachmentsDeleteDialog.html',
				controller: 'WipAttachmentsDeleteDialogController as WipAttachmentsDeleteDialogCtrl',
				locals: {
					totalItemsSelected: this.selectedItems.size
				}
			}).then(() => {
				$q.all(_.map([...this.selectedItems], (item) => {
					return this.Attachment.deleteAttachment(item.selfUrn).then(() => {
						this.NotificationService.addNotification(
							this.NotificationTypes.SUCCESS, `${item.fileInfo.name}${$rootScope.bundle.notification.singleRemove.success}`
						);
					}, () => {
						this.NotificationService.addNotification(
							this.NotificationTypes.ERROR, `${item.fileInfo.name}${$rootScope.bundle.notification.failed}`
						);
					});
				})).then(() => {
					this.getData();
					this.NotificationService.showNotifications();
				});
			});
		});

		let addAttachmentsListener = EventService.listen(`wipAttachment:${this.itemId}:add`, () => {
			this.getData().then(() => {
				NotificationService.showNotifications();
			});
		});

		let downloadAttachmentListener = EventService.listen(`wipAttachment:${this.itemId}:download`, () => {
			this.triggerDownload();
		});

		let saveListener = EventService.listen(`wipAttachment:${this.itemId}:save`, () => {
			this.performSave();
		});

		$scope.$on('$destroy', () => {
			EventService.unlisten(addAttachmentsListener);
			EventService.unlisten(downloadAttachmentListener);
			EventService.unlisten(removeAttachmentsListener);
			EventService.unlisten(saveListener);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#isTableRowInvalid
	 * @methodOf Controllers.WipAttachmentsGridController
	 * @description To check if a given table row has invalid state
	 *
	 * @param {Object} row Table row to check for invalid state
	 *
	 * @return {Boolean} True, if the given table row is invalid
	 */
	isTableRowInvalid(row) {
		return !!(row.pinningPolicy.serverError || row.fileInfo.serverError);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#isTableRowDirty
	 * @methodOf Controllers.WipAttachmentsGridController
	 * @description To check if a given table row has dirty state
	 *
	 * @param {Object} row Table row to check for dirty state
	 *
	 * @return {Boolean} True, if the given table row is dirty
	 */
	isTableRowDirty(row) {
		let editableFields = new Set();
		if (this.isWipAttachmentEditEnabled) {
			editableFields.add(row.pinningPolicy);
			editableFields.add(row.fileInfo.version);
		}

		return _.some([...editableFields], field => {
			return field.isDirty();
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#getDirtyRows
	 * @methodOf Controllers.WipAttachmentsGridController
	 * @description Get all dirty rows
	 *
	 * @return {Object} Array containing the dirty rows
	 */
	getDirtyRows() {
		return _.filter(this.tableData, row => this.isTableRowDirty(row));
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#toggleRowSelection
	 * @methodOf Controllers.WipAttachmentsGridController
	 * @description Add or delete selected items from selectedItems Set.
	 *
	 * @param {Object} row A uiGrid "row" object.
	 */
	toggleRowSelection(row) {
		if (row.isSelected) {
			this.selectedItems.add(row.entity);
		} else {
			this.selectedItems.delete(row.entity);

			if (this.gridApiInterface.selection.selectAll) {
				this.gridApiInterface.selection.selectAll = false;
			}
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#toggleAllSelection
	 * @propertyOf Controllers.WipAttachmentsGridController
	 * @description Toggle all selection state of the grid
	 */
	toggleAllSelection() {
		this.gridApiInterface.selection.selectAll = !this.gridApiInterface.selection.selectAll;

		if (this.gridApiInterface.selection.selectAll) {
			this.gridApiInterface.selection.selectAllRows();
		} else {
			this.gridApiInterface.selection.clearSelectedRows();
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#getData
	 * @propertyOf Controllers.WipAttachmentsGridController
	 * @description Get attachment data and populate table
	 */
	getData() {
		this.isItemLoaded = false;

		return this.cpdmAttachmentsService.getWipAttachments(this.workspaceId, this.itemId).then(wipAttachments => {
			if (wipAttachments.length) {
				// Concat all lineage urns into an array for WIP POST endpoint
				// Note: WIP endpoint cannot accept duplicate urns
				let lineageUrns = _.uniq(_.map(wipAttachments, wipAttachment => wipAttachment.lineageUrn));

				return this.Attachment.fetchAttachments(lineageUrns).then(response => {
					// Get the list of attachments from WIP
					let attachmentsInfo = response.data.versionedFiles;

					return this.$q.all(_.map(wipAttachments, wipAttachment => {
						let attachment = new this.Attachment(wipAttachment);
						let attachmentInfo = _.find(attachmentsInfo, info =>
							info.versionedFile.lineageUrn === attachment.getLineageUrn());

						// Store latest version info from WIP into model
						attachment.setLatestVersionInfo(attachmentInfo.versionedFile);

						if (attachment.getPinnedVersionUrn()) {
							return this.Attachment.fetchSingleAttachment(attachment.getPinnedVersionUrn()).then(pinnedVersionInfo => {
								attachment.setPinnedVersionInfo(pinnedVersionInfo.data.versionedFile);

								return {
									attachment: attachment,
									selfUrn: attachment.json.__self__,
									lineageUrn: attachment.getLineageUrn(),
									versionUrn: attachment.getPinnedVersionUrn(),
									latestVersion: attachment.getVersion(),
									pinningPolicy: this.isWipAttachmentEditEnabled ? this.buildPinningPolicyField(attachment) : {},
									fileInfo: {
										name: attachment.getPinnedTitle(),
										mimeType: attachment.getPinnedMimeType(),
										fileType: attachment.getPinnedFileType(),
										fileSize: attachment.getPinnedFileSize(),
										createUserName: attachment.getPinnedCreateUserName(),
										createTime: attachment.getPinnedCreateTime(),
										version: this.buildVersionField(attachment),
										versionNumber: (!attachment.getPinnedVersion() || attachment.isPinnedToLatestVersion()) ?
											attachment.getVersion() : attachment.getPinnedVersion(),
										parentFolderUrn: attachmentInfo.lineage.parentFolderUrn
									},
									onPinningPolicyChange: (row) => {
										this.showLatestVersion(row, attachment);
									}
								};
							});
						} else {
							return {
								attachment: attachment,
								selfUrn: attachment.json.__self__,
								lineageUrn: attachment.getLineageUrn(),
								versionUrn: attachment.getVersionUrn(),
								latestVersion: attachment.getVersion(),
								pinningPolicy: this.isWipAttachmentEditEnabled ? this.buildPinningPolicyField(attachment) : {},
								fileInfo: {
									name: attachment.getTitle(),
									mimeType: attachment.getMimeType(),
									fileType: attachment.getFileType(),
									fileSize: attachment.getFileSize(),
									createUserName: attachment.getCreateUserName(),
									createTime: attachment.getCreateTime(),
									version: this.buildVersionField(attachment),
									versionNumber: (!attachment.getPinnedVersion() || attachment.isPinnedToLatestVersion()) ?
										attachment.getVersion() : attachment.getPinnedVersion(),
									parentFolderUrn: attachmentInfo.lineage.parentFolderUrn
								},
								onPinningPolicyChange: (row) => {
									this.showLatestVersion(row, attachment);
								}
							};
						}
					}));
				});
			}
		}).then(results => {
			this.tableData = results || [];
			this.updatePinDisplayState();
			this.selectedItems.clear();
			this.gridApiInterface.selection.selectAll = false;
			this.isItemLoaded = true;
			// This will activate the navigation guard.
			this.$scope.$emit('activateNavigationGuard', this);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#updatePinDisplayState
	 * @propertyOf Controllers.WipAttachmentsGridController
	 * @description update pinning display state based on permission and pinning policy.
	 */
	updatePinDisplayState() {
		this._.each(this.tableData, (rowObject) => rowObject.showPin = this.isWipAttachmentEditEnabled ? this.showPin(rowObject.attachment.getPinningPolicy()) : null);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#updatePinnedVersion
	 * @propertyOf Controllers.WipAttachmentsGridController
	 * @description Updates the pinned version when the pinning policy is on Lock and the item enters the lock state
	 */
	updatePinnedVersion() {
		this._.each(this.tableData.filter(row =>
			row.attachment.getPinningPolicy() === this.pinningPolicies.ON_LOCK),
		onLockRow => {
			onLockRow.attachment.setPinnedVersion(onLockRow.attachment.getVersion());
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#showPin
	 * @propertyOf Controllers.WipAttachmentsGridController
	 * @description Helper method to determine whether or not to show the pin
	 * icon depending on the pinning policy and item lock state
	 *
	 * @param {String} pinningPolicy Pinning Policy of the attachment
	 *
	 * @return {Boolean} True, if pin icon should be shown
	 */
	showPin(pinningPolicy) {
		switch (pinningPolicy) {
			case this.pinningPolicies.ON_LOCK:
				return this.isItemLocked;

			case this.pinningPolicies.TO_VERSION:
				return true;

			case this.pinningPolicies.FLOAT:
				return false;

			default:
				return this.isItemLocked;
		}
	}
	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#buildPinningPolicyField
	 * @propertyOf Controllers.WipAttachmentsGridController
	 * @description Use FieldData to build Pinning Policy field
	 *
	 * @param {Object} attachment Attachment model to get information
	 *
	 * @return {Object} SelectionFieldData model
	 */
	buildPinningPolicyField(attachment) {
		return this.FieldData.fromFieldData(this.FieldTypes.SELECTION, {
			urn: attachment.getVersionUrn(),
			link: '',
			metadata: {
				dataTypeId: this.FieldTypes.SELECTION
			},
			originalValue: {
				link: attachment.getPinningPolicy() ||
					this.pinningPolicies.ON_LOCK,
				title: attachment.getPinningPolicy() ||
					this.$rootScope.bundle.wip.attachments.onLock
			},
			options: this.tableColumns[3].options,
			value: {
				link: attachment.getPinningPolicy() ||
					this.pinningPolicies.ON_LOCK,
				title: attachment.getPinningPolicy() ||
					this.$rootScope.bundle.wip.attachments.onLock
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#buildVersionField
	 * @propertyOf Controllers.WipAttachmentsGridController
	 * @description Use FieldData to build version field
	 *
	 * @param {Object} attachment Attachment model to get information
	 *
	 * @return {Object} SelectionFieldData model
	 */
	buildVersionField(attachment) {
		return this.FieldData.fromFieldData(this.FieldTypes.SELECTION, {
			urn: attachment.getPinnedVersionUrn() || attachment.getVersionUrn(),
			link: '',
			metadata: {
				dataTypeId: this.FieldTypes.SELECTION
			},
			originalValue: {
				link: attachment.getPinnedVersionUrn() || attachment.getVersionUrn(),
				title: (!attachment.getPinnedVersion() || attachment.isPinnedToLatestVersion()) ?
					`${attachment.getVersion()} ${this.$rootScope.bundle.wip.attachments.latest}` :
					attachment.getPinnedVersion()
			},
			options: {},
			value: {
				link: attachment.getPinnedVersionUrn() || attachment.getVersionUrn(),
				title: (!attachment.getPinnedVersion() || attachment.isPinnedToLatestVersion()) ?
					`${attachment.getVersion()} ${this.$rootScope.bundle.wip.attachments.latest}` :
					attachment.getPinnedVersion()
			},
			fieldMetadata: {
				picklistLoader: (optionLoader) => {
					attachment.getAllVersions().then(attachmentVersionList => {
						let versionOptions = _.map(attachmentVersionList, version => {
							return {
								link: version.getVersionUrn(),
								title: version.getVersionNumber() === attachment.getVersion() ?
									`${version.getVersionNumber()} ${this.$rootScope.bundle.wip.attachments.latest}` :
									version.getVersionNumber()
							};
						});
						optionLoader(versionOptions);
					});
				},
				loadOnEditMode: true
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#checkWipAttachmentEditFeature
	 * @methodOf Controllers.WipAttachmentsGridController
	 * @description Calls to check the wip attachment edit feature in feature toggle
	 *
	 * @return {Object} Promise after check completes
	 */
	checkWipAttachmentEditFeature() {
		let deferObj = this.$q.defer();

		let listenerId = this.EventService.listen('enabledFeatures:tenant:done', (event, obj) => {
			this.EventService.unlisten(listenerId);

			let features = obj.getDisplayableData();
			let wipAttachmentEdit = _.find(features.data, feature =>
				feature && feature.title === 'wip.attachment.edit');

			deferObj.resolve(!!wipAttachmentEdit);
		});

		this.ModelsManager.getEnabledFeatures();
		return deferObj.promise;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#triggerDownload
	 * @methodOf Controllers.WipAttachmentsGridController
	 * @description Download the selected files, hence clears selected rows.
	 *
	 * @param {Object} row Table row
	 *
	 * @return {Object} Promise
	 */
	triggerDownload(row) {
		let selectedItem = row ? row.entity : [...this.selectedItems][0];

		// Show download initiation notification
		this.NotificationService.addNotification(this.NotificationTypes.SUCCESS,
			`${selectedItem.fileInfo.name}${this.$rootScope.bundle.attachments.downloadStarted}`);
		this.NotificationService.showNotifications();

		let filename = selectedItem.attachment.hasExtension() ? '' :
			`${selectedItem.fileInfo.name.replace(' ', '+')}.${selectedItem.fileInfo.fileType}`;

		return this.Attachment.downloadAttachment(selectedItem.versionUrn, filename).then(response => {
			this.$window.location.href = `${response.data}&response-content-type=${encodeURIComponent('application/octet-stream')}`;
		}).then(() => {
			this.selectedItems.clear();
			this.gridApiInterface.selection.clearSelectedRows();
		}, () => {
			// Show download failed notification
			this.NotificationService.addNotification(this.NotificationTypes.ERROR,
				`${selectedItem.fileInfo.name}${this.$rootScope.bundle.attachments.downloadFailed}`);
			this.NotificationService.showNotifications();
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#performSave
	 * @methodOf Controllers.WipAttachmentsGridController
	 * @description Save the edited files
	 *
	 * @return {Object} Promise after all saves are done
	 */
	performSave() {
		this.isCurrentlySaving = true;
		this.isAnySaveSuccess = false;
		this.isAnySaveFailed = false;
		return this.$q.all(_.map(this.getDirtyRows(), row => {
			let selectedPinningPolicy = row.pinningPolicy.value.title;
			let saveData = {
				pinningPolicy: row.pinningPolicy.value.title,
				version: selectedPinningPolicy === this.$rootScope.bundle.wip.attachments.toVersion ?
					row.fileInfo.version.value.title.replace(`${this.$rootScope.bundle.wip.attachments.latest}`, '').trim() : null,
				versionUrn: selectedPinningPolicy === this.$rootScope.bundle.wip.attachments.toVersion ? row.fileInfo.version.value.link : null,
				__self__: row.selfUrn
			};

			return this.Attachment.saveAttachment(saveData).then(() => {
				this.isAnySaveSuccess = true;
				this.NotificationService.addNotification(this.NotificationTypes.SUCCESS, `${row.fileInfo.name}${this.$rootScope.bundle.notification.singleSave.success}`);
			}, () => {
				this.isAnySaveFailed = true;
				this.NotificationService.addNotification(this.NotificationTypes.ERROR, `${row.fileInfo.name}${this.$rootScope.bundle.notification.singleSave.error}`);
			});
		})).then(() => {
			let bulkEditNotification;
			this.EventService.send(`wipAttachment:${this.itemId}:saveDone`);

			if (this.isAnySaveSuccess && this.isAnySaveFailed) {
				bulkEditNotification = this.bulkSuccessAndErrorNotification;
			} else if (this.isAnySaveSuccess === true && this.isAnySaveFailed === false) {
				bulkEditNotification = this.bulkSaveSuccessNotification;
			} else if (this.isAnySaveSuccess === false && this.isAnySaveFailed === true) {
				bulkEditNotification = this.bulkErrorNotification;
			}

			this.NotificationService.showNotifications(null, bulkEditNotification);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#isViewState
	 * @methodOf Controllers.WipAttachmentsGridController
	 * @description Determine whether we're in view mode
	 *
	 * @return {Boolean} true if we are in view mode
	 */
	isViewState() {
		return this.$stateParams.mode === 'view';
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#showLatestVersion
	 * @methodOf Controllers.WipAttachmentsGridController
	 * @description Show tip version of the attachment if relevant conditions are satisfied
	 *
	 */
	showLatestVersion(row, attachment) {
		if (row.entity.pinningPolicy.value.title !== this.$rootScope.bundle.wip.attachments.toVersion && !this.isItemLocked) {
			row.entity.fileInfo.version.value = {
				link: attachment.getVersionUrn(),
				title: `${attachment.getVersion()} ${this.$rootScope.bundle.wip.attachments.latest}`
			};
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsGridController#isDirty
	 * @methodOf Controllers.WipAttachmentsGridController
	 * @description This function is required by plmNavigationGuard
	 *
	 * @return {Boolean} true if rows are dirty along with no save action has been triggered
	 */
	isDirty() {
		return (!!this.getDirtyRows().length && !this.isCurrentlySaving);
	}
}

export default WipAttachmentsGridController;
