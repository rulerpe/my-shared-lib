import { COLOR } from "../../constants";
import { defaultInferredNodeSize, defaultNodeSize, collapseExpandButtonNodeSize } from "./nodes";

function GroupColor(background, border, hover) {
  return {
    background: background,
    border: border,
    hover: hover,
    highlight: hover
  };
}

function GroupIcon(code) {
  var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "black";
  return {
    code: code,
    color: color,
    face: "'FontAwesome'"
  };
}

function generateImage(svgString) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
}
/* eslint-disable */


function makeQuestionMark(color) {
  return "<path xmlns=\"http://www.w3.org/2000/svg\" fill=\"".concat(color, "\" d=\"M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z\"/>");
}

var questionMark = makeQuestionMark(COLOR.ORANGE);
var whiteCircle = '<circle cx="50%" cy="50%" r="256" fill="white" />';
var questionSvg = '<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">' + whiteCircle + questionMark + '</svg>';
var questionIconDimmed = '<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">' + whiteCircle + makeQuestionMark(COLOR.GRAY_DIMMED) + '</svg>';
var question = generateImage(questionSvg);
var questionFiltered = generateImage(questionIconDimmed);

var generateHaloSvg = function generateHaloSvg() {
  var borderColor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : COLOR.GRAY;
  return "\n    <svg width=\"10\" height=\"10\" viewBox=\"0 0 512 512\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle cx=\"50%\" cy=\"50%\" r=\"50%\" mask=\"url(#rmvCir)\" fill=\"#ECECEC\" stroke=\"".concat(borderColor, "\" stroke-dasharray=\"20 30\" stroke-width=\"1em\" />\n        <mask id=\"rmvCir\">\n            <circle cx=\"50%\" cy=\"50%\" r=\"50%\" fill=\"white\" />\n            <circle cx=\"50%\" cy=\"50%\" r=\"0%\" fill=\"black\" />\n        </mask>\n    </svg>\n");
};

var haloSVG = generateHaloSvg();
var haloImage = generateImage(haloSVG);
var haloFilteredSVG = generateHaloSvg(COLOR.GRAY_DIMMED);
var haloFilteredImage = generateImage(haloFilteredSVG);

function makePlusSvgForPill(color) {
  return "\n        <svg version=\"1.1\" width=\"20\" height=\"10\" viewBox=\"0 0 512 512\">\n            <circle cx=\"0\" cy=\"50%\" r=\"40%\" fill=\"white\" />\n            <path transform=\"translate(-256)\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"".concat(color, "\" d=\"M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z\"/>\n        </svg>\n    ");
}

function makeMinusSvgForPill(color) {
  return "\n        <svg version=\"1.1\" width=\"20\" height=\"10\" viewBox=\"0 0 512 512\">\n            <circle cx=\"0\" cy=\"50%\" r=\"40%\" fill=\"white\" />\n            <path transform=\"translate(-256)\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"".concat(color, "\" d=\"M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z\"/>\n        </svg>\n    ");
}

function makePillSvg(icon, text, isFiltered) {
  return "\n        <svg version=\"1.1\" width=\"20\" height=\"10\" viewBox=\"0 0 20 10\" xmlns=\"http://www.w3.org/2000/svg\">\n            <rect width=\"20\" height=\"10\" fill=\"".concat(isFiltered ? "#CCCCCC" : COLOR.GRAY_LIGTHEN2, "\" ry=\"5\" rx=\"5\"/>\n            <circle cx=\"5\" cy=\"5\" r=\"5\" fill=\"").concat(isFiltered ? COLOR.GRAY_DIMMED : COLOR.GRAY2, "\" />\n            ").concat(icon, "\n            <style><![CDATA[\n                text {\n                    font: 5px Roboto;\n                }\n                ]]>\n            </style>\n            <text x=\"14.5\" y=\"5\" dominant-baseline=\"central\" alignment-baseline=\"central\" text-anchor=\"middle\" fill=\"").concat(isFiltered ? COLOR.GRAY2 : COLOR.BLACK, "\">").concat("" + text, "</text>\n        </svg>\n    ");
}

