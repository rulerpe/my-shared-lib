import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { APIDeviceTypes, getDeviceType } from "../visjs/helpers";
import { createNodeIdMap, createResourceIdMap } from "./data";
import { indexBy } from "underscore";
import { scaleAndFixPositions, getOwnerIdFromExpandButtonId, toggleCollapseExpandButton, getOwnerIdFromCollapseButtonId } from "./nodeRendering";
import { isGroupId } from "./grouping";
export function createClusterNodeId(nodeId) {
  return "clusterFor_".concat(nodeId);
}
export function getNodeIdFromClusterNodeId(nodeId) {
  return nodeId.split("_")[1];
} //do not cluster this child if any other parent is a switch or router

export function canCluster(node) {
  var deviceType = getDeviceType(node);
  return deviceType !== APIDeviceTypes.SWITCH && deviceType !== APIDeviceTypes.ROUTER;
}
/**
 * @function canClusterParents
 * @desc recursively checks all parents in the input and their ancestors, if there is any,
 * returns false if any of them cannot be clustered, e.g. by calling canCluster(node),
 * otherwise returns true
 * e.g. in this example, we will return true for parents [ClickedNode, Hub2]
 *      ClickedNode => Hub1 => Hub2 => Child
 *      ClickedNode => Child
 * but not this, because Hub2 has a Switch as parent which cannot be clustered
 *      ClickedNode => Switch => Hub2 => Child
 *      ClickedNode => Child
 * @param {string | number} clusterResourceId the resource id of the node we try to cluster
 * @param {string[] | number[]} parentResourceIds the resource ids of the parents of the cluster node
 * @param { { [nodeId] : [resource] } } _resources a key-value map for each nodeId and node resource object pair
 * @param { { [resourceId] : [nodeId] } } _nodeIds a key-value map for each resourceId and nodeId pair
 * @returns {boolean} whether all the parents in question can be clustered
 */

