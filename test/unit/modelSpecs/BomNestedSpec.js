(function () {
	'use strict';

	describe('[MODEL] BomNested', function () {
		// Model Handle
		var BomNested;

		// mock data container
		var mockDataSet;

		beforeEach(module('plm360', 'plm360.models', 'plm360.mockObjects', 'plm360.mockData'));

		beforeEach(function () {
			// Inject services and values that will be used
			inject(function (_BomNested_, MockBomNestedData) {
				BomNested = _BomNested_;
				mockDataSet = MockBomNestedData;
			});
		});

		describe('extractBomItemIdsFromLink', function () {
			it('should return the expected id', function () {
				var app = new BomNested(mockDataSet.basicData);
				expect(app.extractBomItemIdsFromLink(app.bomItems[0].link)).to.equal('301');
			});
		});

		describe('getSelfLink', function () {
			it('should return the expected self link', function () {
				var app = new BomNested(mockDataSet.basicData);

				// Check assert link is what it should be
				expect(app.getSelfLink()).to.deep.equal(mockDataSet.basicData[0].__self__.replace(/^\//, ''));
			});
		});

		describe('getBomItems', function () {
			it('should return the full list of bom items', function () {
				var app = new BomNested(mockDataSet.basicData);

				// Fetch the bom meta object and make sure its what we expect
				expect(app.getBomItems()).to.deep.equal(mockDataSet.basicData[0].items);
			});
		});

		describe('getBomMetaObj', function () {
			it('should return the full json payload representing the bom meta object', function () {
				var app = new BomNested(mockDataSet.basicData);

				// Fetch the bom meta object and make sure its what we expect
				expect(app.getBomMetaObj()).to.deep.equal(mockDataSet.basicData[0]);
			});
		});

		describe('getBomConfigObj', function () {
			it('should return the full json payload representing the bom configuration object', function () {
				var app = new BomNested(mockDataSet.basicData);

				// Fetch the bom config object and make sure its what we expect
				expect(app.getBomConfigObj()).to.deep.equal(mockDataSet.basicData[1]);
			});
		});

		describe('find', function () {
			it('should find the items in the list', function () {
				var app = new BomNested(mockDataSet.basicData);

				// Loop checking that each item can be found
				var id = -1;
				var index = 0;
				for (index = 0; index < mockDataSet.basicData[0].items; index++) {
					id = mockDataSet.basicData[0].items[index].link.split('/').pop();
					expect(app.find(id)).to.deep.equal(mockDataSet.basicData[0].items[index]);
				}
			});

			it('should return undefined if item is not in the list', function () {
				var app = new BomNested(mockDataSet.basicData);

				// Search for an invalid id and check to be undefined
				var id = -1;
				expect(app.find(id)).to.be.undefined;
			});
		});

	});
}());
