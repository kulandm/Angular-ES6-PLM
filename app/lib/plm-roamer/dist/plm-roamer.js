System.registerModule("com/autodesk/roamer.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/roamer.controller.js";
  var RoamerController = function() {
    function RoamerController($stateParams, $state, UrnParser) {
      var $__2 = this;
      this.itemUrn = $stateParams.itemUrn;
      this.itemTab = $stateParams.itemTab || 'details';
      this.$state = $state;
      this.UrnParser = UrnParser;
      this.itemUrn = this.UrnParser.encode(this.itemUrn);
      var workspaceId = null;
      this.extractWorkspaceIdFromUrn = function() {
        return ($__2.itemUrn.split(','))[4];
      };
      this.myStateHref = $state.href(this.itemTab, {
        workspaceId: this.extractWorkspaceIdFromUrn(),
        itemId: this.itemUrn,
        tab: this.itemTab,
        view: 'split',
        mode: 'view'
      });
    }
    return ($traceurRuntime.createClass)(RoamerController, {}, {});
  }();
  var $__default = RoamerController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/roamer.controller.js
;

System.registerModule("com/autodesk/roamer.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/roamer.directive.js";
  var RoamerTree = function() {
    function RoamerTree($timeout, RoamerService, $state, $window, UrnParser, $location) {
      this.restrict = 'E';
      this.scope = {item: '='};
      RoamerTree.$timeout = $timeout;
      RoamerTree.RoamerService = RoamerService;
      RoamerTree.state = $state;
      RoamerTree.window = $window;
      RoamerTree.UrnParser = UrnParser;
      RoamerTree.location = $location;
    }
    return ($traceurRuntime.createClass)(RoamerTree, {link: function(scope, el) {
        var i = 0;
        var width = 0;
        var height = 0;
        var initialTop;
        var initialLeft;
        var boxWidth;
        var boxHeight;
        var labelWidth;
        var labelHeight;
        var labelHorizontalPosition;
        var workflowNameVerticalPosition;
        var stateNameVerticalPosition;
        var workspaceNameVerticalPosition;
        var symbolCenterPosition;
        var boxHorizontalSpace;
        var boxVerticalSpace;
        var isAnimationEnabled = !RoamerTree.location.search().noAnimations;
        var duration = isAnimationEnabled ? 750 : 0;
        var root;
        var tree;
        var diagonal;
        var diagonalStokeDasharray = '6,6';
        var zoom;
        var svg;
        var plusIconCode = '\uf0fb';
        var minusIconCode = '\uf111';
        var service = RoamerTree.RoamerService;
        var state = RoamerTree.state;
        var UrnParser = RoamerTree.UrnParser;
        function isOddNumber(x) {
          return (x % 2) ? true : false;
        }
        function getBoxWidth(depth) {
          return !isOddNumber(depth) ? boxWidth : labelWidth;
        }
        function getBaseHorizontalPosition(depth) {
          return !isOddNumber(depth) ? 0 : labelHorizontalPosition;
        }
        function takeMeasures() {
          height = el[0].offsetHeight;
          width = el[0].offsetWidth;
          initialTop = 78;
          initialLeft = 50;
          boxWidth = 200;
          boxHeight = 70;
          labelWidth = 75;
          labelHeight = 35;
          labelHorizontalPosition = 62;
          boxHorizontalSpace = 30;
          boxVerticalSpace = 3;
          workflowNameVerticalPosition = 0.7;
          stateNameVerticalPosition = 0.7;
          workspaceNameVerticalPosition = 2.2;
          symbolCenterPosition = 9;
          if ((width === 0 || height === 0) && !scope.testing) {
            RoamerTree.$timeout(function() {
              takeMeasures();
            }, 20);
          } else {
            tree = d3.layout.tree().nodeSize([(boxHeight + boxVerticalSpace), boxWidth]);
            diagonal = d3.svg.diagonal().projection(function(d) {
              return [d.y, d.x];
            });
            d3.scale.linear().domain([-height / 2, height / 2]).range([height, 0]);
            zoom = d3.behavior.zoom().scaleExtent([0.5, 8]).on('zoom', zoomed);
            svg = d3.select(el[0]).append('svg').append('g').call(zoom).append('g');
            svg.append('rect').attr('class', 'overlay');
            service.register(scope.item).then(function(itemData) {
              var data = itemData.getFullList();
              root = {
                urn: UrnParser.encode(data.urn),
                name: data.title,
                state: data.currentState ? data.currentState.title : '',
                workspace: data.workspace.title,
                workspaceId: data.workspace.link.split('/')[4],
                x: 0,
                x0: initialTop,
                y0: initialLeft
              };
              collapse(root);
              update(root);
            });
            d3.select(self.frameElement).style('height', height + 'px');
          }
        }
        function zoomed() {
          svg.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
        }
        function collapse(d) {
          if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
          }
        }
        function update(source) {
          var nodes = tree.nodes(root).reverse(),
              links = tree.links(nodes),
              node,
              nodeEnter,
              nodeUpdate,
              nodeExit,
              link,
              nodeMap = {};
          nodes.forEach(function(d) {
            if (!nodeMap[d.depth] || d.x < nodeMap[d.depth]) {
              nodeMap[d.depth] = d.x - initialTop;
            }
          });
          nodes.forEach(function(d) {
            d.y = d.depth * (boxWidth + boxHorizontalSpace);
            d.x -= nodeMap[d.depth];
          });
          node = svg.selectAll('g.node').data(nodes, function(d) {
            return d.id || (d.id = ++i);
          });
          nodeEnter = node.enter().append('g').attr('class', function(d) {
            return 'node depth_' + d.depth;
          }).attr('transform', function(d) {
            return 'translate(' + source.y0 + ',' + source.x0 + ')';
          });
          var newElement = nodeEnter.append('g').attr('is-box-container', function(d) {
            return !isOddNumber(d.depth);
          }).on('click', function(d) {
            if (d3.event.defaultPrevented) {
              return;
            } else if (!isOddNumber(d.depth)) {
              openViewItemDetailsTab(d);
            }
          });
          newElement.append('rect').attr('x', function(d) {
            return !isOddNumber(d.depth) ? 0 : labelHorizontalPosition;
          }).attr('y', function(d) {
            return !isOddNumber(d.depth) ? -(boxHeight / 2) : -(labelHeight / 2);
          }).attr('rx', 5).attr('ry', 5).attr('width', function(d) {
            return !isOddNumber(d.depth) ? boxWidth : labelWidth;
          }).attr('height', function(d) {
            return !isOddNumber(d.depth) ? boxHeight : labelHeight;
          }).attr('class', function(d) {
            return !isOddNumber(d.depth) ? 'blue' : 'white';
          }).append('svg:title').text(function(d) {
            return d.name;
          });
          newElement.append('text').attr('class', function(d) {
            return !isOddNumber(d.depth) ? 'item-name' : 'rel-type item-name';
          }).attr('x', function(d) {
            return d.children || d._children ? boxWidth / 2 : boxWidth / 2;
          }).attr('dy', function(d) {
            return !isOddNumber(d.depth) ? -workflowNameVerticalPosition + 'em' : (workflowNameVerticalPosition / 2) + 'em';
          }).attr('text-anchor', 'middle').text(function(d) {
            return service.truncate(d.name, !isOddNumber(d.depth) ? 20 : 10);
          }).append('svg:title').text(function(d) {
            return d.name;
          }).attr('item-descriptor-full', true);
          newElement.append('text').attr('class', 'item-state').attr('x', function(d) {
            return d.children || d._children ? boxWidth / 2 : boxWidth / 2;
          }).attr('dy', stateNameVerticalPosition + 'em').attr('text-anchor', 'middle').text(function(d) {
            return service.truncate(d.state);
          }).append('svg:title').text(function(d) {
            return d.state;
          }).attr('state-name', true);
          newElement.append('text').attr('class', 'item-workspace').attr('x', function(d) {
            return d.children || d._children ? boxWidth / 2 : boxWidth / 2;
          }).attr('dy', workspaceNameVerticalPosition + 'em').attr('text-anchor', 'middle').text(function(d) {
            return service.truncate(d.workspace, 30);
          }).append('svg:title').text(function(d) {
            return d.workspace;
          }).attr('workspace-name', true);
          nodeEnter.append('text').attr('class', 'symbol').text(function(d) {
            return !isOddNumber(d.depth) ? plusIconCode : '';
          }).attr('transform', function(d) {
            return !isOddNumber(d.depth) ? 'translate(' + (boxWidth + symbolCenterPosition) + ',' + symbolCenterPosition + ')' : 'translate(' + (labelWidth * 2) + ',' + symbolCenterPosition + ')';
          }).on('click', function(d) {
            if (d3.event.defaultPrevented) {
              return;
            } else {
              expandTree(d, d3.event.target);
            }
          });
          nodeUpdate = node.transition().duration(duration).attr('transform', function(d) {
            return 'translate(' + d.y + ',' + d.x + ')';
          });
          nodeUpdate.select('text').style('fill-opacity', 1);
          nodeUpdate.select('text.symbol').style('fill-opacity', 1);
          nodeExit = node.exit().transition().duration(duration).attr('transform', function(d) {
            return 'translate(' + source.y + ',' + source.x + ')';
          }).remove();
          nodeExit.select('rect').attr('x', 0).attr('y', -(boxHeight / 2)).attr('width', boxWidth).attr('height', boxHeight).attr('class', 'exit');
          nodeExit.select('text').style('fill-opacity', 1e-6);
          link = svg.selectAll('path.link').data(links, function(d) {
            return d.target.id;
          });
          link.enter().insert('path', 'g').attr('class', 'link').attr('stroke-dasharray', diagonalStokeDasharray).attr('d', function(d) {
            var source = {
              x: d.source.x,
              y: d.source.y,
              xTransition: d.source.x,
              yTransition: d.source.y + getBoxWidth(d.source.depth) + getBaseHorizontalPosition(d.source.depth)
            };
            var target = {
              x: d.source.x,
              y: d.source.y,
              xTransition: d.target.x,
              yTransition: d.target.y + getBaseHorizontalPosition(d.target.depth)
            };
            return diagonal({
              source: source,
              target: target
            });
          }).transition().duration(duration).attr('d', function(d) {
            var source = {
              x: d.source.xTransition,
              y: d.source.yTransition
            };
            var target = {
              x: d.target.xTransition,
              y: d.target.yTransition
            };
            return diagonal({
              source: source,
              target: target
            });
          });
          link.transition().duration(duration).attr('d', function(d) {
            var source = {
              x: d.source.x,
              y: d.source.y + getBoxWidth(d.source.depth) + getBaseHorizontalPosition(d.source.depth)
            };
            var target = {
              x: d.target.x,
              y: d.target.y + getBaseHorizontalPosition(d.target.depth)
            };
            return diagonal({
              source: source,
              target: target
            });
          });
          link.exit().transition().duration(duration).attr('stroke-dasharray', diagonalStokeDasharray).attr('d', function(d) {
            var o = {
              x: source.x,
              y: source.y
            };
            return diagonal({
              source: o,
              target: o
            });
          }).remove();
          nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
          });
        }
        function expandTree(d, target) {
          var self = d3.select(target);
          service.register(scope.item).then(function() {
            service.getRootRelationships(d).then(function(branches) {
              branches.forEach(function(branch) {
                service.addBranchToParent(d, branch);
              });
              if (d.children) {
                d._children = d.children;
                d.children = null;
                d.symbol = 'cross';
                self.text(plusIconCode);
              } else {
                d.children = d._children;
                d._children = null;
                d.symbol = 'circle';
                self.text(minusIconCode);
              }
              update(d);
            });
          });
        }
        function openViewItemDetailsTab(d) {
          RoamerTree.RoamerService.loadSplitViewItem(d.urn);
          state.go('details-view-roamer', {
            workspaceId: d.workspaceId,
            itemId: d.urn,
            tab: 'details',
            view: 'split',
            mode: 'view'
          });
        }
        service.getTabNames(scope.item).then(function(tabs) {
          takeMeasures();
        });
      }}, {directiveFactory: function($timeout, RoamerService, $state, $window, UrnParser, $location) {
        RoamerTree.instance = new RoamerTree($timeout, RoamerService, $state, $window, UrnParser, $location);
        return RoamerTree.instance;
      }});
  }();
  RoamerTree.directiveFactory.$inject = ['$timeout', 'RoamerService', '$state', '$window', 'UrnParser', '$location'];
  var $__default = RoamerTree;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/roamer.directive.js