export function canClusterParents(clusterResourceId, parentResourceIds, _resources, _nodeIds) {
  if (!parentResourceIds || !parentResourceIds.length) {
    return true;
  }

  var result = true;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = parentResourceIds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var parentResourceId = _step.value;

      // no need to continue if some node cannot be clustered already
      if (!result) {
        return false;
      } //skip the node we clicked


      if (parentResourceId != clusterResourceId) {
        // eslint-disable-line eqeqeq
        var parent = _resources[_nodeIds[parentResourceId]];

        if (!canCluster(parent)) {
          return false;
        }

        var grandParentResourceIds = _resources[_nodeIds[parentResourceId]].parents;
        result = canClusterParents(clusterResourceId, grandParentResourceIds, _resources, _nodeIds);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return result;
}

function calculateShouldCluster(nodeId, _resources, _nodeIds, _resourceIds, _childrenByParentId) {
  var selfResourceId = _resourceIds[nodeId];
  var childCount = 0;
  var childrenByResourceId = _childrenByParentId[selfResourceId] || {};
  var childResourceIds = Object.keys(childrenByResourceId); // store node ids not resource ids since that's what visjs will provide

  var shouldCluster = _defineProperty({}, nodeId, true);

  var visited = _defineProperty({}, selfResourceId, true);

  var childrenWithMultiParents = [];

  while (childResourceIds.length) {
    var grandChildrenResourceIds = [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = childResourceIds[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var childResourceId = _step2.value;

        if (!visited[childResourceId]) {
          visited[childResourceId] = true;
          var node = _resources[_nodeIds[childResourceId]];

          if (canCluster(node)) {
            // include all the decendents by recursively adding each node's children to the queue
            if (_childrenByParentId[childResourceId]) {
              grandChildrenResourceIds.push.apply(grandChildrenResourceIds, _toConsumableArray(Object.keys(_childrenByParentId[childResourceId])));
            }

            var parents = node.parents;

            if (canClusterParents(selfResourceId, parents, _resources, _nodeIds)) {
              shouldCluster[_nodeIds[childResourceId]] = true; // do not count Hubs

              if (!node.attributes.isInferred) {
                childCount++;
              }
            } else {
              childrenWithMultiParents.push(node.id);
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    childResourceIds = grandChildrenResourceIds;
  }

  shouldCluster.childCount = childCount;
  shouldCluster.childrenWithMultiParents = childrenWithMultiParents;
  return shouldCluster;
}

export function calculateClustersForNodes(nodes, edges) {
  var _resources = indexBy(nodes, "id");

  var _childrenByParentId = edges.reduce(function (prev, curr) {
    var parentId = curr.from;
    var childId = curr.to;
    prev[parentId] = prev[parentId] || {};
    prev[parentId][childId] = true;
    return prev;
  }, {});

  var _resourceIds = createResourceIdMap(nodes);

  var _nodeIds = createNodeIdMap(_resourceIds);

  nodes = nodes.filter(function (node) {
    var deviceType = node.attributes["device-type"];
    return deviceType === APIDeviceTypes.SWITCH || deviceType === APIDeviceTypes.ROUTER || deviceType === APIDeviceTypes.HUB;
  });
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = nodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var node = _step3.value;
      node.shouldCluster = calculateShouldCluster(node.id, _resources, _nodeIds, _resourceIds, _childrenByParentId);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
}
export function hideEdges(network, nodeId, hideCondition) {
  var node = network.body.nodes[nodeId];

  if (!node) {
    return;
  }

  var edges = node.edges;
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = edges[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var edge = _step4.value;

      if (hideCondition(edge)) {
        edge.options.hidden = true;
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }
}
/**
 * @description A helper function that checks whether a node should be included in the cluster,
 *              by verifying there is no more visible edges once this cluster is formed.
 *              Works in conjunction with shouldCluster.
 * @param {Network} network the visjs network
 * @param {object} shouldCluster the map of node ids that should be included in the cluster, see calculateShouldCluster
 * @param {number} clusterNodeId the node id that will be used to create the cluster
 * @param {number} childId the node id we are checking if it should be included in the cluster
 * @returns {boolean} returns false if the node:
 *                      1. is a cluster itself
 *                      2. has at least one visible edge after the cluster is formed
 *                      3. cannot be found (for any reason) as a fallback
 */

function shouldInclude(network, shouldCluster, clusterNodeId, childId) {
  if (network.isCluster(createClusterNodeId(childId))) {
    return false;
  }

  return hasVisibleEdges(network, shouldCluster, clusterNodeId, childId);
}

function hasVisibleEdges(network, shouldCluster, clusterNodeId, childId) {
  var clusterNode = network.body.nodes[clusterNodeId];
  var childNode = network.body.nodes[childId];

  if (clusterNode && childNode) {
    var visibleEdges = childNode.edges.filter(function (e) {
      return !shouldCluster[e.fromId] && !e.options.hidden && (e.options.physics === undefined || !!e.options.physics);
    });
    return visibleEdges.length === 0;
  }

  return false;
}

export function cluster(network, nodeId) {
  var _resourcesByNodeId$no;

  var resourcesByNodeId = network.body.data.nodes._data;
  var shouldCluster = ((_resourcesByNodeId$no = resourcesByNodeId[nodeId]) === null || _resourcesByNodeId$no === void 0 ? void 0 : _resourcesByNodeId$no.shouldCluster) || {};
  var clusterId = createClusterNodeId(nodeId);
  var clusterOptions = {
    joinCondition: function joinCondition(childOptions) {
      if (network.isCluster(childOptions.id)) {
        if (isGroupId(childOptions.id)) {
          return hasVisibleEdges(network, shouldCluster, nodeId, childOptions.id);
        }

        var childId = getNodeIdFromClusterNodeId(childOptions.id);
        var node = resourcesByNodeId[childId];

        if (node.attributes.isInferred && shouldCluster[childId]) {
          return true;
        }
      } else {
        var _node = resourcesByNodeId[childOptions.id];

        if (_node.isAddon) {
          return (shouldCluster[_node.for.id] || shouldInclude(network, shouldCluster, nodeId, _node.for.id)) && _node.for.id != nodeId; //eslint-disable-line
        }

        return shouldCluster[childOptions.id] || shouldInclude(network, shouldCluster, nodeId, childOptions.id);
      }
    },
    clusterNodeProperties: _objectSpread({}, network.body.data.nodes.get(nodeId), {
      id: clusterId,
      label: "".concat(resourcesByNodeId[nodeId].label),
      color: network.body.nodes[nodeId].options.color,
      zIndex: network.body.nodes[nodeId].options.zIndex
    })
  };
  network.cluster(clusterOptions);
  hideEdges(network, clusterId, function (edge) {
    return edge.fromId === clusterId && (!edge.to || canCluster(edge.to.options));
  }); // network.stabilize(1);
}
export function openCluster(network, clusterNodeId, isHierarchy) {
  network.openCluster(clusterNodeId, {
    releaseFunction: function releaseFunction(clusterPosition, containedNodesPositions) {
      return containedNodesPositions;
    }
  });
  releaseChildrenFromOtherClusters(network, clusterNodeId, isHierarchy);
}

function releaseChildrenFromOtherClusters(network, clusterNodeId, isHierarchy) {
  var nodeId = getNodeIdFromClusterNodeId(clusterNodeId);
  var childrenWithMultiParents = network.body.nodes[nodeId].options.shouldCluster.childrenWithMultiParents;

  if (childrenWithMultiParents.length) {
    var clusters = new Set();
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = childrenWithMultiParents[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var childId = _step5.value;
        var containers = network.clustering.findNode(childId);
        var clusterId = containers[0];

        if (network.isCluster(clusterId) && !isGroupId(clusterId)) {
          clusters.add(clusterId);
        }
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = clusters[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var cid = _step6.value;
        openCluster(network, cid, isHierarchy); // it might look like an infinite loop but the opened cluster id won't be added to the Set again

        cluster(network, getNodeIdFromClusterNodeId(cid));
      } // it is possible that visjs is creating new edges from other clusters to these nodes
      // in which case we need to hide them too

    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }

    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = childrenWithMultiParents[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var _childId = _step7.value;
        hideEdges(network, _childId, function (edge) {
          return network.isCluster(edge.fromId);
        });
      }
    } catch (err) {
      _didIteratorError7 = true;
      _iteratorError7 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
          _iterator7.return();
        }
      } finally {
        if (_didIteratorError7) {
          throw _iteratorError7;
        }
      }
    }

    scaleAndFixPositions(network, isHierarchy);
  }
}

export function clusterAll(network, collapseButtonIds) {
  collapseButtonIds.sort(function (a, b) {
    a = +getOwnerIdFromCollapseButtonId(a);
    b = +getOwnerIdFromCollapseButtonId(b);
    return b - a; //cluster from the node with the a larger id first since we want to cluster all sub trees first
  }).forEach(function (nodeId) {
    var forId = getOwnerIdFromCollapseButtonId(nodeId);

    if (!network.isCluster(network.findNode(forId)[0])) {
      toggleCollapseExpandButton(network, nodeId, forId);
      cluster(network, forId);
    }
  });
}
export function openAllClusters(network, isHierarchy, expandButtonIds) {
  expandButtonIds.sort(function (a, b) {
    a = +getOwnerIdFromExpandButtonId(a);
    b = +getOwnerIdFromExpandButtonId(b);
    return a - b; //open clusters with a smaller id first
  }).forEach(function (nodeId) {
    var forId = getOwnerIdFromExpandButtonId(nodeId);
    var container = network.findNode(forId)[0];

    if (network.isCluster(container)) {
      toggleCollapseExpandButton(network, nodeId, forId);
      openCluster(network, container, isHierarchy);
    }
  });
}