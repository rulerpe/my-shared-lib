import _regeneratorRuntime from "@babel/runtime/regenerator";
import { indexBy } from "underscore";
import { set, get } from "../../js-common-deps/Cache";
var CACHE_VERSION = 1;
export function getCacheKey(id, isHierarchy) {
  return "".concat(CACHE_VERSION, "-snapshot-").concat(id, "-isHierarchy-").concat(isHierarchy);
}
export function getCache(id, isHierarchy) {
  var key;
  return _regeneratorRuntime.async(function getCache$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (id) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", null);

        case 2:
          key = getCacheKey(id, isHierarchy);
          _context.next = 5;
          return _regeneratorRuntime.awrap(get(key));

        case 5:
          return _context.abrupt("return", _context.sent);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}
/**
 * @param {number|string} id the network snapshot id
 * @param {boolean} isHierarchy whether the graph is using hierarchical layout
 * @param {{nodes: DataSet, edges: DataSet}} dataSet the object containing the visjs DataSets
 * @returns {undefined}
 */

export function setCache(id, isHierarchy, dataSet) {
  if (!id) {
    return;
  }

  var key = getCacheKey(id, isHierarchy);
  var data = extractDataFromVisDataSets(dataSet);

  if (data) {
    set(key, JSON.stringify({
      nodes: indexBy(data.nodes.map(function (n) {
        return {
          id: n.id,
          x: n.x,
          y: n.y
        };
      }), "id")
    }));
  }
}
/**
 * @param {DataSet} nodesDataSet a DataSet of the nodes, created with new DataSet(nodes)
 * @param {DataSet} edgesDataSet a DataSet of the edges
 * @returns {{nodes: object, edges: object}} a dictionary containing the nodes[] and the edges[]
 */

function extractDataFromVisDataSets(_ref) {
  var nodesDataSet = _ref.nodes,
      edgesDataSet = _ref.edges;

  if (!nodesDataSet || !edgesDataSet) {
    return;
  }

  var nodes = [];

  for (var key in nodesDataSet._data) {
    nodes.push(nodesDataSet._data[key]);
  }

  var edges = [];

  for (var _key in edgesDataSet._data) {
    edges.push(edgesDataSet._data[_key]);
  }

  return {
    nodes: nodes,
    edges: edges
  };
}