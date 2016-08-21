'use strict';

/**
 * @ngdoc object
 * @name CreateItemPayloadBuilder
 *
 * @description A utility to construct create item payloads
 * It expects to be initialized with section to field map
 * For example:
 * When we have fields "a1" and "a2" in section "A", and fields "b1" and "b2" in section "B", then we initialize with:
 *    [ {id: "A", fields:[ {__self__:"a1"}, {__self__:"a2"} ]} ,
 *      {id: "B", fields:[ {__self__:"b1"}, {__self__:"b2"} ]}
 *    ]
 *
 * ##Dependencies
 * Underscore library
 *
 */
class CreateItemPayloadBuilder {

  /*
	 * @ngdoc method
	 * @name CreateItemPayloadBuilder#constructor
	 * @methodOf CreateItemPayloadBuilder
	 * @description The class constructor
	 */
  constructor(wsSectionFields, _) {
    this.wsSectionFields = wsSectionFields;
    this.us = _;
    // describes the keys in wsSectionFields for sections and fields
    this.sectionLinkKey = 'id';
    this.sectionFieldsKey = 'fields';
    this.sectionFieldLinkKey = '__self__';

    this.payload = {sections:[]}; // default

    let that = this;
    
    this.fieldToSectionMap = (function () {

		/*
		 * @ngdoc method
		 * @name CreateItemPayloadBuilder#constructor
		 * @methodOf CreateItemPayloadBuilder
		 * @description The class constructor
		 */
      let fieldIndex = function (section) {
        return that.us.chain(section[that.sectionFieldsKey])
          .indexBy(that.sectionFieldLinkKey)
          .keys()
          .map(function (k) {
            let retVal = {};
            retVal[k] = section[that.sectionLinkKey];
            return retVal;
          })
          .reduce(function (acc, b) {
            return that.us.extend(acc,b);
          })
          .value();
      };

      return that.us.chain(wsSectionFields)
        .map(fieldIndex)
        .reduce(function (a,b) {
          return that.us.extend(a ? a : {},b);
        })
        .value();
    }());
  }

  /**
	* @ngdoc method
	* @name CreateItemPayloadBuilder#addFieldValue
	* @methodOf CreateItemPayloadBuilder
	* @description Adds fieldValue to the specified field, overwriting if there
	* is an existing field with the same Id. The field is added to the correct
	* section object (within section array) based on the section-field relationship
	* provided when constructing this object.
	*
	* Each call mutates the underlying "payload"
	*
	* @returns {Object} The resulting payload
  */
  addFieldValue(fieldId, fieldValue) {
    if (!fieldId) {
      return this.payload;
    }
    
    let sect = this.fieldToSectionMap[fieldId];
    if (!sect) {
      return this.payload;
    }

    let payloadSectionNode = this.us.findIndex(this.payload.sections, function (node) {
		return node.link === sect;
    });
    if (payloadSectionNode < 0) {
      payloadSectionNode = {link:sect, fields:[]};
      this.payload.sections.push(payloadSectionNode);
    } else {
      payloadSectionNode = this.payload.sections[payloadSectionNode];
    }

    let payloadFieldNode = this.us.findIndex(payloadSectionNode.fields, function (node) {
		return node.__self__ === fieldId;
    });
    if (payloadFieldNode < 0) {
      payloadFieldNode = {__self__: fieldId};
      payloadSectionNode.fields.push(payloadFieldNode);
    } else {
      payloadFieldNode = payloadSectionNode.fields[payloadFieldNode];
    }
    
    if (fieldValue === null || fieldValue) {
      payloadFieldNode.value = fieldValue;
    }
    
    return this.payload;
  }

  /**
	 * @ngdoc method
	 * @name CreateItemPayloadBuilder#getPayload
	 * @methodOf CreateItemPayloadBuilder
	 * @description Gets the current value/state of the payload. It is expected
   * that at least some value(s) have been set through calling addFieldValue()
	 *
	 * @returns {Object} The payload
	 */
  getPayload() {
    return this.payload;
  }
}

export default CreateItemPayloadBuilder;
