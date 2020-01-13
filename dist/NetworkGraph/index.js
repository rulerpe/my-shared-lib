import _regeneratorRuntime from "@babel/runtime/regenerator";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
// import { PropTypes, UI } from "js-common";
import React from "react"; // import classnames from "classnames";

import { createDataSet, drawNetwork } from "./visjs/drawNetwork";
import { prepareData } from "./visjs/prepareData";
import { options } from "./visjs/options";
import { getCache, setCache } from "./visjs/cache";
import * as Rendering from "./helpers/nodeRendering";
import * as Clustering from "./helpers/clustering";
import * as Grouping from "./helpers/grouping";

function getIterations() {
  var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return nodes.length * 5;
}

var StatefulLoader =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(StatefulLoader, _React$PureComponent);

  function StatefulLoader() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, StatefulLoader);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(StatefulLoader)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {};

    _this.show = function () {
      return _this.setState({
        hide: false
      });
    };

    _this.hide = function () {
      return _this.setState({
        hide: true
      });
    };

    return _this;
  }

  _createClass(StatefulLoader, [{
    key: "render",
    value: function render() {
      return null; // TODO: implement loader
      // return (
      // <div className={classnames("dot-loader-container", !this.state.hide && "full-width full-height")}>
      //     {!this.state.hide && <UI.DotLoader dark={true} />}
      // </div>
      // );
    }
  }]);

  return StatefulLoader;
}(React.PureComponent);

