/**
 * @ngdoc object
 * @name ViewTestsPage.WorkspaceItemsListPage
 *
 * @description This page corresponds to the workspace items list page.
 *
 * ##Dependencies
 *
 */
var q = require('q');
var util = require('util');
var GenericPage = require('../admin/GenericPage');
var AppHeader = require('../components/AppHeader');
var CreateItem = require('../components/CreateItem');
var CommandBar = require('../components/CommandBar');

function WorkspacesManagerPage() {

	WorkspacesManagerPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#route
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description The URL for this page.
	 */
	this.route = '/admin#section=setuphome&tab=workspaces';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#urlRegex
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('/admin#section=setup');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#urlContains
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'admin';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#viewsContainer
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description This is the menu containing the list of views.
	 */
	this.viewsContainer = element(by.css('.md-select-menu-container'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#createButton
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description This is the button to trigger the add item feature.
	 */
	this.createButton = element(by.css('.add-item-button'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#viewsDropdownButton
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description This is the button (dropdown) for select views.
	 */
	this.viewsDropdownButton = element(by.css('.switch-view-dropdown'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#views
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description This is the menu containing the list of views.
	 */
	this.views = this.viewsContainer.all(by.tagName('md-option'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#workspaceItems
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description This is the list of workspace items.
	 */
	this.workspaceItems = element(by.css('.ui-grid-render-container'));

	/*
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#workspaceItemsFirstHeader
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description This is the first th of the header row.
	 */
	this.workspaceItemsFirstHeader = element.all(by.css('.ui-grid-render-container-body .ui-grid-header-cell-row')).first();

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#toggleWorkspace
	 * @methodOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Toggle workspace setup section
	 *
	 * @param {String} workspaceName The name of the workspace whose setup to be toggled
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.toggleWorkspace = function (workspaceName, def) {
		var that = this;
		var deferred = def || q.defer();
		var xpath = '//div[contains(@class,"itemmenu")]/ul/li/a[contains(text(),"' + workspaceName + '")]';
		browser.driver.isElementPresent(by.xpath(xpath)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.xpath(xpath)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.xpath(xpath)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.toggleWorkspace(workspaceName, deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.toggleWorkspace(workspaceName, deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#clickNewWorkspaceButton
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Gets whether the list of workspace items is displayed.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.clickNewWorkspaceButton = function (def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input#new_workspace';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.clickNewWorkspaceButton(deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.clickNewWorkspaceButton(deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#clickSetupLink
	 * @methodOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Opens up a link within workspace setup
	 *
	 * @param {String} workspaceName The name of the workspace whose setup to be toggled
	 * @param {String} linkText The link to be opened
	 *
	 * @returns {Object} Promise that resolves when element is found and its display value is retrieved
	 */
	this.clickSetupLink = function (workspaceName, linkText, def) {
		var that = this;
		var deferred = def || q.defer();
		var xpath = '//div[contains(@class,"itemmenu")]/ul/li/a[contains(text(),"' + workspaceName + '")]/../../../../div[contains(@class,"itembody")]//a[contains(text(),"' + linkText + '")]';
		browser.driver.isElementPresent(by.xpath(xpath)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.xpath(xpath)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.xpath(xpath)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.clickSetupLink(workspaceName, linkText, deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.clickSetupLink(workspaceName, linkText, deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	 /**
	  * @ngdoc method
	  * @name ViewTestsPage.WorkspaceItemsListPage#enterWorkspaceName
	  * @methodOf ViewTestsPage.WorkspaceItemsListPage
	  * @description Enters workspace name in create workspace.
	  *
	  * @returns {Object} A Promise that resolves when the workspace name is entered
	  */
	this.enterWorkspaceName = function (workspaceName, def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input#shortName';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).sendKeys(workspaceName).then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.enterWorkspaceName(workspaceName, deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.enterWorkspaceName(workspaceName, deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	 /**
	  * @ngdoc method
	  * @name ViewTestsPage.WorkspaceItemsListPage#saveWorkspace
	  * @methodOf ViewTestsPage.WorkspaceItemsListPage
	  * @description Clicks the save button to create workspace
	  *
	  * @returns {Object} A Promise that resolves when the click is completed.
	  */
	this.saveWorkspace = function (def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input.submitinput.save[value="Save"]';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.saveWorkspace(deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.saveWorkspace(deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	 /**
	  * @ngdoc method
	  * @name ViewTestsPage.WorkspaceItemsListPage#selectWorkspaceType
	  * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	  * @description Selects workspace type
	  *
	  * @returns {Object} A Promise that resolves when the element is selected.
	  */
	this.selectWorkspaceType = function (value, def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input[name="workspaceType"][value="' + value + '"]';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.selectWorkspaceType(value, deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.selectWorkspaceType(value, deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};
	this.selectBasicWorkspaceType = function () {
		return this.selectWorkspaceType(1);
	};
	this.selectBasicWorkspaceWithWorkflowType = function () {
		return this.selectWorkspaceType(2);
	};
	this.selectRevisionControlledWorkspaceType = function () {
		return this.selectWorkspaceType(6);
	};
	this.selectRevisioningWorkspaceType = function () {
		return this.selectWorkspaceType(7);
	};
	this.selectSupplierManagementType = function () {
		return this.selectWorkspaceType(3);
	};
	this.selectSupplierManagementWithWorkflowType = function () {
		return this.selectWorkspaceType(8);
	};

	/**
	  * @ngdoc method
	  * @name ViewTestsPage.WorkspaceItemsListPage#clickAddSection
	  * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	  * @description Clicks Add section button
	  *
	  * @returns {Object} A Promise that resolves when the element is clicked
	  */
	this.clickAddSection = function (def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input#newsection';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.clickAddSection(deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.clickAddSection(deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#enterSectionName
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Enters section name
	 *
	 * @returns {Object} A Promise that resolves when the name is entered
	 */
	this.enterSectionName = function (sectionName, def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input[name="sectionName"]';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).sendKeys(sectionName).then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.enterSectionName(sectionName, deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.enterSectionName(sectionName, deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/*
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#saveSection
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Clicks save button to save section
	 *
	 * @returns {Object} A Promise that resolves when element clicked
	 */
	this.saveSection = function (def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input#editSectionSaveButton';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.saveSection(deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.saveSection(deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/**
	  * @ngdoc method
	  * @name ViewTestsPage.WorkspaceItemsListPage#clickAddField
	  * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	  * @description Clicks Add field button
	  *
	  * @returns {Object} A Promise that resolves when the element is clicked
	  */
	this.clickAddField = function (def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input#newfield';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.clickAddField(deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.clickAddField(deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#enterFieldName
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Enters field name
	 *
	 * @returns {Object} A Promise that resolves when the name is entered
	 */
	this.enterFieldName = function (fieldName, def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input[name="fieldName"]';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).sendKeys(fieldName).then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.enterFieldName(fieldName, deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.enterFieldName(fieldName, deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/*
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#saveField
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Clicks save button to save field
	 *
	 * @returns {Object} A Promise that resolves when element clicked
	 */
	this.saveField = function (def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input#formSaveButton';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.saveField(deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.saveField(deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/*
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#selectFieldType
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Selects field type from dropdown
	 *
	 * @returns {Object} A Promise that resolves when element selected
	 */
	this.selectFieldType = function (value, def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'select#dataTypeSelect option[value="' + value + '"]';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.selectFieldType(value, deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.selectFieldType(value, deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};
	this.selectAutoNumberType = function () {
		return this.selectFieldType(11);
	};
	this.selectIntegerType = function () {
		return this.selectFieldType(1);
	};
	this.selectFloatType = function () {
		return this.selectFieldType(2);
	};
	this.selectMoneyType = function () {
		return this.selectFieldType(5);
	};
	this.selectDateType = function () {
		return this.selectFieldType(3);
	};
	this.selectSingleLineTextType = function () {
		return this.selectFieldType(4);
	};
	this.selectParagraphType = function () {
		return this.selectFieldType(8);
	};
	this.selectParagraphWithoutLineBreakType = function () {
		return this.selectFieldType(17);
	};
	this.selectCheckBoxType = function () {
		return this.selectFieldType(9);
	};
	this.selectImageType = function () {
		return this.selectFieldType(15);
	};
	this.selectURLType = function () {
		return this.selectFieldType(16);
	};
	this.selectEmailType = function () {
		return this.selectFieldType(18);
	};
	this.selectCSVType = function () {
		return this.selectFieldType(19);
	};
	this.selectFlashType = function () {
		return this.selectFieldType(21);
	};
	this.selectBOMUOMPickListType = function () {
		return this.selectFieldType(28);
	};
	this.selectedDerivedType = function () {
		return this.selectFieldType(32);
	};
	this.selectPickListType = function () {
		return this.selectFieldType(2147483647);
	};

	/*
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#setFieldLength
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Sets field length
	 *
	 * @returns {Object} A Promise that resolves when element is entered
	 */
	this.setFieldLength = function (value, def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input[name="fieldLength"]';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).sendKeys(value).then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.setFieldLength(value, deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.setFieldLength(value, deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/*
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#setDisplayWidth
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Sets field display width
	 *
	 * @returns {Object} A Promise that resolves when element is entered
	 */
	this.setDisplayWidth = function (value, def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input[name="displayLength"]';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).sendKeys(value).then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.setDisplayWidth(value, deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.setDisplayWidth(value, deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/*
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#setVisibility
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Sets field visibility
	 *
	 * @returns {Object} A Promise that resolves when element is selected
	 */
	this.setVisibility = function (value, def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'select#visible option[value="' + value + '"]';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.setVisibility(value, deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.setVisibility(value, deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};
	this.setAlwaysVisible = function () {
		return this.setVisibility('ALWAYS');
	};
	this.setEditOnlyVisible = function () {
		return this.setVisibility('EDIT_ONLY');
	};

	/*
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#setEditable
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Sets field editable
	 *
	 * @returns {Object} A Promise that resolves when element is selected
	 */
	this.setEditable = function (value, def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'select[name="editable"] option[value="' + value + '"]';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.setEditable(value, deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.setEditable(value, deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};
	this.setAlwaysEditable = function () {
		return this.setEditable('ALWAYS');
	};
	this.setNeverEditable = function () {
		return this.setEditable('NEVER');
	};
	this.setCreateOnlyEditable = function () {
		return this.setEditable('CREATE_ONLY');
	};

	/*
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#setPickList
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Sets picklist
	 *
	 * @returns {Object} A Promise that resolves when element is selected
	 */
	this.setPickList = function (value, def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'select#pickListSelect option[value="' + value + '"]';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.setPickList(value, deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.setPickList(value, deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/*
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#setPickListWorkspaceField
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Sets picklist workspace field
	 *
	 * @returns {Object} A Promise that resolves when element is selected
	 */
	this.setPickListWorkspaceField = function (value, def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'select#workspaceFieldSelect option[value="' + value + '"]';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.setPickListWorkspaceField(value, deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.setPickListWorkspaceField(value, deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/*
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#setPickListLink
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Sets picklist display as link
	 *
	 * @returns {Object} A Promise that resolves when element is selected
	 */
	this.setPickListLink = function (def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input#linkOption';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.setPickListLink(deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.setPickListLink(deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/*
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#setPickListLink
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Sets picklist display as link
	 *
	 * @returns {Object} A Promise that resolves when element is selected
	 */
	this.setPickListType = function (value, def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input[name="picklistDataTypeId"][value="' + value + '"]';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.setPickListType(value, deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.setPickListType(value, deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};
	this.setPickListRadioType = function () {
		return this.setPickListType(25);
	};
	this.setPickListSingleSelectionType = function () {
		return this.setPickListType(23);
	};
	this.setPickListShowFirstValueType = function () {
		return this.setPickListType(7);
	};
	this.setPickListRetainLastSavedType = function () {
		return this.setPickListType(-1);
	};
	this.setPickListWithSearchFilterType = function () {
		return this.setPickListType(26);
	};
	this.setPickListMultiSelectionType = function () {
		return this.setPickListType(27);
	};
	this.setPickListLatestVersionType = function () {
		return this.setPickListType(22);
	};
	this.setPickListFilteredType = function () {
		return this.setPickListType(29);
	};

	/*
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#setFieldPrecision
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Sets field precision value
	 *
	 * @returns {Object} A Promise that resolves when element is entered
	 */
	this.setFieldPrecision = function (value, def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input[name="fieldPrecision"]';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).sendKeys(value).then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.setFieldPrecision(value, deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.setFieldPrecision(value, deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/*
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#setDefaultValue
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Sets field default value
	 *
	 * @returns {Object} A Promise that resolves when element is entered
	 */
	this.setDefaultValue = function (value, def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input[name="defaultValue"]';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).sendKeys(value).then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.setDefaultValue(value, deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.setDefaultValue(value, deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/*
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#moveField
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Moves a field into a section
	 *
	 * @returns {Object} A Promise that resolves when element is entered
	 */
	this.moveField = function (fieldName, sectionName, def) {
		var that = this;
		var deferred = def || q.defer();
		var xpath = '//span[contains(@class,"fieldIdentifier") and contains(text(), "' + fieldName + '")]';
		var sectionXpath = '//span[contains(@class, "sectionIdentifier") and contains(text(), "' + sectionName + '")]/../..';
		browser.driver.isElementPresent(by.xpath(xpath)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.xpath(xpath)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.actions()
							.mouseDown(browser.driver.findElement(by.xpath(xpath)))
							.mouseMove(browser.driver.findElement(by.xpath(sectionXpath)))
							.mouseUp(browser.driver.findElement(by.xpath(sectionXpath)))
							.perform().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.moveField(fieldName, sectionName, deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.moveField(fieldName, sectionName, deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/*
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#saveLayout
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Saves changed layout of item details
	 *
	 * @returns {Object} A Promise that resolves when element is clicked
	 */
	this.saveLayout = function (def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input#saveworkspacebutton';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.saveLayout(deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.saveLayout(deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/*
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#cancelLayout
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Cancel changed layout of item details
	 *
	 * @returns {Object} A Promise that resolves when element is clicked
	 */
	this.cancelLayout = function (def) {
		var that = this;
		var deferred = def || q.defer();
		var css = 'input.submitinput.cancel';
		browser.driver.isElementPresent(by.css(css)).then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (isVisible) {
						browser.driver.findElement(by.css(css)).click().then(function () {
							deferred.resolve();
						});
					} else {
						setTimeout(function () {
							that.cancelLayout(deferred);
						}, 500);
					}
				});
			} else {
				setTimeout(function () {
					that.cancelLayout(deferred);
				}, 500);
			}
		});
		return deferred.promise;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewDetailsViewPage#waitForEvents
	 * @methodOf ViewTestsPage.ViewDetailsViewPage
	 * @description Returns a promise that will be resolved to 'true' if all
	 * events are complete.
	 *
	 * @returns {Object} A promise that will be resolved to 'true' or 'false'
	 * depending on the state of the event listeners.
	 */
	this.waitForEvents = function () {
		return browser.executeAsyncScript(function (callback) {
			var injector = angular.injector(['plm360.models']);
			var eventService = injector.get('EventService');
			var $q = injector.get('$q');

			var promises = [];

			var currentUserDeferred = $q.defer();
			var currentUserListener = eventService.listen('currentUser:currentUser:done', function () {
				eventService.unlisten(currentUserListener);
				currentUserDeferred.resolve();
			});
			promises.push(currentUserDeferred.promise);

			// The two promises for VIEWS (list of views), and then VIEW (the items inside that VIEW)
			var viewsDeferred = $q.defer();
			promises.push(viewsDeferred.promise);
			var viewsListenerId = eventService.listen('views:*:done', function () {
				eventService.unlisten(viewsListenerId);

				var viewDeferred = $q.defer();
				promises.push(viewDeferred.promise);
				var viewListenedId = eventService.listen('viewInstance:*:done', function () {
					eventService.unlisten(viewDeferred);

					viewDeferred.resolve();
				});

				viewsDeferred.resolve();
			});

			console.log('I made you some promises', promises);
			$q.all(promises).then(function () {
				callback(true);
			}, function () {
				callback(false);
			});
		});
	};
}

util.inherits(WorkspacesManagerPage, GenericPage);

module.exports = new WorkspacesManagerPage();
