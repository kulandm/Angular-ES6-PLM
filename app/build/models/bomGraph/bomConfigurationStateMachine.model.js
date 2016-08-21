System.registerModule("com/autodesk/models/bomGraph/bomConfigurationStateMachine.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomGraph/bomConfigurationStateMachine.model.js";
  var BomConfigurationStateMachine = function() {
    function BomConfigurationStateMachine(dateFormat) {
      this.States = {
        RevisionSet: 'RevisionSet',
        ViewDefChange: 'ViewDefChange',
        WorkingForwardDateChange: 'WorkingForwardDateChange',
        DateChange: 'DateChange',
        BiasChange: 'BiasChange',
        Refresh: 'Refresh'
      };
      this.state = null;
      this.dateFormat = dateFormat;
      this.viewDefId = null;
      this.effectiveDate = null;
      this.itemId = null;
      this.revisionBias = 'release';
      this.isWorkingRevision = false;
    }
    return ($traceurRuntime.createClass)(BomConfigurationStateMachine, {
      setState: function(state) {
        this.state = state;
      },
      setInitialState: function(itemId, viewDefId, isWorkingRevision) {
        this.setViewDefId(viewDefId);
        this.setItemId(itemId);
        this.setRevisionBias('release');
        this.setIsWorkingRevision(isWorkingRevision);
        this.setState(this.States.RevisionSet);
      },
      setViewDefId: function(viewDefId) {
        this.viewDefId = viewDefId;
      },
      setEffectiveDate: function(date) {
        this.effectiveDate = moment(date, this.dateFormat);
      },
      getEffectiveDate: function() {
        if (this.effectiveDate) {
          return this.effectiveDate.format(this.dateFormat);
        }
      },
      setItemId: function(itemId) {
        this.itemId = itemId;
      },
      getRevisionBias: function() {
        return this.revisionBias;
      },
      setRevisionBias: function(bias) {
        this.revisionBias = bias;
      },
      setIsWorkingRevision: function(isWorkingRevision) {
        this.isWorkingRevision = isWorkingRevision;
      },
      viewChanged: function(viewDefId) {
        this.setViewDefId(viewDefId);
        this.setState(this.States.ViewDefChange);
      },
      configurationChanged: function(date, bias) {
        if (!this.effectiveDate.isSame(moment(date, this.dateFormat))) {
          this.dateChanged(date);
        } else {
          this.biasChanged(bias);
        }
      },
      dateChanged: function(newDate) {
        if (this.isWorkingRevision && this.effectiveDate.isBefore(moment(newDate, this.dateFormat))) {
          this.setState(this.States.WorkingForwardDateChange);
        } else {
          this.setState(this.States.DateChange);
        }
        this.setEffectiveDate(newDate);
      },
      biasChanged: function(bias) {
        this.setState(this.States.BiasChange);
        this.setRevisionBias(bias);
      },
      shouldRefresh: function() {
        this.setState(this.States.Refresh);
      },
      getFullConfiguration: function() {
        return {
          viewDefId: this.viewDefId,
          effectiveDate: this.getEffectiveDate(),
          revisionBias: this.revisionBias
        };
      },
      getTopLineQueryParams: function() {
        var params = {};
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
        } else if (this.state === this.States.BiasChange || this.state === this.States.ViewDefChange || this.state === this.States.Refresh) {
          if (this.isWorkingRevision) {
            params.rootId = this.itemId;
          }
          params.effectiveDate = this.getEffectiveDate();
          params.revisionBias = this.revisionBias;
        }
        return params;
      }
    }, {});
  }();
  var $__default = BomConfigurationStateMachine;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomGraph/bomConfigurationStateMachine.model.js
