(function () {
	'use strict';

	describe('[CONTROLLER] BomConfigurationDropdownController', function () {
		var configController = null;
		var $controller = null;
		var $rootScope = null;
		var $scope = null;
		var FieldTypes = null;
		var biasService = null;

		var initialDateStr = null;
		var initalDateObj = null;
		var initialBias = null;

		var eventService = null;

		beforeEach(module('plm360', 'plm360.permissions', 'plm360.models', 'plm360.mockData', 'plm360.mockObjects'));

		beforeEach(function () {
			inject(function (_$controller_, _$rootScope_, _FieldTypes_, MockBiasService, MockLocalizationData, EventService) {
				$controller = _$controller_;
				$rootScope = _$rootScope_;
				$scope = $rootScope.$new();
				FieldTypes = _FieldTypes_;
				biasService = new MockBiasService();
				eventService = EventService;
			});

			biasService.getBiases.returns(['release', 'working', 'changeOrder', 'allChangeOrder']);

			// Define intial state variables
			initialDateStr = '2001-01-01';
			initialBias = 'release';

			// Currently, we can't inject the state directly into the controller to account for bindToController
			//	In higher versions of angular (>1.3.20)
			//	We can use the third argument of $controller() to set the scope bindings directly

			configController = $controller('BomConfigurationDropdownController', {
				$scope: $scope,
				FieldTypes: FieldTypes,
				BiasService: biasService
			});

			configController.initialDate = initialDateStr;
			configController.initialBias = initialBias;

			configController.updateDialog();
		});

		after(function () {
			configController = null;
			$controller = null;
			FieldTypes = null;
			biasService = null;
			initialDateStr = null;
			initalDateObj = null;
			initialBias = null;
			eventService = null;
		});

		//
		// We test the getter and setter methods because the values are not
		//	guaranteed to return in the same format that they are set
		//		depending on the user's settings
		//
		describe('[METHOD] setDate and getDate', function () {
			it('Should set the date correctly, and return it in a format parsable by moment', function () {
				var newDateStr = '2000-12-31';
				var newDateMoment = moment(newDateStr);

				// ----- GIVEN -----
				// We set the date using setter
				configController.setDate('2000-12-31');

				// ----- WHEN -----
				// We retrieve the date using getter
				var actual = configController.getDate();

				// ----- THEN -----
				// the date getter should return the correct date and be parsable by moment
				expect(moment(actual).isSame(newDateMoment)).to.be.true;
			});
		});

		describe('[METHOD] setBias and getBias', function () {
			it('Should return the correct bias', function () {
				// ----- GIVEN -----
				// We set the bias using setter
				configController.setBias('release');

				// ----- WHEN -----
				// we retrieve the bias using getter
				var bias = configController.getBias();

				// ----- THEN -----
				// the bias getter should return the correct bias
				expect(bias).to.equal('release');
			});
		});

		describe('[METHOD] updateDialog', function () {
			it('Should update the stored date', function () {
				var newDateStr = '2000-12-31';
				var newDateMoment = moment(newDateStr);

				// ----- GIVEN -----
				// The initial date is updated
				expect(moment(configController.initialDate).isSame(newDateMoment)).to.be.false;
				configController.initialDate = newDateStr;

				// ----- WHEN -----
				// The updateDialog method is called
				configController.updateDialog();

				// ----- THEN -----
				// The configuration should return the new initial date
				expect(moment(configController.getDate()).isSame(newDateMoment)).to.be.true;
			});

			it('Should update the stored bias', function () {
				// ----- GIVEN -----
				// The initial bias is updated
				expect(configController.initialBias).to.not.equal('working');
				configController.initialBias = 'working';

				// ----- WHEN -----
				// The updateDialog method is called
				configController.updateDialog();

				// ----- THEN -----
				// The configuration should return the new initial date
				expect(configController.initialBias).to.equal('working');
			});
		});

		describe('[METHOD] getConfig', function () {
			// ----- WHEN -----
			it('Should return the correct data in the expected format', function () {
				var config = configController.getConfig();

				// ----- THEN -----
				// The returned configuration should be in the expected format
				expect(config.bias).to.equal(initialBias);
				expect(moment(config.effectiveDate).isSame(moment(initialDateStr))).to.be.true;
			});
		});
	});
}());
