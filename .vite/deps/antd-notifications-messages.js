import {
  require_client
} from "./chunk-MGLHDEX2.js";
import "./chunk-NK66VB5V.js";
import {
  require_react
} from "./chunk-SOSU2OUM.js";
import {
  __toESM
} from "./chunk-2LSFTFF7.js";

// node_modules/antd-notifications-messages/lib/esm/stores/StoreNotification.js
var React2 = __toESM(require_react());
var import_client = __toESM(require_client());

// node_modules/antd-notifications-messages/lib/esm/utils/generateUniqueId.js
function generateUniqueId() {
  return "".concat(Date.now(), "-").concat(Math.round(Math.random() * 1e9));
}

// node_modules/antd-notifications-messages/lib/esm/utils/resolveAnimation.js
var resolve = {
  // top
  topLeft: "fade-in-left",
  topRight: "fade-in-right",
  topCenter: "fade-in-top-center",
  // bottom
  bottomLeft: "fade-in-left",
  bottomRight: "fade-in-right",
  bottomCenter: "fade-in-bottom-center"
};
function resolveAnimation(animation) {
  return resolve[animation];
}

// node_modules/antd-notifications-messages/lib/esm/stores/Store.js
var Store = (
  /** @class */
  function() {
    function Store2() {
      this.instances = [];
      this.add = this.add.bind(this);
      this.set = this.set.bind(this);
      this.clear = this.clear.bind(this);
      this.render = this.render.bind(this);
      this.subscribe = this.subscribe.bind(this);
      this.unsubscribe = this.unsubscribe.bind(this);
      this.onTimeClose = this.onTimeClose.bind(this);
      this.getInstances = this.getInstances.bind(this);
    }
    Store2.prototype.render = function(_position) {
    };
    Store2.prototype.set = function(item) {
      var findIndex = this.instances.findIndex(function(f) {
        return f.key === item.key;
      });
      if (findIndex !== -1) {
        var timeoutKey = this.instances[findIndex].timeoutKey;
        if (timeoutKey)
          clearTimeout(timeoutKey);
        this.instances[findIndex] = item;
      }
    };
    Store2.prototype.add = function(item) {
      this.instances.push(item);
    };
    Store2.prototype.getInstances = function(position) {
      return this.instances.filter(function(f) {
        return f.position === position;
      });
    };
    Store2.prototype.onTimeClose = function(duration, key, position) {
      var _this = this;
      return setTimeout(function() {
        _this.unsubscribe(key, position);
      }, duration);
    };
    Store2.prototype.clear = function(key, resolve3) {
      var findItem = this.instances.find(function(f) {
        return f.key === key;
      });
      if (findItem && (findItem === null || findItem === void 0 ? void 0 : findItem.timeoutKey)) {
        clearTimeout(findItem.timeoutKey);
        resolve3();
      }
    };
    Store2.prototype.subscribe = function(_a) {
      var content = _a.content, duration = _a.duration, position = _a.position, key = _a.key, type = _a.type, _b = _a.closable, closable = _b === void 0 ? true : _b;
      var _key = key !== null && key !== void 0 ? key : generateUniqueId();
      var animation = resolveAnimation(position);
      var timeoutKey = null;
      var isNew = true;
      if (key) {
        this.clear(key, function() {
          return isNew = false;
        });
      }
      if (duration) {
        timeoutKey = this.onTimeClose(duration, _key, position);
      }
      var item = {
        type,
        key: _key,
        content,
        position,
        animation,
        closable,
        timeoutKey
      };
      if (isNew)
        this.add(item);
      else
        this.set(item);
      this.render(position);
    };
    Store2.prototype.unsubscribe = function(key, position) {
      this.instances = this.instances.filter(function(f) {
        return f.key !== key;
      });
      this.render(position);
    };
    return Store2;
  }()
);
var Store_default = Store;

// node_modules/antd-notifications-messages/lib/esm/components/wrapper.js
var React = __toESM(require_react());

// node_modules/antd-notifications-messages/lib/esm/utils/resolvePosition.js
var resolve2 = {
  topLeft: "position-top-left",
  topRight: "position-top-right",
  topCenter: "position-top-center",
  bottomRight: "position-bottom-right",
  bottomLeft: "position-bottom-left",
  bottomCenter: "position-bottom-center"
};
function resolvePosition(position) {
  return resolve2[position];
}

