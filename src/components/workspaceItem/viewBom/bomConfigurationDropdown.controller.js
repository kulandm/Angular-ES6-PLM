/**
 * @ngdoc object
 * @name Controllers.workspaceItem.BomConfigurationDropdownController
 *
 * @description View Controller for Bom configuration dropdown
 */

class BomConfigurationDropdownController {

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomConfigurationDropdownController@constructor
	 * @methodOf Controllers.workspaceItem.BomConfigurationDropdownController
	 * @description Builds the configuration object
	 *	and updates the dialog to match the initial bias and date parameters
	 */
	constructor(FieldTypes, FieldData, BiasService) {
		this.FieldTypes = FieldTypes;
		this.FieldData = FieldData;
		this.BiasService = BiasService;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.BomConfigurationDropdownController@biasConfiguration
		 * @propertyOf Controllers.workspaceItem.BomConfigurationDropdownController
		 * @description The configuration object
		 */
		this.biasConfiguration = {
			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItem.BomConfigurationDropdownController.biasConfiguration@effectiveDate
			 * @propertyOf Controllers.workspaceItem.BomConfigurationDropdownController
			 * @description The currently selected date, as an object with a .value property
			 */
			effectiveDate: this.FieldData.fromFieldData(this.FieldTypes.DATE, {}),

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItem.BomConfigurationDropdownController.biasConfiguration@bias
			 * @propertyOf Controllers.workspaceItem.BomConfigurationDropdownController
			 * @description The currently selected bias
			 */
			bias: null,

			/**
			 * @ngdoc method
			 * @name Controllers.workspaceItem.BomConfigurationDropdownController.biasConfiguration@setBias
			 * @methodOf Controllers.workspaceItem.BomConfigurationDropdownController
			 * @description Set the currently selected bias
			 */
			setBias: function (bias) {
				this.bias = bias;
			},

			/**
			 * @ngdoc method
			 * @name Controllers.workspaceItem.BomConfigurationDropdownController.biasConfiguration@setDate
			 * @methodOf Controllers.workspaceItem.BomConfigurationDropdownController
			 * @description Set the currently selected date from date string,
			 *	in a format for use in datepicker
			 */
			setDate: function (date) {
				this.effectiveDate.value = date;
			}
		};

		this.updateDialog();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomConfigurationDropdownController@getDate
	 * @methodOf Controllers.workspaceItem.BomConfigurationDropdownController
	 * @description Returns the currently selected date
	 */
	getDate() {
		return this.biasConfiguration.effectiveDate.value;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomConfigurationDropdownController@setDate
	 * @methodOf Controllers.workspaceItem.BomConfigurationDropdownController
	 * @description Sets the currently selected date
	 */
	setDate(date) {
		this.biasConfiguration.setDate(date);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomConfigurationDropdownController@getBias
	 * @methodOf Controllers.workspaceItem.BomConfigurationDropdownController
	 * @description Retursn the currently selected bias
	 */
	getBias() {
		return this.biasConfiguration.bias;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomConfigurationDropdownController@setBias
	 * @methodOf Controllers.workspaceItem.BomConfigurationDropdownController
	 * @description Sets the currently selected bias from a bias string
	 */
	setBias(bias) {
		this.biasConfiguration.setBias(bias);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomConfigurationDropdownController@updateDialog
	 * @methodOf Controllers.workspaceItem.BomConfigurationDropdownController
	 * @description Updates the date and bias from the external inital date and bias
	 */
	updateDialog() {
		this.setDate(this.initialDate);
		this.setBias(this.initialBias);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BomConfigurationDropdownController@getConfig
	 * @methodOf Controllers.workspaceItem.BomConfigurationDropdownController
	 * @description Returns the effective date and bias in a format suitable for consumption
	 */
	getConfig() {
		return {
			effectiveDate: this.getDate(),
			bias: this.getBias()
		};
	}
}

export default BomConfigurationDropdownController;
