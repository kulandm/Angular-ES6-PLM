/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewWipAttachmentsViewSpec
 *
 * @description This is the view tests for the ViewWipAttachmentsViewPage.
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var FileBrowser = require('../components/FileBrowser');
var viewWipAttachmentsViewPage = require('../pages/ViewWipAttachmentsViewPage');

describe('ViewWipAttachmentsView', function () {
	this.timeout(60000);

	var EC = protractor.ExpectedConditions;
	var fileBrowserTableEl = FileBrowser.getTable();

	before(function () {
		auth.doLogin();
		auth.checkAgreementModal();
		viewWipAttachmentsViewPage.go();
		return viewWipAttachmentsViewPage.waitForEvents().then(function (result) {
			expect(result).to.be.true;
		});
	});

	after(function () {
		// auth.doLogout();
	});

	afterEach('take a screenshot if a test fails', function () {
		if (this.currentTest.state === 'failed') {
			ss.writeSS(this.currentTest.ssName);
		}
	});

	describe('[View]', function () {
		it('displays a total of nine columns', function () {
			this._runnable.ssName = 'ViewWipAttachmentsView-nineColumns';

			expect(viewWipAttachmentsViewPage.getColumnHeaders().count())
				.to.eventually.equal(9);
		});

		it('displays the zero-doc graphic when there are no attachments', function () {
			this._runnable.ssName = 'ViewWipAttachmentsView-zeroDocGraphic';

			viewWipAttachmentsViewPage.getAttachmentCount().then(function (count) {
				if (!count) {
					expect(viewWipAttachmentsViewPage.getZeroDocGraphic().isDisplayed())
						.to.eventually.be.true;
				}
			});
		});

		it('displays the edit button', function () {
			this._runnable.ssName = 'ViewWipAttachmentsView-editBtn';

			expect(viewWipAttachmentsViewPage.getEditBtn().isDisplayed())
				.to.eventually.be.true;
		});

		it('displays the add button', function () {
			this._runnable.ssName = 'ViewWipAttachmentsView-addBtn';

			expect(viewWipAttachmentsViewPage.getAddBtn().isDisplayed())
				.to.eventually.be.true;
		});

		it('displays the remove button', function () {
			this._runnable.ssName = 'ViewWipAttachmentsView-removeBtn';

			expect(viewWipAttachmentsViewPage.getRemoveBtn().isDisplayed())
				.to.eventually.be.true;
		});

		it('disables the remove button if no item is currently selected', function () {
			this._runnable.ssName = 'ViewWipAttachmentsView-removeBtn';

			expect(viewWipAttachmentsViewPage.getRemoveBtn()
				.getAttribute('disabled')).to.eventually.equal('true');
		});

		it('disables the edit button if there is item currently selected', function () {
			this._runnable.ssName = 'ViewWipAttachmentsView-disabledEditBtn';

			viewWipAttachmentsViewPage.getAttachmentCount().then(function (count) {
				if (count) {
					var table = viewWipAttachmentsViewPage.getAttachmentsTable();
					var firstRow = viewWipAttachmentsViewPage.getTableRows(table).get(0);
					viewWipAttachmentsViewPage.getTableCells(firstRow).get(1).click();

					expect(viewWipAttachmentsViewPage.getEditBtn().getAttribute('disabled'))
						.to.eventually.equal('true');

					viewWipAttachmentsViewPage.getTableCells(firstRow).get(1).click();
				}
			});
		});

		it('disables the add button if there is item currently selected', function () {
			this._runnable.ssName = 'ViewWipAttachmentsView-disabledAddBtn';

			viewWipAttachmentsViewPage.getAttachmentCount().then(function (count) {
				if (count) {
					var table = viewWipAttachmentsViewPage.getAttachmentsTable();
					var firstRow = viewWipAttachmentsViewPage.getTableRows(table).get(0);
					viewWipAttachmentsViewPage.getTableCells(firstRow).get(1).click();

					expect(viewWipAttachmentsViewPage.getAddBtn().getAttribute('disabled'))
						.to.eventually.equal('true');

					viewWipAttachmentsViewPage.getTableCells(firstRow).get(1).click();
				}
			});
		});

		it('enables the action button only if one item is selected', function () {
			this._runnable.ssName = 'ViewWipAttachmentsView-enableActionBtn';

			expect(viewWipAttachmentsViewPage.getActionsBtn().getAttribute('disabled'))
				.to.eventually.equal('true');

			viewWipAttachmentsViewPage.getAttachmentCount().then(function (count) {
				if (count > 1) {
					var table = viewWipAttachmentsViewPage.getAttachmentsTable();
					var firstRow = viewWipAttachmentsViewPage.getTableRows(table).get(0);
					var secondRow = viewWipAttachmentsViewPage.getTableRows(table).get(1);
					viewWipAttachmentsViewPage.getTableCells(firstRow).get(1).click();

					expect(viewWipAttachmentsViewPage.getActionsBtn().isEnabled())
						.to.eventually.equal('true');

					viewWipAttachmentsViewPage.getTableCells(secondRow).get(1).click();

					expect(viewWipAttachmentsViewPage.getActionsBtn().getAttribute('disabled'))
						.to.eventually.equal('true');

					viewWipAttachmentsViewPage.getTableCells(firstRow).get(1).click();
					viewWipAttachmentsViewPage.getTableCells(secondRow).get(1).click();
				}
			});
		});
	});

	describe('[FileBrowser]', function () {
		beforeEach(function () {
			viewWipAttachmentsViewPage.getAddBtn().click();
			browser.wait(EC.presenceOf(fileBrowserTableEl), 5000);
		});

		afterEach(function () {
			FileBrowser.getDialogButton('Cancel').click();
		});

		it('displays the file browser dialog', function () {
			this._runnable.ssName = 'ViewWipAttachmentsView-fileBrowserDialog';

			expect(FileBrowser.fileBrowserDialog.isDisplayed())
				.to.eventually.be.true;
		});

		it('has the correct title', function () {
			this._runnable.ssName = 'ViewWipAttachmentsView-fileBrowserTitle';

			expect(FileBrowser.getTitle()).to.eventually.equal('Add Attachment');
		});

		it('disables the add button when no items are selected', function () {
			this._runnable.ssName = 'ViewWipAttachmentsView-fileBrowserDisabledAddButton';

			expect(FileBrowser.getDialogButton('Add').getAttribute('disabled'))
				.to.eventually.equal('true');
		});

		it('enables the add button when an item is selected', function () {
			this._runnable.ssName = 'ViewWipAttachmentsView-fileBrowserEnabledAddButton';

			FileBrowser.getRowCount().then(function (tableLength) {
				if (tableLength) {
					FileBrowser.expandFolder(0);
					browser.wait(EC.presenceOf(fileBrowserTableEl), 5000);

					FileBrowser.getFileCount().then(function (fileCount) {
						if (fileCount) {
							FileBrowser.getFile().first().click();
							expect(FileBrowser.getDialogButton('Add')
								.getAttribute('disabled')).to.eventually.equal(null);
						}
					});
				}
			});
		});

		it('displays message for a single file selected', function () {
			FileBrowser.getRowCount().then(function (tableLength) {
				if (tableLength) {
					FileBrowser.expandFolder(0);
					browser.wait(EC.presenceOf(fileBrowserTableEl), 5000);

					FileBrowser.getFileCount().then(function (fileCount) {
						if (fileCount) {
							FileBrowser.getFile().first().click();

							expect(FileBrowser.getToolbar().getText())
								.to.eventually.contain('1 item selected');
						}
					});
				}
			});
		});

		it('displays message for a number of files selected', function () {
			FileBrowser.getRowCount().then(function (tableLength) {
				if (tableLength) {
					FileBrowser.expandFolder(0);
					browser.wait(EC.presenceOf(fileBrowserTableEl), 5000);

					FileBrowser.getFileCount().then(function (fileCount) {
						if (fileCount) {
							// Select all files
							for (var i = 0; i < fileCount; i++) {
								FileBrowser.getFile().get(i).click();
							}

							if (fileCount > 1) {
								expect(FileBrowser.getToolbar().getText())
									.to.eventually.contain(fileCount + ' items selected');

								FileBrowser.getBreadcrumb().element(by.css('a')).click();
								browser.wait(EC.presenceOf(fileBrowserTableEl), 5000);

								expect(FileBrowser.getToolbar().getText())
									.to.eventually.contain(fileCount + ' items selected');
							}
						}
					});
				}
			});
		});

		it('clears files selected and disables add button', function () {
			FileBrowser.getRowCount().then(function (tableLength) {
				if (tableLength) {
					FileBrowser.expandFolder(0);
					browser.wait(EC.presenceOf(fileBrowserTableEl), 5000);

					FileBrowser.getFileCount().then(function (fileCount) {
						if (fileCount) {
							// Select all files
							for (var i = 0; i < fileCount; i++) {
								FileBrowser.getFile().get(i).click();
							}

							expect(FileBrowser.getToolbar().getText())
								.to.eventually.contain('Clear selected items');

							FileBrowser.getToolbar().element(by.css('a')).click();

							expect(FileBrowser.getToolbar().getText())
								.to.eventually.not.contain('Clear selected items');
							expect(FileBrowser.getDialogButton('Add').getAttribute('disabled'))
								.to.eventually.equal('true');
						}
					});
				}
			});
		});
	});

	describe('[FileBrowserFolders]', function () {
		beforeEach(function () {
			viewWipAttachmentsViewPage.getAddBtn().click();
			browser.wait(EC.presenceOf(fileBrowserTableEl), 5000);
		});

		afterEach(function () {
			FileBrowser.getDialogButton('Cancel').click();
		});

		it('checks that only folders are present in the root folder', function () {
			FileBrowser.getRowCount().then(function (tableLength) {
				if (tableLength) {
					expect(FileBrowser.getFolderCount()).to.eventually.equal(tableLength);
				}
			});
		});

		it('checks if folder icons are displayed and checkboxes are disabled in the root folder', function () {
			FileBrowser.getRowCount().then(function (tableLength) {
				if (tableLength) {
					for (var i = 0; i < tableLength; i++) {
						expect(FileBrowser.isCheckboxEnabled(i)).to.eventually.be.false;
						expect(FileBrowser.isFolderIconPresent(i)).to.eventually.be.true;
					}
				}
			});
		});

		it('displays error message for an empty folder', function () {
			FileBrowser.getRowCount().then(function (tableLength) {
				if (tableLength > 1) {
					FileBrowser.expandFolder(1);
					browser.wait(EC.presenceOf(fileBrowserTableEl), 5000);

					FileBrowser.getRowCount().then(function (tableLength) {
						if (tableLength === 0) {
							expect(FileBrowser.getFileBrowserContainer().getText())
								.to.eventually.contain('Empty folder. No data available');
						} else {
							FileBrowser.getFolderCount().then(function (folderCount) {
								if (folderCount) {
									FileBrowser.expandFolder(0);
									browser.wait(EC.presenceOf(fileBrowserTableEl), 5000);

									FileBrowser.getRowCount().then(function (tableLength) {
										if (tableLength === 0) {
											expect(FileBrowser.getFileBrowserContainer().getText())
												.to.eventually.contain('Empty folder. No data available');
										}
									});
								}
							});
						}
					});
				}
			});
		});
	});

	describe('[FileBrowserBreadcrumbs]', function () {
		beforeEach(function () {
			viewWipAttachmentsViewPage.getAddBtn().click();
			browser.wait(EC.presenceOf(fileBrowserTableEl), 5000);
		});

		afterEach(function () {
			FileBrowser.getDialogButton('Cancel').click();
		});

		it('updates breadcrumbs when two levels of the folder tree are traversed', function () {
			expect(FileBrowser.getBreadcrumb().getText())
				.to.eventually.equal('Home');

			FileBrowser.getRowCount().then(function (tableLength) {
				if (tableLength) {
					FileBrowser.getFolder(0).getText().then(function (folderName) {
						FileBrowser.expandFolder(0);

						expect(FileBrowser.getBreadcrumb().getText())
							.to.eventually.contain(folderName);
					});
				}
			});
		});

		it('updates breadcrumbs when three levels of the folder tree are traversed', function () {
			FileBrowser.getRowCount().then(function (tableLength) {
				if (tableLength) {
					FileBrowser.expandFolder(1);
					browser.wait(EC.presenceOf(fileBrowserTableEl), 5000);

					FileBrowser.getRowCount().then(function (tableLength) {
						if (tableLength) {
							FileBrowser.getFolderCount().then(function (folderCount) {
								if (folderCount) {
									FileBrowser.getFolder(0).getText().then(function (folderName) {
										FileBrowser.expandFolder(0);

										expect(FileBrowser.getBreadcrumb().getText())
											.to.eventually.contain(folderName);
									});
								}
							});
						}
					});
				}
			});
		});
	});
});