;

System.registerModule("com/autodesk/roamer.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/roamer.js";
  System.get("com/autodesk/EventService.js");
  System.get("com/autodesk/apiModelsManager.js");
  System.get("com/autodesk/UrnParser.js");
  var RoamerController = System.get("com/autodesk/roamer.controller.js").default;
  var RoamerTree = System.get("com/autodesk/roamer.directive.js").default;
  var RoamerResize = System.get("com/autodesk/roamer.resize.directive.js").default;
  var RoamerService = System.get("com/autodesk/roamer.service.js").default;
  angular.module(__moduleName, ['com/autodesk/EventService.js', 'com/autodesk/apiModelsManager.js', 'com/autodesk/UrnParser.js']).directive('roamerTree', RoamerTree.directiveFactory).directive('roamerResize', RoamerResize.directiveFactory).controller('RoamerController', RoamerController).factory('RoamerService', ['EventService', 'ModelsManager', '$q', 'UrnParser', 'PLMPermissions', 'PermissionService', '_', function(EventService, ModelsManager, $q, UrnParser, PLMPermissions, PermissionService, _) {
    return new RoamerService(EventService, ModelsManager, $q, UrnParser, PLMPermissions, PermissionService, _);
  }]);
  return {};
});
//# sourceURL=com/autodesk/roamer.js
;

