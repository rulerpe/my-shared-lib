export function createResourceIdMap(nodes) {
  return nodes.reduce(function (prev, curr) {
    prev[curr.id] = curr.resourceId;
    return prev;
  }, {});
}
export function createNodeIdMap(resourceIdByNodeId) {
  return Object.keys(resourceIdByNodeId).reduce(function (map, nodeId) {
    if (resourceIdByNodeId[nodeId]) {
      map[resourceIdByNodeId[nodeId]] = nodeId;
    }

    return map;
  }, {});
}