import BomAttachment from 'com/autodesk/models/bomAttachment/bomAttachment.model.js';

/**
 * @ngdoc object
 * @name Models.BomAttachmentList
 * @description This class represents a list of attachments associated with an item.
 */
class BomAttachmentList {

    /**
     * @ngdoc method
     * @name Models.BomAttachmentList#constructor
     * @methodOf Models.BomAttachmentList
     * @description Initializes a BomAttachmentList object
     *
     * @param {Array} `attachmentArray` list objects representing a bom attachment.
     * @param {String} `itemId` representing item id associated with this BomAttachmentList.
     */
    constructor(attachmentArray = [], itemId) {
        /**
         * @ngdoc property
         * @name Models.BomAttachmentList#attachments
         * @propertyOf Models.BomAttachmentList
         * @description An array of BomAttachment instances.
         */
        this.attachments = attachmentArray.map((attachment => new BomAttachment(attachment)));

        /**
         * @ngdoc property
         * @name Models.BomAttachmentList#itemId
         * @propertyOf Models.BomAttachmentList
         * @description the id of the item to which this attachment list is associated with.
         */
        this.itemId = itemId;
    }

    /**
     * @ngdoc method
     * @name Models.BomAttachmentList#getAttachments
     * @methodOf Models.BomAttachmentList
     * @description getter for all the attachments in this BomAttachmentList.
     *
     * @returns {Array} list of BomAttachment instances.
     */
    getAttachments() {
        return this.attachments;
    }

    /**
     * @ngdoc method
     * @name Models.BomAttachmentList#getSize
     * @methodOf Models.BomAttachmentList
     * @description getter for the size of this BomAttachmentList.
     *
     * @returns {Number} The size of the list.
     */
    getSize() {
        return this.attachments.length;
    }

    /**
     * @ngdoc method
     * @name Models.BomAttachmentList#getItemId
     * @methodOf Models.BomAttachmentList
     * @description getter for the item id of this BomAttachmentList.
     *
     * @returns {String} The item id of this BomAttachmentList.
     */
    getItemId() {
        return this.itemId;
    }
}

export default BomAttachmentList;
