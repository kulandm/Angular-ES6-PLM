System.registerModule("com/autodesk/components/workspaceTableauFlyout/TableauPayloadBuilder.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceTableauFlyout/TableauPayloadBuilder.js";
  var TableauPayloadBuilder = function() {
    function TableauPayloadBuilder(currentTableau, tableau, _) {
      currentTableau.columns = [];
      var sort = false;
      _.each(tableau.array, function(columnNew) {
        var cloneObject = {};
        if (angular.isDefined(columnNew.applicableFilters)) {
          cloneObject.applicableFilters = columnNew.applicableFilters;
        }
        if (angular.isDefined(columnNew.displayOrder)) {
          cloneObject.displayOrder = columnNew.displayOrder;
        }
        if (angular.isDefined(columnNew.field)) {
          cloneObject.field = columnNew.field;
        }
        if (angular.isDefined(columnNew.group)) {
          cloneObject.group = columnNew.group;
        }
        if (angular.isDefined(columnNew.sort)) {
          cloneObject.sort = columnNew.sort;
          sort = true;
        }
        if (angular.isDefined(columnNew.filter)) {
          cloneObject.filter = columnNew.filter;
        }
        currentTableau.columns.push(angular.copy(cloneObject));
      });
      if (!sort) {
        currentTableau.columns[0].sort = {
          order: 0,
          direction: 'DESCENDING'
        };
      }
      return currentTableau;
    }
    return ($traceurRuntime.createClass)(TableauPayloadBuilder, {}, {});
  }();
  var $__default = TableauPayloadBuilder;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceTableauFlyout/TableauPayloadBuilder.js
