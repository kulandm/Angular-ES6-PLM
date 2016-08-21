'use strict';

describe('[MODEL] BomTable', () => {

	let BomTable, BomPath, mockBomRowData, table, numRows, mockBomChangeListTypeData, mockBomLinkableItemsData, mockLinkableItemObj, mockBomChangeAddObj, mockBomChangeAddData, BomField, mockBomChangeTypeData, mockViewDefinitionFieldData, mockViewDefinitionFieldObj, mockBomFieldDataOutputObj, mockBomRowWithDisplayProperties;
	let MockValidationUtil;

	beforeEach(module('com/autodesk/models/bomTable/bomTable.model.js',
		'com/autodesk/UrnParser.js',
		'com/autodesk/models/bomGraph/bomGraph.js',
		'com/autodesk/models/bomTable/bomTableColumnBuilder.service.js',
		'plm360.mockObjects', 'plm360.mockData', ($provide) => {
			// Stub in minimal amount of work for BomFieldData
			let mockBomFieldDataFactory = {
				fromField: (arg) => {
					return {
						getFieldId: () => {
							return arg.getId();
						},
						value: arg.value
					};
				}
			};
			$provide.value('BomFieldData', mockBomFieldDataFactory);
			$provide.value('FieldTypes', {
				NOOB: 0
			});
			$provide.value('$state', {
				href: sinon.stub()
			});

			$provide.value('ValidationUtil', {
				mapValidationErrors: sinon.stub(),
				clearValidationErrors: sinon.stub()
			});
		}));
	beforeEach(() => {
		BomPath = System.get('com/autodesk/models/bomTable/bomPath.model.js').default;

		inject((_BomTable_, _BomField_, ValidationUtil, MockBomChangeListTypeData, MockBomChangeTypeData, MockBomRowData, MockBomLinkableItemsData, MockLinkableItemObj, MockBomChangeAddObj, MockBomChangeAddData, MockViewDefinitionFieldObj, MockViewDefinitionFieldData, MockBomFieldDataOutputObj, MockBomRowWithDisplayProperties) => {

			BomTable = _BomTable_;
			BomField = _BomField_;

			MockValidationUtil = ValidationUtil;

			mockBomChangeListTypeData = MockBomChangeListTypeData;
			mockBomChangeTypeData = MockBomChangeTypeData;
			mockLinkableItemObj = MockLinkableItemObj;
			mockBomChangeAddObj = MockBomChangeAddObj;

			mockBomRowData = MockBomRowData;
			mockBomLinkableItemsData = MockBomLinkableItemsData;
			mockBomChangeAddData = MockBomChangeAddData;
			mockBomRowWithDisplayProperties = MockBomRowWithDisplayProperties;
			mockBomRowData.rows = mockBomRowData.rows.map((row) => {
				row.path = new BomPath(row.path);
				return row;
			});

			mockViewDefinitionFieldObj = MockViewDefinitionFieldObj;
			mockViewDefinitionFieldData = MockViewDefinitionFieldData;

			mockBomFieldDataOutputObj = MockBomFieldDataOutputObj;
		});

		table = new BomTable();

		let initialRows = [0, 1, 2, 3, 4, 10];
		initialRows.forEach((rowIndex, index, arr) => {
			table.addBomRow(mockBomRowData.rows[rowIndex]);
		});
		numRows = initialRows.length;

		expect(table.rowsInTable.size, 'Populating initial rows').to.equal(numRows);
	});

	describe('[STATE]', () => {
		it('Should init with initial columns', () => {
			expect(table.columns.length).to.equal(3);
		});
	});

	describe('[METHOD] clear', () => {
		it('Should empty the table', () => {
			table.clear();
			expect(table.rowsInTable.size).to.equal(0);
			expect(table.rows.length).to.equal(0);
			expect(table.columns.length).to.equal(3);
			expect(table.edgesToItemNumbers.size).to.equal(0);
			expect(table.maxFirstLevelItemNumber).to.equal(null);
			expect(table.edgesToFirstLevelItemNumbers.size).to.equal(0);
			expect(table.currentAddOrder).to.equal(0);
		});
	});

	describe('[METHOD] bomRowCompare', () => {
		beforeEach(() => {
			table.clear();
			mockBomRowData.rows.forEach((row, index, arr) => {
				table.addBomRow(row);
			});
		});

		it('Should mark equivalent rows as equal', () => {
			expect(table.bomRowCompare(mockBomRowData.rows[0], mockBomRowData.rows[0])).to.equal(0);
			expect(table.bomRowCompare(mockBomRowData.rows[2], mockBomRowData.rows[2])).to.equal(0);
		});

		it('Should order children from top down', () => {
			expect(table.bomRowCompare(mockBomRowData.rows[0], mockBomRowData.rows[1])).to.be.lt(0);
			expect(table.bomRowCompare(mockBomRowData.rows[2], mockBomRowData.rows[1])).to.be.gt(0);
		});

		it('Should order direct siblings by their item number and by edge id if item number is the same', () => {
			expect(table.bomRowCompare(mockBomRowData.rows[4], mockBomRowData.rows[6])).to.be.gt(0);
			expect(table.bomRowCompare(mockBomRowData.rows[4], mockBomRowData.rows[5])).to.be.lt(0);
			expect(table.bomRowCompare(mockBomRowData.rows[6], mockBomRowData.rows[5])).to.be.lt(0);
		});

		it('Should order rows on different branches by the item number of their neighboring parent', () => {
			expect(table.bomRowCompare(mockBomRowData.rows[4], mockBomRowData.rows[9])).to.be.lt(0);
		});

		it('Should order rows at different depths by the item number of their neighboring parent', () => {
			expect(table.bomRowCompare(mockBomRowData.rows[1], mockBomRowData.rows[9])).to.be.lt(0);
		});

		it('Should order newly added rows based on the order in which they were added', () => {
			expect(table.bomRowCompare(mockBomRowData.rows[11], mockBomRowData.rows[12])).to.be.lt(0);
		});

		it('Should always mark the newly added row be greater when compared to an existing row', () => {
			expect(table.bomRowCompare(mockBomRowData.rows[12], mockBomRowData.rows[1])).to.be.gt(0);
		});
	});

	describe('[METHOD] addBomRow', () => {
		it('Should be able to add rows that are neighbors', () => {
			table.addBomRow(mockBomRowData.rows[5]);
			numRows++;
			expect(table.rowsInTable.size).to.equal(numRows);
		});

		it('Should add rows that are neighbors even if they have the same item number', () => {
			table.addBomRow(mockBomRowData.rows[6]);
			numRows++;
			expect(table.rowsInTable.size).to.equal(numRows);
		});

		it('Should be able to add the children of an existing row', () => {
			table.addBomRow(mockBomRowData.rows[7]);
			numRows++;
			expect(table.rowsInTable.size).to.equal(numRows);
		});

		it('Should be able to add rows for the same edge but a different path', () => {
			table.addBomRow(mockBomRowData.rows[8]);
			numRows++;
			expect(table.rowsInTable.size).to.equal(numRows);
		});

		it('Should be able to add the children of an existing edge with a different path', () => {
			table.addBomRow(mockBomRowData.rows[8]);
			numRows++;
			table.addBomRow(mockBomRowData.rows[9]);
			numRows++;
			expect(table.rowsInTable.size).to.equal(numRows);
		});

		it('Should not add a row if a row with the same path and edgeId exists', () => {
			table.addBomRow(mockBomRowData.rows[4]);
			expect(table.rowsInTable.size).to.equal(numRows);
		});

		it('Should end up with the rows sorted', () => {
			table.clear();
			mockBomRowData.rows.forEach((row, index, arr) => {
				table.addBomRow(row);
			});

			mockBomRowData.rowOrder.forEach((rowIndex, index, arr) => {
				expect(table.rows[index], 'Row' + rowIndex + ' should be at index ' + index).to.deep.equal(mockBomRowData.rows[rowIndex]);
			});
		});
	});

	describe('[METHOD] rowExists', () => {
		it('Should return true if the row exists', () => {
			expect(table.rowExists(mockBomRowData.rows[4].path)).to.be.true;
		});

		it('Should return false if the row does not exist', () => {
			expect(table.rowExists(mockBomRowData.rows[5].path)).to.be.false;
		});
	});

	describe('[METHOD] getRowForPath', () => {
		it('Should return the row with the provided path', () => {
			expect(table.getRowForPath(new BomPath(mockBomRowData.rows[3].path))).to.equal(mockBomRowData.rows[3]);
		});

		it('Should return null if the path is not found', () => {
			expect(table.getRowForPath(new BomPath({
				edges: ['5', '10', '15']
			}))).to.be.null;
		});
	});

	describe('[METHOD] handleEdit', () => {
		let handleRevisionEditStub, handlePinningEditStub, handleStandardEditStub, recaculateStub;
		let editedEdge, editedField;

		beforeEach(() => {
			handleRevisionEditStub = sinon.stub(table, 'handleRevisionEdit');
			handlePinningEditStub = sinon.stub(table, 'handlePinningEdit');
			handleStandardEditStub = sinon.stub(table, 'handleStandardEdit');
			recaculateStub = sinon.stub(table, 'recalculateMaxItemNumber');

			editedEdge = '1';
			editedField = new mockBomFieldDataOutputObj();
		});

		afterEach(() => {
			handleRevisionEditStub.restore();
			handlePinningEditStub.restore();
			handleStandardEditStub.restore();
			recaculateStub.restore();
		});

		it('Should delegate to handleRevisionEdit if the field is the revision field', () => {
			editedField.getFieldSemantics.returns('$$REVISION');
			table.handleEdit(editedEdge, editedField);
			expect(handleRevisionEditStub.calledOnce).to.be.true;
			expect(handlePinningEditStub.called).to.be.false;
			expect(handleStandardEditStub.called).to.be.false;
			expect(recaculateStub.called).to.be.false;
		});

		it('Should delegate to handlePinningEdit if the field is the pinning field', () => {
			editedField.getFieldSemantics.returns('$$PINNING');
			table.handleEdit(editedEdge, editedField);
			expect(handleRevisionEditStub.called).to.be.false;
			expect(handlePinningEditStub.calledOnce).to.be.true;
			expect(handleStandardEditStub.called).to.be.false;
			expect(recaculateStub.called).to.be.false;
		});

		it('Should delegate to handleStandardEdit if the field is any other field', () => {
			editedField.getFieldSemantics.returns('$$BASIC');
			table.handleEdit(editedEdge, editedField);
			expect(handleRevisionEditStub.called).to.be.false;
			expect(handlePinningEditStub.called).to.be.false;
			expect(handleStandardEditStub.calledOnce).to.be.true;
			expect(recaculateStub.called).to.be.false;
		});

		it('Should call recalculateMaxItemNumber if the field is item number field', () => {
			editedField.getFieldSemantics.returns('$$BOM_ITEM_NUMBER');
			editedField.value = {itemNumber: 12};
			table.handleEdit(editedEdge, editedField);
			expect(handleRevisionEditStub.called).to.be.false;
			expect(handlePinningEditStub.called).to.be.false;
			expect(handleStandardEditStub.calledOnce).to.be.true;
			expect(recaculateStub.called).to.be.true;
		});
	});

	describe('[METHOD] handleStandardEdit', () => {
		it('Should try to add the correct edit', () => {
			let editedEdge = 'someEdge';
			let editedField = {
				id: 'SomeUniqueIdentifier',
				getValue: sinon.stub()
			};
			editedField.getValue.returns('3.111');

			let isCorrectEdit = (value) => {
				return (value.edgeId === editedEdge) &&
					(value.targetFieldData === editedField) &&
					(value.currentValue === editedField.getValue());
			};

			let trackerStub = sinon.stub(table.changeTracker, 'tryAddChange');
			trackerStub.withArgs(editedEdge, sinon.match(isCorrectEdit));

			table.handleStandardEdit(editedEdge, editedField);

			expect(trackerStub.withArgs(editedEdge, sinon.match(isCorrectEdit)).calledOnce).to.be.true;
			trackerStub.restore();
		});
	});

	describe('[METHOD] handlePinningEdit', () => {
		let row, revisionField, getRowStub, tryAddChangeStub, editedEdge, editedField;
		beforeEach(() => {
			revisionField = {
				options: [{
					version: {
						versionNumber: 1
					}
				}, {
					version: {
						versionNumber: 2
					}
				}],
				getValue: sinon.stub(),
				updateValue: sinon.stub()
			};

			revisionField.getValue.returns({
				version: {
					versionNumber: 1
				}
			});

			row = {
				hasLoadedRevisions: sinon.stub(),
				getFieldWithSemantics: sinon.stub(),
				item: {
					link: 'someLink'
				}
			};
			row.getFieldWithSemantics.returns(revisionField);
			row.hasLoadedRevisions.returns(true);

			getRowStub = sinon.stub(table, 'getRowForPath');
			getRowStub.returns(row);
			tryAddChangeStub = sinon.stub(table.changeTracker, 'tryAddChange');

			editedEdge = '1';
			editedField = new mockBomFieldDataOutputObj();
			editedField.getValue.returns('true');
			editedField.serverError = 'some error';
			editedField.getFieldSemantics.returns('$$PINNING');
		});

		afterEach(() => {
			getRowStub.restore();
			tryAddChangeStub.restore();
		});

		it('Should add the correct change if the the revision field is present', () => {
			table.handlePinningEdit(editedEdge, editedField);
			expect(tryAddChangeStub.calledOnce).to.be.true;
			expect(tryAddChangeStub.calledWith(editedEdge, sinon.match.any));
			let edit = tryAddChangeStub.args[0][1];

			expect(edit.edgeId).to.equal(editedEdge);
			expect(edit.targetFieldData).to.equal(editedField);
			expect(edit.currentValue).to.equal(editedField.getValue());
			expect(edit.serverError).to.equal(editedField.serverError);
			expect(edit.revisionField).to.equal(revisionField);
			expect(edit.currentRevision).to.equal(revisionField.getValue());
		});

		it('Should Update the revision field to the latest revision if the field is present and pinning is being set to false', () => {
			editedField.getValue('false');
			table.handlePinningEdit(editedEdge, editedField);
			expect(revisionField.updateValue.calledWith(revisionField.options[1]));
		});

		it('Should add the correct change if no revisions are found', () => {
			row.hasLoadedRevisions.returns(false);
			table.handlePinningEdit(editedEdge, editedField);
			expect(tryAddChangeStub.calledOnce).to.be.true;
			expect(tryAddChangeStub.calledWith(editedEdge, sinon.match.any));
			let edit = tryAddChangeStub.args[0][1];

			expect(edit.edgeId).to.equal(editedEdge);
			expect(edit.targetFieldData).to.equal(editedField);
			expect(edit.currentValue).to.equal(editedField.getValue());
			expect(edit.serverError).to.equal(editedField.serverError);
			expect(edit.revisionField).to.be.undefined;
			expect(edit.currentRevision).to.be.undefined;
			expect(edit.targetItem).to.equal(row.item);
		});

		it('Should do nothing if the row has neither an item or a revision field (newly added item)', () => {
			row.hasLoadedRevisions.returns(false);
			row.item = undefined;
			table.handlePinningEdit(editedEdge, editedField);
			expect(tryAddChangeStub.called).to.be.false;
		});
	});

	describe('[METHOD] handleRevisionEdit', () => {
		let row, pinningField, getRowStub, tryAddChangeStub, editedEdge, editedField;
		beforeEach(() => {
			pinningField = new mockBomFieldDataOutputObj();

			row = {
				getFieldWithSemantics: sinon.stub()
			};
			row.getFieldWithSemantics.returns(pinningField);

			getRowStub = sinon.stub(table, 'getRowForPath');
			getRowStub.returns(row);
			tryAddChangeStub = sinon.stub(table.changeTracker, 'tryAddChange');

			editedEdge = '1';
			editedField = new mockBomFieldDataOutputObj();
			editedField.getValue.returns({
				title: 'Some revision'
			});
			editedField.serverError = 'some error';
		});

		afterEach(() => {
			getRowStub.restore();
			tryAddChangeStub.restore();
		});

		it('Does nothing if the pinning field is not provided', () => {
			row.getFieldWithSemantics.returns(undefined);
			table.handleRevisionEdit(editedEdge, editedField);
			expect(tryAddChangeStub.called).to.be.false;
		});

		it('Should set pinning to true if something has changed', () => {
			editedField.isDirty.returns(true);
			table.handleRevisionEdit(editedEdge, editedField);
			expect(pinningField.updateValue.calledWith('true')).to.be.true;
		});

		it('Should not change pinning if nothing has changed', () => {
			editedField.isDirty.returns(false);
			table.handleRevisionEdit(editedEdge, editedField);
			expect(pinningField.updateValue.calledWith('true')).to.be.false;
		});

		it('Should create the correct change', () => {
			editedField.isDirty.returns(true);
			table.handleRevisionEdit(editedEdge, editedField);
			expect(tryAddChangeStub.calledOnce).to.be.true;
			expect(tryAddChangeStub.calledWith(editedEdge, sinon.match.any));
			let edit = tryAddChangeStub.args[0][1];

			expect(edit.edgeId).to.equal(editedEdge);
			expect(edit.targetFieldData).to.equal(pinningField);
			expect(edit.currentValue).to.equal(pinningField.getValue());
			expect(edit.serverError).to.equal(editedField.serverError);
			expect(edit.revisionField).to.equal(editedField);
			expect(edit.currentRevision).to.equal(editedField.getValue());
		});
	});

	describe('[METHOD] handleRemove', () => {
		let hasChangeListStub, tryAddChangeStub, revertChangeStub, rowExistsStub, recalacStub;
		let edgeId;

		beforeEach (() => {
			hasChangeListStub = sinon.stub(table.changeTracker, 'hasChangeList');
			tryAddChangeStub = sinon.stub(table.changeTracker, 'tryAddChange');
			revertChangeStub = sinon.stub(table, 'revertChange');
			rowExistsStub = sinon.stub(table, 'rowExists');
			recalacStub = sinon.stub(table, 'recalculateMaxItemNumber');
		});

		afterEach(() => {
			hasChangeListStub.restore();
			tryAddChangeStub.restore();
			revertChangeStub.restore();
			rowExistsStub.restore();
			recalacStub.restore();
		});

		it('Should not call revertChange method if there are no previous changes to row ', () => {
			edgeId = 'noPreviousChange';
			hasChangeListStub.withArgs(edgeId).returns(false);

			table.handleRemove(edgeId);

			expect(revertChangeStub.callCount).to.equal(0);
		});

		it('Should call revertChange method if there are previous changes to row ', () => {
			edgeId = 'hasPreviousChange';
			hasChangeListStub.withArgs(edgeId).returns(true);

			table.handleRemove(edgeId);

			expect(revertChangeStub.callCount).to.equal(1);
		});

		it('Should add a new remove change when an existing row is being marked to be removed', () => {
			edgeId = 'someEdge';
			let isCorrectEdit = (value) => {
				return value.edgeId === edgeId;
			};

			hasChangeListStub.withArgs(edgeId).returns(false);
			rowExistsStub.returns(true);
			tryAddChangeStub.returns(true);
			tryAddChangeStub.withArgs(edgeId, sinon.match(isCorrectEdit));

			table.handleRemove(edgeId);

			expect(tryAddChangeStub.withArgs(edgeId, sinon.match(isCorrectEdit)).calledOnce).to.be.true;
			expect(recalacStub.calledOnce).to.be.true;
		});
	});

	describe('[METHOD] queueSelectedRowsForRemoval', () => {
		let handleRemovalStub, getCheckedStub, rowA, rowB;
		beforeEach(() => {
			handleRemovalStub = sinon.stub(table, 'handleRemove');
			getCheckedStub = sinon.stub(table, 'getCheckedRows');
			rowA = {
				edgeId: '1',
				isChecked: true
			};
			rowB = {
				edgeId: '2',
				isChecked: true
			};
		});

		afterEach(() => {
			handleRemovalStub.restore();
			getCheckedStub.restore();
		});

		it('Should handle the removal of all checked rows', () => {
			getCheckedStub.returns([rowA, rowB]);

			table.queueSelectedRowsForRemoval();

			expect(handleRemovalStub.callCount).to.equal(2);
			expect(handleRemovalStub.calledWith(rowA.edgeId)).to.be.true;
			expect(handleRemovalStub.calledWith(rowB.edgeId)).to.be.true;
		});

		it('Should uncheck all rows', () => {
			getCheckedStub.returns([rowA, rowB]);

			table.queueSelectedRowsForRemoval();

			expect(rowA.isChecked).to.be.false;
			expect(rowB.isChecked).to.be.false;
		});
	});

	describe('[METHOD] buildDisplayProperties', () => {
		let viewDef, change, fields, systemField, customBomField;
		beforeEach(() => {
			viewDef = {
				getFields: sinon.stub()
			};

			change = {
				itemJSON: {
					__self__: 'someLink',
					item: {
						title: 'aTitle',
						version: 'aVersion'
					}
				}
			};

			systemField = new mockViewDefinitionFieldObj();
			systemField.getUrn.returns('anUrn');
			systemField.getTypeId.returns(4);
			systemField.getFieldSemantics.returns('$$DESCRIPTOR');

			customBomField = new mockViewDefinitionFieldObj();
			customBomField.getUrn.returns('anotherUrn');
			customBomField.getTypeId.returns(4);
			customBomField.getFieldSemantics.returns('$$BASIC');

			fields = [systemField, customBomField];
			viewDef.getFields.returns(fields);
		});

		it('Should build the correct properties', () => {
			let result = table.buildDisplayProperties(viewDef, change);

			expect(result[systemField.getUrn()].getFieldId()).to.equal(systemField.getUrn());
			expect(result[customBomField.getUrn()].getFieldId()).to.equal(customBomField.getUrn());
		});

		it('Should assign the descriptor property a value if it exists', () => {
			let result = table.buildDisplayProperties(viewDef, change);

			expect(result[systemField.getUrn()].value).to.equal('aTitle aVersion');
		});

	});

	describe('[METHOD] buildRow', () => {

		it('should build a new row with correct properties', () => {
			let buildDisplayPropertiesStub = sinon.stub(table, 'buildDisplayProperties');
			let displayProperties = {
				fieldA: 'some field data here'
			};
			buildDisplayPropertiesStub.returns(displayProperties);

			let getItemNumberStub = sinon.stub(table, 'getItemNumberForNewRow');
			let change = new mockBomChangeAddObj();
			let viewDef = {
					getEdgeFields: sinon.stub(),
					getNodeFields: sinon.stub()
			};
			change.itemJSON = {
				__self__: 'someLink',
				item: {
					title: 'aTitle',
					version: 'aVersion'
				}
			};

			getItemNumberStub.returns(5);
			change.getEdgeId = () => 'Temp@2785';

			let row = table.buildRow(null, change);

			expect(getItemNumberStub.calledOnce).to.be.true;
			expect(row.isExpandable).to.be.false;
			expect(row.isCollapsed).to.be.true;
			expect(row.hasFetchedChildren).be.false;
			expect(row.itemNumber).to.equal(5);
			expect(row.rowId).to.equal('1.5');
			expect(row.edgeId).to.equal('Temp@2785');
			expect(row.isNewlyAdded).to.be.true;
			expect(row.$$treeLevel).to.equal(1);
			expect(row.depth).to.equal(1);
			expect(row.displayProperties.fieldA).to.equal(displayProperties.fieldA);
			expect(row.displayProperties.$$BOM_ITEM_NUMBER).to.be.defined;

			getItemNumberStub.restore();
			buildDisplayPropertiesStub.restore();
		});
	});

	describe('[METHOD] queueAdds', () => {
		it('it should queue the Bom Items if they are not currently in the queue', () => {
			let addedItems = [];

			let queueSingleAddStub = sinon.stub(table, 'queueSingleAdd');
			let tryAddChangeStub = sinon.stub(table.changeTracker, 'tryAddChange');

			mockBomLinkableItemsData.itemLists[0].forEach((data) => {
				let item = new mockLinkableItemObj();
				item.json = data.ref.json;
				item.getItemId = () => {
					let ids = item.json.item.link.split(/\//);
					return ids[4] + '@' + ids[6];
				};

				let obj = {};
				obj.ref = item;

				addedItems.push(obj);
			});

			table.queueAdds(addedItems, null);

			expect(queueSingleAddStub.callCount).to.equal(addedItems.length);

			for (let i = 0; i < addedItems.length; ++i) {
				let edgeId = `Temp${addedItems[i].ref.getItemId()}`;
				expect(table.changeTracker.hasChangeList(edgeId)).to.equal.true;
			}
			tryAddChangeStub.restore();
		});
	});

	describe('[METHOD] queueSingleAdd', () => {
		it('Should add a single item to the queue', () => {
			let buildRowStub = sinon.stub(table, 'buildRow');
			let addAndShowStub = sinon.stub(table, 'addAndShow');
			let change = new mockBomChangeAddObj(mockBomChangeAddData.item1);

			mockBomChangeAddObj.getEdgeId = () => 'Temp@2785';

			table.queueSingleAdd(change, null);

			expect(buildRowStub.calledOnce).to.be.true;
			expect(addAndShowStub.calledOnce).to.be.true;

			buildRowStub.restore();
			addAndShowStub.restore();
		});
	});

	describe('[METHOD] addAndShow', () => {
		it('Should queue the BomChangeAdd and add a new row to the table corresponding to that change', () => {
			let addBomRowStub = sinon.stub(table, 'addBomRow');
			let change = new mockBomChangeAddObj(mockBomChangeAddData.item1);

			mockBomChangeAddObj.getEdgeId = () => 'Temp@2785';

			table.addAndShow(change, {});

			expect(addBomRowStub.calledOnce).to.be.true;

			addBomRowStub.restore();
		});
	});

	describe('[METHOD] reapplyChange', () => {
		let reapplyAddStub, reapplyEditStub, reapplyRemoveStub, change;

		beforeEach(() => {
			reapplyAddStub = sinon.stub(table, 'reapplyAdd');
			reapplyEditStub = sinon.stub(table, 'reapplyEdit');
			reapplyRemoveStub = sinon.stub(table, 'reapplyRemove');
			change = {
				changeType: null
			};
		});

		afterEach(() => {
			reapplyAddStub.restore();
			reapplyEditStub.restore();
			reapplyRemoveStub.restore();
		});

		it('Should call reapplyAdd if the change is an add', () => {
			change.changeType = mockBomChangeListTypeData.ADD;
			table.reapplyChange(change);

			expect(reapplyAddStub.calledOnce && reapplyAddStub.calledWith(change)).to.be.true;
			expect(reapplyEditStub.called).to.be.false;
			expect(reapplyRemoveStub.called).to.be.false;
		});

		it('Should call reapplyEdit if the change is an edit', () => {
			change.changeType = mockBomChangeListTypeData.EDIT;
			table.reapplyChange(change);

			expect(reapplyEditStub.calledOnce && reapplyEditStub.calledWith(change)).to.be.true;
			expect(reapplyAddStub.called).to.be.false;
			expect(reapplyRemoveStub.called).to.be.false;
		});

		it('Should call reapplyRemove if the change is a remove', () => {
			change.changeType = mockBomChangeListTypeData.REMOVE;
			table.reapplyChange(change);

			expect(reapplyRemoveStub.calledOnce && reapplyRemoveStub.calledWith(change)).to.be.true;
			expect(reapplyAddStub.called).to.be.false;
			expect(reapplyEditStub.called).to.be.false;

		});
	});

	describe('[METHOD] reapplyEdit', () => {
		it('Should reapply the edit to every field effected by the change', () => {
			let reapplyFieldEditStub = sinon.stub(table, 'reapplyFieldEdit');

			let changes = new Map();
			let changeA = {
				id: 'changeA'
			};
			let changeB = {
				id: 'changeB'
			};
			changes.set(mockBomChangeTypeData.FIELDEDIT, [changeA, changeB]);
			let targetRow = table.getRowForPath(BomPath.EmptyPath().WithSucceedingEdge('1'));

			let editChange = {
				changeType: mockBomChangeListTypeData.EDIT,
				edgeId: '1',
				drivingChanges: changes
			};

			table.reapplyEdit(editChange);

			expect(reapplyFieldEditStub.callCount).to.equal(2);
			expect(reapplyFieldEditStub.calledWith(targetRow, changeA)).to.be.true;
			expect(reapplyFieldEditStub.calledWith(targetRow, changeB)).to.be.true;

			reapplyFieldEditStub.restore();
		});
	});

	describe('[METHOD] reapplyAdd', () => {
		it('Should reapply the edit to every field effected by the change', () => {
			let reapplyFieldEditStub = sinon.stub(table, 'reapplyFieldEdit');
			let addAndShowStub = sinon.stub(table, 'addAndShow');
			let change = new mockBomChangeAddObj();
			let drivingChanges = new Map();

			mockBomChangeAddObj.getEdgeId = () => 'Temp@2785';
			drivingChanges.set(mockBomChangeTypeData.ADDITEM, [change]);

			let compliedAddChange = {
				changeType: mockBomChangeListTypeData.ADD,
				edgeId: 'Temp@2785',
				drivingChanges: drivingChanges
			};

			table.reapplyAdd(compliedAddChange);

			expect(addAndShowStub.calledOnce).to.be.true;
			expect(reapplyFieldEditStub.calledOnce).to.be.false;

			reapplyFieldEditStub.restore();
			addAndShowStub.restore();
		});
	});

	describe('[METHOD] reapplyFieldEdit', () => {
		let editHandlingStub, edit, field, row;
		beforeEach(() => {
			editHandlingStub = sinon.stub(table, 'handleEdit');

			edit = {
				edgeId: '1',
				targetFieldData: new mockBomFieldDataOutputObj(),
				currentValue: 'edited',
				serverError: [{
					code: 'An error code',
					arguments: [
						'Field 1',
						'1',
						'15'
					]
				}]
			};

			field = new mockBomFieldDataOutputObj();
			field.value = 'unedited';

			row = {
				edgeId: '1',
				displayProperties: {}
			};

			let id = 'some.id';
			row.displayProperties[id] = field;
			edit.targetFieldData.getFieldId.returns(id);

			editHandlingStub.withArgs(row.edgeId, field);
		});

		afterEach(() => {
			editHandlingStub.restore();
		});

		it('Should change the value of the field', () => {
			table.reapplyFieldEdit(row, edit);
			expect(field.updateValue.calledWith(edit.currentValue)).to.be.true;
		});

		it('Should set the field.serverError to whatever the edit.serverError is ', () => {
			edit.serverError = null;
			table.reapplyFieldEdit(row, edit);
			expect(field.serverError).to.be.null;
		});

		it('Should set the serverError of the field if there is an error', () => {
			table.reapplyFieldEdit(row, edit);
			expect(field.serverError.length).to.equal(1);
			expect(field.serverError).to.equal(edit.serverError);
		});

		it('Should request that the edit be handled', () => {
			table.reapplyFieldEdit(row, edit);

			expect(editHandlingStub.withArgs(row.edgeId, field).calledOnce).to.be.true;
		});

		it('Should update the revision field if the edit is a pinning edit', () => {
			edit.targetFieldData.getFieldSemantics.returns('$$PINNING');
			let revisionFieldId = 'some:Field:id';
			edit.revisionField = {
				getFieldId: () => {
					return revisionFieldId;
				}
			};
			edit.currentRevision = 'some revision';
			row.displayProperties[revisionFieldId] = {
				updateValue: sinon.stub()
			};

			table.reapplyFieldEdit(row, edit);

			expect(row.displayProperties[revisionFieldId].updateValue.calledOnce).to.be.true;
			expect(row.displayProperties[revisionFieldId].updateValue.calledWith(edit.currentRevision)).to.be.true;
		});
	});

	describe('[METHOD] getRowEditState', () => {
		let hasChangeListStub, getChangeListStub;

		beforeEach(() => {
			hasChangeListStub = sinon.stub(table.changeTracker, 'hasChangeList');
			getChangeListStub = sinon.stub(table.changeTracker, 'getChangeList');
		});

		afterEach(() => {
			hasChangeListStub.restore();
			getChangeListStub.restore();
		});

		it('Should return noChange if there were no edits made to the row', () => {
			let row = mockBomRowData.rows[1];
			hasChangeListStub.withArgs(row.edgeId).returns(false);

			let editState = table.getRowEditState(row);

			expect(editState.changeType).to.equal(null);

			hasChangeListStub.restore();
		});

		it('Should delegate the edit state checking to the changeList if it exists', () => {
			let row = mockBomRowData.rows[1];

			hasChangeListStub.withArgs(row.edgeId).returns(true);

			let editStateStub = sinon.stub();
			editStateStub.returns('SomeEditState');

			getChangeListStub.withArgs(row.edgeId).returns({
				getEditState: editStateStub
			});

			let editState = table.getRowEditState(row);

			expect(editState).to.equal('SomeEditState');
		});
	});

	describe('[METHOD] consumeErrors', () => {
		it('Should apply the errors', () => {
			let errors = [{}, {}, {}, {}];
			let fields = [{}, {}, {}];
			let edgeId = '111';

			let row = {
				getFields: sinon.stub(),
				clearRowErrors: sinon.stub(),
				addRowErrors: sinon.stub(),
				processFields: sinon.stub()
			};
			row.getFields.returns(fields);

			let getRowForPathStub = sinon.stub(table, 'getRowForPath');
			getRowForPathStub.returns(row);

			let unconsumed = [{}, {}];
			MockValidationUtil.mapValidationErrors.returns(unconsumed);

			table.consumeErrors({}, edgeId, errors);

			expect(row.clearRowErrors.calledOnce, 'row errors cleared').to.be.true;
			expect(MockValidationUtil.clearValidationErrors.calledOnce, 'field errors cleared').to.be.true;

			expect(MockValidationUtil.mapValidationErrors.calledOnce, 'field errors mapped').to.be.true;
			expect(row.addRowErrors.calledOnce, 'row errors placed').to.be.true;
			expect(row.processFields.calledOnce, 'fields reprocessed').to.be.true;
		});
	});

	describe('[METHOD] isRowInvalid', () => {
		it('Should mark invalid rows as invalid', () => {
			let row = mockBomRowData.rows[1];
			row.hasErrors = sinon.stub();
			row.hasErrors.returns(true);

			expect(table.isRowInvalid(row)).to.be.true;
		});

		it('Should not mark valid rows as invalid', () => {
			let row = mockBomRowData.rows[1];
			row.hasErrors = sinon.stub();
			row.hasErrors.returns(false);

			expect(table.isRowInvalid(row)).to.be.false;
		});
	});

	describe('[METHOD] isRowDirty', () => {
		let editStateStub, row;
		beforeEach(() => {
			row = mockBomRowData.rows[1];
			editStateStub = sinon.stub(table, 'getRowEditState');
		});

		afterEach(() => {
			editStateStub.restore();
		});

		it('Should mark valid rows with a changeType that is not NOCHANGE as dirty', () => {
			let changeTypes = [
				mockBomChangeListTypeData.ADD,
				mockBomChangeListTypeData.EDIT,
				mockBomChangeListTypeData.REMOVE
			];

			changeTypes.forEach((changeType) => {
				editStateStub.withArgs(row).returns({
					changeType: changeType,
					isInvalid: false
				});

				expect(table.isRowDirty(row), changeType).to.be.true;
			});
		});

		it('Should not mark invalid rows as dirty, no matter what their change type', () => {
			editStateStub.withArgs(row).returns({
				changeType: mockBomChangeListTypeData.ADD,
				isInvalid: true
			});

			expect(table.isRowDirty(row)).to.be.false;
		});

		it('Should not mark rows with no change type as dirty', () => {
			editStateStub.withArgs(row).returns({
				changeType: null,
				isInvalid: false
			});

			expect(table.isRowDirty(row)).to.be.false;
		});

		it('Should not mark rows with changeType NOCHANGE as dirty', () => {
			editStateStub.withArgs(row).returns({
				changeType: mockBomChangeListTypeData.NOCHANGE,
				isInvalid: false
			});

			expect(table.isRowDirty(row)).to.be.false;
		});
	});

	describe('[METHOD] getItemNumberForNewRow', () => {
		it('should provide 1 when there are no rows on the table', () => {
			table.clear();
			expect(table.getItemNumberForNewRow()).to.equal(1);
		});

		it('should provide correct itemNumber when there are rows on the table', () => {
			expect(table.getItemNumberForNewRow()).to.equal(100);
		});
	});

	describe('[METHOD] getCheckedRows', () => {
		it('Should return the checked rows', () => {
			mockBomRowData.rows[10].isChecked = true;

			let checkedRows = table.getCheckedRows();

			expect(checkedRows.length).to.equal(1);
			expect(checkedRows[0]).to.equal(mockBomRowData.rows[10]);
		});
	});

	describe('[METHOD] initColumns', () => {
		it('should initially contain three columns', () => {
			expect(table.columns.length).to.equal(3);
		});

		it('Should be able to add more columns to the current column list', () => {
			let otherColumns = [{name: 'some column'}, {name: 'another column'}];
			table.initColumns(otherColumns);
			expect(table.columns.length).to.equal(5);
		});
	});

	describe('[METHOD] addColumnsForViewDefinition', () => {
		let buildColumnStub;
		beforeEach(() => {
			buildColumnStub = sinon.stub(BomTable.BomTableColumnBuilder, 'buildColumnForViewDefField');
			buildColumnStub.returns({});
		});

		afterEach(() => {
			buildColumnStub.restore();
		});

		it('Should update the table with new columns', () => {
			let viewDef = {
				getFields: () => {
					return [{}, {}];
				}
			};

			table.addColumnsForViewDefinition(viewDef);
			expect(table.columns.length).to.equal(5);
		});
	});

	describe('[METHOD] reapplyRemove', () => {
		let getRowForPathStub, handleRemovalStub, compiledChange;

		beforeEach(() => {
			getRowForPathStub = sinon.stub(table, 'getRowForPath');
			handleRemovalStub = sinon.spy(table, 'handleRemove');
			compiledChange = {
				edgeId : '123123'
			};
		});

		afterEach(() => {
			getRowForPathStub.restore();
			handleRemovalStub.restore();
		});

		it('Should not add a new change when error happens after the actual removal', () => {
			getRowForPathStub.returns(null);

			table.reapplyRemove(compiledChange);

			expect(getRowForPathStub.calledOnce).to.be.true;
			expect(handleRemovalStub.callCount).to.equal(0);
		});

		it('Should reapply the remove change if it failed', () => {
			getRowForPathStub.returns(true);

			table.reapplyRemove(compiledChange);

			expect(getRowForPathStub.calledOnce).to.be.true;
			expect(handleRemovalStub.callCount).to.equal(1);
		});

	});

	describe('[METHOD] getMaxFirstLevelItemNumber', () => {
		it('Should return null if there are no entries in the table', () => {
			table.clear();

			expect(table.getMaxFirstLevelItemNumber()).to.equal(null);
		});

		it('Should return max if there are no entries in the table', () => {
			let firstLevelItemNumbers = new Map();

			firstLevelItemNumbers.set('edges1', 13);
			firstLevelItemNumbers.set('edges2', 11);
			firstLevelItemNumbers.set('edges3', 10);
			firstLevelItemNumbers.set('edges4', 9);
			table.edgesToFirstLevelItemNumbers = firstLevelItemNumbers;

			expect(table.getMaxFirstLevelItemNumber()).to.equal(13);
		});
	});

	describe('[METHOD] storeItemNumber', () => {
		beforeEach(() => {
			table.clear();
			expect(table.edgesToItemNumbers.size).to.equal(0);
			expect(table.edgesToFirstLevelItemNumbers.size).to.equal(0);
		});

		it('Should only add to the edgesToItemNumbers collection if the row is not top level', () => {
			table.storeItemNumber('anEdge', '123', 2);

			expect(table.edgesToItemNumbers.size).to.equal(1);
			expect(table.edgesToFirstLevelItemNumbers.size).to.equal(0);
		});

		it('Should add to both edgesToItemNumbers and edgesToFirstLevelItemNumbers if the row is top level', () => {
			table.storeItemNumber('anotherEdge', '200', 1);

			expect(table.edgesToItemNumbers.size).to.equal(1);
			expect(table.edgesToFirstLevelItemNumbers.size).to.equal(1);

		});
	});

	describe('[METHOD] revertChange', () => {
		let getChangeListStub, revertAddStub, revertFieldEditsStub;
		let edgeId, changeList;

		beforeEach(() => {
			getChangeListStub = sinon.stub(table.changeTracker, 'getChangeList');
			revertAddStub = sinon.stub(table, 'revertAdd');
			revertFieldEditsStub = sinon.stub(table, 'revertFieldEdits');
			changeList = {
				changes : new Map(),
				deleteChanges : sinon.stub()
			};
		});
		afterEach(() => {
			getChangeListStub.restore();
			revertAddStub.restore();
			revertFieldEditsStub.restore();
		});

		it('Should call revertAdd if there is pending add changes for the row pointed to by edgeId', () => {
			edgeId = 'AddedRowEdgeId';
			changeList.changes.set(mockBomChangeTypeData.ADDITEM, ['Added']);
			getChangeListStub.withArgs(edgeId).returns(changeList);

			table.revertChange(edgeId);

			expect(revertAddStub.calledOnce).to.be.true;
			expect(revertFieldEditsStub.called).to.be.false;
		});

		it('Should call revertFieldEdits if there is pending edits to the row pointed to by edgeId', () => {
			edgeId = 'EditedRowEdgeId';
			changeList.changes.set(mockBomChangeTypeData.FIELDEDIT, ['edited']);
			getChangeListStub.withArgs(edgeId).returns(changeList);

			table.revertChange(edgeId);

			expect(revertAddStub.calledOnce).to.be.false;
			expect(revertFieldEditsStub.called).to.be.true;
		});
	});

	describe('[METHOD] revertAdd', () => {
		let removeRowStub, deleteChangeListStub, getMaxItemNumberStub;
		let edgeId;

		beforeEach(() => {
			removeRowStub = sinon.stub(table, 'removeRowFromTable');
			deleteChangeListStub = sinon.stub(table.changeTracker, 'deleteChangeList');
			getMaxItemNumberStub = sinon.stub(table, 'getMaxFirstLevelItemNumber');
		});

		afterEach(() => {
			removeRowStub.restore();
			deleteChangeListStub.restore();
			getMaxItemNumberStub.restore();
		});

		it('Should remove a row from table and the related changes to the row', () => {
			edgeId = 'anEdge';
			table.edgesToFirstLevelItemNumbers.set(edgeId, 123);

			table.revertAdd(edgeId);

			expect(removeRowStub.calledOnce).to.be.true;
			expect(deleteChangeListStub.calledOnce).to.be.true;
			expect(getMaxItemNumberStub.calledOnce).to.be.false;
		});

		it('Should remove a row from table and also update the max item number', () => {
			edgeId = 'anotherEdge';
			table.edgesToFirstLevelItemNumbers.set(edgeId, table.maxFirstLevelItemNumber);

			table.revertAdd(edgeId);

			expect(removeRowStub.calledOnce).to.be.true;
			expect(deleteChangeListStub.calledOnce).to.be.true;
			expect(getMaxItemNumberStub.calledOnce).to.be.true;
		});
	});

	describe('[METHOD] recalculateMaxItemNumber', () => {
		let getMaxItemNumberStub;
		let editedEdge, itemNumber, changeType, currentMaxItemNumber = 10;

		beforeEach(() => {
			getMaxItemNumberStub = sinon.stub(table, 'getMaxFirstLevelItemNumber');
			table.maxFirstLevelItemNumber = currentMaxItemNumber;
		});

		afterEach(() => {
			getMaxItemNumberStub.restore();
		});

		it('Should update the max item number when item number gets edited to a number greater than current max', () => {
			editedEdge = 'anEdge';
			itemNumber = '123';
			changeType = mockBomChangeListTypeData.EDIT;
			table.edgesToFirstLevelItemNumbers.set(editedEdge, 5);

			expect(table.maxFirstLevelItemNumber).to.equal(currentMaxItemNumber);

			table.recalculateMaxItemNumber(editedEdge, itemNumber, changeType);

			expect(table.maxFirstLevelItemNumber).to.not.equal(currentMaxItemNumber);
			expect(table.maxFirstLevelItemNumber).to.equal(parseInt(itemNumber));
			expect(table.edgesToFirstLevelItemNumbers.get(editedEdge)).to.equal(parseInt(itemNumber));
			expect(getMaxItemNumberStub.called).to.be.false;
		});

		it('Should call getMaxFirstLevelItemNumber method if the new item number is smaller', () => {
			editedEdge = 'anotherEdge';
			itemNumber = '3';
			changeType = mockBomChangeListTypeData.EDIT;
			table.edgesToFirstLevelItemNumbers.set(editedEdge, 5);
			getMaxItemNumberStub.returns(8);

			expect(table.maxFirstLevelItemNumber).to.equal(currentMaxItemNumber);

			table.recalculateMaxItemNumber(editedEdge, itemNumber, changeType);

			expect(table.maxFirstLevelItemNumber).to.not.equal(currentMaxItemNumber);
			expect(table.maxFirstLevelItemNumber).to.equal(8);
			expect(table.edgesToFirstLevelItemNumbers.get(editedEdge)).to.equal(parseInt(itemNumber));
			expect(getMaxItemNumberStub.calledOnce).to.be.true;
		});

		it('Should not call getMaxFirstLevelItemNumber method if the item number of removed row is smaller than current max', () => {
			editedEdge = 'removedEdge';
			itemNumber = '3';
			changeType = mockBomChangeListTypeData.REMOVE;
			table.edgesToFirstLevelItemNumbers.set(editedEdge, parseInt(itemNumber));

			expect(table.maxFirstLevelItemNumber).to.equal(currentMaxItemNumber);

			table.recalculateMaxItemNumber(editedEdge, itemNumber, changeType);

			expect(table.maxFirstLevelItemNumber).to.equal(currentMaxItemNumber);
			expect(table.edgesToFirstLevelItemNumbers.has(editedEdge)).to.be.false;
			expect(getMaxItemNumberStub.called).to.be.false;
		});

		it('Should call getMaxFirstLevelItemNumber method if the item number of removed row is equal to current max', () => {
			editedEdge = 'anotherRemove';
			itemNumber = '10';
			changeType = mockBomChangeListTypeData.REMOVE;
			table.edgesToFirstLevelItemNumbers.set(editedEdge, parseInt(itemNumber));
			getMaxItemNumberStub.returns(6);

			expect(table.maxFirstLevelItemNumber).to.equal(currentMaxItemNumber);
			expect(table.maxFirstLevelItemNumber).to.equal(table.edgesToFirstLevelItemNumbers.get(editedEdge));

			table.recalculateMaxItemNumber(editedEdge, itemNumber, changeType);

			expect(table.maxFirstLevelItemNumber).to.equal(6);
			expect(table.edgesToFirstLevelItemNumbers.has(editedEdge)).to.be.false;
			expect(getMaxItemNumberStub.called).to.be.true;
		});
	});

	describe('[METHOD] removeRowFromTable', () => {
		let edgeId, numberOfFirstLevelRows, size;

		beforeEach(() => {
			table.clear();
			numberOfFirstLevelRows = 0;
			mockBomRowData.rows.forEach((row, index, arr) => {
				table.addBomRow(row);
				if (row.depth === 1) {
					numberOfFirstLevelRows++;
				}
			});
			size = table.rows.length;
		});

		it('Should remove the row from the table and update all the collections', () => {
			edgeId = mockBomRowData.rows[11].edgeId;
			expect(table.rows.length).to.equal(size);
			expect(table.rowsInTable.size).to.equal(size);
			expect(table.edgesToItemNumbers.size).to.equal(size-2);
			expect(table.edgesToFirstLevelItemNumbers.size).to.equal(numberOfFirstLevelRows);

			table.removeRowFromTable(edgeId, 1);

			expect(table.rows.length).to.equal(size-1);
			expect(table.rowsInTable.size).to.equal(size-1);
			expect(table.edgesToItemNumbers.size).to.equal(size-3);
			expect(table.edgesToFirstLevelItemNumbers.size).to.equal(numberOfFirstLevelRows-1);
		});

		it('Should remove a row that is not a first levle child', () => {
			edgeId = mockBomRowData.rows[12].edgeId;
			expect(table.rows.length).to.equal(size);
			expect(table.rowsInTable.size).to.equal(size);
			expect(table.edgesToItemNumbers.size).to.equal(size-2);
			expect(table.edgesToFirstLevelItemNumbers.size).to.equal(numberOfFirstLevelRows);

			table.removeRowFromTable(edgeId, 3);

			expect(table.rows.length).to.equal(size-1);
			expect(table.rowsInTable.size).to.equal(size-1);
			expect(table.edgesToItemNumbers.size).to.equal(size-3);
			expect(table.edgesToFirstLevelItemNumbers.size).to.equal(numberOfFirstLevelRows);

		});
	});

	describe('[METHOD] revertFieldEdits', () => {
	  let getRowForPathStub, edgeId;

	  beforeEach(() => {
	    getRowForPathStub = sinon.stub(table, 'getRowForPath');
			edgeId = mockBomRowWithDisplayProperties.row.edgeId;
			Object.keys(mockBomRowWithDisplayProperties.row.displayProperties).forEach((key) =>{
				mockBomRowWithDisplayProperties.row.displayProperties[key].updateValue = (newVal) =>{
					mockBomRowWithDisplayProperties.row.displayProperties[key].value = newVal;
				};
			});
	  });
		afterEach(() =>{
			getRowForPathStub.restore();
		});

	  it('Should be able to revert the field edits to their original values', () => {
	    getRowForPathStub.returns(mockBomRowWithDisplayProperties.row);

			// Verify that fields values are not equal to their original values.
			mockBomRowWithDisplayProperties.edits.forEach((edit) => {
					let field = mockBomRowWithDisplayProperties.row.displayProperties[edit.targetFieldData.getFieldId()];

					if (edit.targetFieldData.getFieldSemantics() === '$$PINNING') {
						let id = edit.revisionField.getFieldId();
						let revField = mockBomRowWithDisplayProperties.row.displayProperties[id];

						expect(edit.currentRevision.title).to.equal(revField.value.title);
						expect(edit.currentRevision.title).to.not.equal(revField.originalValue.title);

						expect(edit.revisionField.value.title).to.equal(revField.value.title);
						expect(revField.value.title).to.not.equal(revField.originalValue.title);
					}

					expect(field.value).to.deep.equal(edit.currentValue);
					expect(field.value).to.not.deep.equal(field.originalValue);
			});

			table.revertFieldEdits(edgeId, mockBomRowWithDisplayProperties.edits);

			// Verifty that after reverting field edits their values are back to their original values.
			mockBomRowWithDisplayProperties.edits.forEach((edit) => {
					let field = mockBomRowWithDisplayProperties.row.displayProperties[edit.targetFieldData.getFieldId()];

					if (edit.targetFieldData.getFieldSemantics() === '$$PINNING') {
						let id = edit.revisionField.getFieldId();
						let revField = mockBomRowWithDisplayProperties.row.displayProperties[id];

						expect(edit.currentRevision.title).to.not.equal(revField.value.title);
						expect(edit.currentRevision.title).to.not.equal(revField.originalValue.title);

						expect(edit.revisionField.value.title).to.not.equal(revField.value.title);
						expect(revField.value.title).to.equal(revField.originalValue.title);
					}

					expect(field.value).to.not.deep.equal(edit.currentValue);
					expect(field.value).to.deep.equal(field.originalValue);
			});
	  });
	});
});