// node_modules/antd-notifications-messages/lib/esm/components/wrapper.js
var Wrapper = function(_a) {
  var instances = _a.instances, onRemove = _a.onRemove, position = _a.position, _b = _a.isMessage, isMessage = _b === void 0 ? false : _b;
  var positionClass = resolvePosition(position);
  var prefix = isMessage ? "message" : "notification";
  var _class = isMessage ? "wrapper-messages " : "wrapper-notifications ";
  return React.createElement("div", { className: _class + positionClass }, instances.map(function(child) {
    var _a2, _b2;
    var closableClass = (child === null || child === void 0 ? void 0 : child.closable) ? " ant-closable" : "";
    var className = (_b2 = (_a2 = child === null || child === void 0 ? void 0 : child.props) === null || _a2 === void 0 ? void 0 : _a2.className) !== null && _b2 !== void 0 ? _b2 : "";
    return React.createElement("div", { key: "".concat(prefix, "-").concat(child.key) }, React.cloneElement(child.content, {
      id: child.key,
      closable: child.closable,
      className: "ant-".concat(prefix, "-notice ").concat(child.animation, " ").concat(closableClass, " ").concat(className),
      onRemove: function() {
        return onRemove(child.key, position);
      }
    }));
  }));
};

// node_modules/antd-notifications-messages/lib/esm/stores/StoreNotification.js
var __extends = function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var root = {
  // top
  topRight: void 0,
  topCenter: void 0,
  topLeft: void 0,
  // bottom
  bottomRight: void 0,
  bottomCenter: void 0,
  bottomLeft: void 0
};
var StoreNotification = (
  /** @class */
  function(_super) {
    __extends(StoreNotification2, _super);
    function StoreNotification2() {
      return _super.call(this) || this;
    }
    StoreNotification2.prototype.render = function(position) {
      var _a;
      var positionClass = resolvePosition(position);
      var elm = document.querySelector(".wrapper-notifications.".concat(positionClass));
      var instances = this.getInstances(position);
      if (!root[position]) {
        root[position] = (0, import_client.createRoot)((elm === null || elm === void 0 ? void 0 : elm.parentElement) ? elm.parentElement : document.body.appendChild(document.createElement("DIV")));
      }
      (_a = root[position]) === null || _a === void 0 ? void 0 : _a.render(React2.createElement(Wrapper, { position, instances, onRemove: this.unsubscribe }));
    };
    return StoreNotification2;
  }(Store_default)
);
var StoreNotification_default = StoreNotification;

// node_modules/antd-notifications-messages/lib/esm/components/notification.js
var React3 = __toESM(require_react());
var __assign = function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __rest = function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var Notification = function(_a) {
  var title = _a.title, icon = _a.icon, message2 = _a.message, id = _a.id, onClick = _a.onClick, _b = _a.onRemove, onRemove = _b === void 0 ? function() {
  } : _b, _c = _a.type, type = _c === void 0 ? "success" : _c, _d = _a.className, className = _d === void 0 ? "" : _d, closable = _a.closable, rest = __rest(_a, ["title", "icon", "message", "id", "onClick", "onRemove", "type", "className", "closable"]);
  return React3.createElement(
    "div",
    __assign({ className, onClick: function(e) {
      onClick && onClick(e, onRemove);
      closable && onRemove();
    } }, rest),
    icon,
    React3.createElement(
      "div",
      null,
      React3.createElement("div", { className: "notification-title" }, title),
      React3.createElement("div", { className: "notification-content" }, message2)
    ),
    React3.createElement("div", { className: "notification-close", onClick: onRemove })
  );
};

// node_modules/antd-notifications-messages/lib/esm/actions/genericResolveAction.js
var React12 = __toESM(require_react());

// node_modules/antd-notifications-messages/lib/esm/components/antdIcons.js
var React11 = __toESM(require_react());

// node_modules/antd-notifications-messages/lib/esm/components/icon.js
var React10 = __toESM(require_react());

// node_modules/antd-notifications-messages/lib/esm/icons/checkFilled.js
var import_react = __toESM(require_react());
var __extends2 = function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var CheckIcon = (
  /** @class */
  function(_super) {
    __extends2(CheckIcon3, _super);
    function CheckIcon3() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckIcon3.prototype.render = function() {
      return import_react.default.createElement(
        "svg",
        { xmlns: "http://www.w3.org/2000/svg", className: "icon", viewBox: "0 0 1024 1024" },
        import_react.default.createElement("path", { d: "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" })
      );
    };
    return CheckIcon3;
  }(import_react.default.Component)
);
var checkFilled_default = CheckIcon;

