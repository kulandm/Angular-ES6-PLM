'use strict';

/**
* @ngdoc object
* @name TableauPayloadBuilder
*
* @description
*
* ##Dependencies
* Underscore library
*
*/
class TableauPayloadBuilder {

	/*
	* @ngdoc method
	* @name TableauPayloadBuilder#constructor
	* @methodOf TableauPayloadBuilder
	* @description The class constructor
	*/
	constructor(currentTableau, tableau, _) {
		// find a way to intersect and apply changes here
		currentTableau.columns = [];
		let sort = false;

		_.each(tableau.array, (columnNew) => {

			let cloneObject = {};

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

		// currently, if we remove first column, configuration gets with no sorting
		// then breaks the code flow when refresh.
		// We're setting the first column
		if (!sort) {
			currentTableau.columns[0].sort = {
				order: 0,
				direction: 'DESCENDING'
			};
		}

		return currentTableau;
	}

}

export default TableauPayloadBuilder;
