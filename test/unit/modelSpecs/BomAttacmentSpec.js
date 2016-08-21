(() => {
    'use strict';

    describe('[MODEL] BomAttachment', () => {
        let BomAttachment, MockBomAttachmentData;
        let BomAttachmentInstance;

        beforeEach(() => {
            module('plm360.mockData');
        });

        beforeEach(() => {
            inject((_MockBomAttachmentData_) => {
                MockBomAttachmentData = _MockBomAttachmentData_;
            });

            BomAttachment = System.get('com/autodesk/models/bomAttachment/bomAttachment.model.js').default;
            BomAttachmentInstance = new BomAttachment(MockBomAttachmentData.attachment);
        });

        describe('[STATE]', () => {
            it('Should init with correct properties', () => {
                expect(BomAttachmentInstance.__self__).to.equal(MockBomAttachmentData.attachment.__self__);
                expect(BomAttachmentInstance.createdBy).to.equal(MockBomAttachmentData.attachment.createdBy);
                expect(BomAttachmentInstance.creationDate).to.equal(MockBomAttachmentData.attachment.creationDate);
                expect(BomAttachmentInstance.lastModifiedBy).to.equal(MockBomAttachmentData.attachment.lastModifiedBy);
                expect(BomAttachmentInstance.lastModifiedDate).to.equal(MockBomAttachmentData.attachment.lastModifiedDate);
                expect(BomAttachmentInstance.pinningPolicy).to.equal(MockBomAttachmentData.attachment.pinningPolicy);
                expect(BomAttachmentInstance.attachmentId).to.equal(MockBomAttachmentData.attachment.attachmentId);
                expect(BomAttachmentInstance.tenant).to.equal(MockBomAttachmentData.attachment.tenant);
                expect(BomAttachmentInstance.itemId).to.equal(MockBomAttachmentData.attachment.itemId);
            });
        });

        describe('[METHOD] getSelfLink', () => {
            it('Should return the correct dms id of the node', () => {
                expect(BomAttachmentInstance.getSelfLink()).to.equal(MockBomAttachmentData.attachment.__self__);
            });
        });

        describe('[METHOD] getCreatedBy', () => {
            it('Should return the user who created this attachment', () => {
                expect(BomAttachmentInstance.getCreatedBy()).to.equal(MockBomAttachmentData.attachment.createdBy);
            });
        });

        describe('[METHOD] getCreationDate', () => {
            it('Should return the date when the attachment was created', () => {
                expect(BomAttachmentInstance.getCreationDate()).to.equal(MockBomAttachmentData.attachment.creationDate);
            });
        });

        describe('[METHOD] getLastModifier', () => {
            it('Should return the user who modified the attachment last', () => {
                expect(BomAttachmentInstance.getLastModifier()).to.equal(MockBomAttachmentData.attachment.lastModifiedBy);
            });
        });

        describe('[METHOD] getLastModificationDate', () => {
            it('Should return the last modification date of the attachment', () => {
                expect(BomAttachmentInstance.getLastModificationDate()).to.equal(MockBomAttachmentData.attachment.lastModifiedDate);
            });
        });

        describe('[METHOD] getPinningPolicy', () => {
            it('Should return the pinning policy for this attachment', () => {
                expect(BomAttachmentInstance.getPinningPolicy()).to.equal(MockBomAttachmentData.attachment.pinningPolicy);
            });
        });

        describe('[METHOD] getAttachmentId', () => {
            it('Should return the id of the attachment', () => {
                expect(BomAttachmentInstance.getAttachmentId()).to.equal(MockBomAttachmentData.attachment.attachmentId);
            });
        });

        describe('[METHOD] getTenant', () => {
            it('Should return the tenant of the attachment', () => {
                expect(BomAttachmentInstance.getTenant()).to.equal(MockBomAttachmentData.attachment.tenant);
            });
        });

        describe('[METHOD] getItemId', () => {
            it('Should return the correct item id of the attachment', () => {
                expect(BomAttachmentInstance.getItemId()).to.equal(MockBomAttachmentData.attachment.itemId);
            });
        });
    });
})();
