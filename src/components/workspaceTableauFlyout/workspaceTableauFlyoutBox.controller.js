/**
 * @ngdoc object
 * @name Controllers.WorkspaceTableauFlyoutBoxController
 *
 * @description This controller is attached to the flyout
 *
 * ##Dependencies
 *
 */
class WorkspaceTableauFlyoutBoxController {

	/*
	 * @ngdoc method
	 * @name Controllers.WorkspaceTableauFlyoutBoxController#constructor
	 * @methodOf Controllers.WorkspaceTableauFlyoutBoxController
	 * @description The class constructor
	 */
	constructor($scope, $rootScope, ParentController, $flyoutInstance, _) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.ParentController = ParentController;
		this.$flyoutInstance = $flyoutInstance;
		this._ = _;

		this.$scope.$on('$destroy', () => {
			// nothing to destroy yet
		});

		/**
		 * @ngdoc property
		 * @name Controllers.WorkspaceTableauFlyoutBoxController#groups
		 * @propertyOf Controllers.WorkspaceTableauFlyoutBoxController
		 * @description The groups object containing groups and fields of Available Columns
		 */
		this.groups = angular.copy(ParentController.columns);

		/**
		 * @ngdoc property
		 * @name Controllers.WorkspaceTableauFlyoutBoxController#fields
		 * @propertyOf Controllers.WorkspaceTableauFlyoutBoxController
		 * @description The groups object containing fields in Shown Columns
		 */
		this.fields = [];

		/**
		 * @ngdoc property
		 * @name Controllers.WorkspaceTableauFlyoutBoxController#isPerformingAction
		 * @propertyOf Controllers.WorkspaceTableauFlyoutBoxController
		 * @description Prevent user from clicking buttons once they already did
		 */
		this.isPerformingAction = false;

		/**
		 * @ngdoc method
		 * @name Controllers.WorkspaceTableauFlyoutBoxController#saveFlyout
		 * @methodOf Controllers.WorkspaceTableauFlyoutBoxController
		 * @description perform the save action
		 */
		this.saveFlyout = () => {
			this.isPerformingAction = true;
			ParentController.saveWorkspaceTableau(this.getSelectedColumns());
			this.$flyoutInstance.cancel();
		};

		/**
		 * @ngdoc method
		 * @name Controllers.WorkspaceTableauFlyoutBoxController#saveFlyout
		 * @methodOf Controllers.WorkspaceTableauFlyoutBoxController
		 * @description perform the cancel action
		 */
		this.cancelFlyout = () => {
			this.$flyoutInstance.cancel();
		};

		/**
		 * @ngdoc method
		 * @name Controllers.WorkspaceTableauFlyoutBoxController#saveFlyout
		 * @methodOf Controllers.WorkspaceTableauFlyoutBoxController
		 * @description get the selected columns of this tableau
		 */
		this.getSelectedColumns = () => {
			let visibleFields = [];
			let newDisplayOrder = 0;

			// sorting fields before assign the new display order
			this.fields.sort((a,b) => {
				return a.displayOrder - b.displayOrder;
			});

			// adding the columns that remain selected in SHOWN COLUMNS and filters
			_.each(this.fields, (field) => {
				if (field.visible) {

					field.displayOrder = newDisplayOrder;
					newDisplayOrder++;

					visibleFields.push(angular.copy(field));
				} else if (angular.isDefined(field.filter)) {
					// saving the filter that are not selected
					delete field.displayOrder;
					visibleFields.push(angular.copy(field));
				}
			});

			// adding the new columns selected in AVAILABLE COLUMNS
			_.each(this.groups, (group) => {
				_.each(group.fields, (field) => {
					if (field.visible) {

					field.displayOrder = newDisplayOrder;
					newDisplayOrder++;

					visibleFields.push(angular.copy(field));
					} else if (angular.isDefined(field.filter)) {
						// saving the filter that are not selected
						visibleFields.push(angular.copy(field));
					}
				});
			});

			return {array: visibleFields};
		};

		this.initialization = () => {
			// initializing the data of SHOWN COLUMNS and AVAILABLE COLUMNS
			_.each(this.groups, (group, index) => {
				let newGroup = angular.copy(group);
				newGroup.fields = [];
				_.each(group.fields, (field) => {
					// separated the SHOWN COLUMNS from AVAILABLE COLUMNS
					if (angular.isDefined(field.displayOrder)) {
						this.fields.push(field);
					} else {
						// unckeck the filters in AVAILABLE COLUMNS
						if (angular.isDefined(field.filter)) {
							field.visible = false;
						}
						newGroup.fields.push(field);
					}
				});
				this.groups[index] = newGroup;
			});
		};

		this.initialization();
	}
}

export default WorkspaceTableauFlyoutBoxController;