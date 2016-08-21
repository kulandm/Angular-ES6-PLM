System.registerModule("com/autodesk/models/editTracker/abstractChange.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/editTracker/abstractChange.model.js";
  var changeId = 0;
  var AbstractChange = function() {
    function AbstractChange(args) {
      this.changeType = 'AbstractChange';
      this.serverError = typeof args.serverError === 'undefined' ? null : args.serverError;
      this.changeId = changeId;
      ++changeId;
    }
    return ($traceurRuntime.createClass)(AbstractChange, {isInvalid: function() {
        return (typeof this.serverError !== 'undefined' && this.serverError !== null);
      }}, {});
  }();
  var $__default = AbstractChange;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/editTracker/abstractChange.model.js
;

System.registerModule("com/autodesk/models/editTracker/abstractChangeList.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/editTracker/abstractChangeList.model.js";
  var AbstractChangeList = function() {
    function AbstractChangeList() {
      this.changes = new Map();
    }
    return ($traceurRuntime.createClass)(AbstractChangeList, {
      acceptanceFunction: function(newChange) {
        return true;
      },
      acceptChange: function(newChange) {
        this.changes.get(newChange.changeType).push(newChange);
      },
      compilationFunction: function() {
        var compiledMap = new Map();
        this.changes.forEach(function(list, changeType) {
          compiledMap.set(changeType, list);
        });
        return compiledMap;
      },
      tryAddChange: function(change) {
        if (this.acceptanceFunction(change)) {
          if (!this.changes.has(change.changeType)) {
            this.changes.set(change.changeType, []);
          }
          this.acceptChange(change);
          return true;
        } else {
          return false;
        }
      },
      getCompiled: function() {
        return this.compilationFunction();
      },
      deleteChanges: function(key) {
        this.changes.delete(key);
      }
    }, {});
  }();
  var $__default = AbstractChangeList;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/editTracker/abstractChangeList.model.js
;

System.registerModule("com/autodesk/models/editTracker/changeListHolder.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/editTracker/changeListHolder.model.js";
  var ChangeListHolder = function() {
    function ChangeListHolder(ChangeListClass) {
      this.ChangeListClass = ChangeListClass;
      this.changeLists = new Map();
    }
    return ($traceurRuntime.createClass)(ChangeListHolder, {
      clear: function() {
        this.changeLists.clear();
      },
      tryAddChange: function(key, change) {
        if (!this.changeLists.has(key)) {
          this.changeLists.set(key, new this.ChangeListClass(key));
        }
        return this.changeLists.get(key).tryAddChange(change);
      },
      getMinimalLists: function() {
        var minimalChangeLists = new Map();
        this.changeLists.forEach(function(changeList, key) {
          var compiled = changeList.getCompiled();
          if (compiled !== null) {
            minimalChangeLists.set(key, compiled);
          }
        });
        return minimalChangeLists;
      },
      getChangeList: function(key) {
        return this.changeLists.get(key);
      },
      hasChangeList: function(key) {
        return this.changeLists.has(key);
      },
      hasPendingChanges: function() {
        var minimalList = this.getMinimalLists();
        var numberOfChanges = minimalList.size;
        return numberOfChanges !== 0;
      },
      deleteChangeList: function(key) {
        this.changeLists.delete(key);
      }
    }, {});
  }();
  var $__default = ChangeListHolder;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/editTracker/changeListHolder.model.js
