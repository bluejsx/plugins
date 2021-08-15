import { transformSync } from "@swc/core";
import Visitor from "@swc/core/Visitor.js";
function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
var log = console.log;
var HMRTransformer = /*#__PURE__*/ function(Visitor1) {
    "use strict";
    _inherits(HMRTransformer, Visitor1);
    function HMRTransformer() {
        _classCallCheck(this, HMRTransformer);
        return _possibleConstructorReturn(this, _getPrototypeOf(HMRTransformer).apply(this, arguments));
    }
    _createClass(HMRTransformer, [
        {
            key: "visitCallExpression",
            value: function visitCallExpression(e) {
                log(e.callee.type);
                /*
    if (e.callee.type !== "MemberExpression") {
      return e;
    }

    if (
      e.callee.object.type === "Identifier" &&
      e.callee.object.value === "console"
    ) {
      if (e.callee.property.type === "Identifier") {
        return {
          type: "UnaryExpression",
          span: e.span,
          operator: "void",
          argument: {
            type: "NumericLiteral",
            span: e.span,
            value: 0
          }
        };
      }
    }
*/ return e;
            }
        }
    ]);
    return HMRTransformer;
}(Visitor);
var codeTransformer = new HMRTransformer();
export var addHMR = function(code) {
    code = transformSync(code, {
        plugin: function(m) {
            return codeTransformer.visitProgram(m);
        }
    }).code;
    return code;
};
var code = "import Blue, { useAttr, ElemType } from 'bluejsx'\nimport { CustomProgress } from './CustomProgress'\n\nexport default ({ progValue = 0, children = null }) => {\n  const progress = <CustomProgress max='100' value={progValue} />\n  const percentage = new Text(''+progValue)\n  const refs: {\n    btn?: ElemType<'button'>\n  } = {}\n  const self = (\n    <div class='t3'>\n      <button ref={[refs, 'btn']}>click</button>\n      {progress}\n      {percentage} %\n      {children}\n    </div>\n  )\n  const { btn } = refs\n  useAttr(self, 'progValue', progValue)\n  self.watch('progValue', v =>{ \n    progress.value = v\n    percentage.data = v\n  })\n\n  btn.onclick = () => {\n    if (self.progValue < 100) self.progValue += 10\n    else self.progValue = 0\n  }\n  return self\n}\nexport function Unko(){\n  return <div>Hello</div>\n}\nconst num1 = 56\nexport { num1 }\n\nexport const ExmpleSub = () =>{\n  \n}\n";
log(addHMR(code));

