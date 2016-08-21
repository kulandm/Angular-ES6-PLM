(() => {
    'use strict';

    describe('[MODEL] BomAttachmentList', () => {
        let BomAttachmentList, MockBomAttachmentData;
        let BomAttachmentListInstance, attachmentListData;

        beforeEach(() => {
            module('plm360.mockData');
        });

        beforeEach(() => {
            inject((_MockBomAttachmentData_) => {
                MockBomAttachmentData = _MockBomAttachmentData_;
            });
            attachmentListData = MockBomAttachmentData.attachmentList[0];
            BomAttachmentList = System.get('com/autodesk/models/bomAttachment/bomAttachmentList.model.js').default;
            BomAttachmentListInstance = new BomAttachmentList(attachmentListData, attachmentListData[0].itemId);
        });

        describe('[STATE]', () => {
            it('Should init with correct properties', () => {
                expect(BomAttachmentListInstance.itemId).to.equal(attachmentListData[0].itemId);
                expect(BomAttachmentListInstance.attachments.length).to.equal(attachmentListData.length);
            });
        });

        describe('[METHOD] getAttachments', () => {
            it('Should return attachments in the BomAttachmentList', () => {
                let attachments = BomAttachmentListInstance.getAttachments();
                expect(attachments.length).to.equal(attachmentListData.length);
                expect(attachments[0].getItemId()).to.equal(attachmentListData[0].itemId);
            });
        });

        describe('[METHOD] getSize', () => {
            it('Should return the size of the BomAttachmentList', () => {
                expect(BomAttachmentListInstance.getSize()).to.equal(attachmentListData.length);
            });
        });

        describe('[METHOD] getSize', () => {
            it('Should return the item id of the BomAttachmentList', () => {
                expect(BomAttachmentListInstance.getItemId()).to.equal(attachmentListData[0].itemId);
            });
        });
    });
})();
