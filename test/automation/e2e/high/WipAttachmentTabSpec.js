if (global.isWipEnabled) {

	/**
	 * @ngdoc object
	 * @name E2ETestsSpecs.WipAttachmentTabSpec
	 *
	 * @description This is the e2e test for WIP Attachment Tab
	 *
	 *
	 * ##Dependencies
	 *
	 */
	var auth = require('../../util/Auth');
	var AppHeader = require('../../components/AppHeader');
	var FileBrowser = require('../../components/FileBrowser');
	var CommandBar = require('../../components/CommandBar');
	var itemDetailsPage = require('../../pages/ViewDetailsViewPage');
	var workspaceItemsListPage = require('../../pages/WorkspaceItemsListPage');
	var wipAttachmentViewPage = require('../../pages/ViewWipAttachmentsViewPage');
	var Notification = require('../../components/Notification');
	var Helper = require('../../util/Helper.js');

	describe('WipAttachmentTabSpec', function () {
		this.timeout(120000);
		var expectedConditions = protractor.ExpectedConditions;

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

		after(function () {
			var table = wipAttachmentViewPage.getAttachmentsTable();
			browser.wait(expectedConditions.visibilityOf(table), 5000);

			wipAttachmentViewPage.getTableRows(table).count().then(function (count) {
				if (count) {
					var cellsInHeaderRow = wipAttachmentViewPage.getHeaderCells(table);
					browser.wait(expectedConditions.elementToBeClickable(cellsInHeaderRow.get(1)), 5000);
					cellsInHeaderRow.get(1).element(by.css('input')).click();

					browser.wait(expectedConditions.elementToBeClickable(wipAttachmentViewPage.getRemoveBtn()), 5000);
					wipAttachmentViewPage.getRemoveBtn().click();

					browser.wait(expectedConditions.elementToBeClickable(wipAttachmentViewPage.getDeleteButton()), 5000);
					wipAttachmentViewPage.getDeleteButton().click();
					browser.sleep(5000);

					browser.waitForAngular();
					expect(wipAttachmentViewPage.getTableRows(table).count()).to.eventually.equal(0);
					expect(wipAttachmentViewPage.getEditBtn().getAttribute('disabled')).to.eventually.equal('true');
				}
			});
		});

		describe('[Start from clean attachments slate]', function () {
			it('removes attachments if there are any', function () {
				var table = wipAttachmentViewPage.getAttachmentsTable();
				browser.wait(expectedConditions.visibilityOf(table), 5000);

				wipAttachmentViewPage.getTableRows(table).count().then(function (count) {
					if (count) {
						var cellsInHeaderRow = wipAttachmentViewPage.getHeaderCells(table);
						browser.wait(expectedConditions.elementToBeClickable(cellsInHeaderRow.get(1)), 5000);
						cellsInHeaderRow.get(1).element(by.css('input')).click();

						browser.wait(expectedConditions.elementToBeClickable(wipAttachmentViewPage.getRemoveBtn()), 5000);
						wipAttachmentViewPage.getRemoveBtn().click();

						browser.wait(expectedConditions.elementToBeClickable(wipAttachmentViewPage.getDeleteButton()), 5000);
						wipAttachmentViewPage.getDeleteButton().click();
						browser.sleep(5000);

						browser.waitForAngular();
						expect(wipAttachmentViewPage.getTableRows(table).count()).to.eventually.equal(0);
						expect(wipAttachmentViewPage.getEditBtn().getAttribute('disabled')).to.eventually.equal('true');
					}
				});
			});
		});

		// Can only run this test when no attachment is inside.
		// So this test need to keep as the first one
		describe('[ZeroDoc graphic]', function () {
			var table = wipAttachmentViewPage.getAttachmentsTable();

			it('Add a file from zeroDoc graphic and delete it', function () {
				browser.wait(expectedConditions.visibilityOf(table), 5000);

				wipAttachmentViewPage.getAttachmentCount().then(function (count) {
					if (!count) {
						var zeroDocGraphic = wipAttachmentViewPage.getZeroDocGraphic();
						browser.wait(expectedConditions.visibilityOf(zeroDocGraphic), 5000);

						expect(zeroDocGraphic.isDisplayed()).to.eventually.be.true;

						wipAttachmentViewPage.getAddBtnInZeroDocGraphic().click();

						var fileBrowserTableEl = FileBrowser.getTable();
						browser.wait(expectedConditions.presenceOf(fileBrowserTableEl), 5000);

						// Find a folder then find a file to run tests on.
						// If no folder is found, tests will not be run.
						FileBrowser.getFolderCount().then(function (folderCount) {
							if (folderCount) {
								FileBrowser.expandFolder(0);
								browser.wait(expectedConditions.presenceOf(fileBrowserTableEl), 5000);

								FileBrowser.getFileCount().then(function (fileCount) {
									if (fileCount) {
										FileBrowser.getFile().first().click();

										var addBtn = FileBrowser.getDialogButton('Add');
										browser.wait(expectedConditions.elementToBeClickable(addBtn), 5000);
										addBtn.click();

										browser.waitForAngular();
										expect(wipAttachmentViewPage.getTableRows(table).count())
											.to.eventually.be.above(0);

										var cellsInHeaderRow = wipAttachmentViewPage.getHeaderCells(table);
										browser.wait(expectedConditions.elementToBeClickable(cellsInHeaderRow.get(1)), 5000);
										cellsInHeaderRow.get(1).element(by.css('input')).click();

										browser.wait(expectedConditions.elementToBeClickable(wipAttachmentViewPage.getRemoveBtn()), 5000);
										wipAttachmentViewPage.getRemoveBtn().click();

										browser.wait(expectedConditions.elementToBeClickable(wipAttachmentViewPage.getDeleteButton()), 5000);
										wipAttachmentViewPage.getDeleteButton().click();
										browser.sleep(5000);

										browser.waitForAngular();
										expect(wipAttachmentViewPage.getTableRows(table).count()).to.eventually.equal(0);
										expect(wipAttachmentViewPage.getZeroDocGraphic().isDisplayed())
											.to.eventually.be.true;
									}
								});
							} else {
								var cancelBtn = FileBrowser.getDialogButton('Cancel');
								browser.wait(expectedConditions.elementToBeClickable(cancelBtn), 5000);
								cancelBtn.click();
							}
						});
					}
				});
			});
		});

		describe('Search within WIP File Browser', function () {
			after(function () {
				// Close dialog
				var cancelBtn = FileBrowser.getDialogButton('Cancel');
				browser.wait(expectedConditions.elementToBeClickable(cancelBtn), 5000);
				cancelBtn.click();
			});

			it('Search for "Office" Under Root Folder', function () {
				// Open File Browser
				wipAttachmentViewPage.getAddBtn().click();
				browser.wait(expectedConditions.visibilityOf(FileBrowser.getTable()), 5000);

				// Search for 'Office'
				FileBrowser.getSearchBox().sendKeys('Office');
				FileBrowser.getSearchButton().click();
				browser.waitForAngular();

				// wait for search table and 2 rows of data to appear
				browser.wait(expectedConditions.visibilityOf(FileBrowser.getSearchTable()), 5000);
				browser.wait(expectedConditions.visibilityOf(FileBrowser.getSearchRow(1)), 5000);

				// Expect to get at least 2 results returned
				expect(FileBrowser.getSearchResultCount()).to.eventually.be.at.least(2);
			});

			it('Select 1 file under Sub Folder', function () {
				// Select the file under Sub Folder
				FileBrowser.getSearchTableRows().each(function (row, index) {
					FileBrowser.getSearchCell(index, 2).getText().then(function (keyword) {
						if (keyword.match('Search Within Sub Folder')) {
							FileBrowser.getSearchCell(index, 0).click();
						}
					});
				});

				// Expect the item to be selected and indicated in the file browser toolbar
				expect(FileBrowser.getSelectedItemsCount()).to.eventually.contain('1 item selected');
			});

			it('Exit Search Mode by Clicking on Root Folder', function () {
				// Exit Search Mode by clicking on Root Folder in Breadcrumb
				FileBrowser.getFolderLinkInBreadcrumb(0).click();
				browser.wait(expectedConditions.visibilityOf(FileBrowser.getTable()), 5000);

				// The item should remain selected and such is indicated in the file browser toolbar
				expect(FileBrowser.getSelectedItemsCount()).to.eventually.contain('1 item selected');
				// Search Box should be empty now
				expect(FileBrowser.getSearchBox().getAttribute('value')).to.eventually.equal('');

				// First row in the table should be the folder '[DO NOT MODIFY] Attachments Automation Data'
				expect(FileBrowser.getFolder(0).getText()).to.eventually.equal('[DO NOT MODIFY] Attachments Automation Data');
			});

			it('Search for "Office" Again under Root Folder', function () {
				// Search for 'Office' again and check the item remains selected
				FileBrowser.getSearchBox().sendKeys('Office');
				FileBrowser.getSearchButton().click();

				// wait for search table and 1 row of data to appear
				browser.wait(expectedConditions.visibilityOf(FileBrowser.getSearchTable()), 5000);
				browser.wait(expectedConditions.visibilityOf(FileBrowser.getSearchRow(0)), 5000);

				expect(FileBrowser.getSelectedItemsCount()).to.eventually.contain('1 item selected');

				// Expect 'Office' text remain in the search box
				expect(FileBrowser.getSearchBox().getAttribute('value')).to.eventually.equal('Office');

				// Expect only the file from 'Search Within Sub Folder' to be selected
				FileBrowser.getSearchTableRows().each(function (row, index) {
					FileBrowser.getSearchCell(index, 2).getText().then(function (keyword) {
						if (keyword.match('Sub Folder')) {
							expect(FileBrowser.getSearchCell(index, 0).element(by.css('input')).isSelected()).to.eventually.be.true;
						}

						if (keyword.match('Demo Project')) {
							expect(FileBrowser.getSearchCell(index, 0).element(by.css('input')).isSelected()).to.eventually.be.false;
						}
					});
				});
			});

			it('Search for "Light" and then "Lighthouse dummy"', function () {
				// Exit Search Mode by clicking on Clear Search button
				FileBrowser.getClearSearchButton().click();
				browser.wait(expectedConditions.visibilityOf(FileBrowser.getTable()), 5000);

				// Search for 'light'
				FileBrowser.getSearchBox().sendKeys('light');
				FileBrowser.getSearchButton().click();

				// wait for search table and 2 rows of data to appear
				browser.wait(expectedConditions.visibilityOf(FileBrowser.getSearchTable()), 5000);
				browser.wait(expectedConditions.visibilityOf(FileBrowser.getSearchRow(1)), 5000);

				// Expect at least 2 results to return
				expect(FileBrowser.getSearchResultCount()).to.eventually.be.at.least(2);

				// Now trigger a new search on top of the existing search
				FileBrowser.getSearchBox().sendKeys('house dummy');
				FileBrowser.getSearchButton().click();

				// wait for search table and 1 row of data to appear
				browser.wait(expectedConditions.visibilityOf(FileBrowser.getSearchTable()), 5000);
				browser.wait(expectedConditions.visibilityOf(FileBrowser.getSearchRow(0)), 5000);

				// Only 1 search result should be returned now
				expect(FileBrowser.getSearchResultCount()).to.eventually.equal(1);

				// Select the file under Sub Folder
				FileBrowser.getSearchCell(0, 0).click();

				expect(FileBrowser.getSelectedItemsCount()).to.eventually.contain('2 items selected');
			});

			it('Search for "Office" within Sub Folder', function () {
				// Exit Search Mode by clicking on Clear Search button
				FileBrowser.getClearSearchButton().click();
				browser.wait(expectedConditions.visibilityOf(FileBrowser.getTable()), 5000);

				// Navigate into the 3rd folder '[DO NOT MODIFY] WIP File Browser Search Data'
				FileBrowser.expandFolder(2);
				browser.wait(expectedConditions.visibilityOf(FileBrowser.getTable()), 5000);

				// Search for 'Office' within this folder and only 1 result is expected
				FileBrowser.getSearchBox().sendKeys('Office');
				FileBrowser.getSearchButton().click();
				browser.wait(expectedConditions.visibilityOf(FileBrowser.getSearchTable()), 5000);
				expect(FileBrowser.getSearchResultCount()).to.eventually.equal(1);

				// Expect this result to remain selected
				expect(FileBrowser.getSearchCell(0, 0).element(by.css('input')).isSelected()).to.eventually.true;
			});
		});

		// We can only run tests if there are attachments available.
		// Hence, add attachments first before testing for view and download.
		describe('[Add -> View -> Overview -> Download]', function () {
			var table = wipAttachmentViewPage.getAttachmentsTable();
			var firstRow = wipAttachmentViewPage.getTableRows(table).get(0);

			describe('[Add]', function () {
				beforeEach(function () {
					wipAttachmentViewPage.getAddBtn().click();

					var modalDialogEl = FileBrowser.fileBrowserDialog;
					browser.wait(expectedConditions.visibilityOf(modalDialogEl), 5000);
					browser.wait(expectedConditions.visibilityOf(FileBrowser.getFileBrowserContainer()), 5000);
					browser.wait(expectedConditions.not(expectedConditions.visibilityOf(FileBrowser.getPreLoader())), 5000);
					browser.wait(expectedConditions.presenceOf(FileBrowser.getTable()), 5000);
				});

				it('opens the file browser dialog', function () {
					browser.wait(expectedConditions.visibilityOf(table), 5000);

					wipAttachmentViewPage.getTableRows(table).count().then(function (count) {
						var cancelBtn = FileBrowser.getDialogButton('Cancel');
						browser.wait(expectedConditions.elementToBeClickable(cancelBtn), 5000);
						cancelBtn.click();

						var table = wipAttachmentViewPage.getAttachmentsTable();
						browser.wait(expectedConditions.visibilityOf(table), 5000);

						expect(wipAttachmentViewPage.getTableRows(table).count()).to.eventually.equal(count);
					});
				});

				it('adds a file', function () {
					browser.wait(expectedConditions.visibilityOf(table), 5000);

					wipAttachmentViewPage.getTableRows(table).count().then(function (count) {
						var fileBrowserTableEl = FileBrowser.getTable();
						browser.wait(expectedConditions.presenceOf(fileBrowserTableEl), 5000);

						// Find a folder then find a file to run tests on.
						// If no folder is found, tests will not be run.
						FileBrowser.getFolderCount().then(function (folderCount) {
							if (folderCount) {
								FileBrowser.expandFolder(0);
								browser.wait(expectedConditions.presenceOf(fileBrowserTableEl), 5000);

								FileBrowser.getFileCount().then(function (fileCount) {
									if (fileCount) {
										FileBrowser.getFile().first().click();

										var addBtn = FileBrowser.getDialogButton('Add');
										browser.wait(expectedConditions.elementToBeClickable(addBtn), 5000);
										addBtn.click();

										browser.waitForAngular();
										expect(wipAttachmentViewPage.getTableRows(table).count())
											.to.eventually.be.above(count);
									}
								});
							}
						});
					});
				});

				it('adds multiple files from file browser', function () {
					browser.wait(expectedConditions.visibilityOf(table), 5000);

					wipAttachmentViewPage.getTableRows(table).count().then(function (count) {
						var fileBrowserTableEl = FileBrowser.getTable();
						browser.wait(expectedConditions.presenceOf(fileBrowserTableEl), 5000);

						// Find a folder then find a file to run tests on.
						// If no folder is found, tests will not be run.
						FileBrowser.getFolderCount().then(function (folderCount) {
							if (folderCount) {
								FileBrowser.expandFolder(0);
								browser.wait(expectedConditions.presenceOf(fileBrowserTableEl), 5000);

								FileBrowser.getFileCount().then(function (fileCount) {
									if (fileCount) {
										// Select all files that can be added
										for (var i = 0; i < fileCount; i++) {
											FileBrowser.getFile().get(i).click();
										}

										var addBtn = FileBrowser.getDialogButton('Add');
										browser.wait(expectedConditions.elementToBeClickable(addBtn), 5000);
										addBtn.click();

										browser.waitForAngular();
										expect(wipAttachmentViewPage.getTableRows(table).count())
											.to.eventually.be.above(count);
									}
								});
							}
						});
					});
				});
			});

			describe('[File Overview]', function () {
				after(function () {
					browser.close();
					browser.getAllWindowHandles().then(function (handles) {
						var newWindowHandle = handles[0];
						browser.switchTo().window(newWindowHandle);
					});
				});

				it('should go to overview', function () {
					browser.wait(expectedConditions.visibilityOf(table), 5000);

					var fileRow = wipAttachmentViewPage.getTableRows(table).get(0);
					var fileAnchorEl = wipAttachmentViewPage.getTableCells(fileRow).get(2).element(by.css('a'));
					browser.wait(expectedConditions.elementToBeClickable(fileAnchorEl), 5000);
					fileAnchorEl.click();
					browser.waitForAngular();
					browser.getAllWindowHandles().then(function (handles) {
						expect(handles.length).to.be.equal(2);
						browser.switchTo().window(handles[1]);
						browser.sleep(2000);
					});
				});
			});

			describe('[View & Edit]',function () {
				it('displays a total of nine columns', function () {
					browser.wait(expectedConditions.visibilityOf(table), 5000);
					expect(wipAttachmentViewPage.getColumnHeaders().count()).to.eventually.equal(9);
				});

				it('verifies tagged file version info and pin policy is on lock by default', function () {
					wipAttachmentViewPage.getAttachmentCount().then(function (count) {
						if (count) {
							browser.wait(expectedConditions.visibilityOf(table), 5000);

							wipAttachmentViewPage.getEditBtn().click();
							browser.wait(expectedConditions.visibilityOf(table), 5000);
							var pinPolicy = wipAttachmentViewPage.getTableCells(firstRow).get(3).getText();
							var versionInfo = wipAttachmentViewPage.getTableCells(firstRow).get(4).getText();

							expect(pinPolicy).to.eventually.equal('On Lock');

							wipAttachmentViewPage.getCancelBtn().click();
						}
					});
				});

				it('displays the pin policy tooltip upon hover', function () {
					wipAttachmentViewPage.getAttachmentCount().then(function (count) {
						if (count) {
							browser.actions()
								.mouseMove(wipAttachmentViewPage.getPinningPolicy(firstRow))
								.perform();

							var tooltip = wipAttachmentViewPage.getPinningPolicyTooltip(0);
							browser.wait(expectedConditions.visibilityOf(tooltip), 5000);
							expect(tooltip.isDisplayed()).to.eventually.be.true;
						}
					});
				});
			});

			describe('[Download]', function () {
				// This test is skipped because more options are temporarily hidden until the bulk download feature is implemented.
				it.skip('displays the download option on the command bar upon selecting an item', function () {
					wipAttachmentViewPage.getAttachmentCount().then(function (count) {
						if (count) {
							wipAttachmentViewPage.getTableCells(firstRow).get(1).click();

							expect(wipAttachmentViewPage.getActionsBtn().isDisplayed())
								.to.eventually.be.true;
							wipAttachmentViewPage.getActionsBtn().click();

							expect(wipAttachmentViewPage.getDropdown(CommandBar.getCommandBar()).isDisplayed())
								.to.eventually.be.true;
							wipAttachmentViewPage.getActionsBtn().click();
							wipAttachmentViewPage.getTableCells(firstRow).get(1).click();
						}
					});
				});

				it('displays the inline menu button upon hover', function () {
					wipAttachmentViewPage.getAttachmentCount().then(function (count) {
						if (count) {
							browser.actions()
								.mouseMove(wipAttachmentViewPage.getTableCells(firstRow).get(1))
								.perform();

							browser.waitForAngular();
							expect(wipAttachmentViewPage.getInlineMenuBtn(firstRow).isDisplayed())
								.to.eventually.be.true;
						}
					});
				});

				it('triggers the inline menu upon click', function () {
					wipAttachmentViewPage.getAttachmentCount().then(function (count) {
						if (count) {
							wipAttachmentViewPage.getInlineMenuBtn(firstRow).click();
							expect(wipAttachmentViewPage.getDropdown(firstRow).isDisplayed())
								.to.eventually.be.true;
							wipAttachmentViewPage.getInlineMenuBtn(firstRow).click();
						}
					});
				});

				it('downloads a single file', function () {
					wipAttachmentViewPage.getAttachmentCount().then(function (count) {
						if (count) {
							wipAttachmentViewPage.getInlineMenuBtn(firstRow).click();
							wipAttachmentViewPage.getDropdown(firstRow).all(by.css('a')).get(0).click();
							browser.driver.wait(expectedConditions.presenceOf(Notification.getNotificationEl()), 5000);
							expect(Notification.getCSSClasses()).to.eventually.include('success');

							Notification.getCloseIcon().click();
							browser.waitForAngular();
							expect(wipAttachmentViewPage.getTableCheckbox(firstRow).isSelected()).to.eventually.be.false;
						}
					});
				});

				it.skip('download a single file from command bar', function () {
					wipAttachmentViewPage.getAttachmentCount().then(function (count) {
						if (count) {
							wipAttachmentViewPage.getTableCells(firstRow).get(1).click();
							browser.driver.wait(expectedConditions.elementToBeClickable(wipAttachmentViewPage.getActionsBtn()), 5000);
							wipAttachmentViewPage.getActionsBtn().click();
							browser.driver.wait(expectedConditions.presenceOf(
								wipAttachmentViewPage.getDropdown(CommandBar.getCommandBar())), 5000);
							wipAttachmentViewPage.getDropdown(CommandBar.getCommandBar()).all(by.css('a')).get(0).click();
							browser.driver.wait(expectedConditions.presenceOf(Notification.getNotificationEl()), 5000);
							expect(Notification.getCSSClasses()).to.eventually.include('success');
							Notification.getCloseIcon().click();
							browser.waitForAngular();
							expect(wipAttachmentViewPage.getTableCheckbox(firstRow).isSelected()).to.eventually.be.false;
						}
					});
				});
			});

			describe('[Pinned Version]', function () {
				var secondRow = wipAttachmentViewPage.getTableRows(table).get(1);
				var thirdRow = wipAttachmentViewPage.getTableRows(table).get(2);
				var pinPolicy = wipAttachmentViewPage.getTableCells(secondRow).get(3);
				var version = wipAttachmentViewPage.getTableCells(secondRow).get(4);

				it('edit the second item to pinning policy "To version"', function () {
					wipAttachmentViewPage.getAttachmentCount().then(function (count) {
						if (count) {
							browser.wait(expectedConditions.visibilityOf(table), 5000);

							wipAttachmentViewPage.getEditBtn().click();
							browser.wait(expectedConditions.visibilityOf(table), 5000);
							Helper.getCurrentUrl().then(function (url) {
								expect(url.indexOf('mode=edit') > 0).to.be.true;
							});

							expect(wipAttachmentViewPage.getSaveBtn().isDisplayed()).to.eventually.be.true;
							pinPolicy.click();
							wipAttachmentViewPage.getPinningPolicyDropdownIcon(secondRow).click();
							browser.wait(expectedConditions.visibilityOf(wipAttachmentViewPage.getTableCellDropdown(secondRow, 3)), 5000);

							expect(wipAttachmentViewPage.getTableCellDropdownOption(secondRow, 3, 0)
								.getText()).to.eventually.equal('On Lock');

							expect(wipAttachmentViewPage.getTableCellDropdownOption(secondRow, 3, 1)
								.getText()).to.eventually.equal('To Version');

							expect(wipAttachmentViewPage.getTableCellDropdownOption(secondRow, 3, 2)
								.getText()).to.eventually.equal('Float');
							wipAttachmentViewPage.getTableCellDropdownOption(secondRow, 3, 1).click();
							browser.waitForAngular();

							// clicking away to close dropdown
							wipAttachmentViewPage.getHeaderCells(table).get(0).click();
							expect(pinPolicy.getText()).to.eventually.equal('To Version');

							// pin policy is displayed with dog ear
							expect(wipAttachmentViewPage.getTableCellDirty(secondRow, 3)).to.eventually.equal('true');
						}
					});
				});

				it('pins the second item to Version 1', function () {
					wipAttachmentViewPage.getAttachmentCount().then(function (count) {
						if (count) {
							browser.wait(expectedConditions.visibilityOf(table), 5000);

							expect(version.getText()).to.eventually.equal('2 (Latest)');
							version.click();
							browser.wait(expectedConditions.visibilityOf(wipAttachmentViewPage.getTableCellDropdown(secondRow, 4)), 5000);
							wipAttachmentViewPage.getTableCellDropdown(secondRow, 4).all(by.css('.item')).count().then(function (count) {
								if (count > 1) {
									wipAttachmentViewPage.getTableCellDropdownOption(secondRow, 4, 1).click();

									// clicking away to close dropdown
									wipAttachmentViewPage.getHeaderCells(table).get(0).click();

									// version number is displayed with dog ear
									browser.driver.wait(expectedConditions.visibilityOf(wipAttachmentViewPage.getTableCellDirty(secondRow, 4)), 5000);

									expect(wipAttachmentViewPage.getTableCellDirty(secondRow, 4)).to.eventually.equal('true');

									wipAttachmentViewPage.getSaveBtn().click();

									expect(wipAttachmentViewPage.getTableCells(thirdRow).get(3)
										.getText()).to.eventually.not.equal('--');
									expect(wipAttachmentViewPage.getTableCells(thirdRow).get(4)
										.getText()).to.eventually.equal('1');

									browser.actions()
										.mouseMove(wipAttachmentViewPage.getPinningPolicy(thirdRow))
										.perform();

									var tooltip = wipAttachmentViewPage.getPinningPolicyTooltip(2);
									browser.wait(expectedConditions.visibilityOf(tooltip), 5000);
									expect(tooltip.isDisplayed()).to.eventually.be.true;
									expect(wipAttachmentViewPage.getPinningPolicyTooltipRow(2).count()).to.eventually.equal(3);
									expect(wipAttachmentViewPage.getPinningPolicyTooltipRow(2).get(0).getText()).to.eventually.equal('Pinning Policy: To Version');
									expect(wipAttachmentViewPage.getPinningPolicyTooltipRow(2).get(1).getText()).to.eventually.equal('Pinned Version: 1');
									expect(wipAttachmentViewPage.getPinningPolicyTooltipRow(2).get(2).getText()).to.eventually.equal('Latest Version: 2');
								} else {
									wipAttachmentViewPage.getSaveBtn().click();
								}
							});
						}
					});
				});

				it.skip('downloads the pinned version instead of the latest version', function () {
					wipAttachmentViewPage.getAttachmentCount().then(function (count) {
						if (count) {
							wipAttachmentViewPage.getTableCells(thirdRow).get(2).getText().then(function (fileName) {
								// Only run the test if it has more than one version
								if (fileName.match('Version 1')) {
									browser.actions()
										.mouseMove(wipAttachmentViewPage.getTableCells(thirdRow).get(1))
										.perform();

									browser.waitForAngular();
									wipAttachmentViewPage.getInlineMenuBtn(thirdRow).click();
									wipAttachmentViewPage.getDropdown(thirdRow).all(by.css('a')).get(0).click();

									browser.driver.wait(expectedConditions.presenceOf(Notification.getNotificationEl()), 5000);
									expect(Notification.getNotificationText()).to.eventually.include('Version 1');
									Notification.getCloseIcon().click();
									browser.waitForAngular();
								}
							});
						}
					});
				});
			});

			describe('[Latest Version Label]', function () {
				var secondRow = wipAttachmentViewPage.getTableRows(table).get(1);
				var thirdRow = wipAttachmentViewPage.getTableRows(table).get(2);

				it('displays the \'Latest\' label in view mode', function () {
					wipAttachmentViewPage.getAttachmentCount().then(function (count) {
						if (count) {
							browser.wait(expectedConditions.visibilityOf(table), 5000);

							var version = wipAttachmentViewPage.getTableCells(secondRow).get(4);
							expect(version.getText()).to.eventually.contain('(Latest)');
						}
					});
				});

				it('displays the \'Latest\' label within picklist in edit mode', function () {
					wipAttachmentViewPage.getAttachmentCount().then(function (count) {
						if (count) {
							browser.wait(expectedConditions.visibilityOf(table), 5000);
							wipAttachmentViewPage.getTableCells(thirdRow).get(2).getText().then(function (fileName) {
								// Only run the test if it has more than one version
								if (fileName.match('Version 1')) {
									browser.wait(expectedConditions.visibilityOf(table), 5000);

									wipAttachmentViewPage.getEditBtn().click();
									browser.wait(expectedConditions.visibilityOf(table), 5000);

									var version = wipAttachmentViewPage.getTableCells(thirdRow).get(4);
									expect(version.getText()).to.eventually.equal('1');
									version.click();

									var option = element(by.repeater('field in fieldData.options.items').row(0));
									browser.driver.wait(expectedConditions.visibilityOf(option), 15000);
									expect(option.getText()).to.eventually.contain('(Latest)');

									wipAttachmentViewPage.getCancelBtn().click();
								}
							});
						}
					});
				});
			});

			describe('[Float Pinning Policy]', function () {
				var secondRow = wipAttachmentViewPage.getTableRows(table).get(1);
				var thirdRow = wipAttachmentViewPage.getTableRows(table).get(2);
				var pinPolicy = wipAttachmentViewPage.getTableCells(thirdRow).get(3);
				var version = wipAttachmentViewPage.getTableCells(thirdRow).get(4);

				it('Pinned the third item to "Float"', function () {
					browser.wait(expectedConditions.visibilityOf(table), 5000);
					wipAttachmentViewPage.getAttachmentCount().then(function (count) {
						if (count) {
							browser.wait(expectedConditions.visibilityOf(table), 5000);
							wipAttachmentViewPage.getTableCells(thirdRow).get(2).getText().then(function (fileName) {
								// Only run the test if it has more than one version
								if (fileName.match('Version 1')) {
									browser.wait(expectedConditions.visibilityOf(table), 5000);
									wipAttachmentViewPage.getEditBtn().click();
									browser.wait(expectedConditions.visibilityOf(table), 5000);
									pinPolicy.click();
									wipAttachmentViewPage.getPinningPolicyDropdownIcon(thirdRow).click();
									browser.wait(expectedConditions.visibilityOf(wipAttachmentViewPage.getTableCellDropdown(thirdRow, 3)), 5000);
									wipAttachmentViewPage.getTableCellDropdownOption(thirdRow, 3, 2).click();
									browser.waitForAngular();

									// clicking away to close dropdown
									wipAttachmentViewPage.getHeaderCells(table).get(0).click();

									expect(pinPolicy.getText()).to.eventually.equal('Float');
									expect(wipAttachmentViewPage.getTableCells(thirdRow).get(4).element(by.css('field-selector'))
										.getAttribute('edit-on-click')).to.eventually.equal('false');
									expect(version.getText()).to.eventually.contain('(Latest)');
									wipAttachmentViewPage.getSaveBtn().click();

									browser.actions()
										.mouseMove(wipAttachmentViewPage.getPinningPolicy(secondRow))
										.perform();

									var tooltip = wipAttachmentViewPage.getPinningPolicyTooltip(1);
									browser.wait(expectedConditions.visibilityOf(tooltip), 5000);
									expect(tooltip.isDisplayed()).to.eventually.be.true;
									expect(wipAttachmentViewPage.getPinningPolicyTooltipRow(1).count()).to.eventually.equal(2);
									expect(wipAttachmentViewPage.getPinningPolicyTooltipRow(1).get(0).getText()).to.eventually.equal('Pinning Policy: Float');
									expect(wipAttachmentViewPage.getPinningPolicyTooltipRow(1).get(1).getText()).to.eventually.equal('Latest Version: 2');

									// clicking away to close dropdown
									wipAttachmentViewPage.getHeaderCells(table).get(0).click();
									expect(wipAttachmentViewPage.getTableCells(secondRow).get(4).getText()).to.eventually.equal('2 (Latest)');
								}
							});
						}
					});
				});
			});
		});
	});
}
