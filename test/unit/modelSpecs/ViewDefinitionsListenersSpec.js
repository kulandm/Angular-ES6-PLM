'use strict';

describe('[SERVICE] ViewDefinitionsListeners', () => {
    let ViewDefinitionsListeners;

    let EventService, mockBomMessageService, mockViewDefinitions, mockPromiseStubber;

    beforeEach(module(
		'com/autodesk/EventService.js',
        'com/autodesk/models/bomViewDefinition/viewDefinitionsListeners.service.js',
		'plm360.mockObjects', 'plm360.mockData',
        ($provide) => {
			$provide.value('BomMessageService', {
                getViewDefinitionsReceivedMessage: sinon.stub()
            });
            $provide.value('ViewDefinitions', {
                fetch: () => {}
            });
		}
	));

    beforeEach(() => {
		// Inject services and values that will be used
		inject((_BomMessageService_, _EventService_, _ViewDefinitionsListeners_, ViewDefinitions, MockPromiseStubber) => {
			EventService = _EventService_;
			mockBomMessageService = _BomMessageService_;
            mockViewDefinitions = ViewDefinitions;
            mockPromiseStubber = MockPromiseStubber;

            // Runs the initialization code immediately
            ViewDefinitionsListeners = _ViewDefinitionsListeners_;
		});
	});

    describe('[STATE]', () => {
        it('Should respond to viewDefinitions get events by calling respondToGetListener with the provided arguments', () => {
            let responseStub = sinon.stub(ViewDefinitionsListeners, 'respondToGetListener');

            let message = 'viewDefinitions:someViewDefs:get';
            let arg1 = {};
            let arg2 = 2;
            EventService.send(message, arg1, arg2);

            expect(responseStub.calledOnce).to.be.true;
            expect(responseStub.calledWith(message, arg1, arg2)).to.be.true;

            responseStub.restore();
        });
    });

    describe('[METHOD] respondToGetListener', () => {
        it('Should fetch the model, than send it with the correct message', () => {
            let request = 'viewDefinitions:someViewDefs:get';
            let link = 'someViewDefsLink';
            let arg1 = 'someParam';

            let response = 'viewDefinitions:someViewDefs:done';
            let expectedResponseObject = {
                param1: 'Some param'
            };
            mockBomMessageService.getViewDefinitionsReceivedMessage.withArgs('someViewDefs').returns(response);

            mockPromiseStubber.stubWithSuccess(mockViewDefinitions, 'fetch', expectedResponseObject, [link, [arg1]]);

            let respondedWith = null;
            let listenerId = EventService.listen(response, (event, obj) => {
                EventService.unlisten(listenerId);
                respondedWith = obj;
            });

            ViewDefinitionsListeners.respondToGetListener(request, link, arg1);

            expect(respondedWith).to.equal(expectedResponseObject);
        });
    });
});
