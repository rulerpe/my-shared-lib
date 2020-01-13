import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
// import { PropTypes, UI } from "js-common";
import React from "react";
export var ZoomButtons =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ZoomButtons, _React$Component);

  function ZoomButtons() {
    _classCallCheck(this, ZoomButtons);

    return _possibleConstructorReturn(this, _getPrototypeOf(ZoomButtons).apply(this, arguments));
  }

  _createClass(ZoomButtons, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "zoom-buttons"
      }, React.createElement("div", {
        onClick: this.props.onZoomIn,
        className: "zoom-in zoom-button"
      }, React.createElement("i", {
        className: "far fa-pro-plus"
      })), React.createElement("div", {
        onClick: this.props.onZoomOut,
        className: "zoom-out zoom-button"
      }, React.createElement("i", {
        className: "far fa-pro-minus"
      })));
    }
  }]);

  return ZoomButtons;
}(React.Component);