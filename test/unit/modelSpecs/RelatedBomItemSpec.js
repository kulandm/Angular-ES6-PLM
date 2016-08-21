'use strict';

describe('RelatedBomItem', function () {
	var relatedBomItem;
	var json;

	beforeEach(module('plm360.models'));

	beforeEach(function () {
		json = {
			__self__: '/api/v3/workspaces/59/items/6814/affected-items/6812',
			name: 'name',
			version: '[BLAH:42]',
			title: 'Some kind of a screw',
			lifecycle: {
				title: 'This is my lifecycle'
			}
		};

		relatedBomItem = new RelatedBomItem(json);
	});

	describe('constructor', function () {
		it('stores the data passed in', function () {
			expect(relatedBomItem.json).to.equal(json);
		});
	});

	describe('getItemId', function () {
		it('Returns a string item id', function () {
			var id = relatedBomItem.getItemId();
			expect(id).to.equal('6812');
		});
	});

	describe('getItemLink', function () {
		it('returns the item link', function () {
			var link = relatedBomItem.getItemLink();
			expect(link).to.equal(json.__self__);
		});
	});

	describe('getItemTitle', function () {
		it('returns the item title', function () {
			var title = relatedBomItem.getItemTitle();
			expect(title).to.equal(json.title);
		});
	});

	describe('getItemVersion', function () {
		it('returns the item version when there is one', function () {
			expect(relatedBomItem.getItemVersion()).to.equal(json.version);
		});

		it('returns an empty string when there is no version', function () {
			delete json.version;
			expect(relatedBomItem.getItemVersion()).to.equal('');
		});
	});

	describe('getItemDescriptor', function () {
		it('returns the item descriptor', function () {
			var descriptor = relatedBomItem.getItemDescriptor();
			expect(descriptor).to.equal(`${json.title} ${json.version}`);
		});
	});

	describe('getLifecycle', function () {
		it('returns the lifecycle of the item', function () {
			var title = relatedBomItem.getLifecycle();
			expect(title).to.equal(json.lifecycle.title);
		});
	});
});
