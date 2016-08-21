System.registerModule("com/autodesk/plm-bom-module.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/plm-bom-module.js";
  System.get('com/autodesk/models/bom-models.js');
  System.get('com/autodesk/services/bom-services.js');
  angular.module(__moduleName, ['com/autodesk/models/bom-models.js', 'com/autodesk/services/bom-services.js']);
  return {};
});
//# sourceURL=com/autodesk/plm-bom-module.js
;

System.registerModule("com/autodesk/models/bom-models.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bom-models.js";
  angular.module(__moduleName, []);
  return {};
});
//# sourceURL=com/autodesk/models/bom-models.js
;

System.registerModule("com/autodesk/models/bomExport/bomExcelTable.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomExport/bomExcelTable.model.js";
  var BomExcelTableStyles = System.get("com/autodesk/models/bomExport/bomExcelTableStyles.model.js").default;
  var BomExcelTable = function() {
    function BomExcelTable() {
      var worksheets = arguments[0] !== (void 0) ? arguments[0] : [];
      var styles = arguments[1] !== (void 0) ? arguments[1] : null;
      this.worksheets = worksheets;
      this.styles = styles;
    }
    return ($traceurRuntime.createClass)(BomExcelTable, {
      getWorksheets: function() {
        return this.worksheets;
      },
      addWorksheet: function(worksheet) {
        this.worksheets.push(worksheet);
      },
      setStyles: function(styles) {
        this.styles = styles;
      },
      getStyles: function() {
        return this.styles;
      },
      getCompoundStyles: function() {
        var $__3 = this;
        var compoundStyles = new Map();
        if (this.styles) {
          this.getWorksheets().forEach(function(worksheet) {
            worksheet.getRows().forEach(function(row) {
              row.getCells().forEach(function(cell) {
                var cellKey = cell.getCompoundStyleKey();
                if (cellKey && !compoundStyles.has(cellKey)) {
                  compoundStyles.set(cellKey, $__3.styles.getStyleObjectForCompoundKey(cellKey));
                }
              });
            });
          });
        }
        return compoundStyles;
      }
    }, {});
  }();
  var $__default = BomExcelTable;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomExport/bomExcelTable.model.js
;

System.registerModule("com/autodesk/models/bomExport/bomExcelTableCell.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomExport/bomExcelTableCell.model.js";
  var BomExcelTableCell = function() {
    function BomExcelTableCell() {
      var value = arguments[0] !== (void 0) ? arguments[0] : '';
      var fieldType = arguments[1];
      var link = arguments[2] !== (void 0) ? arguments[2] : null;
      var compoundStyleKey = arguments[3] !== (void 0) ? arguments[3] : null;
      this.value = (value === null) ? '' : value;
      this.type = fieldType;
      this.link = link;
      this.compoundStyleKey = compoundStyleKey;
    }
    return ($traceurRuntime.createClass)(BomExcelTableCell, {
      getValue: function() {
        return this.value;
      },
      setValue: function(value) {
        this.value = value;
      },
      getFieldType: function() {
        return this.type;
      },
      getLink: function() {
        return this.link;
      },
      setLink: function(link) {
        this.link = link;
      },
      getCompoundStyleKey: function() {
        return this.compoundStyleKey;
      },
      setCompoundStyleKey: function(compoundKey) {
        this.compoundStyleKey = compoundKey;
      }
    }, {});
  }();
  var $__default = BomExcelTableCell;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomExport/bomExcelTableCell.model.js
;

System.registerModule("com/autodesk/models/bomExport/bomExcelTableCellLocation.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomExport/bomExcelTableCellLocation.model.js";
  var BomExcelTableCellLocation = function() {
    function BomExcelTableCellLocation(row, column) {
      this.row = row;
      this.column = column;
    }
    return ($traceurRuntime.createClass)(BomExcelTableCellLocation, {
      convertIndexToColumnName: function(columnIndex) {
        var COLUMN_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var NUM_LETTERS = COLUMN_LETTERS.length;
        var columnName = '';
        var dividend = columnIndex + 1;
        while (dividend > 0) {
          var modulo = (dividend - 1) % NUM_LETTERS;
          columnName = COLUMN_LETTERS[modulo] + columnName;
          dividend = Math.floor((dividend - modulo) / NUM_LETTERS);
        }
        return columnName;
      },
      convertIndexToRowName: function(rowIndex) {
        return (rowIndex + 1).toString();
      },
      toExcelCellString: function() {
        var columnName = this.convertIndexToColumnName(this.column);
        var rowName = this.convertIndexToRowName(this.row);
        return columnName + rowName;
      },
      toExcelBuilderCoordinates: function() {
        return [this.column + 1, this.row + 1];
      }
    }, {});
  }();
  var $__default = BomExcelTableCellLocation;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomExport/bomExcelTableCellLocation.model.js
;

System.registerModule("com/autodesk/models/bomExport/bomExcelTableLink.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomExport/bomExcelTableLink.model.js";
  var BomExcelTableLink = function() {
    function BomExcelTableLink(link, cellLocation) {
      var isExternal = arguments[2] !== (void 0) ? arguments[2] : true;
      this.link = link;
      this.cellLocation = cellLocation;
      this.isExternalLink = isExternal;
    }
    return ($traceurRuntime.createClass)(BomExcelTableLink, {
      getLink: function() {
        return this.link;
      },
      getCellLocation: function() {
        return this.cellLocation;
      },
      isExternal: function() {
        return this.isExternalLink;
      }
    }, {});
  }();
  var $__default = BomExcelTableLink;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomExport/bomExcelTableLink.model.js
;

System.registerModule("com/autodesk/models/bomExport/bomExcelTableRegion.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomExport/bomExcelTableRegion.model.js";
  var BomExcelTableRegion = function() {
    function BomExcelTableRegion(startLocation, endLocation) {
      this.startLocation = startLocation;
      this.endLocation = endLocation;
    }
    return ($traceurRuntime.createClass)(BomExcelTableRegion, {
      getStartLocation: function() {
        return this.startLocation;
      },
      getEndLocation: function() {
        return this.endLocation;
      }
    }, {});
  }();
  var $__default = BomExcelTableRegion;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomExport/bomExcelTableRegion.model.js
;

System.registerModule("com/autodesk/models/bomExport/bomExcelTableRow.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomExport/bomExcelTableRow.model.js";
  var BomExcelTableRow = function() {
    function BomExcelTableRow() {
      var cells = arguments[0] !== (void 0) ? arguments[0] : [];
      this.cells = cells;
    }
    return ($traceurRuntime.createClass)(BomExcelTableRow, {getCells: function() {
        return this.cells;
      }}, {});
  }();
  var $__default = BomExcelTableRow;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomExport/bomExcelTableRow.model.js
;

System.registerModule("com/autodesk/models/bomExport/bomExcelTableStyle.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomExport/bomExcelTableStyle.model.js";
  var BomExcelTableStyle = function() {
    function BomExcelTableStyle(key, propName, value) {
      this.key = key;
      this.propName = propName;
      this.value = value;
    }
    return ($traceurRuntime.createClass)(BomExcelTableStyle, {
      getKey: function() {
        return this.key;
      },
      getPropertyName: function() {
        return this.propName;
      },
      getValue: function() {
        return this.value;
      }
    }, {});
  }();
  var $__default = BomExcelTableStyle;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomExport/bomExcelTableStyle.model.js
;

System.registerModule("com/autodesk/models/bomExport/bomExcelTableStyleTypes.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomExport/bomExcelTableStyleTypes.js";
  var BomExcelTableStyleTypes = {
    DATE_FORMAT: 'date_format',
    CONFIG_ROW_FILL: 'config_row_fill',
    CONFIG_ROW_FONT: 'config_row_font',
    COLUMN_HEADER_FILL: 'column_header_fill',
    COLUMN_HEADER_FONT: 'column_header_font',
    COLUMN_HEADER_ALIGNMENT: 'column_header_alignment',
    DATA_ROW_DEPTH_FILL: 'data_row_depth_fill',
    DATA_CELL_ALIGNMENT: 'data_cell_alignment'
  };
  BomExcelTableStyleTypes.getConstantStyles = function() {
    return [this.CONFIG_ROW_FILL, this.CONFIG_ROW_FONT, this.COLUMN_HEADER_FILL, this.COLUMN_HEADER_FONT, this.COLUMN_HEADER_ALIGNMENT, this.DATA_ROW_DEPTH_FILL, this.DATA_CELL_ALIGNMENT];
  };
  var styleMap = new Map();
  styleMap.set(BomExcelTableStyleTypes.CONFIG_ROW_FILL, {
    property: 'fill',
    value: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: 'FF133046'
    }
  });
  styleMap.set(BomExcelTableStyleTypes.CONFIG_ROW_FONT, {
    property: 'font',
    value: {
      color: 'FFFFFFFF',
      size: 14
    }
  });
  styleMap.set(BomExcelTableStyleTypes.COLUMN_HEADER_FILL, {
    property: 'fill',
    value: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: 'FFBBBBBB'
    }
  });
  styleMap.set(BomExcelTableStyleTypes.COLUMN_HEADER_ALIGNMENT, {
    property: 'alignment',
    value: {horizontal: 'center'}
  });
  styleMap.set(BomExcelTableStyleTypes.COLUMN_HEADER_FONT, {
    property: 'font',
    value: {
      bold: true,
      color: 'FF000000'
    }
  });
  styleMap.set(BomExcelTableStyleTypes.DATA_ROW_DEPTH_FILL, {
    property: 'fill',
    value: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: 'FFFFCF8F'
    }
  });
  styleMap.set(BomExcelTableStyleTypes.DATA_CELL_ALIGNMENT, {
    property: 'alignment',
    value: {
      horizontal: 'right',
      vertical: 'center',
      wrapText: true
    }
  });
  BomExcelTableStyleTypes.getStyle = function(key) {
    return styleMap.get(key);
  };
  var $__default = BomExcelTableStyleTypes;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomExport/bomExcelTableStyleTypes.js
;

System.registerModule("com/autodesk/models/bomExport/bomExcelTableStyles.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomExport/bomExcelTableStyles.model.js";
  var STYLE_DELIMETER = '$$';
  var BomExcelTableStyles = function() {
    function BomExcelTableStyles() {
      var styles = arguments[0] !== (void 0) ? arguments[0] : [];
      var $__2 = this;
      this.styles = new Map();
      styles.forEach(function(style) {
        $__2.styles.set(style.getKey(), style);
      });
    }
    return ($traceurRuntime.createClass)(BomExcelTableStyles, {
      addStyle: function(style) {
        this.styles.set(style.getKey(), style);
      },
      getStyles: function() {
        return this.styles;
      },
      getStyleObjectForCompoundKey: function(compoundKey) {
        var $__2 = this;
        var keys = compoundKey.split(STYLE_DELIMETER);
        var styles = keys.map(function(key) {
          return $__2.styles.get(key);
        });
        var styleObject = {};
        styles.forEach(function(style) {
          styleObject[style.getPropertyName()] = style.getValue();
        });
        return styleObject;
      }
    }, {buildCompoundKey: function(keys) {
        if (keys.length > 0) {
          return keys.sort().join(STYLE_DELIMETER);
        } else {
          return;
        }
      }});
  }();
  var $__default = BomExcelTableStyles;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomExport/bomExcelTableStyles.model.js
;

System.registerModule("com/autodesk/models/bomExport/bomExcelTableWorksheet.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomExport/bomExcelTableWorksheet.model.js";
  var BomExcelTableWorksheet = function() {
    function BomExcelTableWorksheet(name) {
      var rows = arguments[1] !== (void 0) ? arguments[1] : [];
      var mergeRules = arguments[2] !== (void 0) ? arguments[2] : [];
      var tableRegions = arguments[3] !== (void 0) ? arguments[3] : [];
      this.name = name;
      this.rows = rows;
      this.mergeRules = mergeRules;
      this.tableRegions = tableRegions;
    }
    return ($traceurRuntime.createClass)(BomExcelTableWorksheet, {
      getName: function() {
        return this.name;
      },
      getRows: function() {
        return this.rows;
      },
      addRow: function(row) {
        this.rows.push(row);
      },
      addRows: function(rows) {
        this.rows = this.rows.concat(rows);
      },
      getMergeRules: function() {
        return this.mergeRules;
      },
      addMergeRule: function(mergeRule) {
        this.mergeRules.push(mergeRule);
      },
      getTableRegions: function() {
        return this.tableRegions;
      },
      addTableRegion: function(region) {
        this.tableRegions.push(region);
      }
    }, {});
  }();
  var $__default = BomExcelTableWorksheet;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomExport/bomExcelTableWorksheet.model.js
;

System.registerModule("com/autodesk/models/bomFields/BomUIFieldSemantics.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomFields/BomUIFieldSemantics.service.js";
  var BomUIFieldSemantics = {
    DESCRIPTOR: '$$DESCRIPTOR',
    QUANTITY: '$$QUANTITY',
    REVISION: '$$REVISION',
    CHANGE_PENDING: '$$CHANGE_PENDING',
    ATTACHMENTS: '$$ATTACHMENTS',
    PINNING: '$$PINNING',
    BOM_ITEM_NUMBER: '$$BOM_ITEM_NUMBER',
    BASIC: '$$BASIC'
  };
  var $__default = BomUIFieldSemantics;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomFields/BomUIFieldSemantics.service.js
;

System.registerModule("com/autodesk/services/biasService/bias.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/services/biasService/bias.js";
  var BiasService = System.get("com/autodesk/services/biasService/bias.service.js").default;
  angular.module(__moduleName, []).service('BiasService', BiasService);
  return {};
});
//# sourceURL=com/autodesk/services/biasService/bias.js
;

System.registerModule("com/autodesk/services/biasService/bias.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/services/biasService/bias.service.js";
  var BiasService = function() {
    function BiasService($rootScope) {
      this.$rootScope = $rootScope;
      this.orderedBiases = ['release', 'working', 'changeOrder', 'allChangeOrder'];
    }
    return ($traceurRuntime.createClass)(BiasService, {
      getBiases: function() {
        return this.orderedBiases;
      },
      getBiasName: function(bias) {
        var biasNames = {
          release: this.$rootScope.bundle.bom.bias.released,
          working: this.$rootScope.bundle.bom.bias.working,
          changeOrder: this.$rootScope.bundle.bom.bias.pending,
          allChangeOrder: this.$rootScope.bundle.bom.bias.allPending
        };
        return biasNames[bias];
      }
    }, {});
  }();
  var $__default = BiasService;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/services/biasService/bias.service.js
;

System.registerModule("com/autodesk/services/bom-services.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/services/bom-services.js";
  System.get('com/autodesk/services/biasService/bias.js');
  System.get('com/autodesk/services/bomExport/bom-export-services.js');
  angular.module(__moduleName, ['com/autodesk/services/biasService/bias.js', 'com/autodesk/services/bomExport/bom-export-services.js']);
  return {};
});
//# sourceURL=com/autodesk/services/bom-services.js
;

System.registerModule("com/autodesk/services/bomExport/bom-export-services.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/services/bomExport/bom-export-services.js";
  var BomExcelTableAdapter = System.get("com/autodesk/services/bomExport/bomExcelTableAdapter.service.js").default;
  var BomExcelBuilderJsTableAdapter = System.get("com/autodesk/services/bomExport/bomExcelBuilderJsTableAdapter.service.js").default;
  var BomExcelBuilderJsDownloader = System.get("com/autodesk/services/bomExport/bomExcelBuilderJsDownloader.service.js").default;
  var BomExporter = System.get("com/autodesk/services/bomExport/bomExporter.service.js").default;
  var BomExportSettings = System.get("com/autodesk/services/bomExport/bomExportSettings.service.js").default;
  angular.module(__moduleName, []).value('ExcelBuilder', window.ExcelBuilder).service('BomExcelTableAdapter', BomExcelTableAdapter).service('BomExcelBuilderJsTableAdapter', BomExcelBuilderJsTableAdapter).service('BomExcelBuilderJsDownloader', BomExcelBuilderJsDownloader).service('BomExporter', BomExporter).service('BomExportSettings', BomExportSettings);
  return {};
});
//# sourceURL=com/autodesk/services/bomExport/bom-export-services.js
;

System.registerModule("com/autodesk/services/bomExport/bomExcelBuilderJsDownloader.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/services/bomExport/bomExcelBuilderJsDownloader.service.js";
  var BomExcelBuilderJsDownloader = function() {
    function BomExcelBuilderJsDownloader(ExcelBuilder, FileSaver) {
      this.ExcelBuilder = ExcelBuilder;
      this.FileSaver = FileSaver;
    }
    return ($traceurRuntime.createClass)(BomExcelBuilderJsDownloader, {
      base64ToBlob: function(str) {
        var byteCharacters = atob(str);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], {type: ''});
      },
      downloadWorkbook: function(filename, workbook) {
        var $__2 = this;
        this.ExcelBuilder.Builder.createFile(workbook).then(function(base64String) {
          var blob = $__2.base64ToBlob(base64String);
          $__2.FileSaver.saveAs(blob, filename);
        });
      }
    }, {});
  }();
  BomExcelBuilderJsDownloader.$inject = ['ExcelBuilder', 'FileSaver'];
  var $__default = BomExcelBuilderJsDownloader;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/services/bomExport/bomExcelBuilderJsDownloader.service.js
;

System.registerModule("com/autodesk/services/bomExport/bomExcelBuilderJsTableAdapter.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/services/bomExport/bomExcelBuilderJsTableAdapter.service.js";
  var BomExcelBuilderJsTableAdapter = function() {
    function BomExcelBuilderJsTableAdapter(ExcelBuilder, FieldTypes, BomExportSettings, moment) {
      this.ExcelBuilder = ExcelBuilder;
      this.FieldTypes = FieldTypes;
      this.BomExportSettings = BomExportSettings;
      this.moment = moment;
    }
    return ($traceurRuntime.createClass)(BomExcelBuilderJsTableAdapter, {
      consumeWorksheetModelData: function(worksheetModel, worksheet, stylesMap) {
        var $__2 = this;
        var data = [];
        worksheetModel.getRows().forEach(function(row) {
          var dataRow = [];
          row.getCells().forEach(function(cell) {
            var value = $__2.cellToValue(cell);
            var metadata = $__2.buildCellMetadata(cell, stylesMap);
            var cellContents = {
              value: value,
              metadata: metadata
            };
            dataRow.push(cellContents);
            var link = $__2.buildCellHyperlink(cell);
            if (link) {
              worksheet.hyperlinks.push(link);
            }
          });
          data.push(dataRow);
        });
        worksheet.setData(data);
        return data;
      },
      cellToValue: function(cell) {
        var value;
        if (cell.getValue() === '') {
          value = '';
        } else {
          switch (cell.getFieldType()) {
            case this.FieldTypes.INTEGER:
            case this.FieldTypes.LONG:
            case this.FieldTypes.FLOAT:
            case this.FieldTypes.MONEY:
            case this.FieldTypes.MONEY_EXTENDED:
              value = parseFloat(cell.getValue());
              if (Number.isNaN(value)) {
                value = cell.getValue();
              }
              break;
            case this.FieldTypes.DATE:
              value = this.dateStringToValue(cell.getValue());
              break;
            default:
              value = cell.getValue();
          }
        }
        return value;
      },
      dateStringToValue: function(dateString) {
        var value = dateString.slice(0, this.BomExportSettings.API_DATE_FORMAT.length);
        var date = this.moment(value, this.BomExportSettings.API_DATE_FORMAT).toDate();
        var dateWithoutTimezone = (date.getTime()) - (date.getTimezoneOffset() * 60 * 1000);
        return dateWithoutTimezone;
      },
      buildCellMetadata: function(cell, stylesMap) {
        var metadata = {};
        if (cell.getCompoundStyleKey()) {
          metadata.style = stylesMap.get(cell.getCompoundStyleKey());
        }
        if (cell.getValue() !== '') {
          if (cell.getFieldType() === this.FieldTypes.DATE) {
            metadata.type = 'dateWithoutTimezone';
          }
        }
        return metadata;
      },
      buildCellHyperlink: function(cell) {
        var link = cell.getLink();
        if (link) {
          var cellLocation = link.getCellLocation().toExcelCellString();
          var linkLocation = link.getLink();
          var targetMode = link.isExternal() ? 'External' : 'Internal';
          return {
            cell: cellLocation,
            location: linkLocation,
            targetMode: targetMode
          };
        } else {
          return null;
        }
      },
      addWorksheet: function(workbook, worksheetModel, stylesMap) {
        var $__2 = this;
        var worksheet = workbook.createWorksheet({name: worksheetModel.getName()});
        var data = this.consumeWorksheetModelData(worksheetModel, worksheet, stylesMap);
        worksheetModel.getMergeRules().forEach(function(mergeRule) {
          worksheet.mergeCells(mergeRule.getStartLocation().toExcelCellString(), mergeRule.getEndLocation().toExcelCellString());
        });
        worksheetModel.getTableRegions().forEach(function(region) {
          var table = new $__2.ExcelBuilder.Table();
          table.styleInfo.themeStyle = 'TableStyleLight15';
          var startLocation = region.getStartLocation();
          var endLocation = region.getEndLocation();
          table.setReferenceRange(region.getStartLocation().toExcelBuilderCoordinates(), region.getEndLocation().toExcelBuilderCoordinates());
          var columnFields = data[startLocation.row].slice(startLocation.column, endLocation.column + 1);
          var columnNames = columnFields.map(function(cell) {
            return cell.value;
          });
          table.setTableColumns(columnNames);
          worksheet.addTable(table);
          workbook.addTable(table);
        });
        workbook.addWorksheet(worksheet);
      },
      buildWorkbookStyles: function(workbook, styles) {
        var stylesheet = workbook.getStyleSheet();
        var stylesMap = new Map();
        styles.forEach(function(styleObject, compoundKey) {
          var format = stylesheet.createFormat(styleObject);
          stylesMap.set(compoundKey, format.id);
        });
        return stylesMap;
      },
      fromBomExcelTable: function(bomExcelTable) {
        var $__2 = this;
        var workbook = this.ExcelBuilder.Builder.createWorkbook();
        var stylesMap = this.buildWorkbookStyles(workbook, bomExcelTable.getCompoundStyles());
        bomExcelTable.getWorksheets().forEach(function(worksheetModel) {
          $__2.addWorksheet(workbook, worksheetModel, stylesMap);
        });
        return workbook;
      }
    }, {});
  }();
  BomExcelBuilderJsTableAdapter.$inject = ['ExcelBuilder', 'FieldTypes', 'BomExportSettings', 'moment'];
  var $__default = BomExcelBuilderJsTableAdapter;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/services/bomExport/bomExcelBuilderJsTableAdapter.service.js
;

System.registerModule("com/autodesk/services/bomExport/bomExcelTableAdapter.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/services/bomExport/bomExcelTableAdapter.service.js";
  var BomExcelTable = System.get("com/autodesk/models/bomExport/bomExcelTable.model.js").default;
  var BomExcelTableStyleTypes = System.get("com/autodesk/models/bomExport/bomExcelTableStyleTypes.js").default;
  var BomExcelTableStyles = System.get("com/autodesk/models/bomExport/bomExcelTableStyles.model.js").default;
  var BomExcelTableStyle = System.get("com/autodesk/models/bomExport/bomExcelTableStyle.model.js").default;
  var BomExcelTableWorksheet = System.get("com/autodesk/models/bomExport/bomExcelTableWorksheet.model.js").default;
  var BomExcelTableRow = System.get("com/autodesk/models/bomExport/bomExcelTableRow.model.js").default;
  var BomExcelTableCell = System.get("com/autodesk/models/bomExport/bomExcelTableCell.model.js").default;
  var BomExcelTableRegion = System.get("com/autodesk/models/bomExport/bomExcelTableRegion.model.js").default;
  var BomExcelTableCellLocation = System.get("com/autodesk/models/bomExport/bomExcelTableCellLocation.model.js").default;
  var BomExcelTableLink = System.get("com/autodesk/models/bomExport/bomExcelTableLink.model.js").default;
  var BomUIFieldSemantics = System.get("com/autodesk/models/bomFields/BomUIFieldSemantics.service.js").default;
  var NUM_HEADER_ROWS = 1;
  var NUM_TABLE_HEADER_ROWS = 1;
  var BomExcelTableAdapter = function() {
    function BomExcelTableAdapter(BomExportSettings, FieldTypes, BiasService, PicklistUtils) {
      this.BomExportSettings = BomExportSettings;
      this.FieldTypes = FieldTypes;
      this.BiasService = BiasService;
      this.PicklistUtils = PicklistUtils;
    }
    return ($traceurRuntime.createClass)(BomExcelTableAdapter, {
      buildHeaderRow: function(item, configuration) {
        var itemTitle = item.getItemTitle();
        var version = item.getItemVersion();
        var itemText;
        if (version) {
          itemText = (itemTitle + " " + version);
        } else {
          itemText = ("" + itemTitle);
        }
        var viewTitle = configuration.viewTitle;
        var date = configuration.date;
        var viewText = (viewTitle + " as of " + date);
        var bias = this.BiasService.getBiasName(configuration.bias);
        var configurationText = ("Configuration: " + bias);
        var separator = '     ';
        var fullText = ("" + itemText + separator + viewText + separator + configurationText);
        var headerStyleKeys = [BomExcelTableStyleTypes.CONFIG_ROW_FILL, BomExcelTableStyleTypes.CONFIG_ROW_FONT];
        var headerCell = new BomExcelTableCell(fullText, this.FieldTypes.SINGLE_LINE_TEXT, null, BomExcelTableStyles.buildCompoundKey(headerStyleKeys));
        var headerRow = new BomExcelTableRow([headerCell]);
        return headerRow;
      },
      buildColumnHeadersRow: function(columns) {
        var $__13 = this;
        var headerStyleKeys = [BomExcelTableStyleTypes.COLUMN_HEADER_FILL, BomExcelTableStyleTypes.COLUMN_HEADER_FONT, BomExcelTableStyleTypes.COLUMN_HEADER_ALIGNMENT];
        var cells = columns.map(function(column) {
          return new BomExcelTableCell(column.displayName, $__13.FieldTypes.SINGLE_LINE_TEXT, null, BomExcelTableStyles.buildCompoundKey(headerStyleKeys));
        });
        var rowNumberCell = new BomExcelTableCell(' ', this.FieldTypes.SINGLE_LINE_TEXT, null, BomExcelTableStyles.buildCompoundKey(headerStyleKeys));
        var allCells = [].concat([rowNumberCell], cells);
        return new BomExcelTableRow(allCells);
      },
      buildDataRows: function(rows, columns) {
        var $__13 = this;
        return rows.map(function(row, rowIndex) {
          var rowNumberCell = new BomExcelTableCell(rowIndex, $__13.FieldTypes.INTEGER, null, BomExcelTableStyles.buildCompoundKey($__13.determineFieldStyles(row)));
          var cells = columns.map(function(column, columnIndex) {
            var field = row.displayProperties[column.fieldId];
            var cellLocation = new BomExcelTableCellLocation(rowIndex + NUM_HEADER_ROWS + NUM_TABLE_HEADER_ROWS, columnIndex + 1);
            var value = $__13.extractFieldValue(field);
            var typeId = field.typeId;
            var url = $__13.extractFieldLink(field);
            var link = url ? new BomExcelTableLink(url, cellLocation) : null;
            var styles = $__13.determineFieldStyles(row, field);
            var compoundStyleKey = BomExcelTableStyles.buildCompoundKey(styles);
            return new BomExcelTableCell(value, typeId, link, compoundStyleKey);
          });
          var allCells = [].concat([rowNumberCell], cells);
          return new BomExcelTableRow(allCells);
        });
      },
      extractFieldValue: function(fieldData) {
        var value = fieldData.getValue();
        if (value === '') {
          return value;
        }
        var semantics = fieldData.getFieldSemantics();
        if (semantics === BomUIFieldSemantics.DESCRIPTOR) {
          return value.descriptor;
        } else if (semantics === BomUIFieldSemantics.CHANGE_PENDING) {
          return value.title;
        } else if (semantics === BomUIFieldSemantics.BOM_ITEM_NUMBER) {
          return (value.depth + "." + value.itemNumber);
        } else if (semantics === BomUIFieldSemantics.REVISION) {
          return value.title;
        } else if (semantics === BomUIFieldSemantics.ATTACHMENTS) {
          return value.count;
        }
        switch (fieldData.typeId) {
          case this.FieldTypes.PICKLIST:
          case this.FieldTypes.PICKLIST_LINKED:
          case this.FieldTypes.PICKLIST_DEFAULT:
          case this.FieldTypes.PICKLIST_DEFAULT_LINKED:
          case this.FieldTypes.PICKLIST_LATEST:
          case this.FieldTypes.PICKLIST_LRL:
          case this.FieldTypes.UOM:
          case this.FieldTypes.PICKLIST_WITH_FILTER:
          case this.FieldTypes.PICKLIST_FILTER_LINKED:
          case this.FieldTypes.PICKLIST_FILTERED:
          case this.FieldTypes.RADIO:
          case this.FieldTypes.RADIO_LINKED:
            if (typeof value.title !== 'undefined') {
              return value.title;
            } else {
              return value;
            }
            break;
          case this.FieldTypes.IMAGE:
            return '';
            break;
          default:
        }
        return value;
      },
      extractFieldLink: function(fieldData) {
        var value = fieldData.getValue();
        if (value === '') {
          return null;
        }
        var linkPrefix = document.location.protocol + '//' + document.location.host;
        var semantics = fieldData.getFieldSemantics();
        if (semantics === BomUIFieldSemantics.DESCRIPTOR) {
          return ("" + linkPrefix + value.href);
        } else if (semantics === BomUIFieldSemantics.CHANGE_PENDING) {
          return ("" + linkPrefix + value.href);
        }
        switch (fieldData.typeId) {
          case this.FieldTypes.URL:
            if (/^https?:\/\//.test(value)) {
              return value;
            } else {
              return ("http://" + value);
            }
            break;
          case this.FieldTypes.EMAIL:
            return ("mailto:" + value);
            break;
          case this.FieldTypes.PICKLIST:
          case this.FieldTypes.PICKLIST_LINKED:
          case this.FieldTypes.PICKLIST_DEFAULT:
          case this.FieldTypes.PICKLIST_DEFAULT_LINKED:
          case this.FieldTypes.PICKLIST_LATEST:
          case this.FieldTypes.PICKLIST_LRL:
          case this.FieldTypes.UOM:
          case this.FieldTypes.PICKLIST_WITH_FILTER:
          case this.FieldTypes.PICKLIST_FILTER_LINKED:
          case this.FieldTypes.PICKLIST_FILTERED:
          case this.FieldTypes.RADIO:
          case this.FieldTypes.RADIO_LINKED:
            var picklistLink = this.PicklistUtils.buildLink(value);
            if (picklistLink) {
              return ("" + linkPrefix + picklistLink);
            }
            break;
          default:
        }
        return null;
      },
      determineFieldStyles: function(row, fieldData) {
        var keys = [];
        keys.push(BomExcelTableStyleTypes.DATA_CELL_ALIGNMENT);
        if (row.depth % 2 === 0) {
          keys.push(BomExcelTableStyleTypes.DATA_ROW_DEPTH_FILL);
        }
        if (fieldData) {
          switch (fieldData.typeId) {
            case this.FieldTypes.DATE:
              keys.push(BomExcelTableStyleTypes.DATE_FORMAT);
              break;
            default:
          }
        }
        return keys;
      },
      getBomHeaderMergeRule: function(numColumns) {
        var startLocation = new BomExcelTableCellLocation(0, 0);
        var endLocation = new BomExcelTableCellLocation(0, numColumns - 1);
        return new BomExcelTableRegion(startLocation, endLocation);
      },
      getBomTableRegion: function(bomWorksheet) {
        var rows = bomWorksheet.getRows();
        var startLocation = new BomExcelTableCellLocation(0 + NUM_HEADER_ROWS, 0);
        var endLocation = new BomExcelTableCellLocation(rows.length - 1, rows[1].getCells().length - 1);
        return new BomExcelTableRegion(startLocation, endLocation);
      },
      buildBomWorksheet: function(rows, columns, item, configuration) {
        var worksheet = new BomExcelTableWorksheet('Bill of Materials');
        var headerRow = this.buildHeaderRow(item, configuration);
        worksheet.addRow(headerRow);
        var columnHeadersRow = this.buildColumnHeadersRow(columns);
        worksheet.addRow(columnHeadersRow);
        var dataRows = this.buildDataRows(rows, columns);
        worksheet.addRows(dataRows);
        var headerMergeRule = this.getBomHeaderMergeRule(columnHeadersRow.getCells().length);
        worksheet.addMergeRule(headerMergeRule);
        var tableRegion = this.getBomTableRegion(worksheet);
        worksheet.addTableRegion(tableRegion);
        return worksheet;
      },
      buildTableStyles: function() {
        var styles = [];
        var dateStyle = new BomExcelTableStyle(BomExcelTableStyleTypes.DATE_FORMAT, 'format', this.BomExportSettings.getDateFormat());
        styles.push(dateStyle);
        var constantStyles = BomExcelTableStyleTypes.getConstantStyles();
        constantStyles.forEach(function(styleKey) {
          var style = BomExcelTableStyleTypes.getStyle(styleKey);
          var styleObj = new BomExcelTableStyle(styleKey, style.property, style.value);
          styles.push(styleObj);
        });
        return new BomExcelTableStyles(styles);
      },
      fromBomTable: function(bomTable, item, configuration) {
        var excelTable = new BomExcelTable();
        excelTable.setStyles(this.buildTableStyles());
        var bomWorksheet = this.buildBomWorksheet(bomTable.rows, bomTable.columns.slice(2), item, configuration);
        excelTable.addWorksheet(bomWorksheet);
        return excelTable;
      }
    }, {});
  }();
  BomExcelTableAdapter.$inject = ['BomExportSettings', 'FieldTypes', 'BiasService', 'PicklistUtils'];
  var $__default = BomExcelTableAdapter;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/services/bomExport/bomExcelTableAdapter.service.js
;

System.registerModule("com/autodesk/services/bomExport/bomExportSettings.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/services/bomExport/bomExportSettings.service.js";
  var BomExportSettings = function() {
    function BomExportSettings($q, EventService, ModelsManager) {
      this.$q = $q;
      this.EventService = EventService;
      this.ModelsManager = ModelsManager;
      this.settings = {};
      this.API_DATE_FORMAT = 'YYYY-MM-DD';
    }
    return ($traceurRuntime.createClass)(BomExportSettings, {
      loadSettings: function() {
        var $__2 = this;
        var settings = {};
        var userDeferred = this.$q.defer();
        var userListenerId = this.EventService.listen('currentUser:currentUser:done', function(event, UserObj) {
          $__2.EventService.unlisten(userListenerId);
          settings.dateFormat = UserObj.getDateFormat().toUpperCase();
          userDeferred.resolve();
        });
        this.ModelsManager.getCurrentUser();
        var promises = [userDeferred.promise];
        return this.$q.all(promises).then(function() {
          $__2.settings = settings;
          return $__2.$q.when($__2.settings);
        });
      },
      getDateFormat: function() {
        return this.settings.dateFormat;
      },
      getSettings: function() {
        return this.settings;
      }
    }, {});
  }();
  BomExportSettings.$inject = ['$q', 'EventService', 'ModelsManager'];
  var $__default = BomExportSettings;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/services/bomExport/bomExportSettings.service.js
;

System.registerModule("com/autodesk/services/bomExport/bomExporter.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/services/bomExport/bomExporter.service.js";
  var BomExporter = function() {
    function BomExporter(BomExcelTableAdapter, BomExcelBuilderJsTableAdapter, BomExcelBuilderJsDownloader, BomExportSettings) {
      this.BomExcelTableAdapter = BomExcelTableAdapter;
      this.BomExcelBuilderJsTableAdapter = BomExcelBuilderJsTableAdapter;
      this.BomExcelBuilderJsDownloader = BomExcelBuilderJsDownloader;
      this.BomExportSettings = BomExportSettings;
    }
    return ($traceurRuntime.createClass)(BomExporter, {
      buildFilename: function(item, configuration) {
        var title = item.getItemTitle();
        var version = item.getItemVersion();
        var date = configuration.date;
        if (version) {
          return (title + " " + version + " " + date + ".xlsx");
        } else {
          return (title + " " + date + ".xlsx");
        }
      },
      exportBom: function(bomTable, item, configuration) {
        var $__2 = this;
        this.BomExportSettings.loadSettings().then(function() {
          var table = $__2.BomExcelTableAdapter.fromBomTable(bomTable, item, configuration);
          var workbook = $__2.BomExcelBuilderJsTableAdapter.fromBomExcelTable(table);
          $__2.BomExcelBuilderJsDownloader.downloadWorkbook($__2.buildFilename(item, configuration), workbook);
        });
      }
    }, {});
  }();
  BomExporter.$inject = ['BomExcelTableAdapter', 'BomExcelBuilderJsTableAdapter', 'BomExcelBuilderJsDownloader', 'BomExportSettings'];
  var $__default = BomExporter;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/services/bomExport/bomExporter.service.js
