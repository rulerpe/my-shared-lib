import { assignNodeIds, createNodes, createEdges } from "../prepareData";
import { mockDevicesResp, mockConnectionsResp } from "apps/network/tests/mock";

function makeNodes(n) {
  var nodes = [];

  for (var id = 1; id <= n; id++) {
    nodes.push({
      id: id,
      attributes: {}
    });
  }

  return nodes;
}

function makeEdges(edges) {
  var res = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = edges[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var edge = _step.value;
      res.push({
        from: edge[0],
        to: edge[1]
      });
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

  return res;
} // TODO: add more detailed specs to verify the view models


describe("prepareData", function () {
  describe("createNodes", function () {
    it("works", function () {
      var data = mockDevicesResp.body.data;
      var nodes = createNodes(data);
      expect(nodes.length).toEqual(data.length);
    });
  });
  describe("createEdges", function () {
    it("works too", function () {
      var data = mockConnectionsResp.body.data;
      var nodes = createEdges(data);
      expect(nodes.length).toEqual(data.length);
    });
  });
  describe("assignNodeIds", function () {
    describe("with a tree with 5 nodes:\n                1\n               / \\\n              2   3\n              |   |\n              4   5\n\n            ==>\n                1\n               / \\\n              2   4\n              |   |\n              3   5\n        ", function () {
      var inputEdges = [[1, 2], [1, 3], [2, 4], [3, 5]];

      var _assignNodeIds = assignNodeIds(makeNodes(5), makeEdges(inputEdges)),
          nodes = _assignNodeIds.nodes,
          edges = _assignNodeIds.edges;

      it("should traverse in depth-first order and assign ids", function () {
        expect(nodes[0].resourceId).toBe(1);
        expect(nodes[0].id).toBe(1);
        expect(nodes[1].resourceId).toBe(2);
        expect(nodes[1].id).toBe(2); // take notes in the next 2 lines

        expect(nodes[2].resourceId).toBe(4);
        expect(nodes[2].id).toBe(3);
        expect(nodes[3].resourceId).toBe(3);
        expect(nodes[3].id).toBe(4);
        expect(nodes[4].resourceId).toBe(5);
        expect(nodes[4].id).toBe(5);
      });
      it("should update the id references in edges", function () {
        expect(edges[1].to).toBe(4);
        expect(edges[2].to).toBe(3);
        expect(edges[3].from).toBe(4);
      });
    });
    describe("with a tree with 6 nodes:\n                1\n               / \\\n              2   3\n             /   / \\\n            6   4   5\n            => note the last level in visjs this would be renders as\n            => 4, 5, 6\n            => with the edge [2,6] crossing over [3,4] and [3,5]\n            => so we want to re assign new ids to them\n            ==>\n                1\n               / \\\n              2   4\n             /   / \\\n            3   5   6\n        ", function () {
      var inputEdges = [[1, 2], [1, 3], [2, 6], [3, 4], [3, 5]];

      var _assignNodeIds2 = assignNodeIds(makeNodes(6), makeEdges(inputEdges)),
          nodes = _assignNodeIds2.nodes,
          edges = _assignNodeIds2.edges;

      it("should traverse in depth-first order and assign ids", function () {
        expect(nodes[0].resourceId).toBe(1);
        expect(nodes[0].id).toBe(1);
        expect(nodes[1].resourceId).toBe(2);
        expect(nodes[1].id).toBe(2); // take notes of the new ids here

        expect(nodes[2].resourceId).toBe(6);
        expect(nodes[2].id).toBe(3);
        expect(nodes[3].resourceId).toBe(3);
        expect(nodes[3].id).toBe(4);
        expect(nodes[4].resourceId).toBe(4);
        expect(nodes[4].id).toBe(5);
        expect(nodes[5].resourceId).toBe(5);
        expect(nodes[4].id).toBe(5);
      });
      it("should update the id references in edges", function () {
        expect(edges[1].to).toBe(4);
        expect(edges[2].to).toBe(3);
        expect(edges[3].from).toBe(4);
        expect(edges[3].to).toBe(5);
        expect(edges[4].from).toBe(4);
        expect(edges[4].to).toBe(6);
      });
      it("should assign correct levels", function () {
        expect(nodes[0].level).toBe(1);
        expect(nodes[1].level).toBe(2);
        expect(nodes[2].level).toBe(3);
        expect(nodes[3].level).toBe(2);
        expect(nodes[4].level).toBe(3);
        expect(nodes[5].level).toBe(3);
      });
    });
  });
  describe("creates icon and name from matched itg data", function () {
    it("Matching configuration is of type switch", function () {
      var data = mockDevicesResp.body.data;
      var nodes = createNodes(data);
      expect(nodes[11].label).toEqual(data[11].attributes["name"]);
      expect(nodes[11].group).toEqual("switch");
    });
    it("Matching configuration is of type computer", function () {
      var data = mockDevicesResp.body.data;
      var nodes = createNodes(data);
      expect(nodes[12].label).toEqual(data[12].attributes["name"]);
      expect(nodes[12].group).toEqual("computer");
    });
    it("Matching configuration is of type router", function () {
      var data = mockDevicesResp.body.data;
      var nodes = createNodes(data);
      expect(nodes[13].label).toEqual(data[13].attributes["name"]);
      expect(nodes[13].group).toEqual("router");
    });
  });
});