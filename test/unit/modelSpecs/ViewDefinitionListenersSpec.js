'use strict';

describe('[SERVICE] ViewDefinitionListeners', () => {
    let ViewDefinitionListeners;

    let EventService, mockBomMessageService, mockViewDefinition, mockPromiseStubber;

    beforeEach(module(
		'com/autodesk/EventService.js',
        'com/autodesk/models/bomViewDefinition/viewDefinitionListeners.service.js',
		'plm360.mockObjects', 'plm360.mockData',
        ($provide) => {
			$provide.value('BomMessageService', {
                getViewDefinitionReceivedMessage: sinon.stub()
            });
            $provide.value('ViewDefinition', {
                fetch: () => {}
            });
		}
	));

    beforeEach(() => {
		// Inject services and values that will be used
		inject((_BomMessageService_, _EventService_, _ViewDefinitionListeners_, ViewDefinition, MockPromiseStubber) => {
			EventService = _EventService_;
			mockBomMessageService = _BomMessageService_;
            mockViewDefinition = ViewDefinition;
            mockPromiseStubber = MockPromiseStubber;

            // Runs the initialization code immediately
            ViewDefinitionListeners = _ViewDefinitionListeners_;
		});
	});

    afterEach(() => {
        EventService.unlisten(ViewDefinitionListeners.getListener);
    });

    describe('[STATE]', () => {
        it('Should respond to viewDefinition get events by calling respondToGetListener with the provided arguments', () => {
            let responseStub = sinon.stub(ViewDefinitionListeners, 'respondToGetListener');

            let message = 'viewDefinition:someViewDefs:get';
            let arg1 = 'some link';
            let arg2 = 2;
            EventService.send(message, arg1, arg2);

            expect(responseStub.calledOnce).to.be.true;
            expect(responseStub.calledWith(message, arg1, arg2)).to.be.true;

            responseStub.restore();
        });
    });

    describe('[METHOD] respondToGetListener', () => {
        it('Should fetch the model, than send it with the correct message', () => {
            let request = 'viewDefinition:someViewDef:get';
            let v3Link = 'api/v3/workspaces/8/views/5/viewdef/2';
            let arg1 = 'someParam';

            let response = 'viewDefinition:someViewDef:done';
            let expectedResponseObject = {
                param1: 'Some param'
            };

            mockBomMessageService.getViewDefinitionReceivedMessage.withArgs('someViewDef').returns(response);

            mockPromiseStubber.stubWithSuccess(mockViewDefinition, 'fetch', expectedResponseObject, [v3Link, [arg1]]);

            let respondedWith = null;
            let listenerId = EventService.listen(response, (event, obj) => {
                EventService.unlisten(listenerId);
                respondedWith = obj;
            });

            ViewDefinitionListeners.respondToGetListener(request, v3Link, arg1);
            expect(respondedWith).to.equal(expectedResponseObject);
        });
    });
});