function makeBluePillSvg(text, isFiltered) {
  var height = 10;
  var defaultWidth = 10;
  var fontSize = 5;
  var extraCharacterCount = text.length - 1;
  var extraWidth = extraCharacterCount * fontSize / 2;
  var width = defaultWidth + extraWidth;
  var horizontalOffset = width / 2 + extraWidth / 2;
  var textOffsetX = width / 2;
  var textOffsetY = height / 2;
  return "\n        <svg version=\"1.1\" width=\"".concat(width * 2, "\" height=\"10\" viewBox=\"0 0 ").concat(width * 2, " 10\" xmlns=\"http://www.w3.org/2000/svg\">\n            <rect x=\"").concat(horizontalOffset, "\" y=\"0\" width=\"").concat(width, "\" height=\"").concat(height, "\" fill=\"").concat(isFiltered ? COLOR.BLUE_DIMMED : COLOR.BLUE, "\" ry=\"5\" rx=\"5\"/>\n            <style><![CDATA[\n                text {\n                    font: ").concat(fontSize, "px Roboto;\n                }\n                ]]>\n            </style>\n            <text x=\"").concat(horizontalOffset + textOffsetX, "\" y=\"").concat(textOffsetY, "\" dominant-baseline=\"central\" alignment-baseline=\"central\" text-anchor=\"middle\" fill=\"").concat(COLOR.WHITE, "\">").concat("" + text, "</text>\n        </svg>\n    ");
}

var generatePillImageWithText = function generatePillImageWithText(icon) {
  var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var isFiltered = arguments.length > 2 ? arguments[2] : undefined;
  return generateImage(makePillSvg(icon, text, isFiltered));
};

export var generatePlusIconPillImageWithText = function generatePlusIconPillImageWithText(text, isFiltered) {
  return generatePillImageWithText(makePlusSvgForPill(isFiltered ? COLOR.GRAY_DIMMED : COLOR.GRAY2), text, isFiltered);
};
export var generateMinusIconPillImageWithText = function generateMinusIconPillImageWithText(text, isFiltered) {
  return generatePillImageWithText(makeMinusSvgForPill(isFiltered ? COLOR.GRAY_DIMMED : COLOR.GRAY2), text, isFiltered);
};
export var generateGroupSizeImageWithText = function generateGroupSizeImageWithText(text) {
  var isFiltered = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return generateImage(makeBluePillSvg(text, isFiltered));
};
/* eslint-enable */

