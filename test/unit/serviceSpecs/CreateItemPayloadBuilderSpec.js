'use strict';

describe('CreateItemPayloadBuilder', function () {
	var PayloadBuilder;
	var us;
	var wsSectionFields;

	beforeEach(module('com/autodesk/UnderscoreService.js','com/autodesk/components/createItem/createItem.js'));
	beforeEach(
		inject(function (CreateItemPayloadBuilder, _) {
			PayloadBuilder = CreateItemPayloadBuilder;
			us = _;
			// test data
			wsSectionFields = [
				{id: 'C', fields: []},
				{id: 'A', fields: [
					{__self__: 'a1'},
					{__self__: 'a2'}
				]},
				{id: 'B', fields: [
					{__self__: 'b1'},
					{__self__: 'b2'}
				]}
			];
		})
	);

	it('Setting non-existent field value in empty payload returns empty payload', function () {
		let builder = new PayloadBuilder(wsSectionFields, us);
		let payload = builder.addFieldValue('f1','f1v');
		expect(payload.sections.length).to.be.equal(0);
	});

	it('Setting null field value is allowed', function () {
		let builder = new PayloadBuilder(wsSectionFields, us);
		let payload = builder.addFieldValue('a1', null);
		expect(payload.sections.length).to.equal(1);
		expect(payload.sections[0].link).to.equal('A');
		expect(payload.sections[0].fields[0].__self__).to.equal('a1');
		expect(payload.sections[0].fields[0].hasOwnProperty('value')).to.equal(true);
		expect(payload.sections[0].fields[0].value).to.equal(null);
	});

	it('Setting undefined field value is not allowed', function () {
		let builder = new PayloadBuilder(wsSectionFields, us);
		let payload = builder.addFieldValue('a1', undefined);
		expect(payload.sections.length).to.equal(1);
		expect(payload.sections[0].link).to.equal('A');
		expect(payload.sections[0].fields[0].__self__).to.equal('a1');
		expect(payload.sections[0].fields[0].hasOwnProperty('value')).to.equal(false);
	});

	it('Setting field value should set just that value', function () {
		let builder = new PayloadBuilder(wsSectionFields, us);
		let payload = builder.addFieldValue('a1','a1v');
		expect(payload.sections.length).to.equal(1);
		expect(payload.sections[0].link).to.equal('A');
		expect(payload.sections[0].fields[0].__self__).to.equal('a1');
		expect(payload.sections[0].fields[0].value).to.equal('a1v');
	});

	it('Setting array field value should set that array value', function () {
		let builder = new PayloadBuilder(wsSectionFields, us);
		let payload = builder.addFieldValue('a1',[1,2,3]);
		expect(payload.sections.length).to.equal(1);
		expect(payload.sections[0].link).to.equal('A');
		expect(payload.sections[0].fields[0].__self__).to.equal('a1');
		expect(payload.sections[0].fields[0].value).to.deep.equal([1,2,3]);
	});

	it('Setting object field value should set that array value', function () {
		let builder = new PayloadBuilder(wsSectionFields, us);
		let payload = builder.addFieldValue('a1',{fieldVal:'a1v'});
		expect(payload.sections.length).to.equal(1);
		expect(payload.sections[0].link).to.equal('A');
		expect(payload.sections[0].fields[0].__self__).to.equal('a1');
		expect(payload.sections[0].fields[0].value).to.deep.equal({fieldVal:'a1v'});
	});

	it('Setting same field value in same section twice should cause the last value to overwrite', function () {
		let builder = new PayloadBuilder(wsSectionFields, us);
		builder.addFieldValue('a1','a1v');
		let payload = builder.addFieldValue('a1','a1v2');
		expect(payload.sections.length).to.equal(1);
		expect(payload.sections[0].link).to.equal('A');
		expect(payload.sections[0].fields[0].__self__).to.equal('a1');
		expect(payload.sections[0].fields[0].value).to.equal('a1v2');
	});

	it('Setting different field value in same section should be in the same section', function () {
		let builder = new PayloadBuilder(wsSectionFields, us);
		builder.addFieldValue('a1','a1v');
		let payload = builder.addFieldValue('a2','a2v');
		expect(payload.sections.length).to.equal(1);
		expect(payload.sections[0].link).to.equal('A');
		expect(payload.sections[0].fields[0].__self__).to.equal('a1');
		expect(payload.sections[0].fields[0].value).to.equal('a1v');
		expect(payload.sections[0].fields[1].__self__).to.equal('a2');
		expect(payload.sections[0].fields[1].value).to.equal('a2v');
	});

	it('Setting different field value in different sections should be in different sections', function () {
		let builder = new PayloadBuilder(wsSectionFields, us);
		builder.addFieldValue('a1','a1v');
		let payload = builder.addFieldValue('b1','b1v');
		expect(payload.sections.length).to.equal(2);
		expect(payload.sections[0].link).to.equal('A');
		expect(payload.sections[0].fields[0].__self__).to.equal('a1');
		expect(payload.sections[0].fields[0].value).to.equal('a1v');
		expect(payload.sections[1].fields[0].__self__).to.equal('b1');
		expect(payload.sections[1].fields[0].value).to.equal('b1v');
	});
});
