import BomBulkAttachmentFactory from 'com/autodesk/models/bomAttachment/bomBulkAttachment.model.js';
import BomBulkAttachmentListeners from 'com/autodesk/models/bomAttachment/bomBulkAttachmentListeners.service.js';
import BomBulkAttachmentLoader from 'com/autodesk/models/bomAttachment/bomBulkAttachmentLoader.service.js';

angular.module(__moduleName, [])
    .factory('BomBulkAttachment', BomBulkAttachmentFactory)
    .service('BomBulkAttachmentListeners', BomBulkAttachmentListeners)
    .service('BomBulkAttachmentLoader', BomBulkAttachmentLoader);
