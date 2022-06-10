(self["webpackChunkshop"] = self["webpackChunkshop"] || []).push([[65],{

/***/ 6065:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: consume shared module (default) react@=18.1.0 (strict) (singleton) (fallback: ../../node_modules/react/index.js)
var index_js_ = __webpack_require__(6725);
var index_js_default = /*#__PURE__*/__webpack_require__.n(index_js_);
// EXTERNAL MODULE: ../../node_modules/react-dom/client.js
var client = __webpack_require__(7029);
// EXTERNAL MODULE: ../../node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js + 2 modules
var emotion_styled_base_browser_esm = __webpack_require__(1240);
// EXTERNAL MODULE: ../../node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
var objectWithoutPropertiesLoose = __webpack_require__(1461);
// EXTERNAL MODULE: ../../node_modules/@emotion/react/jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js
var emotion_react_jsx_runtime_browser_esm = __webpack_require__(2903);
;// CONCATENATED MODULE: ./src/app/ModuleFederationWrapper/FederatetWrapper.tsx


class FederatedWrapper extends (index_js_default()).Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(_) {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true
    };
  }

  componentDidCatch(error, errorInfo) {// You can also log the error to an error reporting service
    //   logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.error || (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("div", {
        children: "Something went wrong."
      });
    }

    return (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)((index_js_default()).Suspense, {
      fallback: this.props.delayed || (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("div", {}),
      children: this.props.children
    });
  }

}
;// CONCATENATED MODULE: ./src/app/ModuleFederationWrapper/wrapComponent.tsx

const _excluded = ["error", "delayed"];




const wrapComponent = Component => _ref => {
  let {
    error,
    delayed
  } = _ref,
      props = (0,objectWithoutPropertiesLoose/* default */.Z)(_ref, _excluded);

  return (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(FederatedWrapper, {
    error: error,
    delayed: delayed,
    children: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(Component, Object.assign({}, props))
  });
};

/* harmony default export */ const ModuleFederationWrapper_wrapComponent = (wrapComponent);
;// CONCATENATED MODULE: ./src/app/app.tsx


function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }





const Search = ModuleFederationWrapper_wrapComponent( /*#__PURE__*/index_js_default().lazy(() => __webpack_require__.e(/* import() */ 894).then(__webpack_require__.t.bind(__webpack_require__, 9894, 23))));

const StyledApp = (0,emotion_styled_base_browser_esm/* default */.Z)("div",  true ? {
  target: "eovsnrh1"
} : 0)( true ? {
  name: "ed16j2",
  styles: "padding-top:10px;display:flex;flex-direction:column"
} : 0);

const StyledPage = (0,emotion_styled_base_browser_esm/* default */.Z)("div",  true ? {
  target: "eovsnrh0"
} : 0)( true ? {
  name: "zl1inp",
  styles: "display:flex;justify-content:center"
} : 0);

function App() {
  return (0,emotion_react_jsx_runtime_browser_esm/* jsxs */.BX)(StyledApp, {
    children: [(0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(Search, {
      delayed: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("div", {
        children: "Loading Search ..."
      }),
      error: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("div", {
        children: "Error Loading Search remote"
      })
    }), (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(StyledPage, {
      children: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("h1", {
        children: "---- Shoppage ----"
      })
    })]
  });
}
;// CONCATENATED MODULE: ./src/bootstrap.tsx




const root = client/* createRoot */.s(document.getElementById('root'));
root.render((0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(index_js_.StrictMode, {
  children: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(App, {})
}));

/***/ }),

/***/ 7029:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;


var m = __webpack_require__(4093);
if (true) {
  exports.s = m.createRoot;
  __webpack_unused_export__ = m.hydrateRoot;
} else { var i; }


/***/ })

}])