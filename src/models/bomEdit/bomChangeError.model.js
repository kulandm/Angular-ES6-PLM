/**
 * @ngdoc object
 * @name Models.BomChangeError
 * @description Class representing a field in the view
 */
class BomChangeError {

	/**
	 * @ngdoc method
	 * @name Models.BomChangeError#constructor
	 * @methodOf Models.BomChangeError
	 * @description initializes a BomChangeError object using the error payload returned from the server
	 * @param {Object} args a list of arguments
	 */
	constructor(args) {

		/**
		 * @ngdoc property
		 * @name Models.BomChangeError#message
		 * @propertyOf Models.BomChangeError
		 * @description The text error returned by the server
		 */
		this.message = args.message;

		/**
		 * @ngdoc property
		 * @name Models.BomChangeError#code
		 * @propertyOf Models.BomChangeError
		 * @description The code of the error returned by the server
		 */
		this.code = args.code;

		/**
		 * @ngdoc property
		 * @name Models.BomChangeError#arguments
		 * @propertyOf Models.BomChangeError
		 * @description The arguments of the error returned by the server
		 */
		this.arguments = args.arguments;

		/**
		 * @ngdoc property
		 * @name Models.BomChangeError#editedField
		 * @propertyOf Models.BomChangeError
		 * @description The field that was edited for which the error was produced
		 */
		this.editedField = args.field;

		/**
		 * @ngdoc property
		 * @name Models.BomChangeError#editedFieldId
		 * @propertyOf Models.BomChangeError
		 * @description The target field id of the bom field that was edited for which the error was produced
		 */
		this.editedFieldId = (typeof args.field === 'undefined') ? null : args.field.urn.split('.').pop();
	}
	/**
	 * @ngdoc property
	 * @name Models.BomChangeError#getErrorFieldId
	 * @propertyOf Models.BomChangeError
	 * @description returns the target field id for which the error was produced
	 *
	 * @returns {String} representing the target field id
	 */
	getErrorFieldId() {
		return this.editedFieldId;
	}

	/**
	 * @ngdoc property
	 * @name Models.BomChangeError#convertToBomChangeErrors
	 * @propertyOf Models.BomChangeError
	 * @description takes an error payload from the server response and creates a corresponding list of type BomChangeError
	 *
	 * @returns {Array} an array of BomChangeError instances
	 */
	static convertToBomChangeErrors(errorPayload) {
		return errorPayload.data.map((error) => {
			return new BomChangeError(error);
		});
	}
}

export default BomChangeError;
