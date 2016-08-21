'use strict';

describe('[MODEL] BomNestedItemListeners', () => {
	// Model Handle
	let BomNestedItemListeners;

	// Mock Data
	let mockBomNestedItemListenersData;

	let EventService, MockPromiseStubber;

	beforeEach(module('com/autodesk/EventService.js',
		'com/autodesk/services/UrlParser.js',
		'com/autodesk/components/workspaceItem/viewBom/BomMessageService.js',
		'com/autodesk/models/bomApi/bomNestedItemListeners.service.js',
		'plm360.mockObjects', 'plm360.mockData',
		($provide) => {
			let mockBomNestedItem = () => {};
			mockBomNestedItem.fetch = () => {};
			mockBomNestedItem.add = () => {};
			mockBomNestedItem.edit = () => {};
			mockBomNestedItem.delete = () => {};
			$provide.value('BomNestedItem', mockBomNestedItem);
		}));

	beforeEach(() => {
		// Inject services and values that will be used
		inject(function (_EventService_, _MockPromiseStubber_, _BomNestedItemListeners_, MockBomNestedItemListenersData) {
			BomNestedItemListeners = _BomNestedItemListeners_;
			EventService = _EventService_;
			MockPromiseStubber = _MockPromiseStubber_;
			mockBomNestedItemListenersData = MockBomNestedItemListenersData;
		});
	});

	afterEach(() => {
		EventService.unlisten(BomNestedItemListeners.getListener);
		EventService.unlisten(BomNestedItemListeners.addListener);
		EventService.unlisten(BomNestedItemListeners.editListener);
		EventService.unlisten(BomNestedItemListeners.deleteListener);
	});

	describe('[Initialization]', () => {
		it('Should have set a listener for get', () => {
			expect(BomNestedItemListeners.getListener).to.exist;
		});

		it('Should have set a listener for add', () => {
			expect(BomNestedItemListeners.addListener).to.exist;
		});

		it('Should have set a listener for edit', () => {
			expect(BomNestedItemListeners.editListener).to.exist;
		});

		it('Should have set a listener for delete', () => {
			expect(BomNestedItemListeners.deleteListener).to.exist;
		});
	});

	describe('[STATE]', () => {
		// See BomNestedItemListeners.registerGetListener
		it('Should respond to BomNestedItem get messages and call the response function with the correct arguments', () => {
			let event = 'bomNestedItem:uniqueID1:get';
			let link = mockBomNestedItemListenersData.getData.link;
			let params = mockBomNestedItemListenersData.getData.params;

			let responseStub = sinon.stub(BomNestedItemListeners, 'respondToGetListener');
			responseStub.withArgs(event, link, params);

			// ----- WHEN -----
			// A get message is sent with some arguments
			EventService.send(event, link, params);

			// ----- THEN -----
			// The response function should be called with the correct arguments
			expect(responseStub.withArgs(event, link, params).calledOnce).to.be.true;

			responseStub.restore();
		});

		// See BomNestedItemListeners.registerAddListener
		it('Should respond to BomNestedItem add messages and call the response function with the correct arguments', () => {
			let event = 'bomNestedItem:uniqueID1:add';
			let link = mockBomNestedItemListenersData.addData.link;
			let json = mockBomNestedItemListenersData.addData.nestedItem;
			let config = mockBomNestedItemListenersData.addData.configuration;

			let responseStub = sinon.stub(BomNestedItemListeners, 'respondToAddListener');
			responseStub.withArgs(event, link, json, config);

			// ----- WHEN -----
			// An add message is sent with some arguments
			EventService.send(event, link, json, config);

			// ----- THEN -----
			// The response function should be called with the correct arguments
			expect(responseStub.withArgs(event, link, json, config).calledOnce).to.be.true;

			responseStub.restore();
		});

		it('Should respond to BomNestedItem edit messages and call the response function with the correct arguments', () => {
			let event = 'bomNestedItem:uniqueID1:edit';

			let json = mockBomNestedItemListenersData.saveData.json;

			let responseStub = sinon.stub(BomNestedItemListeners, 'respondToEditListener');
			responseStub.withArgs(event, json);

			// ----- WHEN -----
			// An save message is sent with some arguments
			EventService.send(event, json);

			// ----- THEN -----
			// The response function should be called with the correct arguments
			expect(responseStub.withArgs(event, json).calledOnce).to.be.true;

			responseStub.restore();
		});

		it('Should respond to BomNestedItem remove messages and call the response function with the correct arguments', () => {
			let event = 'bomNestedItem:uniqueID1:remove';

			let json = mockBomNestedItemListenersData.deleteData.json;

			let responseStub = sinon.stub(BomNestedItemListeners, 'respondToDeleteListener');
			responseStub.withArgs(event, json);

			// ----- WHEN -----
			// An remove message is sent with some arguments
			EventService.send(event, json);

			// ----- THEN -----
			// The response function should be called with the correct arguments
			expect(responseStub.withArgs(event, json).calledOnce).to.be.true;

			responseStub.restore();
		});
	});

	describe('[METHOD] respondToGetListener', () => {
		it('Should send a done message with data corresponding to the provided parameters', () => {
			// ----- GIVEN -----
			// The call to fetch returns the correct data
			let event = 'bomNestedItem:uniqueID2:get';
				let link = mockBomNestedItemListenersData.getData.link;
			let params = mockBomNestedItemListenersData.getData.params;
			let response = mockBomNestedItemListenersData.getData.response;

			let promiseStub = MockPromiseStubber.stubWithSuccess(BomNestedItemListeners.BomNestedItem, 'fetch', response, [link, params]);
			let sendSpy = sinon.spy(BomNestedItemListeners.EventService, 'send');
			sendSpy.withArgs('bomNestedItem:uniqueID2:done', response);

			// ----- When -----
			// the method is called
			BomNestedItemListeners.respondToGetListener(event, link, params);

			// ----- Then -----
			// We expect a done message to be sent with the data corresponding to the link and params
			expect(sendSpy.withArgs('bomNestedItem:uniqueID2:done', response).calledOnce).to.be.true;

			promiseStub.restore();
			sendSpy.restore();
		});
	});

	describe('[METHOD] respondToAddListener', () => {
		let event, addLink, json, configuration, addResponse, fetchLink, fetchResponse;
		beforeEach(() => {
			event = 'bomNestedItem:uniqueID2:add';
			addLink = mockBomNestedItemListenersData.addData.link;
			json = mockBomNestedItemListenersData.addData.nestedItem;
			configuration = mockBomNestedItemListenersData.addData.configuration;
			addResponse = mockBomNestedItemListenersData.addData.response;
			fetchLink = mockBomNestedItemListenersData.getData.link;
			fetchResponse = mockBomNestedItemListenersData.getData.response;
		});

		it('Should send a addDone message corresponding to the add if the save succeeded', () => {
			let addPromiseStub = MockPromiseStubber.stubWithSuccess(BomNestedItemListeners.BomNestedItem, 'add', addResponse, [addLink, sinon.match.any]);
			let fetchPromiseStub = MockPromiseStubber.stubWithSuccess(BomNestedItemListeners.BomNestedItem, 'fetch', fetchResponse, [fetchLink, configuration]);

			let sendSpy = sinon.spy(BomNestedItemListeners.EventService, 'send');
			sendSpy.withArgs('bomNestedItem:uniqueID2:addDone', fetchResponse);

			// ----- When -----
			// the method is called
			BomNestedItemListeners.respondToAddListener(event, addLink, json, configuration);

			// ----- Then -----
			// We expect a done message to be sent with the data corresponding to the link and params
			expect(sendSpy.withArgs('bomNestedItem:uniqueID2:addDone', fetchResponse).calledOnce).to.be.true;

			addPromiseStub.restore();
			fetchPromiseStub.restore();
			sendSpy.restore();
		});

		it('Should send a addFailed message corresponding to the add if the save failed', () => {
			let error = mockBomNestedItemListenersData.addData.error;
			let addPromiseStub = MockPromiseStubber.stubWithFailure(BomNestedItemListeners.BomNestedItem, 'add', error, [addLink, sinon.match.any]);
			let sendSpy = sinon.spy(BomNestedItemListeners.EventService, 'send');
			sendSpy.withArgs('bomNestedItem:uniqueID2:addFailed', sinon.match.any, error);
			// ----- When -----
			// the method is called
			BomNestedItemListeners.respondToAddListener(event, addLink, json, configuration);

			// ----- Then -----
			// We expect a done message to be sent with the data corresponding to the link and params
			expect(sendSpy.withArgs('bomNestedItem:uniqueID2:addFailed', error).calledOnce).to.be.true;

			addPromiseStub.restore();
			sendSpy.restore();
		});
	});

	describe('[METHOD] respondToEditListener', () => {
		let event, json, error;
		beforeEach(() => {
			event = 'bomNestedItem:uniqueID2:edit';
			json = mockBomNestedItemListenersData.saveData.json;
			error = mockBomNestedItemListenersData.saveData.error;
		});

		it('Should send a editDone message corresponding to the save if the save succeeded', () => {
			let editPromiseStub = MockPromiseStubber.stubWithSuccess(BomNestedItemListeners.BomNestedItem, 'edit', null);

			let sendSpy = sinon.spy(BomNestedItemListeners.EventService, 'send');
			sendSpy.withArgs('bomNestedItem:uniqueID2:editDone');

			// ----- When -----
			// the method is called
			BomNestedItemListeners.respondToEditListener(event, json);

			// ----- Then -----
			// We expect a done message to be sent
			expect(sendSpy.withArgs('bomNestedItem:uniqueID2:editDone').calledOnce).to.be.true;

			editPromiseStub.restore();
			sendSpy.restore();
		});

		it('Should send a editFailed message corresponding to the edit if the save failed', () => {
			let editPromiseStub = MockPromiseStubber.stubWithFailure(BomNestedItemListeners.BomNestedItem, 'edit', error);

			let sendSpy = sinon.spy(BomNestedItemListeners.EventService, 'send');
			sendSpy.withArgs('bomNestedItem:uniqueID2:editFailed', error);

			// ----- When -----
			// the method is called
			BomNestedItemListeners.respondToEditListener(event, json);

			// ----- Then -----
			// We expect a done message to be sent with the error
			expect(sendSpy.withArgs('bomNestedItem:uniqueID2:editFailed', error).calledOnce).to.be.true;

			editPromiseStub.restore();
			sendSpy.restore();
		});
	});

	describe('[METHOD] respondToDeleteListener', () => {
		let event, json, error;
		beforeEach(() => {
			event = 'bomNestedItem:uniqueID2:remove';
			json = mockBomNestedItemListenersData.deleteData.json;
			error = mockBomNestedItemListenersData.deleteData.error;
		});

		it('Should send a removeDone message corresponding to the save if the save succeeded', () => {
			let deletePromiseStub = MockPromiseStubber.stubWithSuccess(BomNestedItemListeners.BomNestedItem, 'delete', null);

			let sendSpy = sinon.spy(BomNestedItemListeners.EventService, 'send');
			sendSpy.withArgs('bomNestedItem:uniqueID2:removeDone');

			// ----- When -----
			// the method is called
			BomNestedItemListeners.respondToDeleteListener(event, json);

			// ----- Then -----
			// We expect a done message to be sent
			expect(sendSpy.withArgs('bomNestedItem:uniqueID2:removeDone').calledOnce).to.be.true;

			deletePromiseStub.restore();
			sendSpy.restore();
		});

		it('Should send a removeFailed message corresponding to the save if the save failed', () => {
			let deletePromiseStub = MockPromiseStubber.stubWithFailure(BomNestedItemListeners.BomNestedItem, 'delete', error);

			let sendSpy = sinon.spy(BomNestedItemListeners.EventService, 'send');
			sendSpy.withArgs('bomNestedItem:uniqueID2:removeFailed', error);

			// ----- When -----
			// the method is called
			BomNestedItemListeners.respondToDeleteListener(event, json);

			// ----- Then -----
			// We expect a failure message to be sent with the error
			expect(sendSpy.withArgs('bomNestedItem:uniqueID2:removeFailed', error).calledOnce).to.be.true;

			deletePromiseStub.restore();
			sendSpy.restore();
		});
	});
});
