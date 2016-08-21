(() => {
    'use strict';

    describe('[MODEL] BomBulkAttachment', () => {
        let $q, $rootScope, MockBomAttachmentData, RESTWrapperService;
        let BomBulkAttachment, attachmentListsData, BomBulkAttachmentInstance;

        beforeEach(() => {
            module('plm360.mockData');
            module({
                RESTWrapperService: {
                    post: sinon.stub()
                }
            });
        });

        beforeEach(() => {
            inject((_RESTWrapperService_, _$q_, _$rootScope_, _MockBomAttachmentData_) => {
                MockBomAttachmentData = _MockBomAttachmentData_;
                RESTWrapperService = _RESTWrapperService_;
                $q = _$q_;
                $rootScope = _$rootScope_;
            });
            attachmentListsData = MockBomAttachmentData.attachmentList;
            BomBulkAttachment = System.get('com/autodesk/models/bomAttachment/bomBulkAttachment.model.js').default(RESTWrapperService);
            BomBulkAttachmentInstance = new BomBulkAttachment(attachmentListsData, MockBomAttachmentData.itemUrnList);
        });

        describe('[STATE]', () => {
            it('Should init with correct properties', () => {
                expect(BomBulkAttachmentInstance.attachmentLists.size).to.equal(attachmentListsData.length);
                expect(BomBulkAttachmentInstance.itemUrnList).to.equal(MockBomAttachmentData.itemUrnList);
            });
        });

        describe('[METHOD] getItemUrnList', () => {
            it('Should return the item urn list of BomBulkAttachment', () => {
                expect(BomBulkAttachmentInstance.getItemUrnList()).to.equal(MockBomAttachmentData.itemUrnList);
            });
        });

        describe('[METHOD] getAttachmentLists', () => {
            it('Should return the attachment lists of this BomBulkAttachment', () => {
                expect(BomBulkAttachmentInstance.getAttachmentLists().size).to.equal(attachmentListsData.length);
            });
        });

        describe('[STATIC METHOD] fetch', () => {
            it('Should be able to fetch the correct data when called with right parameters', () => {
                let postData = MockBomAttachmentData.itemUrnList;
                let link = 'mockBulkAttachmentLink';
                let headers = {
                    'Content-Type': 'application/vnd.autodesk.plm.attachments.bulk+json',
                    Accept: 'application/vnd.autodesk.plm.attachments.bulk+json',
                    skipCache: true
                };

                let deferred = $q.defer();
                deferred.resolve(attachmentListsData);
                RESTWrapperService.post.withArgs(postData, link, null, null, headers).returns(deferred.promise);

                let fetchedBulkAttachment = null;
                BomBulkAttachment.fetch(postData, link).then((fetchedData) => {
                    fetchedBulkAttachment = fetchedData;
                });

                $rootScope.$digest();

                expect(fetchedBulkAttachment.attachmentLists.size).to.equal(attachmentListsData.length);
                expect(fetchedBulkAttachment.itemUrnList).to.equal(MockBomAttachmentData.itemUrnList);
                expect(fetchedBulkAttachment.getItemUrnList()).to.equal(MockBomAttachmentData.itemUrnList);
                expect(fetchedBulkAttachment.getAttachmentLists().size).to.equal(attachmentListsData.length);
            });
        });
    });
})();
