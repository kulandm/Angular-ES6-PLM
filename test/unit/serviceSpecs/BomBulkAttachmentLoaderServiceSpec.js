(() => {
    'use strict';
    describe('BomBulkAttachmentLoader', () => {
        let BomBulkAttachmentLoader, BomMessageService, EventService, $q, $rootScope;
        let bomBulkAttachmentLoader;
        let sandbox = sinon.sandbox.create();

        beforeEach(() => {
            module('com/autodesk/EventService.js');
            module({
                BomMessageService: {
                    getBulkAttachmentRecivedMessage: sinon.stub(),
                    extractEventId: sinon.stub()
                },
                BomBulkAttachment: {
                    fetch: () => {}
                }
            });
        });

        beforeEach(() => {
            inject((_BomMessageService_, _EventService_, _$q_, _$rootScope_) => {
                BomMessageService = _BomMessageService_;
                EventService = _EventService_;
                $q = _$q_;
                $rootScope = _$rootScope_;
            });
            BomBulkAttachmentLoader = System.get('com/autodesk/models/bomAttachment/bomBulkAttachmentLoader.service.js').default;
            bomBulkAttachmentLoader = new BomBulkAttachmentLoader(BomMessageService, EventService, $q);
        });

        afterEach(() => {
            sandbox.restore();
        });

        describe('[METHOD] loadBulkAttachment', () => {
            let eventId, itemUrns, endPointLink, doneMessage, getMessage, queryParams;
            let buildEventIdStub;

            beforeEach(() => {
                eventId = 'someItemUrn';
                itemUrns = [];
                endPointLink = 'someLink';
                doneMessage = `bomBulkAttachment:${eventId}:done`;
                getMessage = `bomBulkAttachment:${eventId}:get`;
                queryParams = {};

                buildEventIdStub = sandbox.stub(bomBulkAttachmentLoader, 'buildEventId').returns(eventId);
                BomMessageService.getBulkAttachmentRecivedMessage.returns(doneMessage);
            });

            it('Should be able to make a proper request for fetching a BomBulkAttachment', () => {
                let sentItemUrns = null;
                let requestedLink = null;
                let getListenerId = EventService.listen(getMessage, (event, urns, aLink, queryParams) => {
                    EventService.unlisten(getListenerId);
                    requestedLink = aLink;
                    sentItemUrns = urns;
                });

                bomBulkAttachmentLoader.loadBulkAttachment(itemUrns, endPointLink, queryParams);

                expect(requestedLink).to.equal(endPointLink);
                expect(sentItemUrns.list).to.equal(itemUrns);
                expect(queryParams).to.equal(queryParams);
            });

            it('Should listen for the returned BulkBom and then return it as a promise', () => {
                let reponseObject = {
                    attachments: ['someAttachment']
                };
                let response = null;
                bomBulkAttachmentLoader.loadBulkAttachment(itemUrns, endPointLink, queryParams).then((bulkBomAttachment) => {
                    response = bulkBomAttachment;
                });
                EventService.send(doneMessage, reponseObject);

                $rootScope.$digest();

                expect(response).to.equal(reponseObject);
            });
        });

        describe('[METHOD] requestForAttachments', () => {
            it('Should send an event requesting for a BulkBom', () => {
                let eventId = 'someItemUrn';
                let itemUrns = [];
                let endPointLink = 'someLink';
                let getMessage = `bomBulkAttachment:${eventId}:get`;
                let queryParams = {};
                let requestedLink = null;
                let sentItemUrns = null;
                let sentParams = null;
                let sendSpy = sandbox.spy(EventService, 'send');
                let getListenerId = EventService.listen(getMessage, (event, urns, aLink, queryParams) => {
                    EventService.unlisten(getListenerId);
                    sentItemUrns = urns;
                    requestedLink = aLink;
                    sentParams = queryParams;
                });

                bomBulkAttachmentLoader.requestForAttachments(eventId, itemUrns, endPointLink, queryParams);

                expect(sendSpy.withArgs(getMessage, sinon.match.any, endPointLink, queryParams)).to.be.calledOnce;
                expect(sentItemUrns.list).to.equal(itemUrns);
                expect(requestedLink).to.equal(endPointLink);
                expect(sentParams).to.equal(queryParams);
            });
        });

        describe('[METHOD] buildEventId', () => {
            it('Should build an event id from the provided list of item urns', () => {
                let urnList = ['urn.U', 'urn.R', 'urn.N'];
                let expected = 'U,R,N';
                let eventId = bomBulkAttachmentLoader.buildEventId(urnList);

                expect(eventId).to.equal(expected);
            });
        });

    });
})();
