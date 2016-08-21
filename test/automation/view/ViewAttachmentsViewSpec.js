/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewAttachmentsViewSpec
 *
 * @description This is the view tests for the ViewAttachmentsViewPage.
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var path = require('path');
var viewAttachmentsViewPage = require('../pages/ViewAttachmentsViewPage');

describe('ViewAttachmentsView', function () {
	this.timeout(60000);

	before(function () {
		auth.doLogin();
		auth.checkAgreementModal();
		viewAttachmentsViewPage.go();
		return viewAttachmentsViewPage.waitForEvents().then(function (result) {
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
		it('displays a total of ten columns', function () {
			this._runnable.ssName = 'ViewAttachmentsView-displayTen';

			expect(viewAttachmentsViewPage.getColumns().count()).to.eventually.equal(10);
		});

		it('displays the correct description for the first attachment', function () {
			this._runnable.ssName = 'ViewAttachmentsView-displayDescription';

			expect(viewAttachmentsViewPage.getColumn(9).getText()).to.eventually.equal('');
		});

		it('displays the correct checked-in/checked-out status for the first attachment', function () {
			this._runnable.ssName = 'ViewAttachmentsView-displayStatus';

			expect(viewAttachmentsViewPage.getColumn(3).getText()).to.eventually.equal('Checked IN');
		});

		it('displays the correct version for the first attachment', function () {
			this._runnable.ssName = 'ViewAttachmentsView-displayVersion';

			expect(viewAttachmentsViewPage.getColumn(4).getText()).to.eventually.equal('1');
		});

		it('displays the correct file type for the first attachment', function () {
			this._runnable.ssName = 'ViewAttachmentsView-displayFileType';

			expect(viewAttachmentsViewPage.getColumn(5).getText()).to.eventually.equal('txt');
		});

		it('displays the correct performed by username for the first attachment', function () {
			this._runnable.ssName = 'ViewAttachmentsView-displayPerformedBy';

			expect(viewAttachmentsViewPage.getColumn(8).getText()).to.eventually.equal('PLMAutoTest Selenium1');
		});

		it('displays the correct file type icon for the first attachment', function () {
			this._runnable.ssName = 'ViewAttachmentsView-displayIcon';

			var iconElement = element(by.css('.icon-txt-16'));
			expect(iconElement.isPresent()).to.eventually.be.true;
		});
	});

	describe('[Folders]', function () {
		it('displays the folder name', function () {
			this._runnable.ssName = 'ViewAttachmentsView-displayFolder';

			expect(viewAttachmentsViewPage.getFolders().first().isPresent()).to.eventually.be.true;
			expect(viewAttachmentsViewPage.getFolders().first().getText()).to.eventually.equal('Stats');
		});

		it('expands the folder', function () {
			this._runnable.ssName = 'ViewAttachmentsView-expandFolder';

			viewAttachmentsViewPage.getFolders().first().click();
			expect(viewAttachmentsViewPage.getAttachments().count()).to.eventually.equal(9);
		});

		it('collapses the folder', function () {
			this._runnable.ssName = 'ViewAttachmentsView-collapseFolder';

			viewAttachmentsViewPage.getFolders().first().click();
			expect(viewAttachmentsViewPage.getAttachments().count()).to.eventually.equal(7);
		});
	});

	/**
	 * The tests for download have been written up to the point we have
	 * control of the element. As soon as the download button is clicked,
	 * the control goes to the browser's saving capabilities in which the
	 * behaviour is not determined by the application, hence not tested.
	 * Thus the tests cover only the selection/highlighting of row.
	 */
	describe('[Download]', function () {
		it('selects the row upon clicking on the row of the table', function () {
			this._runnable.ssName = 'ViewAttachmentsView-selectRow';

			// Select first row
			viewAttachmentsViewPage.getAttachments().first().click();
			viewAttachmentsViewPage.getAttachments().first().getAttribute('class').then(function (value) {
				expect(value).to.contain('ui-grid-row-selected');
			});

			// Unselect first row
			viewAttachmentsViewPage.getAttachments().first().click();
			viewAttachmentsViewPage.getAttachments().first().getAttribute('class').then(function (value) {
				expect(value).to.not.contain('ui-grid-row-selected');
			});
		});

		it('displays the download button after the row is selected', function () {
			this._runnable.ssName = 'ViewAttachmentsView-downloadButton';

			// Select first row
			viewAttachmentsViewPage.getAttachments().first().click();
			expect(viewAttachmentsViewPage.getDownloadButton()
				.isDisplayed()).to.eventually.be.true;
		});
	});

	describe('[Check Out/In]', function () {
		it('checks out a file', function () {
			this._runnable.ssName = 'ViewAttachmentsView-checkOut';

			// The first row is already selected
			expect(viewAttachmentsViewPage.getCheckOutButton()
				.isDisplayed()).to.eventually.be.true;

			viewAttachmentsViewPage.getCheckOutButton().click();
			expect(viewAttachmentsViewPage.getColumn(3).getText())
				.to.eventually.equal('Checked OUT');
		});

		it('undo a file check out', function () {
			this._runnable.ssName = 'ViewAttachmentsView-undoCheckOut';

			expect(viewAttachmentsViewPage.getColumn(3).getText())
				.to.eventually.equal('Checked OUT');

			viewAttachmentsViewPage.getAttachments().first().click();
			expect(viewAttachmentsViewPage.getUndoButton()
				.isDisplayed()).to.eventually.be.true;

			viewAttachmentsViewPage.getUndoButton().click();
			expect(viewAttachmentsViewPage.getColumn(3).getText())
				.to.eventually.equal('Checked IN');
		});

		it('checks in a file', function () {
			this._runnable.ssName = 'ViewAttachmentsView-checkIn';

			// Select and checks out first row
			viewAttachmentsViewPage.getAttachments().first().click();
			viewAttachmentsViewPage.getCheckOutButton().click();

			// Perform check in
			viewAttachmentsViewPage.getAttachments().first().click();
			expect(viewAttachmentsViewPage.getCheckInButton()
				.isPresent()).to.eventually.be.true;

			var absolutePath = path.resolve(__dirname, 'ViewDetailsViewSpec.js');
			var checkInFileInput = viewAttachmentsViewPage.getCheckInButton();

			// Select one file for checking in
			checkInFileInput.sendKeys(absolutePath);

			browser.waitForAngular().then(function () {
				expect(viewAttachmentsViewPage.getUploadDialog().isPresent())
					.to.eventually.be.true;
				expect(viewAttachmentsViewPage.getSelectedFileList().first().getInnerHtml())
					.to.eventually.contain('ViewDetailsViewSpec.js');

				viewAttachmentsViewPage.clickUploadBtn();
				// Wait for animation and upload to be done
				browser.sleep(5000);

				expect(viewAttachmentsViewPage.getColumn(3).getText())
					.to.eventually.equal('Checked IN');
			});
		});
	});

	describe(['Check Out/In from folder'], function () {
		it('checks out a file from the folder', function () {
			this._runnable.ssName = 'ViewAttachmentsView-FolderCheckout';

			viewAttachmentsViewPage.expandAllFolders();

			// Get file within folder
			viewAttachmentsViewPage.getAttachments().get(7).click();
			expect(viewAttachmentsViewPage.getCheckOutButton()
				.isDisplayed()).to.eventually.be.true;

			// Check out file within folder
			viewAttachmentsViewPage.getCheckOutButton().click();
			viewAttachmentsViewPage.expandAllFolders();

			expect(viewAttachmentsViewPage.getCell(7, 3)
				.getText()).to.eventually.equal('Checked OUT');
		});

		it('checks in a file into the folder', function () {
			this._runnable.ssName = 'ViewAttachmentsView-FolderCheckin';

			viewAttachmentsViewPage.expandAllFolders();

			// Get file within folder
			viewAttachmentsViewPage.getAttachments().get(7).click();
			expect(viewAttachmentsViewPage.getCheckInButton()
				.isPresent()).to.eventually.be.true;

			var absolutePath = path.resolve(__dirname, 'ViewDetailsViewSpec.js');
			var checkInFileInput = viewAttachmentsViewPage.getCheckInButton();

			// Select one file for checking in
			checkInFileInput.sendKeys(absolutePath);
			browser.sleep(500);
			browser.waitForAngular().then(function () {
				expect(viewAttachmentsViewPage.getUploadDialog().isPresent())
					.to.eventually.be.true;
				expect(viewAttachmentsViewPage.getSelectedFileList().first().getInnerHtml())
					.to.eventually.contain('ViewDetailsViewSpec.js');

				viewAttachmentsViewPage.clickUploadBtn();
				// Wait for animation and upload to be done
				browser.sleep(3000);
				viewAttachmentsViewPage.expandAllFolders();

				expect(viewAttachmentsViewPage.getCell(7, 3)
					.getText()).to.eventually.equal('Checked IN');
			});
		});
	});

	describe('[Upload]', function () {
		it('selects a single file to be uploaded', function () {
			this._runnable.ssName = 'ViewAttachmentsView-selectOneFile';

			var absolutePath = path.resolve(__dirname, 'ViewAttachmentsViewSpec.js');

			var addFileInput = viewAttachmentsViewPage.getUploadButton();
			expect(addFileInput.isPresent()).to.eventually.be.true;

			// Select one file
			addFileInput.sendKeys(absolutePath);

			browser.waitForAngular().then(function () {
				expect(viewAttachmentsViewPage.getUploadDialog().isPresent())
					.to.eventually.be.true;
				expect(viewAttachmentsViewPage.getSelectedFileList().first().getInnerHtml())
					.to.eventually.contain('ViewAttachmentsViewSpec.js');
				expect(viewAttachmentsViewPage.getSelectedFileList().count())
					.to.eventually.equal(1);

				// Close dialog
				viewAttachmentsViewPage.clickCancelBtn();
			});
		});

		it('selects multiple files to be uploaded', function () {
			this._runnable.ssName = 'ViewAttachmentsView-selectTwoFiles';

			var absolutePathFirstFile = path.resolve(__dirname, 'ViewAttachmentsViewSpec.js');
			var absolutePathSecondFile = path.resolve(__dirname, 'MainDashboardViewSpec.js');

			var addFileInput = viewAttachmentsViewPage.getUploadButton();
			expect(addFileInput.isPresent()).to.eventually.be.true;

			// Select two files
			addFileInput.sendKeys(absolutePathFirstFile + '\n' + absolutePathSecondFile);

			browser.waitForAngular().then(function () {
				expect(viewAttachmentsViewPage.getUploadDialog().isPresent())
					.to.eventually.be.true;
				expect(viewAttachmentsViewPage.getSelectedFileList().count())
					.to.eventually.equal(2);

				// Close dialog
				viewAttachmentsViewPage.clickCancelBtn();
			});
		});

		it('displays the number of selected items in the dialog header', function () {
			this._runnable.ssName = 'ViewAttachmentsView-noOfItemsSelected';

			var absolutePathFirstFile = path.resolve(__dirname, 'ViewAttachmentsViewSpec.js');
			var absolutePathSecondFile = path.resolve(__dirname, 'MainDashboardViewSpec.js');

			var addFileInput = viewAttachmentsViewPage.getUploadButton();
			expect(addFileInput.isPresent()).to.eventually.be.true;

			// Select two files
			addFileInput.sendKeys(absolutePathFirstFile + '\n' + absolutePathSecondFile);

			browser.waitForAngular().then(function () {
				expect(viewAttachmentsViewPage.getNoOfItemsSelected())
					.to.eventually.equal('- 2 items selected');

				// Close dialog
				viewAttachmentsViewPage.clickCancelBtn();
			});
		});

		it('removes selected files', function () {
			this._runnable.ssName = 'ViewAttachmentsView-removeItem';

			var absolutePathFirstFile = path.resolve(__dirname, 'ViewAttachmentsViewSpec.js');
			var absolutePathSecondFile = path.resolve(__dirname, 'MainDashboardViewSpec.js');

			var addFileInput = viewAttachmentsViewPage.getUploadButton();
			expect(addFileInput.isPresent()).to.eventually.be.true;

			// Select two files
			addFileInput.sendKeys(absolutePathFirstFile + '\n' + absolutePathSecondFile);

			browser.waitForAngular().then(function () {
				expect(viewAttachmentsViewPage.getNoOfItemsSelected())
					.to.eventually.equal('- 2 items selected');
				expect(viewAttachmentsViewPage.getSelectedFileList().count())
					.to.eventually.equal(2);

				// Remove file
				var removeFileBtn = viewAttachmentsViewPage.getRemoveFileButton();
				expect(removeFileBtn.isPresent()).to.eventually.be.true;
				removeFileBtn.click();

				expect(viewAttachmentsViewPage.getNoOfItemsSelected())
					.to.eventually.equal('- 1 item selected');
				expect(viewAttachmentsViewPage.getSelectedFileList().count())
					.to.eventually.equal(1);

				// Close dialog
				viewAttachmentsViewPage.clickCancelBtn();
			});
		});

		it('does not allow remove if only one file is selected', function () {
			this._runnable.ssName = 'ViewAttachmentsView-cannotRemoveItem';

			var absolutePath = path.resolve(__dirname, 'ViewAttachmentsViewSpec.js');

			var addFileInput = viewAttachmentsViewPage.getUploadButton();
			expect(addFileInput.isPresent()).to.eventually.be.true;

			// Select one file
			addFileInput.sendKeys(absolutePath);

			browser.waitForAngular().then(function () {
				viewAttachmentsViewPage.getUploadDialog();
				expect(viewAttachmentsViewPage.getSelectedFileList().count())
					.to.eventually.equal(1);
				expect(viewAttachmentsViewPage.getRemoveFileButtons().count())
					.to.eventually.equal(0);

				// Close dialog
				viewAttachmentsViewPage.clickCancelBtn();
			});
		});

		it('collapses the content of a selected item in the dialog', function () {
			this._runnable.ssName = 'ViewAttachmentsView-collapseContent';

			var absolutePath = path.resolve(__dirname, 'ViewAttachmentsViewSpec.js');

			var addFileInput = viewAttachmentsViewPage.getUploadButton();
			expect(addFileInput.isPresent()).to.eventually.be.true;

			// Select one file
			addFileInput.sendKeys(absolutePath);

			browser.waitForAngular().then(function () {
				expect(viewAttachmentsViewPage.getCollapsibleContentField()
					.isDisplayed()).to.eventually.be.true;

				// Collapse the content
				viewAttachmentsViewPage.clickCollapsibleCaret();
				// Wait for animation to be done
				browser.sleep(3000);

				expect(viewAttachmentsViewPage.getCollapsibleContentField()
					.isDisplayed()).to.eventually.be.false;

				// Close dialog
				viewAttachmentsViewPage.clickCancelBtn();
			});
		});

		it('displays the action buttons in the dialog footer', function () {
			this._runnable.ssName = 'ViewAttachmentsView-footerBtns';

			var absolutePath = path.resolve(__dirname, 'ViewAttachmentsViewSpec.js');

			var addFileInput = viewAttachmentsViewPage.getUploadButton();
			expect(addFileInput.isPresent()).to.eventually.be.true;

			// Select one file
			addFileInput.sendKeys(absolutePath);

			browser.waitForAngular().then(function () {
				expect(viewAttachmentsViewPage.getDialogFooterButton('Cancel')
					.isDisplayed()).to.eventually.be.true;
				expect(viewAttachmentsViewPage.getDialogFooterButton('Save')
					.isDisplayed()).to.eventually.be.true;

				// Close dialog
				viewAttachmentsViewPage.clickCancelBtn();
			});
		});

		it('checks for duplicate file titles, displays an error and disables upload button if so', function () {
			this._runnable.ssName = 'ViewAttachmentsView-duplicateTitles';

			var absolutePath = path.resolve(__dirname, 'ViewAttachmentsViewSpec.js');

			var addFileInput = viewAttachmentsViewPage.getUploadButton();
			expect(addFileInput.isPresent()).to.eventually.be.true;

			// Select first file
			addFileInput.sendKeys(absolutePath);

			browser.waitForAngular().then(function () {
				expect(viewAttachmentsViewPage.getDuplicateFileTitleError()
					.isDisplayed()).to.eventually.be.true;
				expect(viewAttachmentsViewPage.getDialogFooterButton('Save')
					.getAttribute('disabled')).to.eventually.equal('true');

				// Close dialog
				viewAttachmentsViewPage.clickCancelBtn();
			});
		});

		it('uploads multiple files', function () {
			this._runnable.ssName = 'ViewAttachmentsView-uploadTwoFiles';

			var absolutePathFirstFile = path.resolve(__dirname, 'ViewWorkflowViewSpec.js');
			var absolutePathSecondFile = path.resolve(__dirname, 'MainDashboardViewSpec.js');

			var addFileInput = viewAttachmentsViewPage.getUploadButton();
			expect(addFileInput.isPresent()).to.eventually.be.true;

			// Select first file
			addFileInput.sendKeys(absolutePathFirstFile + '\n' + absolutePathSecondFile);

			browser.waitForAngular().then(function () {
				expect(viewAttachmentsViewPage.getSelectedFileList().count())
					.to.eventually.equal(2);

				// Upload and close dialog
				viewAttachmentsViewPage.clickUploadBtn();
				// Wait for animation and upload to be done
				browser.sleep(3000);

				expect(viewAttachmentsViewPage.getAttachments().count())
					.to.eventually.equal(9);
			});
		});
	});
});
