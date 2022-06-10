(self["webpackChunkhost"] = self["webpackChunkhost"] || []).push([[161],{

/***/ 6065:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: consume shared module (default) react@=18.1.0 (strict) (singleton) (fallback: ../../node_modules/react/index.js)
var index_js_ = __webpack_require__(6725);
var index_js_default = /*#__PURE__*/__webpack_require__.n(index_js_);
// EXTERNAL MODULE: ../../node_modules/react-dom/client.js
var client = __webpack_require__(7029);
// EXTERNAL MODULE: consume shared module (default) react-router-dom@=6.3.0 (strict) (singleton) (fallback: ../../node_modules/react-router-dom/index.js)
var react_router_dom_index_js_ = __webpack_require__(5493);
// EXTERNAL MODULE: ../../node_modules/@emotion/react/jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js + 15 modules
var emotion_react_jsx_runtime_browser_esm = __webpack_require__(8631);
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
// EXTERNAL MODULE: ../../node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
var objectWithoutPropertiesLoose = __webpack_require__(1461);
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



 // wrapComponent is an HOC with an ErrorBoundary and also wrapped with React.Suspense to lazy load the module/MicroFrontend



const Shop = ModuleFederationWrapper_wrapComponent( /*#__PURE__*/index_js_.lazy(() => __webpack_require__.e(/* import() */ 952).then(__webpack_require__.t.bind(__webpack_require__, 2952, 23))));
const Payment = ModuleFederationWrapper_wrapComponent( /*#__PURE__*/index_js_.lazy(() => __webpack_require__.e(/* import() */ 909).then(__webpack_require__.t.bind(__webpack_require__, 909, 23)))); // const Search = wrapComponent(React.lazy(() => import('search/Module')));
// Normal lazy import without wrapComponent (must be wrapped with FederatedWrapper to get the same benefits from ErrorBaundary and React.Suspense)

const About = /*#__PURE__*/index_js_.lazy(() => __webpack_require__.e(/* import() */ 260).then(__webpack_require__.t.bind(__webpack_require__, 8260, 23)));
function App() {
  return (0,emotion_react_jsx_runtime_browser_esm/* jsxs */.BX)(index_js_.Suspense, {
    fallback: null,
    children: [(0,emotion_react_jsx_runtime_browser_esm/* jsxs */.BX)("ul", {
      children: [(0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("li", {
        children: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(react_router_dom_index_js_.Link, {
          to: "/",
          children: " Home "
        })
      }), (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("li", {
        children: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(react_router_dom_index_js_.Link, {
          to: "/payment",
          children: " Payment "
        })
      }), (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("li", {
        children: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(react_router_dom_index_js_.Link, {
          to: "/about",
          children: " About "
        })
      })]
    }), (0,emotion_react_jsx_runtime_browser_esm/* jsxs */.BX)(react_router_dom_index_js_.Routes, {
      children: [(0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(react_router_dom_index_js_.Route, {
        path: "/",
        element: // <>
        //   <Search
        //     delayed={<div>Loading Search ...</div>}
        //     error={<div>Error Loading Search remote</div>}
        //   />
        (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(Shop, {
          delayed: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("div", {
            children: "Loading shop ..."
          }),
          error: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("div", {
            children: "Error Loading shop remote"
          })
        }) // </>

      }), (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(react_router_dom_index_js_.Route, {
        path: "/payment",
        element: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(Payment, {
          delayed: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("div", {
            children: "Loading payment ..."
          }),
          error: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("div", {
            children: "Error Loading payment remote"
          })
        })
      }), (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(react_router_dom_index_js_.Route, {
        path: "/about",
        element: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(FederatedWrapper, {
          delayed: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("div", {
            children: "Loading about ..."
          }),
          error: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("div", {
            children: "Error Loading about remote"
          }),
          children: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(About, {})
        })
      })]
    })]
  });
}
;// CONCATENATED MODULE: ./src/bootstrap.tsx





const root = client/* createRoot */.s(document.getElementById('root'));
root.render((0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(index_js_.StrictMode, {
  children: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(react_router_dom_index_js_.BrowserRouter, {
    children: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(App, {})
  })
}));

/***/ })

}])