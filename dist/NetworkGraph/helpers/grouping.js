import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { reduce } from "underscore";
import { APIDeviceTypes, getDeviceType } from "../visjs/helpers";
import { getDeviceGroup } from "../visjs/prepareData";
import * as Clustering from "./clustering";
import * as Rendering from "./nodeRendering";
export function createGroupSizeNodeId(nodeId) {
  return "".concat(nodeId, "-group-size");
}

function createGroupNodeId(parentIds, type) {
  return "group-by-".concat(type, "-for-").concat(parentIds);
}

export function isGroupId(nodeId) {
  return nodeId.indexOf("group-by-") > -1 && nodeId.indexOf("-group-size") < 0;
}

function ungroup(network, groupNodeId) {
  network.openCluster(groupNodeId, {
    releaseFunction: function releaseFunction(__unused__, containedNodesPositions) {
      return containedNodesPositions;
    }
  });
}

export function ungroupByType(network) {
  var groupNodeIds = network.body.nodeIndices.filter(function (id) {
    return isGroupId("" + id);
  });
  groupNodeIds.forEach(function (nodeId) {
    ungroup(network, nodeId);
    Rendering.hideNode(network, createGroupSizeNodeId(nodeId));
  });
}
/**
 * Helper function that will loop thru all nodes in the network
 * and collect nodes and a set of node types per parent set.
 * For example, [1], [2], [1, 2] are 3 different sets of parent ids,
 * and we will create 3 groups for collecting nodes whose parent ids matches strictly with each.
 * @param {object} network the visjs network instance
 * @returns {Group[]} a list of Group objects for creating the group clusters
 */

export function _findGroupsByTypePerParentSet(network) {
  var groups = {};
  network.body.nodeIndices.forEach(function (nodeId) {
    var _node$options$parents;

    var node = network.body.nodes[nodeId];
    var deviceType = getDeviceType(node.options);

    if (deviceType === APIDeviceTypes.HUB) {
      return;
    }

    if (Clustering.canCluster(node.options) && ((_node$options$parents = node.options.parents) === null || _node$options$parents === void 0 ? void 0 : _node$options$parents.length) >= 1) {
      // use parent node ids (comma-separated) to identify unique groups
      var groupId = node.options.parents.sort().toString();

      if (!groups[groupId]) {
        groups[groupId] = {
          id: groupId,
          children: {},
          childrenTypesSet: new Set()
        };
      }

      groups[groupId].children[node.id] = node;
      groups[groupId].childrenTypesSet.add(deviceType);
    }
  });
  return reduce(groups, function (list, group) {
    list.push(group);
    return list;
  }, []);
}
export function groupAllLeavesByType(network, hasFilter) {
  var groups = _findGroupsByTypePerParentSet(network);

  var groupNodeIds = [];
  groups.forEach(function (group) {
    var id = group.id,
        children = group.children,
        childrenTypesSet = group.childrenTypesSet;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = childrenTypesSet[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var type = _step.value;
        var clusterNodeId = createGroupCluster(network, id, children, type, hasFilter);
        groupNodeIds.push(clusterNodeId);
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
  });
  Rendering.createOrShowGroupSizes(network, groupNodeIds, hasFilter);
}

function createGroupCluster(network, groupId, children, type, hasFilter) {
  var baseNode = findClusterBase(children, type);
  var resourcesByNodeId = network.body.data.nodes._data;
  var nodesInGroup = {};
  var shouldGroup = {};
  var groupSize = 0;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = network.body.nodeIndices[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var nodeId = _step2.value;
      var node = network.body.data.nodes._data[nodeId];

      if (!node) {
        continue;
      }

      var child = node; // for add-on nodes, we want to verify its owner node

      if (child.isAddon) {
        child = child.for;
      }

      child = children[child.id];

      if (!child || getDeviceType(child.options) !== type) {
        continue;
      } else {
        shouldGroup[node.id] = true;
        nodesInGroup[child.id] = child; // do not count add-on nodes towards the group size

        if (!node.isAddon) {
          groupSize++;
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

  var clusterId = createGroupNodeId(groupId, type);
  var clusterOptions = {
    joinCondition: function joinCondition(childOptions) {
      var child = resourcesByNodeId[childOptions.id];

      if (!child) {
        return false;
      }

      return !!shouldGroup[child.id];
    },
    clusterNodeProperties: _objectSpread({
      allowSingleNodeCluster: true
    }, baseNode.options, {
      group: getDeviceGroup(type, hasFilter),
      id: clusterId,
      label: "",
      color: baseNode.options.color,
      zIndex: baseNode.options.zIndex,
      groupDetail: {
        type: type,
        size: groupSize,
        nodes: nodesInGroup
      }
    })
  };
  network.cluster(clusterOptions); // we need to display the size of each group by adding a hepler node,
  // since creating extra node individually has a performance impact on tree view,
  // we can collect the group ids and create the helper nodes in a batch later

  return clusterId;
}
/**
 * Since the group should look exactly like an individual child node of its type,
 * we choose a node of the specified type from the group to be used for configuring the cluster,
 * mostly for receiving the position (e.g. { x, y }) as well as other properties for rendering.
 * @param {object} children a collection of nodes to be grouped together by each type
 * @param {string} type the type of nodes to be grouped
 * @returns {object} the base node for this group cluster's clusterNodeProperties
 */


function findClusterBase(children, type) {
  var base;
  var childIds = Object.keys(children);

  for (var _i = 0, _childIds = childIds; _i < _childIds.length; _i++) {
    var childId = _childIds[_i];
    var child = children[childId];

    if (getDeviceType(child.options) === type) {
      if (!base || child.options.level >= base.options.level) {
        base = child;
      } else {
        continue;
      }
    }
  }

  return base;
}

export function getGroupDetail(network, groupId) {
  return network.body.nodes[groupId].options.groupDetail;
}