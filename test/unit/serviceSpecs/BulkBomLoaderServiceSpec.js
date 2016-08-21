'use strict';

describe('BulkBomLoader', () => {
    let BulkBomLoader, BomMessageService, EventService, BulkBom, UrnParser, $q, $rootScope;
    let sandbox = sinon.sandbox.create();

    beforeEach(() => {
        module('com/autodesk/models/bulkBom/bulkBomLoader.service.js', 'com/autodesk/EventService.js', 'com/autodesk/UrnParser.js');
        module({
            BomMessageService: {
                getBulkBomFetchedSuccessMessage: sinon.stub(),
                extractEventId: sinon.stub()
            },
            BulkBom: {
                fetch: () => {}
            }
        });
    });

    beforeEach(() => {
        inject((_BulkBomLoader_, _BomMessageService_, _EventService_, _BulkBom_, _UrnParser_, _$q_, _$rootScope_) => {
            BulkBomLoader = _BulkBomLoader_;
            BomMessageService = _BomMessageService_;
            EventService = _EventService_;
            BulkBom = _BulkBom_;
            UrnParser = _UrnParser_;
            $q = _$q_;
            $rootScope = _$rootScope_;
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('[METHOD] loadBulkBom', () => {
        let eventId, queryPrams, endPointLink;

        beforeEach(() => {
            eventId = 'someItemUrn';
            queryPrams = {
                depth: 'someDepth'
            };
            endPointLink = 'someLink';
        });

        it('Should be able to make a proper request for fetching a Bulkbom', () => {
            let requestedLink = null;
            let sentParams = null;
            let getListenerId = EventService.listen(`bulkBom:${eventId}:get`, (event, aLink, params) => {
                EventService.unlisten(getListenerId);
                requestedLink = aLink;
                sentParams = params;
            });

            BulkBomLoader.loadBulkBom(eventId, endPointLink, queryPrams);

            expect(requestedLink).to.equal(endPointLink);
            expect(sentParams).to.equal(queryPrams);
        });

        it('Should listen for the returned BulkBom and then return it as a promise', () => {
            let doneMessage = `bulkbom:${eventId}:done`;
            let reponseObject = {
                nodes: [],
                edges: [],
                rootNodeId: eventId
            };
            let response = null;

            BomMessageService.getBulkBomFetchedSuccessMessage.returns(doneMessage);
            BulkBomLoader.loadBulkBom(eventId, endPointLink, queryPrams).then((bulkBom) => {
                response = bulkBom;
            });
            EventService.send(doneMessage, reponseObject);

            $rootScope.$digest();

            expect(response).to.equal(reponseObject);
        });
    });

    describe('[METHOD] requestForBulkBom', () => {
        it('Should send an event requesting for a BulkBom', () => {
            let eventId = 'an.item.urn';
            let endpointLink = `alink${eventId}bom`;
            let getEvent = `bulkBom:${eventId}:get`;
            let params = {
                param1: 'param1',
                param2: 'param2'
            };
            let sentLink = null;
            let sentParams = null;
            let sendSpy = sandbox.spy(EventService, 'send');

            let getListenerId = EventService.listen(getEvent, (event, aLink, args) => {
                EventService.unlisten(getListenerId);
                sentLink = aLink;
                sentParams = args;
            });

            BulkBomLoader.requestForBulkBom(eventId,endpointLink, params);

            expect(sendSpy.withArgs(getEvent, endpointLink, params).calledOnce).to.be.true;
            expect(sentLink).to.equal(endpointLink);
            expect(sentParams).to.equal(params);
        });
    });
});
