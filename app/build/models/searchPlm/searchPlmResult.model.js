System.registerModule("com/autodesk/models/searchPlm/searchPlmResult.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/searchPlm/searchPlmResult.model.js";
  var SearchPlmResult = function() {
    function SearchPlmResult(json) {
      if (json) {
        this.__self__ = json.__self__;
        this.urn = json.urn;
        this.descriptor = json.descriptor || null;
        this.category = json.category || null;
        this.categoryThumbnail = json.categoryThumbnail || null;
        this.categoryThumbnailSmall = json.categoryThumbnailSmall || null;
        this.creator = json.creator || null;
        this.owner = json.owner || null;
        this.workspaceLongName = json.workspaceLongName || null;
        this.workspaceShortName = json.workspaceShortName || null;
      }
    }
    return ($traceurRuntime.createClass)(SearchPlmResult, {
      getSelfLink: function() {
        return this.__self__.replace(/^\//, '');
      },
      getDescriptor: function() {
        return this.descriptor;
      },
      getCategory: function() {
        return this.category;
      },
      getCategoryThumbnail: function() {
        return this.categoryThumbnail;
      },
      getCategoryThumbnailSmall: function() {
        return this.categoryThumbnailSmall;
      },
      getUrn: function() {
        return this.urn;
      },
      getCreator: function() {
        return this.creator;
      },
      getOwner: function() {
        return this.owner;
      },
      getWorkspaceName: function() {
        return this.workspaceLongName;
      },
      getWorkspaceShortName: function() {
        return this.workspaceShortName;
      },
      getUrnLink: function() {
        return this.getUrn().replace(/\:/g, '`').replace(/\./g, ',');
      },
      getWorkspaceId: function() {
        var components = this.getUrn().split('.');
        return components[components.length - 2];
      }
    }, {});
  }();
  var $__default = SearchPlmResult;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/searchPlm/searchPlmResult.model.js
