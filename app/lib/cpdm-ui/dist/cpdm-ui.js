System.registerModule("com/autodesk/components/classicAttachmentsActionButton/classicAttachmentsActionButton.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/classicAttachmentsActionButton/classicAttachmentsActionButton.controller.js";
  var ClassicAttachmentsActionButtonController = function() {
    function ClassicAttachmentsActionButtonController($rootScope, $scope, $mdDialog, fileSizeFilterFilter, cpdmAttachmentsService) {
      this.$rootScope = $rootScope;
      this.$mdDialog = $mdDialog;
      this.fileSizeFilter = fileSizeFilterFilter;
      this.cpdmAttachmentsService = cpdmAttachmentsService;
      this.selectedFiles = [];
    }
    return ($traceurRuntime.createClass)(ClassicAttachmentsActionButtonController, {
      getDefaultTitle: function(fileName) {
        return fileName.lastIndexOf('.') !== -1 ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
      },
      createFileObj: function(file) {
        return {
          name: file.name,
          size: this.fileSizeFilter(file.size),
          ext: file.name.match(/\.(.+)/)[1],
          type: file.type,
          lastModified: file.lastModifiedDate,
          folder: '',
          title: this.getDefaultTitle(file.name),
          description: '',
          original: file
        };
      },
      triggerDialog: function(selectedFileList, isFromCheckIn) {
        var $__2 = this;
        var getDefaultTitle = isFromCheckIn ? this.fileInfo.fileTitle : this.getDefaultTitle;
        if (selectedFileList.length > 0) {
          this.selectedFiles = _.map(selectedFileList, function(file) {
            return $__2.createFileObj(file);
          });
          this.$mdDialog.show({
            templateUrl: 'components/classicAttachmentsDialog/classicAttachmentsDialog.html',
            controller: 'ClassicAttachmentsDialogController',
            controllerAs: 'ClassicAttachmentsDialogCtrl',
            locals: {
              workspaceId: this.workspaceId,
              itemId: this.itemId,
              selectedFileList: this.selectedFiles,
              createFileObj: this.createFileObj,
              getDefaultTitle: getDefaultTitle,
              isFromCheckIn: isFromCheckIn,
              fileInfo: this.fileInfo
            }
          }).then(function(status) {
            $__2.actionStatus({responseList: status});
            $__2.$rootScope.$broadcast(("attachment:" + $__2.itemId + ":refresh"));
          });
        }
      },
      triggerDownload: function() {
        var $__2 = this;
        this.cpdmAttachmentsService.downloadAttachment(this.fileInfo.fileId, this.workspaceId, this.itemId).then(function(content) {
          var downloadElement = document.createElement('a');
          document.getElementsByTagName('body')[0].appendChild(downloadElement);
          downloadElement.id = 'downloadLink';
          downloadElement.href = window.URL.createObjectURL(content);
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(content, $__2.fileInfo.fileName);
          } else {
            downloadElement.download = $__2.fileInfo.fileName;
            downloadElement.click();
          }
        });
      },
      triggerUndo: function() {
        var $__2 = this;
        this.cpdmAttachmentsService.undoCheckOut(this.fileInfo.fileId, this.workspaceId, this.itemId).then(function() {
          $__2.$rootScope.$broadcast(("attachment:" + $__2.itemId + ":refresh"));
          $__2.actionStatus({responseList: [{
              type: 'success',
              message: ("" + $__2.fileInfo.fileName + $__2.$rootScope.bundle.notification.undo.success)
            }]});
        }, function(error) {
          $__2.actionStatus({responseList: [{
              type: 'error',
              message: ("" + $__2.fileInfo.fileName + $__2.$rootScope.bundle.notification.failed)
            }]});
        });
      },
      triggerCheckout: function() {
        var $__2 = this;
        this.triggerDownload(this.fileInfo.fileId, this.fileInfo.fileName);
        this.cpdmAttachmentsService.checkOutAttachment(this.fileInfo.fileId, this.workspaceId, this.itemId).then(function() {
          $__2.$rootScope.$broadcast(("attachment:" + $__2.itemId + ":refresh"));
          $__2.actionStatus({responseList: [{
              type: 'success',
              message: ("" + $__2.fileInfo.fileName + $__2.$rootScope.bundle.notification.checkedOut.success)
            }]});
        }, function(error) {
          var errorMessage = error.data.error[0].message;
          var fileName = error.data.error[0].fieldId;
          var updatedErrorMessage = errorMessage.replace('{0}', fileName);
          $__2.$rootScope.$broadcast(("attachment:" + $__2.itemId + ":refresh"));
          $__2.actionStatus({responseList: [{
              type: 'error',
              message: ("" + $__2.fileInfo.fileName + $__2.$rootScope.bundle.notification.failed + ": " + updatedErrorMessage)
            }]});
        });
      }
    }, {});
  }();
  var $__default = ClassicAttachmentsActionButtonController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/classicAttachmentsActionButton/classicAttachmentsActionButton.controller.js
;

System.registerModule("com/autodesk/components/classicAttachmentsActionButton/classicAttachmentsActionButton.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/classicAttachmentsActionButton/classicAttachmentsActionButton.directive.js";
  var ClassicAttachmentsActionButtonDirective = function() {
    function ClassicAttachmentsActionButtonDirective() {
      this.restrict = 'E';
      this.replace = true;
      this.bindToController = true;
      this.controller = 'ClassicAttachmentsActionButtonController';
      this.controllerAs = 'classicAttachmentsActionButtonCtrl';
      this.templateUrl = 'components/classicAttachmentsActionButton/classicAttachmentsActionButton.html';
      this.scope = {
        type: '@',
        permitted: '=',
        workspaceId: '=',
        itemId: '=',
        itemUrn: '=',
        fileInfo: '=',
        actionStatus: '&'
      };
    }
    return ($traceurRuntime.createClass)(ClassicAttachmentsActionButtonDirective, {}, {directiveFactory: function() {
        ClassicAttachmentsActionButtonDirective.instance = new ClassicAttachmentsActionButtonDirective();
        return ClassicAttachmentsActionButtonDirective.instance;
      }});
  }();
  var $__default = ClassicAttachmentsActionButtonDirective;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/classicAttachmentsActionButton/classicAttachmentsActionButton.directive.js
;

System.registerModule("com/autodesk/components/classicAttachmentsActionButton/classicAttachmentsActionButton.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/classicAttachmentsActionButton/classicAttachmentsActionButton.js";
  var ClassicAttachmentsActionButtonController = System.get("com/autodesk/components/classicAttachmentsActionButton/classicAttachmentsActionButton.controller.js").default;
  var ClassicAttachmentsActionButtonDirective = System.get("com/autodesk/components/classicAttachmentsActionButton/classicAttachmentsActionButton.directive.js").default;
  var OnFilesSelectedDirective = System.get("com/autodesk/components/classicAttachmentsActionButton/onFilesSelected.directive.js").default;
  angular.module(__moduleName, []).controller('ClassicAttachmentsActionButtonController', ClassicAttachmentsActionButtonController).directive('classicAttachmentsActionButton', [ClassicAttachmentsActionButtonDirective.directiveFactory]).directive('onFilesSelected', [OnFilesSelectedDirective.directiveFactory]);
  return {};
});
//# sourceURL=com/autodesk/components/classicAttachmentsActionButton/classicAttachmentsActionButton.js
;

