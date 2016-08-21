System.registerModule("com/autodesk/components/workspaceItem/viewBom/bomConfigurationDropdown.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewBom/bomConfigurationDropdown.controller.js";
  var BomConfigurationDropdownController = function() {
    function BomConfigurationDropdownController(FieldTypes, FieldData, BiasService) {
      this.FieldTypes = FieldTypes;
      this.FieldData = FieldData;
      this.BiasService = BiasService;
      this.biasConfiguration = {
        effectiveDate: this.FieldData.fromFieldData(this.FieldTypes.DATE, {}),
        bias: null,
        setBias: function(bias) {
          this.bias = bias;
        },
        setDate: function(date) {
          this.effectiveDate.value = date;
        }
      };
      this.updateDialog();
    }
    return ($traceurRuntime.createClass)(BomConfigurationDropdownController, {
      getDate: function() {
        return this.biasConfiguration.effectiveDate.value;
      },
      setDate: function(date) {
        this.biasConfiguration.setDate(date);
      },
      getBias: function() {
        return this.biasConfiguration.bias;
      },
      setBias: function(bias) {
        this.biasConfiguration.setBias(bias);
      },
      updateDialog: function() {
        this.setDate(this.initialDate);
        this.setBias(this.initialBias);
      },
      getConfig: function() {
        return {
          effectiveDate: this.getDate(),
          bias: this.getBias()
        };
      }
    }, {});
  }();
  var $__default = BomConfigurationDropdownController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewBom/bomConfigurationDropdown.controller.js
