'use strict';

describe('Owner', () => {
	let OwnershipObj;
	let data = {
		ownership: {
			__self__: 'someLink',
			owners: [{
				ownerType: 'some type',
				__self__: 'some self link'
			}]
		}
	};

	beforeEach(module('plm360.models'));

	beforeEach(() => {
		OwnershipObj = new Ownership(data);

		OwnershipObj.OWNER_TYPE = {
			PRIMARY: 'PRIMARY',
			ADDITIONAL_USER: 'ADDITIONAL_USER',
			ADDITIONAL_GROUP: 'ADDITIONAL_GROUP'
		};
	});

	describe('replaceOwner', () => {
		it('should remove primary user and insert a new Primary User with notify false', () => {

			OwnershipObj.RESTWrapperService = {
				put: sinon.spy()
			};

			OwnershipObj.replaceOwner([
				{
					ownerType: 'PRIMARY',
					__self__: 'should be removed'
				},
				{
					ownerType: 'something else',
					__self__: 'should not be removed'
				}
			], {
				__self__: 'something NEW'
			}, false);

			expect(OwnershipObj.RESTWrapperService.put).to.be.calledWith([
				{
					ownerType: 'something else',
					__self__: 'should not be removed'
				},
				{
					ownerType: 'PRIMARY',
					__self__: 'someLink/something NEW',
					notify: false
				}
			], sinon.match.any, sinon.match.any, sinon.match.any, {
				'Content-Type': 'application/json'
			});
		});
	});

	describe('replaceOwner', () => {
		it('should remove primary user and insert a new Primary User with notify true', () => {

			OwnershipObj.RESTWrapperService = {
				put: sinon.spy()
			};

			OwnershipObj.replaceOwner([
				{
					ownerType: 'PRIMARY',
					__self__: 'should be removed'
				},
				{
					ownerType: 'something else',
					__self__: 'should not be removed'
				}
			], {
				__self__: 'something NEW'
			}, true);

			expect(OwnershipObj.RESTWrapperService.put).to.be.calledWith([
				{
					ownerType: 'something else',
					__self__: 'should not be removed'
				},
				{
					ownerType: 'PRIMARY',
					__self__: 'someLink/something NEW',
					notify: true
				}
			], sinon.match.any, sinon.match.any, sinon.match.any, {
				'Content-Type': 'application/json'
			});
		});
	});

	describe('editAdditionalOwners', () => {
		it('should remove all users other than primary user and insert additional users and groups', () => {

			OwnershipObj.RESTWrapperService = {
				put: sinon.spy()
			};

			OwnershipObj.editAdditionalOwners([
				{
					ownerType: 'PRIMARY',
					__self__: 'should not be removed'
				},
				{
					ownerType: 'something else',
					__self__: 'should be removed'
				}
			], [{
				__self__: 'some user'
			}], [{
				__self__: 'some group'
			}]);

			expect(OwnershipObj.RESTWrapperService.put).to.be.calledWith([
				{
					ownerType: 'PRIMARY',
					__self__: 'should not be removed'
				},
				{
					ownerType: 'ADDITIONAL_USER',
					__self__: 'someLink/some user'
				},
				{
					ownerType: 'ADDITIONAL_GROUP',
					__self__: 'someLink/some group'
				}
			], sinon.match.any, sinon.match.any, sinon.match.any, {
				'Content-Type': 'application/json'
			});
		});
	});

	describe('getFullList', () => {
		it('should returns a new copy of json object', () => {
			expect(OwnershipObj.getFullList()).to.deep.equal(OwnershipObj.json);
		});

		it('should return a clone copy of object that does not affects the original', () => {
			let cloneJson = OwnershipObj.getFullList();
			cloneJson.ownership.__self__ = 'modified';
			expect(cloneJson).to.not.deep.equal(OwnershipObj.json);
		});
	});
});