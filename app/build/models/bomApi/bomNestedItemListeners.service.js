System.registerModule("com/autodesk/models/bomApi/bomNestedItemListeners.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomApi/bomNestedItemListeners.service.js";
  var BomNestedItemListeners = function() {
    function BomNestedItemListeners(BomNestedItem, BomMessageService, EventService, UrlParser) {
      this.BomNestedItem = BomNestedItem;
      this.BomMessageService = BomMessageService;
      this.EventService = EventService;
      this.UrlParser = UrlParser;
      this.getListener = this.registerGetListener();
      this.addListener = this.registerAddListener();
      this.editListener = this.registerEditListener();
      this.deleteListener = this.registerDeleteListener();
    }
    return ($traceurRuntime.createClass)(BomNestedItemListeners, {
      registerGetListener: function() {
        var $__2 = this;
        return this.EventService.listen('bomNestedItem:*:get', function(event) {
          var $__4;
          for (var args = [],
              $__3 = 1; $__3 < arguments.length; $__3++)
            args[$__3 - 1] = arguments[$__3];
          ($__4 = $__2).respondToGetListener.apply($__4, $traceurRuntime.spread([event], args));
        });
      },
      respondToGetListener: function(event, link, params) {
        var $__2 = this;
        this.BomNestedItem.fetch(link, params).then(function(obj) {
          $__2.EventService.send($__2.BomMessageService.getBomNestedItemFetchSuccessMessage($__2.BomMessageService.extractEventId(event)), obj);
        });
      },
      registerAddListener: function() {
        var $__2 = this;
        return this.EventService.listen('bomNestedItem:*:add', function(event) {
          var $__4;
          for (var args = [],
              $__3 = 1; $__3 < arguments.length; $__3++)
            args[$__3 - 1] = arguments[$__3];
          ($__4 = $__2).respondToAddListener.apply($__4, $traceurRuntime.spread([event], args));
        });
      },
      respondToAddListener: function(event, link, json, configuration) {
        var $__2 = this;
        var model = new this.BomNestedItem(json);
        this.BomNestedItem.add(link, model).then(function(response) {
          var url = $__2.UrlParser.parse(response.location).pathname.replace(/^\//, '');
          $__2.BomNestedItem.fetch(url, configuration).then(function(obj) {
            $__2.EventService.send($__2.BomMessageService.getBomChangeSuccessMessage('add', $__2.BomMessageService.extractEventId(event)), obj);
          });
        }, function(error) {
          $__2.EventService.send($__2.BomMessageService.getBomChangeFailureMessage('add', $__2.BomMessageService.extractEventId(event)), error);
        });
      },
      registerEditListener: function() {
        var $__2 = this;
        return this.EventService.listen('bomNestedItem:*:edit', function(event) {
          var $__4;
          for (var args = [],
              $__3 = 1; $__3 < arguments.length; $__3++)
            args[$__3 - 1] = arguments[$__3];
          ($__4 = $__2).respondToEditListener.apply($__4, $traceurRuntime.spread([event], args));
        });
      },
      respondToEditListener: function(event, json) {
        var $__2 = this;
        var model = new this.BomNestedItem(json);
        this.BomNestedItem.edit(model).then(function(response) {
          $__2.EventService.send($__2.BomMessageService.getBomChangeSuccessMessage('edit', $__2.BomMessageService.extractEventId(event)));
        }, function(error) {
          $__2.EventService.send($__2.BomMessageService.getBomChangeFailureMessage('edit', $__2.BomMessageService.extractEventId(event)), error);
        });
      },
      registerDeleteListener: function() {
        var $__2 = this;
        return this.EventService.listen('bomNestedItem:*:remove', function(event) {
          var $__4;
          for (var args = [],
              $__3 = 1; $__3 < arguments.length; $__3++)
            args[$__3 - 1] = arguments[$__3];
          ($__4 = $__2).respondToDeleteListener.apply($__4, $traceurRuntime.spread([event], args));
        });
      },
      respondToDeleteListener: function(event, json) {
        var $__2 = this;
        var model = new this.BomNestedItem({__self__: json.__self__});
        this.BomNestedItem.delete(model).then(function(response) {
          $__2.EventService.send($__2.BomMessageService.getBomChangeSuccessMessage('remove', $__2.BomMessageService.extractEventId(event)));
        }, function(error) {
          $__2.EventService.send($__2.BomMessageService.getBomChangeFailureMessage('remove', $__2.BomMessageService.extractEventId(event)), error);
        });
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, []).service('BomNestedItemListeners', ['BomNestedItem', 'BomMessageService', 'EventService', 'UrlParser', BomNestedItemListeners]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomApi/bomNestedItemListeners.service.js