export var groups = {
  computer: {
    color: GroupColor(COLOR.BACKGROUND, COLOR.BLUE, {
      background: COLOR.BLUE
    }),
    icon: GroupIcon("\uF108")
  },
  computerFiltered: {
    color: GroupColor(COLOR.BACKGROUND_DIMMED, COLOR.BLUE_DIMMED, {
      background: COLOR.BLUE_DIMMED
    }),
    icon: GroupIcon("\uF108", COLOR.BLACK_DIMMED)
  },
  hub: {
    color: GroupColor(COLOR.GRAY_LIGTHEN, COLOR.GRAY_LIGTHEN, {
      background: COLOR.GRAY_LIGTHEN,
      border: COLOR.GRAY_LIGTHEN
    }),
    size: defaultInferredNodeSize,
    zIndex: 1
  },
  hubFiltered: {
    color: GroupColor(COLOR.GRAY_DIMMED, COLOR.GRAY_DIMMED, {
      background: COLOR.GRAY_DIMMED,
      border: COLOR.GRAY_DIMMED
    }),
    size: defaultInferredNodeSize,
    zIndex: 1
  },
  printer: {
    color: GroupColor(COLOR.BACKGROUND, COLOR.BLUE, {
      background: COLOR.BLUE
    }),
    icon: GroupIcon("\uF02F")
  },
  printerFiltered: {
    color: GroupColor(COLOR.BACKGROUND_DIMMED, COLOR.BLUE_DIMMED, {
      background: COLOR.BLUE_DIMMED
    }),
    icon: GroupIcon("\uF02F", COLOR.BLACK_DIMMED)
  },
  router: {
    color: GroupColor(COLOR.BACKGROUND, COLOR.YELLOW, {
      background: COLOR.YELLOW
    }),
    icon: GroupIcon("\uF0A0"),
    zIndex: 1
  },
  routerFiltered: {
    color: GroupColor(COLOR.BACKGROUND_DIMMED, COLOR.YELLOW_DIMMED, {
      background: COLOR.YELLOW_DIMMED
    }),
    icon: GroupIcon("\uF0A0", COLOR.BLACK_DIMMED),
    zIndex: 1
  },
  switch: {
    color: GroupColor(COLOR.BACKGROUND, COLOR.YELLOW, {
      background: COLOR.YELLOW
    }),
    icon: GroupIcon("\uF362"),
    zIndex: 1
  },
  switchFiltered: {
    color: GroupColor(COLOR.BACKGROUND_DIMMED, COLOR.YELLOW_DIMMED, {
      background: COLOR.YELLOW_DIMMED
    }),
    icon: GroupIcon("\uF362", COLOR.BLACK_DIMMED),
    zIndex: 1
  },
  server: {
    color: GroupColor(COLOR.BACKGROUND, COLOR.BLUE, {
      background: COLOR.BLUE
    }),
    icon: GroupIcon("\uF233")
  },
  serverFiltered: {
    color: GroupColor(COLOR.BACKGROUND_DIMMED, COLOR.BLUE_DIMMED, {
      background: COLOR.BLUE_DIMMED
    }),
    icon: GroupIcon("\uF233", COLOR.BLACK_DIMMED)
  },
  unknown: {
    color: GroupColor(COLOR.BACKGROUND, COLOR.BLUE, {
      background: COLOR.BLUE
    }),
    icon: GroupIcon("\uF796")
  },
  unknownFiltered: {
    color: GroupColor(COLOR.BACKGROUND_DIMMED, COLOR.BLUE_DIMMED, {
      background: COLOR.BLUE_DIMMED
    }),
    icon: GroupIcon("\uF796", COLOR.BLACK_DIMMED)
  },
  groupSize: {
    shape: "image",
    size: collapseExpandButtonNodeSize,
    zIndex: 2
  },
  question: {
    image: {
      selected: question,
      unselected: question
    },
    shape: "image",
    size: 12,
    zIndex: 2
  },
  questionFiltered: {
    image: {
      selected: questionFiltered,
      unselected: questionFiltered
    },
    shape: "image",
    size: 12,
    zIndex: 2
  },
  halo: {
    image: {
      selected: haloImage,
      unselected: haloImage
    },
    shape: "image",
    size: defaultNodeSize * 2,
    zIndex: -10
  },
  haloFiltered: {
    image: {
      selected: haloFilteredImage,
      unselected: haloFilteredImage
    },
    shape: "image",
    size: defaultNodeSize * 2,
    zIndex: -10
  },
  haloForHub: {
    image: {
      selected: haloImage,
      unselected: haloImage
    },
    shape: "image",
    size: defaultNodeSize,
    zIndex: -10
  },
  haloForHubFiltered: {
    image: {
      selected: haloFilteredImage,
      unselected: haloFilteredImage
    },
    shape: "image",
    size: defaultNodeSize,
    zIndex: -10
  },
  plus: {
    shape: "image",
    size: collapseExpandButtonNodeSize,
    zIndex: 2
  },
  plusFiltered: {
    shape: "image",
    size: collapseExpandButtonNodeSize,
    zIndex: 2
  },
  minus: {
    shape: "image",
    size: collapseExpandButtonNodeSize,
    zIndex: 2
  },
  minusFiltered: {
    shape: "image",
    size: collapseExpandButtonNodeSize,
    zIndex: 2
  }
};