System.registerModule("com/autodesk/roamer.resize.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/roamer.resize.directive.js";
  var RoamerResize = function() {
    function RoamerResize($window, $timeout, _) {
      RoamerResize.$window = $window;
      RoamerResize.$timeout = $timeout;
      RoamerResize._ = _;
    }
    return ($traceurRuntime.createClass)(RoamerResize, {link: function(scope, element) {
        function restyle() {
          if (element[0].offsetTop === 0) {
            RoamerResize.$timeout(function() {
              restyle();
            }, 10);
          } else {
            var magicNumber = 27;
            var offsetTop = element[0].offsetTop + magicNumber;
            scope.style = {
              height: ((RoamerResize.$window.innerHeight - offsetTop) + "px"),
              width: (RoamerResize.$window.innerWidth + "px")
            };
          }
        }
        $(RoamerResize.$window).on('resize.doResize', RoamerResize._.throttle(function() {
          scope.$apply(function() {
            restyle();
          });
        }, 10));
        scope.$on('$destroy', function() {
          $(RoamerResize.$window).off('resize.doResize');
        });
        restyle();
      }}, {directiveFactory: function($window, $timeout, _) {
        RoamerResize.instance = new RoamerResize($window, $timeout, _);
        return RoamerResize.instance;
      }});
  }();
  RoamerResize.directiveFactory.$inject = ['$window', '$timeout', '_'];
  var $__default = RoamerResize;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/roamer.resize.directive.js
;

System.registerModule("com/autodesk/roamer.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/roamer.service.js";
  var RoamerService = function() {
    function RoamerService(EventService, ModelsManager, $q, UrnParser, PLMPermissions, PermissionService, _) {
      this.EventService = EventService;
      this.ModelsManager = ModelsManager;
      this.$q = $q;
      this.UrnParser = UrnParser;
      this.PLMPermissions = PLMPermissions;
      this.PermissionService = PermissionService;
      this._ = _;
      this.item = null;
      this.urn = null;
      this.permissions = [{
        id: this.PLMPermissions.VIEW_BOM,
        handler: this.getBomRelatedItems.bind(this)
      }, {
        id: this.PLMPermissions.VIEW_RELATIONSHIPS,
        handler: this.getRelationshipsItems.bind(this)
      }, {
        id: this.PLMPermissions.VIEW_PROJECT_MANAGEMENT,
        handler: this.getProjectManagementItems.bind(this)
      }];
      this.fieldRelationshipHandlers = {
        23: this.createBranchFromObjectValue.bind(this),
        27: this.createBranchFromArrayValue.bind(this),
        26: this.createBranchFromObjectValue.bind(this)
      };
    }
    return ($traceurRuntime.createClass)(RoamerService, {
      createBranchFromObjectValue: function(field) {
        var $__2 = this;
        if (!(angular.isObject(field.value) && field.value.urn)) {
          return null;
        }
        return this.getItem(field.value.urn).then(function(relatedItem) {
          return $__2.getBranchFromCollection(field.title, [$__2.parseJsonItemToD3Node(relatedItem.json)]);
        });
      },
      createBranchFromArrayValue: function(field) {
        var $__2 = this;
        if (!angular.isArray(field.value)) {
          return null;
        }
        var deferred = this.$q.defer();
        var promises = [];
        angular.forEach(field.value, function(value) {
          return promises.push($__2.getItem(value.urn));
        });
        this.$q.all(promises).then(function(items) {
          var nodes = items.map(function(item) {
            return $__2.parseJsonItemToD3Node(item.json);
          });
          deferred.resolve($__2.getBranchFromCollection(field.title, nodes));
        });
        return deferred.promise;
      },
      register: function(itemUrn) {
        var $__2 = this;
        var deferred = this.$q.defer();
        var initListener = this.EventService.listen(("itemInstance:" + itemUrn + ":done"), function(event, item) {
          if (item) {
            $__2.EventService.unlisten(initListener);
            $__2.item = item;
            $__2.urn = itemUrn;
            $__2.item.workspaceId = item.json.workspace.link.split('/')[4];
            deferred.resolve($__2.item);
          }
        });
        this.ModelsManager.getItem(itemUrn);
        return deferred.promise;
      },
      getBomRelatedItems: function(item) {
        var $__2 = this;
        var deferred = this.$q.defer();
        var parentUrn = this.UrnParser.encode(item.urn);
        var bomItemsListener = this.EventService.listen(("bomNested:" + parentUrn + ":done"), function(event, bomObj) {
          if (bomObj && bomObj.bomItems) {
            $__2.EventService.unlisten(bomItemsListener);
            var promises = [];
            bomObj.bomItems.forEach(function(bomItem) {
              var childUrn = $__2.UrnParser.encode(bomItem.item.urn);
              var deferred = $__2.$q.defer();
              var bomItemListener = $__2.EventService.listen(("itemInstance:" + childUrn + ":done"), function(event, obj) {
                $__2.EventService.unlisten(bomItemListener);
                bomItem.workspace = obj.json.workspace.title;
                bomItem.state = obj.json.lifecycle.title;
                bomItem.urn = $__2.UrnParser.encode(obj.json.urn);
                bomItem.workspaceId = obj.json.workspace.link.split('/')[4];
                deferred.resolve(bomItem);
              });
              $__2.ModelsManager.getItem(childUrn);
              promises.push(deferred.promise);
            });
            $__2.$q.all(promises).then(function() {
              var branch = $__2.getBranchFromCollection($__2.tabNames['BOM_LIST'], bomObj.bomItems);
              deferred.resolve(branch);
            });
          }
        });
        this.ModelsManager.getBomNested(parentUrn);
        return deferred.promise;
      },
      getRelationshipsItems: function(item) {
        var $__2 = this;
        var deferred = this.$q.defer();
        var parseRelatedItems = function(relatedItems) {
          return relatedItems.map(function(relatedItem) {
            return $__2.parseJsonItemToD3Node(relatedItem.json, 'relationships');
          });
        };
        var relatedItemsListener = this.EventService.listen(("relatedItems:" + item.urn + ":done"), function(event, relatedItemsObj) {
          if (relatedItemsObj) {
            $__2.EventService.unlisten(relatedItemsListener);
            var parsedCollection = [];
            if (relatedItemsObj.json && relatedItemsObj.json.length > 0) {
              parsedCollection = parseRelatedItems(relatedItemsObj.json);
            }
            var branch = $__2.getBranchFromCollection($__2.tabNames['RELATIONSHIPS'], parsedCollection);
            deferred.resolve(branch);
          }
        });
        this.ModelsManager.getRelatedItems(item.urn);
        return deferred.promise;
      },
      getProjectManagementItems: function(item) {
        var $__2 = this;
        var deferred = this.$q.defer();
        var items = [];
        var projectManagementId = this.EventService.listen(("projectItems:" + item.urn + ":done"), function(event, projectItemsObj) {
          $__2.EventService.unlisten(projectManagementId);
          if (angular.isDefined(projectItemsObj.getFullList()) && angular.isDefined(projectItemsObj.getFullList().projectItems)) {
            angular.forEach(projectItemsObj.getFullList().projectItems, function(projectItem) {
              if (projectItem.item) {
                items.push($__2.getItem(projectItem.item.urn));
              }
            });
          }
          $__2.$q.all(items).then(function(items) {
            items = _.map(items, function(item) {
              return $__2.parseJsonItemToD3Node(item.json);
            });
            deferred.resolve($__2.getBranchFromCollection($__2.tabNames['PROJECT_MANAGEMENT'], items));
          });
        });
        this.ModelsManager.getProjectItems(item.urn);
        return deferred.promise;
      },
      parseJsonItemToD3Node: function(item, parser) {
        var title,
            state,
            urn;
        switch (parser) {
          case 'relationships':
            title = item.item.title;
            urn = item.item.urn;
            break;
          default:
            title = item.title;
            urn = item.urn;
            break;
        }
        if (item.lifecycle && item.lifecycle.title) {
          state = item.lifecycle.title;
        }
        if (item.state) {
          state = item.state.title;
        }
        if (item.currentState && item.currentState.title) {
          state = item.currentState.title;
        }
        var a = {
          title: title,
          state: state,
          urn: this.UrnParser.encode(urn),
          workspace: item.workspace.title,
          workspaceId: item.workspace.link.split('/')[4]
        };
        return a;
      },
      getItem: function(itemUrn) {
        var $__2 = this;
        var deferred = this.$q.defer();
        var urn = this.UrnParser.encode(itemUrn);
        var itemListener = this.EventService.listen(("itemInstance:" + urn + ":done"), function(event, itemData) {
          $__2.EventService.unlisten(itemListener);
          deferred.resolve(itemData);
        });
        this.ModelsManager.getItem(urn);
        return deferred.promise;
      },
      getFieldTypeId: function(field) {
        var fieldTypeId = this.UrnParser.encode(field.type.urn).split(',').slice(-1).pop();
        return Number(fieldTypeId);
      },
      getItemFieldRelationships: function(item) {
        var $__2 = this;
        var deferred = this.$q.defer();
        var promises = [];
        this.getItem(item.urn).then(function(itemData) {
          angular.forEach(itemData.getSections(), function(section) {
            angular.forEach(section.fields, function(field) {
              var fieldDataTypeId = $__2.getFieldTypeId(field);
              if (field.value && $__2.fieldRelationshipHandlers[fieldDataTypeId]) {
                var promise = $__2.fieldRelationshipHandlers[fieldDataTypeId](field);
                if (promise) {
                  promises.push(promise);
                }
              }
            });
          });
          $__2.$q.all(promises).then(function(branches) {
            return deferred.resolve(branches);
          });
        });
        return deferred.promise;
      },
      getRootRelationships: function(item) {
        var $__2 = this;
        var deferred = this.$q.defer();
        var promises = [];
        promises.push(this.getItemFieldRelationships(item));
        angular.forEach(this.permissions, function(permission) {
          var branchPromise = $__2.hasUserPermission(item.workspaceId, permission.id).then(function(hasPermission) {
            if (hasPermission && permission.handler) {
              return permission.handler(item);
            }
          });
          promises.push(branchPromise);
        });
        this.$q.all(promises).then(function(results) {
          results = results.filter(function(result) {
            return result !== undefined;
          });
          var branches = [];
          angular.forEach(results, function(result) {
            if (angular.isArray(result)) {
              branches = branches.concat(result);
            } else {
              branches.push(result);
            }
          });
          return deferred.resolve(branches);
        });
        return deferred.promise;
      },
      hasUserPermission: function(workspaceId, permission) {
        return this.PermissionService.hasPermissions([permission], workspaceId);
      },
      getBranchFromCollection: function(name, items) {
        var branch = {
          name: name,
          children: []
        };
        items.forEach(function(item) {
          branch.children.push({
            name: item.title,
            state: item.state || 'Not fetched',
            workspace: item.workspace || 'Not fetched',
            urn: item.urn,
            workspaceId: item.workspaceId
          });
        });
        return branch;
      },
      addBranchToParent: function(parent, branch) {
        var found = false;
        if (parent._children && parent._children.length > -1) {
          parent._children.forEach(function(child) {
            if (child.name === branch.name) {
              found = true;
            }
          });
        } else {
          parent._children = [];
        }
        if (!found) {
          parent._children.push(branch);
        }
      },
      truncate: function(text) {
        var length = arguments[1] !== (void 0) ? arguments[1] : 20;
        return text && text.length > length ? text.substring(0, length) + '...' : text;
      },
      loadSplitViewItem: function(itemId) {
        if (angular.isDefined(itemId)) {
          this.EventService.send('itemViewer:setNewItem', itemId);
        }
      },
      getTabNames: function(itemUrn) {
        var $__2 = this;
        var deferred = this.$q.defer();
        var workspaceId;
        workspaceId = itemUrn.split(',')[4];
        var tabsListenerId = this.EventService.listen(("itemTabs:" + workspaceId + ":done"), function(event, tabsObj) {
          $__2.EventService.unlisten(tabsListenerId);
          var result = [];
          $__2._.each(tabsObj.getFullList(), function(tab) {
            result[tab.workspaceTabName] = tab.name || tab.key;
          });
          $__2.tabNames = result;
          deferred.resolve(result);
        });
        this.ModelsManager.getTabs(workspaceId);
        return deferred.promise;
      }
    }, {});
  }();
  var $__default = RoamerService;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/roamer.service.js
;

System.get("com/autodesk/roamer.js");angular.module("com/autodesk/roamer.js").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('roamer.html',
    "<roamer-tree class=\"roamer-tree\" data-item=\"roamerCtrl.itemUrn\" roamer-resize ng-style=\"style\"><a class=\"dataNavigatorCloseBtn btn btn-default\" href=\"{{ roamerCtrl.myStateHref }}\"><i class=\"fa fa-arrow-left fa-sm\"></i> {{ bundle.button.close }}</a></roamer-tree>"
  );
}]);