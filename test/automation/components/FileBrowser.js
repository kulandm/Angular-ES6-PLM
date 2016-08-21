/**
 * @ngdoc object
 * @name ViewTestsComponents.FileBrowser
 *
 * @description This component corresponds to File Browser on WIP attachments.
 *
 * ##Dependencies
 *
 */
function FileBrowser() {
	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.FileBrowser#fileBrowserDialog
	 * @propertyOf ViewTestsComponents.FileBrowser
	 * @description WebElement for FileBrowser.
	 */
	this.fileBrowserDialog = element(by.css('.wip-file-browser-dialog'));

	/**
	 * @name ViewTestsComponents.FileBrowser#getFileBrowserContainer
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns the file browser container element.
	 *
	 * @returns {Object} File browser container element.
	 */
	this.getFileBrowserContainer = function () {
		return this.fileBrowserDialog.element(by.css('.filebrowser-container'));
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getPreLoader
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns file browser pre-loader element.
	 *
	 * @returns {Object} File browser pre-loader element.
	 */
	this.getPreLoader = function () {
		return this.getFileBrowserContainer().element(by.css('.filebrowser-preloader'));
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getDialogButton
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns a file browser action button.
	 *
	 * @params {String} type The type of button required.
	 *
	 * @returns {Object} The required action button.
	 */
	this.getDialogButton = function (type) {
		return this.fileBrowserDialog.element(by.css('button[aria-label="' + type + '"]'));
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getTitle
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns the file browser dialog header title.
	 *
	 * @returns {Object} The file browser dialog header title.
	 */
	this.getTitle = function () {
		return this.fileBrowserDialog.element(by.css('.md-toolbar-tools')).getText();
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getToolbar
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns the file browser toolbar element.
	 *
	 * @returns {Object} The file browser toolbar element.
	 */
	this.getToolbar = function () {
		return this.fileBrowserDialog.element(by.css('.filebrowser-toolbar'));
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getSelectedItemsCount
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns the string of how many items are currently selected.
	 *
	 * @returns {Object} Text of how many items are selected.
	 */
	this.getSelectedItemsCount = function () {
		return this.getToolbar().getText();
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getBreadcrumb
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns the file browser breadcrumb.
	 *
	 * @returns {Object} The file browser breadcrumb element.
	 */
	this.getBreadcrumb = function () {
		return this.fileBrowserDialog.element(by.css('.wip-breadcrumb'));
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getFolderLinkInBreadcrumb
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns the link of the specified folder in the breadcrumb.
	 *
	 * @param {Number} index The index of breadcrumb entity.
	 *
	 * @returns {Object} The link of the indexed folder as specified in the breadcrumb.
	 */
	this.getFolderLinkInBreadcrumb = function (index) {
		return this.fileBrowserDialog.element(by.css('.wip-breadcrumb')).all(by.css('a')).get(index);
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getSearchBox
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns the file browser search box.
	 *
	 * @returns {Object} The file browser search box element.
	 */
	this.getSearchBox = function () {
		return this.fileBrowserDialog.element(by.css('.search-text'));
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getSearchButton
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns the file browser search button.
	 *
	 * @returns {Object} The file browser search button element.
	 */
	this.getSearchButton = function () {
		return this.fileBrowserDialog.element(by.css('.search-button'));
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getClearSearchButton
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns the clear search result button within file browser.
	 *
	 * @returns {Object} The file browser clear search result element.
	 */
	this.getClearSearchButton = function () {
		return this.fileBrowserDialog.element(by.css('.close-button'));
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getTable
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns the table element
	 *
	 * @returns {Object} Table element.
	 */
	this.getTable = function () {
		return this.fileBrowserDialog.all(by.css('.ui-grid-render-container-body')).first();
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getHeaderCells
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns table header cells list.
	 *
	 * @returns {Object[]} Header cells.
	 */
	this.getHeaderCells = function () {
		return this.fileBrowserDialog.element(by.css('.ui-grid-header-cell-row'))
			.all(by.repeater('col in colContainer.renderedColumns track by col.uid'));
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getTableRows
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns table rows.
	 *
	 * @returns {Object[]} Rows.
	 */
	this.getTableRows = function () {
		return this.fileBrowserDialog.all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'));
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getTableCells
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns row's cells.
	 *
	 * @params {Object} row Row element to be used to get cells.
	 *
	 * @returns {Object[]} Cells
	 */
	this.getTableCells = function (row) {
		return row.all(by.repeater('(colRenderIndex, col) in colContainer.renderedColumns track by col.uid'));
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getRowCount
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns the number of table rows.
	 *
	 * @returns {Object} A promise for the number of rows.
	 */
	this.getRowCount = function () {
		return this.getTableRows().count();
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getAllFolders
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns the folders
	 *
	 * @returns {Object} A promise for the folders.
	 */
	this.getAllFolders = function () {
		return this.getTable().all(by.css('.ui-grid-canvas .ui-grid-cell a'));
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getFolderCount
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns number of folders
	 *
	 * @returns {Object} A promise for the number of folders.
	 */
	this.getFolderCount = function () {
		return this.getAllFolders().count();
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getFolder
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Gets the first folder in the file browser dialog.
	 *
	 * @param {Number} index The folder index
	 *
	 * @returns {Object} The link to the specified folder
	 */
	this.getFolder = function (index) {
		return this.getAllFolders().get(index);
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getFolderByName
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Gets the specified folder in the file browser dialog.
	 *
	 * @param {String} name The folder name
	 *
	 * @returns {Object} The link to the specified folder
	 */
	this.getFolderByName = function (name) {
		return this.getTable().element(by
			.css('.ui-grid-canvas .ui-grid-cell a[title="' + name + '"]'));
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#expandFolder
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Click the first folder in the file browser dialog.
	 *
	 * @param {Number} index The folder index
	 *
	 * @returns {Object} A promise
	 */
	this.expandFolder = function (index) {
		return this.getFolder(index).click();
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#isFolderIconPresent
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Checks if folder icon is present in a cell
	 *
	 * @param {Number} index Index of the list of folders, starting with 0
	 *
	 * @returns {Object} A Promise for whether the folder icon is present.
	 */
	this.isFolderIconPresent = function (index) {
		return this.getTable().all(by.css('wip-file-type-icon[mime-type="application/folder"]')).get(index).isPresent();
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#findFile
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Gets the files that can be added.
	 *
	 * @returns {Object} A promise
	 */
	this.getFile = function () {
		return this.getTable().all(by.css('input:not([disabled="disabled"])'));
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getFileCount
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns number of files
	 *
	 * @returns {Object} A promise for the number of files.
	 */
	this.getFileCount = function () {
		return this.getTable().all(by.css('input:not([disabled="disabled"])')).count();
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getSearchTable
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns element of Search Result table
	 *
	 * @returns {Object} Element of the search result table
	 */
	this.getSearchTable = function () {
		return this.getFileBrowserContainer()
			.element(by.css('span[columns="wipFileBrowserCtrl.searchTableColumns"] .ui-grid-render-container-body .ui-grid-viewport'));
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getSearchTableRows
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns elements of Search Result table rows
	 *
	 * @returns {Object[]} Array of Elements of the search result table rows
	 */
	this.getSearchTableRows = function () {
		return this.getSearchTable().all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'));
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getSearchRow
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns element of Search Result table row
	 *
	 * @param {Number} row: the index of row to get
	 *
	 * @returns {Object} Element of the search result table row
	 */
	this.getSearchRow = function (row) {
		return this.getSearchTableRows().get(row);
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getSearchCell
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns element of Search Result table cell
	 *
	 * @param {Number} row The index of row to get
 	 * @param {Number} col The index of column to get
	 *
	 * @returns {Object} Element of the search result table cell
	 */
	this.getSearchCell = function (row, col) {
		return this.getSearchRow(row).all(by.repeater('(colRenderIndex, col) in colContainer.renderedColumns track by col.uid')).get(col);
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#isCheckboxEnabled
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Checks if Checkbox is enabled in a cell
	 *
	 * @param {Number} index Index of the list of checkboxes, starting with 0
	 *
	 * @returns {Object} A Promise for whether the checkbox is enabled.
	 */
	this.isCheckboxEnabled = function (index) {
		return this.getTable().all(by.css('input')).get(index).isEnabled();
	};

	/**
	 * @name ViewTestsComponents.FileBrowser#getSearchResultCount
	 * @methodOf ViewTestsComponents.FileBrowser
	 * @description Returns the number of search result

	 * @returns {Object} A promise of number of rows in the search result table.
	 */
	this.getSearchResultCount = function () {
		return this.getSearchTableRows().count();
	};
}

module.exports = new FileBrowser();