// node_modules/antd-notifications-messages/lib/esm/icons/checkOutline.js
var import_react2 = __toESM(require_react());
var __extends3 = function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var CheckOutline = (
  /** @class */
  function(_super) {
    __extends3(CheckOutline3, _super);
    function CheckOutline3() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckOutline3.prototype.render = function() {
      return import_react2.default.createElement(
        "svg",
        { xmlns: "http://www.w3.org/2000/svg", className: "icon", viewBox: "0 0 1024 1024" },
        import_react2.default.createElement("path", { d: "M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0 0 51.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z" }),
        import_react2.default.createElement("path", { d: "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" })
      );
    };
    return CheckOutline3;
  }(import_react2.default.Component)
);
var checkOutline_default = CheckOutline;

// node_modules/antd-notifications-messages/lib/esm/icons/errorFilled.js
var import_react3 = __toESM(require_react());
var __extends4 = function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var ErrorFilled = (
  /** @class */
  function(_super) {
    __extends4(ErrorFilled3, _super);
    function ErrorFilled3() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    ErrorFilled3.prototype.render = function() {
      return import_react3.default.createElement(
        "svg",
        { xmlns: "http://www.w3.org/2000/svg", className: "icon", viewBox: "0 0 1024 1024" },
        import_react3.default.createElement("path", { d: "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" })
      );
    };
    return ErrorFilled3;
  }(import_react3.default.Component)
);
var errorFilled_default = ErrorFilled;

// node_modules/antd-notifications-messages/lib/esm/icons/errorOutline.js
var import_react4 = __toESM(require_react());
var __extends5 = function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var ErrorOutline = (
  /** @class */
  function(_super) {
    __extends5(ErrorOutline3, _super);
    function ErrorOutline3() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    ErrorOutline3.prototype.render = function() {
      return import_react4.default.createElement(
        "svg",
        { xmlns: "http://www.w3.org/2000/svg", className: "icon", viewBox: "0 0 1024 1024" },
        import_react4.default.createElement("path", { d: "M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z" }),
        import_react4.default.createElement("path", { d: "M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" })
      );
    };
    return ErrorOutline3;
  }(import_react4.default.Component)
);
var errorOutline_default = ErrorOutline;

// node_modules/antd-notifications-messages/lib/esm/icons/infoWarningOutline.js
var import_react5 = __toESM(require_react());
var __extends6 = function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var CheckIcon2 = (
  /** @class */
  function(_super) {
    __extends6(CheckIcon3, _super);
    function CheckIcon3() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckIcon3.prototype.render = function() {
      return import_react5.default.createElement(
        "svg",
        { xmlns: "http://www.w3.org/2000/svg", className: "icon", viewBox: "0 0 1024 1024" },
        import_react5.default.createElement("path", { d: "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" }),
        import_react5.default.createElement("path", { d: "M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" })
      );
    };
    return CheckIcon3;
  }(import_react5.default.Component)
);
var infoWarningOutline_default = CheckIcon2;

// node_modules/antd-notifications-messages/lib/esm/icons/infoWarningFilled.js
var import_react6 = __toESM(require_react());
var __extends7 = function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var InfoWarning = (
  /** @class */
  function(_super) {
    __extends7(InfoWarning2, _super);
    function InfoWarning2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    InfoWarning2.prototype.render = function() {
      return import_react6.default.createElement(
        "svg",
        { xmlns: "http://www.w3.org/2000/svg", className: "icon", viewBox: "0 0 1024 1024" },
        import_react6.default.createElement("path", { d: "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z" })
      );
    };
    return InfoWarning2;
  }(import_react6.default.Component)
);
var infoWarningFilled_default = InfoWarning;

