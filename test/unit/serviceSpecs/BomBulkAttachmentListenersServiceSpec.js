(() => {
    'use strict';
    describe('[MODEL] BomBulkAttachmentListeners', () => {
        let BomBulkAttachmentListeners, BulkBomAttachmentListenerInstance;
        let BomMessageService, EventService, BomBulkAttachment, $q, $rootScope;

        beforeEach(() => {
            module('com/autodesk/EventService.js');
            module({
                RESTWrapperService: {
                    get: sinon.stub()
                },
                BomMessageService: {
                    getBulkAttachmentRecivedMessage: sinon.stub(),
                    extractEventId: sinon.stub()
                },
                BomBulkAttachment: {
                    fetch: sinon.stub()
                }
            });
        });

        beforeEach(() => {
            inject((_EventService_, _BomMessageService_, _BomBulkAttachment_, _$q_, _$rootScope_) => {
                BomMessageService = _BomMessageService_;
                EventService = _EventService_;
                BomBulkAttachment = _BomBulkAttachment_;
                $q = _$q_;
                $rootScope = _$rootScope_;
            });

            BomBulkAttachmentListeners = System.get('com/autodesk/models/bomAttachment/bomBulkAttachmentListeners.service.js').default;
            BulkBomAttachmentListenerInstance = new BomBulkAttachmentListeners(BomMessageService, EventService, BomBulkAttachment);
        });

        afterEach(() => {
            EventService.unlisten(BulkBomAttachmentListenerInstance.getListener);
        });

        describe('[Initialization]', () => {
            it('Should have set a listener for get', () => {
                expect(BulkBomAttachmentListenerInstance.getListener).to.exist;
            });
        });

        describe('[STATE]', () => {
            it('Should respond to BulkBomAttachment get events by calling respondToGetListener with the provided arguments', () => {
                let responseStub = sinon.stub(BulkBomAttachmentListenerInstance, 'respondToGetListener');
                let urnList = [];
                let link = 'someAttachmentLink';
                let eventId = 'someEventId';
                let otherArgs = {};
                let event = `bomBulkAttachment:${eventId}:get`;
                let args = [urnList, link, otherArgs];

                EventService.send(event, args);

                expect(responseStub.calledOnce).to.be.true;
                expect(responseStub.calledWith(event, urnList, link, otherArgs)).to.be.true;

                responseStub.restore();
            });
        });

        describe('[METHOD] respondToGetListener', () => {
            it('Should fetch the model, and then send it with the correct message', () => {
                let respondedWith = null;
                let eventId = 'someAttachmentEventId';
                let urnList = [];
                let requestEvent = `bomBulkAttachment:${eventId}:get`;
                let responseEvent = `bomBulkAttachment:${eventId}:done`;
                let link = 'someAttachmentLink';
                let requestParams = {};
                let expectedResponse = {};
                let deferred = $q.defer();

                deferred.resolve(expectedResponse);
                BomBulkAttachment.fetch.returns(deferred.promise);
                BomMessageService.extractEventId.withArgs(requestEvent).returns(eventId);
                BomMessageService.getBulkAttachmentRecivedMessage.withArgs(eventId).returns(responseEvent);

                let listenerId = EventService.listen(responseEvent, (event, obj) => {
                    EventService.unlisten(listenerId);
                    respondedWith = obj;
                });

                BulkBomAttachmentListenerInstance.respondToGetListener(requestEvent, urnList, link, requestParams);

                $rootScope.$digest();

                expect(respondedWith).to.equal(expectedResponse);
            });
        });
    });
})();
