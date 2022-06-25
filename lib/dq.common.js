/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 146:
/***/ (function(__unused_webpack_module, exports) {

var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
}); // runtime helper for setting properties on components
// in a tree-shakable way

exports.Z = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;

  for (const [key, val] of props) {
    target[key] = val;
  }

  return target;
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "";
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ entry_lib; }
});

;// CONCATENATED MODULE: ./node_modules/.pnpm/@vue+cli-service@5.0.6_@babel+core@7.18.5/node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
/* eslint-disable no-var */
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (false) { var getCurrentScript; }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

;// CONCATENATED MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject = require("vue");
;// CONCATENATED MODULE: ./node_modules/.pnpm/thread-loader@3.0.4_webpack@5.73.0/node_modules/thread-loader/dist/cjs.js!./node_modules/.pnpm/babel-loader@8.2.5_te6ollfzjcco6mbxjl755ucqke/node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/.pnpm/vue-loader@17.0.0_webpack@5.73.0/node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/.pnpm/vue-loader@17.0.0_webpack@5.73.0/node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/Toast/index.vue?vue&type=template&id=0abe1886

const _hoisted_1 = {
  key: 0
};
const _hoisted_2 = {
  class: "key-wrapper"
};
const _hoisted_3 = ["onClick"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.show ? ((0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createElementBlock)("div", _hoisted_1, [(0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createElementVNode)("div", _hoisted_2, [((0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createElementBlock)(external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.Fragment, null, (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.renderList)(10, i => {
    return (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createElementVNode)("p", {
      key: i,
      onClick: $event => _ctx.handleClick(i - 1)
    }, (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.toDisplayString)(i - 1), 9, _hoisted_3);
  }), 64))])])) : (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createCommentVNode)("", true);
}
;// CONCATENATED MODULE: ./src/components/Toast/index.vue?vue&type=template&id=0abe1886

;// CONCATENATED MODULE: ./node_modules/.pnpm/thread-loader@3.0.4_webpack@5.73.0/node_modules/thread-loader/dist/cjs.js!./node_modules/.pnpm/babel-loader@8.2.5_te6ollfzjcco6mbxjl755ucqke/node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/.pnpm/vue-loader@17.0.0_webpack@5.73.0/node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/Toast/index.vue?vue&type=script&lang=js

/* harmony default export */ var Toastvue_type_script_lang_js = ((0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.defineComponent)({
  props: {
    show: {
      type: Boolean
    }
  },
  emits: ['keypress'],

  setup(props, {
    emit
  }) {
    function handleClick(i) {
      emit('keypress', i);
    }

    return {
      handleClick
    };
  }

}));
;// CONCATENATED MODULE: ./src/components/Toast/index.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/.pnpm/mini-css-extract-plugin@2.6.1_webpack@5.73.0/node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/.pnpm/css-loader@6.7.1_webpack@5.73.0/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/.pnpm/vue-loader@17.0.0_webpack@5.73.0/node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/.pnpm/postcss-loader@6.2.1_mepnsno3xmng6eyses4tepu7bu/node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/.pnpm/vue-loader@17.0.0_webpack@5.73.0/node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/Toast/index.vue?vue&type=style&index=0&id=0abe1886&lang=css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/Toast/index.vue?vue&type=style&index=0&id=0abe1886&lang=css

// EXTERNAL MODULE: ./node_modules/.pnpm/vue-loader@17.0.0_webpack@5.73.0/node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(146);
;// CONCATENATED MODULE: ./src/components/Toast/index.vue




;


const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(Toastvue_type_script_lang_js, [['render',render]])

/* harmony default export */ var Toast = (__exports__);
;// CONCATENATED MODULE: ./src/components/Toast/index.js


/** 组件dom挂在后得到的组件实例 */

let $vm = null;
/** keyboard需要接收并跟踪变化的的props */

const props = (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.reactive)({
  show: false
});
/** 空函数 */

const loop = (...args) => {};
/** 默认配置 */


const globalConfig = {
  onKeypress: loop
};
/** 插件控制器 controller */

const $keyboard = {
  /** 调用show方法可以改变默认的配置 */
  show(config) {
    /** 响应式状态，改变该状态，相当于传给组件的props变化了 */
    props.show = true;
    /** 修改默认的keypress监听处理为show方法传入的 */

    globalConfig.onKeypress = config.onKeypress;
  },

  hide() {
    props.show = false;
  }

};
/* harmony default export */ var components_Toast = ({
  install: (app, options) => {
    if (!$vm) {
      const wrapper = document.createElement('div');
      wrapper.id = 'keyboard';
      document.body.appendChild(wrapper);
      $vm = (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createApp)({
        setup() {
          return () => {
            // setup 可以返回一个render函数
            // h函数接收3个参数，“组件或dom”、props、children
            return (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.h)(Toast, { // 其他属性，会被当做组件的props <Keyboard :show="props.show" />
              ...props,
              // onXxx 相当于 <Keyboard @Xxx="globalConfig.onKeypress" />
              onKeypress: globalConfig.onKeypress
            });
          };
        }

      }).mount(wrapper);
      /** 将插件controller注册到全局上 */

      app.config.globalProperties.$keyboard = $keyboard;
    }
  }
});
;// CONCATENATED MODULE: ./node_modules/.pnpm/@vue+cli-service@5.0.6_@babel+core@7.18.5/node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = (components_Toast);


}();
module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=dq.common.js.map