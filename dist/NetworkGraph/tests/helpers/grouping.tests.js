import { mockNetwork } from "../mock";
import { _findGroupsByTypePerParentSet } from "../../helpers/grouping";
import { APIDeviceTypes } from "../../visjs/helpers";

function mockNode(id, type, parents) {
  return {
    id: id,
    options: {
      attributes: {
        "device-type": type
      },
      parents: parents
    }
  };
}

describe("grouping module", function () {
  describe("_findGroupsByTypePerParentSet", function () {
    it("groups all leaf nodes by parent ids", function () {
      /* eslint-disable */
      var node1 = mockNode(1, APIDeviceTypes.COMPUTER, [1]);
      var node2 = mockNode(2, APIDeviceTypes.PRINTER, [1]);
      var node3 = mockNode(3, APIDeviceTypes.HUB, [3]);
      var node4 = mockNode(4, APIDeviceTypes.SWITCH, [4]);
      var node5 = mockNode(5, APIDeviceTypes.COMPUTER, [4, 5]);
      var node6 = mockNode(6, APIDeviceTypes.COMPUTER, [5, 4]);
      /* eslint-enable */

      var nodes = [node1, node2, node3, node4, node5, node6];
      var network = mockNetwork(nodes);

      var groups = _findGroupsByTypePerParentSet(network);

      expect(groups.length).toBe(2);
      expect(groups[0].id).toBe("1");
      expect(Object.keys(groups[0].children).length).toBe(2);
      expect(groups[0].children[node1.id]).toBe(node1);
      expect(groups[0].children[node2.id]).toBe(node2);
      expect(groups[0].childrenTypesSet.size).toBe(2);
      expect(groups[0].childrenTypesSet.has(APIDeviceTypes.COMPUTER)).toBe(true);
      expect(groups[0].childrenTypesSet.has(APIDeviceTypes.PRINTER)).toBe(true);
      expect(groups[1].id).toBe("4,5");
      expect(Object.keys(groups[1].children).length).toBe(2);
      expect(groups[1].children[node5.id]).toBe(node5);
      expect(groups[1].children[node6.id]).toBe(node6);
      expect(groups[1].childrenTypesSet.size).toBe(1);
      expect(groups[1].childrenTypesSet.has(APIDeviceTypes.COMPUTER)).toBe(true);
    });
  });
});