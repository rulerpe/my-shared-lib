import { getCache, getCacheKey, setCache } from "../cache";
import { indexBy } from "underscore";
import { Cache } from "../../../js-common-deps/Cache";
describe("NetworkGraph Cache", function () {
  var mockId = 1;
  beforeEach(function () {
    Cache.set = jest.fn();
    Cache.get = jest.fn();
    jest.resetAllMocks();
  });
  describe("getCache", function () {
    it("calls getItem", function () {
      getCache(mockId, false);
      expect(Cache.get).toBeCalledWith(getCacheKey(mockId, false));
    });
    it("does not call getItem if id is falsy", function () {
      getCache(null, false);
      expect(Cache.get).not.toBeCalled();
    });
  });
  describe("setCache", function () {
    it("calls setItem", function () {
      var node1 = {
        id: 1
      };
      var node2 = {
        id: 2
      };
      var dataSet = {
        nodes: {
          _data: {
            1: node1,
            2: node2
          }
        },
        edges: {}
      };
      setCache(mockId, false, dataSet);
      var extractedData = {
        nodes: indexBy([node1, node2], "id")
      };
      expect(Cache.set).toBeCalledWith(getCacheKey(mockId, false), JSON.stringify(extractedData));
    });
    it("does not call getItem if id is falsy", function () {
      setCache(null, false, {});
      expect(Cache.set).not.toBeCalled();
    });
  });
});