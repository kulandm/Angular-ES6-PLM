'use strict';

describe('[SERVICE] BulkBomListeners', () => {
    let bulkBomListeners, eventService, mockBomMessageService, bulkBom;
    let $q, $rootScope;

    beforeEach(() => {
        module('com/autodesk/EventService.js',
            'com/autodesk/models/bulkBom/bulkBomListeners.service.js'
        );
        module({
            BomMessageService: {
                getBulkBomFetchedSuccessMessage: sinon.stub(),
                extractEventId: sinon.stub()
            },
            UrlParser: {},
            BulkBom: {
                fetch: sinon.stub()
            }
        });
    });

    beforeEach(() => {
        inject((_BomMessageService_, _EventService_, _BulkBomListeners_, _BulkBom_, _$q_, _$rootScope_) => {
            mockBomMessageService = _BomMessageService_;
            eventService = _EventService_;
            bulkBom = _BulkBom_;
            bulkBomListeners = _BulkBomListeners_;
            $q = _$q_;
            $rootScope = _$rootScope_;
        });
    });

    afterEach(() => {
        eventService.unlisten(bulkBomListeners.getListener);
    });

    describe('[STATE]', () => {
        it('Should respond to bulkBom get events by calling respondToGetListener with the provided arguments', () => {
            let responseStub = sinon.stub(bulkBomListeners, 'respondToGetListener');
            let link = 'someLink';
            let eventId = 'anItemUrn';
            let otherArgs = {};

            eventService.send(`bulkBom:${eventId}:get`, link, otherArgs);

            expect(responseStub.calledOnce).to.be.true;
            expect(responseStub.calledWith(`bulkBom:${eventId}:get`, link, otherArgs)).to.be.true;

            responseStub.restore();
        });
    });

    describe('[METHOD] respondToGetListener', () => {
        it('Should fetch the model, and then send it with the correct message', () => {
            let itemUrn = 'some.item.urn';
            let requestEvent = `bulkBom:${itemUrn}:get`;
            let responseEvent = `bulkBom:${itemUrn}:done`;
            let link = 'bulkBomEndpointLink';
            let requestParams = {
                depth: 2
            };
            let respondedWith = null;
            let expectedResponseObject = {
                nodes: [],
                edges: [],
                root: itemUrn
            };
            let deferred = $q.defer();
            deferred.resolve(expectedResponseObject);

            bulkBom.fetch.returns(deferred.promise);
            mockBomMessageService.getBulkBomFetchedSuccessMessage.withArgs(itemUrn).returns(responseEvent);
            mockBomMessageService.extractEventId.withArgs(requestEvent).returns(itemUrn);

            let listenerId = eventService.listen(responseEvent, (event, obj) => {
                eventService.unlisten(listenerId);
                respondedWith = obj;
            });

            bulkBomListeners.respondToGetListener(requestEvent, link, requestParams);

            $rootScope.$digest();

            expect(respondedWith).to.equal(expectedResponseObject);
        });
    });
});
