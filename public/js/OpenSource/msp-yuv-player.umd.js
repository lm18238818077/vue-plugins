/**
 * msp-yuv-player v1.0.0
 * (c) 2021-2022 WangJiang
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.MSP_PLAYER = factory());
})(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
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

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  var WebglScreen = /*#__PURE__*/function () {
    function WebglScreen(canvas) {
      _classCallCheck(this, WebglScreen);

      this.canvas = canvas;
      this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      this._init();
    }

    _createClass(WebglScreen, [{
      key: "_init",
      value: function _init() {
        var gl = this.gl;

        if (!gl) {
          console.log("gl not support???");
          return;
        } // ???????????????


        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1); // GLSL ??????????????????????????????

        var vertexShaderSource = "\n                      attribute lowp vec4 a_vertexPosition;\n                      attribute vec2 a_texturePosition;\n                      varying vec2 v_texCoord;\n                      void main() {\n                          gl_Position = a_vertexPosition;\n                          v_texCoord = a_texturePosition;\n                      }\n                  ";
        var fragmentShaderSource = "\n                      precision lowp float;\n                      uniform sampler2D samplerY;\n                      uniform sampler2D samplerU;\n                      uniform sampler2D samplerV;\n                      varying vec2 v_texCoord;\n                      void main() {\n                          float r,g,b,y,u,v,fYmul;\n                          y = texture2D(samplerY, v_texCoord).r;\n                          u = texture2D(samplerU, v_texCoord).r;\n                          v = texture2D(samplerV, v_texCoord).r;\n  \n                          fYmul = y * 1.1643828125;\n                          r = fYmul + 1.59602734375 * v - 0.870787598;\n                          g = fYmul - 0.39176171875 * u - 0.81296875 * v + 0.52959375;\n                          b = fYmul + 2.01723046875 * u - 1.081389160375;\n                          gl_FragColor = vec4(r, g, b, 1.0);\n                      }\n                  ";

        var vertexShader = this._compileShader(vertexShaderSource, gl.VERTEX_SHADER);

        var fragmentShader = this._compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

        var program = this._createProgram(vertexShader, fragmentShader);

        this._initVertexBuffers(program); // ???????????????????????????


        gl.activeTexture(gl.TEXTURE0);
        gl.y = this._createTexture();
        gl.uniform1i(gl.getUniformLocation(program, "samplerY"), 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.u = this._createTexture();
        gl.uniform1i(gl.getUniformLocation(program, "samplerU"), 1);
        gl.activeTexture(gl.TEXTURE2);
        gl.v = this._createTexture();
        gl.uniform1i(gl.getUniformLocation(program, "samplerV"), 2);
      }
      /**
       * ??????????????? buffer
       * @param {glProgram} program ??????
       */

    }, {
      key: "_initVertexBuffers",
      value: function _initVertexBuffers(program) {
        var gl = this.gl;
        var vertexBuffer = gl.createBuffer();
        var vertexRectangle = new Float32Array([1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0]);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // ????????????????????????

        gl.bufferData(gl.ARRAY_BUFFER, vertexRectangle, gl.STATIC_DRAW); // ?????????????????????

        var vertexPositionAttribute = gl.getAttribLocation(program, "a_vertexPosition"); // ????????????????????????????????????????????????????????????

        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0); // ??????vertexPosition ???????????????????????????????????????

        gl.enableVertexAttribArray(vertexPositionAttribute);
        var textureRectangle = new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0]);
        var textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, textureRectangle, gl.STATIC_DRAW);
        var textureCoord = gl.getAttribLocation(program, "a_texturePosition");
        gl.vertexAttribPointer(textureCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(textureCoord);
      }
      /**
       * ??????????????????????????????
       * @param {string} shaderSource GLSL ????????????????????????
       * @param {number} shaderType ???????????????, VERTEX_SHADER ??? FRAGMENT_SHADER???
       * @return {glShader} ????????????
       */

    }, {
      key: "_compileShader",
      value: function _compileShader(shaderSource, shaderType) {
        // ?????????????????????
        var shader = this.gl.createShader(shaderType); // ????????????????????????

        this.gl.shaderSource(shader, shaderSource); // ???????????????

        this.gl.compileShader(shader);
        var success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);

        if (!success) {
          var err = this.gl.getShaderInfoLog(shader);
          this.gl.deleteShader(shader);
          console.error("could not compile shader", err);
          return;
        }

        return shader;
      }
      /**
       * ??? 2 ?????????????????????????????????
       * @param {glShader} vertexShader ??????????????????
       * @param {glShader} fragmentShader ??????????????????
       * @return {glProgram} ??????
       */

    }, {
      key: "_createProgram",
      value: function _createProgram(vertexShader, fragmentShader) {
        var gl = this.gl;
        var program = gl.createProgram(); // ???????????????

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program); // ??? WebGLProgram ???????????????????????????????????????

        gl.useProgram(program);
        var success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);

        if (!success) {
          console.err("program fail to link" + this.gl.getShaderInfoLog(program));
          return;
        }

        return program;
      }
      /**
       * ????????????
       */

    }, {
      key: "_createTexture",
      value: function _createTexture() {
        var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.gl.LINEAR;
        var gl = this.gl;
        var t = gl.createTexture(); // ???????????? glTexture ???????????????????????????

        gl.bindTexture(gl.TEXTURE_2D, t); // ???????????? ??????https://github.com/fem-d/webGL/blob/master/blog/WebGL??????????????????Lesson%207???.md -> Texture wrapping

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // ????????????????????????

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
        return t;
      }
      /**
       * ??????????????????
       * @param {number} width ??????
       * @param {number} height ??????
       * @param {Unit8Array} data ?????????
       */

    }, {
      key: "renderImg",
      value: function renderImg(width, height, data) {
        var gl = this.gl; // ?????????????????????????????????????????????????????????x???y????????????

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // ???????????????????????????????????????

        gl.clearColor(0, 0, 0, 0); // ????????????

        gl.clear(gl.COLOR_BUFFER_BIT);
        var uOffset = width * height;
        var vOffset = (width >> 1) * (height >> 1);
        gl.bindTexture(gl.TEXTURE_2D, gl.y); // ????????????

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width, height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data.subarray(0, uOffset));
        gl.bindTexture(gl.TEXTURE_2D, gl.u);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width >> 1, height >> 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data.subarray(uOffset, uOffset + vOffset));
        gl.bindTexture(gl.TEXTURE_2D, gl.v);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width >> 1, height >> 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data.subarray(uOffset + vOffset, data.length));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      /**
       * ?????????????????? canvas ??????
       * @param {number} width ??????
       * @param {number} height ??????
       * @param {number} maxWidth ????????????
       */

    }, {
      key: "setSize",
      value: function setSize(width, height, maxWidth) {
        var canvasWidth = Math.min(maxWidth, width);
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasWidth * height / width;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        var gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        gl.getExtension('WEBGL_lose_context').loseContext(); // ?????????????????????                                                               ?????????canvas????????????????????????16?????????????????????
      }
    }]);

    return WebglScreen;
  }();

  var WS_CLOSE_REASON = "????????????";
  var WS_CLOSE_CODE = 4444;
  /**
   * @Author WangJiang
   * @description ??????MSP websocket??????YUV420?????????
   * @Time 2021-11
   */

  var MSP_SOCKET = /*#__PURE__*/function () {
    function MSP_SOCKET(wsURL, gl) {
      var canvasConfig = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, MSP_SOCKET);

      var ws = new WebSocket(wsURL);
      ws.binaryType = "arraybuffer";
      this.wsURL = wsURL;
      var glWidth = canvasConfig.glWidth,
          glHeight = canvasConfig.glHeight;
      this.ws = ws;
      this.gl = gl;
      this.glWidth = glWidth;
      this.glHeight = glHeight;
      this.renderStatus = 1; // ws???????????????0-???????????????????????????????????????1 - ??????????????????????????????????????????????????????ws???

      this.dataStatus = 0; // ???????????????0 - ??????????????????1 - ?????????ws???????????????

      this.yuvData = null;
      this.reconnectTimer = 1;
      this.reconnectTimerMax = 3;
      this.reconnectTimerDelay = 3000;
      if (ws) this._wsInit();
    }

    _createClass(MSP_SOCKET, [{
      key: "_wsInit",
      value: function _wsInit() {
        var _this = this;

        this.ws.onopen = function () {
          console.info("????---ws??????---open");
        };

        this.ws.onclose = function (event) {
          var code = event.code,
              reason = event.reason;
          console.info("????---ws??????---close");
          if (code !== WS_CLOSE_CODE && reason !== WS_CLOSE_REASON) _this.reconnectWS();
        };

        this.ws.onmessage = function (event) {
          if (_this.renderStatus === 0) return;
          _this.yuvData = new Uint8Array(event.data);

          _this.gl.renderImg(_this.glWidth, _this.glHeight, _this.yuvData);
        };

        this.ws.onerror = function (e) {
          console.info("????---ws??????---error", e);

          _this.reconnectWS();
        };
      }
    }, {
      key: "closeWS",
      value: function closeWS() {
        var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : WS_CLOSE_CODE;
        var reason = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : WS_CLOSE_REASON;
        this.ws.close(code, reason);
        this.ws = null;
        this.gl.destroy();
      }
    }, {
      key: "setWsStatus",
      value: function setWsStatus(status) {
        var allowValues = [0, 1];
        var ret = allowValues.includes(status) && this.renderStatus !== status;
        if (ret) this.renderStatus = status;
      }
    }, {
      key: "reconnectWS",
      value: function reconnectWS() {
        var _this2 = this;

        if (this.reconnectTimer > this.reconnectTimerMax) return console.error("???ERROR???---WebSocket????????????", this.wsURL);
        setTimeout(function () {
          _this2.reconnectTimer++;
          _this2.ws = new WebSocket(_this2.wsURL);

          _this2._wsInit();
        }, this.reconnectTimerDelay);
      }
    }]);

    return MSP_SOCKET;
  }();
  /**
   * ??????UUID
   * @param {*} len ??????
   * @param {*} radix ??????
   * @returns
   */


  var genarateUUID = function genarateUUID() {
    var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
    var radix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
    var uuid = [],
        i;
    radix = radix || chars.length;

    if (len) {
      for (i = 0; i < len; i++) {
        uuid[i] = chars[0 | Math.random() * radix];
      }
    } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
      uuid[14] = "4";

      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
        }
      }
    }

    return uuid.join("");
  };
  /**
   * @description ??????player??????
   */


  var CUSTOM_NAME = "yuv-player";

  var registerWebComponent = function registerWebComponent() {
    var template = document.createElement("template");
    template.innerHTML = "\n  <style>\n    .msp-player-box {\n      width: 100%;\n      height: 100%;\n      display: flex;\n      position: relative;\n      cursor: pointer;\n    }  \n  </style>\n\n  <div class=\"msp-player-box\" id=\"msp-player-box\">\n    <slot>\u5360\u4F4D</slot>\n  </div>\n";

    var YuvPlayer = /*#__PURE__*/function (_HTMLElement) {
      _inherits(YuvPlayer, _HTMLElement);

      var _super = _createSuper(YuvPlayer);

      function YuvPlayer() {
        var _this3;

        _classCallCheck(this, YuvPlayer);

        _this3 = _super.call(this);
        _this3._shadowRoot = _this3.attachShadow({
          mode: "open"
        });

        _this3._shadowRoot.appendChild(template.content.cloneNode(true));

        return _this3;
      }

      return YuvPlayer;
    }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

    window.customElements.define(CUSTOM_NAME, YuvPlayer);
  };
  /**
   * @description ????????????????????????????????????
   * @param {String} name ??????????????????????????????
   */


  var findRegistedCustomComponent = function findRegistedCustomComponent(name) {
    return window.customElements.get(name);
  };
  /**
   * @description MSP_PLAYER ???
   * @param {Object} config
   * @param config.wsUrl websocket??????
   * @param config.autoPlay ??????????????????: (?????????)1 (????????????)???0 ?????? ???????????????
   * @param config.el ?????????player???DOM??????
   * @param config.sharpType ???????????????[???????????? 1]???0 - 352*288(CIF);1 - 704*576(D1)???2 - 1280*720(720P)???3 - 1920*1080(1080P)???
   */


  var DEFAULT_SHARPTYPE_VALUE = {};

  var MSP_PLAYER = /*#__PURE__*/function () {
    function MSP_PLAYER() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        autoPlay: true
      };

      _classCallCheck(this, MSP_PLAYER);

      var wsUrl = config.wsUrl,
          autoPlay = config.autoPlay,
          el = config.el,
          _config$sharpType = config.sharpType,
          sharpType = _config$sharpType === void 0 ? DEFAULT_SHARPTYPE_VALUE : _config$sharpType,
          cid = config.cid;
      console.info("????MSP_PLAYER.CONFIG", config);
      this.cid = Number(cid); // ????????????cid?????????number

      if (!(sharpType !== null && sharpType !== void 0 && sharpType.width) || !(sharpType !== null && sharpType !== void 0 && sharpType.height)) return new Error("????????????player???????????????--???????????????sharpType = { width, height } ???????????????");

      this._bridgeWidthToSharpType(sharpType, false);

      if (autoPlay === undefined) autoPlay = true;
      MSP_PLAYER.initPlayerTemplate();
      this.wsUrl = wsUrl;
      this.canvas_id = genarateUUID();
      this.playerWS = null;
      this.playStatus = 0; // ?????????????????????0 - ????????????1 - ????????????-1 - ?????????

      this.statusTips = "????????????????????????..."; // ???????????????????????????

      this.mountDom = el;
      this.gl = null;

      this._mountPlayer();

      this._initCanvasGl();

      if (autoPlay) this.play();
    }

    _createClass(MSP_PLAYER, [{
      key: "play",
      value: function play() {
        if (!this.playerWS) this._initPlayerWs();else this.playerWS.setWsStatus(1);
      }
    }, {
      key: "pause",
      value: function pause() {
        // ?????????????????????ws???????????????????????????
        this.playerWS.setWsStatus(0);
      }
    }, {
      key: "stop",
      value: function stop() {
        var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        //   ?????????ws??????(??????????????????)
        this.playerWS.closeWS();
        this.playerWS = null;
        if (cb) this._notifyMspClose(cb);
      }
    }, {
      key: "_notifyMspClose",
      value: function _notifyMspClose(cb) {
        if (!this.cid) return;

        try {
          var _cloudICP$dispatch, _cloudICP$dispatch$vi, _cloudICP$dispatch$vi2;

          var cloudICP = window.cloudICP;

          var callback = function callback(data) {
            cb(data);
          };

          var param = {
            cid: String(this.cid),
            // ????????????cid?????????string
            callback: callback
          };
          (_cloudICP$dispatch = cloudICP.dispatch) === null || _cloudICP$dispatch === void 0 ? void 0 : (_cloudICP$dispatch$vi = _cloudICP$dispatch.video) === null || _cloudICP$dispatch$vi === void 0 ? void 0 : (_cloudICP$dispatch$vi2 = _cloudICP$dispatch$vi.release) === null || _cloudICP$dispatch$vi2 === void 0 ? void 0 : _cloudICP$dispatch$vi2.call(_cloudICP$dispatch$vi, param);
        } catch (error) {
          console.error("[Error] - ??????cloudICP.dispatch.video.release??????", error);
        }
      } // ! ??????????????????

      /**
       * @description ????????????????????????????????????????????????????????????????????????????????????ws????????????
       * @param { object } sharpType object??????????????? {width, height}?????????dom?????????
       * @returns ???
       */

    }, {
      key: "changeVideResolution",
      value: function changeVideResolution() {
        var _this4 = this;

        var sharpType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var NOT_ALLOW_VALUE = sharpType == "" || sharpType == undefined || sharpType == null;
        console.info("changeVideResolution.sharpType", sharpType);
        if (NOT_ALLOW_VALUE) return console.warn("???changeVideResolution??????????????? ???????????????????????????????????????????????? { width: 1920, height: 1080 }");
        if (!this.playerWS) return; //! ???????????????????????????????????????????????????????????????????????????????????????????????????MSP????????????????????????????????????cid???

        this.playerWS.setWsStatus(0);
        var DELAY_TIME = 500;

        var callback = function callback() {
          setTimeout(function () {
            _this4.playerWS.glWidth = _this4.playerWidth;
            _this4.playerWS.glHeight = _this4.playerHeight;

            _this4._setCanvasSize();

            _this4.playerWS.setWsStatus(1);
          }, DELAY_TIME);
        };

        if (sharpType !== null && sharpType !== void 0 && sharpType.width && sharpType !== null && sharpType !== void 0 && sharpType.height) this._bridgeWidthToSharpType(sharpType, true, callback);else return new Error("????????????player???????????????--???????????????sharpType = { width, height } ???????????????");
      }
      /**
       * @description ??????sharpType???code????????????MSP?????????????????????
       * @param {Object} sharpType = {width}
       * @param {Boolean} notifyMSP ????????????MSP??????????????????true
       * @returns void
       */

    }, {
      key: "_bridgeWidthToSharpType",
      value: function _bridgeWidthToSharpType(sharpType) {
        var notifyMSP = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

        /**
         * ?????????
         1.????????????{width???100???height???60}??????16:9?????????width???100???height?????????56<60???height???60???width?????????106>100????????????????????????????????????????????????{width???100???height???56}
         2.????????????{width???100???height???50}??????16:9?????????width???100???height?????????56>50???height???50???width?????????88<100????????????????????????????????????????????????{width???88???height???50}
         */
        var originWidth = parseInt(sharpType.width);
        var originHeight = parseInt(sharpType.height);
        if (originWidth > 1920) originWidth = 1920;
        if (originHeight > 1080) originHeight = 1080;

        var computedRealWH = function computedRealWH(w, h) {
          var sharpObj = {};
          var BASE_WITHD = 16;
          var BASE_HEIGHT = 9;
          var baseWidthHeight = parseInt(w * (BASE_HEIGHT / BASE_WITHD));
          var baseHeightWidth = parseInt(h * (BASE_WITHD / BASE_HEIGHT));

          if (baseWidthHeight <= h) {
            sharpObj.width = w;
            sharpObj.height = baseWidthHeight;
          } else if (baseHeightWidth <= w) {
            sharpObj.width = baseHeightWidth;
            sharpObj.height = h;
          }

          if (sharpObj.width % 4 !== 0) sharpObj.width = sharpObj.width + (4 - sharpObj.width % 4); // ?????????????????????????????????4?????????

          if (sharpObj.height % 4 !== 0) sharpObj.height = sharpObj.height + (4 - sharpObj.height % 4); // ??????????????????????????????2?????????

          return sharpObj;
        };

        var sharpObj = computedRealWH(originWidth, originHeight);

        this._setMediaQUality(sharpObj);

        if (!notifyMSP) return;
        if (!this.cid) return console.warn("?????? ???????????????player?????????cid!");

        try {
          var _cloudICP$dispatch2, _cloudICP$dispatch2$v, _cloudICP$dispatch2$v2;

          var cloudICP = window.cloudICP;

          var changeParam = _objectSpread2(_objectSpread2({}, sharpType), {}, {
            resID: this.cid,
            callback: callback
          });

          (_cloudICP$dispatch2 = cloudICP.dispatch) === null || _cloudICP$dispatch2 === void 0 ? void 0 : (_cloudICP$dispatch2$v = _cloudICP$dispatch2.video) === null || _cloudICP$dispatch2$v === void 0 ? void 0 : (_cloudICP$dispatch2$v2 = _cloudICP$dispatch2$v.setWssflowWinFmttype) === null || _cloudICP$dispatch2$v2 === void 0 ? void 0 : _cloudICP$dispatch2$v2.call(_cloudICP$dispatch2$v, changeParam);
        } catch (error) {
          console.error("[Error] - ??????cloudICP.dispatch.video.setWssflowWinFmttype??????", error);
        }
      }
    }, {
      key: "_initCanvasGl",
      value: function _initCanvasGl() {
        var canvas = document.getElementById(this.canvas_id);
        var gl = new WebglScreen(canvas);
        this.gl = gl;

        this._setCanvasSize();
      }
    }, {
      key: "_setCanvasSize",
      value: function _setCanvasSize() {
        this.gl.setSize(this.playerWidth, this.playerHeight, this.playerWidth);
      }
    }, {
      key: "_initPlayerWs",
      value: function _initPlayerWs() {
        var canvasConfig = {
          glWidth: this.playerWidth,
          glHeight: this.playerHeight
        };
        var playerWS = new MSP_SOCKET(this.wsUrl, this.gl, canvasConfig);
        this.playerWS = playerWS;
      }
    }, {
      key: "_setMediaQUality",
      value: function _setMediaQUality() {
        var sharpTypeObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var _sharpTypeObj$width = sharpTypeObj.width,
            width = _sharpTypeObj$width === void 0 ? 1280 : _sharpTypeObj$width,
            _sharpTypeObj$height = sharpTypeObj.height,
            height = _sharpTypeObj$height === void 0 ? 720 : _sharpTypeObj$height;
        this.playerWidth = width;
        this.playerHeight = height;
      }
    }, {
      key: "_mountPlayer",
      value: function _mountPlayer() {
        var playerDomString = "<yuv-player><canvas id=\"".concat(this.canvas_id, "\" style=\"width: 100%;height: 100%;\" width=\"1280\" height=\"720\"></canvas></yuv-player>");
        this.mountDom.innerHTML = playerDomString;
      }
    }, {
      key: "setStatusTips",
      value: function setStatusTips() {
        var tips = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        if (tips) this.statusTips = tips;
      }
    }, {
      key: "_setPlayStatus",
      value: function _setPlayStatus(status) {
        var allowValues = [-1, 0, 1];
        var ret = allowValues.includes(status);
        if (ret) this.playStatus = status;
      }
    }], [{
      key: "genID",
      value: function genID(length) {
        return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
      }
    }, {
      key: "initPlayerTemplate",
      value: function initPlayerTemplate() {
        var ret = findRegistedCustomComponent(CUSTOM_NAME);
        if (!ret) registerWebComponent();
      }
    }]);

    return MSP_PLAYER;
  }();

  return MSP_PLAYER;

}));
