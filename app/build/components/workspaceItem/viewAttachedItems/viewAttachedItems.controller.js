System.registerModule("com/autodesk/components/workspaceItem/viewAttachedItems/viewAttachedItems.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewAttachedItems/viewAttachedItems.controller.js";
  var ViewAttachedItemsController = function() {
    function ViewAttachedItemsController($rootScope, $scope, $flyoutInstance, $state, RESTWrapperService, WipApiService, FileOverviewService, App, attachmentsObj, UrnParser) {
      var $__2 = this;
      this.$scope = $scope;
      this.$flyoutInstance = $flyoutInstance;
      this.FileOverviewService = FileOverviewService;
      this.App = new App();
      this.$state = $state;
      this.UrnParser = UrnParser;
      this.attachmentsObj = attachmentsObj;
      this.workspaceId = attachmentsObj.value.workspaceId;
      this.itemId = attachmentsObj.value.itemId;
      this.attachmentsCount = attachmentsObj.value.count;
      this.goAttachmentsLink = this.$state.href('attachments', {
        tab: 'attachments',
        view: 'full',
        mode: 'view',
        itemId: this.UrnParser.encode(attachmentsObj.value.itemUrn)
      });
      this.flyoutState = '';
      $flyoutInstance.opened.then(function() {
        $__2.flyoutState = 'open';
      });
      $scope.$on('$destroy', function() {});
      RESTWrapperService.get(this.App.hubs.link).then(function(response) {
        $__2.FileOverviewService.setHost(response.items[0].links.link.href);
      });
      RESTWrapperService.get(this.App.wipBase.link).then(function(response) {
        WipApiService.setHost(response.value);
      });
    }
    return ($traceurRuntime.createClass)(ViewAttachedItemsController, {
      cancelSelection: function() {
        this.$flyoutInstance.cancel();
      },
      goToAttachment: function() {
        this.$state.go('attachments', {
          tab: 'attachments',
          view: 'full',
          mode: 'view',
          itemId: this.UrnParser.encode(this.attachmentsObj.value.itemUrn)
        });
      }
    }, {});
  }();
  var $__default = ViewAttachedItemsController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewAttachedItems/viewAttachedItems.controller.js
