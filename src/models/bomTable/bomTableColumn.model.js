/**
 * @ngdoc object
 * @name Models.BomTableColumn
 * @description Class defining the interface for bom table columns
 */
class BomTableColumn {

	/**
	 * @ngdoc method
	 * @name Models.BomTableColumn#constructor
	 * @methodOf Models.BomTableColumn
	 * @description initializes the Bom Table Column properties
	 */
	constructor(args = {}) {

		/**
		 * @ngdoc property
		 * @name Models.BomTableColumn#fieldId
		 * @propertyOf Models.BomTableColumn
		 * @description key to use to use to lookup a value in the display properties
		 */
		this.fieldId = (typeof args.fieldId === 'undefined') ? null : args.fieldId;

		/**
		 * @ngdoc property
		 * @name Models.BomTableColumn#displayName
		 * @propertyOf Models.BomTableColumn
		 * @description name to display in the column heading
		 */
		this.displayName = (typeof args.displayName === 'undefined') ? null : args.displayName;

		/**
		 * @ngdoc property
		 * @name Models.BomTableColumn#field
		 * @propertyOf Models.BomTableColumn
		 * @description field to look up in the row object
		 */
		this.field = (typeof args.field === 'undefined') ? `displayProperties['${this.fieldId}']` : args.field;

		/**
		 * @ngdoc property
		 * @name Models.BomTableColumn#enableSorting
		 * @propertyOf Models.BomTableColumn
		 * @description Boolean to enable sorting for this column
		 */
		this.enableSorting = (typeof args.enableSorting === 'undefined') ? false : args.enableSorting;

		/**
		 * @ngdoc property
		 * @name Models.BomTableColumn#suppressRemoveSort
		 * @propertyOf Models.BomTableColumn
		 * @description boolean to suppress sorting on a removal
		 */
		this.suppressRemoveSort = (typeof args.suppressRemoveSort === 'undefined') ? true : args.suppressRemoveSort;

		/**
		 * @ngdoc property
		 * @name Models.BomTableColumn#cellTemplate
		 * @propertyOf Models.BomTableColumn
		 * @description cell template to use for this column
		 */
		this.cellTemplate = (typeof args.cellTemplate === 'undefined') ? 'bomDefaultTemplate' : args.cellTemplate;

		/**
		 * @ngdoc property
		 * @name Models.BomTableColumn#width
		 * @propertyOf Models.BomTableColumn
		 * @description default width to use for this column
		 */
		this.width = (typeof args.width === 'undefined') ? '10%' : args.width;

		/**
		 * @ngdoc property
		 * @name Models.BomTableColumn#headerCellTemplate
		 * @propertyOf Models.BomTableColumn
		 * @description header cell template to use in the view
		 */
		this.headerCellTemplate = (typeof args.headerCellTemplate === 'undefined') ? null : args.headerCellTemplate;

		/**
		 * @ngdoc property
		 * @name Models.BomTableColumn#enableColumnResizing
		 * @propertyOf Models.BomTableColumn
		 * @description ability or not to resize the column
		 */
		this.enableColumnResizing = (typeof args.enableColumnResizing === 'undefined') ? true : args.enableColumnResizing;

		/**
		 * @ngdoc property
		 * @name Models.BomTableColumn#columnSemantics
		 * @propertyOf Models.BomTableColumn
		 * @description The BomUIFieldSemantics correspoding to this column
		 */
		this.columnSemantics = (typeof args.columnSemantics === 'undefined') ? null : args.columnSemantics;
	}
}

export default BomTableColumn;
