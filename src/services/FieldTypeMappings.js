'use strict';

/*
* Field type mappings from field_type to data_type
* There is currently a mismatch between the fieldTypes as returned by the api,
*	and the field types that fieldSelector expects. As such, we need to map the api numbers
*	to the actual fieldSelector types.
* This is our best guess for field type mapping.
*/

let fieldTypeMap = new Map();

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

angular.module(__moduleName, [
])
.constant('FieldTypeMappings', fieldTypeMap);

export default fieldTypeMap;
