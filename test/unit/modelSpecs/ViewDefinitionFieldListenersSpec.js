'use strict';

describe('[SERVICE] ViewDefinitionFieldListeners', () => {
    let viewDefFieldListeners, EventService, mockBomMessageService, mockViewDefField, mockPromiseStubber;

    beforeEach(() => {
        module('com/autodesk/EventService.js',
        'com/autodesk/models/bomViewDefinition/ViewDefinitionFieldListeners.service.js',
        'plm360.mockObjects', 'plm360.mockData');

        module(($provide) => {
            $provide.value('BomMessageService', {
                getViewDefFieldRecievedMessage: sinon.stub()
            });
            $provide.value('ViewDefinitionField', {
                fetch: () => {}
            });
        });
    });

    beforeEach(() => {
        inject((_BomMessageService_, _EventService_, _ViewDefinitionFieldListeners_, ViewDefinitionField, MockPromiseStubber) => {
            EventService = _EventService_;
            mockBomMessageService = _BomMessageService_;
            mockViewDefField = ViewDefinitionField;
            mockPromiseStubber = MockPromiseStubber;
            viewDefFieldListeners = _ViewDefinitionFieldListeners_;
        });
    });

    afterEach(() => {
        EventService.unlisten(viewDefFieldListeners.getListener);
    });

    describe('[STATE]', () => {
        it('Should respond to viewDefinitionField get events by calling respondToGetListener with the provided arguments', () => {
            let responseStub = sinon.stub(viewDefFieldListeners, 'respondToGetListener');
            let link = 'someLink';
            let otherArgs = {};

            EventService.send('viewDefinitionField:customField:get', link, otherArgs);

            expect(responseStub.calledOnce).to.be.true;
            expect(responseStub.calledWith('viewDefinitionField:customField:get', link, otherArgs)).to.be.true;

            responseStub.restore();
        });
    });

    describe('[METHOD] respondToGetListener', () => {
        it('Should fetch the model, than send it with the correct message', () => {
            let request = 'viewDefinitionField:12:get';
            let link = 'someViewDefFieldLink';
            let arg1 = 'someParam';
            let respondedWith = null;
            let expectedResponseObject = {
                param1: 'Some param'
            };

            mockBomMessageService.getViewDefFieldRecievedMessage.withArgs('12').returns('viewDefinitionField:12:done');
            mockPromiseStubber.stubWithSuccess(mockViewDefField, 'fetch', expectedResponseObject, [link, [arg1]]);

            let listenerId = EventService.listen('viewDefinitionField:12:done', (event, obj) => {
                EventService.unlisten(listenerId);
                respondedWith = obj;
            });

            viewDefFieldListeners.respondToGetListener(request, link, arg1);

            expect(respondedWith).to.equal(expectedResponseObject);
        });
    });
});
