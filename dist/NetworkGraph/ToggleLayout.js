import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
// import { PropTypes, UI, t } from "js-common";
import React from "react";
import classnames from "classnames";
export var ToggleLayout =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ToggleLayout, _React$Component);

  function ToggleLayout() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ToggleLayout);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ToggleLayout)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleClick = function () {
      console.log("click");

      if (_this.props.isHierarchy) {
        _this.props.onSwithToNonTree();
      } else {
        _this.props.onSwithToTree();
      }
    };

    return _this;
  }

  _createClass(ToggleLayout, [{
    key: "render",
    value: function render() {
      var label = this.props.isHierarchy ? "cluster" //<span><UI.Icon light fw name="chart-network" />{t.title("network-glue.cluster-view")}</span>
      : "tree"; //<span><UI.Icon light fw name="network-wired" />{t.title("network-glue.tree-view")}</span>;

      var className = classnames("toggle-layout", this.props.className);
      return React.createElement("div", {
        className: className
      }, React.createElement("button", {
        onClick: this.handleClick,
        className: "autowidth medium",
        value: label
      }));
    }
  }]);

  return ToggleLayout;
}(React.Component);