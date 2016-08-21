System.registerModule("com/autodesk/components/createItem/CreateItemPayloadBuilder.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/createItem/CreateItemPayloadBuilder.js";
  var CreateItemPayloadBuilder = function() {
    function CreateItemPayloadBuilder(wsSectionFields, _) {
      this.wsSectionFields = wsSectionFields;
      this.us = _;
      this.sectionLinkKey = 'id';
      this.sectionFieldsKey = 'fields';
      this.sectionFieldLinkKey = '__self__';
      this.payload = {sections: []};
      var that = this;
      this.fieldToSectionMap = (function() {
        var fieldIndex = function(section) {
          return that.us.chain(section[that.sectionFieldsKey]).indexBy(that.sectionFieldLinkKey).keys().map(function(k) {
            var retVal = {};
            retVal[k] = section[that.sectionLinkKey];
            return retVal;
          }).reduce(function(acc, b) {
            return that.us.extend(acc, b);
          }).value();
        };
        return that.us.chain(wsSectionFields).map(fieldIndex).reduce(function(a, b) {
          return that.us.extend(a ? a : {}, b);
        }).value();
      }());
    }
    return ($traceurRuntime.createClass)(CreateItemPayloadBuilder, {
      addFieldValue: function(fieldId, fieldValue) {
        if (!fieldId) {
          return this.payload;
        }
        var sect = this.fieldToSectionMap[fieldId];
        if (!sect) {
          return this.payload;
        }
        var payloadSectionNode = this.us.findIndex(this.payload.sections, function(node) {
          return node.link === sect;
        });
        if (payloadSectionNode < 0) {
          payloadSectionNode = {
            link: sect,
            fields: []
          };
          this.payload.sections.push(payloadSectionNode);
        } else {
          payloadSectionNode = this.payload.sections[payloadSectionNode];
        }
        var payloadFieldNode = this.us.findIndex(payloadSectionNode.fields, function(node) {
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
      },
      getPayload: function() {
        return this.payload;
      }
    }, {});
  }();
  var $__default = CreateItemPayloadBuilder;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/createItem/CreateItemPayloadBuilder.js