// node_modules/antd-notifications-messages/lib/esm/components/icon.js
var CheckFilled = function() {
  return React10.createElement(
    "span",
    { className: "ant-icon", role: "img", "aria-label": "check-filled" },
    React10.createElement(checkFilled_default, null)
  );
};
var CheckOutline2 = function() {
  return React10.createElement(
    "span",
    { className: "ant-icon", role: "img", "aria-label": "check-outline" },
    React10.createElement(checkOutline_default, null)
  );
};
var ErrorFilled2 = function() {
  return React10.createElement(
    "span",
    { className: "ant-icon", role: "img", "aria-label": "error-filled" },
    React10.createElement(errorFilled_default, null)
  );
};
var ErrorOutline2 = function() {
  return React10.createElement(
    "span",
    { className: "ant-icon", role: "img", "aria-label": "error-outline" },
    React10.createElement(errorOutline_default, null)
  );
};
var InfoFilled = function() {
  return React10.createElement(
    "span",
    { className: "ant-icon", role: "img", "aria-label": "info-filled" },
    React10.createElement(infoWarningFilled_default, null)
  );
};
var InfoOutline = function() {
  return React10.createElement(
    "span",
    { className: "ant-icon", role: "img", "aria-label": "info-outline" },
    React10.createElement(infoWarningOutline_default, null)
  );
};
var WarningFilled = function() {
  return React10.createElement(
    "span",
    { className: "ant-icon", role: "img", "aria-label": "warning-filled" },
    React10.createElement(infoWarningFilled_default, null)
  );
};
var WarningOutline = function() {
  return React10.createElement(
    "span",
    { className: "ant-icon", role: "img", "aria-label": "warning-outline" },
    React10.createElement(infoWarningOutline_default, null)
  );
};

// node_modules/antd-notifications-messages/lib/esm/components/antdIcons.js
var AntdIcon = function(_a) {
  var type = _a.type, _b = _a.isFilled, isFilled = _b === void 0 ? false : _b;
  switch (type) {
    case "success":
      return isFilled ? React11.createElement(CheckFilled, null) : React11.createElement(CheckOutline2, null);
    case "info":
      return isFilled ? React11.createElement(InfoFilled, null) : React11.createElement(InfoOutline, null);
    case "warning":
      return isFilled ? React11.createElement(WarningFilled, null) : React11.createElement(WarningOutline, null);
    case "error":
      return isFilled ? React11.createElement(ErrorFilled2, null) : React11.createElement(ErrorOutline2, null);
    default:
      return isFilled ? React11.createElement(CheckFilled, null) : React11.createElement(CheckOutline2, null);
  }
};

// node_modules/antd-notifications-messages/lib/esm/actions/genericResolveAction.js
var __assign2 = function() {
  __assign2 = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign2.apply(this, arguments);
};
var __rest2 = function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
function genericResolveProps(_a, Component, prefix) {
  var render = _a.render, _icon = _a.icon, _b = _a.type, type = _b === void 0 ? "success" : _b, props = __rest2(_a, ["render", "icon", "type"]);
  var icon = _icon || React12.createElement(
    "div",
    { className: "icon-".concat(prefix, " icon-").concat(type) },
    React12.createElement(AntdIcon, { isFilled: prefix === "message", type })
  );
  var _render = function() {
    if (render) {
      var InternalComponent = function(newProps) {
        return React12.createElement(React12.Fragment, null, render(newProps));
      };
      return React12.createElement(InternalComponent, __assign2({ type, icon }, props));
    }
    return React12.createElement(Component, __assign2({ type, icon }, props));
  };
  return __assign2(__assign2({ type, icon }, props), { content: _render() });
}
var genericResolveAction_default = genericResolveProps;

// node_modules/antd-notifications-messages/lib/esm/actions/notifications.action.js
var __assign3 = function() {
  __assign3 = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign3.apply(this, arguments);
};
var __rest3 = function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var store = new StoreNotification_default();
var notification = function(_a) {
  var _b = _a.duration, duration = _b === void 0 ? 7e3 : _b, _c = _a.position, position = _c === void 0 ? "topRight" : _c, _d = _a.type, type = _d === void 0 ? "success" : _d, _e = _a.closable, closable = _e === void 0 ? false : _e, props = __rest3(_a, ["duration", "position", "type", "closable"]);
  var resolveProps = genericResolveAction_default(__assign3({ type }, props), Notification, "notification");
  store.subscribe(__assign3({ duration, position, closable }, resolveProps));
};

// node_modules/antd-notifications-messages/lib/esm/actions/messages.action.js
var React16 = __toESM(require_react());

