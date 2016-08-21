import BomChangeEdit from 'com/autodesk/models/bomEdit/bomChangeEdit.model.js';

/**
 * @ngdoc object
 * @name Models.BomChangePinningEdit
 * @description A change that edit the pinning of an item
 *  Either
 *      this.revisionField and this.currentRevision
 *  or
 *      this.targetItem
 *  must be defined for the change to be used
 */
class BomChangePinningEdit extends BomChangeEdit {

    /**
	 * @ngdoc method
	 * @name Models.BomChangePinningEdit#constructor
	 * @methodOf Models.BomChangePinningEdit
	 * @description Initializes the edit
	 */
     constructor(args) {

        super(args);

        /**
    	 * @ngdoc property
    	 * @name Models.BomChangePinningEdit#revisionField
    	 * @propertyOf Models.BomChangePinningEdit
    	 * @description The field corresponding to the revision
    	 */
        this.revisionField = args.revisionField;

        /**
    	 * @ngdoc property
    	 * @name Models.BomChangePinningEdit#currentRevision
    	 * @propertyOf Models.BomChangePinningEdit
    	 * @description The currently selected revision
         *  Has the property 'title', which uniquely identifies the revision
         *    and 'version', which contains all the revision's information
    	 */
        this.currentRevision = args.currentRevision;

        /**
    	 * @ngdoc property
    	 * @name Models.BomChangePinningEdit#targetItem
    	 * @propertyOf Models.BomChangePinningEdit
    	 * @description The item which should be pinned
         *  This is ignored if revisionField and currentRevision have been provided
         *      since those allow us to determine the isRevertingChange state of the selected revision,
         *  instead of just relying on checking if the pinning changed or not
    	 */
        this.targetItem = args.targetItem;
    }

    /**
     * @ngdoc method
     * @name Models.BomChangePinningEdit#isRevertingChange
     * @methodOf Models.BomChangePinningEdit
     * @description Determines if the change is a reverting change
     *  If the pinning has changed, it is not reverting
     *  if the revision field is provided,
     *      and the current revision has changed from the original revision
     *      it is not reverting
     *  otherwise, it is reverting
     */
    isRevertingChange() {
        if (!super.isRevertingChange()) {
            return false;
        }

        if (this.revisionField) {
            return !this.revisionField.isConsequentialChange(this.currentRevision, this.revisionField.originalValue);
        }

        return true;
    }
}

export default BomChangePinningEdit;
