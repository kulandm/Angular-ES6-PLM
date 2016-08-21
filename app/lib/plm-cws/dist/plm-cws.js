System.registerModule("com/autodesk/classification.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/classification.js";
  var RESTWrapperService = System.get("com/autodesk/RESTWrapperService.js").default;
  var EventService = System.get("com/autodesk/EventService.js").default;
  var UnderscoreService = System.get("com/autodesk/UnderscoreService.js").default;
  var ClassificationUtil = System.get("com/autodesk/classification.util.js").default;
  var ClassificationService = System.get("com/autodesk/classification.service.js").default;
  var ClassificationSection = System.get("com/autodesk/classificationSection.directive.js").default;
  var FieldSelectorFactory = System.get("com/autodesk/FieldSelectorFactory.js").default;
  angular.module(__moduleName, ['ngMaterial', 'ngAnimate', 'ngAria', 'com/autodesk/RESTWrapperService.js', 'com/autodesk/EventService.js', 'com/autodesk/UnderscoreService.js', 'com/autodesk/FieldSelectorFactory.js']).service('ClassificationUtil', ['CLASSIFICATION_FIELD_TYPES', 'FieldSelectorFactory', 'DATA_SOURCE_TYPES', '$rootScope', function(CLASSIFICATION_FIELD_TYPES, DATA_SOURCE_TYPES, FieldSelectorFactory, $rootScope) {
    return new ClassificationUtil(CLASSIFICATION_FIELD_TYPES, FieldSelectorFactory, DATA_SOURCE_TYPES, $rootScope);
  }]).factory('ClassificationService', ['RESTWrapperService', 'ClassificationUtil', '$q', 'CLASSIFICATION_FIELD_TYPES', 'PAGE_SIZE', 'API_V2_PREFIX', function(RESTWrapperService, ClassificationUtil, $q, CLASSIFICATION_FIELD_TYPES, PAGE_SIZE, API_V2_PREFIX) {
    return new ClassificationService(RESTWrapperService, ClassificationUtil, $q, CLASSIFICATION_FIELD_TYPES, PAGE_SIZE, API_V2_PREFIX);
  }]).constant('SECTION_TYPES', {
    FIELD_CONTAINER: 'FIELDCONTAINER',
    CLASSIFICATION: 'CLASSIFICATION'
  }).constant('CLASSIFICATION_FIELD_TYPES', {
    TEXT: 'text',
    NUMBER: 'number',
    PICKLIST: 'picklist'
  }).constant('DATA_SOURCE_TYPES', {
    cws: 'CWS',
    plm: 'PLM'
  }).constant('PAGE_SIZE', 100).constant('API_V2_PREFIX', 'api/v2/').directive('classificationSection', ClassificationSection.directiveFactory);
  return {};
});
//# sourceURL=com/autodesk/classification.js
;

