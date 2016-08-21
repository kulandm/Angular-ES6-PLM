import BomUIFieldSemantics from 'com/autodesk/models/bomFields/BomUIFieldSemantics.service.js';

/**
 * @ngdoc object
 * @name Models.BomField
 * @description Class defining the interface for a bom field (either an edge or node field)
 */
class BomField {
	/**
	 * @ngdoc method
	 * @name Models.BomField#constructor
	 * @methodOf Models.BomField
	 * @description initializes the BomField properties
	 *	If provided a BomField, will create a copy of the field
	 * @param {Object} args Arguments for instantiation
	 */
	constructor(args) {

		/**
		 * @ngdoc property
		 * @name Models.BomField#viewDefFieldInfo
		 * @propertyOf Models.BomField
		 * @description the information indicating the field definition and metadata
		 */
		this.viewDefFieldInfo = args.viewDefFieldInfo;

		/**
		 * @ngdoc property
		 * @name Models.BomField#type
		 * @propertyOf Models.BomField
		 * @description the type information about the field
		 */
		this.type = args.type;

		/**
		 * @ngdoc property
		 * @name Models.BomField#id
		 * @propertyOf Models.BomField
		 * @description the unique id for the field
		 */
		this.id = args.id;

		/**
		 * @ngdoc property
		 * @name Models.BomField#semantics
		 * @propertyOf Models.BomField
		 * @description The semantics for the field - see BomUIFieldSemantics
		 */
		this.semantics = args.semantics;

		/**
		 * @ngdoc property
		 * @name Models.BomField#value
		 * @propertyOf Models.BomField
		 * @description the value of the field
		 */
		this.value = (typeof args.value === 'undefined') ? '' : args.value;

		/**
		 * @ngdoc property
		 * @name Models.BomField#metadata
		 * @propertyOf Models.BomField
		 * @description Metadata associated with the field
		 */
		this.metadata = (typeof args.metadata === 'undefined') ? {} : args.metadata;

		/**
		 * @ngdoc property
		 * @name Models.BomField#href
		 * @propertyOf Models.BomField
		 * @description A link associated with this field
		 *	Not set in initializer, since we need external services
		 */
		this.href = null;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomField#getId
	 * @methodOf Models.BomField
	 * @description Returns the info leading to the corresponding viewDefField
	 *	(Specifically, the link and the urn)
	 &
	 * @returns {Object} The information
	 */
	getViewDefFieldInfo() {
		return this.viewDefFieldInfo;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomField#getId
	 * @methodOf Models.BomField
	 * @description Returns the id of the field
	 &
	 * @returns {String} The id
	 */
	getId() {
		return this.id;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomField#getFieldSemantics
	 * @methodOf Models.BomField
	 * @description Returns the semantics of the field
	 &
	 * @returns {BomUIFieldSemantics} The semantics
	 */
	getFieldSemantics() {
		return this.semantics;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomField#getValue
	 * @methodOf Models.BomField
	 * @description Returns the value of the field
	 &
	 * @returns {Object} The value of the field
	 */
	getValue() {
		return this.value;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomField#updateFieldValue
	 * @methodOf Models.BomField
	 * @description Updates the field from `valueSource`
	 *
	 * @param {Map} valueSource a map of ids to values
	 */
	updateFieldValue(valueSource) {
		if (valueSource && valueSource.has(this.getId())) {
			this.value = valueSource.get(this.getId());
			// Rollups are returned as raw numbers, but the value 0 is falsy
			// 	So we cooerce the numbers to strings
			if (typeof this.value === 'number') {
					this.value = this.value.toString();
			}
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomField#generateHref
	 * @methodOf Models.BomField
	 *
	 * @description Builds the state href for a given urn
	 *
	 *	Note that for Change order fields, the urn passed in is ignored
	 */
	generateHref(urn) {
		let semantics = this.getFieldSemantics();
		if (semantics === BomUIFieldSemantics.DESCRIPTOR || semantics === BomUIFieldSemantics.CHANGE_PENDING) {
			if (semantics === BomUIFieldSemantics.CHANGE_PENDING && this.value !== 'false' && this.value.urn) {
				urn = this.value.urn;
			}
			let workspaceId = urn.split('.').reverse()[1];

			this.href = BomField.$state.href('details', {
				workspaceId: workspaceId,
				tab: 'details',
				view: 'full',
				mode: 'view',
				itemId: BomField.UrnParser.encode(urn)
			});
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomField#itemNumberField
	 * @methodOf Models.BomField
	 *
	 * @description Returns an instace of BomFIeld that can be used to store item number
	 *		Which is not a field provided by the server
	 */
	static ItemNumberField() {
		let fieldArgs = {};
		fieldArgs.id = BomUIFieldSemantics.BOM_ITEM_NUMBER;
		fieldArgs.semantics = BomUIFieldSemantics.BOM_ITEM_NUMBER;
		fieldArgs.type = BomField.FieldTypes.NOOB;

		return new BomField(fieldArgs);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomField#FromViewDefField
	 * @methodOf Models.BomField
	 * @description Builds a BomField from a view definition field
	 *
	 * @returns {BomField} The field
	 */
	static FromViewDefField(viewDefField) {
		let fieldArgs = {};
		fieldArgs.viewDefFieldInfo = viewDefField.getSelf();
		fieldArgs.type = viewDefField.getTypeId();
		fieldArgs.id = viewDefField.getUrn();
		fieldArgs.semantics = viewDefField.getFieldSemantics();
		fieldArgs.metadata = viewDefField;

		return new BomField(fieldArgs);
	}
}

let BomFieldFactory = ($state, UrnParser, FieldTypes) => {
	BomField.$state = $state;
	BomField.UrnParser = UrnParser;
	BomField.FieldTypes = FieldTypes;

	return BomField;
};

BomFieldFactory.$inject = ['$state', 'UrnParser', 'FieldTypes'];

export default BomFieldFactory;
