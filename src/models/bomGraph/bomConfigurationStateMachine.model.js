/**
 * @ngdoc object
 * @name Models.BomConfigurationStateMachine
 * @description A state machine that tracks the configuration of the Bom
 *     Different states should produce dirrent query parameters for the BomRoot endpoint
 *
 * @dependencies Global 'moment' variable
 */
class BomConfigurationStateMachine {

    /**
	 * @ngdoc method
	 * @name Models.BomConfigurationStateMachine#constructor
	 * @methodOf Models.BomConfigurationStateMachine
	 * @description initializes the State Machine properties
	 * @param {String} dateFormat the format for any dates passed to the state machine
	 */
    constructor(dateFormat) {

        /**
         * @ngdoc property
         * @name Models.BomConfigurationStateMachine#States
         * @propertyOf Models.BomConfigurationStateMachine
         * @description The possible states for the state machine
         */
        this.States = {
            RevisionSet: 'RevisionSet',
            ViewDefChange: 'ViewDefChange',
            WorkingForwardDateChange: 'WorkingForwardDateChange',
            DateChange: 'DateChange',
            BiasChange: 'BiasChange',
            Refresh: 'Refresh'
        };

        /**
         * @ngdoc property
         * @name Models.BomConfigurationStateMachine#state
         * @propertyOf Models.BomConfigurationStateMachine
         * @description The current state of the state machine
         *  Should always be either null or one of this.States
         */
        this.state = null;

        /**
         * @ngdoc property
         * @name Models.BomConfigurationStateMachine#dateFormat
         * @propertyOf Models.BomConfigurationStateMachine
         * @description The format of any dates passed to the state machine
         */
        this.dateFormat = dateFormat;

        /**
         * @ngdoc property
         * @name Models.BomConfigurationStateMachine#viewDefId
         * @propertyOf Models.BomConfigurationStateMachine
         * @description The id of the requested view definition
         */
        this.viewDefId = null;

        /**
         * @ngdoc property
         * @name Models.BomConfigurationStateMachine#effectiveDate
         * @propertyOf Models.BomConfigurationStateMachine
         * @description The date associated with the current Bom
         *  Should always be a moment object (setter should always be used)
         */
        this.effectiveDate = null;

        /**
         * @ngdoc property
         * @name Models.BomConfigurationStateMachine#itemId
         * @propertyOf Models.BomConfigurationStateMachine
         * @description The id of the top line of the bom
         */
        this.itemId = null;

        /**
         * @ngdoc property
         * @name Models.BomConfigurationStateMachine#revisionBias
         * @propertyOf Models.BomConfigurationStateMachine
         * @description The currently selected revisionBias
         *  The bias is always 'release', unless specified otherwise
         */
        this.revisionBias = 'release';

        /**
         * @ngdoc property
         * @name Models.BomConfigurationStateMachine#isWorkingRevision
         * @propertyOf Models.BomConfigurationStateMachine
         * @description Boolean marking whether the current revision is the working revision
         *  which has special handling when configuring the Bom
         */
        this.isWorkingRevision = false;
    }

    /**
     * @ngdoc method
     * @name Models.BomConfigurationStateMachine#setState
     * @methodOf Models.BomConfigurationStateMachine
     * @description Setter for the current state
     */
    setState(state) {
        this.state = state;
    }

    /**
     * @ngdoc method
     * @name Models.BomConfigurationStateMachine#setInitialState
     * @methodOf Models.BomConfigurationStateMachine
     * @description Sets the initial state of the state machine
     *     Corresponds to the initial loading of the Bom
     */
    setInitialState(itemId, viewDefId, isWorkingRevision) {
        this.setViewDefId(viewDefId);
        this.setItemId(itemId);
        this.setRevisionBias('release');
        this.setIsWorkingRevision(isWorkingRevision);

        this.setState(this.States.RevisionSet);
    }

    /**
     * @ngdoc method
     * @name Models.BomConfigurationStateMachine#setViewDefId
     * @methodOf Models.BomConfigurationStateMachine
     * @description Setter for viewDefId
     */
    setViewDefId(viewDefId) {
        this.viewDefId = viewDefId;
    }

    /**
     * @ngdoc method
     * @name Models.BomConfigurationStateMachine#setEffectiveDate
     * @methodOf Models.BomConfigurationStateMachine
     * @description Setter for effectiveDate
     *      Converts the passed in string to a moment object
     */
    setEffectiveDate(date) {
        this.effectiveDate = moment(date, this.dateFormat);
    }

    /**
     * @ngdoc method
     * @name Models.BomConfigurationStateMachine#getEffectiveDate
     * @methodOf Models.BomConfigurationStateMachine
     * @description Gets the effectiveDate as a string in the format dateFormat
     */
    getEffectiveDate() {
        if (this.effectiveDate) {
            return this.effectiveDate.format(this.dateFormat);
        }
    }

    /**
     * @ngdoc method
     * @name Models.BomConfigurationStateMachine#setItemId
     * @methodOf Models.BomConfigurationStateMachine
     * @description setter for itemId
     */
    setItemId(itemId) {
        this.itemId = itemId;
    }

    /**
     * @ngdoc method
     * @name Models.BomConfigurationStateMachine#getRevisionBias
     * @methodOf Models.BomConfigurationStateMachine
     * @description Returns the revision bias
     */
    getRevisionBias() {
        return this.revisionBias;
    }

