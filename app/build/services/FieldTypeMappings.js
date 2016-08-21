System.registerModule("com/autodesk/services/FieldTypeMappings.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/services/FieldTypeMappings.js";
  var fieldTypeMap = new Map();
  fieldTypeMap.set(22, 32);
  fieldTypeMap.set(21, 31);
  fieldTypeMap.set(20, 30);
  fieldTypeMap.set(19, 29);
  fieldTypeMap.set(18, 28);
  fieldTypeMap.set(15, 19);
  fieldTypeMap.set(14, 22);
  fieldTypeMap.set(13, 13);
  fieldTypeMap.set(11, 8);
  fieldTypeMap.set(10, 23);
  fieldTypeMap.set(9, 11);
  fieldTypeMap.set(8, 5);
  fieldTypeMap.set(7, 15);
  fieldTypeMap.set(6, 20);
  fieldTypeMap.set(5, 9);
  fieldTypeMap.set(4, 4);
  fieldTypeMap.set(3, 3);
  fieldTypeMap.set(2, 2);
  fieldTypeMap.set(1, 1);
  angular.module(__moduleName, []).constant('FieldTypeMappings', fieldTypeMap);
  var $__default = fieldTypeMap;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/services/FieldTypeMappings.js
