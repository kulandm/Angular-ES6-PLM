'use strict';

describe('[MODEL] BomPath', () => {

	let BomPath, initialPath;

	beforeEach(module('plm360.mockObjects', 'plm360.mockData'));

	beforeEach(() => {
		BomPath = System.get('com/autodesk/models/bomTable/bomPath.model.js').default;

		initialPath = new BomPath({
			edges: ['1', '2', '3']
		});
	});

	describe('[STATE] Initialization', () => {
		it('Should init with the correct edges', () => {
			expect(initialPath.edges).to.deep.equal(['1', '2', '3']);
		});
	});

	describe('[STATIC METHOD] EmptyPath', () => {
		it('Should create a path with no edges', () => {
			let emptyPath = BomPath.EmptyPath();
			expect(emptyPath.edges.length).to.equal(0);
		});
	});

	describe('[METHOD] equals', () => {
		it('Should return true if the paths are the same', () => {
			let pathA = new BomPath({
				edges: ['1', '2', '3']
			});

			let pathB = new BomPath({
				edges: ['1', '2', '3']
			});

			expect(pathA.equals(pathB)).to.be.true;
		});

		it('Should return false if one path is a subset of the other', () => {
			let pathA = new BomPath({
				edges: ['1', '2', '3']
			});

			let pathB = new BomPath({
				edges: ['1', '2']
			});

			expect(pathA.equals(pathB)).to.be.false;
		});

		it('Should return false if the paths are different', () => {
			let pathA = new BomPath({
				edges: ['1', '2', '3']
			});

			let pathB = new BomPath({
				edges: ['1', '2', '4']
			});

			expect(pathA.equals(pathB)).to.be.false;
		});
	});

	describe('[METHOD] asString', () => {
		it('Should return the correct string representation', () => {
			expect(initialPath.asString()).to.equal('1@2@3');
		});
	});

	describe('[METHOD] isPathToRoot', () => {
		it('Should return true when the path is empty', () => {
			expect(BomPath.EmptyPath().isPathToRoot()).to.be.true;
		});
		it('Should return false when the path is not empty', () => {
			expect(initialPath.isPathToRoot()).to.be.false;
		});
	});

	describe('[METHOD] getFinalEdge', () => {
		it('Should return null when the path is empty', () => {
			expect(BomPath.EmptyPath().getFinalEdge()).to.equal(null);
		});
		it('Should return the last edge of the path when the path is not empty', () => {
			expect(initialPath.getFinalEdge()).to.equal('3');
		});
	});

	describe('[METHOD] WithSucceedingPath', () => {
		it('Should combine the paths', () => {
			let newPath = initialPath.WithSucceedingPath(new BomPath({
				edges: ['4', '5', '6']
			}));
			expect(newPath.edges).to.deep.equal(['1', '2', '3', '4', '5', '6']);
		});
	});

	describe('[METHOD] WithSucceedingEdges', () => {
		it('Should combine the path with the provided edges', () => {
			let newPath = initialPath.WithSucceedingEdges(['4', '5', '6']);
			expect(newPath.edges).to.deep.equal(['1', '2', '3', '4', '5', '6']);
		});
	});

	describe('[METHOD] WithSucceedingEdge', () => {
		it('Should combine the path with the provided edge', () => {
			let newPath = initialPath.WithSucceedingEdge('4');
			expect(newPath.edges).to.deep.equal(['1', '2', '3', '4']);
		});
	});

	describe('[METHOD] WithPrecedingEdges', () => {
		it('Should precede the path with the provided edges', () => {
			let newPath = initialPath.WithPrecedingEdges(['4', '5', '6']);
			expect(newPath.edges).to.deep.equal(['4', '5', '6', '1', '2', '3']);
		});
	});

	describe('[METHOD] WithPrecedingEdge', () => {
		it('Should precede the path with the provided edge', () => {
			let newPath = initialPath.WithPrecedingEdge('4');
			expect(newPath.edges).to.deep.equal(['4', '1', '2', '3']);
		});
	});
});
