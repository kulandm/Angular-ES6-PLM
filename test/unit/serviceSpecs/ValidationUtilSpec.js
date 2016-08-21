'use strict';

describe('ValidationUtil', function () {
	var q, rootScope, _;

	beforeEach(module('plm360','plmTemplates'));

	beforeEach(function () {
		inject(function ($q, $timeout, $rootScope, $httpBackend, _) {
			q = $q;
			_ = _;
			rootScope = $rootScope;

			rootScope.bundle = {
				error: {
					required: 'This is a required field.'
				}
			};
		});
	});

	it('should map validation errors with required parameters', inject(function (ValidationUtil) {
		var sampleFields = [{
			urn: 'test urn 1'
		}, {
			urn: 'test urn 2'
		}];

		var validations = [{
			field: {
				urn: 'test urn 1'
			},
			code: 'Error.Required',
			message: 'This is a required field'
		}];

		ValidationUtil.mapValidationErrors(sampleFields, validations);

		expect(sampleFields[0].serverError).to.equal('This is a required field');
	}));

	it('should map validation errors with an optional predicate', inject(function (ValidationUtil) {
		var sampleFields = [{
			link: 'test link 1'
		}, {
			link: 'test link 2'
		}];

		var validations = [{
			field: {
				urn: 'test link 2'
			},
			message: 'This field is required.'
		}];

		ValidationUtil.mapValidationErrors(sampleFields, validations, {predicate: function (field, validation) {
			return field.link === validation.field.urn;
		}});

		expect(sampleFields[1].serverError).to.equal('This field is required.');
	}));

	it('should map validation errors with custom properties', inject(function (ValidationUtil) {
		var sampleFields = [{
			urn: 'test link 1'
		}, {
			urn: 'test link 2'
		}];

		var validations = [{
			field: {
				urn: 'test link 2'
			},
			message: 'This field is required.'
		}];

		ValidationUtil.mapValidationErrors(sampleFields, validations, {fieldProperty: 'error', validationProperty: 'message'});

		expect(sampleFields[1].error).to.equal('This field is required.');
	}));

	it('should map validation errors with client side localization', inject(function (ValidationUtil) {
		var sampleFields = [{
			urn: 'test urn 1'
		}, {
			urn: 'test urn 2'
		}];

		var validations = [{
			field: {
				urn: 'test urn 1'
			},
			code: 'error.required'
		}];

		ValidationUtil.mapValidationErrors(sampleFields, validations, {validationProperty: 'code', localizedError: true});

		expect(sampleFields[0].serverError).to.equal(rootScope.bundle.error.required);

		ValidationUtil.clearValidationErrors(sampleFields);

		expect(sampleFields[0].serverError).to.be.null;
	}));

	it('Should return validations that do nott correspond to a field', inject(function (ValidationUtil) {
		var sampleFields = [{
			urn: 'test urn 1'
		}, {
			urn: 'test urn 2'
		}];

		var validations = [{
			field: {
				urn: 'test urn 3'
			},
			code: 'Error.Required',
			message: 'This is a required field'
		}];

		var unconsumed = ValidationUtil.mapValidationErrors(sampleFields, validations);

		expect(unconsumed.length).to.equal(1);
		expect(unconsumed[0]).to.equal(validations[0]);
	}));
});
