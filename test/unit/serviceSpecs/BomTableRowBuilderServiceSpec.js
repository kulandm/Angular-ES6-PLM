(() => {
    'use strict';

    describe('[SERVICE] BomTableRowBuilder', () => {
        let BomGraph = System.get('com/autodesk/models/bomGraph/bomGraph.model.js').default;
        let BomNode = System.get('com/autodesk/models/bomGraph/bomNode.model.js').default;
        let BomEdge = System.get('com/autodesk/models/bomGraph/bomEdge.model.js').default;
        let BomFieldClass = System.get('com/autodesk/models/bomGraph/bomField.model.js').default;
        let BomPath = System.get('com/autodesk/models/bomTable/bomPath.model.js').default;
        let BomUIFieldSemantics = System.get('com/autodesk/models/bomFields/BomUIFieldSemantics.service.js').default;

        let BomTableRowBuilder, BomField, BomFieldData, MockViewDefinitionObj;

        let bomGraph, mockViewDefObj;

        let sandbox = sinon.sandbox.create();

        beforeEach(() => {
            module('plm360.mockObjects', 'plm360.mockData', 'com/autodesk/models/bomTable/bomTableRowBuilder.service.js');
            module({
                BomField: {
                    FromViewDefField: sinon.stub(),
                    ItemNumberField: sinon.stub()
                },
                BomFieldData: {
                    fromField: sinon.stub()
                }
            });
        });

        beforeEach(() => {
            inject((_BomTableRowBuilder_, _BomField_, _BomFieldData_, _MockViewDefinitionObj_) => {
                BomTableRowBuilder = _BomTableRowBuilder_;
                BomField = _BomField_;
                BomFieldData = _BomFieldData_;
                MockViewDefinitionObj = _MockViewDefinitionObj_;
            });

            bomGraph = new BomGraph();
            mockViewDefObj = new MockViewDefinitionObj();
        });

        afterEach(() => {
            sandbox.restore();
        });

        describe('[METHOD] buildRowFromPath', () => {
            let path, node, edge;
            let getNodeForPathStub, getEdgeForPathStub, addNodeDataStub, addEdgeDataStub, addItemNumberFieldStub;

            beforeEach(() => {
                path = sinon.createStubInstance(BomPath);
                path.isPathToRoot.returns(false);
                path.edges = [1, 2, 3];

                node = sinon.createStubInstance(BomNode);
                edge = sinon.createStubInstance(BomEdge);

                addNodeDataStub = sandbox.stub(BomTableRowBuilder, 'addNodeData');
                addEdgeDataStub = sandbox.stub(BomTableRowBuilder, 'addEdgeData');
                addItemNumberFieldStub = sandbox.stub(BomTableRowBuilder, 'addItemNumberField');
                getNodeForPathStub = sandbox.stub(bomGraph, 'getNodeForPath').withArgs(path).returns(node);
                getEdgeForPathStub = sandbox.stub(bomGraph, 'getEdgeForPath').withArgs(path).returns(edge);
            });

            it('Should build a row using data from both edge, and edge when the provided path leads to node that is not the root', () => {
                let row = BomTableRowBuilder.buildRowFromPath(path, bomGraph);

                expect(addNodeDataStub.withArgs(node, sinon.match.any).calledOnce).to.be.true;
                expect(addEdgeDataStub.withArgs(edge, sinon.match.any).calledOnce).to.be.true;
                expect(addItemNumberFieldStub.calledOnce).to.be.true;
            });

            it('Should only use data from root node when the provided path leads to the root', () => {
                path.isPathToRoot.returns(true);
                let row = BomTableRowBuilder.buildRowFromPath(path, bomGraph);

                expect(addNodeDataStub.withArgs(node, sinon.match.any).calledOnce).to.be.true;
                expect(addItemNumberFieldStub.calledOnce).to.be.true;
                expect(addEdgeDataStub.calledOnce).to.be.false;
            });
        });

        describe('[METHOD] addNodeData', () => {
            let bomNode;
            let rowArgs, someItem, someItemId, nodeFieldsMap, field1, field2;
            let addFieldsToTableRowSpy, formatAttachmentValueStub;

            beforeEach(() => {
                someItemId = 'someItemId';
                someItem = {};
                rowArgs = {
                    displayProperties: {}
                };

                nodeFieldsMap = new Map();
                field1 = {
                    getFieldSemantics: sinon.stub()
                };
                field2 = {
                    getFieldSemantics: sinon.stub()
                };
                nodeFieldsMap.set('field1', field1);
                nodeFieldsMap.set('field2', field2);
                BomFieldData.fromField.withArgs(field1).returns(field1);
                BomFieldData.fromField.withArgs(field2).returns(field2);

                bomNode = sinon.createStubInstance(BomNode);
                bomNode.itemId = someItemId;
                bomNode.item = someItem;
                bomNode.nodeProperties = {
                    fields: nodeFieldsMap
                };
                bomNode.hasChildren = true;
                bomNode.getItemId.returns(someItemId);
                bomNode.getItem.returns(someItem);
                bomNode.getOutDegree.returns(3);
                bomNode.getFields.returns(nodeFieldsMap);
                mockViewDefObj.hasAttachmentField.returns(false);
                addFieldsToTableRowSpy = sandbox.spy(BomTableRowBuilder, 'addFieldsToTableRow');
                formatAttachmentValueStub = sandbox.stub(BomTableRowBuilder, 'formatAttachmentValue');
            });
            it('Should add node information to the argument object for building a BomTableRow', () => {
                BomTableRowBuilder.addNodeData(bomNode, rowArgs, mockViewDefObj);

                expect(rowArgs.nodeId).to.equal(someItemId);
                expect(rowArgs.item).to.equal(someItem);
                expect(rowArgs.isExpandable).to.be.true;
                expect(rowArgs.hasFetchedChildren).to.be.true;
                expect(rowArgs.displayProperties.field1).to.equal(field1);
                expect(rowArgs.displayProperties.field2).to.equal(field2);
                expect(addFieldsToTableRowSpy.withArgs(rowArgs, bomNode).calledOnce).to.be.true;
            });

            it('Should call update attachment field method when there is attachment in the view', () => {
                mockViewDefObj.hasAttachmentField.returns(true);

                BomTableRowBuilder.addNodeData(bomNode, rowArgs, mockViewDefObj);

                expect(formatAttachmentValueStub.withArgs(bomNode, mockViewDefObj)).to.be.calledOnce;
            });
        });

        describe('[METHOD] addEdgeData', () => {
            let bomEdge;
            let someBomId, rowArgs, edgeFieldsMap, someItemNumber, field1, field2;
            let addFieldsToTableRowSpy;

            beforeEach(() => {
                someBomId = 'someBomId';
                someItemNumber = '1231';
                rowArgs = {
                    displayProperties: {}
                };

                edgeFieldsMap = new Map();
                field1 = {
                    getFieldSemantics: sinon.stub()
                };
                field2 = {
                    getFieldSemantics: sinon.stub()
                };
                edgeFieldsMap.set('field1', field1);
                edgeFieldsMap.set('field2', field2);
                BomFieldData.fromField.withArgs(field1).returns(field1);
                BomFieldData.fromField.withArgs(field2).returns(field2);

                bomEdge = sinon.createStubInstance(BomEdge);
                bomEdge.edgeId = someBomId;
                bomEdge.edgeProperties = {
                    fields: edgeFieldsMap,
                    itemNumber: someItemNumber
                };
                bomEdge.getBomId.returns(someBomId);
                bomEdge.getItemNumber.returns(someItemNumber);
                bomEdge.getFields.returns(edgeFieldsMap);

                addFieldsToTableRowSpy = sandbox.spy(BomTableRowBuilder, 'addFieldsToTableRow');
            });

            it('Should add edge information to the argument object for building a BomTableRow', () => {
                BomTableRowBuilder.addEdgeData(bomEdge, rowArgs);

                expect(rowArgs.edgeId).to.equal(someBomId);
                expect(rowArgs.itemNumber).to.equal(someItemNumber);
                expect(rowArgs.displayProperties.field1).to.equal(field1);
                expect(rowArgs.displayProperties.field2).to.equal(field2);
                expect(addFieldsToTableRowSpy.withArgs(rowArgs, bomEdge).calledOnce).to.be.true;
            });
        });

        describe('[METHOD] addItemNumberField', () => {
            it('Should build a BomField instance for the item number of a bom item', () => {
                let someItemNumber = '123';
                let path = sinon.createStubInstance(BomPath);
                path.getPathLength.returns(1);

                let rowArgs = {
                    path: path,
                    itemNumber: someItemNumber,
                    displayProperties: {}
                };

                let anItemNumberField = {
                    getFieldId: sinon.stub().returns(BomUIFieldSemantics.BOM_ITEM_NUMBER)
                };
                BomField.ItemNumberField.returns(anItemNumberField);
                BomFieldData.fromField.withArgs(anItemNumberField).returns(anItemNumberField);

                BomTableRowBuilder.addItemNumberField(rowArgs);

                let itemNumberField = rowArgs.displayProperties[BomUIFieldSemantics.BOM_ITEM_NUMBER];

                expect(itemNumberField).to.equal(anItemNumberField);
                expect(itemNumberField.value.depth).to.equal(1);
                expect(itemNumberField.value.itemNumber).to.equal(someItemNumber);
            });
        });

        describe('[METHOD] addFieldsToTableRow', () => {
            let fields, fieldA, fieldB, row, node;

            beforeEach(() => {
                fields = new Map();
                fieldA = {
                    value: 'someAttachmentLink',
                    getFieldSemantics: sinon.stub()
                };
                fieldB = {
                    getFieldSemantics: sinon.stub()
                };

                fields.set('A', fieldA);
                fields.set('B', fieldB);

                row = {
                    displayProperties: {},
                    nodeId: 'aNodeId'
                };

                node = sinon.createStubInstance(BomNode);
                node.getFields.returns(fields);
            });

            it('Should add each property to the row as an instance of BomFieldData', () => {
                BomFieldData.fromField.withArgs(sinon.match.same(fieldA)).returns('FIELDA');
                BomFieldData.fromField.withArgs(sinon.match.same(fieldB)).returns('FIELDB');

                BomTableRowBuilder.addFieldsToTableRow(row, node);

                expect(row.displayProperties.A).to.equal('FIELDA');
                expect(row.displayProperties.B).to.equal('FIELDB');
            });
        });

        describe('[METHOD] formatAttachmentValue', () => {
            let attachmentField, bomNode, wsId, itemUrn, dmsId, viewDefField, attachmentLink;

            beforeEach(() => {
                wsId = 'someWSId';
                itemUrn = 'someItemUrn';
                dmsId = 'someDmsId';
                attachmentLink = 'someAttachmentLink';
                attachmentField = {
                    value: attachmentLink,
                    getValue: sinon.stub().returns(attachmentLink)
                };
                viewDefField = {
                    getUrn: sinon.stub()
                };
                bomNode = sinon.createStubInstance(BomNode);
                bomNode.getWorkspaceId.returns(wsId);
                bomNode.getItemUrn.returns(itemUrn);
                bomNode.getDmsId.returns(dmsId);
                bomNode.getField.returns(attachmentField);
                mockViewDefObj.getFieldWithSemantics.returns(viewDefField);
            });

            it('Should add default count to the attachment field', () => {
                expect(attachmentField.value.count).to.be.undefined;

                BomTableRowBuilder.formatAttachmentValue(bomNode, mockViewDefObj);

                expect(attachmentField.value.count).to.equal(0);
            });

            it('Should add item id to the attachment field', () => {
                expect(attachmentField.value.itemId).to.be.undefined;

                BomTableRowBuilder.formatAttachmentValue(bomNode, mockViewDefObj);

                expect(attachmentField.value.itemId).to.equal(dmsId);
            });

            it('Should add workspace id to the attachment field', () => {
                expect(attachmentField.value.workspaceId).to.be.undefined;

                BomTableRowBuilder.formatAttachmentValue(bomNode, mockViewDefObj);

                expect(attachmentField.value.workspaceId).to.equal(wsId);
            });

            it('Should add item urn to the attachment field', () => {
                expect(attachmentField.value.itemUrn).to.be.undefined;

                BomTableRowBuilder.formatAttachmentValue(bomNode, mockViewDefObj);

                expect(attachmentField.value.itemUrn).to.equal(itemUrn);
            });

            it('Should add an empty attachment list to the field', () => {
                expect(attachmentField.value.attachments).to.be.undefined;

                BomTableRowBuilder.formatAttachmentValue(bomNode, mockViewDefObj);

                expect(attachmentField.value.attachments.getSize()).to.equal(0);
                expect(attachmentField.value.attachments.getAttachments()).to.be.empty;
                expect(attachmentField.value.attachments.getItemId()).to.equal(itemUrn);
            });

            it('Should add link to the attachment link field', () => {
                expect(attachmentField.value.attachmentLink).to.be.undefined;

                BomTableRowBuilder.formatAttachmentValue(bomNode, mockViewDefObj);

                expect(attachmentField.value.attachmentLink).to.equal(attachmentLink);
            });
        });
    });
})();