var NetworkGraph =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(NetworkGraph, _React$PureComponent2);

  function NetworkGraph() {
    var _getPrototypeOf3;

    var _this2;

    _classCallCheck(this, NetworkGraph);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this2 = _possibleConstructorReturn(this, (_getPrototypeOf3 = _getPrototypeOf(NetworkGraph)).call.apply(_getPrototypeOf3, [this].concat(args)));

    _this2.zoomIn = function () {
      Rendering.zoomIn(_this2._network, 0.25);
    };

    _this2.zoomOut = function () {
      Rendering.zoomIn(_this2._network, -0.25);
    };

    _this2.unselectNode = function () {
      _this2._network.unselectAll();
    };

    _this2._groupByType = function (isGrouping) {
      if (!_this2._stabilized) {
        return;
      }

      if (_this2.loader) {
        _this2.loader.show();
      }

      setTimeout(function () {
        // find all clusters and open them
        var visibleButtons = Rendering.getVisibleToggleButtons(_this2._network, false);

        if (visibleButtons.length) {
          Clustering.openAllClusters(_this2._network, _this2.props.isHierarchy, visibleButtons);
        }

        if (isGrouping) {
          Grouping.groupAllLeavesByType(_this2._network, _this2._hasFilter);
        } else {
          Grouping.ungroupByType(_this2._network);
        } // close the clusters that were just opened in reverse order


        if (visibleButtons.length) {
          visibleButtons = visibleButtons.map(function (id) {
            return id.replace("expand", "collapse");
          }).reverse();
          Clustering.clusterAll(_this2._network, visibleButtons);
        } // TODO: [FED-4718] remove this hack
        // there is an issue after ungrouping if all clusteres are currently expanded:
        // the group size nodes are not hidden unless there is a collapse/expand action
        // this hack works by programmatically collapse and then expand a cluster to get around the issue


        if (!visibleButtons.length) {
          var collapseButtons = Rendering.getVisibleToggleButtons(_this2._network, true);

          if (collapseButtons.length) {
            visibleButtons.push(collapseButtons[0]);
            Clustering.clusterAll(_this2._network, visibleButtons);
            visibleButtons = visibleButtons.map(function (id) {
              return id.replace("collapse", "expand");
            });
            Clustering.openAllClusters(_this2._network, _this2.props.isHierarchy, visibleButtons);
          }
        }

        Rendering.scaleAndFixPositions(_this2._network, _this2.props.isHierarchy);

        _this2._network.redraw();

        if (_this2.loader) {
          _this2.loader.hide();
        }
      }, 10);
    };

    _this2.groupByType = function () {
      _this2._groupByType(true);
    };

    _this2.ungroupByType = function () {
      _this2._groupByType(false);
    };

    _this2.clusterAll = function () {
      if (!_this2._stabilized) {
        return;
      }

      var visibleButtons = Rendering.getVisibleToggleButtons(_this2._network, true);

      if (!visibleButtons.length) {
        return;
      }

      if (_this2.loader) {
        _this2.loader.show();
      }

      setTimeout(function () {
        Clustering.clusterAll(_this2._network, visibleButtons);
        Rendering.scaleAndFixPositions(_this2._network, _this2.props.isHierarchy);

        _this2._network.redraw();

        if (_this2.loader) {
          _this2.loader.hide();
        }
      }, 0);
    };

    _this2.openAllClusters = function () {
      if (!_this2._stabilized) {
        return;
      }

      var visibleButtons = Rendering.getVisibleToggleButtons(_this2._network, false);

      if (!visibleButtons.length) {
        return;
      }

      if (_this2.loader) {
        _this2.loader.show();
      }

      setTimeout(function () {
        Clustering.openAllClusters(_this2._network, _this2.props.isHierarchy, visibleButtons);
        Rendering.scaleAndFixPositions(_this2._network, _this2.props.isHierarchy);

        _this2._network.redraw();

        if (_this2.loader) {
          _this2.loader.hide();
        }
      }, 0);
    };

    _this2._onZoom = function (_ref) {
      var scale = _ref.scale;
      Rendering.handleZoom(_this2._network, scale);
    };

    _this2._handleSelectNode = function (_ref2) {
      var _this2$_network$body$;

      var nodes = _ref2.nodes;
      var nodeId = nodes[0];

      if (_this2._network.isCluster(nodeId)) {
        nodeId = Clustering.getNodeIdFromClusterNodeId(nodeId);
      }

      var resourceId = (_this2$_network$body$ = _this2._network.body.nodes[nodeId]) === null || _this2$_network$body$ === void 0 ? void 0 : _this2$_network$body$.options.resourceId;

      if (resourceId) {
        _this2.props.onSelectNode(resourceId);
      } else if (nodes[0] && Grouping.isGroupId(nodes[0])) {
        _this2.props.onSelectGroup(Grouping.getGroupDetail(_this2._network, nodes[0]));
      }
    };

    _this2._onClick = function (_ref3) {
      var nodes = _ref3.nodes;
      var nodeId = nodes[0];

      if (Rendering.isCollapseButton(nodeId)) {
        var forId = Rendering.getOwnerIdFromCollapseButtonId(nodeId);
        Rendering.toggleCollapseExpandButton(_this2._network, nodeId, forId);
        Clustering.cluster(_this2._network, forId);
      } else if (Rendering.isExpandButton(nodeId)) {
        var _forId = Rendering.getOwnerIdFromExpandButtonId(nodeId);

        var clusterId = Clustering.createClusterNodeId(_forId);

        if (_this2._network.isCluster(clusterId)) {
          Rendering.toggleCollapseExpandButton(_this2._network, nodeId, _forId);
          Clustering.openCluster(_this2._network, clusterId, _this2.props.isHierarchy);
        }
      }

      Rendering.scaleAndFixPositions(_this2._network, _this2.props.isHierarchy);

      _this2._handleSelectNode({
        nodes: nodes
      });
    };

    _this2._onStabilizationIterationsDone = function () {
      if (_this2.loader) {
        _this2.loader.hide();

        _this2._network.stopSimulation();
      }

      _this2._network.storePositions();

      Rendering.createCollapseButtons(_this2._network);
      Rendering.createQuestionMarks(_this2._network);

      if (!_this2._hasFilter) {
        var _this2$props$snapshot;

        setCache((_this2$props$snapshot = _this2.props.snapshot) === null || _this2$props$snapshot === void 0 ? void 0 : _this2$props$snapshot.id, _this2.props.isHierarchy, _this2._dataSet);
      }

      Rendering.repositionNodesWithOffset(_this2._network); // this is a random hack to trigger the nodes in the tree view
      // to position themselves correctly after adding the custom nodes
      // TODO: comment it out to see what it does, and potentially find a better solution

      if (_this2.props.isHierarchy) {
        _this2._network.setOptions({
          groups: {}
        });
      }

      _this2._stabilized = true;
    };

    _this2._onBeforeDrawing = function (ctx) {
      return Rendering.fillBackgroundColor(ctx);
    };

    _this2._setNetworkEventListners = function (network) {
      _this2._network = network;

      _this2._network.on("click", _this2._onClick);

      _this2._network.on("zoom", _this2._onZoom);

      _this2._network.on("stabilizationIterationsDone", _this2._onStabilizationIterationsDone);

      _this2._network.on("beforeDrawing", _this2._onBeforeDrawing);
    };

    return _this2;
  }

  _createClass(NetworkGraph, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this$props, nodes, edges, filteredNodes, isHierarchy, _this$props$snapshot, data, cache, positions;

      return _regeneratorRuntime.async(function componentDidUpdate$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this$props = this.props, nodes = _this$props.nodes, edges = _this$props.edges, filteredNodes = _this$props.filteredNodes, isHierarchy = _this$props.isHierarchy;
              this._hasFilter = nodes && filteredNodes && nodes.length !== filteredNodes.length;

              if (!(nodes && edges && filteredNodes)) {
                _context.next = 22;
                break;
              }

              if (this.loader) {
                this.loader.show();
              }

              options.edges.smooth.enabled = isHierarchy;
              options.layout.hierarchical.enabled = isHierarchy;
              options.physics.stabilization.iterations = getIterations(nodes);
              _context.prev = 7;
              data = prepareData(this.props);
              _context.next = 11;
              return _regeneratorRuntime.awrap(getCache((_this$props$snapshot = this.props.snapshot) === null || _this$props$snapshot === void 0 ? void 0 : _this$props$snapshot.id, isHierarchy));

            case 11:
              cache = _context.sent;

              // if there is cached graph data for non hierarchical layout, we can skip the physics simulation
              if (cache && !isHierarchy) {
                options.physics.stabilization.iterations = 0;
              }

              if (cache === null || cache === void 0 ? void 0 : cache.nodes) {
                positions = cache.nodes;
                data.nodes.map(function (n) {
                  n.x = positions[n.id].x;
                  n.y = positions[n.id].y;
                });
              } // keep a reference of the DataSet used by visjs Network
              // because the network can only storePositions directly on the objects within this reference


              this._dataSet = createDataSet(data);
              this._stabilized = false;
              drawNetwork(this._setNetworkEventListners, this.props.onError, "network-graph-container", this._dataSet, options);
              _context.next = 22;
              break;

            case 19:
              _context.prev = 19;
              _context.t0 = _context["catch"](7);
              this.props.onError(_context.t0);

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[7, 19]]);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return React.createElement("div", {
        className: "graph-root",
        tabIndex: 0
      }, React.createElement(StatefulLoader, {
        ref: function ref(_ref4) {
          return _this3.loader = _ref4;
        }
      }), React.createElement("div", {
        id: "network-graph-container"
      }));
    }
  }]);

  return NetworkGraph;
}(React.PureComponent);

export { NetworkGraph };