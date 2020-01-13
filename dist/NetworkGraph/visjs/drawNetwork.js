import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import FontFaceObserver from "fontfaceobserver";
import { Network, DataSet } from "vis"; // allow creating DataSets from inside the Network's owner
// which can keep the reference of the DataSet for caching

export function createDataSet(_ref) {
  var nodes = _ref.nodes,
      edges = _ref.edges;
  return {
    nodes: new DataSet(nodes),
    edges: new DataSet(edges)
  };
}
export var drawNetwork = function drawNetwork() {
  var onComplete = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (network) {
    return network;
  };
  var onError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (e) {
    return console.log("unhandled error", e);
  };
  var containerId = arguments.length > 2 ? arguments[2] : undefined;
  var data = arguments.length > 3 ? arguments[3] : undefined;
  var options = arguments.length > 4 ? arguments[4] : undefined;
  // must ensure the font has been loaded by the browser
  // https://github.com/almende/vis/issues/1835
  var fontAwesome5Pro = new FontFaceObserver("FontAwesome", {});
  var MAX_RETRY = 10;
  var container;

  function createNetwork() {
    options = _objectSpread({}, options, {
      edges: _objectSpread({}, options.edges),
      groups: _objectSpread({}, options.groups),
      interaction: _objectSpread({}, options.interaction),
      layout: _objectSpread({}, options.layout),
      nodes: _objectSpread({}, options.nodes),
      physics: _objectSpread({}, options.physics)
    });
    var network;

    try {
      network = new Network(container, data, options); // return a handle so we can interact with it

      onComplete(network);
    } catch (error) {
      onError(error);
    }
  }

  var draw = function draw() {
    fontAwesome5Pro.load().then(function () {
      console.log('success');
      createNetwork();
    }, // on success
    function () {
      console.log('fails');
      createNetwork();
    } // and on error, which normally is only a problem in IE/Edge because fontfaceobserver's Promise polyfill is somehow not working
    );
  };

  var tryToDraw = function tryToDraw() {
    // console.log("Retry remaining " + MAX_RETRY);
    MAX_RETRY--;
    container = document.getElementById(containerId);

    if (container) {
      draw();
    } else if (MAX_RETRY > 0) {
      setTimeout(tryToDraw, 0);
    }
  };

  tryToDraw();
};