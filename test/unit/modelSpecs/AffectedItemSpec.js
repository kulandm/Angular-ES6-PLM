System.get('com/autodesk/filters.js');

'use strict';

describe('AffectedItem', () => {
	let affectedItem;
	let json = {
		item: {
			title: 'Test Title',
			urn: 'urn:adsk.plm:tenant.workspace.item:TENANT.0.0000'
		}
	};

	let $filter;
	let RESTWrapperService;
	let EventService;
	let $q;
	let FieldTypes;

	beforeEach(module(
		'com/autodesk/EventService.js',
		'plm360',
		'plm360.permissions',
		'com/autodesk/filters.js',
		'plm360.models'
	));

	beforeEach(inject((
		_$filter_,
		 _RESTWrapperService_,
		_EventService_,
		_$q_,
		_FieldTypes_
	) => {
		$filter = _$filter_;
		RESTWrapperService = _RESTWrapperService_;
		EventService = _EventService_;
		$q = _$q_;
		FieldTypes = _FieldTypes_;

		affectedItem = new AffectedItem(json);
	}));

	describe('[get]', () => {
		it('gets the item title', () => {
			expect(affectedItem.getItemTitle()).to.equal('Test Title');
		});

		it('gets the workspace id', () => {
			expect(affectedItem.getWorkspaceId()).to.equal('0');
		});

		describe('[linked fields]', () => {
			let linkedField = {
				__self__: 'self link',
				urn: 'urn:linkedfield:TENANT.0.00.SINGLE_LINE',
				type: {
					link: '/api/v3/field-types/4',
					urn: 'urn:linkedfield:TENANT.4'
				}
			};

			it('gets the linked field self link', () => {
				expect(affectedItem.getLinkedFieldLink(linkedField)).to
					.equal('self link');
			});

			it('gets the linked field urn', () => {
				expect(affectedItem.getLinkedFieldUrn(linkedField)).to
					.equal('urn:linkedfield:TENANT.0.00.SINGLE_LINE');
			});

			it('gets the linked field id', () => {
				expect(affectedItem.getLinkedFieldId(linkedField)).to
					.equal('SINGLE_LINE');
			});

			it('gets the linked field data type id', () => {
				expect(affectedItem.getLinkedFieldDataTypeId(linkedField)).to
					.equal('4');
			});
		});
	});

	describe('setLifecycle', () => {
		it('sets targetTransition to null if transition is null', () => {
			affectedItem.setLifecycle(null);

			expect(affectedItem.json.targetTransition).to.equal(null);
		});

		it('sets targetTransition to null if transition title is \'Please Select\'', () => {
			affectedItem.setLifecycle({
				title: 'Please Select'
			});

			expect(affectedItem.json.targetTransition).to.equal(null);
		});

		it('sets targetTransition if transition (with link and title) is defined', () => {
			affectedItem.setLifecycle({
				link: 'link',
				title: 'title'
			});

			expect(affectedItem.json.targetTransition).to.be.defined;
			expect(affectedItem.json.targetTransition.link).to.equal('link');
			expect(affectedItem.json.targetTransition.title).to.equal('title');
		});

		it('sets targetTransition if transition (with __self__ and name) is defined', () => {
			affectedItem.setLifecycle({
				__self__: 'selflink',
				name: 'name'
			});

			expect(affectedItem.json.targetTransition).to.be.defined;
			expect(affectedItem.json.targetTransition.link).to.equal('selflink');
			expect(affectedItem.json.targetTransition.title).to.equal('name');
		});
	});

	describe('setEffectivity', () => {
		it('ensures a difference in timezone does not affect the date', () => {
			// Date at 0000 (12AM)
			let inputDate1 = new Date();
			inputDate1.setHours(0, 0, 0, 0);
			affectedItem.setEffectivity(inputDate1);
			let expectedDate1 = json.effectivityDate;

			// Date at 2359
			let inputDate2 = new Date();
			inputDate2.setHours(23, 59, 59, 999);
			affectedItem.setEffectivity(inputDate2);
			let expectedDate2 = json.effectivityDate;

			// This is to test that the date will not be converted
			// wrongly by setEffectivity. A time difference of 0000 and 2359
			// might potentially cause day differece due to timezone.
			expect(expectedDate1).to.equal(expectedDate2);
		});

		it('returns the same date as created', () => {
			let testDate = new Date();

			// Forcing the date to "2015-09-18"
			// Setting it after date is created will disregard the date difference cause by time zone
			// This is due to server time difference
			testDate.setFullYear(2015);
			testDate.setDate(18);
			testDate.setMonth(9-1);	// September in month is 8
			affectedItem.setEffectivity(testDate);

			expect(json.effectivityDate).to.equal('2015-09-18');
		});

		it('returns a string with format yyyy-MM-dd', () => {
			let inputDate = new Date();
			affectedItem.setEffectivity(inputDate);

			// Regex to test for format of 4 digit - 2 digit - 2 digit
			expect(json.effectivityDate).to.match(/^\d{4}-\d{2}-\d{2}$/);
		});
	});

	describe('setCustomColumnData', () => {
		it('returns yyyy-MM-dd for custom dates when item not in linkedFields', () => {
			// Date not found in linkedFields
			json.linkedFields = [];

			let expectedValue = $filter('date')(new Date(), 'yyyy-MM-dd');
			let fieldId = 'DATE';
			let data = {
				value: new Date().toString()
			};
			let col = {
				dataType: '3',
				isPicklist: false,
				fieldMetadata: {
					__self__: '/api/v3/workspaces/9/views/11/fields/DATE'
				}
			};

			affectedItem.setCustomColumnData(fieldId, data, col);
			expect(json.linkedFields[0].value).to.equal(expectedValue);
		});

		it('returns yyyy-MM-dd for custom dates when items in linkedFields ', () => {
			// Date already exist in linkedFIelds
			json.linkedFields = [{
				urn: 'urn:linkedfield:TENANT.0.00.DATE',
				value: {}
			}];

			let expectedValue = $filter('date')(new Date(), 'yyyy-MM-dd');
			let fieldId = 'DATE';
			let data = {
				value: new Date().toString()
			};
			let col = {
				dataType: '3',
				isPicklist: false,
				fieldMetadata: {
					__self__: '/api/v3/workspaces/9/views/11/fields/DATE'
				}
			};

			affectedItem.setCustomColumnData(fieldId, data, col);
			expect(json.linkedFields[0].value).to.equal(expectedValue);
		});
	});
});