System.registerModule("com/autodesk/classification.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/classification.service.js";
  var ClassificationService = function() {
    function ClassificationService(RESTWrapperService, ClassificationUtil, $q, CLASSIFICATION_FIELD_TYPES, PAGE_SIZE, API_V2_PREFIX) {
      this.RESTWrapperService = RESTWrapperService;
      this.ClassificationUtil = ClassificationUtil;
      this.$q = $q;
      this.CLASSIFICATION_FIELD_TYPES = CLASSIFICATION_FIELD_TYPES;
      this.PAGE_SIZE = PAGE_SIZE;
      this.API_V2_PREFIX = API_V2_PREFIX;
    }
    return ($traceurRuntime.createClass)(ClassificationService, {
      getPartFromUrn: function(urn, page) {
        var $__2 = this;
        page = (page === undefined) ? 1 : page;
        var deferred = this.$q.defer();
        var that = this;
        that.RESTWrapperService.get(this.API_V2_PREFIX + 'parts?referenceUrn=' + urn + '&page=' + page + '&size=' + this.PAGE_SIZE, null, null, {skipCache: true}).then(function(response) {
          if (response && (response.size === $__2.PAGE_SIZE)) {
            that.getPartFromUrn(urn, page + 1).then(function(parts) {
              deferred.resolve((parts && (parts.length > 0)) ? response.parts.concat(parts) : response.parts);
            }, function(error) {
              deferred.reject(error);
            });
          } else if (response && response.parts) {
            deferred.resolve(response.parts);
          } else {
            deferred.resolve([]);
          }
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },
      getPart: function(link) {
        var deferred = this.$q.defer();
        this.RESTWrapperService.get(this.API_V2_PREFIX + link, null, null, {skipCache: true}).then(function(response) {
          deferred.resolve(response);
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },
      getClassificationParent: function(classificationId) {
        return this.RESTWrapperService.get(this.API_V2_PREFIX + 'classifications/' + classificationId + '/parents', null, null, {skipCache: true});
      },
      getClassification: function(classificationId) {
        return this.RESTWrapperService.get(this.API_V2_PREFIX + 'classifications/' + classificationId, null, null, {skipCache: true});
      },
      getFullPath: function(from, to) {
        var deferred = this.$q.defer();
        var that = this;
        if (from === to) {
          that.getClassification(to).then(function(classification) {
            deferred.resolve([classification]);
          }, function(error) {
            deferred.reject(error);
          });
        } else {
          that.getClassificationParent(to).then(function(parent) {
            parent = (parent.classifications) ? parent.classifications.shift() : null;
            that.getClassification(to).then(function(classification) {
              if (parent) {
                that.getFullPath(from, parent.id).then(function(partialPath) {
                  partialPath.push(classification);
                  deferred.resolve(partialPath);
                }, function(error) {
                  deferred.reject(error);
                });
              } else {
                deferred.resolve([classification]);
              }
            }, function(error) {
              deferred.reject(error);
            });
          }, function(error) {
            deferred.reject(error);
          });
        }
        return deferred.promise;
      },
      getPropertyInstances: function(classificationId, page) {
        var $__2 = this;
        page = (page === undefined) ? 1 : page;
        var deferred = this.$q.defer();
        var url = this.API_V2_PREFIX + 'classifications/' + classificationId + '/property-instances?cascade=true&page=' + page + '&size=' + this.PAGE_SIZE;
        var that = this;
        that.RESTWrapperService.get(url, null, null, {skipCache: true}).then(function(response) {
          if (response) {
            if (response.size === $__2.PAGE_SIZE) {
              that.getPropertyInstances(classificationId, page + 1).then(function(instances) {
                deferred.resolve((instances && (instances.length > 0)) ? response.propertyInstances.concat(instances) : response.propertyInstances);
              }, function(error) {
                deferred.reject(error);
              });
            } else {
              deferred.resolve(response.propertyInstances);
            }
          } else {
            deferred.resolve([]);
          }
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },
      getClassificationFieldsParts: function(workspaceUrn, itemUrn, shownAsClassId) {
        var $__2 = this;
        return this.getUniformedPartsFromUrn(workspaceUrn, itemUrn).then(function(parts) {
          var workspacePart = parts.shift();
          var itemPart = parts.shift();
          var classificationPromises = [];
          var itemUserValues;
          if (workspacePart && workspacePart.classifications) {
            classificationPromises.push($__2.getSchemaOfPart(workspacePart.classifications.link));
          }
          if (itemPart && itemPart.classifications) {
            itemUserValues = itemPart.data;
            if (shownAsClassId !== null) {
              classificationPromises.push($__2.getPartByClassificationId(itemPart.id, shownAsClassId));
            } else {
              classificationPromises.push($__2.getSchemaOfPart(itemPart.classifications.link));
            }
          } else if (shownAsClassId !== null) {
            classificationPromises.push($__2.getReClassificationSchema(shownAsClassId));
          }
          return {
            classificationPromises: classificationPromises,
            itemUserValues: itemUserValues
          };
        });
      },
      createPropertyInstanceBaseOnOther: function(basePropertyInstance, newPropertyInstanceValues) {
        var newInstance = _.extend(basePropertyInstance, newPropertyInstanceValues);
        if (newInstance.readOnly) {
          newInstance.itemDefault = newInstance.defaultValue;
        }
        return newInstance;
      },
      mergeClassificationFieldParts: function(classifications, itemUserValues) {
        var $__2 = this;
        var deferred = this.$q.defer();
        var that = this;
        var workspaceClassification = classifications.shift();
        var itemClassification = (classifications && (classifications.length === 1)) ? classifications.shift() : null;
        var properties = {};
        var propInstancePromise = [];
        var usedClass = itemClassification || workspaceClassification;
        itemUserValues = angular.isDefined(itemUserValues) ? itemUserValues : null;
        propInstancePromise.push(that.getPropertyInstances(usedClass.id));
        _.each(_.keys(usedClass.schema), function(propertyId) {
          properties[propertyId] = {
            workspaceDefault: itemUserValues === null ? workspaceClassification.schema[propertyId] : null,
            itemDefault: itemUserValues !== null && angular.isDefined(itemUserValues[propertyId]) ? itemUserValues[propertyId] : usedClass.schema[propertyId]
          };
        });
        that.$q.all(propInstancePromise).then(function(propertyInstances) {
          propertyInstances = (propertyInstances && propertyInstances.length === 1) ? propertyInstances.shift() : null;
          if (_.isArray(propertyInstances)) {
            _.each(propertyInstances, function(property) {
              properties[property.name] = $__2.createPropertyInstanceBaseOnOther(property, properties[property.name]);
            });
          }
          $__2.getEnumsFromProperties(properties).then(function(expandedProperties) {
            deferred.resolve({
              properties: expandedProperties,
              classificationId: usedClass.id
            });
          });
        });
        return deferred.promise;
      },
      getClassificationFields: function(workspaceUrn, itemUrn, shownAsClassId, isCreate) {
        var $__2 = this;
        var deferred = this.$q.defer();
        var itemUserValues = null;
        var usedClassId = null;
        shownAsClassId = (shownAsClassId > 0) ? shownAsClassId : null;
        isCreate = (isCreate === true) ? true : false;
        workspaceUrn = this.ClassificationUtil.getUniformedParametersFromUrn(workspaceUrn);
        itemUrn = this.ClassificationUtil.getUniformedParametersFromUrn(itemUrn);
        workspaceUrn = this.ClassificationUtil.getUrnBasedOnParams(workspaceUrn, true);
        itemUrn = this.ClassificationUtil.getUrnBasedOnParams(itemUrn, false);
        this.getClassificationFieldsParts(workspaceUrn, itemUrn, shownAsClassId).then(function(partsPromises) {
          $__2.$q.all(partsPromises.classificationPromises).then(function(classifications) {
            $__2.mergeClassificationFieldParts(classifications, partsPromises.itemUserValues).then(function(classificationFields) {
              classificationFields.properties = $__2.ClassificationUtil.decorateFields(classificationFields.properties, isCreate);
              deferred.resolve(classificationFields);
            });
          }, $__2.ClassificationUtil.getRejectDeferredFunction(deferred));
        }, this.ClassificationUtil.getRejectDeferredFunction(deferred));
        return deferred.promise;
      },
      getPartByClassificationId: function(partId, classificationId) {
        var rootPartUrl = this.API_V2_PREFIX + 'parts/' + partId + (classificationId ? ('?classification=' + classificationId) : '');
        var deferred = this.$q.defer();
        var that = this;
        that.RESTWrapperService.get(rootPartUrl, null, null, {skipCache: true}).then(function(part) {
          var response = {
            id: classificationId,
            schema: part.data
          };
          deferred.resolve(response);
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },
      getUniformedPartsFromUrn: function(workspaceUrn, itemUrn) {
        var deferred = this.$q.defer();
        var promises = [];
        promises.push(this.getPartFromUrn(workspaceUrn));
        if (workspaceUrn !== itemUrn) {
          promises.push(this.getPartFromUrn(itemUrn));
        }
        this.$q.all(promises).then(function(parts) {
          var workspacePart = parts.shift();
          var itemPart = (parts && (parts.length === 1)) ? parts.shift() : null;
          workspacePart = (workspacePart && (workspacePart.length === 1)) ? workspacePart.shift() : null;
          itemPart = (itemPart && (itemPart.length === 1)) ? itemPart.shift() : null;
          deferred.resolve([workspacePart, itemPart]);
        });
        return deferred.promise;
      },
      getSchemaOfPart: function(link) {
        var deferred = this.$q.defer();
        var that = this;
        that.getPart(link).then(function(response) {
          var classification = response.classifications;
          classification = (classification && classification.length === 1) ? classification.shift() : null;
          if (classification !== null) {
            classification = {
              id: classification.id,
              schema: classification.effectiveSchema
            };
          }
          deferred.resolve(classification);
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },
      getReClassificationSchema: function(classificationId) {
        var deferred = this.$q.defer();
        var that = this;
        that.getClassification(classificationId).then(function(response) {
          deferred.resolve({
            id: response.id,
            schema: response.effectiveSchema
          });
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },
      buildSchemaObject: function(rawFields) {
        var $__2 = this;
        var schema = {};
        _.each(rawFields, function(field) {
          if (field.type === $__2.CLASSIFICATION_FIELD_TYPES.PICKLIST) {
            var selected = _.isArray(field.options) ? field.options.filter(function(option) {
              return option.selected;
            }).shift() : null;
            schema[field.name] = selected ? selected.value : null;
          } else {
            schema[field.name] = field.internalValue !== null && field.internalValue !== undefined ? field.internalValue : field.valueToShow;
          }
        });
        return schema;
      },
      saveRawFields: function(classificationId, urn, rawFields, dmsId) {
        var $__2 = this;
        var deferred = this.$q.defer();
        this.getClassification(classificationId).then(function(classification) {
          if (classification.ext['abstract'] === true) {
            deferred.reject({phantomRestriction: 'bundle.classifications.section.warning.phantom_class'});
          } else {
            var schema = $__2.buildSchemaObject(rawFields);
            var urnParts = $__2.ClassificationUtil.getUniformedParametersFromUrn(urn);
            if ((urnParts.item === null) && angular.isDefined(dmsId)) {
              urnParts.item = dmsId;
            }
            urn = $__2.ClassificationUtil.getUrnBasedOnParams(urnParts);
            if (urnParts.item === null) {
              $__2.saveOrUpdate(classificationId, schema, {referenceUrn: null}).then(function(response) {
                return deferred.resolve(response);
              }, function(error) {
                return deferred.reject(error);
              });
            } else {
              $__2.getPartFromUrn(urn).then(function(parts) {
                var part = parts.length === 0 ? {referenceUrn: urn} : parts.shift();
                $__2.saveOrUpdate(classificationId, schema, part).then(function(response) {
                  return deferred.resolve(response);
                }, function(error) {
                  return deferred.reject(error);
                });
              }, function(error) {
                return deferred.reject(error);
              });
            }
          }
        }, function(error) {
          return deferred.reject(error);
        });
        return deferred.promise;
      },
      createPart: function(partPayload) {
        var sortedPayload = {
          referenceUrn: partPayload.referenceUrn,
          classifications: partPayload.classifications,
          data: partPayload.data
        };
        return this.RESTWrapperService.post(sortedPayload, this.API_V2_PREFIX + 'parts/');
      },
      updatePart: function(partPayload, partId) {
        var sortedPayload = {
          id: partPayload.id,
          referenceUrn: partPayload.referenceUrn,
          classifications: partPayload.classifications,
          data: partPayload.data
        };
        return this.RESTWrapperService.put(sortedPayload, this.API_V2_PREFIX + 'parts/' + partId);
      },
      saveOrUpdate: function(classificationId, schema, part) {
        var partPayload = {
          referenceUrn: part.referenceUrn,
          data: schema
        };
        partPayload.classifications = [{
          description: 'next PLM ',
          link: 'classifications/' + classificationId
        }];
        if (part && part.id) {
          partPayload.id = part.id;
          partPayload.classifications[0].description += ' updated';
          return this.updatePart(partPayload, part.id);
        } else {
          partPayload.classifications[0].description += ' created';
          return this.createPart(partPayload);
        }
      },
      getAllConstraintEnumerations: function(enumerationsLink) {
        var pageNumber = arguments[1] !== (void 0) ? arguments[1] : 1;
        var pageSize = arguments[2] !== (void 0) ? arguments[2] : this.PAGE_SIZE;
        var $__2 = this;
        var that = this;
        var deferred = that.$q.defer();
        var link = this.API_V2_PREFIX + enumerationsLink;
        that.RESTWrapperService.get(link, null, {
          page: pageNumber,
          size: pageSize,
          sort: 'rank'
        }, {skipCache: true}).then(function(response) {
          if (response && response.size === pageSize) {
            $__2.getAllConstraintEnumerations(enumerationsLink, pageNumber + 1, pageSize).then(function(enumerationsRest) {
              deferred.resolve(response.enumerations.concat(enumerationsRest));
            }, $__2.ClassificationUtil.getRejectDeferredFunction(deferred));
          } else if (response && response.enumerations) {
            deferred.resolve(response.enumerations);
          } else {
            deferred.resolve([]);
          }
        }, that.ClassificationUtil.getRejectDeferredFunction(deferred));
        return deferred.promise;
      },
      getPropertyEnums: function(link) {
        var $__2 = this;
        var that = this;
        var deferred = that.$q.defer();
        that.RESTWrapperService.get(this.API_V2_PREFIX + link, null, null, {skipCache: true}).then(function(property) {
          if (_.isArray(property.properties)) {
            property = property.properties.shift();
            that.RESTWrapperService.get($__2.API_V2_PREFIX + property.constraints.link, null, null, {skipCache: true}).then(function(constraint) {
              constraint = constraint.constraints.shift();
              var enumeration = constraint.enumerations;
              that.getAllConstraintEnumerations(enumeration.link).then(function(enumerations) {
                deferred.resolve(enumerations);
              }, that.ClassificationUtil.getRejectDeferredFunction(deferred));
            }, that.ClassificationUtil.getRejectDeferredFunction(deferred));
          } else {
            deferred.resolve([]);
          }
        }, that.ClassificationUtil.getRejectDeferredFunction(deferred));
        return deferred.promise;
      },
      getEnumsFromProperties: function(arrayProperties) {
        var $__2 = this;
        var that = this;
        var deferred = this.$q.defer();
        var enumPromises = [];
        _.each(arrayProperties, function(property) {
          if (property.type === $__2.CLASSIFICATION_FIELD_TYPES.PICKLIST) {
            enumPromises.push(that.getPropertyEnums(property.properties.link));
          }
        });
        that.$q.all(enumPromises).then(function(enumResponses) {
          _.each(arrayProperties, function(property) {
            if (property.type === $__2.CLASSIFICATION_FIELD_TYPES.PICKLIST) {
              property.options = enumResponses.shift();
            }
          });
          deferred.resolve(arrayProperties);
        });
        return deferred.promise;
      }
    }, {});
  }();
  var $__default = ClassificationService;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/classification.service.js
;

System.registerModule("com/autodesk/classification.util.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/classification.util.js";
  var ClassificationUtil = function() {
    function ClassificationUtil(CLASSIFICATION_FIELD_TYPES, DATA_SOURCE_TYPES, FieldSelectorFactory, $rootScope) {
      this.CLASSIFICATION_FIELD_TYPES = CLASSIFICATION_FIELD_TYPES;
      this.FieldSelectorFactory = FieldSelectorFactory;
      this.DATA_SOURCE_TYPES = DATA_SOURCE_TYPES;
      this.$rootScope = $rootScope;
    }
    return ($traceurRuntime.createClass)(ClassificationUtil, {
      getUniformedParametersFromUrn: function(urn) {
        var parameters = {
          item: null,
          workspace: null,
          tenant: null
        };
        var parts = (urn.replace(/\./g, '/').replace(/:/g, '/')).split('/');
        var decrease = 1;
        if (urn.indexOf('item') > -1) {
          parameters.item = parts[parts.length - decrease];
          decrease++;
        }
        if (urn.indexOf('workspace') > -1) {
          parameters.workspace = parts[parts.length - decrease];
          decrease++;
        }
        if (urn.indexOf('tenant') > -1) {
          parameters.tenant = parts[parts.length - decrease];
        }
        return parameters;
      },
      getUrnBasedOnParams: function(params, excludeItem) {
        excludeItem = (excludeItem === true) ? true : false;
        var baseUrn = 'urn:adsk.plm:';
        var baseUrnValues = '';
        if (params.tenant !== null) {
          baseUrn += 'tenant';
          baseUrnValues = params.tenant;
        }
        if (params.workspace !== null) {
          baseUrn += '.workspace';
          baseUrnValues += '/' + params.workspace;
        }
        if (!excludeItem && (params.item !== null)) {
          baseUrn += '.item';
          baseUrnValues += '/' + params.item;
        }
        return baseUrn + ':' + baseUrnValues;
      },
      errorMessageHandler: function(errors) {
        var line = '';
        var output = [];
        var keyWord = ['Entity', 'Field', 'Value'];
        var i;
        if (errors.data && errors.data.errors) {
          _.each(errors.data.errors, function(oneError) {
            line = oneError.message;
            if (oneError.params) {
              line += ' : ';
              i = 0;
              _.each(oneError.params, function(param) {
                line += keyWord[i] + ' ' + param + ' ';
                i++;
              });
            }
            output.push(line);
          });
        }
        return output;
      },
      getRejectDeferredFunction: function(deferred) {
        return function(error) {
          deffered.reject(error);
        };
      },
      decorateFields: function(fields, isCreate) {
        var $__2 = this;
        var fieldsParsed = [];
        var newField;
        var fillValueToShow = function(field) {
          field.valueToShow = null;
          if (field.itemDefault === null) {
            field.valueToShow = (field.workspaceDefault === null) ? '' : field.workspaceDefault;
          } else if (field.itemDefault === '') {
            field.valueToShow = '';
          } else {
            field.valueToShow = field.itemDefault;
          }
        };
        var setPicklistValueToShow = function(field) {
          if (typeof field.valueToShow === 'string') {
            field.valueToShow = {
              displayValue: field.valueToShow,
              value: field.valueToShow
            };
          } else {
            if (field.valueToShow.displayValue === null) {
              field.valueToShow.displayValue = field.valueToShow.value;
            }
          }
          var isDeleted = !_.some(field.options, function(option) {
            option.selected = option.value === field.valueToShow.value;
            return option.selected;
          });
          if (isDeleted) {
            if (angular.isDefined(field.valueToShow.value) && field.valueToShow.value) {
              field.valueToShow.deleted = true;
              field.valueToShow.selected = true;
              field.options.push(field.valueToShow);
            }
          }
          if (!field.required && !field.readOnly) {
            field.options = ([{
              value: undefined,
              displayValue: $__2.$rootScope.bundle.classifications.fields.picklist.placeholder,
              selected: false
            }]).concat(field.options);
          }
        };
        _.each(fields, function(field) {
          fillValueToShow(field);
          if (field.type === $__2.CLASSIFICATION_FIELD_TYPES.PICKLIST) {
            setPicklistValueToShow(field);
          }
          newField = new $__2.FieldSelectorFactory(field, $__2.DATA_SOURCE_TYPES.cws);
          if (isCreate) {
            newField.isClassificationField = true;
            newField.dataTypeId = newField.metadata.dataTypeId;
            newField.urn = Math.floor(Math.random() * 1000);
            newField.name = field.displayName;
          }
          fieldsParsed.push(newField);
        });
        return fieldsParsed;
      }
    }, {});
  }();
  var $__default = ClassificationUtil;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/classification.util.js
;

System.registerModule("com/autodesk/classificationSection.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/classificationSection.directive.js";
  var LOG = new WeakMap();
  var UNDERSCORE = new WeakMap();
  var CLASSIFICATION_SERVICE = new WeakMap();
  var Q = new WeakMap();
  var MODAL = new WeakMap();
  var EVENT_SERVICE = new WeakMap();
  var CLASSIFICATION_UTIL = new WeakMap();
  var ClassificationSection = function() {
    function ClassificationSection(ClassificationService, $q, $log, _, $mdDialog, EventService, ClassificationUtil) {
      this.replace = true;
      this.restrict = 'E';
      this.scope = {
        partUrn: '=',
        isEdition: '=',
        headerText: '='
      };
      this.templateUrl = 'classificationSection.html';
      this.transclude = false;
      CLASSIFICATION_SERVICE.set(this, ClassificationService);
      LOG.set(this, $log);
      UNDERSCORE.set(this, _);
      Q.set(this, $q);
      MODAL.set(this, $mdDialog);
      EVENT_SERVICE.set(this, EventService);
      CLASSIFICATION_UTIL.set(this, ClassificationUtil);
    }
    return ($traceurRuntime.createClass)(ClassificationSection, {link: function(scope, element, attrs) {
        var $__2 = this;
        var ClassificationService = CLASSIFICATION_SERVICE.get(ClassificationSection.instance);
        var $q = Q.get(ClassificationSection.instance);
        var _ = UNDERSCORE.get(ClassificationSection.instance);
        var $mdDialog = MODAL.get(ClassificationSection.instance);
        var EventService = EVENT_SERVICE.get(ClassificationSection.instance);
        var ClassificationUtil = CLASSIFICATION_UTIL.get(ClassificationSection.instance);
        scope.classificationName = null;
        scope.classificationFullPath = '';
        var classificationConfig = {
          classificationId: null,
          initialClassificationNode: null,
          selectedClassification: null,
          workspaceClassificationId: null
        };
        scope.isPhantomClass = false;
        var getSchemaFromUrn = function(urn) {
          var deferred = $q.defer();
          var partsSchema = {};
          ClassificationService.getPartFromUrn(urn).then(function(response) {
            _.each(response, function(part) {
              partsSchema = _.extend(partsSchema, part.data);
            });
            deferred.resolve(partsSchema);
          }, function(error) {
            deferred.reject(error);
          });
          return deferred.promise;
        };
        var getClassificationFromUrn = function(urn) {
          var deferred = $q.defer();
          ClassificationService.getPartFromUrn(urn).then(function(response) {
            if (angular.isDefined(response) && (response.length > 0) && angular.isDefined(response[0].classifications.link)) {
              ClassificationService.getPart(response[0].classifications.link).then(function(partResponse) {
                deferred.resolve((partResponse) ? partResponse.classifications[0] : null);
              }, function(error) {
                deferred.reject(error);
              });
            } else {
              deferred.resolve(null);
            }
          }, function(error) {
            deferred.reject(error);
          });
          return deferred.promise;
        };
        var retrieveSchema = function(partUrn) {
          var deferred = $q.defer();
          var parameters = ClassificationUtil.getUniformedParametersFromUrn(partUrn);
          var schemas = {
            item: null,
            workspace: null
          };
          var classifications = {
            item: null,
            workspace: null
          };
          if (partUrn.indexOf('item') > -1) {
            schemas.item = getSchemaFromUrn('urn:adsk.plm:tenant.workspace.item:' + parameters.tenant + '/' + parameters.workspace + '/' + parameters.item);
            classifications.item = getClassificationFromUrn('urn:adsk.plm:tenant.workspace.item:' + parameters.tenant + '/' + parameters.workspace + '/' + parameters.item);
          }
          if (partUrn.indexOf('workspace') > -1) {
            schemas.workspace = getSchemaFromUrn('urn:adsk.plm:tenant.workspace:' + parameters.tenant + '/' + parameters.workspace);
            classifications.workspace = getClassificationFromUrn('urn:adsk.plm:tenant.workspace:' + parameters.tenant + '/' + parameters.workspace);
          } else if (partUrn.indexOf('tenant') > -1) {
            console.error('No tenant provided');
            deferred.reject(null);
          }
          $q.all([schemas.item, schemas.workspace, classifications.item, classifications.workspace]).then(function(response) {
            deferred.resolve({
              schemas: {
                item: (response[0]) ? response[0] : null,
                workspace: (response[1]) ? response[1] : null
              },
              classifications: {
                item: (response[2]) ? response[2] : null,
                workspace: (response[3]) ? response[3] : null
              }
            });
          });
          return deferred.promise;
        };
        var classificationFullPath = function(from, to) {
          var deferred = $q.defer();
          var result = '';
          ClassificationService.getFullPath(from, to).then(function(arrayPath) {
            deferred.resolve(_.map(arrayPath, _.iteratee('displayName')).join('/'));
          }, function(error) {
            deferred.reject(error);
          });
          return deferred.promise;
        };
        var init = function() {
          retrieveSchema(scope.partUrn).then(function(schemas) {
            scope.classificationFullPath = schemas.classifications.workspace.displayName;
            classificationConfig.classificationId = (schemas.classifications.item && schemas.classifications.item.id) || schemas.classifications.workspace.id;
            classificationConfig.selectedClassification = schemas.classifications.workspace.id;
            if (schemas.classifications.item) {
              classificationConfig.initialClassificationNode = schemas.classifications.item;
              classificationFullPath(schemas.classifications.workspace.id, schemas.classifications.item.id).then(function(fullPath) {
                scope.classificationFullPath = fullPath + '/';
              }, function(error) {
                scope.classificationFullPath = '';
              });
            } else {
              classificationConfig.initialClassificationNode = schemas.classifications.workspace;
              scope.classificationFullPath = scope.classificationFullPath;
            }
            scope.classificationName = classificationConfig.initialClassificationNode.displayName;
            scope.isPhantomClass = classificationConfig.initialClassificationNode.ext['abstract'] || false;
          });
        };
        scope.isEditionMode = function() {
          return (scope.isEdition) ? true : false;
        };
        scope.verifyForChangedClassification = function() {
          if (!scope.isEditionMode() && classificationConfig.selectedClassification) {
            classificationConfig.selectedClassification = classificationConfig.initialClassificationNode;
            scope.classificationName = classificationConfig.initialClassificationNode.displayName;
            updateClassificationFullPath();
            classificationConfig.classificationId = classificationConfig.selectedClassification.id;
          }
        };
        var updateClassificationFullPath = function() {
          if (classificationConfig.selectedClassification && classificationConfig.selectedClassification) {
            scope.classificationFullPath = classificationConfig.selectedClassification.displayName + '/';
            classificationFullPath(classificationConfig.initialClassificationNode.id, classificationConfig.selectedClassification.id).then(function(fullPath) {
              scope.classificationFullPath = fullPath + '/';
            });
          }
        };
        var reClassify = function(node) {
          scope.classificationName = node.label;
          scope.isPhantomClass = node.data.ext['abstract'] || false;
        };
        scope.openCwsModal = function() {
          var that = $__2;
          var listener = function(data) {
            if (data.detail === null) {
              $mdDialog.hide();
            } else {
              classificationConfig.selectedClassification = data.detail;
              classificationConfig.classificationId = data.detail.data.id;
              updateClassificationFullPath();
              reClassify(data.detail);
              $mdDialog.hide();
              EventService.send('classification:update', [{selected: data.detail}]);
            }
          };
          $mdDialog.show({
            clickOutsideToClose: true,
            escapeToClose: true,
            templateUrl: 'cwsIframeTemplate.html',
            controller: function($scope, $mdDialog) {
              var params = ClassificationUtil.getUniformedParametersFromUrn(scope.partUrn);
              var urn = encodeURIComponent('urn:adsk.plm:tenant.workspace:' + params.tenant + '\\' + params.workspace + '/selectedURN/' + classificationConfig.classificationId);
              $scope.customerUrn = '/cws-admin/index.html#/reClassify/rootURN/' + urn;
              window.addEventListener('TREE_VIEW_OK', listener);
            },
            onComplete: function() {}
          }).finally(function() {
            window.removeEventListener('TREE_VIEW_OK', listener, false);
          });
        };
        if (angular.isDefined(scope.partUrn) && scope.partUrn !== undefined) {
          init();
        }
      }}, {directiveFactory: function(ClassificationService, $q, $log, _, $mdDialog, EventService, ClassificationUtil) {
        ClassificationSection.instance = new ClassificationSection(ClassificationService, $q, $log, _, $mdDialog, EventService, ClassificationUtil);
        return ClassificationSection.instance;
      }});
  }();
  ClassificationSection.directiveFactory.$inject = ['ClassificationService', '$q', '$log', '_', '$mdDialog', 'EventService', 'ClassificationUtil'];
  var $__default = ClassificationSection;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/classificationSection.directive.js
;

System.get("com/autodesk/classification.js");angular.module("com/autodesk/classification.js").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('classificationSection.html',
    "<span class=\"classificationSection\">{{headerText}} <span ng-if=\"!isEditionMode()\" class=\"classification-section\" title=\"{{classificationFullPath}}\" ng-init=\"verifyForChangedClassification()\">({{classificationName}})</span> <span ng-if=\"isEditionMode()\" class=\"classification-section\" title=\"{{classificationFullPath}}\"><a class=\"cwsTreeIframe\" href=\"#\" title=\"{{classificationFullPath}}\" ng-click=\"openCwsModal()\">{{classificationName}}</a></span> <i class=\"md-warning\" ng-show=\"isPhantomClass\" title=\"{{$root.bundle.classifications.section.warning.phantom_class}}\"></i></span>"
  );


  $templateCache.put('cwsIframeTemplate.html',
    "<md-dialog aria-label=\"Classification tree view\"><md-dialog-content><iframe style=\"width:800px;height:600px\" ng-src=\"{{customerUrn}}\"></iframe></md-dialog-content></md-dialog>"
  );
}]);