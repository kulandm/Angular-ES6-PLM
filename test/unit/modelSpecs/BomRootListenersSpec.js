'use strict';

describe('[MODEL] BomRootListeners', () => {
	// Model Handle
	let BomRootListeners;

	// Mock Data
	let mockBomRootListenersData;

	let $injector, EventService, MockPromiseStubber;

	beforeEach(module('com/autodesk/EventService.js',
		'com/autodesk/components/workspaceItem/viewBom/BomMessageService.js',
		'com/autodesk/models/bomApi/bomRootListeners.service.js',
		'plm360.mockObjects',
		'plm360.mockData',
		($provide) => {
			$provide.value('BomRoot', {
				fetch: () => {}
			});
		}));

	beforeEach(() => {
		// Inject services and values that will be used
		inject(function (_$injector_, _EventService_, _MockPromiseStubber_, MockBomRootListenersData) {
			$injector = _$injector_;
			EventService = _EventService_;
			MockPromiseStubber = _MockPromiseStubber_;
			mockBomRootListenersData = MockBomRootListenersData;
		});

		BomRootListeners = $injector.get('BomRootListeners');
	});

	afterEach(() => {
		EventService.unlisten(BomRootListeners.getListener);
	});

	describe('[Initialization]', () => {
		it('Should have set a listener for get', () => {
			expect(BomRootListeners.getListener).to.exist;
		});
	});

	describe('[STATE]', () => {
		// See BomRootListeners.registerGetListener
		it('Should respond to BomRoot get messages and call the response function with the correct arguments', () => {
			let event = 'bomRoot:uniqueID1:get';
			let link = mockBomRootListenersData.getData.link;
			let params = mockBomRootListenersData.getData.params;

			let responseStub = sinon.stub(BomRootListeners, 'respondToGetListener');
			responseStub.withArgs(event, link, params);

			// ----- WHEN -----
			// A get message is sent with some arguments
			EventService.send(event, link, params);

			// ----- THEN -----
			// The response function should be called with the correct arguments
			expect(responseStub.withArgs(event, link, params).calledOnce).to.be.true;

			responseStub.restore();
		});
	});

	describe('[METHOD] respondToGetListener', () => {
		it('Should send a done message with data corresponding to the provided parameters', () => {
			BomRootListeners.BomMessageService.getEventId = sinon.stub();
			BomRootListeners.BomMessageService.getEventId.returns('uniqueId2');
            BomRootListeners.BomMessageService.getBomTopLineReceivedMessage = sinon.stub();
            BomRootListeners.BomMessageService.getBomTopLineReceivedMessage.returns('bomRoot:uniqueId2:done');

			// ----- GIVEN -----
			// The call to fetch returns the correct data
			let event = 'bomRoot:uniqueId2:get';
			let link = mockBomRootListenersData.getData.link;
			let params = mockBomRootListenersData.getData.params;
			let response = mockBomRootListenersData.getData.response;

			let promiseStub = MockPromiseStubber.stubWithSuccess(BomRootListeners.BomRoot, 'fetch', response, [link, params]);
			let sendSpy = sinon.spy(BomRootListeners.EventService, 'send');
			sendSpy.withArgs('bomRoot:uniqueId2:done', response);

			// ----- When -----
			// the method is called
			BomRootListeners.respondToGetListener(event, link, params);

			// ----- Then -----
			// We expect a done message to be sent with the data corresponding to the link and params
			expect(sendSpy.withArgs('bomRoot:uniqueId2:done', response).calledOnce).to.be.true;

			promiseStub.restore();
			sendSpy.restore();
		});
	});
});