// node_modules/antd-notifications-messages/lib/esm/stores/StoreMessage.js
var React13 = __toESM(require_react());
var import_client2 = __toESM(require_client());
var __extends8 = function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var root2 = {
  // top
  topRight: void 0,
  topCenter: void 0,
  topLeft: void 0,
  // bottom
  bottomRight: void 0,
  bottomCenter: void 0,
  bottomLeft: void 0
};
var StoreMessage = (
  /** @class */
  function(_super) {
    __extends8(StoreMessage2, _super);
    function StoreMessage2() {
      return _super.call(this) || this;
    }
    StoreMessage2.prototype.render = function(position) {
      var _a;
      var positionClass = resolvePosition(position);
      var elm = document.querySelector(".wrapper-messages.".concat(positionClass));
      var instances = this.getInstances(position);
      if (!root2[position]) {
        root2[position] = (0, import_client2.createRoot)((elm === null || elm === void 0 ? void 0 : elm.parentElement) ? elm.parentElement : document.body.appendChild(document.createElement("DIV")));
      }
      (_a = root2[position]) === null || _a === void 0 ? void 0 : _a.render(React13.createElement(Wrapper, { isMessage: true, position, instances, onRemove: this.unsubscribe }));
    };
    return StoreMessage2;
  }(Store_default)
);
var StoreMessage_default = StoreMessage;

// node_modules/antd-notifications-messages/lib/esm/components/message.js
var React14 = __toESM(require_react());
var __assign4 = function() {
  __assign4 = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign4.apply(this, arguments);
};
var __rest4 = function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
function Message(_a) {
  var message2 = _a.message, icon = _a.icon, onRemove = _a.onRemove, closable = _a.closable, _b = _a.type, type = _b === void 0 ? "success" : _b, _c = _a.className, className = _c === void 0 ? "" : _c, rest = __rest4(_a, ["message", "icon", "onRemove", "closable", "type", "className"]);
  return React14.createElement(
    "div",
    __assign4({ className, onClick: closable ? onRemove : void 0 }, rest),
    icon,
    React14.createElement(
      "div",
      { className: "notification-content message-content" },
      React14.createElement("span", null, message2)
    )
  );
}
var message_default = Message;

// node_modules/antd-notifications-messages/lib/esm/icons/loadingFilled.js
var import_react7 = __toESM(require_react());
var __extends9 = function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var LoadingFilled = (
  /** @class */
  function(_super) {
    __extends9(LoadingFilled2, _super);
    function LoadingFilled2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    LoadingFilled2.prototype.render = function() {
      return import_react7.default.createElement(
        "svg",
        { viewBox: "0 0 1024 1024", focusable: "false", "data-icon": "loading", width: "1em", height: "1em", fill: "currentColor", "aria-hidden": "true", className: "animation-spin" },
        import_react7.default.createElement("path", { d: "M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" })
      );
    };
    return LoadingFilled2;
  }(import_react7.default.Component)
);
var loadingFilled_default = LoadingFilled;

// node_modules/antd-notifications-messages/lib/esm/actions/messages.action.js
var __assign5 = function() {
  __assign5 = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign5.apply(this, arguments);
};
var __rest5 = function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var store2 = new StoreMessage_default();
var message = function(_a) {
  var key = _a.key, _b = _a.duration, duration = _b === void 0 ? 7e3 : _b, _c = _a.type, type = _c === void 0 ? "success" : _c, _d = _a.position, position = _d === void 0 ? "topCenter" : _d, _e = _a.closable, closable = _e === void 0 ? false : _e, props = __rest5(_a, ["key", "duration", "type", "position", "closable"]);
  var resolveProps = genericResolveAction_default(__assign5({ type }, props), message_default, "message");
  store2.subscribe(__assign5({ key, duration, position, closable }, resolveProps));
};
var messageLoading = function(_a) {
  var key = _a.key, render = _a.render, _b = _a.duration, duration = _b === void 0 ? 7e3 : _b, _c = _a.type, type = _c === void 0 ? "success" : _c, _d = _a.position, position = _d === void 0 ? "topCenter" : _d, _e = _a.closable, closable = _e === void 0 ? false : _e, _f = _a.icon, icon = _f === void 0 ? React16.createElement(
    "div",
    { className: "icon-message" },
    React16.createElement(loadingFilled_default, null)
  ) : _f, props = __rest5(_a, ["key", "render", "duration", "type", "position", "closable", "icon"]);
  return new Promise(function(resolve3) {
    var resolveProps = genericResolveAction_default(__assign5({ type, icon }, props), message_default, "message");
    store2.subscribe(__assign5({ key, duration, position, closable }, resolveProps));
    duration && setTimeout(function() {
      return resolve3(key);
    }, duration - 300);
  });
};
message.loading = messageLoading;
export {
  message,
  notification
};
//# sourceMappingURL=antd-notifications-messages.js.map