System.registerModule("com/autodesk/components/classicAttachmentsActionButton/onFilesSelected.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/classicAttachmentsActionButton/onFilesSelected.directive.js";
  var OnFilesSelectedDirective = function() {
    function OnFilesSelectedDirective() {
      this.restrict = 'A';
      this.scope = {onFilesSelected: '&'};
    }
    return ($traceurRuntime.createClass)(OnFilesSelectedDirective, {link: function(scope, element) {
        element.bind('change', function() {
          scope.onFilesSelected({selectedFileList: element[0].files});
          element[0].value = '';
        });
      }}, {directiveFactory: function() {
        OnFilesSelectedDirective.instance = new OnFilesSelectedDirective();
        return OnFilesSelectedDirective.instance;
      }});
  }();
  var $__default = OnFilesSelectedDirective;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/classicAttachmentsActionButton/onFilesSelected.directive.js
;

System.registerModule("com/autodesk/components/classicAttachmentsDialog/classicAttachmentsDialog.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/classicAttachmentsDialog/classicAttachmentsDialog.controller.js";
  var ClassicAttachmentsDialogController = function() {
    function ClassicAttachmentsDialogController($rootScope, $mdDialog, $interval, $q, cpdmAttachmentsService, workspaceId, itemId, selectedFileList, getDefaultTitle, isFromCheckIn, fileInfo) {
      var $__2 = this;
      this.$rootScope = $rootScope;
      this.$mdDialog = $mdDialog;
      this.$interval = $interval;
      this.$q = $q;
      this.cpdmAttachmentsService = cpdmAttachmentsService;
      this.workspaceId = workspaceId;
      this.itemId = itemId;
      this.isFromCheckIn = isFromCheckIn;
      this.getDefaultTitle = getDefaultTitle;
      this.fileInfo = fileInfo;
      this.isContentShown = true;
      this.isUploading = false;
      this.hasDuplicatedTitle = false;
      this.errorMessages = [];
      this.folderType = 'Directly Attached';
      this.attachmentTitles = cpdmAttachmentsService.getAttachmentsTitleList();
      this.selectedFiles = _.filter(selectedFileList, function(file) {
        return $__2.isWithinFileSizeLimit(file.original.size);
      });
      _.each(selectedFileList, function(file) {
        $__2.setFileSizeError(file.title, file.original.size);
      });
      if (!isFromCheckIn) {
        this.checkDuplicatedTitles();
      }
    }
    return ($traceurRuntime.createClass)(ClassicAttachmentsDialogController, {
      isWithinFileSizeLimit: function(fileSize) {
        return fileSize > 0 && fileSize <= 512 * 1024 * 1024;
      },
      setFileSizeError: function(fileTitle, fileSize) {
        if (!this.isWithinFileSizeLimit(fileSize)) {
          this.errorMessages.push({message: (fileTitle + " is not within the file size limit.")});
        }
      },
      checkDuplicatedTitles: function() {
        var titles = this.attachmentTitles.concat(_.pluck(this.selectedFiles, 'title'));
        this.hasDuplicatedTitle = _.uniq(titles).length !== titles.length;
      },
      removeFile: function(file) {
        this.selectedFiles = _.reject(this.selectedFiles, function(selectedFile) {
          return selectedFile === file;
        });
        this.checkDuplicatedTitles();
      },
      triggerUpload: function() {
        var $__2 = this;
        this.isUploading = true;
        var promises = _.map(this.selectedFiles, function(file) {
          file.uploadStatus = 0;
          $__2.$interval(function() {
            var increment;
            if (file.uploadStatus >= 0 && file.uploadStatus < 25) {
              increment = Math.floor(Math.random() * 3);
            } else if (file.uploadStatus >= 25 && file.uploadStatus < 90) {
              increment = Math.floor(Math.random() * 2);
            } else if (file.uploadStatus >= 90 && file.uploadStatus < 95) {
              increment = Math.round(Math.random());
            } else {
              increment = 0;
            }
            file.uploadStatus += increment;
          }, 100, 0, true);
          var fileMeta = {
            deleted: false,
            fileName: file.name,
            resourceName: $__2.isFromCheckIn ? $__2.getDefaultTitle : (file.title || $__2.getDefaultTitle(file.name)),
            description: file.description,
            fileVersion: $__2.fileInfo && $__2.fileInfo.fileVersion,
            folderId: $__2.isFromCheckIn ? ($__2.fileInfo.folderId) : null,
            folderName: $__2.isFromCheckIn ? ($__2.fileInfo.folderName) : null
          };
          if (!$__2.isFromCheckIn) {
            return $__2.cpdmAttachmentsService.uploadAttachment($__2.workspaceId, $__2.itemId, fileMeta, file.original).then(function(response) {
              file.uploadStatus = 100;
              return {
                type: 'success',
                message: ("" + fileMeta.resourceName + $__2.$rootScope.bundle.notification.upload.success)
              };
            }, function(error) {
              return {
                type: 'error',
                message: ("" + fileMeta.resourceName + $__2.$rootScope.bundle.notification.failed + ": " + error.data.error[0].message)
              };
            });
          } else {
            return $__2.cpdmAttachmentsService.checkInAttachment($__2.workspaceId, $__2.itemId, fileMeta, file.original, $__2.fileInfo.fileId).then(function(response) {
              file.uploadStatus = 100;
              return {
                type: 'success',
                message: ("" + fileMeta.resourceName + $__2.$rootScope.bundle.notification.checkedIn.success)
              };
            }, function(error) {
              return {
                type: 'error',
                message: ("" + fileMeta.resourceName + $__2.$rootScope.bundle.notification.failed + ": " + error.data.error[0].message)
              };
            });
          }
        });
        this.$q.all(promises).then(function(status) {
          $__2.isUploading = false;
          $__2.$mdDialog.hide(status);
        }, function(status) {
          $__2.isUploading = false;
          $__2.$mdDialog.hide(status);
        });
      },
      closeDialog: function() {
        this.$mdDialog.hide();
      }
    }, {});
  }();
  var $__default = ClassicAttachmentsDialogController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/classicAttachmentsDialog/classicAttachmentsDialog.controller.js
;

System.registerModule("com/autodesk/components/classicAttachmentsDialog/classicAttachmentsDialog.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/classicAttachmentsDialog/classicAttachmentsDialog.js";
  var ClassicAttachmentsDialogController = System.get("com/autodesk/components/classicAttachmentsDialog/classicAttachmentsDialog.controller.js").default;
  angular.module(__moduleName, []).controller('ClassicAttachmentsDialogController', ClassicAttachmentsDialogController);
  return {};
});
//# sourceURL=com/autodesk/components/classicAttachmentsDialog/classicAttachmentsDialog.js
;

System.registerModule("com/autodesk/components/classicAttachmentsGrid/classicAttachmentsGrid.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/classicAttachmentsGrid/classicAttachmentsGrid.controller.js";
  var ClassicAttachmentsGridController = function() {
    function ClassicAttachmentsGridController($scope, $rootScope, cpdmAttachmentsService, LocalizationService) {
      $scope.gridOptions = {
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        enableSorting: false,
        multiSelect: false,
        noUnselect: false,
        showTreeExpandNoChildren: false,
        showTreeRowHeader: false
      };
      $scope.gridOptions.onRegisterApi = function(gridApi, core) {
        $scope.gridApi = gridApi;
        $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row) {
          if (row.entity.isCollapsed || row.entity.isExpandable) {
            row.isSelected = false;
          } else {
            $scope.selectedRowInfo({
              fileInfo: {
                fileId: row.entity.fileID,
                fileName: row.entity.fileName,
                fileStatus: row.entity.status,
                fileTitle: row.entity.resourceName,
                fileVersion: row.entity.fileVersion,
                fileCheckoutOutBy: row.entity.checkOutUserID,
                folderId: row.entity.folderId,
                folderName: row.entity.folderName
              },
              isRowSelected: row.isSelected
            });
          }
        });
        $scope.gridApi.core.on.rowsRendered($scope, function() {
          $scope.selectedRowInfo({isRowSelected: false});
        });
      };
      $scope.$watchGroup(['workspaceId', 'itemId'], function(value) {
        if (value[0] && value[1]) {
          getAttachments(value[0], value[1]);
          $rootScope.$on('attachment:' + $scope.itemId + ':refresh', function() {
            getAttachments($scope.workspaceId, $scope.itemId);
          });
        }
      });
      $scope.toggleExpansion = function(row, grid) {
        if (row.entity.isCollapsed) {
          grid.api.treeBase.expandRow(row);
          row.entity.isCollapsed = false;
        } else {
          grid.api.treeBase.collapseRow(row);
          row.entity.isCollapsed = true;
        }
      };
      var getAttachments = function(workspaceId, itemId) {
        return cpdmAttachmentsService.getAttachments(workspaceId, itemId).then(function(attachmentList) {
          var attachmentsByFolder = _.groupBy(attachmentList, function(item) {
            return item.file.folderName || '0';
          });
          var attachments = [];
          var rowCounter = 0;
          _.each(attachmentsByFolder, function(folderItems, folderName) {
            if (folderName !== '0') {
              attachments.push({
                folderName: folderName,
                $$treeLevel: 0,
                isExpandable: true,
                isCollapsed: true
              });
            }
            _.each(folderItems, function(item) {
              item = item.file;
              item.rowId = ++rowCounter;
              item.status = item.fileStatus.status.trim();
              item.description = item.description;
              var fileName = item.fileName;
              var extension = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
              item.fileType = fileName === extension ? '' : extension;
              item.icon = item.fileType;
              var isCheckedOut = item.fileStatus.status.trim() === 'Checked OUT';
              item.displayName = {
                userId: isCheckedOut ? item.checkOutUserID : item.createdUserID,
                displayName: isCheckedOut ? item.checkOutDisplayName : item.createdDisplayName
              };
              item.timeStamp = isCheckedOut ? item.checkOutTimeStamp : item.timeStamp;
              if (folderName === '0') {
                item.$$treeLevel = 0;
                item.isExpandable = false;
              } else {
                item.$$treeLevel = 1;
              }
              attachments.push(item);
            });
          });
          $scope.gridOptions.data = attachments;
          cpdmAttachmentsService.setAttachmentsTitleList(attachments);
        });
      };
      $scope.triggerUserProfileFlyout = function(event, userId) {
        if ($scope.showUserInfo) {
          $scope.showUserInfo({
            event: event,
            userId: userId
          });
        }
      };
      LocalizationService.init().then(function() {
        $scope.gridOptions.columnDefs = [{
          field: 'rowId',
          displayName: '#',
          width: '75'
        }, {
          field: 'icon',
          displayName: $rootScope.bundle.attachmentsGrid.title,
          cellTemplate: 'iconTemplate'
        }, {
          field: 'fileName',
          displayName: $rootScope.bundle.attachmentsGrid.name
        }, {
          field: 'status',
          displayName: $rootScope.bundle.attachmentsGrid.status,
          cellTemplate: 'statusTemplate'
        }, {
          field: 'fileVersion',
          displayName: $rootScope.bundle.attachmentsGrid.version
        }, {
          field: 'fileType',
          displayName: $rootScope.bundle.attachmentsGrid.type
        }, {
          field: 'fileSize',
          displayName: $rootScope.bundle.attachmentsGrid.size,
          cellFilter: 'fileSizeFilter'
        }, {
          field: 'timeStamp',
          displayName: $rootScope.bundle.attachmentsGrid.lastActivity,
          cellFilter: 'date: "medium"'
        }, {
          field: 'displayName',
          displayName: $rootScope.bundle.attachmentsGrid.performedBy,
          cellTemplate: 'userLinkTemplate'
        }, {
          field: 'description',
          displayName: $rootScope.bundle.attachmentsGrid.description
        }];
      });
    }
    return ($traceurRuntime.createClass)(ClassicAttachmentsGridController, {}, {});
  }();
  var $__default = ClassicAttachmentsGridController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/classicAttachmentsGrid/classicAttachmentsGrid.controller.js
;

System.registerModule("com/autodesk/components/classicAttachmentsGrid/classicAttachmentsGrid.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/classicAttachmentsGrid/classicAttachmentsGrid.directive.js";
  var ClassicAttachmentsGridDirective = function() {
    function ClassicAttachmentsGridDirective($timeout) {
      this.$timeout = $timeout;
      this.restrict = 'E';
      this.replace = false;
      this.controller = 'ClassicAttachmentsGridController';
      this.templateUrl = 'components/classicAttachmentsGrid/classicAttachmentsGrid.html';
      this.scope = {
        workspaceId: '=',
        itemId: '=',
        dateFormat: '=',
        showUserInfo: '&',
        selectedRowInfo: '&'
      };
      ClassicAttachmentsGridDirective.$timeout = $timeout;
    }
    return ($traceurRuntime.createClass)(ClassicAttachmentsGridDirective, {link: function(scope, element) {
        angular.element(window).bind('resize', function(event) {
          setHeight(element);
        });
        function setHeight(curElement) {
          ClassicAttachmentsGridDirective.$timeout(function() {
            var visibleHeight = window.innerHeight;
            var tableContainer = curElement[0].getElementsByClassName('ui-grid-header-canvas');
            var newHeight = parseInt(visibleHeight - tableContainer[0].getBoundingClientRect().top);
            var uiGrid = angular.element(curElement[0].getElementsByClassName('ui-grid'));
            uiGrid.css('height', newHeight + 'px');
            uiGrid.css('overflow', 'hidden');
          }, 100);
        }
        setHeight(element);
      }}, {directiveFactory: function($timeout) {
        ClassicAttachmentsGridDirective.instance = new ClassicAttachmentsGridDirective($timeout);
        return ClassicAttachmentsGridDirective.instance;
      }});
  }();
  ClassicAttachmentsGridDirective.directiveFactory.$inject = ['$timeout'];
  var $__default = ClassicAttachmentsGridDirective;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/classicAttachmentsGrid/classicAttachmentsGrid.directive.js
;

System.registerModule("com/autodesk/components/classicAttachmentsGrid/classicAttachmentsGrid.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/classicAttachmentsGrid/classicAttachmentsGrid.js";
  var ClassicAttachmentsGridController = System.get("com/autodesk/components/classicAttachmentsGrid/classicAttachmentsGrid.controller.js").default;
  var ClassicAttachmentsGridDirective = System.get("com/autodesk/components/classicAttachmentsGrid/classicAttachmentsGrid.directive.js").default;
  var FileSizeFilter = System.get("com/autodesk/filters/fileSizeFilter.js").default;
  angular.module(__moduleName, ['ui.grid', 'ui.grid.selection', 'ui.grid.treeView', 'ui.grid.autoResize']).controller('ClassicAttachmentsGridController', ClassicAttachmentsGridController).directive('classicAttachmentsGrid', ['$timeout', ClassicAttachmentsGridDirective.directiveFactory]).filter('fileSizeFilter', FileSizeFilter);
  return {};
});
//# sourceURL=com/autodesk/components/classicAttachmentsGrid/classicAttachmentsGrid.js
;

System.registerModule("com/autodesk/components/wipAttachmentsDeleteDialog/wipAttachmentsDeleteDialog.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/wipAttachmentsDeleteDialog/wipAttachmentsDeleteDialog.controller.js";
  var WipAttachmentsDeleteDialogController = function() {
    function WipAttachmentsDeleteDialogController($rootScope, $mdDialog, EventService, totalItemsSelected) {
      this.$mdDialog = $mdDialog;
      this.EventService = EventService;
      this.totalItemsSelected = totalItemsSelected;
    }
    return ($traceurRuntime.createClass)(WipAttachmentsDeleteDialogController, {
      closeDialog: function() {
        this.$mdDialog.cancel();
      },
      proceedToDelete: function() {
        this.$mdDialog.hide();
      }
    }, {});
  }();
  var $__default = WipAttachmentsDeleteDialogController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/wipAttachmentsDeleteDialog/wipAttachmentsDeleteDialog.controller.js
;

System.registerModule("com/autodesk/components/wipAttachmentsDeleteDialog/wipAttachmentsDeleteDialog.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/wipAttachmentsDeleteDialog/wipAttachmentsDeleteDialog.js";
  var WipAttachmentsDeleteDialogController = System.get("com/autodesk/components/wipAttachmentsDeleteDialog/wipAttachmentsDeleteDialog.controller.js").default;
  angular.module(__moduleName, []).controller('WipAttachmentsDeleteDialogController', WipAttachmentsDeleteDialogController);
  return {};
});
//# sourceURL=com/autodesk/components/wipAttachmentsDeleteDialog/wipAttachmentsDeleteDialog.js
;

