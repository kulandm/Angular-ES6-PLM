'use strict';

/**
 * @ngdoc object
 * @name Models.AffectedItemsMeta
 *
 * @description This class wraps a list of AffectedItemsMeta payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var AffectedItemsMeta = function AffectedItemsMeta() {};

AffectedItemsMeta.prototype = {
	/**
  * @ngdoc method
  * @name Models.AffectedItemsMeta#fetch
  * @methodOf Models.AffectedItemsMeta
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  *
  * @returns {Object} A promise for affected items fields
  */
	fetch: function fetch(link) {
		var that = this;

		return this.RESTWrapperService.get(link, null, null, null, {
			ACCEPT: 'application/vnd.autodesk.plm.meta+json'
		}).then(function (payload) {
			that.json = payload;

			var promises = [];

			if (angular.isDefined(that.json.fields)) {
				that._.each(that.json.fields, function (field) {
					if (field.validators && !angular.isDefined(field.validatorsMeta)) {
						promises.push(that.RESTWrapperService.get(field.validators.substring(1), null, null, {}).then(function (validatorsMeta) {
							field.validatorsMeta = validatorsMeta;
						}));
					}
				});
			}

			return that.RESTWrapperService.allSettled(promises).then(function () {
				return that;
			});
		});
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItemsMeta#getFullList
  * @methodOf Models.AffectedItemsMeta
  * @description Returns the full list of data
  *
  * @returns {Array} The full list of data
  */
	getFullList: function getFullList() {
		return angular.copy(this.json.fields);
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItemsMeta#getFieldId
  * @methodOf Models.AffectedItemsMeta
  * @description Returns the field id of the field (e.g. 'DISPOSITION')
  *
  * @param {Object} field The field whose ID is to be retrieved
  *
  * @returns {String} The ID of the field
  */
	getFieldId: function getFieldId(field) {
		var matches = field.__self__.match(/fields\/(.+)$/);
		return matches && matches[1];
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItemsMeta#getDataTypeId
  * @methodOf Models.AffectedItemsMeta
  * @description Returns the data type id of the field
  *
  * @param {Object} field The field whose ID is to be retrieved
  *
  * @returns {String} The ID of the data type
  */
	getDataTypeId: function getDataTypeId(field) {
		var matches = field.type.link.match(/field-types\/(.+)$/);
		return matches && matches[1];
	}
};

angular.module('plm360.models').factory('AffectedItemsMeta', ['RESTWrapperService', 'EventService', '$q', '_', function (RESTWrapperService, EventService, $q, _) {
	var models = {};
	AffectedItemsMeta.prototype.RESTWrapperService = RESTWrapperService;
	AffectedItemsMeta.prototype.$q = $q;
	AffectedItemsMeta.prototype._ = _;

	EventService.listen('affectedItemsMeta:*:get', function (event, params) {
		var model = models[params] || new AffectedItemsMeta();
		models[params] = model;
		model.fetch(params).then(function (obj) {
			EventService.send('affectedItemsMeta:' + event.split(':')[1] + ':done', obj);
		});
	});

	return AffectedItemsMeta;
}]);
//# sourceMappingURL=AffectedItemsMeta.js.map
