import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
var hierarchical = {
  enabled: true,
  levelSeparation: 300,
  nodeSpacing: 120,
  treeSpacing: 200,
  blockShifting: true,
  edgeMinimization: true,
  parentCentralization: true,
  direction: "UD",
  // UD, DU, LR, RL
  sortMethod: "directed" // hubsize, directed

};
export var layout = {
  randomSeed: 153625,
  improvedLayout: false,
  hierarchical: _objectSpread({}, hierarchical)
};