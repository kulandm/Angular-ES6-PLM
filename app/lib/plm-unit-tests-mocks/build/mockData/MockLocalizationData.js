'use strict';

angular.module('plm360.mockData').value('MockLocalizationData', {

	actionNotifications: {
		eventType: 'Event Type',
		groupToNotify: 'Groups to Notify on Workflow Action',
		notificationEvent: 'Notification Event',
		userToNotify: 'Users to Notify on Workflow Action'
	},

	addLinkedItems: {
		selected: {
			oneItem: ' item selected',
			items: ' items selected'
		},
		sorted: {
			oneItem: ' item sorted by Item Name ',
			items: ' items sorted by Item Name '
		},
		clearAll: 'Clear All',
		managedBy: 'Item Managed By:'
	},

	affectedItems: {
		item: 'Item',
		lifecycle: 'Lifecycle',
		effectivity: 'Effectivity',
		from: 'From',
		to: 'To',
		onRelease: 'On Release',
		noSelection: 'No Selection',
		pleaseSelect: 'Please Select'
	},

	attachments: {
		checkIn: 'Check In',
		checkedInFailed: 'Check in failed for ',
		checkedInSuccess: ' is checked in successfully!',
		checkedOut: 'Checked Out successfully',
		checkOut: 'Check Out',
		createFolder: 'Folder',
		delete: 'Delete',
		description: 'Description',
		details: 'Details',
		directlyAttached: 'Directly Attached',
		download: 'Download',
		duplicatedTitles: 'There are duplicated file titles!',
		folder: 'Folder',
		insertFolderName: 'Insert Folder Name...',
		list: 'List',
		save: 'Save & Upload',
		'selected.items': ' items selected',
		'selected.oneItem': ' item selected',
		tile: 'Tile',
		title: 'Title',
		undo: 'Undo',
		undoDone: 'Undo done successfully',
		upload: 'Upload New Files',
		uploadFailed: 'Upload failed for ',
		uploadSuccess: ' is uploaded successfully!'
	},

	attachmentsGrid: {
		description: 'Description',
		lastActivity: 'Last Activity',
		name: 'File Name',
		performedBy: 'Performed By',
		size: 'File Size',
		status: 'Status',
		title: 'File Title',
		type: 'File Type',
		version: 'Version'
	},

	breadcrumb: {
		dashboard: 'Dashboard'
	},

	bom: {
		header: {
			today: 'Today'
		},
		bias: {
			released: 'Released Revision',
			working: 'Working Revision',
			pending: 'Pending Revision',
			allPending: 'All Pending Revisions'
		}
	},

	button: {
		actions: 'Actions',
		add: 'Add',
		archive: 'Archive',
		bookmark: 'Bookmark',
		cancel: 'Cancel',
		clear: 'Clear',
		close: 'Close',
		create: 'Create',
		done: 'Done',
		edit: 'Edit',
		ok: 'OK',
		save: 'Save',
		saveStep: 'Save step',
		signIn: 'Sign In',
		signOut: 'Sign Out',
		today: 'Today',
		unarchive: 'Unarchive'
	},

	comment: {
		action: {
			post: 'Post'
		}
	},

	chart: {
		noDataToShow: 'No data to show',
		dataErrorTitle: 'Chart error',
		dataErrorMessage: 'This chart cannot be shown at this moment.'
	},

	classifications: {
		fields: {
			picklist: {
				placeholder: "-- Select --",
				deleted: "Deleted"
			}
		},

		section: {
			warning: {
				phantom_class: "Items using phantom classifications cannot be saved. Select a standard classification."
			}
		}
	},

	create: {
		alreadyAdded: 'Item is part of an incomplete revisioning item.',
		cancel: 'Cancel',
		createNew: 'Create new: ',
		createNewItem: 'Create New Item',
		didYouKnow: 'Did you know?',
		itemsSelected: 'item(s) selected.',
		noAddPermission: 'No Add Item permission available',
		noPreviewAndRequired: 'No preview and required fields available.',
		noRequired: 'No required fields available.',
		save: 'Save & Close',
		saveCopy: 'Save & Copy',
		saveManage: 'Save & Manage',
		saveNew: 'Save & New',
		saveView: 'Save & View',
		selectWorkspace: 'Select Workspace',
		workspace: 'Workspace',
		workspacePersistence: 'You can select a workspace and we will remember it for later!'
	},

	dashboard: {
		myOutstandingWork: 'My Outstanding Work',
		bookmarkedItems: 'Bookmarks',
		myRecentlyViewedItems: 'My Recently Viewed Items'
	},

	details: {
		additionalOwners: 'Additional Owners',
		createdBy: 'Created by',
		lastModifiedBy: 'Last modified by',
		owner: 'Owner',
		ownerAndChangeSummary: 'Owner and Change Summary'
	},

	fileType: {
		FUSION_DESIGNS: "Fusion Design",
		FUSION_DESIGNS_ARCHIVE: "Fusion 360 Archive",
		FUSION_DRAWING: "Fusion Drawing",
		FUSION_PUBLICATION: "Publication",
		F360_SIMULATION: "Simulation",
		REVIT_FILES: "Revit Files",
		REVIT_CLOUD_FILES: "Cloud Revit model",
		NAVISWORKS: "Navisworks files",
		INVENTOR_ASSEMBLY: "Inventor assembly files",
		INVENTOR_PART: "Inventor part files",
		INVENTOR_PROJECT: "Inventor project files",
		SOLIDWORKS_ASSEMBLY: "SolidWorks assembly files",
		SOLIDWORKS_PART: "SolidWorks part files",
		CATIA_PART: "Catia part files",
		CATIA_ASSEMBLY: "Catia assembly files",
		CAD_FILE: "CAD File",
		DXF_FILE: "dxf",
		IMAGE_FILE: "Image",
		VIDEO_FILE: "Video",
		AUDIO_FILE: "Audio",
		BINARY_FILE: "Binary",
		OTHER_FILE: "Others",
		ARCHIVE_FILE: "Archive",
		SPREADSHEET_FILE: "Spreadsheet",
		DOCUMENT_FILE: "Document",
		TEXT_FILE: "TXT",
		PPT: "PPT",
		PDF: "PDF"
	},

	grid: {
		addRowAbove: 'Add Row Above',
		addRowBelow: 'Add Row Below',
		id: 'ID'
	},

	mainMenu: {
		administration: 'Administration',
		back: 'Back',
		dashboard: 'Dashboard',
		previousVersion: 'Previous Version',
		workspaces: 'Workspaces',
		dataTab: 'Data Tab'
	},

	milestone: {
		daysFrom: '+/- Days from Target Date',
		event: 'Milestone Event',
		gantt: 'View in Gantt Chart',
		progress: 'Workflow Progress (%)',
		state: 'Workflow State',
		status: 'Status',
		target: 'Target Date',
		warning: 'Warning Days Before'
	},

	namedRelationships: {
		item: 'Item Descriptor'
	},

	notfound: {
		title: 'OOPS! PAGE NOT FOUND',
		line1: 'We cannot find the page you are looking for.',
		line2: 'Please double-check the url or visit one of the other sections featured in this page.'
	},

	notification: {
		archive: {
			success: ' - Archived Successfully.'
		},
		allAttachmentsSave: {
			success: 'All items saved successfully',
			error: 'All Items not saved succesfully',
			errorAndSuccess: 'Some items have error, some saved succesfully'
		},
		bookmark: {
			success: ' - Bookmarked Successfully.'
		},
		bookmarkSpecific: {
			success: 'Dashboard link for {itemDescriptor} has been created. {dashboardLink}',
			dashboardLink: 'Click here to view the dashboard.'
		},
		bulk: {
			add: 'Items added successfully',
			edit: 'Items edited successfully',
			failed: 'Failure in operation',
			remove: 'Items removed successfully'
		},
		changedAdditionalOwners: {
			success: 'Additional Owner(s) changed successfully'
		},
		changedOwner: {
			success: 'Owner changed successfully'
		},
		checkedIn: {
			success: ' - Checked In Successfully'
		},
		checkedOut: {
			success: ' - Checked Out Successfully'
		},
		create: {
			errors: ' Errors - Please fix the errors below to save the item.'
		},
		deleteAttachment: {
			singleFile : 'File Deleted: ',
			multipleFiles: 'These files were deleted: '
		},
		failed: ' - Failed',
		failureInOperation: 'Failure in operation - Please try again',
		generic: {
			error: 'An error occured when trying to perform the operation.',
			timeout: 'A timeout error occured when trying to perform the operation.'
		},
		grid: {
			success: 'The grid row was successfully updated',
			error: 'The grid row was not successfully updated: {errorMessage}'
		},
		itemCreate: {
			success: 'The item was successfully created'
		},
		linkableItem: {
			sucess: 'Item {itemDescriptor} added successfully',
			error: 'An error occured when adding item {itemDescriptor}.'
		},
		permissionDenied: {
			sorry: 'SORRY!',
			noPermission: 'You do not have permission to perform this operation.',
			actionOption: 'Click OK below to continue.',
			moreDetails: 'More details'
		},
		removeBookmark: {
			success: ' - Bookmark Removed Successfully.'
		},
		removeBookmarkSpecific: {
			success: 'The bookmark for {itemDescriptor} was successfully deleted'
		},
		save: {
			success: 'The item was successfully saved.'
		},
		saveSpecific: {
			error: 'The item was not saved: {errorMessage}'
		},
		singleAdd: {
			success: ' - Added Successfully',
			failed: ' - Has Error. Failed To add'
		},
		singleCreate: {
			success: ' - Created Successfully'
		},
		singleEdit: {
			success: ' - Edited Successfully',
			failed: ' - Has error. Failed to update.'
		},
		singleRemove: {
			success: ' - Removed Successfully',
			failed: ' - Has Error. Failed To Remove'
		},
		singleSave: {
			success: ' - Saved Successfully',
			error: ' - not saved successfully'
		},
		unarchive: {
			success: ' - Unarchived Successfully.'
		},
		undo: {
			success: ' - Undo Done Successfully'
		},
		upload: {
			success: ' - Uploaded Successfully'
		}
	},

	picklist: {
		moreResults: '{0} results displayed, out of {1}',
		noResults:'No results found.',
		selectValue: 'Select'
	},

	relationships: {
		item: 'Item Descriptor',
		currentState: 'Current State',
		workspace: 'Workspace',
		description: 'Description',
		directionType: 'Direction Type'
	},

	revision: {
		neverInEffect: 'Was never in effect',
		obsolete: 'Obsolete',
		pending: 'Pending',
		latest: 'Latest',
		superseded: 'Superseded',
		unreleased: 'Unreleased',
		working: 'Working'
	},

	search: {
		button: {
			close: "Close search screen",
			search: "Search"
		},
		input: {
			placeholder: "Search PLM 360"
		},
		page: {
			label: {
				filter: {
					revisions: "Revisions/Versions",
					workspace: "Workspace"
				},
				result: {
					count: {
						found: "Found ",
						result: " results ",
						seconds: " seconds"
					}
				},
				validation: {
					queryMinLength: "Search Term cannot be less than 3 characters."
				}
			}
		}
	},

	sourcing: {
		supplier: 'Supplier',
		quotes: 'Quotes',
		min: 'Min',
		max: 'Max',
		leadTime: 'Lead Time (Days)',
		unitCost: 'Unit Cost',
		comments: 'Comments',
		useAsDefault: 'Use as Default',
		state: 'Current State of Supplier',
		supplierPartNumber: 'Supplier Part Number',
		manufacturer: 'Manufacturer',
		manufacturerPartNumber: 'Manufacturer Part Number',
		comment: 'Sourcing Comment',
		button: {
			addSupplier: 'Add Supplier',
			addQuote: 'Add Quote',
			more: 'More'
		}
	},

	suppliedItems: {
		suppliedItem: 'Supplied Item',
		supplierPartNumber: 'Supplier Part Number',
		manufacturer: 'Manufacturer',
		manufacturerPartNumber: 'Manufacturer Part Number',
		comments: 'Comments'
	},

	text: {
		action: 'Action',
		allWorkspaces: 'All Workspaces',
		archived: {
			uppercase: 'ARCHIVED'
		},
		changedBy: 'Changed By',
		clearSelectedItems: 'Clear selected items',
		comments: 'Comments',
		dateTime: 'Date Time',
		description: 'Description',
		dueDate: 'Due Date',
		effective: 'Effective',
		invalidPassword: 'Invalid password, please try again.',
		item: 'Item',
		items: 'Items',
		itemName: 'Item Name',
		noMatches: 'No matches',
		noResults: 'No results',
		note: 'Note',
		of: 'of',
		on: 'on',
		off: 'off',
		others: 'Others',
		password: 'Password',
		recent: 'Recent',
		replies: 'Replies',
		reply: 'Reply',
		reports: 'Reports',
		revision: 'Revision',
		rowId: 'Row ID',
		search: 'Search',
		state: 'State',
		stateSetBy: 'State Set By',
		stateSetOn: 'State Set On',
		today: 'TODAY',
		username: 'Username',
		workspace: 'Workspace',
		deleteActionNotification: 'Delete Action Notification'
	},

	transition: {
		comments: 'Comments',
		commentsRequired: 'Comments are required.',
		error: 'The workflow step was not saved',
		noPassword: 'You have to type in a password',
		passwordNotSupported: 'Currently, we are not supporting password enabled transitions in this release of NextPLM. Please execute this transition using ClassicPLM.',
		success: 'The workflow step was saved',
		undo: 'The workflow action was rolled back'
	},

	whereUsed: {
		item: 'Item',
		lifecycle: 'Lifecycle',
		quantity: 'Quantity',
		units: 'Units'
	},

	widget: {
		enterComments: 'Enter comments here',
		enterReply: 'Enter reply here',
		moreResults: 'more results. Continue typing to refine further.',
		numberOfViews: 'Number of records in this view: '
	},

	wip: {
		attachments: {
			addAttachment: 'Add Attachment',
			createdBy: 'Created By',
			createdOn: 'Created On',
			float: 'Float',
			latest: '(Latest)',
			name: 'Name',
			onLock: 'On Lock',
			pinningPolicy: 'Pinning Policy',
			size: 'Size',
			toVersion: 'To Version',
			type: 'Type',
			unavailable: 'Temporarily Unavailable',
			version: 'Version'
		}
	},

	workflow: {
		actions: 'Workflow Actions',
		comments: 'Enter comments here',
		createdBy: 'Created By',
		createdOn: 'Created On',
		currentState: 'Current State',
		dateOfLastAction: 'Date of Last Action',
		lastAction: 'Last Action',
		noActionsAvailable: 'No workflow actions available',
		passwordForApproval: 'Password for Approval',
		performedBy: 'Performed By',
		selectAction: 'Select a workflow action...',
		workflow: 'Workflow Item',
		workspace: 'Workspace',
		unknown: '(unknown)'
	},

	workflowMap: {
		workflowHistory: 'Workflow History',
		noHistory: 'No History'
	},

	item: {
		action: {
			short: {
				name: {
					create_item: 'Create',
					create_linked_item: 'Create New',
					add_item: 'Create item',
					edit_item: 'Edit Item',
					delete_item: 'Archive Item',
					undelete_item: 'Unarchive Item',
					lock_item: 'Lock Item',
					escalate_item: 'Escalate Item',

					add_attachment: 'Add Attachment',
					checkin_attachment: 'Checkin Attachment',
					checkout_attachment: 'Checkout Attachment',
					undo_checkout_attachment: 'Undo Checkout Attachment',
					delete_attachment: 'Delete Attachment',

					add_item_to_bom: 'Add item to BOM',
					add_bom: 'Add item to BOM',
					edit_bom: 'Edit BOM',
					delete_bom: 'Delete item from BOM',
					delete_item_from_bom: 'Delete item from BOM',

					add_relationship: 'Add Relationship',
					edit_relationship: 'Edit Relationship',
					delete_relationship: 'Delete Relationship',

					add_rows_into_grid: 'Add rows into grid',
					delete_rows_from_grid: 'Delete rows from grid',
					edit_grid: 'Edit Grid',

					add_linked_item: 'Add Linked Item',
					edit_linked_item: 'Edit Linked Item',
					delete_linked_item: 'Delete Linked Item',

					add_sourcing: 'Add Sourcing Supplier',
					add_sourcing_quotes: 'Add Sourcing Quotes',
					add_sourcing_supplier: 'Add Sourcing Supplier',
					delete_sourcing: 'Delete Sourcing Supplier',
					delete_sourcing_quotes: 'Delete Sourcing Quotes',
					delete_sourcing_supplier: 'Delete Sourcing Supplier',
					edit_sourcing: 'Edit Sourcing Supplier',
					edit_sourcing_quotes: 'Edit Sourcing Quotes',
					edit_sourcing_supplier: 'Edit Sourcing Supplier',

					workflow_action: 'Workflow Action',
					rollback_workflow_action: 'Rollback Workflow Action',
					workflow_transition: 'Workflow Transition',
					revert_working_version: 'Revert Working Version',

					import_delete: 'Deleted using Import Tool',
					import_insert: 'Import New Item using Import Tool',
					import_niuit: 'Import New Item using Import Tool',
					import_update: 'Update using Import Tool',
					update_import: 'Update using Import Tool',
					update_using_import_tool: 'Update using Import Tool',
					deleted_using_import_tool: 'Deleted using Import Tool',
					added_itbuit: 'Added Item To BOM using Import Tool',
					edit_bom_using_import_tool: 'Edit BOM using Import Tool',

					invoke_external_service: 'Invoke External Service',
					add_notification_item: 'Add Notification Item',
					edit_notification_item: 'Edit Notification Item',
					delete_notification_item: 'Delete Notification Item',

					add_milestone: 'Add Milestone',
					edit_milestone: 'Edit Milestone',
					delete_milestone: 'Delete Milestone',

					add_project_item: 'Add Project Item',
					edit_project_item: 'Edit Project Item',
					delete_project_item: 'Delete Project Item',

					script_message: 'Script Message',
					send_email: 'Send Email',
					change_owner: 'Change Owner',
					change_additional_owners: 'Change Additional Owners',

					grid_edit: 'Edit Grid',
					grid_add_rows: 'Add rows into grid',
					grid_delete_rows: 'Delete rows from grid'
				}
			}
		}
	},

	projectManagement: {
		item: 'Item Descriptor',
		start: 'Start Date',
		end: 'End Date',
		duration: 'Duration',
		pre: 'Pre'
	}
});
