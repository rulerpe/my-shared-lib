import { Node, Groups, FilteredGroups, getDeviceType, APIDeviceTypes } from "./helpers";
import { indexBy, sortBy } from "underscore";
import { calculateClustersForNodes } from "../helpers/clustering";
export function getDeviceGroup(deviceType, isFiltered) {
  switch (deviceType) {
    case APIDeviceTypes.SERVER:
      return isFiltered ? FilteredGroups.Server : Groups.Server;

    case APIDeviceTypes.WORKSTATION:
      return isFiltered ? FilteredGroups.Computer : Groups.Computer;

    case APIDeviceTypes.HUB:
      return isFiltered ? FilteredGroups.Hub : Groups.Hub;

    case APIDeviceTypes.PRINTER:
      return isFiltered ? FilteredGroups.Printer : Groups.Printer;

    case APIDeviceTypes.ROUTER:
      return isFiltered ? FilteredGroups.Router : Groups.Router;

    case APIDeviceTypes.SWITCH:
      return isFiltered ? FilteredGroups.Switch : Groups.Switch;

    case APIDeviceTypes.UNKNOWN:
    case APIDeviceTypes.NETWORK_DEVICE:
    default:
      return isFiltered ? FilteredGroups.Unknown : Groups.Unknown;
  }
}

function NodeFactory(device, isFiltered) {
  var id = device.id;
  var name = device.attributes["name"];
  var deviceType = getDeviceType(device);
  var group = getDeviceGroup(deviceType, isFiltered);
  return Node(id, device.attributes, name, group);
}

export function createNodes() {
  var devices = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var filteredNodes = arguments.length > 1 ? arguments[1] : undefined;
  var map;

  if (filteredNodes) {
    map = indexBy(filteredNodes, "id");
  }

  return devices.reduce(function (nodes, device) {
    nodes.push(NodeFactory(device, map && !map[device.id]));
    return nodes;
  }, []);
}

function EdgeFactory(connection) {
  var attributes = connection.attributes;
  return {
    to: attributes["to-network-device-id"],
    from: attributes["from-network-device-id"]
  };
}

export function createEdges(connections) {
  return connections.reduce(function (edges, connection) {
    edges.push(EdgeFactory(connection));
    return edges;
  }, []);
}

function getSize(node, getChildren, visiting) {
  if (visiting[node.id]) {
    return 0;
  } else {
    visiting[node.id] = true;
  }

  if (node.subTreeSize) {
    return node.subTreeSize;
  }

  var size = 1;
  var children = getChildren[node.id];

  if (children) {
    node.mass = children.length || 1;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var child = _step.value;
        size += getSize(child, getChildren, visiting);
        visiting[child.id] = false;
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
  }

  node.subTreeSize = size;
  return size;
}

export function assignNodeIds(nodes, edges) {
  // find node without parent
  // find its children
  // assign id to node and children
  // repeat per child
  // if child already been visited, skip to avoid infinit loop
  // if node has no child, return
  var nodesById = nodes.reduce(function (prev, curr) {
    prev[curr.id] = curr;
    return prev;
  }, {});
  var visited = new Set();
  var childrenByPID = {};
  var nodesWithParent = {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = edges[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var edge = _step2.value;
      var _cid = edge.to;
      var _pid = edge.from;
      nodesWithParent[_cid] = _pid;
      childrenByPID[_pid] = childrenByPID[_pid] || [];

      childrenByPID[_pid].push(nodesById[_cid]);

      nodesById[_cid].parents = nodesById[_cid].parents || [];

      nodesById[_cid].parents.push(_pid);
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

  var roots = [];
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = nodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _node = _step3.value;

      if (!nodesWithParent[_node.id]) {
        roots.push(nodesById[_node.id]);
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

  if (!roots.length) {
    console.log("every node has a parent ==> there is probably a loop between the nodes"); // find the loop and assign an id within the loop to pid

    var visitedIds = {};
    var cid = edges[0].to;
    var pid = edges[0].from; // the while loop is guaranteed to end in either case:
    // 1. pid is undefined ==> no loop
    // 2. we found the pid that has been visited ==> loop found

    while (pid && !visitedIds[pid]) {
      visitedIds[cid] = true;
      cid = pid;
      pid = nodesWithParent[cid];
    } // put all the nodes in the loop into roots


    var node = nodesById[pid];
    var visitedNodes = {};

    while (node && !visitedNodes[node.id]) {
      roots.push(node);
      visitedNodes[node.id] = true;
      node = nodesById[nodesWithParent[node.id]];
    } // let's break the parent/child relation between
    // the first 2 nodes within the loop
    // and use the first node as the root


    if (roots.length > 1) {
      var rootNode = roots[0];
      var rootParent = roots[1];
      delete nodesWithParent[rootNode.id]; // actually not necessary at this point but let's be consistent

      var children = childrenByPID[rootParent.id];
      var index = children.indexOf(nodesById[rootNode.id]);
      children.splice(index, 1); //break the relation here

      roots = [rootNode]; // [1...] are all decendants of the rootNode because rootNode is the parent of node at [-1]
    }
  } // after searching for the loop
  // this could only happen if an edge has a "from" value
  // that does not belong in the graph data


  if (!roots.length) {
    console.log("something is wrong ===> there is no loop but every node has a parent, using first node as root: ", nodes[0]);
    roots.push(nodes[0]);
  } // calculate the size of each node
  // for sorting while traversing the tree later


  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = nodes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var _node2 = _step4.value;
      getSize(_node2, childrenByPID, {});
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

  var id = 1;
  var resourceIdToId = {};

  function depthFirstTraverse(node, visitedNodes, getChildren, level) {
    node.level = Math.max(node.level || 0, level);

    if (visitedNodes.has(node)) {
      return;
    } else {
      visitedNodes.add(node);
    }

    node.resourceId = node.id;
    node.id = id++;
    resourceIdToId[node.resourceId] = node.id;
    var children = getChildren[node.resourceId];

    if (!children) {
      return;
    }

    children = sortBy(children, function (c) {
      return c.subTreeSize;
    });
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = children[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var _node$parents;

        var child = _step5.value;

        if (((_node$parents = node.parents) === null || _node$parents === void 0 ? void 0 : _node$parents.indexOf(+child.resourceId)) > -1) {
          continue; // skip loops
        }

        var nextLevel = node.level + child.parents.length;
        depthFirstTraverse(child, visitedNodes, getChildren, nextLevel);
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
  }

  roots = sortBy(roots, function (c) {
    return c.subTreeSize;
  });
  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = roots[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var root = _step6.value;
      depthFirstTraverse(root, visited, childrenByPID, 1);
    }
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

  nodes = sortBy(nodes, function (node) {
    return node.id;
  });
  calculateClustersForNodes(nodes, edges); // use the new node ids

  var _iteratorNormalCompletion7 = true;
  var _didIteratorError7 = false;
  var _iteratorError7 = undefined;

  try {
    for (var _iterator7 = edges[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
      var _edge = _step7.value;
      _edge.from = resourceIdToId[_edge.from];
      _edge.to = resourceIdToId[_edge.to];
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

  return {
    nodes: nodes,
    edges: edges
  };
}
export function prepareData(_ref) {
  var nodes = _ref.nodes,
      edges = _ref.edges,
      filteredNodes = _ref.filteredNodes;
  nodes = createNodes(nodes, filteredNodes);
  edges = createEdges(edges);
  return assignNodeIds(nodes, edges);
}