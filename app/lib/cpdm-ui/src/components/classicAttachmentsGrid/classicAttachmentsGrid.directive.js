/**
 * @ngdoc directive
 * @name Directives.ClassicAttachmentsGrid
 * @restrict E
 *
 * @description Directive definition for cpdm attachment grid. This directive also listens for 'attachment:[dmsId]:refresh' event
 * to auto refresh itself.
 *
 * It accepts the following attributes:
 * ####-workspaceId: <String> the id of the workspace
 * ####-itemId: <String> the id of the item
 * ####-dateFormat: <Object> the date format to apply
 * ####-showUserInfo: <Function> the function that's called to display user summary
 * ####-selectedRowInfo: <Function> the function that's called to set selected row info
 *
 * @example
 * <doc:example>
 *   <doc:source>
 *      <classic-attachments-grid
 *          workspace-id="String"
 *          item-id="String"
 *          dateFormat="Object"
 *          show-user-info="Function"
 *          selected-row-info="Function">
 *      </classic-attachments-grid>
 *   </doc:source>
 * </doc:example>
 */
class ClassicAttachmentsGridDirective {

	/*
	 * @ngdoc method
	 * @name Directives.ClassicAttachmentsGrid#constructor
	 * @methodOf Directives.ClassicAttachmentsGrid
	 * @description The class constructor.
	 *
	 * @param {$timeout} angular $timeout service
	 */
	constructor($timeout) {
		this.$timeout = $timeout;
		this.restrict = 'E';
		this.replace = false;
		this.controller = 'ClassicAttachmentsGridController';
		this.templateUrl = 'components/classicAttachmentsGrid/classicAttachmentsGrid.html';
		this.scope = {
			workspaceId: '=',
			itemId: '=',
			dateFormat: '=',
			showUserInfo: '&',
			selectedRowInfo: '&'
		};

		ClassicAttachmentsGridDirective.$timeout = $timeout;
	}

	/**
	 * @ngdoc method
	 * @name Directives.ClassicAttachmentsGrid#link
	 * @methodOf Directives.ClassicAttachmentsGrid
	 * @description The link function
	 *
	 * @param {Object} Scope directive's scope
	 * @param {Object} element directive's element
	 */
	link(scope, element) {
		angular.element(window).bind('resize', (event) => {
			setHeight(element);
		});

		/**
		 * @ngdoc method
		 * @name Directives.ClassicAttachmentsGrid#setHeight
		 * @methodOf Directives.ClassicAttachmentsGrid
		 * @description Responsible for setting the height of the grid dynamically
		 *
		 * @param {Angular.Element} curElement The element which will be used
		 * for height calculation
		 */
		function setHeight(curElement) {
			ClassicAttachmentsGridDirective.$timeout(() => {
				// Gets the visible area in the browser screen
				var visibleHeight = window.innerHeight;

				// Reference for the header row
				var tableContainer = curElement[0].getElementsByClassName('ui-grid-header-canvas');

				var newHeight = parseInt(visibleHeight -
				tableContainer[0].getBoundingClientRect().top);

				// Gets the grid
				var uiGrid = angular.element(curElement[0].getElementsByClassName('ui-grid'));

				// Sets the height of the grid
				uiGrid.css('height', newHeight + 'px');
				uiGrid.css('overflow', 'hidden');
			}, 100);
		}

		setHeight(element);
	}

	static directiveFactory($timeout) {
		ClassicAttachmentsGridDirective.instance = new ClassicAttachmentsGridDirective($timeout);
		return ClassicAttachmentsGridDirective.instance;
	}
}

ClassicAttachmentsGridDirective.directiveFactory.$inject = ['$timeout'];
export default ClassicAttachmentsGridDirective;
