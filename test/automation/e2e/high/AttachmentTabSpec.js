if (!global.isWipEnabled) {
	/**
	 * @ngdoc object
	 * @name E2ETestsSpecs.AttachmentTabSpec
	 *
	 * @description This is the e2e test for Attachment Tab
	 *
	 * ##Dependencies
	 *
	 */
	var auth = require('../../util/Auth');
	var path = require('path');
	var AppHeader = require('../../components/AppHeader');
	var Notification = require('../../components/Notification');
	var itemDetailsPage = require('../../pages/ViewDetailsViewPage');
	var workspaceItemsListPage = require('../../pages/WorkspaceItemsListPage');

	var attachmentViewPage = require('../../pages/ViewAttachmentsViewPage');

	describe('AttachmentTabSpec', function () {
		this.timeout(120000);

		before(function () {
			auth.doLogin();
			auth.checkAgreementModal(30000);

			// 1:1: Open left nav bar and select a workspace to go to.
			// 1:2: This will open workspace list view.
			// 1:3: Select an item that contains attachments.
			AppHeader.openWorkspace('Change Management', 'CR Attachment Check In Per');
			workspaceItemsListPage.openItem('CR000001 - Change Shockers');

			// 2.1: Reach item details view.
			// 2:2: Select attachment tab.
			itemDetailsPage.switchToTab('Attachments');
			browser.sleep(5000);
		});

		it('PLM2.0-202:PLM-6721 View Attached items in a list view', function () {
			// Check the number of columns and other things.
			expect(attachmentViewPage.getColumn(0).getText()).to.eventually.equal('1');
			expect(attachmentViewPage.getColumn(1).element(by.css('span'))
				.getAttribute('class')).to.eventually.include('icon-txt-16');
			expect(attachmentViewPage.getColumn(1).element(by.css('.resource-name'))
				.getText()).to.eventually.equal('1.');
			expect(attachmentViewPage.getColumn(2).getText()).to.eventually.equal('1..txt');
			expect(attachmentViewPage.getColumn(3).getText()).to.eventually.equal('Checked IN');
			expect(attachmentViewPage.getColumn(4).getText()).to.eventually.equal('1');
			expect(attachmentViewPage.getColumn(5).getText()).to.eventually.equal('txt');
			expect(attachmentViewPage.getColumn(6).getText()).to.eventually.equal('-');
			expect(attachmentViewPage.getColumn(7).getText()).to.eventually.equal('Aug 27, 2015 1:38:25 AM');
			expect(attachmentViewPage.getColumn(8).getText()).to.eventually.equal('PLMAutoTest Selenium1');
			expect(attachmentViewPage.getColumn(9).getText()).to.eventually.equal('');
			expect(attachmentViewPage.getAttachments().get(2).all(by
				.repeater('(colRenderIndex, col) in colContainer.renderedColumns'))
				.get(6).getText()).to.eventually.equal('11.2 KB');
			expect(attachmentViewPage.getAttachments().get(3).all(by
				.repeater('(colRenderIndex, col) in colContainer.renderedColumns'))
				.get(6).getText()).to.eventually.equal('3.4 MB');

			attachmentViewPage.getColumn(1).element(by.css('.icon-txt-16'))
				.getLocation().then(function (iconPos) {
				attachmentViewPage.getColumn(1).element(by.css('.resource-name'))
					.getLocation().then(function (textPos) {
					expect(iconPos.x < textPos.x).to.eql(true);
				});
			});
		});

		it('PLM2.0-204:PLM-6814 View folders on the attachment tab', function () {
			attachmentViewPage.expandAllFolders().then(function () {
				expect(attachmentViewPage.getAttachments().count())
					.to.eventually.equal(9);
				expect(attachmentViewPage.getColumn(1).element(by
					.css('div:first-child')).getAttribute('class'))
					.to.eventually.include('level-0');
				expect(attachmentViewPage.getAttachments().get(7).all(by
					.repeater('(colRenderIndex, col) in colContainer.renderedColumns'))
					.get(1).element(by.css('div:first-child')).getAttribute('class'))
					.to.eventually.include('level-1');

				for (var i = 0; i < 10; i++) {
					if (i === 1) {
						expect(attachmentViewPage.getAttachments().get(6).all(by
							.repeater('(colRenderIndex, col) in colContainer.renderedColumns'))
							.get(1).element(by.css('span')).getAttribute('class'))
							.to.eventually.include('md folder-size');

						expect(attachmentViewPage.getAttachments().get(6).element(by
							.css('.folder-name')).getText()).to.eventually.equal('Stats');
					} else {
						expect(attachmentViewPage.getAttachments().get(6).all(by
							.repeater('(colRenderIndex, col) in colContainer.renderedColumns'))
							.get(i).getText()).to.eventually.equal('');
					}
				}

				var rowNumberPromises = [];
				for (i = 0; i < 9; i++) {
					rowNumberPromises.push(attachmentViewPage.getAttachments().get(i).all(by
						.repeater('(colRenderIndex, col) in colContainer.renderedColumns')).get(0).getText());
				}

				return protractor.promise.all(rowNumberPromises).then(function (rowNumbers) {
					expect(rowNumbers).to.eql(['1', '2', '3', '4', '5', '6', '', '7', '8']);
				});
			});

			expect(attachmentViewPage.getAttachments().count()).to.eventually.equal(9);
		});

		describe('[Notifications]', function () {
			it('displays success notification after uploading', function () {
				var absolutePath = path.resolve(__dirname, 'AffectedItemsSpec.js');
				var addFileInput = attachmentViewPage.getUploadButton();
				addFileInput.sendKeys(absolutePath);

				browser.waitForAngular();
				// Upload and close dialog
				attachmentViewPage.getUploadDialog();
				attachmentViewPage.clickUploadBtn();

				expect(Notification.isNotificationPresent()).to.eventually.be.true;
				expect(Notification.getCSSClasses()).to.eventually.include('success');
				expect(Notification.getNotificationText()).to.eventually.equal(
					'AffectedItemsSpec - Uploaded Successfully');
				Notification.getCloseIcon().click();
			});

			it('displays success notification after checking out a file', function () {
				attachmentViewPage.getAttachments().first().click();
				attachmentViewPage.getCheckOutButton().click();

				expect(Notification.isNotificationPresent()).to.eventually.be.true;
				expect(Notification.getCSSClasses()).to.eventually.include('success');
				expect(Notification.getNotificationText()).to.eventually.equal(
					'1..txt - Checked Out Successfully');
				Notification.getCloseIcon().click();
			});

			it('displays success notification after undo-ing a check out', function () {
				attachmentViewPage.getAttachments().first().click();
				attachmentViewPage.getUndoButton().click();

				expect(Notification.isNotificationPresent()).to.eventually.be.true;
				expect(Notification.getCSSClasses()).to.eventually.include('success');
				expect(Notification.getNotificationText()).to.eventually.equal(
					'1..txt - Undo Done Successfully');
				Notification.getCloseIcon().click();
			});

			it('displays success notification after checking in a file', function () {
				attachmentViewPage.getAttachments().first().click();
				attachmentViewPage.getCheckOutButton().click();
				attachmentViewPage.getAttachments().first().click();

				var absolutePath = path.resolve(__dirname, 'AffectedItemsSpec.js');
				var checkInFileInput = attachmentViewPage.getCheckInButton();
				checkInFileInput.sendKeys(absolutePath);

				browser.waitForAngular();
				// Upload and close dialog
				attachmentViewPage.getUploadDialog();
				attachmentViewPage.clickUploadBtn();

				// Wait for animation and upload to be done
				expect(Notification.isNotificationPresent()).to.eventually.be.true;
				expect(Notification.getCSSClasses()).to.eventually.include('success');
				expect(Notification.getNotificationText()).to.eventually.equal(
					'1. - Checked In Successfully');
				Notification.getCloseIcon().click();
			});

			it('displays error notification when uploading due to duplicated file titles', function () {
				var absolutePath = path.resolve(__dirname, 'AffectedItemsSpec.js');
				var addFileInput = attachmentViewPage.getUploadButton();
				addFileInput.sendKeys(absolutePath);

				browser.waitForAngular();
				// Upload and close dialog
				attachmentViewPage.getUploadDialog();

				expect(attachmentViewPage.getDuplicateFileTitleError().getText())
					.to.eventually.contain('duplicated file titles');
				attachmentViewPage.clickCancelBtn();
			});
		});
	});
}
