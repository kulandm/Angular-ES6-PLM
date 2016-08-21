import BomChangeListTypes from 'com/autodesk/models/bomEdit/bomChangeListTypes.js';
import BomChangePayloadBuilder from 'com/autodesk/models/bomEdit/bomChangePayloadBuilder.service.js';
import BomChangeError from 'com/autodesk/models/bomEdit/bomChangeError.model.js';

/**
 * @ngdoc object
 * @name Models.BomChangeCompiled
 * @description A change compiling several bomChanges into a single action
 */
class BomChangeCompiled {
    /**
     * @ngdoc method
     * @name Models.BomChangeCompiled#constructor
     * @methodOf Models.BomChangeCompiled
     * @description A change compiling several bomChanges into a single action
     */
    constructor(changeType, edgeId, drivingChanges) {
        /**
         * @ngdoc property
         * @name Models.BomChangeCompiled#changeType
         * @propertyOf Models.BomChangeCompiled
         * @description The type of BomChangeListTypes of the change
         */
        this.changeType = changeType;

        /**
         * @ngdoc property
         * @name Models.BomChangeCompiled#edgeId
         * @propertyOf Models.BomChangeCompiled
         * @description The edge the change targets
         */
        this.edgeId = edgeId;

        /**
         * @ngdoc property
         * @name Models.BomChangeCompiled#drivingChanges
         * @propertyOf Models.BomChangeCompiled
         * @description An array of cahnges that drive the change
         */
        this.drivingChanges = drivingChanges;

        /**
         * @ngdoc property
         * @name Models.BomChangeCompiled#payload
         * @propertyOf Models.BomChangeCompiled
         * @description The payload that should be sent to the server
         */
        this.payload = this.generatePayload(this.changeType, this.drivingChanges);

        /**
         * @ngdoc property
         * @name Models.BomChangeCompiled#errors
         * @propertyOf Models.BomChangeCompiled
         * @description Any errors associated with the change
         */
        this.errors = [];
    }

    /**
     * @ngdoc method
     * @name Models.BomChangeCompiled#generatePayload
     * @methodOf Models.BomChangeCompiled
     * @description Builds the payload for the change
     *
     * @returns {Object} The payload corresponding to the change
     */
    generatePayload(changeType, drivingChanges) {
        if (changeType === BomChangeListTypes.EDIT) {
            return BomChangePayloadBuilder.convertChangesToEditPayload(drivingChanges);
        } else if (changeType === BomChangeListTypes.ADD) {
            return BomChangePayloadBuilder.convertChangesToAddPayload(drivingChanges);
        } else {
            return {};
        }
    }

    /**
     * @ngdoc method
     * @name Models.BomChangeCompiled#addErrors
     * @methodOf Models.BomChangeCompiled
     * @description Consumes a error response to the change and stores it
     * @param {Object} errorResponse a json payload corresponding to an error response
     */
    addErrors(errorResponse) {
        let errors = BomChangeError.convertToBomChangeErrors(errorResponse);
        this.errors = this.errors.concat(errors);
    }

    /**
     * @ngdoc method
     * @name Models.BomChangeCompiled#getErrors
     * @methodOf Models.BomChangeCompiled
     * @description Returns the errors associated with the changed
     *
     * @returns {Array} An array of BomChangeError instances
     */
    getErrors() {
        return this.errors;
    }

    /**
     * @ngdoc method
     * @name Models.BomChangeCompiled#isInvalid
     * @methodOf Models.BomChangeCompiled
     * @description Determines if the change is invalid for any reason
     *
     * @returns {Boolean} True if there are errors
     */
    isInvalid() {
        return this.errors.length > 0;
    }
}

export default BomChangeCompiled;
