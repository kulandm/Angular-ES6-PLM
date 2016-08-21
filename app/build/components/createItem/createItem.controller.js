System.registerModule("com/autodesk/components/createItem/createItem.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/createItem/createItem.controller.js";
  var CreateItemController = function() {
    function CreateItemController($rootScope, $scope, $log, CreateTypes, EventService, FlyoutService, ModelsManager, SupportedFieldsService, FieldTypes, SECTION_TYPES, ClassificationService, _) {
      var $__2 = this;
      this.$scope = $scope;
      this.$log = $log;
      this.CreateTypes = CreateTypes;
      this.EventService = EventService;
      this.FlyoutService = FlyoutService;
      this.ModelsManager = ModelsManager;
      this.SupportedFieldsService = SupportedFieldsService;
      this.FieldTypes = FieldTypes;
      this.SECTION_TYPES = SECTION_TYPES;
      this.ClassificationService = ClassificationService;
      this._ = _;
      this.contextualCreate = $scope.createType === this.CreateTypes.CONTEXTUAL;
      this.quickCreate = $scope.createType === this.CreateTypes.QUICK;
      this.fullCreate = $scope.createType === this.CreateTypes.FULL;
      this.workspaceId = null;
      this.loading = false;
      this.workspacesList = $scope.workspacesList;
      this.sectionIndex = 0;
      $scope.isContentShown = true;
      this.isSavingData = false;
      $scope.$watch('waiting', function(newValue, oldValue) {
        $__2.isSavingData = newValue;
      });
      $scope.$watch('selectedWorkspace', function(newValue, oldValue) {
        if (newValue && !_.isEqual(newValue, oldValue) && !$__2.loading) {
          $__2.fetchFieldDefinitions();
        }
      });
      if ($scope.selectedWorkspace) {
        this.fetchFieldDefinitions();
      }
      var classificationChangeListenerId = EventService.listen('classification:update', function(event, newClassification) {
        $__2.$scope.classificationId = newClassification.selected.id;
        _.some($__2.$scope.formFields, function(section) {
          if ($__2.isClassificationSection(section)) {
            (function(section) {
              $__2.ClassificationService.getClassificationFields($__2.$scope.workspaceUrn, $__2.$scope.workspaceUrn, newClassification.selected.id, true).then(function(response) {
                section.fields = response.properties;
              });
            })(section);
            return true;
          }
          return false;
        });
      });
      this.$scope.$on('$destroy', function() {
        $__2.EventService.unlisten(classificationChangeListenerId);
      });
    }
    return ($traceurRuntime.createClass)(CreateItemController, {
      fetchFieldDefinitions: function() {
        var $__2 = this;
        this.workspaceId = ($traceurRuntime.typeof(this.$scope.selectedWorkspace) === 'object') ? this.$scope.selectedWorkspace.getId() : this.$scope.selectedWorkspace;
        this.loading = true;
        var workspaceListenerId = this.EventService.listen(("workspaceInstance:" + this.workspaceId + ":done"), function(event, workspaceObj) {
          $__2.EventService.unlisten(workspaceListenerId);
          $__2.$scope.workspaceUrn = workspaceObj.getWorkspaceUrn();
          workspaceObj.getViewDetailsFieldsData($__2.$scope.filter).then(function(workspaceItemSectionList) {
            var processFieldHelper = function(field) {
              field.dataTypeId = $__2.parseTypeId(field.type.link);
              if (angular.isDefined(field.fieldMetadata)) {
                field.fieldMetadata.readOnly = field.fieldMetadata.editability === 'NEVER';
                field.options = field.fieldMetadata.picklistPayload;
                field.mainItemId = undefined;
                field.mainWorkspaceId = $__2.workspaceId;
                field.metadata = field.fieldMetadata;
                field.metadata.dataTypeId = parseInt(field.metadata.type.link.substring(field.metadata.type.link.lastIndexOf('/') + 1));
                field.value = (field.fieldMetadata.defaultValue && !field.fieldMetadata.picklist) ? field.fieldMetadata.defaultValue : '';
              }
              return field;
            };
            $__2.$scope.formFields = workspaceItemSectionList;
            var itemFields = $__2.getFields();
            _.chain(itemFields).filter(function(field) {
              return !field.isClassificationField;
            }).filter(function(field) {
              return (field.type === 'MATRIX');
            }).map(function(matrix) {
              return _.flatten(matrix.definition.fields, true);
            }).flatten(_.map(function(flatMatrix) {
              return flatMatrix;
            })).filter(function(flatMatrixIndex) {
              return flatMatrixIndex !== null;
            }).each(processFieldHelper);
            _.chain(itemFields).filter(function(field) {
              return !field.isClassificationField;
            }).filter(function(field) {
              return (field.type !== 'MATRIX');
            }).each(processFieldHelper);
            $__2.$scope.unsupportedFields.hasUnsupported = _.find($__2.getFields(), function(field) {
              if (field.type !== 'MATRIX') {
                return $__2.SupportedFieldsService.isFieldUnsupported(field.metadata.dataTypeId) || field.editability === 'NEVER';
              }
            });
            $__2.loading = false;
          }, function() {
            $__2.$log.error(("Problem fetching field definitions for workspace " + $__2.workspaceId + "."));
            $__2.loading = false;
          });
        });
        this.ModelsManager.getWorkspace(this.workspaceId);
      },
      onWorkspaceChange: function(workspace) {
        this.$scope.selectedWorkspace = workspace;
      },
      parseTypeId: function(typeLink) {
        if (typeof typeLink === 'string') {
          var lastSlashIndex = typeLink.lastIndexOf('/');
          return typeLink.substring(lastSlashIndex + 1);
        } else {
          return '';
        }
      },
      getFields: function() {
        return _.flatten(_.pluck(this.$scope.formFields, 'fields'));
      },
      parseSectionVisibility: function(listOfSections, section) {
        this.sectionIndex = listOfSections.indexOf(section) + 1;
        if (this.fullCreate || (this.contextualCreate && section.fields.length)) {
          return true;
        } else {
          return false;
        }
      },
      isSectionEditable: function(section) {
        return !section.sectionLocked;
      },
      tooltipFlyout: function(event, displayName, description) {
        var tooltip = this.FlyoutService.open({
          templateUrl: 'partials/workspaceItemTooltip.html',
          scope: this.$scope,
          anchorEl: angular.element(event.target),
          placement: 'left',
          showArrow: true,
          flyoutClass: 'item-tooltip-flyout item-tooltip-quick-create',
          disableDefaultZIndexAllocation: false,
          controller: function($scope, $flyoutInstance) {
            $scope.displayName = displayName;
            $scope.description = description;
            $scope.closeFlyout = function() {
              $flyoutInstance.close();
            };
          }
        });
      },
      getPartUrn: function(section) {
        if (this.isClassificationSection(section)) {
          return this.$scope.workspaceUrn;
        }
        return undefined;
      },
      isClassificationSection: function(section) {
        return (section.type === this.SECTION_TYPES.CLASSIFICATION);
      }
    }, {});
  }();
  var $__default = CreateItemController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/createItem/createItem.controller.js