    /**
     * @ngdoc method
     * @name Models.BomConfigurationStateMachine#setRevisionBias
     * @methodOf Models.BomConfigurationStateMachine
     * @description setter for revisionBias
     */
    setRevisionBias(bias) {
        this.revisionBias = bias;
    }

    /**
     * @ngdoc method
     * @name Models.BomConfigurationStateMachine#setIsWorkingRevision
     * @methodOf Models.BomConfigurationStateMachine
     * @description setter for isWorkingRevision
     */
    setIsWorkingRevision(isWorkingRevision) {
        this.isWorkingRevision = isWorkingRevision;
    }

    /**
     * @ngdoc method
     * @name Models.BomConfigurationStateMachine#viewChanged
     * @methodOf Models.BomConfigurationStateMachine
     * @description Corresponds to the user changing the current view
     */
    viewChanged(viewDefId) {
        this.setViewDefId(viewDefId);
        this.setState(this.States.ViewDefChange);
    }

    /**
     * @ngdoc method
     * @name Models.BomConfigurationStateMachine#configurationChanged
     * @methodOf Models.BomConfigurationStateMachine
     * @description Corresponds to the user changing bom configuration
     *  If the date was changed, ignore the new bias and use only the new date
     */
    configurationChanged(date, bias) {
        if (!this.effectiveDate.isSame(moment(date, this.dateFormat))) {
            this.dateChanged(date);
        } else {
            this.biasChanged(bias);
        }
    }

    /**
     * @ngdoc method
     * @name Models.BomConfigurationStateMachine#dateChanged
     * @methodOf Models.BomConfigurationStateMachine
     * @description Corresponds to the user changing configured date
     *  If the current revision is the working revision and the date has been moved forward in time,
     *      We need to stay on the working revision and just change the date
     *  However, if the current revision is the working revision and the date has been moved backwards in time,
     *      We will leave the working revision and configure according to the new date
     *  If we are not in the working revision
     *      We will always configure according to the provided date
     */
    dateChanged(newDate) {
        if (this.isWorkingRevision && this.effectiveDate.isBefore(moment(newDate, this.dateFormat))) {
            this.setState(this.States.WorkingForwardDateChange);
        } else {
            this.setState(this.States.DateChange);
        }

        this.setEffectiveDate(newDate);
    }

    /**
     * @ngdoc method
     * @name Models.BomConfigurationStateMachine#biasChanged
     * @methodOf Models.BomConfigurationStateMachine
     * @description Corresponds to the user changing current bias
     */
    biasChanged(bias) {
        this.setState(this.States.BiasChange);
        this.setRevisionBias(bias);
    }

    /**
     * @ngdoc method
     * @name Models.BomConfigurationStateMachine#shouldRefresh
     * @methodOf Models.BomConfigurationStateMachine
     * @description Corresponds to the Bom needing a refresh
     */
    shouldRefresh() {
        this.setState(this.States.Refresh);
    }

    /**
     * @ngdoc method
     * @name Models.BomConfigurationStateMachine#getFullConfiguration
     * @methodOf Models.BomConfigurationStateMachine
     * @description Returns the full configuration of the Bom
     *  This should not be used when retrieving the top line
     */
    getFullConfiguration() {
        return {
            viewDefId: this.viewDefId,
            effectiveDate: this.getEffectiveDate(),
            revisionBias: this.revisionBias
        };
    }

    /**
     * @ngdoc method
     * @name Models.BomConfigurationStateMachine#getTopLineQueryParams
     * @methodOf Models.BomConfigurationStateMachine
     * @description Returns the query parameters needed to retrive
     *      the top line of the Bom according to the current state of
     *          the State Machine
     *      Every set of parameters includes the current view definition
     *  Options:
     *      RevisionSet:
     *          We request the currently selected revision in the release configuration
     *      WorkingForwardDateChange
     *          We request the currently selected revision (The working revision)
     *              at the current date in the release configuration
     *      DateChange
     *          We request the revision corresponding to the date in the release configuration
     *      ViewDefChange, BiasChange, Refresh:
     *          We request the currently selected revision in the current configuration
     */
    getTopLineQueryParams() {
        let params = {};

        // We always provide a view definition
        params.viewDefId = this.viewDefId;

        if (this.state === this.States.RevisionSet) {
            params.rootId = this.itemId;
            params.revisionBias = 'release';
        } else if (this.state === this.States.WorkingForwardDateChange) {
            params.rootId = this.itemId;
            params.effectiveDate = this.getEffectiveDate();
            params.revisionBias = 'release';
        } else if (this.state === this.States.DateChange) {
            params.effectiveDate = this.getEffectiveDate();
            params.revisionBias = 'release';
        } else if (this.state === this.States.BiasChange ||
                this.state === this.States.ViewDefChange ||
                this.state === this.States.Refresh) {
            // If we are in the working revision, we need to pass the rootId
            //     so we stay in that revision
            //  Otherwise, the date will always correspond with the wanted revision
            if (this.isWorkingRevision) {
                params.rootId = this.itemId;
            }

            params.effectiveDate = this.getEffectiveDate();
            params.revisionBias = this.revisionBias;
        }

        return params;
    }
}

export default BomConfigurationStateMachine;
