/**
 * @ngdoc object
 * @name Models.BomAttachment
 * @description This class is representation of an attachment in the Bom.
 */
class BomAttachment {

    /**
     * @ngdoc method
     * @name Models.BomAttachment#constructor
     * @methodOf Models.BomAttachment
     * @description Initializes a BomAttachment object with properties from `attachmentData`
     *
     * @param {Object} `attachmentData` an attachment its found in the payload.
     */
    constructor(attachmentData) {
        if (attachmentData) {
            /**
             * @ngdoc property
             * @name Models.BomAttachment#__self__
             * @propertyOf Models.BomAttachment
             * @description the self link of this attachment.
             */
            this.__self__ = (typeof attachmentData.__self__ === 'undefined') ? null : attachmentData.__self__;

            /**
             * @ngdoc property
             * @name Models.BomAttachment#createdBy
             * @propertyOf Models.BomAttachment
             * @description The user who created this attachment.
             */
            this.createdBy = (typeof attachmentData.createdBy === 'undefined') ? null : attachmentData.createdBy;

            /**
             * @ngdoc property
             * @name Models.BomAttachment#creationDate
             * @propertyOf Models.BomAttachment
             * @description Date when the attachment was created.
             */
            this.creationDate = (typeof attachmentData.creationDate === 'undefined') ? null : attachmentData.creationDate;

            /**
             * @ngdoc property
             * @name Models.BomAttachment#lastModifiedBy
             * @propertyOf Models.BomAttachment
             * @description The user who modefied the attachment last.
             */
            this.lastModifiedBy = (typeof attachmentData.lastModifiedBy === 'undefined') ? null : attachmentData.lastModifiedBy;

            /**
             * @ngdoc property
             * @name Models.BomAttachment#lastModifiedDate
             * @propertyOf Models.BomAttachment
             * @description Date when the attachment was last modified.
             */
            this.lastModifiedDate = (typeof attachmentData.lastModifiedDate === 'undefined') ? null : attachmentData.lastModifiedDate;

            /**
             * @ngdoc property
             * @name Models.BomAttachment#pinningPolicy
             * @propertyOf Models.BomAttachment
             * @description The pinning policy that is currently associated with this attachment.
             */
            this.pinningPolicy = (typeof attachmentData.pinningPolicy === 'undefined') ? null : attachmentData.pinningPolicy;

            /**
             * @ngdoc property
             * @name Models.BomAttachment#attachmentId
             * @propertyOf Models.BomAttachment
             * @description id of the attachment.
             */
            this.attachmentId = (typeof attachmentData.attachmentId === 'undefined') ? null : attachmentData.attachmentId;

            /**
             * @ngdoc property
             * @name Models.BomAttachment#tenant
             * @propertyOf Models.BomAttachment
             * @description The tenant to whom the attachment belongs to.
             */
            this.tenant = (typeof attachmentData.tenant === 'undefined') ? null : attachmentData.tenant;

            /**
             * @ngdoc property
             * @name Models.BomAttachment#itemId
             * @propertyOf Models.BomAttachment
             * @description The id (urn of the item) of the item to which the attachment is part of.
             */
            this.itemId = (typeof attachmentData.itemId === 'undefined') ? null : attachmentData.itemId;
        }

        /**
         * @ngdoc property
         * @name Models.BomAttachment#attachmentData
         * @propertyOf Models.BomAttachment
         * @description attachment object as it looks in the payload.
         */
        this.attachmentData = attachmentData;
    }

    /**
     * @ngdoc method
     * @name Models.BomAttachment#getSelfLink
     * @methodOf Models.BomAttachment
     * @description getter for the self link of the attachment.
     *
     * @returns {String} the self link of this attachment.
     */
    getSelfLink() {
        return this.__self__;
    }

    /**
     * @ngdoc method
     * @name Models.BomAttachment#getCreatedBy
     * @methodOf Models.BomAttachment
     * @description getter for who created the attachment.
     *
     * @returns {String} the user who created this attachment.
     */
    getCreatedBy() {
        return this.createdBy;
    }

    /**
     * @ngdoc method
     * @name Models.BomAttachment#getCreationDate
     * @methodOf Models.BomAttachment
     * @description getter for when this attachment was created.
     *
     * @returns {String} a string representation of the date when this
     * attachment was created.
     */
    getCreationDate() {
        return this.creationDate;
    }

    /**
     * @ngdoc method
     * @name Models.BomAttachment#getLastModifier
     * @methodOf Models.BomAttachment
     * @description getter for the user by whom this attachment was last modified.
     *
     * @returns {String} the user who modified this attachment last.
     */
    getLastModifier() {
        return this.lastModifiedBy;
    }

    /**
     * @ngdoc method
     * @name Models.BomAttachment#getEdges
     * @methodOf Models.BomAttachment
     * @description getter for the last modification date of this attachment.
     *
     * @returns {String} a string representation of the date when this
     * attachment was last modified.
     */
    getLastModificationDate() {
        return this.lastModifiedDate;
    }

    /**
     * @ngdoc method
     * @name Models.BomAttachment#getPinningPolicy
     * @methodOf Models.BomAttachment
     * @description getter for the pinning policy associted with this attachment.
     *
     * @returns {String} The name of the pinning policy.
     */
    getPinningPolicy() {
        return this.pinningPolicy;
    }

    /**
     * @ngdoc method
     * @name Models.BomAttachment#getAttachmentId
     * @methodOf Models.BomAttachment
     * @description getter for the id of this attachment.
     *
     * @returns {String} representing the id of this attachment.
     */
    getAttachmentId() {
        return this.attachmentId;
    }

    /**
     * @ngdoc method
     * @name Models.BomAttachment#getRootNodeId
     * @methodOf Models.BomAttachment
     * @description getter for the tenant to whom this attachment belongs to.
     *
     * @returns {String} the tenant urn.
     */
    getTenant() {
        return this.tenant;
    }

    /**
     * @ngdoc method
     * @name Models.BomAttachment#getRootNodeId
     * @methodOf Models.BomAttachment
     * @description getter for id of the item to which this attachment is part of.
     *
     * @returns {String} representing item id of the attachment.
     */
    getItemId() {
        return this.itemId;
    }
}

export default BomAttachment;