System.registerModule("com/autodesk/components/wipAttachmentsGrid/wipAttachmentsGrid.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/wipAttachmentsGrid/wipAttachmentsGrid.controller.js";
  var WipAttachmentsGridController = function() {
    function WipAttachmentsGridController($rootScope, $scope, $stateParams, $q, cpdmAttachmentsService, LocalizationService, FlyoutService, EventService, NotificationService, NotificationTypes, Attachment, AttachmentVersion, FieldTypes, FieldData, uiGridConstants, $mdDialog, FileOverviewService, ModelsManager, $window, _) {
      var $__4 = this;
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$q = $q;
      this.Attachment = Attachment;
      this.AttachmentVersion = AttachmentVersion;
      this.FieldTypes = FieldTypes;
      this.FieldData = FieldData;
      this.EventService = EventService;
      this.FlyoutService = FlyoutService;
      this.cpdmAttachmentsService = cpdmAttachmentsService;
      this.NotificationService = NotificationService;
      this.NotificationTypes = NotificationTypes;
      this.$mdDialog = $mdDialog;
      this.FileOverviewService = FileOverviewService;
      this.ModelsManager = ModelsManager;
      this.$window = $window;
      this._ = _;
      this.isCurrentlySaving = false;
      this.bulkSaveSuccessNotification = $rootScope.bundle.notification.allAttachmentsSave.success;
      this.bulkErrorNotification = $rootScope.bundle.notification.allAttachmentsSave.error;
      this.bulkSuccessAndErrorNotification = $rootScope.bundle.notification.allAttachmentsSave.errorAndSuccess;
      this.isAnySaveSuccess = false;
      this.isAnySaveFailed = false;
      this.$scope.$watch('wipAttachmentsGridCtrl.isItemLocked', function() {
        if ($__4.isItemLoaded) {
          $__4.updatePinDisplayState();
          $__4.updatePinnedVersion();
        }
      });
      this.fileOverviewHost;
      this.gridApiInterface;
      this.tableColumns = [];
      this.tableData = [];
      this.selectedItems = new Set();
      this.checkWipAttachmentEditFeature().then(function(result) {
        $__4.isWipAttachmentEditEnabled = result;
        $__4.tableColumns[3].visible = result;
      });
      LocalizationService.init().then(function() {
        $__4.tableColumns = [{
          field: 'indicator',
          displayName: '',
          cellTemplate: 'indicatorTemplate',
          enableColumnResizing: false,
          enableSorting: false,
          width: '5'
        }, {
          field: 'selection',
          headerCellTemplate: 'checkboxHeaderTemplate',
          cellTemplate: 'checkboxTemplate',
          enableColumnResizing: false,
          enableSorting: false,
          width: '70'
        }, {
          field: 'fileInfo.name',
          displayName: $rootScope.bundle.wip.attachments.name,
          enableSorting: true,
          sort: {direction: uiGridConstants.DESC},
          cellTemplate: 'attachmentNameTemplate',
          width: '30%'
        }, {
          field: 'pinningPolicy',
          fieldMeta: {},
          displayName: '',
          headerCellTemplate: 'pinningHeaderTemplate',
          cellTemplate: 'pinningTemplate',
          dataType: FieldTypes.PICKLIST,
          width: '10%',
          options: {items: [{
              link: $__4.pinningPolicies.ON_LOCK,
              title: $__4.$rootScope.bundle.wip.attachments.onLock
            }, {
              link: $__4.pinningPolicies.TO_VERSION,
              title: $__4.$rootScope.bundle.wip.attachments.toVersion
            }, {
              link: $__4.pinningPolicies.FLOAT,
              title: $__4.$rootScope.bundle.wip.attachments.float
            }]},
          visible: false
        }, {
          field: 'fileInfo.version',
          displayName: $rootScope.bundle.wip.attachments.version,
          dataType: FieldTypes.PICKLIST,
          cellTemplate: 'versionTemplate',
          width: '7%'
        }, {
          field: 'fileInfo.createUserName',
          displayName: $rootScope.bundle.wip.attachments.createdBy
        }, {
          field: 'fileInfo.fileType',
          displayName: $rootScope.bundle.wip.attachments.type,
          cellTemplate: 'attachmentTypeNameTemplate'
        }, {
          field: 'fileInfo.fileSize',
          displayName: $rootScope.bundle.wip.attachments.size,
          cellFilter: 'fileSizeFilter'
        }, {
          field: 'fileInfo.createTime',
          displayName: $rootScope.bundle.wip.attachments.createdOn,
          cellTemplate: 'attachmentDateTemplate'
        }];
        $__4.getData();
      });
      FileOverviewService.getHost().then(function(host) {
        $__4.fileOverviewHost = host;
      });
      this.pinningPolicies = {
        ON_LOCK: $rootScope.bundle.wip.attachments.onLock,
        TO_VERSION: $rootScope.bundle.wip.attachments.toVersion,
        FLOAT: $rootScope.bundle.wip.attachments.float
      };
      this.toolTipFlyout = null;
      this.isItemLoaded;
      var removeAttachmentsListener = EventService.listen(("wipAttachment:" + this.itemId + ":remove"), function() {
        $mdDialog.show({
          templateUrl: 'components/wipAttachmentsDeleteDialog/wipAttachmentsDeleteDialog.html',
          controller: 'WipAttachmentsDeleteDialogController as WipAttachmentsDeleteDialogCtrl',
          locals: {totalItemsSelected: $__4.selectedItems.size}
        }).then(function() {
          $q.all(_.map($traceurRuntime.spread($__4.selectedItems), function(item) {
            return $__4.Attachment.deleteAttachment(item.selfUrn).then(function() {
              $__4.NotificationService.addNotification($__4.NotificationTypes.SUCCESS, ("" + item.fileInfo.name + $rootScope.bundle.notification.singleRemove.success));
            }, function() {
              $__4.NotificationService.addNotification($__4.NotificationTypes.ERROR, ("" + item.fileInfo.name + $rootScope.bundle.notification.failed));
            });
          })).then(function() {
            $__4.getData();
            $__4.NotificationService.showNotifications();
          });
        });
      });
      var addAttachmentsListener = EventService.listen(("wipAttachment:" + this.itemId + ":add"), function() {
        $__4.getData().then(function() {
          NotificationService.showNotifications();
        });
      });
      var downloadAttachmentListener = EventService.listen(("wipAttachment:" + this.itemId + ":download"), function() {
        $__4.triggerDownload();
      });
      var saveListener = EventService.listen(("wipAttachment:" + this.itemId + ":save"), function() {
        $__4.performSave();
      });
      $scope.$on('$destroy', function() {
        EventService.unlisten(addAttachmentsListener);
        EventService.unlisten(downloadAttachmentListener);
        EventService.unlisten(removeAttachmentsListener);
        EventService.unlisten(saveListener);
      });
    }
    return ($traceurRuntime.createClass)(WipAttachmentsGridController, {
      isTableRowInvalid: function(row) {
        return !!(row.pinningPolicy.serverError || row.fileInfo.serverError);
      },
      isTableRowDirty: function(row) {
        var editableFields = new Set();
        if (this.isWipAttachmentEditEnabled) {
          editableFields.add(row.pinningPolicy);
          editableFields.add(row.fileInfo.version);
        }
        return _.some($traceurRuntime.spread(editableFields), function(field) {
          return field.isDirty();
        });
      },
      getDirtyRows: function() {
        var $__4 = this;
        return _.filter(this.tableData, function(row) {
          return $__4.isTableRowDirty(row);
        });
      },
      toggleRowSelection: function(row) {
        if (row.isSelected) {
          this.selectedItems.add(row.entity);
        } else {
          this.selectedItems.delete(row.entity);
          if (this.gridApiInterface.selection.selectAll) {
            this.gridApiInterface.selection.selectAll = false;
          }
        }
      },
      toggleAllSelection: function() {
        this.gridApiInterface.selection.selectAll = !this.gridApiInterface.selection.selectAll;
        if (this.gridApiInterface.selection.selectAll) {
          this.gridApiInterface.selection.selectAllRows();
        } else {
          this.gridApiInterface.selection.clearSelectedRows();
        }
      },
      getData: function() {
        var $__4 = this;
        this.isItemLoaded = false;
        return this.cpdmAttachmentsService.getWipAttachments(this.workspaceId, this.itemId).then(function(wipAttachments) {
          if (wipAttachments.length) {
            var lineageUrns = _.uniq(_.map(wipAttachments, function(wipAttachment) {
              return wipAttachment.lineageUrn;
            }));
            return $__4.Attachment.fetchAttachments(lineageUrns).then(function(response) {
              var attachmentsInfo = response.data.versionedFiles;
              return $__4.$q.all(_.map(wipAttachments, function(wipAttachment) {
                var attachment = new $__4.Attachment(wipAttachment);
                var attachmentInfo = _.find(attachmentsInfo, function(info) {
                  return info.versionedFile.lineageUrn === attachment.getLineageUrn();
                });
                attachment.setLatestVersionInfo(attachmentInfo.versionedFile);
                if (attachment.getPinnedVersionUrn()) {
                  return $__4.Attachment.fetchSingleAttachment(attachment.getPinnedVersionUrn()).then(function(pinnedVersionInfo) {
                    attachment.setPinnedVersionInfo(pinnedVersionInfo.data.versionedFile);
                    return {
                      attachment: attachment,
                      selfUrn: attachment.json.__self__,
                      lineageUrn: attachment.getLineageUrn(),
                      versionUrn: attachment.getPinnedVersionUrn(),
                      latestVersion: attachment.getVersion(),
                      pinningPolicy: $__4.isWipAttachmentEditEnabled ? $__4.buildPinningPolicyField(attachment) : {},
                      fileInfo: {
                        name: attachment.getPinnedTitle(),
                        mimeType: attachment.getPinnedMimeType(),
                        fileType: attachment.getPinnedFileType(),
                        fileSize: attachment.getPinnedFileSize(),
                        createUserName: attachment.getPinnedCreateUserName(),
                        createTime: attachment.getPinnedCreateTime(),
                        version: $__4.buildVersionField(attachment),
                        versionNumber: (!attachment.getPinnedVersion() || attachment.isPinnedToLatestVersion()) ? attachment.getVersion() : attachment.getPinnedVersion(),
                        parentFolderUrn: attachmentInfo.lineage.parentFolderUrn
                      },
                      onPinningPolicyChange: function(row) {
                        $__4.showLatestVersion(row, attachment);
                      }
                    };
                  });
                } else {
                  return {
                    attachment: attachment,
                    selfUrn: attachment.json.__self__,
                    lineageUrn: attachment.getLineageUrn(),
                    versionUrn: attachment.getVersionUrn(),
                    latestVersion: attachment.getVersion(),
                    pinningPolicy: $__4.isWipAttachmentEditEnabled ? $__4.buildPinningPolicyField(attachment) : {},
                    fileInfo: {
                      name: attachment.getTitle(),
                      mimeType: attachment.getMimeType(),
                      fileType: attachment.getFileType(),
                      fileSize: attachment.getFileSize(),
                      createUserName: attachment.getCreateUserName(),
                      createTime: attachment.getCreateTime(),
                      version: $__4.buildVersionField(attachment),
                      versionNumber: (!attachment.getPinnedVersion() || attachment.isPinnedToLatestVersion()) ? attachment.getVersion() : attachment.getPinnedVersion(),
                      parentFolderUrn: attachmentInfo.lineage.parentFolderUrn
                    },
                    onPinningPolicyChange: function(row) {
                      $__4.showLatestVersion(row, attachment);
                    }
                  };
                }
              }));
            });
          }
        }).then(function(results) {
          $__4.tableData = results || [];
          $__4.updatePinDisplayState();
          $__4.selectedItems.clear();
          $__4.gridApiInterface.selection.selectAll = false;
          $__4.isItemLoaded = true;
          $__4.$scope.$emit('activateNavigationGuard', $__4);
        });
      },
      updatePinDisplayState: function() {
        var $__4 = this;
        this._.each(this.tableData, function(rowObject) {
          return rowObject.showPin = $__4.isWipAttachmentEditEnabled ? $__4.showPin(rowObject.attachment.getPinningPolicy()) : null;
        });
      },
      updatePinnedVersion: function() {
        var $__4 = this;
        this._.each(this.tableData.filter(function(row) {
          return row.attachment.getPinningPolicy() === $__4.pinningPolicies.ON_LOCK;
        }), function(onLockRow) {
          onLockRow.attachment.setPinnedVersion(onLockRow.attachment.getVersion());
        });
      },
      showPin: function(pinningPolicy) {
        switch (pinningPolicy) {
          case this.pinningPolicies.ON_LOCK:
            return this.isItemLocked;
          case this.pinningPolicies.TO_VERSION:
            return true;
          case this.pinningPolicies.FLOAT:
            return false;
          default:
            return this.isItemLocked;
        }
      },
      buildPinningPolicyField: function(attachment) {
        return this.FieldData.fromFieldData(this.FieldTypes.SELECTION, {
          urn: attachment.getVersionUrn(),
          link: '',
          metadata: {dataTypeId: this.FieldTypes.SELECTION},
          originalValue: {
            link: attachment.getPinningPolicy() || this.pinningPolicies.ON_LOCK,
            title: attachment.getPinningPolicy() || this.$rootScope.bundle.wip.attachments.onLock
          },
          options: this.tableColumns[3].options,
          value: {
            link: attachment.getPinningPolicy() || this.pinningPolicies.ON_LOCK,
            title: attachment.getPinningPolicy() || this.$rootScope.bundle.wip.attachments.onLock
          }
        });
      },
      buildVersionField: function(attachment) {
        var $__4 = this;
        return this.FieldData.fromFieldData(this.FieldTypes.SELECTION, {
          urn: attachment.getPinnedVersionUrn() || attachment.getVersionUrn(),
          link: '',
          metadata: {dataTypeId: this.FieldTypes.SELECTION},
          originalValue: {
            link: attachment.getPinnedVersionUrn() || attachment.getVersionUrn(),
            title: (!attachment.getPinnedVersion() || attachment.isPinnedToLatestVersion()) ? (attachment.getVersion() + " " + this.$rootScope.bundle.wip.attachments.latest) : attachment.getPinnedVersion()
          },
          options: {},
          value: {
            link: attachment.getPinnedVersionUrn() || attachment.getVersionUrn(),
            title: (!attachment.getPinnedVersion() || attachment.isPinnedToLatestVersion()) ? (attachment.getVersion() + " " + this.$rootScope.bundle.wip.attachments.latest) : attachment.getPinnedVersion()
          },
          fieldMetadata: {
            picklistLoader: function(optionLoader) {
              attachment.getAllVersions().then(function(attachmentVersionList) {
                var versionOptions = _.map(attachmentVersionList, function(version) {
                  return {
                    link: version.getVersionUrn(),
                    title: version.getVersionNumber() === attachment.getVersion() ? (version.getVersionNumber() + " " + $__4.$rootScope.bundle.wip.attachments.latest) : version.getVersionNumber()
                  };
                });
                optionLoader(versionOptions);
              });
            },
            loadOnEditMode: true
          }
        });
      },
      checkWipAttachmentEditFeature: function() {
        var $__4 = this;
        var deferObj = this.$q.defer();
        var listenerId = this.EventService.listen('enabledFeatures:tenant:done', function(event, obj) {
          $__4.EventService.unlisten(listenerId);
          var features = obj.getDisplayableData();
          var wipAttachmentEdit = _.find(features.data, function(feature) {
            return feature && feature.title === 'wip.attachment.edit';
          });
          deferObj.resolve(!!wipAttachmentEdit);
        });
        this.ModelsManager.getEnabledFeatures();
        return deferObj.promise;
      },
      triggerDownload: function(row) {
        var $__4 = this;
        var selectedItem = row ? row.entity : $traceurRuntime.spread(this.selectedItems)[0];
        this.NotificationService.addNotification(this.NotificationTypes.SUCCESS, ("" + selectedItem.fileInfo.name + this.$rootScope.bundle.attachments.downloadStarted));
        this.NotificationService.showNotifications();
        var filename = selectedItem.attachment.hasExtension() ? '' : (selectedItem.fileInfo.name.replace(' ', '+') + "." + selectedItem.fileInfo.fileType);
        return this.Attachment.downloadAttachment(selectedItem.versionUrn, filename).then(function(response) {
          $__4.$window.location.href = (response.data + "&response-content-type=" + encodeURIComponent('application/octet-stream'));
        }).then(function() {
          $__4.selectedItems.clear();
          $__4.gridApiInterface.selection.clearSelectedRows();
        }, function() {
          $__4.NotificationService.addNotification($__4.NotificationTypes.ERROR, ("" + selectedItem.fileInfo.name + $__4.$rootScope.bundle.attachments.downloadFailed));
          $__4.NotificationService.showNotifications();
        });
      },
      performSave: function() {
        var $__4 = this;
        this.isCurrentlySaving = true;
        this.isAnySaveSuccess = false;
        this.isAnySaveFailed = false;
        return this.$q.all(_.map(this.getDirtyRows(), function(row) {
          var selectedPinningPolicy = row.pinningPolicy.value.title;
          var saveData = {
            pinningPolicy: row.pinningPolicy.value.title,
            version: selectedPinningPolicy === $__4.$rootScope.bundle.wip.attachments.toVersion ? row.fileInfo.version.value.title.replace(("" + $__4.$rootScope.bundle.wip.attachments.latest), '').trim() : null,
            versionUrn: selectedPinningPolicy === $__4.$rootScope.bundle.wip.attachments.toVersion ? row.fileInfo.version.value.link : null,
            __self__: row.selfUrn
          };
          return $__4.Attachment.saveAttachment(saveData).then(function() {
            $__4.isAnySaveSuccess = true;
            $__4.NotificationService.addNotification($__4.NotificationTypes.SUCCESS, ("" + row.fileInfo.name + $__4.$rootScope.bundle.notification.singleSave.success));
          }, function() {
            $__4.isAnySaveFailed = true;
            $__4.NotificationService.addNotification($__4.NotificationTypes.ERROR, ("" + row.fileInfo.name + $__4.$rootScope.bundle.notification.singleSave.error));
          });
        })).then(function() {
          var bulkEditNotification;
          $__4.EventService.send(("wipAttachment:" + $__4.itemId + ":saveDone"));
          if ($__4.isAnySaveSuccess && $__4.isAnySaveFailed) {
            bulkEditNotification = $__4.bulkSuccessAndErrorNotification;
          } else if ($__4.isAnySaveSuccess === true && $__4.isAnySaveFailed === false) {
            bulkEditNotification = $__4.bulkSaveSuccessNotification;
          } else if ($__4.isAnySaveSuccess === false && $__4.isAnySaveFailed === true) {
            bulkEditNotification = $__4.bulkErrorNotification;
          }
          $__4.NotificationService.showNotifications(null, bulkEditNotification);
        });
      },
      isViewState: function() {
        return this.$stateParams.mode === 'view';
      },
      showLatestVersion: function(row, attachment) {
        if (row.entity.pinningPolicy.value.title !== this.$rootScope.bundle.wip.attachments.toVersion && !this.isItemLocked) {
          row.entity.fileInfo.version.value = {
            link: attachment.getVersionUrn(),
            title: (attachment.getVersion() + " " + this.$rootScope.bundle.wip.attachments.latest)
          };
        }
      },
      isDirty: function() {
        return (!!this.getDirtyRows().length && !this.isCurrentlySaving);
      }
    }, {});
  }();
  var $__default = WipAttachmentsGridController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/wipAttachmentsGrid/wipAttachmentsGrid.controller.js
;

System.registerModule("com/autodesk/components/wipAttachmentsGrid/wipAttachmentsGrid.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/wipAttachmentsGrid/wipAttachmentsGrid.directive.js";
  function wipAttachmentsGridDirective() {
    return {
      restrict: 'E',
      replace: true,
      controller: 'WipAttachmentsGridController',
      controllerAs: 'wipAttachmentsGridCtrl',
      bindToController: true,
      templateUrl: 'components/wipAttachmentsGrid/wipAttachmentsGrid.html',
      scope: {
        workspaceId: '@',
        itemId: '@',
        dateFormat: '=',
        selectedItems: '=',
        tableData: '=attachmentsData',
        isItemLocked: '=',
        isItemLoaded: '=',
        addPermission: '=',
        triggerAdd: '&'
      }
    };
  }
  var $__default = wipAttachmentsGridDirective;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/wipAttachmentsGrid/wipAttachmentsGrid.directive.js
;

System.registerModule("com/autodesk/components/wipAttachmentsGrid/wipAttachmentsGrid.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/wipAttachmentsGrid/wipAttachmentsGrid.js";
  var WipAttachmentsGridController = System.get("com/autodesk/components/wipAttachmentsGrid/wipAttachmentsGrid.controller.js").default;
  var WipAttachmentsGridDirective = System.get("com/autodesk/components/wipAttachmentsGrid/wipAttachmentsGrid.directive.js").default;
  var AttachmentModel = System.get("com/autodesk/models/wipAttachments/attachment.model.js").default;
  var AttachmentVersionModel = System.get("com/autodesk/models/wipAttachments/attachmentVersion.model.js").default;
  var FileSizeFilter = System.get("com/autodesk/filters/fileSizeFilter.js").default;
  System.get("com/autodesk/wipFileTypeIcon.js");
  System.get("com/autodesk/wipFileTypeName.js");
  angular.module(__moduleName, [AttachmentModel.name, AttachmentVersionModel.name, 'com/autodesk/fileOverview.js', 'com/autodesk/wipFileTypeIcon.js', 'com/autodesk/wipFileTypeName.js']).controller('WipAttachmentsGridController', WipAttachmentsGridController).directive('wipAttachmentsGrid', WipAttachmentsGridDirective).filter('fileSizeFilter', FileSizeFilter);
  return {};
});
//# sourceURL=com/autodesk/components/wipAttachmentsGrid/wipAttachmentsGrid.js
;

System.registerModule("com/autodesk/components/wipAttachmentsList/wipAttachmentsList.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/wipAttachmentsList/wipAttachmentsList.controller.js";
  var WipAttachmentsListController = function() {
    function WipAttachmentsListController($rootScope, $q, cpdmAttachmentsService, Attachment, FileOverviewService, NotificationService, NotificationTypes) {
      var $__3 = this;
      this.$rootScope = $rootScope;
      this.$q = $q;
      this.Attachment = Attachment;
      this.cpdmAttachmentsService = cpdmAttachmentsService;
      this.FileOverviewService = FileOverviewService;
      this.NotificationService = NotificationService;
      this.NotificationTypes = NotificationTypes;
      this.attachmentList = [];
      this.getData();
      this.FileOverviewService.getHost().then(function(host) {
        $__3.getFolderUri = function(urn) {
          return $__3.FileOverviewService.getContainingFolderLinkWithHost(host, urn);
        };
        $__3.getFileOverviewUri = function(urn, version) {
          return $__3.FileOverviewService.getFileOverviewLinkWithHost(host, urn, version);
        };
      });
    }
    return ($traceurRuntime.createClass)(WipAttachmentsListController, {
      getData: function() {
        var $__3 = this;
        this.cpdmAttachmentsService.getWipAttachments(this.workspaceId, this.itemId).then(function(wipAttachments) {
          if (wipAttachments.length) {
            var lineageUrns = _.uniq(_.map(wipAttachments, function(wipAttachment) {
              return wipAttachment.lineageUrn;
            }));
            return $__3.Attachment.fetchAttachments(lineageUrns).then(function(response) {
              var attachmentsInfo = response.data.versionedFiles;
              return $__3.$q.all(_.map(wipAttachments, function(wipAttachment) {
                var attachment = new $__3.Attachment(wipAttachment);
                var attachmentInfo = _.find(attachmentsInfo, function(info) {
                  return info.versionedFile.lineageUrn === attachment.getLineageUrn();
                });
                attachment.setLatestVersionInfo(attachmentInfo.versionedFile);
                if (attachment.getPinnedVersionUrn()) {
                  return $__3.Attachment.fetchSingleAttachment(attachment.getPinnedVersionUrn()).then(function(pinnedVersionInfo) {
                    attachment.setPinnedVersionInfo(pinnedVersionInfo.data.versionedFile);
                    return {fileInfo: {
                        name: attachment.getPinnedTitle(),
                        mimeType: attachment.getPinnedMimeType(),
                        fileType: attachment.getPinnedFileType(),
                        fileSize: attachment.getPinnedFileSize(),
                        createUserName: attachment.getPinnedCreateUserName(),
                        createTime: attachment.getPinnedCreateTime(),
                        version: attachment.getPinnedVersion(),
                        versionUrn: attachment.getPinnedVersionUrn(),
                        urn: attachment.getLineageUrn(),
                        parentFolderUrn: attachmentInfo.lineage.parentFolderUrn
                      }};
                  });
                } else {
                  return {fileInfo: {
                      name: attachment.getTitle(),
                      mimeType: attachment.getMimeType(),
                      fileType: attachment.getFileType(),
                      fileSize: attachment.getFileSize(),
                      createUserName: attachment.getCreateUserName(),
                      createTime: attachment.getCreateTime(),
                      version: attachment.getVersion(),
                      versionUrn: attachment.getVersionUrn(),
                      urn: attachment.getLineageUrn(),
                      parentFolderUrn: attachmentInfo.lineage.parentFolderUrn
                    }};
                }
              }));
            });
          }
        }).then(function(results) {
          $__3.attachmentList = results || [];
        });
      },
      download: function(versionUrn) {
        return this.Attachment.downloadAttachment(versionUrn).then(function(response) {
          window.location.href = (response.data + "&response-content-type=" + encodeURIComponent('application/octet-stream'));
        });
      },
      triggerSingleDownload: function(attachment) {
        var $__3 = this;
        return this.download(attachment.fileInfo.versionUrn).then(function() {
          $__3.NotificationService.addNotification($__3.NotificationTypes.SUCCESS, ("" + attachment.fileInfo.name + $__3.$rootScope.bundle.attachments.downloadStarted));
          $__3.NotificationService.showNotifications();
        }, function() {
          $__3.NotificationService.addNotification($__3.NotificationTypes.ERROR, ("" + attachment.fileInfo.name + $__3.$rootScope.bundle.attachments.downloadFailed));
          $__3.NotificationService.showNotifications();
        });
      }
    }, {});
  }();
  var $__default = WipAttachmentsListController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/wipAttachmentsList/wipAttachmentsList.controller.js
;

System.registerModule("com/autodesk/components/wipAttachmentsList/wipAttachmentsList.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/wipAttachmentsList/wipAttachmentsList.directive.js";
  function wipAttachmentsListDirective() {
    return {
      restrict: 'E',
      replace: true,
      controller: 'WipAttachmentsListController',
      controllerAs: 'wipAttachmentsListCtrl',
      bindToController: true,
      templateUrl: 'components/wipAttachmentsList/wipAttachmentsList.html',
      scope: {
        workspaceId: '=',
        itemId: '='
      }
    };
  }
  var $__default = wipAttachmentsListDirective;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/wipAttachmentsList/wipAttachmentsList.directive.js
;

System.registerModule("com/autodesk/components/wipAttachmentsList/wipAttachmentsList.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/wipAttachmentsList/wipAttachmentsList.js";
  var WipAttachmentsListController = System.get("com/autodesk/components/wipAttachmentsList/wipAttachmentsList.controller.js").default;
  var WipAttachmentsListDirective = System.get("com/autodesk/components/wipAttachmentsList/wipAttachmentsList.directive.js").default;
  var AttachmentModel = System.get("com/autodesk/models/wipAttachments/attachment.model.js").default;
  System.get("com/autodesk/wipFileTypeIcon.js");
  angular.module(__moduleName, [AttachmentModel.name, 'com/autodesk/wipFileTypeIcon.js']).controller('WipAttachmentsListController', WipAttachmentsListController).directive('wipAttachmentsList', WipAttachmentsListDirective);
  return {};
});
//# sourceURL=com/autodesk/components/wipAttachmentsList/wipAttachmentsList.js
;

System.registerModule("com/autodesk/components/wipAttachmentsTooltip/wipAttachmentTooltip.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/wipAttachmentsTooltip/wipAttachmentTooltip.directive.js";
  function wipAttachmentTooltipDirective($timeout, $window) {
    return {
      restrict: 'A',
      templateUrl: 'components/wipAttachmentsTooltip/wipAttachmentsTooltip.html',
      transclude: true,
      link: function(scope, element, attrs) {
        var tooltipContent = $(element).find('.tooltip-content');
        var delay;
        scope.positionTooltip = function() {
          var elementsWithTitle = $(element).find('[title]');
          _.each(elementsWithTitle, function(titleElement) {
            if (attrs.preventDefaultTooltip === 'true') {
              titleElement.title = '';
            }
          });
          delay = $timeout(function() {
            var elementClientRec = element[0].getBoundingClientRect();
            var top = elementClientRec.top;
            var bottom = elementClientRec.bottom;
            var visibleHeight = $window.innerHeight;
            var visibleHeightTop = visibleHeight - top;
            var visibleHeightBottom = visibleHeight - bottom;
            var tooltipPosition = ((visibleHeight - bottom) > (tooltipContent.height()) + 70) ? 'bottom' : 'top';
            tooltipContent.removeClass('bottom top').addClass(tooltipPosition);
          }, 300);
        };
        scope.hideTooltip = function() {
          $timeout.cancel(delay);
          tooltipContent.removeClass('bottom top');
        };
      }
    };
  }
  var $__default = wipAttachmentTooltipDirective;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/wipAttachmentsTooltip/wipAttachmentTooltip.directive.js
;

System.registerModule("com/autodesk/components/wipAttachmentsTooltip/wipAttachmentTooltip.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/wipAttachmentsTooltip/wipAttachmentTooltip.js";
  var WipAttachmentTooltipDirective = System.get("com/autodesk/components/wipAttachmentsTooltip/wipAttachmentTooltip.directive.js").default;
  angular.module(__moduleName, []).directive('wipAttachmentTooltip', WipAttachmentTooltipDirective);
  return {};
});
//# sourceURL=com/autodesk/components/wipAttachmentsTooltip/wipAttachmentTooltip.js
;

System.registerModule("com/autodesk/components/wipFileBrowserDialog/wipFileBrowserDialog.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/wipFileBrowserDialog/wipFileBrowserDialog.controller.js";
  var WipFileBrowserDialogController = function() {
    function WipFileBrowserDialogController($rootScope, $mdDialog, $q, Attachment, LocalizationService, EventService, NotificationService, NotificationTypes, workspaceId, itemId, itemUrn) {
      var $__2 = this;
      this.$mdDialog = $mdDialog;
      this.$q = $q;
      this.Attachment = Attachment;
      this.EventService = EventService;
      this.NotificationService = NotificationService;
      this.NotificationTypes = NotificationTypes;
      this.workspaceId = workspaceId;
      this.itemId = itemId;
      this.itemUrn = itemUrn;
      this.selectedFiles = new Set();
      LocalizationService.init().then(function() {
        $__2.$rootScope = $rootScope;
      });
    }
    return ($traceurRuntime.createClass)(WipFileBrowserDialogController, {
      triggerAdd: function() {
        var $__2 = this;
        this.$q.all(_.map($traceurRuntime.spread(this.selectedFiles), function(file) {
          return $__2.Attachment.addAttachment(file, $__2.workspaceId, $__2.itemId, $__2.itemUrn).then(function() {
            $__2.NotificationService.addNotification($__2.NotificationTypes.SUCCESS, ("" + file.title + $__2.$rootScope.bundle.notification.singleAdd.success));
          }, function() {
            $__2.NotificationService.addNotification($__2.NotificationTypes.ERROR, ("" + file.title + $__2.$rootScope.bundle.notification.singleAdd.failed));
          });
        })).then(function() {
          $__2.$mdDialog.hide();
        });
      },
      closeDialog: function() {
        this.$mdDialog.cancel();
      }
    }, {});
  }();
  var $__default = WipFileBrowserDialogController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/wipFileBrowserDialog/wipFileBrowserDialog.controller.js
;

System.registerModule("com/autodesk/components/wipFileBrowserDialog/wipFileBrowserDialog.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/wipFileBrowserDialog/wipFileBrowserDialog.js";
  var WipFileBrowserDialogController = System.get("com/autodesk/components/wipFileBrowserDialog/wipFileBrowserDialog.controller.js").default;
  angular.module(__moduleName, []).controller('WipFileBrowserDialogController', WipFileBrowserDialogController);
  return {};
});
//# sourceURL=com/autodesk/components/wipFileBrowserDialog/wipFileBrowserDialog.js
;

System.registerModule("com/autodesk/models/wipAttachments/attachment.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/wipAttachments/attachment.model.js";
  var Attachment = function() {
    function Attachment(json) {
      this.json = json;
    }
    return ($traceurRuntime.createClass)(Attachment, {
      setLatestVersionInfo: function(versionedFile) {
        this.latestVersionFile = versionedFile;
      },
      setPinnedVersionInfo: function(pinnedVersionedFile) {
        this.pinnedVersionFile = pinnedVersionedFile;
      },
      isPinnedToLatestVersion: function() {
        return this.getPinnedVersion() === this.getVersion();
      },
      hasExtension: function() {
        var fileExtensionPattern = new RegExp(("(\\." + this.getFileType() + ")$"), 'gi');
        return !!this.getTitle().match(fileExtensionPattern);
      },
      getLineageUrn: function() {
        return this.json.lineageUrn;
      },
      getPinningPolicy: function() {
        return this.json.pinningPolicy;
      },
      getPinnedVersion: function() {
        return this.json.version ? ("" + this.json.version) : null;
      },
      getPinnedVersionUrn: function() {
        return this.json.versionUrn || null;
      },
      setPinnedVersion: function(version) {
        this.json.version = version;
      },
      getPinnedVersionFileInfo: function() {
        return this.pinnedVersionFile;
      },
      getPinnedTitle: function() {
        return this.getPinnedVersionFileInfo() && this.getPinnedVersionFileInfo().title;
      },
      getPinnedMimeType: function() {
        return this.getPinnedVersionFileInfo() && this.getPinnedVersionFileInfo().mimeType;
      },
      getPinnedFileType: function() {
        return this.getPinnedVersionFileInfo() && this.getPinnedVersionFileInfo().fileType;
      },
      getPinnedFileSize: function() {
        return this.getPinnedVersionFileInfo() && this.getPinnedVersionFileInfo().fileSize;
      },
      getPinnedCreateUserName: function() {
        return this.getPinnedVersionFileInfo() && this.getPinnedVersionFileInfo().createUserName;
      },
      getPinnedCreateTime: function() {
        return this.getPinnedVersionFileInfo() && this.getPinnedVersionFileInfo().createTime;
      },
      getLatestVersionFileInfo: function() {
        return this.latestVersionFile;
      },
      getVersionUrn: function() {
        return this.getLatestVersionFileInfo().urn;
      },
      getTitle: function() {
        return this.getLatestVersionFileInfo().title;
      },
      getMimeType: function() {
        return this.getLatestVersionFileInfo().mimeType;
      },
      getFileType: function() {
        return this.getLatestVersionFileInfo().fileType;
      },
      getFileSize: function() {
        return this.getLatestVersionFileInfo().fileSize;
      },
      getCreateUserName: function() {
        return this.getLatestVersionFileInfo().createUserName;
      },
      getCreateTime: function() {
        return this.getLatestVersionFileInfo().createTime;
      },
      getVersion: function() {
        return this.getLatestVersionFileInfo().versionNumber.toString();
      },
      getAllVersions: function() {
        return Attachment.AttachmentVersion.getVersions(this.getLineageUrn());
      }
    }, {
      fetchAttachments: function(lineageUrns) {
        return Attachment.WipApiService.getFiles(lineageUrns);
      },
      fetchSingleAttachment: function(versionUrn) {
        return Attachment.WipApiService.getWipSingleVersion(versionUrn);
      },
      addAttachment: function(attachment, workspaceId, itemId, itemUrn) {
        var data = {
          itemId: itemUrn,
          lineageUrn: attachment.urn,
          pinningPolicy: 'On Lock'
        };
        return Attachment.RESTWrapperService.post(data, 'api/v3', [{workspaces: workspaceId}, {items: itemId}, 'attachments'], null, {'Content-Type': 'application/json'}, {});
      },
      deleteAttachment: function(delUrl) {
        var link = delUrl.slice(1, delUrl.length);
        var headers = {'Content-Type': 'application/json'};
        return Attachment.RESTWrapperService.delete(link, null, {}, headers, null);
      },
      downloadAttachment: function(versionUrn, filename) {
        return Attachment.WipApiService.downloadFile(versionUrn, filename);
      },
      saveAttachment: function(data) {
        var link = data.__self__.slice(1, data.__self__.length);
        var headers = {'Content-Type': 'application/json'};
        return Attachment.RESTWrapperService.put(data, link, null, {}, headers, null);
      }
    });
  }();
  var AttachmentFactory = function($http, $q, WipApiService, RESTWrapperService, AttachmentVersion, $rootScope) {
    Attachment.$http = $http;
    Attachment.$q = $q;
    Attachment.WipApiService = WipApiService;
    Attachment.RESTWrapperService = RESTWrapperService;
    Attachment.AttachmentVersion = AttachmentVersion;
    Attachment.$rootScope = $rootScope;
    return Attachment;
  };
  var $__default = angular.module(__moduleName, []).factory('Attachment', ['$http', '$q', 'WipApiService', 'RESTWrapperService', 'AttachmentVersion', '$rootScope', AttachmentFactory]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/wipAttachments/attachment.model.js
;

System.registerModule("com/autodesk/models/wipAttachments/attachmentVersion.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/wipAttachments/attachmentVersion.model.js";
  var AttachmentVersion = function() {
    function AttachmentVersion(json) {
      this.json = json;
    }
    return ($traceurRuntime.createClass)(AttachmentVersion, {
      getVersionUrn: function() {
        return this.json.urn;
      },
      getVersionNumber: function() {
        return this.json.versionNumber.toString();
      }
    }, {getVersions: function(lineageUrn) {
        return AttachmentVersion.WipApiService.getWipFileVersions(lineageUrn).then(function(results) {
          return _.map(results.data.collection, function(versionJson) {
            return new AttachmentVersion(versionJson);
          });
        });
      }});
  }();
  var AttachmentVersionFactory = function(WipApiService) {
    AttachmentVersion.WipApiService = WipApiService;
    return AttachmentVersion;
  };
  var $__default = angular.module(__moduleName, []).factory('AttachmentVersion', ['WipApiService', AttachmentVersionFactory]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/wipAttachments/attachmentVersion.model.js
;

System.registerModule("com/autodesk/filters/fileSizeFilter.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/filters/fileSizeFilter.js";
  function fileSizeFilter() {
    return function(size, precision) {
      if (isNaN(size)) {
        return '';
      }
      if (isNaN(parseFloat(size)) || !isFinite(size) || (size === 0) || (size < 1024)) {
        return '-';
      }
      if (!precision || precision < 0) {
        precision = 1;
      }
      var units = ['bytes', 'KB', 'MB', 'GB', 'TB'];
      var number = Math.floor(Math.log(size) / Math.log(1024));
      return (size / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    };
  }
  var $__default = fileSizeFilter;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/filters/fileSizeFilter.js
;

System.registerModule("com/autodesk/services/cpdmAttachmentsService.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/services/cpdmAttachmentsService.js";
  var cpdmAttachmentsService = function() {
    function cpdmAttachmentsService(Restangular, $q, _, $log, $http, RESTWrapperService) {
      this.Restangular = Restangular;
      this.RESTWrapperService = RESTWrapperService;
      this.$q = $q;
      this.$log = $log;
      this.$http = $http;
      this._ = _;
      this.attachments = {link: 'api/rest/v1/workspaces/[workspaceId]/items/[itemId]/attachments'};
      this.attachmentCheckOut = {link: 'api/rest/v1/workspaces/[workspaceId]/items/[itemId]/attachments/[fileId]/checkouts'};
      this.attachmentDownload = {link: 'api/rest/v1/workspaces/[workspaceId]/items/[itemId]/attachments/[fileId]'};
      this.attachmentCheckIn = {link: 'api/rest/v1/workspaces/[workspaceId]/items/[itemId]/attachments/[fileId]/checkins'};
      this.wipAttachments = {link: 'api/v3/workspaces/[workspaceId]/items/[itemId]/attachments'};
      this.attachmentsTitles = [];
    }
    return ($traceurRuntime.createClass)(cpdmAttachmentsService, {
      setAttachmentsTitleList: function(data) {
        this.attachmentsTitles = _.pluck(data, 'resourceName');
      },
      getAttachmentsTitleList: function() {
        return _.filter(this.attachmentsTitles);
      },
      createBlob: function(fileMeta, fileStream) {
        var formData = new FormData();
        var fileMetaBlob = new Blob([angular.toJson(fileMeta)], {type: 'application/json'});
        var fileBlob = new Blob([fileStream], {type: 'application/octet-stream'});
        formData.append('fileInfo', fileMetaBlob);
        formData.append('fileData', fileBlob, fileMeta.fileName);
        return formData;
      },
      getAttachments: function(workspaceId, itemId) {
        var attachmentLink = this.attachments.link.replace('[workspaceId]', workspaceId).replace('[itemId]', itemId);
        return this.Restangular.one(attachmentLink).get([undefined, {'Content-Type': 'application/json'}]).then(function(contents) {
          return contents.list && contents.list.data;
        });
      },
      uploadAttachment: function(workspaceId, itemId, fileMeta, fileStream) {
        var uploadLink = this.attachments.link.replace('[workspaceId]', workspaceId).replace('[itemId]', itemId);
        var formData = this.createBlob(fileMeta, fileStream);
        return this.Restangular.one(uploadLink).withHttpConfig({
          transformRequest: angular.identity,
          timeout: 0
        }).customPOST(formData, undefined, undefined, {'Content-Type': undefined});
      },
      checkInAttachment: function(workspaceId, itemId, fileMeta, fileStream, fileId) {
        var checkInLink = this.attachmentCheckIn.link.replace('[workspaceId]', workspaceId).replace('[itemId]', itemId).replace('[fileId]', fileId);
        var formData = this.createBlob(fileMeta, fileStream);
        return this.Restangular.one(checkInLink).withHttpConfig({
          transformRequest: angular.identity,
          timeout: 0
        }).customPOST(formData, undefined, undefined, {'Content-Type': undefined});
      },
      downloadAttachment: function(fileId, workspaceId, itemId) {
        var downloadLink = this.attachmentDownload.link.replace('[fileId]', fileId).replace('[workspaceId]', workspaceId).replace('[itemId]', itemId);
        return this.Restangular.one(downloadLink).withHttpConfig({responseType: 'blob'}).customGET(undefined, undefined, {
          Accept: 'application/octet-stream',
          'X-Auth-Token': 'token'
        });
      },
      checkOutAttachment: function(fileId, workspaceId, itemId) {
        var checkOutLink = this.attachmentCheckOut.link.replace('[fileId]', fileId).replace('[workspaceId]', workspaceId).replace('[itemId]', itemId);
        return this.Restangular.one(checkOutLink).post();
      },
      undoCheckOut: function(fileId, workspaceId, itemId) {
        var undoLink = this.attachmentCheckOut.link.replace('[fileId]', fileId).replace('[workspaceId]', workspaceId).replace('[itemId]', itemId);
        return this.Restangular.one(undoLink).remove();
      },
      getWipAttachments: function(workspaceId, itemId) {
        var attachmentLink = this.wipAttachments.link.replace('[workspaceId]', workspaceId).replace('[itemId]', itemId);
        return this.RESTWrapperService.get(attachmentLink);
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, []).factory('cpdmAttachmentsService', ['Restangular', '$q', '_', '$log', '$http', 'RESTWrapperService', function(Restangular, $q, _, $log, $http, RESTWrapperService) {
    return new cpdmAttachmentsService(Restangular, $q, _, $log, $http, RESTWrapperService);
  }]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/services/cpdmAttachmentsService.js
;

angular.module("com/autodesk/cpdm.js", []).run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('components/classicAttachmentsActionButton/classicAttachmentsActionButton.html',
    "<div class=\"attachments-button\"><label class=\"md-button md-default-theme\" ng-if=\"classicAttachmentsActionButtonCtrl.type === 'upload' &&\r" +
    "\n" +
    "		classicAttachmentsActionButtonCtrl.permitted\"><input type=\"file\" class=\"input-button\" on-files-selected=\"classicAttachmentsActionButtonCtrl.triggerDialog(selectedFileList, false)\" multiple/> <span class=\"label\">{{$root.bundle.button.add}}</span></label><label class=\"md-button md-default-theme\" ng-if=\"classicAttachmentsActionButtonCtrl.type === 'checkin' &&\r" +
    "\n" +
    "		classicAttachmentsActionButtonCtrl.permitted\"><input type=\"file\" class=\"input-button\" on-files-selected=\"classicAttachmentsActionButtonCtrl.triggerDialog(selectedFileList, true, fileInfo)\"/> <span class=\"label\">{{$root.bundle.attachments.checkIn}}</span></label><md-button class=\"md-button md-default-theme\" aria-label=\"{{$root.bundle.attachments.undo}}\" title=\"{{$root.bundle.attachments.undo}}\" ng-if=\"classicAttachmentsActionButtonCtrl.type === 'undo' &&\r" +
    "\n" +
    "		classicAttachmentsActionButtonCtrl.permitted\" ng-click=\"classicAttachmentsActionButtonCtrl.triggerUndo()\"><span class=\"md md-lg md-undo\"></span></md-button><md-button class=\"md-button md-default-theme\" aria-label=\"{{$root.bundle.attachments.checkOut}}\" title=\"{{$root.bundle.attachments.checkOut}}\" ng-if=\"classicAttachmentsActionButtonCtrl.type === 'checkout' &&\r" +
    "\n" +
    "		classicAttachmentsActionButtonCtrl.permitted\" ng-click=\"classicAttachmentsActionButtonCtrl.triggerCheckout()\"><span class=\"md md-lg md-file-download\"></span></md-button><md-button id=\"download-btn\" class=\"md-button md-default-theme\" aria-label=\"{{$root.bundle.attachments.download}}\" title=\"{{$root.bundle.attachments.download}}\" ng-if=\"classicAttachmentsActionButtonCtrl.type === 'download'\" ng-click=\"classicAttachmentsActionButtonCtrl.triggerDownload()\"><span class=\"md md-lg md-play-download\"></span></md-button></div>"
  );


  $templateCache.put('components/classicAttachmentsDialog/classicAttachmentsDialog.html',
    "<md-dialog aria-label=\"Selected Files Dialog\" class=\"attachments-dialog\"><md-toolbar><div class=\"md-toolbar-tools\"><h2 class=\"attachments-dialog-header\"><span ng-if=\"ClassicAttachmentsDialogCtrl.isFromCheckIn\">{{$root.bundle.attachments.checkIn}} </span><span ng-if=\"!ClassicAttachmentsDialogCtrl.isFromCheckIn\">{{$root.bundle.attachments.upload}}</span></h2><div class=\"item-selected\" ng-show=\"ClassicAttachmentsDialogCtrl.selectedFiles.length\" ng-if=\"!ClassicAttachmentsDialogCtrl.isFromCheckIn\">- {{ClassicAttachmentsDialogCtrl.selectedFiles.length}} <span ng-if=\"ClassicAttachmentsDialogCtrl.selectedFiles.length === 1\">{{$root.bundle.attachments.selected.oneItem}} </span><span ng-if=\"ClassicAttachmentsDialogCtrl.selectedFiles.length > 1\">{{$root.bundle.attachments.selected.items}}</span></div><span flex></span> <a href=\"#\" ng-click=\"ClassicAttachmentsDialogCtrl.closeDialog()\"><span class=\"zmdi zmdi-hc-2x zmdi-close\"></span></a></div></md-toolbar><md-divider></md-divider><md-toolbar class=\"error\" ng-show=\"ClassicAttachmentsDialogCtrl.errorMessages.length > 0\"><div class=\"md-toolbar-tools md-warn md-hue-2\" ng-repeat=\"error in ClassicAttachmentsDialogCtrl.errorMessages\"><span>{{error.message}}</span></div></md-toolbar><md-toolbar class=\"error\" ng-show=\"ClassicAttachmentsDialogCtrl.hasDuplicatedTitle\"><div class=\"md-toolbar-tools md-warn md-hue-2\"><span>{{$root.bundle.attachments.duplicatedTitles}}</span></div></md-toolbar><md-dialog-content><div class=\"md-dialog-content\"><div layout=\"column\" ng-repeat=\"file in ClassicAttachmentsDialogCtrl.selectedFiles\"><div layout=\"row\" class=\"section-header\" ng-click=\"ClassicAttachmentsDialogCtrl.isContentShown = !ClassicAttachmentsDialogCtrl.isContentShown\"><div><span class=\"file-name\">{{file.name}} </span><span class=\"file-info\">({{file.size}})<br></span></div><span flex></span><div class=\"file-uploading\" ng-if=\"file.uploadStatus && file.uploadStatus < 100\"><md-progress-circular md-mode=\"determinate\" md-diameter=\"15\" value=\"{{file.uploadStatus}}\"></md-progress-circular></div><div ng-if=\"file.uploadStatus === 100\"><span class=\"zmdi zmdi-check\"></span></div><div ng-if=\"!ClassicAttachmentsDialogCtrl.isFromCheckIn && ClassicAttachmentsDialogCtrl.selectedFiles.length > 1\" ng-click=\"ClassicAttachmentsDialogCtrl.removeFile(file)\"><span class=\"zmdi zmdi-delete\"></span></div><div class=\"section-caret\" ng-class=\"{'rotate-up': ClassicAttachmentsDialogCtrl.isContentShown,\r" +
    "\n" +
    "						'rotate-down': !ClassicAttachmentsDialogCtrl.isContentShown}\"><span class=\"zmdi zmdi-chevron-up\"></span></div></div><md-divider></md-divider><div class=\"collapsible-section\" layout=\"column\" ng-show=\"ClassicAttachmentsDialogCtrl.isContentShown\"><div class=\"field-name\" ng-if=\"!ClassicAttachmentsDialogCtrl.isFromCheckIn\">{{$root.bundle.attachments.folder}}</div><div class=\"field\"><md-radio-group layout=\"row\" layout-align=\"space-between center\" ng-model=\"ClassicAttachmentsDialogCtrl.folderType\" ng-if=\"!ClassicAttachmentsDialogCtrl.isFromCheckIn\"><md-radio-button value=\"Directly Attached\"><md-label>{{$root.bundle.attachments.directlyAttached}}</md-label></md-radio-button><md-radio-button value=\"Create Folder\" class=\"attachments-disabled-radio\" disabled><md-label>{{$root.bundle.attachments.createFolder}}</md-label></md-radio-button><input type=\"text\" placeholder=\"{{$root.bundle.attachments.insertFolderName}}\" ng-disabled=\"ClassicAttachmentsDialogCtrl.folderType !== 'Create Folder'\" ng-model=\"file.folder\" class=\"attachments-dialog-radio-field\" flex/></md-radio-group></div><div class=\"field-name\" ng-if=\"!ClassicAttachmentsDialogCtrl.isFromCheckIn\">{{$root.bundle.attachments.title}}</div><div class=\"field\"><input type=\"text\" maxlength=\"200\" ng-model=\"file.title\" ng-change=\"ClassicAttachmentsDialogCtrl.checkDuplicatedTitles()\" class=\"field-input\"/></div><div class=\"field-name\">{{$root.bundle.attachments.description}}</div><div class=\"field\"><textarea class=\"field-input\" maxlength=\"400\" ng-model=\"file.description\">\r" +
    "\n" +
    "						</textarea></div></div><md-divider></md-divider></div></div></md-dialog-content><md-dialog-actions><md-button class=\"md-button\" aria-label=\"{{$root.bundle.button.cancel}}\" ng-click=\"ClassicAttachmentsDialogCtrl.closeDialog()\" ng-disabled=\"ClassicAttachmentsDialogCtrl.isUploading\"><span class=\"label\">{{$root.bundle.button.cancel}}</span></md-button><md-button class=\"md-button md-primary\" aria-label=\"{{$root.bundle.attachments.save}}\" ng-disabled=\"!ClassicAttachmentsDialogCtrl.selectedFiles.length ||\r" +
    "\n" +
    "			ClassicAttachmentsDialogCtrl.hasDuplicatedTitle ||\r" +
    "\n" +
    "			ClassicAttachmentsDialogCtrl.isUploading\" ng-click=\"ClassicAttachmentsDialogCtrl.triggerUpload()\"><span class=\"label\">{{$root.bundle.attachments.save}}</span></md-button></md-dialog-actions></md-dialog>"
  );


  $templateCache.put('components/classicAttachmentsGrid/classicAttachmentsGrid.html',
    "<div class=\"attachment-container\"><div ui-grid=\"gridOptions\" ui-grid-tree-view ui-grid-resize-columns ui-grid-move-columns ui-grid-auto-resize ui-grid-selection></div></div><script type=\"text/ng-template\" id=\"iconTemplate\"><div class=\"ui-grid-cell-contents level-{{row.entity.$$treeLevel}}\">\r" +
    "\n" +
    "		<!-- Folder -->\r" +
    "\n" +
    "		<a href=\"javascript:;\"\r" +
    "\n" +
    "			layout=\"row\"\r" +
    "\n" +
    "			layout-align=\"start center\"\r" +
    "\n" +
    "			class=\"folder-icon-container\"\r" +
    "\n" +
    "			ng-if=\"row.entity.isExpandable\"\r" +
    "\n" +
    "			ng-click=\"grid.appScope.toggleExpansion(row, grid)\">\r" +
    "\n" +
    "			<div flex=\"15\">\r" +
    "\n" +
    "				<span class=\"md folder-size\"\r" +
    "\n" +
    "					ng-class=\"{'md-folder': row.entity.isCollapsed, 'md-folder-open': !row.entity.isCollapsed}\">\r" +
    "\n" +
    "				</span>\r" +
    "\n" +
    "			</div>\r" +
    "\n" +
    "			<div flex class=\"folder-name\">{{row.entity.folderName}}</div>\r" +
    "\n" +
    "		</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<!-- Attachment without folder -->\r" +
    "\n" +
    "		<div ng-if=\"!row.entity.isExpandable\"\r" +
    "\n" +
    "			layout=\"row\"\r" +
    "\n" +
    "			layout-align=\"start center\">\r" +
    "\n" +
    "			<div flex=\"15\">\r" +
    "\n" +
    "				<span class=\"resource-icon default-icon icon-{{row.entity.icon}}-16\"></span>\r" +
    "\n" +
    "			</div>\r" +
    "\n" +
    "			<div flex class=\"resource-name\">{{row.entity.resourceName}}</div>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "	</div></script><script type=\"text/ng-template\" id=\"userLinkTemplate\"><div class=\"ui-grid-cell-contents\">\r" +
    "\n" +
    "    	<a href=\"javascript:;\"\r" +
    "\n" +
    "    		ng-click=\"grid.appScope.triggerUserProfileFlyout($event, COL_FIELD.userId)\">\r" +
    "\n" +
    "    		{{COL_FIELD.displayName}}\r" +
    "\n" +
    "    	</a>\r" +
    "\n" +
    "    </div></script><script type=\"text/ng-template\" id=\"statusTemplate\"><div class=\"ui-grid-cell-contents\">\r" +
    "\n" +
    "		{{row.entity.status}}\r" +
    "\n" +
    "	</div></script>"
  );


  $templateCache.put('components/wipAttachmentsDeleteDialog/wipAttachmentsDeleteDialog.html',
    "<md-dialog aria-label=\"Delete Attachment Confirmation\" class=\"attachment-delete-dialog\"><md-toolbar><div class=\"md-toolbar-tools\"><h2>{{$root.bundle.wip.attachments.removeItems}}</h2><span flex></span></div></md-toolbar><md-dialog-content><div class=\"md-dialog-content\"><h4>{{$root.bundle.wip.attachments.confirmRemove}} {{WipAttachmentsDeleteDialogCtrl.totalItemsSelected}} <span ng-if=\"WipAttachmentsDeleteDialogCtrl.totalItemsSelected === 1\">{{$root.bundle.wip.attachments.itemQuestion}}</span> <span ng-if=\"WipAttachmentsDeleteDialogCtrl.totalItemsSelected > 1\">{{$root.bundle.wip.attachments.itemsQuestion}}</span></h4></div></md-dialog-content><md-dialog-actions layout=\"row\"><md-button ng-click=\"WipAttachmentsDeleteDialogCtrl.closeDialog()\">{{$root.bundle.wip.attachments.cancel}}</md-button><md-button class=\"md-primary delete-button\" ng-click=\"WipAttachmentsDeleteDialogCtrl.proceedToDelete()\">{{$root.bundle.wip.attachments.remove}}</md-button></md-dialog-actions></md-dialog>"
  );


  $templateCache.put('components/wipAttachmentsGrid/wipAttachmentsGrid.html',
    "<div class=\"wip-attachment-container\"><div ng-hide=\"wipAttachmentsGridCtrl.isItemLoaded\" class=\"filebrowser-preloader opaque-overlay\"><div class=\"generic-loader\"><div class=\"bounce1\"></div><div class=\"bounce2\"></div><div class=\"bounce3\"></div></div></div><div ng-show=\"wipAttachmentsGridCtrl.isItemLoaded && !wipAttachmentsGridCtrl.tableData.length\" class=\"zero-doc-container opaque-overlay\"><img src=\"images/PLM_Tab_Empty_State_zeroState_pages.png\"><div class=\"no-attachment\">{{$root.bundle.wip.attachments.noAttachment}}</div><div class=\"click-add\" is-permitted=\"{{wipAttachmentsGridCtrl.addPermission}}\" apply-lock=\"true\" apply-revision-override-lock=\"true\">{{$root.bundle.wip.attachments.click}} <span class=\"add-button\" ng-click=\"wipAttachmentsGridCtrl.triggerAdd()\">{{$root.bundle.button.add}}</span> {{$root.bundle.wip.attachments.browserItems}}</div></div><table-data columns=\"wipAttachmentsGridCtrl.tableColumns\" rows=\"wipAttachmentsGridCtrl.tableData\" grid-api=\"wipAttachmentsGridCtrl.gridApiInterface\" selectable-rows=\"wipAttachmentsGridCtrl.isViewState()\" is-multi-select=\"true\" use-default-selection-column=\"false\" select-rows-function=\"wipAttachmentsGridCtrl.toggleRowSelection(row)\" resizable-columns resize-rows client-sorting></table-data><script type=\"text/ng-template\" id=\"indicatorTemplate\"><row-state-indicator\r" +
    "\n" +
    "			is-invalid=\"grid.appScope.wipAttachmentsGridCtrl.isTableRowInvalid(row.entity)\"\r" +
    "\n" +
    "			is-dirty=\"grid.appScope.wipAttachmentsGridCtrl.isTableRowDirty(row.entity)\">\r" +
    "\n" +
    "		</row-state-indicator></script><script type=\"text/ng-template\" id=\"checkboxHeaderTemplate\"><div class=\"ui-grid-cell-contents header-cell checkbox-column\">\r" +
    "\n" +
    "			<input type=\"checkbox\"\r" +
    "\n" +
    "				ng-disabled=\"!grid.appScope.wipAttachmentsGridCtrl.isViewState()\"\r" +
    "\n" +
    "				ng-click=\"grid.appScope.wipAttachmentsGridCtrl.toggleAllSelection()\"\r" +
    "\n" +
    "				ng-checked=\"grid.appScope.wipAttachmentsGridCtrl.gridApiInterface.selection.selectAll\">\r" +
    "\n" +
    "		</div></script><script type=\"text/ng-template\" id=\"checkboxTemplate\"><div class=\"ui-grid-cell-contents checkbox-cell\">\r" +
    "\n" +
    "			<input type=\"checkbox\"\r" +
    "\n" +
    "				ng-disabled=\"!grid.appScope.wipAttachmentsGridCtrl.isViewState()\"\r" +
    "\n" +
    "				ng-checked=\"row.isSelected === true\">\r" +
    "\n" +
    "			<span id=\"inline-menu-{{row.uid}}\">\r" +
    "\n" +
    "				<a href=\"javascript:;\" class=\"inline-actions\">\r" +
    "\n" +
    "					<span class=\"zmdi zmdi-more\"></span>\r" +
    "\n" +
    "				</a>\r" +
    "\n" +
    "				<dropdown-widget h-pos=\"right\" anchor=\"#inline-menu-{{row.uid}}\">\r" +
    "\n" +
    "					<ul>\r" +
    "\n" +
    "						<li>\r" +
    "\n" +
    "							<a href=\"javascript:;\"\r" +
    "\n" +
    "								ng-click=\"grid.appScope.wipAttachmentsGridCtrl.triggerDownload(row)\">\r" +
    "\n" +
    "								{{$root.bundle.wip.attachments.download}}\r" +
    "\n" +
    "							</a>\r" +
    "\n" +
    "						</li>\r" +
    "\n" +
    "						<li>\r" +
    "\n" +
    "							<a ng-href=\"{{grid.appScope.wipAttachmentsGridCtrl.FileOverviewService.getContainingFolderLinkWithHost(grid.appScope.wipAttachmentsGridCtrl.fileOverviewHost, row.entity.fileInfo.parentFolderUrn)}}\" ng-click=\"$event.stopPropagation();\" target=\"_blank\">\r" +
    "\n" +
    "								{{$root.bundle.wip.attachments.containingFolder}}\r" +
    "\n" +
    "							</a>\r" +
    "\n" +
    "						</li>\r" +
    "\n" +
    "					</ul>\r" +
    "\n" +
    "				</dropdown-widget>\r" +
    "\n" +
    "			</span>\r" +
    "\n" +
    "		</div></script><script type=\"text/ng-template\" id=\"attachmentDateTemplate\"><div class=\"ui-grid-cell-contents\">\r" +
    "\n" +
    "			{{COL_FIELD | date: grid.appScope.wipAttachmentsGridCtrl.dateFormat.date}}\r" +
    "\n" +
    "		</div></script><script type=\"text/ng-template\" id=\"attachmentNameTemplate\"><div class=\"ui-grid-cell-contents\">\r" +
    "\n" +
    "			<wip-file-type-icon\r" +
    "\n" +
    "				mime-type=\"{{row.entity.fileInfo.mimeType}}\"\r" +
    "\n" +
    "				size=\"16\">\r" +
    "\n" +
    "			</wip-file-type-icon>\r" +
    "\n" +
    "			<a ng-href=\"{{grid.appScope.wipAttachmentsGridCtrl.FileOverviewService.getFileOverviewLinkWithHost(\r" +
    "\n" +
    "				grid.appScope.wipAttachmentsGridCtrl.fileOverviewHost,\r" +
    "\n" +
    "				row.entity.lineageUrn,\r" +
    "\n" +
    "				row.entity.fileInfo.versionNumber)}}\"\r" +
    "\n" +
    "			   ng-click=\"$event.stopPropagation();\"\r" +
    "\n" +
    "			   target=\"_blank\">\r" +
    "\n" +
    "				{{COL_FIELD}}\r" +
    "\n" +
    "			</a>\r" +
    "\n" +
    "		</div></script><script type=\"text/ng-template\" id=\"pinningHeaderTemplate\"><div ng-if=\"grid.appScope.wipAttachmentsGridCtrl.isViewState()\"\r" +
    "\n" +
    "			class=\"ui-grid-cell-contents header-cell center-cell-contents\">\r" +
    "\n" +
    "			<span class=\"icon-a360-pin\"></span>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "		<div ng-if=\"!grid.appScope.wipAttachmentsGridCtrl.isViewState()\"\r" +
    "\n" +
    "			class=\"ui-grid-cell-contents header-cell\">\r" +
    "\n" +
    "			<span>{{$root.bundle.wip.attachments.pinningPolicy}}</span>\r" +
    "\n" +
    "		</div></script><script type=\"text/ng-template\" id=\"pinningTemplate\"><div class=\"ui-grid-cell-contents center-cell-contents tooltip\"\r" +
    "\n" +
    "			wip-attachment-tooltip\r" +
    "\n" +
    "			ng-if=\"grid.appScope.wipAttachmentsGridCtrl.isViewState()\">\r" +
    "\n" +
    "				<span ng-if=\"row.entity.showPin\" class=\"icon-a360-pin\"></span>\r" +
    "\n" +
    "				<span ng-if=\"!row.entity.showPin\">--</span>\r" +
    "\n" +
    "				<div class=\"tooltip-content pinning-tooltip\" ng-class=\"{'has-pinned-version' : row.entity.attachment.getPinnedVersion()}\">\r" +
    "\n" +
    "					<div class=\"arrow\"></div>\r" +
    "\n" +
    "					<div>\r" +
    "\n" +
    "						<div>\r" +
    "\n" +
    "							<span class=\"title\">\r" +
    "\n" +
    "								{{$root.bundle.wip.attachments.pinningPolicy}}:\r" +
    "\n" +
    "							</span>\r" +
    "\n" +
    "							<span class=\"info\">\r" +
    "\n" +
    "								{{row.entity.attachment.getPinningPolicy()}}\r" +
    "\n" +
    "							</span>\r" +
    "\n" +
    "						</div>\r" +
    "\n" +
    "						<div ng-if=\"row.entity.attachment.getPinnedVersion()\">\r" +
    "\n" +
    "							<span class=\"title\">\r" +
    "\n" +
    "								{{$root.bundle.wip.attachments.pinnedVersion}}:\r" +
    "\n" +
    "							</span>\r" +
    "\n" +
    "							<span class=\"info\">\r" +
    "\n" +
    "								{{row.entity.attachment.getPinnedVersion()}}\r" +
    "\n" +
    "							</span>\r" +
    "\n" +
    "						</div>\r" +
    "\n" +
    "						<div>\r" +
    "\n" +
    "							<span class=\"title\">\r" +
    "\n" +
    "								{{$root.bundle.wip.attachments.latestVersion}}:\r" +
    "\n" +
    "							</span>\r" +
    "\n" +
    "							<span class=\"info\">\r" +
    "\n" +
    "								{{row.entity.attachment.getVersion()}}\r" +
    "\n" +
    "							</span>\r" +
    "\n" +
    "						</div>\r" +
    "\n" +
    "					</div>\r" +
    "\n" +
    "				</div>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "		<div class=\"ui-grid-cell-contents cell-state-indicator\"\r" +
    "\n" +
    "			ng-if=\"!grid.appScope.wipAttachmentsGridCtrl.isViewState()\">\r" +
    "\n" +
    "			<cell-state-indicator\r" +
    "\n" +
    "				is-dirty=\"{{COL_FIELD.isDirty()}}\"\r" +
    "\n" +
    "				error-message=\"COL_FIELD.serverError\">\r" +
    "\n" +
    "				<field-selector\r" +
    "\n" +
    "					field-id=\"{{COL_FIELD.fieldId}}\"\r" +
    "\n" +
    "					field-data=\"COL_FIELD\"\r" +
    "\n" +
    "					field-meta=\"col.colDef.fieldMeta\"\r" +
    "\n" +
    "					type-id=\"col.colDef.dataType\"\r" +
    "\n" +
    "					edit-on-click=\"{{!grid.appScope.wipAttachmentsGridCtrl.isViewState()}}\"\r" +
    "\n" +
    "					placeholder=\"{{COL_FIELD.placeholder}}\"\r" +
    "\n" +
    "					simple-select=\"true\"\r" +
    "\n" +
    "					picklist-on-change=\"row.entity.onPinningPolicyChange(row)\"\r" +
    "\n" +
    "					waiting=\"\">\r" +
    "\n" +
    "				</field-selector>\r" +
    "\n" +
    "			</cell-state-indicator>\r" +
    "\n" +
    "		</div></script><script type=\"text/ng-template\" id=\"versionTemplate\"><div class=\"ui-grid-cell-contents\"\r" +
    "\n" +
    "			ng-if=\"grid.appScope.wipAttachmentsGridCtrl.isViewState()\">\r" +
    "\n" +
    "			{{row.entity.fileInfo.version.value.title}}\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "		<div class=\"ui-grid-cell-contents cell-state-indicator\"\r" +
    "\n" +
    "			wip-attachment-tooltip\r" +
    "\n" +
    "			prevent-default-tooltip=\"{{row.entity.pinningPolicy.value.title !== 'To Version'}}\"\r" +
    "\n" +
    "			ng-class=\"{'tooltip': row.entity.pinningPolicy.value.title !== 'To Version'}\"\r" +
    "\n" +
    "			ng-if=\"!grid.appScope.wipAttachmentsGridCtrl.isViewState()\">\r" +
    "\n" +
    "				<cell-state-indicator\r" +
    "\n" +
    "					is-dirty=\"{{COL_FIELD.isDirty()}}\"\r" +
    "\n" +
    "					error-message=\"COL_FIELD.serverError\">\r" +
    "\n" +
    "					<field-selector\r" +
    "\n" +
    "						field-id=\"{{COL_FIELD.fieldId}}\"\r" +
    "\n" +
    "						field-data=\"COL_FIELD\"\r" +
    "\n" +
    "						field-meta=\"row.entity.fileInfo.version.fieldMetadata\"\r" +
    "\n" +
    "						type-id=\"col.colDef.dataType\"\r" +
    "\n" +
    "						edit-on-click=\"{{!grid.appScope.wipAttachmentsGridCtrl.isViewState() && row.entity.pinningPolicy.value.title === 'To Version'}}\"\r" +
    "\n" +
    "						placeholder=\"{{COL_FIELD.placeholder}}\"\r" +
    "\n" +
    "						simple-select=\"true\"\r" +
    "\n" +
    "						waiting=\"\">\r" +
    "\n" +
    "					</field-selector>\r" +
    "\n" +
    "				</cell-state-indicator>\r" +
    "\n" +
    "				<div class=\"tooltip-content\">\r" +
    "\n" +
    "					<div class=\"arrow\"></div>\r" +
    "\n" +
    "					<span class=\"info\">{{$root.bundle.wip.attachments.versionLocked}}</span>\r" +
    "\n" +
    "				</div>\r" +
    "\n" +
    "		</div></script><script type=\"text/ng-template\" id=\"attachmentTypeNameTemplate\"><div class=\"ui-grid-cell-contents\">\r" +
    "\n" +
    "			<wip-file-type-name mime-type=\"{{row.entity.fileInfo.mimeType}}\" extension=\"{{row.entity.fileInfo.fileType}}\"></wip-file-type-name>\r" +
    "\n" +
    "		</div></script></div>"
  );


  $templateCache.put('components/wipAttachmentsList/wipAttachmentsList.html',
    "<div class=\"attachment-list\"><md-list ng-if=\"wipAttachmentsListCtrl.attachmentList.length\"><md-list-item class=\"md-3-line\" ng-repeat=\"attachment in wipAttachmentsListCtrl.attachmentList\"><wip-file-type-icon mime-type=\"{{attachment.fileInfo.mimeType}}\" size=\"32\"></wip-file-type-icon><div class=\"md-list-item-text\"><div layout=\"row\"><div class=\"attachment-info\"><p><a ng-href=\"{{wipAttachmentsListCtrl.getFileOverviewUri && wipAttachmentsListCtrl.getFileOverviewUri(attachment.fileInfo.urn, attachment.fileInfo.version)}}\" target=\"_blank\">{{attachment.fileInfo.name}}</a></p><p>{{$root.bundle.wip.attachments.version}}: {{attachment.fileInfo.version}}</p><p>{{$root.bundle.wip.attachments.type}}: {{attachment.fileInfo.fileType}}</p></div><div flex></div><div flex=\"15\" class=\"attachment-actions\" layout=\"row\"><div><a ng-href=\"{{wipAttachmentsListCtrl.getFolderUri && wipAttachmentsListCtrl.getFolderUri(attachment.fileInfo.parentFolderUrn)}}\" target=\"_blank\" title=\"{{$root.bundle.wip.attachments.containingFolder}}\"><span class=\"icon-OpenFile wip-file-actions-icon\"></span></a></div><div flex></div><div><a href=\"javascript:;\" title=\"{{$root.bundle.wip.attachments.download}}\" ng-click=\"wipAttachmentsListCtrl.triggerSingleDownload(attachment)\"><span class=\"zmdi zmdi-download wip-file-actions-icon\"></span></a></div></div></div></div><md-divider ng-if=\"!$last\"></md-divider></md-list-item></md-list><div ng-hide=\"wipAttachmentsListCtrl.attachmentList.length\" class=\"opaque-overlay\"><div class=\"generic-loader\"><div class=\"bounce1\"></div><div class=\"bounce2\"></div><div class=\"bounce3\"></div></div></div></div>"
  );


  $templateCache.put('components/wipAttachmentsTooltip/wipAttachmentsTooltip.html',
    "<div ng-transclude ng-mouseenter=\"positionTooltip($event)\" ng-mouseleave=\"hideTooltip($event)\"></div>"
  );


  $templateCache.put('components/wipFileBrowserDialog/wipFileBrowserDialog.html',
    "<md-dialog aria-label=\"{{$root.bundle.wip.attachments.addAttachment}}\" class=\"wip-file-browser-dialog\"><md-toolbar><div class=\"md-toolbar-tools\"><h2>{{$root.bundle.wip.attachments.addAttachment}}</h2><span flex></span> <a href=\"#\" ng-click=\"wipFileBrowserDialogCtrl.closeDialog()\"><span class=\"zmdi zmdi-close\"></span></a></div></md-toolbar><md-divider></md-divider><md-dialog-content><div class=\"md-dialog-content\"><wip-file-browser selected-files=\"wipFileBrowserDialogCtrl.selectedFiles\"></wip-file-browser></div><md-divider></md-divider></md-dialog-content><md-dialog-actions><md-button class=\"md-button\" aria-label=\"{{$root.bundle.button.cancel}}\" ng-click=\"wipFileBrowserDialogCtrl.closeDialog()\"><span class=\"label\">{{$root.bundle.button.cancel}}</span></md-button><md-button class=\"md-button md-primary\" aria-label=\"{{$root.bundle.button.add}}\" ng-disabled=\"!wipFileBrowserDialogCtrl.selectedFiles.size\" ng-click=\"wipFileBrowserDialogCtrl.triggerAdd()\"><span class=\"label\">{{$root.bundle.button.add}}</span></md-button></md-dialog-actions></md-dialog>"
  );
}]);