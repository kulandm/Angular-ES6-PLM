'use strict';

describe('[MODEL] BomChangeRemove', () => {
	let BomChangeRemove, remove;

	beforeEach(module('plm360.mockObjects', 'plm360.mockData'));

	beforeEach(() => {
		BomChangeRemove = System.get('com/autodesk/models/bomEdit/bomChangeRemove.model.js').default;

        remove = new BomChangeRemove({
            edgeId: '1'
        });
	});

    it('Should init with the correct properties', () => {
        expect(remove.edgeId).to.equal('1');
    });
});
