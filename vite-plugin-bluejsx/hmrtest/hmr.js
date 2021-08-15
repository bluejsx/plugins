var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
System.register("hmr", ["@swc/core", "@swc/core/Visitor.js"], function (exports_1, context_1) {
    "use strict";
    var core_1, Visitor_js_1, log, HMRTransformer, codeTransformer, addHMR, code;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Visitor_js_1_1) {
                Visitor_js_1 = Visitor_js_1_1;
            }
        ],
        execute: function () {
            log = console.log;
            HMRTransformer = /** @class */ (function (_super) {
                __extends(HMRTransformer, _super);
                function HMRTransformer() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                HMRTransformer.prototype.visitCallExpression = function (e) {
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
                */
                    return e;
                };
                return HMRTransformer;
            }(Visitor_js_1["default"]));
            codeTransformer = new HMRTransformer();
            exports_1("addHMR", addHMR = function (code) {
                code = core_1.transformSync(code, {
                    plugin: function (m) { return codeTransformer.visitProgram(m); }
                }).code;
                return code;
            });
            code = "import Blue, { useAttr, ElemType } from 'bluejsx'\nimport { CustomProgress } from './CustomProgress'\n\nexport default ({ progValue = 0, children = null }) => {\n  const progress = <CustomProgress max='100' value={progValue} />\n  const percentage = new Text(''+progValue)\n  const refs: {\n    btn?: ElemType<'button'>\n  } = {}\n  const self = (\n    <div class='t3'>\n      <button ref={[refs, 'btn']}>click</button>\n      {progress}\n      {percentage} %\n      {children}\n    </div>\n  )\n  const { btn } = refs\n  useAttr(self, 'progValue', progValue)\n  self.watch('progValue', v =>{ \n    progress.value = v\n    percentage.data = v\n  })\n\n  btn.onclick = () => {\n    if (self.progValue < 100) self.progValue += 10\n    else self.progValue = 0\n  }\n  return self\n}\nexport function Unko(){\n  return <div>Hello</div>\n}\nconst num1 = 56\nexport { num1 }\n\nexport const ExmpleSub = () =>{\n  \n}\n";
            log(addHMR(code));
        }
    };
});
