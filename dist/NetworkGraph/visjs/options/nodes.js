import { COLOR } from "../../constants";
export var defaultFontSize = 12;
export var defaultNodeSize = 35;
export var defaultInferredNodeSize = 12;
export var collapseExpandButtonNodeSize = 15;
export var nodes = {
  borderWidth: 2,
  // because the borderWidthSelected option is broken, and by default it is borderWidth *2, setting this from 3 to 1 to avoid
  // a wide border when node is selected
  borderWidthSelected: 2,
  // this option currently doesn't work https://github.com/almende/vis/issues/2762
  color: {
    border: "white",
    highlight: {
      border: "white"
    },
    hover: {
      border: "white"
    }
  },
  chosen: true,
  // fixed: true,
  font: {
    size: defaultFontSize,
    face: "roboto condensed",
    vadjust: -4,
    color: COLOR.GRAY
  },
  shape: "dot",
  size: defaultNodeSize
};