var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => withBlueJSX
});
var import_vite_plugin_blue_hmr = __toESM(require("@bluejsx/vite-plugin-blue-hmr"), 1);
var import_vite_plugin_bluemdx = __toESM(require("@bluejsx/vite-plugin-bluemdx"), 1);
function withBlueJSX(config) {
  var _a, _b, _c, _d, _e;
  (_a = config.esbuild) != null ? _a : config.esbuild = {};
  const esbuild = config.esbuild;
  esbuild.jsxFactory = "Blue.r";
  esbuild.jsxFragment = "Blue.Fragment";
  esbuild.jsxInject = `import Blue from 'bluejsx'`;
  const mdxOptions = (_b = config.mdxOptions) != null ? _b : {};
  const useHMR = (_d = (_c = config.bluejsx) == null ? void 0 : _c.hmr) != null ? _d : true;
  (_e = config.plugins) != null ? _e : config.plugins = [];
  config.plugins.push((0, import_vite_plugin_blue_hmr.default)({ enabled: useHMR }), (0, import_vite_plugin_bluemdx.default)(mdxOptions));
  return config;
}
module.exports = __toCommonJS(src_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
