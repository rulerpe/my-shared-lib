import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { Groups, APIDeviceTypes, FilteredGroups } from "../visjs/helpers";
import { defaultNodeSize, collapseExpandButtonNodeSize } from "../visjs/options/nodes";
import { groups, generatePlusIconPillImageWithText, generateMinusIconPillImageWithText, generateGroupSizeImageWithText } from "../visjs/options/groups";
import * as Scaling from "./scaling";
import * as Grouping from "./grouping";

function decorateNodes(network, shouldDecorate, createNode) {
  var nodes = [];
  var nodesDataSet = network.body.data.nodes;
  var nodeIndices = network.body.nodeIndices;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = nodeIndices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;
      var device = network.body.nodes[key];

      if (!device || device.options.isAddon) {
        continue;
      }

      if (shouldDecorate(device.options)) {
        nodes.push(device);
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

  var data = [];

  for (var _i = 0, _nodes = nodes; _i < _nodes.length; _i++) {
    var _device = _nodes[_i];
    var node = createNode(_device.options);
    data.push(node);
  }

  nodesDataSet.add(data);
}

var questionMarkOffset = {
  x: -Math.sqrt(Math.pow(defaultNodeSize, 2) / 2),
  y: -Math.sqrt(Math.pow(defaultNodeSize, 2) / 2)
};
var groupSizeOffset = {
  x: +Math.sqrt(Math.pow(defaultNodeSize, 2) / 2),
  y: -Math.sqrt(Math.pow(defaultNodeSize, 2) / 2)
};
var collapseButtonOffset = {
  x: Math.sqrt(Math.pow(2 * defaultNodeSize, 2) / 2),
  y: -Math.sqrt(Math.pow(2 * defaultNodeSize, 2) / 2)
};
var collapseButtonOffsetForHub = {
  x: Math.sqrt(Math.pow(defaultNodeSize, 2) / 2),
  y: -Math.sqrt(Math.pow(defaultNodeSize, 2) / 2)
};

function getCollapseButtonOffsetForGroup(group) {
  if (group === Groups.Hub || group === FilteredGroups.Hub) {
    return _objectSpread({}, collapseButtonOffsetForHub);
  } else {
    return _objectSpread({}, collapseButtonOffset);
  }
}

function shouldAddQuestionMark(device) {
  var isInferred = device.attributes.isInferred;
  var hasConfig = device.attributes["configuration-id"];

  if (!isInferred && !hasConfig && !device._decorated) {
    return true;
  }

  return false;
}

function createQuestionMark(device) {
  device._decorated = true;
  var isFiltered = device.group.indexOf("Filtered") > -1;
  var group = !isFiltered ? Groups.Question : "".concat(Groups.Question, "Filtered");
  return {
    attributes: _objectSpread({}, device.attributes),
    isAddon: true,
    id: device.id + "-shadow",
    level: device.level,
    for: _objectSpread({}, device),
    offset: _objectSpread({}, questionMarkOffset),
    group: group,
    name: ""
  };
}

export function createQuestionMarks(network) {
  decorateNodes(network, shouldAddQuestionMark, createQuestionMark);
}

function shouldAddGroupSize(groupNodeIds, device) {
  return groupNodeIds.indexOf(device.id) > -1;
}

function updateNodeSizeImage(node, size, isFiltered) {
  var image = generateGroupSizeImageWithText("" + size, isFiltered);
  updateNodeImage(node, image);
}

function createGroupSize(isFiltered, ownerNode) {
  ownerNode._groupSize = true;
  var group = Groups.GroupSize;
  var node = {
    attributes: _objectSpread({}, ownerNode.attributes),
    isAddon: true,
    id: Grouping.createGroupSizeNodeId(ownerNode.id),
    level: ownerNode.level,
    for: _objectSpread({}, ownerNode),
    offset: _objectSpread({}, groupSizeOffset),
    group: group,
    name: ""
  };
  updateNodeSizeImage(node, ownerNode.groupDetail.size, isFiltered);
  return node;
}

function createGroupSizes(network, groupNodeIds, isFiltered) {
  decorateNodes(network, shouldAddGroupSize.bind(null, groupNodeIds), createGroupSize.bind(null, isFiltered));
}

export function createOrShowGroupSizes(network, groupNodeIds, isFiltered) {
  var nodesRequireAddOns = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = groupNodeIds[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var nodeId = _step2.value;
      var addOnNodeId = Grouping.createGroupSizeNodeId(nodeId);
      var node = network.body.nodes[addOnNodeId];

      if (node) {
        showNode(network, addOnNodeId);
      } else {
        nodesRequireAddOns.push(nodeId);
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

  if (nodesRequireAddOns.length) {
    createGroupSizes(network, nodesRequireAddOns, isFiltered);
  }
}

function isCollapsible(device) {
  var _device$shouldCluster;

  return ((_device$shouldCluster = device.shouldCluster) === null || _device$shouldCluster === void 0 ? void 0 : _device$shouldCluster.childCount) > 0; // shouldCluster is pre calculated on first load
}

function shouldAddHalo(device) {
  var deviceType = device.attributes["device-type"];

  if (!device._hasHalo && isCollapsible(device) && (deviceType === APIDeviceTypes.SWITCH || deviceType === APIDeviceTypes.ROUTER)) {
    return true;
  }

  return false;
}

function shouldAddHaloForHub(device) {
  var deviceType = device.attributes["device-type"];

  if (!device._hasHalo && isCollapsible(device) && deviceType === APIDeviceTypes.HUB) {
    return true;
  }

  return false;
}

function createHalo(group, device) {
  device._hasHalo = true;
  return {
    attributes: _objectSpread({}, device.attributes),
    isAddon: true,
    id: device.id + "-halo",
    level: device.level,
    for: _objectSpread({}, device),
    x: device.x,
    y: device.y,
    group: group,
    name: ""
  };
}

var createHaloForSwitch = createHalo.bind(null, Groups.Halo);
var createHaloForHub = createHalo.bind(null, Groups.HaloForHub);

function shouldAddCollapseButton(device) {
  var deviceType = device.attributes["device-type"];

  if (!device._hasCollapse && isCollapsible(device) && (deviceType === APIDeviceTypes.SWITCH || deviceType === APIDeviceTypes.HUB || deviceType === APIDeviceTypes.ROUTER)) {
    return true;
  }

  return false;
}

function updateNodeImage(node, image) {
  node.image = {
    selected: image,
    unselected: image
  };
}

function updateCollapseButtonImage(node, text, isFiltered) {
  var image = generateMinusIconPillImageWithText("" + text, isFiltered);
  updateNodeImage(node, image);
}

function updateExpandButtonImage(node, text, isFiltered) {
  var image = generatePlusIconPillImageWithText("" + text, isFiltered);
  updateNodeImage(node, image);
}

function createCollapseButton(device) {
  var _device$shouldCluster2;

  device._hasCollapse = true;
  var isFiltered = device.group.indexOf("Filtered") > -1;
  var group = !isFiltered ? Groups.Minus : "".concat(Groups.Minus, "Filtered");
  var offset = getCollapseButtonOffsetForGroup(device.group);
  offset.x = offset.x + collapseExpandButtonNodeSize;

  var node = _objectSpread({
    attributes: _objectSpread({}, device.attributes),
    isAddon: true,
    id: device.id + "-collapse-button",
    level: device.level,
    for: _objectSpread({}, device),
    offset: offset
  }, groups[group], {
    group: group,
    name: ""
  });

  updateCollapseButtonImage(node, (_device$shouldCluster2 = device.shouldCluster) === null || _device$shouldCluster2 === void 0 ? void 0 : _device$shouldCluster2.childCount, isFiltered);
  return node;
}

function createExpandButton(device) {
  var _device$shouldCluster3;

  device._hasExpand = true;
  var isFiltered = device.group.indexOf("Filtered") > -1;
  var group = !isFiltered ? Groups.Plus : "".concat(Groups.Plus, "Filtered");
  var offset = getCollapseButtonOffsetForGroup(device.group);
  offset.x = offset.x + collapseExpandButtonNodeSize;

  var node = _objectSpread({
    attributes: _objectSpread({}, device.attributes),
    isAddon: true,
    id: device.id + "-expand-button",
    level: device.level,
    for: _objectSpread({}, device),
    offset: offset
  }, groups[group], {
    group: group,
    name: ""
  });

  updateExpandButtonImage(node, (_device$shouldCluster3 = device.shouldCluster) === null || _device$shouldCluster3 === void 0 ? void 0 : _device$shouldCluster3.childCount, isFiltered);
  return node;
}

export function getVisibleToggleButtons(network, isCollapse) {
  return Object.keys(network.body.nodes).filter(function (id) {
    return isCollapse ? isCollapseButton(id) : isExpandButton(id);
  }).filter(function (id) {
    return !network.body.nodes[id].options.hidden;
  });
}
export function hideNode(network, nodeId) {
  var nodes = network.body.nodes;
  nodes[nodeId].options.hidden = true;
}

function showNode(network, nodeId) {
  var nodes = network.body.nodes;
  nodes[nodeId].options.hidden = false;
}

function hideExpandButtons(network) {
  Object.keys(network.body.nodes).filter(function (id) {
    return isExpandButton(id);
  }).forEach(function (id) {
    return hideNode(network, id);
  });
}

export function createCollapseButtons(network) {
  decorateNodes(network, shouldAddHalo, createHaloForSwitch);
  decorateNodes(network, shouldAddHaloForHub, createHaloForHub);
  decorateNodes(network, shouldAddCollapseButton, createExpandButton);
  hideExpandButtons(network);
  decorateNodes(network, shouldAddCollapseButton, createCollapseButton);
}

function scaleOffset(offset, scale) {
  return {
    x: offset.x / scale,
    y: offset.y / scale
  };
}

export function repositionNodesWithOffset(network, scale) {
  var nodes = [];
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = network.body.nodeIndices[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var index = _step3.value;
      var node = network.body.nodes[index];

      if (node.options.offset) {
        nodes.push(node);
      }
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

  for (var _i2 = 0, _nodes2 = nodes; _i2 < _nodes2.length; _i2++) {
    var _node = _nodes2[_i2];
    var origin = _node.options.for;

    if (!origin) {
      continue;
    }

    var offset = _node.options.offset;

    if (offset) {
      if (scale) {
        offset = scaleOffset(offset, scale);
      }

      _node.x = origin.x + offset.x;
      _node.y = origin.y + offset.y;
    }
  }
}
export function isCollapseButton(nodeId) {
  return nodeId && ("" + nodeId).indexOf("-collapse-button") > 0;
}
export function getOwnerIdFromCollapseButtonId(nodeId) {
  return nodeId.substring(0, nodeId.indexOf("-collapse-button"));
}
export function isExpandButton(nodeId) {
  return nodeId && ("" + nodeId).indexOf("-expand-button") > 0;
}
export function getOwnerIdFromExpandButtonId(nodeId) {
  return nodeId.substring(0, nodeId.indexOf("-expand-button"));
}
export function adjustNodePositions(network) {
  var ids = Object.keys(network.body.nodes);

  for (var _i3 = 0, _ids = ids; _i3 < _ids.length; _i3++) {
    var nodeId = _ids[_i3];
    var node = network.body.nodes[nodeId];
    node.x = node.options.x === 0 ? node.options.x : node.options.x || node.x;
    node.y = node.options.y === 0 ? node.options.y : node.options.y || node.y;
  }
}
export function toggleCollapseExpandButton(network, nodeId, forId) {
  if (isCollapseButton(nodeId)) {
    hideNode(network, "".concat(forId, "-collapse-button"));
    showNode(network, "".concat(forId, "-expand-button"));
  } else {
    hideNode(network, "".concat(forId, "-expand-button"));
    showNode(network, "".concat(forId, "-collapse-button"));
  }
}
export function fillBackgroundColor(ctx) {
  var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "#ECECEC";
  // save current translate/zoom
  ctx.save(); // reset transform to identity

  ctx.setTransform(1, 0, 0, 1, 0, 0); // fill background

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); // restore old transform

  ctx.restore();
}
export function fixTreeViewPositioningAfterClustering(network, isHierarchy, scale) {
  if (isHierarchy) {
    adjustNodePositions(network);
    Scaling.resizeNodesAndEdgesByScale(network, scale < 1 ? 1 : scale);
    network.redraw();
  }
}
export function scaleAndFixPositions(network, isHierarchy) {
  var scale = network.getScale();
  Scaling.resizeNodesAndEdgesByScale(network, scale < 1 ? 1 : scale);
  repositionNodesWithOffset(network, scale > 1 ? scale : undefined);
  fixTreeViewPositioningAfterClustering(network, isHierarchy, scale);
}
export function handleZoom(network, scale) {
  if (scale < 1) {
    if (scale < 0.05) {
      network.moveTo({
        scale: 0.05
      });
    }

    return;
  }

  Scaling.resizeNodesAndEdgesByScale(network, scale);
  repositionNodesWithOffset(network, scale);
}
export function zoomIn(network, zoomValue) {
  var scale = network.getScale();
  var newScale = Math.max(0.1, scale + zoomValue); //there is a bug when the scale reaches 0

  if (scale !== newScale) {
    var config = {
      scale: newScale
    };
    network.moveTo(config);
    handleZoom(network, newScale);
  }
}