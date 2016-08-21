System.registerModule("com/autodesk/models/bomViewDefinition/viewDefinition.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomViewDefinition/viewDefinition.model.js";
  var BomUIFieldSemantics = System.get("com/autodesk/models/bomFields/BomUIFieldSemantics.service.js").default;
  var ViewDefinition = function() {
    function ViewDefinition(json) {
      if (json) {
        this.__self__ = json.__self__;
        this.name = json.name;
        this.isDefault = json.isDefault;
        this.id = json.id;
        this.fields = json.fields;
      }
      this.fieldsMap = new Map();
      this.fieldsArray = [];
      this.json = json;
    }
    return ($traceurRuntime.createClass)(ViewDefinition, {
      getLink: function() {
        return this.__self__.link;
      },
      getUrn: function() {
        return this.__self__.urn;
      },
      getTitle: function() {
        return this.name;
      },
      isDefaultView: function() {
        return this.isDefault;
      },
      hasAttachmentField: function() {
        return this.getFields().some(function(field) {
          return field.getFieldSemantics() === BomUIFieldSemantics.ATTACHMENTS;
        });
      },
      getFieldWithSemantics: function(semantics) {
        return this.getFields().find(function(field) {
          return field.getFieldSemantics() === semantics;
        });
      },
      getId: function() {
        return this.id;
      },
      getField: function(urn) {
        return this.fieldsMap.get(urn);
      },
      getFields: function() {
        return this.fieldsArray;
      },
      getFieldsMap: function() {
        return this.fieldsMap;
      },
      getEdgeFields: function() {
        return this.getFields().filter(function(field) {
          return field.isBomField();
        });
      },
      getNodeFields: function() {
        return this.getFields().filter(function(field) {
          return !field.isBomField();
        });
      },
      loadFields: function() {
        var $__3 = this;
        var deferred = ViewDefinition.$q.defer();
        var expectedFieldsCount = this.fields.length;
        var checkCompleted = function() {
          if ($__3.fieldsArray.length === expectedFieldsCount) {
            $__3.fieldsArray.sort(function(f1, f2) {
              return f1.getDisplayOrder() - f2.getDisplayOrder();
            });
            deferred.resolve();
          }
        };
        this.fields.forEach(function(field) {
          var urn = ViewDefinition.UrnParser.encode(field.urn);
          var responseMessage = ViewDefinition.BomMessageService.getViewDefFieldRecievedMessage(urn);
          var viewDefFieldListenerId = ViewDefinition.EventService.listen(responseMessage, function(event, viewDefField) {
            ViewDefinition.EventService.unlisten(viewDefFieldListenerId);
            $__3.fieldsMap.set(viewDefField.getUrn(), viewDefField);
            $__3.fieldsArray.push(viewDefField);
            checkCompleted();
          });
          ViewDefinition.EventService.send(ViewDefinition.BomMessageService.getViewDefFieldGetMessage(urn), field.link.replace(/^\//, ''));
        });
        return deferred.promise;
      }
    }, {fetch: function(link, params) {
        var model = null;
        return ViewDefinition.RESTWrapperService.get(link, null, params, {skipCache: true}).then(function(payload) {
          model = new ViewDefinition(payload);
          return model.loadFields();
        }).then(function() {
          return model;
        });
      }});
  }();
  var ViewDefinitionFactory = function($q, RESTWrapperService, EventService, UrnParser, BomMessageService) {
    ViewDefinition.$q = $q;
    ViewDefinition.RESTWrapperService = RESTWrapperService;
    ViewDefinition.EventService = EventService;
    ViewDefinition.UrnParser = UrnParser;
    ViewDefinition.BomMessageService = BomMessageService;
    return ViewDefinition;
  };
  var $__default = angular.module(__moduleName, []).factory('ViewDefinition', ['$q', 'RESTWrapperService', 'EventService', 'UrnParser', 'BomMessageService', ViewDefinitionFactory]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomViewDefinition/viewDefinition.model.js
