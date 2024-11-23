// node_modules/@opentelemetry/api/build/esm/platform/browser/globalThis.js
var _globalThis = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};

// node_modules/@opentelemetry/api/build/esm/version.js
var VERSION = "1.9.0";

// node_modules/@opentelemetry/api/build/esm/internal/semver.js
var re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
function _makeCompatibilityCheck(ownVersion) {
  var acceptedVersions = /* @__PURE__ */ new Set([ownVersion]);
  var rejectedVersions = /* @__PURE__ */ new Set();
  var myVersionMatch = ownVersion.match(re);
  if (!myVersionMatch) {
    return function() {
      return false;
    };
  }
  var ownVersionParsed = {
    major: +myVersionMatch[1],
    minor: +myVersionMatch[2],
    patch: +myVersionMatch[3],
    prerelease: myVersionMatch[4]
  };
  if (ownVersionParsed.prerelease != null) {
    return function isExactmatch(globalVersion) {
      return globalVersion === ownVersion;
    };
  }
  function _reject(v) {
    rejectedVersions.add(v);
    return false;
  }
  function _accept(v) {
    acceptedVersions.add(v);
    return true;
  }
  return function isCompatible2(globalVersion) {
    if (acceptedVersions.has(globalVersion)) {
      return true;
    }
    if (rejectedVersions.has(globalVersion)) {
      return false;
    }
    var globalVersionMatch = globalVersion.match(re);
    if (!globalVersionMatch) {
      return _reject(globalVersion);
    }
    var globalVersionParsed = {
      major: +globalVersionMatch[1],
      minor: +globalVersionMatch[2],
      patch: +globalVersionMatch[3],
      prerelease: globalVersionMatch[4]
    };
    if (globalVersionParsed.prerelease != null) {
      return _reject(globalVersion);
    }
    if (ownVersionParsed.major !== globalVersionParsed.major) {
      return _reject(globalVersion);
    }
    if (ownVersionParsed.major === 0) {
      if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch) {
        return _accept(globalVersion);
      }
      return _reject(globalVersion);
    }
    if (ownVersionParsed.minor <= globalVersionParsed.minor) {
      return _accept(globalVersion);
    }
    return _reject(globalVersion);
  };
}
var isCompatible = _makeCompatibilityCheck(VERSION);

// node_modules/@opentelemetry/api/build/esm/internal/global-utils.js
var major = VERSION.split(".")[0];
var GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for("opentelemetry.js.api." + major);
var _global = _globalThis;
function registerGlobal(type, instance, diag3, allowOverride) {
  var _a2;
  if (allowOverride === void 0) {
    allowOverride = false;
  }
  var api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a2 = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a2 !== void 0 ? _a2 : {
    version: VERSION
  };
  if (!allowOverride && api[type]) {
    var err = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + type);
    diag3.error(err.stack || err.message);
    return false;
  }
  if (api.version !== VERSION) {
    var err = new Error("@opentelemetry/api: Registration of version v" + api.version + " for " + type + " does not match previously registered API v" + VERSION);
    diag3.error(err.stack || err.message);
    return false;
  }
  api[type] = instance;
  diag3.debug("@opentelemetry/api: Registered a global for " + type + " v" + VERSION + ".");
  return true;
}
function getGlobal(type) {
  var _a2, _b;
  var globalVersion = (_a2 = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a2 === void 0 ? void 0 : _a2.version;
  if (!globalVersion || !isCompatible(globalVersion)) {
    return;
  }
  return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
}
function unregisterGlobal(type, diag3) {
  diag3.debug("@opentelemetry/api: Unregistering a global for " + type + " v" + VERSION + ".");
  var api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
  if (api) {
    delete api[type];
  }
}

// node_modules/@opentelemetry/api/build/esm/diag/ComponentLogger.js
var __read = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray = function(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var DiagComponentLogger = (
  /** @class */
  function() {
    function DiagComponentLogger2(props) {
      this._namespace = props.namespace || "DiagComponentLogger";
    }
    DiagComponentLogger2.prototype.debug = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return logProxy("debug", this._namespace, args);
    };
    DiagComponentLogger2.prototype.error = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return logProxy("error", this._namespace, args);
    };
    DiagComponentLogger2.prototype.info = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return logProxy("info", this._namespace, args);
    };
    DiagComponentLogger2.prototype.warn = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return logProxy("warn", this._namespace, args);
    };
    DiagComponentLogger2.prototype.verbose = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return logProxy("verbose", this._namespace, args);
    };
    return DiagComponentLogger2;
  }()
);
function logProxy(funcName, namespace, args) {
  var logger = getGlobal("diag");
  if (!logger) {
    return;
  }
  args.unshift(namespace);
  return logger[funcName].apply(logger, __spreadArray([], __read(args), false));
}

// node_modules/@opentelemetry/api/build/esm/diag/types.js
var DiagLogLevel;
(function(DiagLogLevel2) {
  DiagLogLevel2[DiagLogLevel2["NONE"] = 0] = "NONE";
  DiagLogLevel2[DiagLogLevel2["ERROR"] = 30] = "ERROR";
  DiagLogLevel2[DiagLogLevel2["WARN"] = 50] = "WARN";
  DiagLogLevel2[DiagLogLevel2["INFO"] = 60] = "INFO";
  DiagLogLevel2[DiagLogLevel2["DEBUG"] = 70] = "DEBUG";
  DiagLogLevel2[DiagLogLevel2["VERBOSE"] = 80] = "VERBOSE";
  DiagLogLevel2[DiagLogLevel2["ALL"] = 9999] = "ALL";
})(DiagLogLevel || (DiagLogLevel = {}));

// node_modules/@opentelemetry/api/build/esm/diag/internal/logLevelLogger.js
function createLogLevelDiagLogger(maxLevel, logger) {
  if (maxLevel < DiagLogLevel.NONE) {
    maxLevel = DiagLogLevel.NONE;
  } else if (maxLevel > DiagLogLevel.ALL) {
    maxLevel = DiagLogLevel.ALL;
  }
  logger = logger || {};
  function _filterFunc(funcName, theLevel) {
    var theFunc = logger[funcName];
    if (typeof theFunc === "function" && maxLevel >= theLevel) {
      return theFunc.bind(logger);
    }
    return function() {
    };
  }
  return {
    error: _filterFunc("error", DiagLogLevel.ERROR),
    warn: _filterFunc("warn", DiagLogLevel.WARN),
    info: _filterFunc("info", DiagLogLevel.INFO),
    debug: _filterFunc("debug", DiagLogLevel.DEBUG),
    verbose: _filterFunc("verbose", DiagLogLevel.VERBOSE)
  };
}

// node_modules/@opentelemetry/api/build/esm/api/diag.js
var __read2 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray2 = function(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var API_NAME = "diag";
var DiagAPI = (
  /** @class */
  function() {
    function DiagAPI2() {
      function _logProxy(funcName) {
        return function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          var logger = getGlobal("diag");
          if (!logger)
            return;
          return logger[funcName].apply(logger, __spreadArray2([], __read2(args), false));
        };
      }
      var self2 = this;
      var setLogger = function(logger, optionsOrLogLevel) {
        var _a2, _b, _c;
        if (optionsOrLogLevel === void 0) {
          optionsOrLogLevel = { logLevel: DiagLogLevel.INFO };
        }
        if (logger === self2) {
          var err = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
          self2.error((_a2 = err.stack) !== null && _a2 !== void 0 ? _a2 : err.message);
          return false;
        }
        if (typeof optionsOrLogLevel === "number") {
          optionsOrLogLevel = {
            logLevel: optionsOrLogLevel
          };
        }
        var oldLogger = getGlobal("diag");
        var newLogger = createLogLevelDiagLogger((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : DiagLogLevel.INFO, logger);
        if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
          var stack = (_c = new Error().stack) !== null && _c !== void 0 ? _c : "<failed to generate stacktrace>";
          oldLogger.warn("Current logger will be overwritten from " + stack);
          newLogger.warn("Current logger will overwrite one already registered from " + stack);
        }
        return registerGlobal("diag", newLogger, self2, true);
      };
      self2.setLogger = setLogger;
      self2.disable = function() {
        unregisterGlobal(API_NAME, self2);
      };
      self2.createComponentLogger = function(options) {
        return new DiagComponentLogger(options);
      };
      self2.verbose = _logProxy("verbose");
      self2.debug = _logProxy("debug");
      self2.info = _logProxy("info");
      self2.warn = _logProxy("warn");
      self2.error = _logProxy("error");
    }
    DiagAPI2.instance = function() {
      if (!this._instance) {
        this._instance = new DiagAPI2();
      }
      return this._instance;
    };
    return DiagAPI2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/baggage/internal/baggage-impl.js
var __read3 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __values = function(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var BaggageImpl = (
  /** @class */
  function() {
    function BaggageImpl2(entries) {
      this._entries = entries ? new Map(entries) : /* @__PURE__ */ new Map();
    }
    BaggageImpl2.prototype.getEntry = function(key) {
      var entry = this._entries.get(key);
      if (!entry) {
        return void 0;
      }
      return Object.assign({}, entry);
    };
    BaggageImpl2.prototype.getAllEntries = function() {
      return Array.from(this._entries.entries()).map(function(_a2) {
        var _b = __read3(_a2, 2), k = _b[0], v = _b[1];
        return [k, v];
      });
    };
    BaggageImpl2.prototype.setEntry = function(key, entry) {
      var newBaggage = new BaggageImpl2(this._entries);
      newBaggage._entries.set(key, entry);
      return newBaggage;
    };
    BaggageImpl2.prototype.removeEntry = function(key) {
      var newBaggage = new BaggageImpl2(this._entries);
      newBaggage._entries.delete(key);
      return newBaggage;
    };
    BaggageImpl2.prototype.removeEntries = function() {
      var e_1, _a2;
      var keys = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        keys[_i] = arguments[_i];
      }
      var newBaggage = new BaggageImpl2(this._entries);
      try {
        for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
          var key = keys_1_1.value;
          newBaggage._entries.delete(key);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (keys_1_1 && !keys_1_1.done && (_a2 = keys_1.return)) _a2.call(keys_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      return newBaggage;
    };
    BaggageImpl2.prototype.clear = function() {
      return new BaggageImpl2();
    };
    return BaggageImpl2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/baggage/utils.js
var diag = DiagAPI.instance();
function createBaggage(entries) {
  if (entries === void 0) {
    entries = {};
  }
  return new BaggageImpl(new Map(Object.entries(entries)));
}

// node_modules/@opentelemetry/api/build/esm/context/context.js
function createContextKey(description) {
  return Symbol.for(description);
}
var BaseContext = (
  /** @class */
  /* @__PURE__ */ function() {
    function BaseContext2(parentContext) {
      var self2 = this;
      self2._currentContext = parentContext ? new Map(parentContext) : /* @__PURE__ */ new Map();
      self2.getValue = function(key) {
        return self2._currentContext.get(key);
      };
      self2.setValue = function(key, value) {
        var context2 = new BaseContext2(self2._currentContext);
        context2._currentContext.set(key, value);
        return context2;
      };
      self2.deleteValue = function(key) {
        var context2 = new BaseContext2(self2._currentContext);
        context2._currentContext.delete(key);
        return context2;
      };
    }
    return BaseContext2;
  }()
);
var ROOT_CONTEXT = new BaseContext();

// node_modules/@opentelemetry/api/build/esm/propagation/TextMapPropagator.js
var defaultTextMapGetter = {
  get: function(carrier, key) {
    if (carrier == null) {
      return void 0;
    }
    return carrier[key];
  },
  keys: function(carrier) {
    if (carrier == null) {
      return [];
    }
    return Object.keys(carrier);
  }
};
var defaultTextMapSetter = {
  set: function(carrier, key, value) {
    if (carrier == null) {
      return;
    }
    carrier[key] = value;
  }
};

// node_modules/@opentelemetry/api/build/esm/context/NoopContextManager.js
var __read4 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray3 = function(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var NoopContextManager = (
  /** @class */
  function() {
    function NoopContextManager2() {
    }
    NoopContextManager2.prototype.active = function() {
      return ROOT_CONTEXT;
    };
    NoopContextManager2.prototype.with = function(_context, fn, thisArg) {
      var args = [];
      for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
      }
      return fn.call.apply(fn, __spreadArray3([thisArg], __read4(args), false));
    };
    NoopContextManager2.prototype.bind = function(_context, target) {
      return target;
    };
    NoopContextManager2.prototype.enable = function() {
      return this;
    };
    NoopContextManager2.prototype.disable = function() {
      return this;
    };
    return NoopContextManager2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/api/context.js
var __read5 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray4 = function(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var API_NAME2 = "context";
var NOOP_CONTEXT_MANAGER = new NoopContextManager();
var ContextAPI = (
  /** @class */
  function() {
    function ContextAPI2() {
    }
    ContextAPI2.getInstance = function() {
      if (!this._instance) {
        this._instance = new ContextAPI2();
      }
      return this._instance;
    };
    ContextAPI2.prototype.setGlobalContextManager = function(contextManager) {
      return registerGlobal(API_NAME2, contextManager, DiagAPI.instance());
    };
    ContextAPI2.prototype.active = function() {
      return this._getContextManager().active();
    };
    ContextAPI2.prototype.with = function(context2, fn, thisArg) {
      var _a2;
      var args = [];
      for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
      }
      return (_a2 = this._getContextManager()).with.apply(_a2, __spreadArray4([context2, fn, thisArg], __read5(args), false));
    };
    ContextAPI2.prototype.bind = function(context2, target) {
      return this._getContextManager().bind(context2, target);
    };
    ContextAPI2.prototype._getContextManager = function() {
      return getGlobal(API_NAME2) || NOOP_CONTEXT_MANAGER;
    };
    ContextAPI2.prototype.disable = function() {
      this._getContextManager().disable();
      unregisterGlobal(API_NAME2, DiagAPI.instance());
    };
    return ContextAPI2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js
var TraceFlags;
(function(TraceFlags2) {
  TraceFlags2[TraceFlags2["NONE"] = 0] = "NONE";
  TraceFlags2[TraceFlags2["SAMPLED"] = 1] = "SAMPLED";
})(TraceFlags || (TraceFlags = {}));

// node_modules/@opentelemetry/api/build/esm/trace/invalid-span-constants.js
var INVALID_SPANID = "0000000000000000";
var INVALID_TRACEID = "00000000000000000000000000000000";
var INVALID_SPAN_CONTEXT = {
  traceId: INVALID_TRACEID,
  spanId: INVALID_SPANID,
  traceFlags: TraceFlags.NONE
};

// node_modules/@opentelemetry/api/build/esm/trace/NonRecordingSpan.js
var NonRecordingSpan = (
  /** @class */
  function() {
    function NonRecordingSpan2(_spanContext) {
      if (_spanContext === void 0) {
        _spanContext = INVALID_SPAN_CONTEXT;
      }
      this._spanContext = _spanContext;
    }
    NonRecordingSpan2.prototype.spanContext = function() {
      return this._spanContext;
    };
    NonRecordingSpan2.prototype.setAttribute = function(_key, _value) {
      return this;
    };
    NonRecordingSpan2.prototype.setAttributes = function(_attributes) {
      return this;
    };
    NonRecordingSpan2.prototype.addEvent = function(_name, _attributes) {
      return this;
    };
    NonRecordingSpan2.prototype.addLink = function(_link) {
      return this;
    };
    NonRecordingSpan2.prototype.addLinks = function(_links) {
      return this;
    };
    NonRecordingSpan2.prototype.setStatus = function(_status) {
      return this;
    };
    NonRecordingSpan2.prototype.updateName = function(_name) {
      return this;
    };
    NonRecordingSpan2.prototype.end = function(_endTime) {
    };
    NonRecordingSpan2.prototype.isRecording = function() {
      return false;
    };
    NonRecordingSpan2.prototype.recordException = function(_exception, _time) {
    };
    return NonRecordingSpan2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/trace/context-utils.js
var SPAN_KEY = createContextKey("OpenTelemetry Context Key SPAN");
function getSpan(context2) {
  return context2.getValue(SPAN_KEY) || void 0;
}
function getActiveSpan() {
  return getSpan(ContextAPI.getInstance().active());
}
function setSpan(context2, span) {
  return context2.setValue(SPAN_KEY, span);
}
function deleteSpan(context2) {
  return context2.deleteValue(SPAN_KEY);
}
function setSpanContext(context2, spanContext) {
  return setSpan(context2, new NonRecordingSpan(spanContext));
}
function getSpanContext(context2) {
  var _a2;
  return (_a2 = getSpan(context2)) === null || _a2 === void 0 ? void 0 : _a2.spanContext();
}

// node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js
var VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
var VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
function isValidTraceId(traceId) {
  return VALID_TRACEID_REGEX.test(traceId) && traceId !== INVALID_TRACEID;
}
function isValidSpanId(spanId) {
  return VALID_SPANID_REGEX.test(spanId) && spanId !== INVALID_SPANID;
}
function isSpanContextValid(spanContext) {
  return isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId);
}
function wrapSpanContext(spanContext) {
  return new NonRecordingSpan(spanContext);
}

// node_modules/@opentelemetry/api/build/esm/trace/NoopTracer.js
var contextApi = ContextAPI.getInstance();
var NoopTracer = (
  /** @class */
  function() {
    function NoopTracer2() {
    }
    NoopTracer2.prototype.startSpan = function(name, options, context2) {
      if (context2 === void 0) {
        context2 = contextApi.active();
      }
      var root = Boolean(options === null || options === void 0 ? void 0 : options.root);
      if (root) {
        return new NonRecordingSpan();
      }
      var parentFromContext = context2 && getSpanContext(context2);
      if (isSpanContext(parentFromContext) && isSpanContextValid(parentFromContext)) {
        return new NonRecordingSpan(parentFromContext);
      } else {
        return new NonRecordingSpan();
      }
    };
    NoopTracer2.prototype.startActiveSpan = function(name, arg2, arg3, arg4) {
      var opts;
      var ctx;
      var fn;
      if (arguments.length < 2) {
        return;
      } else if (arguments.length === 2) {
        fn = arg2;
      } else if (arguments.length === 3) {
        opts = arg2;
        fn = arg3;
      } else {
        opts = arg2;
        ctx = arg3;
        fn = arg4;
      }
      var parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
      var span = this.startSpan(name, opts, parentContext);
      var contextWithSpanSet = setSpan(parentContext, span);
      return contextApi.with(contextWithSpanSet, fn, void 0, span);
    };
    return NoopTracer2;
  }()
);
function isSpanContext(spanContext) {
  return typeof spanContext === "object" && typeof spanContext["spanId"] === "string" && typeof spanContext["traceId"] === "string" && typeof spanContext["traceFlags"] === "number";
}

// node_modules/@opentelemetry/api/build/esm/trace/ProxyTracer.js
var NOOP_TRACER = new NoopTracer();
var ProxyTracer = (
  /** @class */
  function() {
    function ProxyTracer2(_provider, name, version, options) {
      this._provider = _provider;
      this.name = name;
      this.version = version;
      this.options = options;
    }
    ProxyTracer2.prototype.startSpan = function(name, options, context2) {
      return this._getTracer().startSpan(name, options, context2);
    };
    ProxyTracer2.prototype.startActiveSpan = function(_name, _options, _context, _fn) {
      var tracer2 = this._getTracer();
      return Reflect.apply(tracer2.startActiveSpan, tracer2, arguments);
    };
    ProxyTracer2.prototype._getTracer = function() {
      if (this._delegate) {
        return this._delegate;
      }
      var tracer2 = this._provider.getDelegateTracer(this.name, this.version, this.options);
      if (!tracer2) {
        return NOOP_TRACER;
      }
      this._delegate = tracer2;
      return this._delegate;
    };
    return ProxyTracer2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/trace/NoopTracerProvider.js
var NoopTracerProvider = (
  /** @class */
  function() {
    function NoopTracerProvider2() {
    }
    NoopTracerProvider2.prototype.getTracer = function(_name, _version, _options) {
      return new NoopTracer();
    };
    return NoopTracerProvider2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/trace/ProxyTracerProvider.js
var NOOP_TRACER_PROVIDER = new NoopTracerProvider();
var ProxyTracerProvider = (
  /** @class */
  function() {
    function ProxyTracerProvider2() {
    }
    ProxyTracerProvider2.prototype.getTracer = function(name, version, options) {
      var _a2;
      return (_a2 = this.getDelegateTracer(name, version, options)) !== null && _a2 !== void 0 ? _a2 : new ProxyTracer(this, name, version, options);
    };
    ProxyTracerProvider2.prototype.getDelegate = function() {
      var _a2;
      return (_a2 = this._delegate) !== null && _a2 !== void 0 ? _a2 : NOOP_TRACER_PROVIDER;
    };
    ProxyTracerProvider2.prototype.setDelegate = function(delegate) {
      this._delegate = delegate;
    };
    ProxyTracerProvider2.prototype.getDelegateTracer = function(name, version, options) {
      var _a2;
      return (_a2 = this._delegate) === null || _a2 === void 0 ? void 0 : _a2.getTracer(name, version, options);
    };
    return ProxyTracerProvider2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/trace/span_kind.js
var SpanKind;
(function(SpanKind2) {
  SpanKind2[SpanKind2["INTERNAL"] = 0] = "INTERNAL";
  SpanKind2[SpanKind2["SERVER"] = 1] = "SERVER";
  SpanKind2[SpanKind2["CLIENT"] = 2] = "CLIENT";
  SpanKind2[SpanKind2["PRODUCER"] = 3] = "PRODUCER";
  SpanKind2[SpanKind2["CONSUMER"] = 4] = "CONSUMER";
})(SpanKind || (SpanKind = {}));

// node_modules/@opentelemetry/api/build/esm/trace/status.js
var SpanStatusCode;
(function(SpanStatusCode2) {
  SpanStatusCode2[SpanStatusCode2["UNSET"] = 0] = "UNSET";
  SpanStatusCode2[SpanStatusCode2["OK"] = 1] = "OK";
  SpanStatusCode2[SpanStatusCode2["ERROR"] = 2] = "ERROR";
})(SpanStatusCode || (SpanStatusCode = {}));

// node_modules/@opentelemetry/api/build/esm/context-api.js
var context = ContextAPI.getInstance();

// node_modules/@opentelemetry/api/build/esm/diag-api.js
var diag2 = DiagAPI.instance();

// node_modules/@opentelemetry/api/build/esm/propagation/NoopTextMapPropagator.js
var NoopTextMapPropagator = (
  /** @class */
  function() {
    function NoopTextMapPropagator2() {
    }
    NoopTextMapPropagator2.prototype.inject = function(_context, _carrier) {
    };
    NoopTextMapPropagator2.prototype.extract = function(context2, _carrier) {
      return context2;
    };
    NoopTextMapPropagator2.prototype.fields = function() {
      return [];
    };
    return NoopTextMapPropagator2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/baggage/context-helpers.js
var BAGGAGE_KEY = createContextKey("OpenTelemetry Baggage Key");
function getBaggage(context2) {
  return context2.getValue(BAGGAGE_KEY) || void 0;
}
function getActiveBaggage() {
  return getBaggage(ContextAPI.getInstance().active());
}
function setBaggage(context2, baggage) {
  return context2.setValue(BAGGAGE_KEY, baggage);
}
function deleteBaggage(context2) {
  return context2.deleteValue(BAGGAGE_KEY);
}

// node_modules/@opentelemetry/api/build/esm/api/propagation.js
var API_NAME3 = "propagation";
var NOOP_TEXT_MAP_PROPAGATOR = new NoopTextMapPropagator();
var PropagationAPI = (
  /** @class */
  function() {
    function PropagationAPI2() {
      this.createBaggage = createBaggage;
      this.getBaggage = getBaggage;
      this.getActiveBaggage = getActiveBaggage;
      this.setBaggage = setBaggage;
      this.deleteBaggage = deleteBaggage;
    }
    PropagationAPI2.getInstance = function() {
      if (!this._instance) {
        this._instance = new PropagationAPI2();
      }
      return this._instance;
    };
    PropagationAPI2.prototype.setGlobalPropagator = function(propagator) {
      return registerGlobal(API_NAME3, propagator, DiagAPI.instance());
    };
    PropagationAPI2.prototype.inject = function(context2, carrier, setter) {
      if (setter === void 0) {
        setter = defaultTextMapSetter;
      }
      return this._getGlobalPropagator().inject(context2, carrier, setter);
    };
    PropagationAPI2.prototype.extract = function(context2, carrier, getter) {
      if (getter === void 0) {
        getter = defaultTextMapGetter;
      }
      return this._getGlobalPropagator().extract(context2, carrier, getter);
    };
    PropagationAPI2.prototype.fields = function() {
      return this._getGlobalPropagator().fields();
    };
    PropagationAPI2.prototype.disable = function() {
      unregisterGlobal(API_NAME3, DiagAPI.instance());
    };
    PropagationAPI2.prototype._getGlobalPropagator = function() {
      return getGlobal(API_NAME3) || NOOP_TEXT_MAP_PROPAGATOR;
    };
    return PropagationAPI2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/propagation-api.js
var propagation = PropagationAPI.getInstance();

// node_modules/@opentelemetry/api/build/esm/api/trace.js
var API_NAME4 = "trace";
var TraceAPI = (
  /** @class */
  function() {
    function TraceAPI2() {
      this._proxyTracerProvider = new ProxyTracerProvider();
      this.wrapSpanContext = wrapSpanContext;
      this.isSpanContextValid = isSpanContextValid;
      this.deleteSpan = deleteSpan;
      this.getSpan = getSpan;
      this.getActiveSpan = getActiveSpan;
      this.getSpanContext = getSpanContext;
      this.setSpan = setSpan;
      this.setSpanContext = setSpanContext;
    }
    TraceAPI2.getInstance = function() {
      if (!this._instance) {
        this._instance = new TraceAPI2();
      }
      return this._instance;
    };
    TraceAPI2.prototype.setGlobalTracerProvider = function(provider) {
      var success = registerGlobal(API_NAME4, this._proxyTracerProvider, DiagAPI.instance());
      if (success) {
        this._proxyTracerProvider.setDelegate(provider);
      }
      return success;
    };
    TraceAPI2.prototype.getTracerProvider = function() {
      return getGlobal(API_NAME4) || this._proxyTracerProvider;
    };
    TraceAPI2.prototype.getTracer = function(name, version) {
      return this.getTracerProvider().getTracer(name, version);
    };
    TraceAPI2.prototype.disable = function() {
      unregisterGlobal(API_NAME4, DiagAPI.instance());
      this._proxyTracerProvider = new ProxyTracerProvider();
    };
    return TraceAPI2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/trace-api.js
var trace = TraceAPI.getInstance();

// node_modules/@opentelemetry/core/build/esm/trace/suppress-tracing.js
var SUPPRESS_TRACING_KEY = createContextKey("OpenTelemetry SDK Context Key SUPPRESS_TRACING");
function isTracingSuppressed(context2) {
  return context2.getValue(SUPPRESS_TRACING_KEY) === true;
}

// node_modules/@opentelemetry/core/build/esm/common/attributes.js
var __values2 = function(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read6 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
function sanitizeAttributes(attributes) {
  var e_1, _a2;
  var out = {};
  if (typeof attributes !== "object" || attributes == null) {
    return out;
  }
  try {
    for (var _b = __values2(Object.entries(attributes)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var _d = __read6(_c.value, 2), key = _d[0], val = _d[1];
      if (!isAttributeKey(key)) {
        diag2.warn("Invalid attribute key: " + key);
        continue;
      }
      if (!isAttributeValue(val)) {
        diag2.warn("Invalid attribute value set for key: " + key);
        continue;
      }
      if (Array.isArray(val)) {
        out[key] = val.slice();
      } else {
        out[key] = val;
      }
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (_c && !_c.done && (_a2 = _b.return)) _a2.call(_b);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  return out;
}
function isAttributeKey(key) {
  return typeof key === "string" && key.length > 0;
}
function isAttributeValue(val) {
  if (val == null) {
    return true;
  }
  if (Array.isArray(val)) {
    return isHomogeneousAttributeValueArray(val);
  }
  return isValidPrimitiveAttributeValue(val);
}
function isHomogeneousAttributeValueArray(arr) {
  var e_2, _a2;
  var type;
  try {
    for (var arr_1 = __values2(arr), arr_1_1 = arr_1.next(); !arr_1_1.done; arr_1_1 = arr_1.next()) {
      var element = arr_1_1.value;
      if (element == null)
        continue;
      if (!type) {
        if (isValidPrimitiveAttributeValue(element)) {
          type = typeof element;
          continue;
        }
        return false;
      }
      if (typeof element === type) {
        continue;
      }
      return false;
    }
  } catch (e_2_1) {
    e_2 = { error: e_2_1 };
  } finally {
    try {
      if (arr_1_1 && !arr_1_1.done && (_a2 = arr_1.return)) _a2.call(arr_1);
    } finally {
      if (e_2) throw e_2.error;
    }
  }
  return true;
}
function isValidPrimitiveAttributeValue(val) {
  switch (typeof val) {
    case "number":
    case "boolean":
    case "string":
      return true;
  }
  return false;
}

// node_modules/@opentelemetry/core/build/esm/common/logging-error-handler.js
function loggingErrorHandler() {
  return function(ex) {
    diag2.error(stringifyException(ex));
  };
}
function stringifyException(ex) {
  if (typeof ex === "string") {
    return ex;
  } else {
    return JSON.stringify(flattenException(ex));
  }
}
function flattenException(ex) {
  var result = {};
  var current = ex;
  while (current !== null) {
    Object.getOwnPropertyNames(current).forEach(function(propertyName) {
      if (result[propertyName])
        return;
      var value = current[propertyName];
      if (value) {
        result[propertyName] = String(value);
      }
    });
    current = Object.getPrototypeOf(current);
  }
  return result;
}

// node_modules/@opentelemetry/core/build/esm/common/global-error-handler.js
var delegateHandler = loggingErrorHandler();
function globalErrorHandler(ex) {
  try {
    delegateHandler(ex);
  } catch (_a2) {
  }
}

// node_modules/@opentelemetry/core/build/esm/version.js
var VERSION2 = "1.27.0";

// node_modules/@opentelemetry/semantic-conventions/build/esm/internal/utils.js
// @__NO_SIDE_EFFECTS__
function createConstMap(values) {
  var res = {};
  var len = values.length;
  for (var lp = 0; lp < len; lp++) {
    var val = values[lp];
    if (val) {
      res[String(val).toUpperCase().replace(/[-.]/g, "_")] = val;
    }
  }
  return res;
}

// node_modules/@opentelemetry/semantic-conventions/build/esm/trace/SemanticAttributes.js
var TMP_AWS_LAMBDA_INVOKED_ARN = "aws.lambda.invoked_arn";
var TMP_DB_SYSTEM = "db.system";
var TMP_DB_CONNECTION_STRING = "db.connection_string";
var TMP_DB_USER = "db.user";
var TMP_DB_JDBC_DRIVER_CLASSNAME = "db.jdbc.driver_classname";
var TMP_DB_NAME = "db.name";
var TMP_DB_STATEMENT = "db.statement";
var TMP_DB_OPERATION = "db.operation";
var TMP_DB_MSSQL_INSTANCE_NAME = "db.mssql.instance_name";
var TMP_DB_CASSANDRA_KEYSPACE = "db.cassandra.keyspace";
var TMP_DB_CASSANDRA_PAGE_SIZE = "db.cassandra.page_size";
var TMP_DB_CASSANDRA_CONSISTENCY_LEVEL = "db.cassandra.consistency_level";
var TMP_DB_CASSANDRA_TABLE = "db.cassandra.table";
var TMP_DB_CASSANDRA_IDEMPOTENCE = "db.cassandra.idempotence";
var TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = "db.cassandra.speculative_execution_count";
var TMP_DB_CASSANDRA_COORDINATOR_ID = "db.cassandra.coordinator.id";
var TMP_DB_CASSANDRA_COORDINATOR_DC = "db.cassandra.coordinator.dc";
var TMP_DB_HBASE_NAMESPACE = "db.hbase.namespace";
var TMP_DB_REDIS_DATABASE_INDEX = "db.redis.database_index";
var TMP_DB_MONGODB_COLLECTION = "db.mongodb.collection";
var TMP_DB_SQL_TABLE = "db.sql.table";
var TMP_EXCEPTION_TYPE = "exception.type";
var TMP_EXCEPTION_MESSAGE = "exception.message";
var TMP_EXCEPTION_STACKTRACE = "exception.stacktrace";
var TMP_EXCEPTION_ESCAPED = "exception.escaped";
var TMP_FAAS_TRIGGER = "faas.trigger";
var TMP_FAAS_EXECUTION = "faas.execution";
var TMP_FAAS_DOCUMENT_COLLECTION = "faas.document.collection";
var TMP_FAAS_DOCUMENT_OPERATION = "faas.document.operation";
var TMP_FAAS_DOCUMENT_TIME = "faas.document.time";
var TMP_FAAS_DOCUMENT_NAME = "faas.document.name";
var TMP_FAAS_TIME = "faas.time";
var TMP_FAAS_CRON = "faas.cron";
var TMP_FAAS_COLDSTART = "faas.coldstart";
var TMP_FAAS_INVOKED_NAME = "faas.invoked_name";
var TMP_FAAS_INVOKED_PROVIDER = "faas.invoked_provider";
var TMP_FAAS_INVOKED_REGION = "faas.invoked_region";
var TMP_NET_TRANSPORT = "net.transport";
var TMP_NET_PEER_IP = "net.peer.ip";
var TMP_NET_PEER_PORT = "net.peer.port";
var TMP_NET_PEER_NAME = "net.peer.name";
var TMP_NET_HOST_IP = "net.host.ip";
var TMP_NET_HOST_PORT = "net.host.port";
var TMP_NET_HOST_NAME = "net.host.name";
var TMP_NET_HOST_CONNECTION_TYPE = "net.host.connection.type";
var TMP_NET_HOST_CONNECTION_SUBTYPE = "net.host.connection.subtype";
var TMP_NET_HOST_CARRIER_NAME = "net.host.carrier.name";
var TMP_NET_HOST_CARRIER_MCC = "net.host.carrier.mcc";
var TMP_NET_HOST_CARRIER_MNC = "net.host.carrier.mnc";
var TMP_NET_HOST_CARRIER_ICC = "net.host.carrier.icc";
var TMP_PEER_SERVICE = "peer.service";
var TMP_ENDUSER_ID = "enduser.id";
var TMP_ENDUSER_ROLE = "enduser.role";
var TMP_ENDUSER_SCOPE = "enduser.scope";
var TMP_THREAD_ID = "thread.id";
var TMP_THREAD_NAME = "thread.name";
var TMP_CODE_FUNCTION = "code.function";
var TMP_CODE_NAMESPACE = "code.namespace";
var TMP_CODE_FILEPATH = "code.filepath";
var TMP_CODE_LINENO = "code.lineno";
var TMP_HTTP_METHOD = "http.method";
var TMP_HTTP_URL = "http.url";
var TMP_HTTP_TARGET = "http.target";
var TMP_HTTP_HOST = "http.host";
var TMP_HTTP_SCHEME = "http.scheme";
var TMP_HTTP_STATUS_CODE = "http.status_code";
var TMP_HTTP_FLAVOR = "http.flavor";
var TMP_HTTP_USER_AGENT = "http.user_agent";
var TMP_HTTP_REQUEST_CONTENT_LENGTH = "http.request_content_length";
var TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = "http.request_content_length_uncompressed";
var TMP_HTTP_RESPONSE_CONTENT_LENGTH = "http.response_content_length";
var TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = "http.response_content_length_uncompressed";
var TMP_HTTP_SERVER_NAME = "http.server_name";
var TMP_HTTP_ROUTE = "http.route";
var TMP_HTTP_CLIENT_IP = "http.client_ip";
var TMP_AWS_DYNAMODB_TABLE_NAMES = "aws.dynamodb.table_names";
var TMP_AWS_DYNAMODB_CONSUMED_CAPACITY = "aws.dynamodb.consumed_capacity";
var TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = "aws.dynamodb.item_collection_metrics";
var TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = "aws.dynamodb.provisioned_read_capacity";
var TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = "aws.dynamodb.provisioned_write_capacity";
var TMP_AWS_DYNAMODB_CONSISTENT_READ = "aws.dynamodb.consistent_read";
var TMP_AWS_DYNAMODB_PROJECTION = "aws.dynamodb.projection";
var TMP_AWS_DYNAMODB_LIMIT = "aws.dynamodb.limit";
var TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET = "aws.dynamodb.attributes_to_get";
var TMP_AWS_DYNAMODB_INDEX_NAME = "aws.dynamodb.index_name";
var TMP_AWS_DYNAMODB_SELECT = "aws.dynamodb.select";
var TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = "aws.dynamodb.global_secondary_indexes";
var TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = "aws.dynamodb.local_secondary_indexes";
var TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = "aws.dynamodb.exclusive_start_table";
var TMP_AWS_DYNAMODB_TABLE_COUNT = "aws.dynamodb.table_count";
var TMP_AWS_DYNAMODB_SCAN_FORWARD = "aws.dynamodb.scan_forward";
var TMP_AWS_DYNAMODB_SEGMENT = "aws.dynamodb.segment";
var TMP_AWS_DYNAMODB_TOTAL_SEGMENTS = "aws.dynamodb.total_segments";
var TMP_AWS_DYNAMODB_COUNT = "aws.dynamodb.count";
var TMP_AWS_DYNAMODB_SCANNED_COUNT = "aws.dynamodb.scanned_count";
var TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = "aws.dynamodb.attribute_definitions";
var TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = "aws.dynamodb.global_secondary_index_updates";
var TMP_MESSAGING_SYSTEM = "messaging.system";
var TMP_MESSAGING_DESTINATION = "messaging.destination";
var TMP_MESSAGING_DESTINATION_KIND = "messaging.destination_kind";
var TMP_MESSAGING_TEMP_DESTINATION = "messaging.temp_destination";
var TMP_MESSAGING_PROTOCOL = "messaging.protocol";
var TMP_MESSAGING_PROTOCOL_VERSION = "messaging.protocol_version";
var TMP_MESSAGING_URL = "messaging.url";
var TMP_MESSAGING_MESSAGE_ID = "messaging.message_id";
var TMP_MESSAGING_CONVERSATION_ID = "messaging.conversation_id";
var TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = "messaging.message_payload_size_bytes";
var TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = "messaging.message_payload_compressed_size_bytes";
var TMP_MESSAGING_OPERATION = "messaging.operation";
var TMP_MESSAGING_CONSUMER_ID = "messaging.consumer_id";
var TMP_MESSAGING_RABBITMQ_ROUTING_KEY = "messaging.rabbitmq.routing_key";
var TMP_MESSAGING_KAFKA_MESSAGE_KEY = "messaging.kafka.message_key";
var TMP_MESSAGING_KAFKA_CONSUMER_GROUP = "messaging.kafka.consumer_group";
var TMP_MESSAGING_KAFKA_CLIENT_ID = "messaging.kafka.client_id";
var TMP_MESSAGING_KAFKA_PARTITION = "messaging.kafka.partition";
var TMP_MESSAGING_KAFKA_TOMBSTONE = "messaging.kafka.tombstone";
var TMP_RPC_SYSTEM = "rpc.system";
var TMP_RPC_SERVICE = "rpc.service";
var TMP_RPC_METHOD = "rpc.method";
var TMP_RPC_GRPC_STATUS_CODE = "rpc.grpc.status_code";
var TMP_RPC_JSONRPC_VERSION = "rpc.jsonrpc.version";
var TMP_RPC_JSONRPC_REQUEST_ID = "rpc.jsonrpc.request_id";
var TMP_RPC_JSONRPC_ERROR_CODE = "rpc.jsonrpc.error_code";
var TMP_RPC_JSONRPC_ERROR_MESSAGE = "rpc.jsonrpc.error_message";
var TMP_MESSAGE_TYPE = "message.type";
var TMP_MESSAGE_ID = "message.id";
var TMP_MESSAGE_COMPRESSED_SIZE = "message.compressed_size";
var TMP_MESSAGE_UNCOMPRESSED_SIZE = "message.uncompressed_size";
var SemanticAttributes = /* @__PURE__ */ createConstMap([
  TMP_AWS_LAMBDA_INVOKED_ARN,
  TMP_DB_SYSTEM,
  TMP_DB_CONNECTION_STRING,
  TMP_DB_USER,
  TMP_DB_JDBC_DRIVER_CLASSNAME,
  TMP_DB_NAME,
  TMP_DB_STATEMENT,
  TMP_DB_OPERATION,
  TMP_DB_MSSQL_INSTANCE_NAME,
  TMP_DB_CASSANDRA_KEYSPACE,
  TMP_DB_CASSANDRA_PAGE_SIZE,
  TMP_DB_CASSANDRA_CONSISTENCY_LEVEL,
  TMP_DB_CASSANDRA_TABLE,
  TMP_DB_CASSANDRA_IDEMPOTENCE,
  TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT,
  TMP_DB_CASSANDRA_COORDINATOR_ID,
  TMP_DB_CASSANDRA_COORDINATOR_DC,
  TMP_DB_HBASE_NAMESPACE,
  TMP_DB_REDIS_DATABASE_INDEX,
  TMP_DB_MONGODB_COLLECTION,
  TMP_DB_SQL_TABLE,
  TMP_EXCEPTION_TYPE,
  TMP_EXCEPTION_MESSAGE,
  TMP_EXCEPTION_STACKTRACE,
  TMP_EXCEPTION_ESCAPED,
  TMP_FAAS_TRIGGER,
  TMP_FAAS_EXECUTION,
  TMP_FAAS_DOCUMENT_COLLECTION,
  TMP_FAAS_DOCUMENT_OPERATION,
  TMP_FAAS_DOCUMENT_TIME,
  TMP_FAAS_DOCUMENT_NAME,
  TMP_FAAS_TIME,
  TMP_FAAS_CRON,
  TMP_FAAS_COLDSTART,
  TMP_FAAS_INVOKED_NAME,
  TMP_FAAS_INVOKED_PROVIDER,
  TMP_FAAS_INVOKED_REGION,
  TMP_NET_TRANSPORT,
  TMP_NET_PEER_IP,
  TMP_NET_PEER_PORT,
  TMP_NET_PEER_NAME,
  TMP_NET_HOST_IP,
  TMP_NET_HOST_PORT,
  TMP_NET_HOST_NAME,
  TMP_NET_HOST_CONNECTION_TYPE,
  TMP_NET_HOST_CONNECTION_SUBTYPE,
  TMP_NET_HOST_CARRIER_NAME,
  TMP_NET_HOST_CARRIER_MCC,
  TMP_NET_HOST_CARRIER_MNC,
  TMP_NET_HOST_CARRIER_ICC,
  TMP_PEER_SERVICE,
  TMP_ENDUSER_ID,
  TMP_ENDUSER_ROLE,
  TMP_ENDUSER_SCOPE,
  TMP_THREAD_ID,
  TMP_THREAD_NAME,
  TMP_CODE_FUNCTION,
  TMP_CODE_NAMESPACE,
  TMP_CODE_FILEPATH,
  TMP_CODE_LINENO,
  TMP_HTTP_METHOD,
  TMP_HTTP_URL,
  TMP_HTTP_TARGET,
  TMP_HTTP_HOST,
  TMP_HTTP_SCHEME,
  TMP_HTTP_STATUS_CODE,
  TMP_HTTP_FLAVOR,
  TMP_HTTP_USER_AGENT,
  TMP_HTTP_REQUEST_CONTENT_LENGTH,
  TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED,
  TMP_HTTP_RESPONSE_CONTENT_LENGTH,
  TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED,
  TMP_HTTP_SERVER_NAME,
  TMP_HTTP_ROUTE,
  TMP_HTTP_CLIENT_IP,
  TMP_AWS_DYNAMODB_TABLE_NAMES,
  TMP_AWS_DYNAMODB_CONSUMED_CAPACITY,
  TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS,
  TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY,
  TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY,
  TMP_AWS_DYNAMODB_CONSISTENT_READ,
  TMP_AWS_DYNAMODB_PROJECTION,
  TMP_AWS_DYNAMODB_LIMIT,
  TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET,
  TMP_AWS_DYNAMODB_INDEX_NAME,
  TMP_AWS_DYNAMODB_SELECT,
  TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES,
  TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES,
  TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE,
  TMP_AWS_DYNAMODB_TABLE_COUNT,
  TMP_AWS_DYNAMODB_SCAN_FORWARD,
  TMP_AWS_DYNAMODB_SEGMENT,
  TMP_AWS_DYNAMODB_TOTAL_SEGMENTS,
  TMP_AWS_DYNAMODB_COUNT,
  TMP_AWS_DYNAMODB_SCANNED_COUNT,
  TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS,
  TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES,
  TMP_MESSAGING_SYSTEM,
  TMP_MESSAGING_DESTINATION,
  TMP_MESSAGING_DESTINATION_KIND,
  TMP_MESSAGING_TEMP_DESTINATION,
  TMP_MESSAGING_PROTOCOL,
  TMP_MESSAGING_PROTOCOL_VERSION,
  TMP_MESSAGING_URL,
  TMP_MESSAGING_MESSAGE_ID,
  TMP_MESSAGING_CONVERSATION_ID,
  TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES,
  TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES,
  TMP_MESSAGING_OPERATION,
  TMP_MESSAGING_CONSUMER_ID,
  TMP_MESSAGING_RABBITMQ_ROUTING_KEY,
  TMP_MESSAGING_KAFKA_MESSAGE_KEY,
  TMP_MESSAGING_KAFKA_CONSUMER_GROUP,
  TMP_MESSAGING_KAFKA_CLIENT_ID,
  TMP_MESSAGING_KAFKA_PARTITION,
  TMP_MESSAGING_KAFKA_TOMBSTONE,
  TMP_RPC_SYSTEM,
  TMP_RPC_SERVICE,
  TMP_RPC_METHOD,
  TMP_RPC_GRPC_STATUS_CODE,
  TMP_RPC_JSONRPC_VERSION,
  TMP_RPC_JSONRPC_REQUEST_ID,
  TMP_RPC_JSONRPC_ERROR_CODE,
  TMP_RPC_JSONRPC_ERROR_MESSAGE,
  TMP_MESSAGE_TYPE,
  TMP_MESSAGE_ID,
  TMP_MESSAGE_COMPRESSED_SIZE,
  TMP_MESSAGE_UNCOMPRESSED_SIZE
]);

// node_modules/@opentelemetry/semantic-conventions/build/esm/resource/SemanticResourceAttributes.js
var TMP_PROCESS_RUNTIME_NAME = "process.runtime.name";
var TMP_SERVICE_NAME = "service.name";
var TMP_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
var TMP_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
var TMP_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
var SEMRESATTRS_PROCESS_RUNTIME_NAME = TMP_PROCESS_RUNTIME_NAME;
var SEMRESATTRS_SERVICE_NAME = TMP_SERVICE_NAME;
var SEMRESATTRS_TELEMETRY_SDK_NAME = TMP_TELEMETRY_SDK_NAME;
var SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = TMP_TELEMETRY_SDK_LANGUAGE;
var SEMRESATTRS_TELEMETRY_SDK_VERSION = TMP_TELEMETRY_SDK_VERSION;
var TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS = "webjs";
var TELEMETRYSDKLANGUAGEVALUES_WEBJS = TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS;

// node_modules/@opentelemetry/core/build/esm/platform/browser/sdk-info.js
var _a;
var SDK_INFO = (_a = {}, _a[SEMRESATTRS_TELEMETRY_SDK_NAME] = "opentelemetry", _a[SEMRESATTRS_PROCESS_RUNTIME_NAME] = "browser", _a[SEMRESATTRS_TELEMETRY_SDK_LANGUAGE] = TELEMETRYSDKLANGUAGEVALUES_WEBJS, _a[SEMRESATTRS_TELEMETRY_SDK_VERSION] = VERSION2, _a);

// node_modules/@opentelemetry/core/build/esm/common/time.js
var NANOSECOND_DIGITS = 9;
var NANOSECOND_DIGITS_IN_MILLIS = 6;
var MILLISECONDS_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS);
var SECOND_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS);
function hrTimeDuration(startTime, endTime) {
  var seconds = endTime[0] - startTime[0];
  var nanos = endTime[1] - startTime[1];
  if (nanos < 0) {
    seconds -= 1;
    nanos += SECOND_TO_NANOSECONDS;
  }
  return [seconds, nanos];
}
function isTimeInputHrTime(value) {
  return Array.isArray(value) && value.length === 2 && typeof value[0] === "number" && typeof value[1] === "number";
}
function isTimeInput(value) {
  return isTimeInputHrTime(value) || typeof value === "number" || value instanceof Date;
}

// node_modules/@opentelemetry/core/build/esm/ExportResult.js
var ExportResultCode;
(function(ExportResultCode2) {
  ExportResultCode2[ExportResultCode2["SUCCESS"] = 0] = "SUCCESS";
  ExportResultCode2[ExportResultCode2["FAILED"] = 1] = "FAILED";
})(ExportResultCode || (ExportResultCode = {}));

// node_modules/@opentelemetry/core/build/esm/internal/validators.js
var VALID_KEY_CHAR_RANGE = "[_0-9a-z-*/]";
var VALID_KEY = "[a-z]" + VALID_KEY_CHAR_RANGE + "{0,255}";
var VALID_VENDOR_KEY = "[a-z0-9]" + VALID_KEY_CHAR_RANGE + "{0,240}@[a-z]" + VALID_KEY_CHAR_RANGE + "{0,13}";
var VALID_KEY_REGEX = new RegExp("^(?:" + VALID_KEY + "|" + VALID_VENDOR_KEY + ")$");
var VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/;
var INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
function validateKey(key) {
  return VALID_KEY_REGEX.test(key);
}
function validateValue(value) {
  return VALID_VALUE_BASE_REGEX.test(value) && !INVALID_VALUE_COMMA_EQUAL_REGEX.test(value);
}

// node_modules/@opentelemetry/core/build/esm/trace/TraceState.js
var MAX_TRACE_STATE_ITEMS = 32;
var MAX_TRACE_STATE_LEN = 512;
var LIST_MEMBERS_SEPARATOR = ",";
var LIST_MEMBER_KEY_VALUE_SPLITTER = "=";
var TraceState = (
  /** @class */
  function() {
    function TraceState2(rawTraceState) {
      this._internalState = /* @__PURE__ */ new Map();
      if (rawTraceState)
        this._parse(rawTraceState);
    }
    TraceState2.prototype.set = function(key, value) {
      var traceState = this._clone();
      if (traceState._internalState.has(key)) {
        traceState._internalState.delete(key);
      }
      traceState._internalState.set(key, value);
      return traceState;
    };
    TraceState2.prototype.unset = function(key) {
      var traceState = this._clone();
      traceState._internalState.delete(key);
      return traceState;
    };
    TraceState2.prototype.get = function(key) {
      return this._internalState.get(key);
    };
    TraceState2.prototype.serialize = function() {
      var _this = this;
      return this._keys().reduce(function(agg, key) {
        agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + _this.get(key));
        return agg;
      }, []).join(LIST_MEMBERS_SEPARATOR);
    };
    TraceState2.prototype._parse = function(rawTraceState) {
      if (rawTraceState.length > MAX_TRACE_STATE_LEN)
        return;
      this._internalState = rawTraceState.split(LIST_MEMBERS_SEPARATOR).reverse().reduce(function(agg, part) {
        var listMember = part.trim();
        var i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
        if (i !== -1) {
          var key = listMember.slice(0, i);
          var value = listMember.slice(i + 1, part.length);
          if (validateKey(key) && validateValue(value)) {
            agg.set(key, value);
          } else {
          }
        }
        return agg;
      }, /* @__PURE__ */ new Map());
      if (this._internalState.size > MAX_TRACE_STATE_ITEMS) {
        this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, MAX_TRACE_STATE_ITEMS));
      }
    };
    TraceState2.prototype._keys = function() {
      return Array.from(this._internalState.keys()).reverse();
    };
    TraceState2.prototype._clone = function() {
      var traceState = new TraceState2();
      traceState._internalState = new Map(this._internalState);
      return traceState;
    };
    return TraceState2;
  }()
);

// node_modules/@opentelemetry/core/build/esm/trace/W3CTraceContextPropagator.js
var TRACE_PARENT_HEADER = "traceparent";
var TRACE_STATE_HEADER = "tracestate";
var VERSION3 = "00";
var VERSION_PART = "(?!ff)[\\da-f]{2}";
var TRACE_ID_PART = "(?![0]{32})[\\da-f]{32}";
var PARENT_ID_PART = "(?![0]{16})[\\da-f]{16}";
var FLAGS_PART = "[\\da-f]{2}";
var TRACE_PARENT_REGEX = new RegExp("^\\s?(" + VERSION_PART + ")-(" + TRACE_ID_PART + ")-(" + PARENT_ID_PART + ")-(" + FLAGS_PART + ")(-.*)?\\s?$");
function parseTraceParent(traceParent) {
  var match = TRACE_PARENT_REGEX.exec(traceParent);
  if (!match)
    return null;
  if (match[1] === "00" && match[5])
    return null;
  return {
    traceId: match[2],
    spanId: match[3],
    traceFlags: parseInt(match[4], 16)
  };
}
var W3CTraceContextPropagator = (
  /** @class */
  function() {
    function W3CTraceContextPropagator2() {
    }
    W3CTraceContextPropagator2.prototype.inject = function(context2, carrier, setter) {
      var spanContext = trace.getSpanContext(context2);
      if (!spanContext || isTracingSuppressed(context2) || !isSpanContextValid(spanContext))
        return;
      var traceParent = VERSION3 + "-" + spanContext.traceId + "-" + spanContext.spanId + "-0" + Number(spanContext.traceFlags || TraceFlags.NONE).toString(16);
      setter.set(carrier, TRACE_PARENT_HEADER, traceParent);
      if (spanContext.traceState) {
        setter.set(carrier, TRACE_STATE_HEADER, spanContext.traceState.serialize());
      }
    };
    W3CTraceContextPropagator2.prototype.extract = function(context2, carrier, getter) {
      var traceParentHeader = getter.get(carrier, TRACE_PARENT_HEADER);
      if (!traceParentHeader)
        return context2;
      var traceParent = Array.isArray(traceParentHeader) ? traceParentHeader[0] : traceParentHeader;
      if (typeof traceParent !== "string")
        return context2;
      var spanContext = parseTraceParent(traceParent);
      if (!spanContext)
        return context2;
      spanContext.isRemote = true;
      var traceStateHeader = getter.get(carrier, TRACE_STATE_HEADER);
      if (traceStateHeader) {
        var state2 = Array.isArray(traceStateHeader) ? traceStateHeader.join(",") : traceStateHeader;
        spanContext.traceState = new TraceState(typeof state2 === "string" ? state2 : void 0);
      }
      return trace.setSpanContext(context2, spanContext);
    };
    W3CTraceContextPropagator2.prototype.fields = function() {
      return [TRACE_PARENT_HEADER, TRACE_STATE_HEADER];
    };
    return W3CTraceContextPropagator2;
  }()
);

// node_modules/@opentelemetry/sdk-trace-base/build/esm/Sampler.js
var SamplingDecision;
(function(SamplingDecision2) {
  SamplingDecision2[SamplingDecision2["NOT_RECORD"] = 0] = "NOT_RECORD";
  SamplingDecision2[SamplingDecision2["RECORD"] = 1] = "RECORD";
  SamplingDecision2[SamplingDecision2["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
})(SamplingDecision || (SamplingDecision = {}));

// node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/AlwaysOffSampler.js
var AlwaysOffSampler = (
  /** @class */
  function() {
    function AlwaysOffSampler2() {
    }
    AlwaysOffSampler2.prototype.shouldSample = function() {
      return {
        decision: SamplingDecision.NOT_RECORD
      };
    };
    AlwaysOffSampler2.prototype.toString = function() {
      return "AlwaysOffSampler";
    };
    return AlwaysOffSampler2;
  }()
);

// node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/AlwaysOnSampler.js
var AlwaysOnSampler = (
  /** @class */
  function() {
    function AlwaysOnSampler2() {
    }
    AlwaysOnSampler2.prototype.shouldSample = function() {
      return {
        decision: SamplingDecision.RECORD_AND_SAMPLED
      };
    };
    AlwaysOnSampler2.prototype.toString = function() {
      return "AlwaysOnSampler";
    };
    return AlwaysOnSampler2;
  }()
);

// node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/ParentBasedSampler.js
var ParentBasedSampler = (
  /** @class */
  function() {
    function ParentBasedSampler2(config) {
      var _a2, _b, _c, _d;
      this._root = config.root;
      if (!this._root) {
        globalErrorHandler(new Error("ParentBasedSampler must have a root sampler configured"));
        this._root = new AlwaysOnSampler();
      }
      this._remoteParentSampled = (_a2 = config.remoteParentSampled) !== null && _a2 !== void 0 ? _a2 : new AlwaysOnSampler();
      this._remoteParentNotSampled = (_b = config.remoteParentNotSampled) !== null && _b !== void 0 ? _b : new AlwaysOffSampler();
      this._localParentSampled = (_c = config.localParentSampled) !== null && _c !== void 0 ? _c : new AlwaysOnSampler();
      this._localParentNotSampled = (_d = config.localParentNotSampled) !== null && _d !== void 0 ? _d : new AlwaysOffSampler();
    }
    ParentBasedSampler2.prototype.shouldSample = function(context2, traceId, spanName, spanKind, attributes, links) {
      var parentContext = trace.getSpanContext(context2);
      if (!parentContext || !isSpanContextValid(parentContext)) {
        return this._root.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
      }
      if (parentContext.isRemote) {
        if (parentContext.traceFlags & TraceFlags.SAMPLED) {
          return this._remoteParentSampled.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
        }
        return this._remoteParentNotSampled.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
      }
      if (parentContext.traceFlags & TraceFlags.SAMPLED) {
        return this._localParentSampled.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
      }
      return this._localParentNotSampled.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
    };
    ParentBasedSampler2.prototype.toString = function() {
      return "ParentBased{root=" + this._root.toString() + ", remoteParentSampled=" + this._remoteParentSampled.toString() + ", remoteParentNotSampled=" + this._remoteParentNotSampled.toString() + ", localParentSampled=" + this._localParentSampled.toString() + ", localParentNotSampled=" + this._localParentNotSampled.toString() + "}";
    };
    return ParentBasedSampler2;
  }()
);

// node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/TraceIdRatioBasedSampler.js
var TraceIdRatioBasedSampler = (
  /** @class */
  function() {
    function TraceIdRatioBasedSampler2(_ratio) {
      if (_ratio === void 0) {
        _ratio = 0;
      }
      this._ratio = _ratio;
      this._ratio = this._normalize(_ratio);
      this._upperBound = Math.floor(this._ratio * 4294967295);
    }
    TraceIdRatioBasedSampler2.prototype.shouldSample = function(context2, traceId) {
      return {
        decision: isValidTraceId(traceId) && this._accumulate(traceId) < this._upperBound ? SamplingDecision.RECORD_AND_SAMPLED : SamplingDecision.NOT_RECORD
      };
    };
    TraceIdRatioBasedSampler2.prototype.toString = function() {
      return "TraceIdRatioBased{" + this._ratio + "}";
    };
    TraceIdRatioBasedSampler2.prototype._normalize = function(ratio) {
      if (typeof ratio !== "number" || isNaN(ratio))
        return 0;
      return ratio >= 1 ? 1 : ratio <= 0 ? 0 : ratio;
    };
    TraceIdRatioBasedSampler2.prototype._accumulate = function(traceId) {
      var accumulation = 0;
      for (var i = 0; i < traceId.length / 8; i++) {
        var pos = i * 8;
        var part = parseInt(traceId.slice(pos, pos + 8), 16);
        accumulation = (accumulation ^ part) >>> 0;
      }
      return accumulation;
    };
    return TraceIdRatioBasedSampler2;
  }()
);

// node_modules/@opentelemetry/sdk-trace-base/build/esm/platform/browser/RandomIdGenerator.js
var SPAN_ID_BYTES = 8;
var TRACE_ID_BYTES = 16;
var RandomIdGenerator2 = (
  /** @class */
  /* @__PURE__ */ function() {
    function RandomIdGenerator3() {
      this.generateTraceId = getIdGenerator(TRACE_ID_BYTES);
      this.generateSpanId = getIdGenerator(SPAN_ID_BYTES);
    }
    return RandomIdGenerator3;
  }()
);
var SHARED_CHAR_CODES_ARRAY = Array(32);
function getIdGenerator(bytes) {
  return function generateId() {
    for (var i = 0; i < bytes * 2; i++) {
      SHARED_CHAR_CODES_ARRAY[i] = Math.floor(Math.random() * 16) + 48;
      if (SHARED_CHAR_CODES_ARRAY[i] >= 58) {
        SHARED_CHAR_CODES_ARRAY[i] += 39;
      }
    }
    return String.fromCharCode.apply(null, SHARED_CHAR_CODES_ARRAY.slice(0, bytes * 2));
  };
}

// node_modules/@opentelemetry/resources/build/esm/platform/browser/default-service-name.js
function defaultServiceName() {
  return "unknown_service";
}

// node_modules/@opentelemetry/resources/build/esm/Resource.js
var __assign = function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = function(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
};
var __read7 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var Resource = (
  /** @class */
  function() {
    function Resource2(attributes, asyncAttributesPromise) {
      var _this = this;
      var _a2;
      this._attributes = attributes;
      this.asyncAttributesPending = asyncAttributesPromise != null;
      this._syncAttributes = (_a2 = this._attributes) !== null && _a2 !== void 0 ? _a2 : {};
      this._asyncAttributesPromise = asyncAttributesPromise === null || asyncAttributesPromise === void 0 ? void 0 : asyncAttributesPromise.then(function(asyncAttributes) {
        _this._attributes = Object.assign({}, _this._attributes, asyncAttributes);
        _this.asyncAttributesPending = false;
        return asyncAttributes;
      }, function(err) {
        diag2.debug("a resource's async attributes promise rejected: %s", err);
        _this.asyncAttributesPending = false;
        return {};
      });
    }
    Resource2.empty = function() {
      return Resource2.EMPTY;
    };
    Resource2.default = function() {
      var _a2;
      return new Resource2((_a2 = {}, _a2[SEMRESATTRS_SERVICE_NAME] = defaultServiceName(), _a2[SEMRESATTRS_TELEMETRY_SDK_LANGUAGE] = SDK_INFO[SEMRESATTRS_TELEMETRY_SDK_LANGUAGE], _a2[SEMRESATTRS_TELEMETRY_SDK_NAME] = SDK_INFO[SEMRESATTRS_TELEMETRY_SDK_NAME], _a2[SEMRESATTRS_TELEMETRY_SDK_VERSION] = SDK_INFO[SEMRESATTRS_TELEMETRY_SDK_VERSION], _a2));
    };
    Object.defineProperty(Resource2.prototype, "attributes", {
      get: function() {
        var _a2;
        if (this.asyncAttributesPending) {
          diag2.error("Accessing resource attributes before async attributes settled");
        }
        return (_a2 = this._attributes) !== null && _a2 !== void 0 ? _a2 : {};
      },
      enumerable: false,
      configurable: true
    });
    Resource2.prototype.waitForAsyncAttributes = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a2) {
          switch (_a2.label) {
            case 0:
              if (!this.asyncAttributesPending) return [3, 2];
              return [4, this._asyncAttributesPromise];
            case 1:
              _a2.sent();
              _a2.label = 2;
            case 2:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    Resource2.prototype.merge = function(other) {
      var _this = this;
      var _a2;
      if (!other)
        return this;
      var mergedSyncAttributes = __assign(__assign({}, this._syncAttributes), (_a2 = other._syncAttributes) !== null && _a2 !== void 0 ? _a2 : other.attributes);
      if (!this._asyncAttributesPromise && !other._asyncAttributesPromise) {
        return new Resource2(mergedSyncAttributes);
      }
      var mergedAttributesPromise = Promise.all([
        this._asyncAttributesPromise,
        other._asyncAttributesPromise
      ]).then(function(_a3) {
        var _b;
        var _c = __read7(_a3, 2), thisAsyncAttributes = _c[0], otherAsyncAttributes = _c[1];
        return __assign(__assign(__assign(__assign({}, _this._syncAttributes), thisAsyncAttributes), (_b = other._syncAttributes) !== null && _b !== void 0 ? _b : other.attributes), otherAsyncAttributes);
      });
      return new Resource2(mergedSyncAttributes, mergedAttributesPromise);
    };
    Resource2.EMPTY = new Resource2({});
    return Resource2;
  }()
);

// src/sampling.ts
function multiTailSampler(samplers) {
  return (traceInfo) => {
    return samplers.reduce((result, sampler) => result || sampler(traceInfo), false);
  };
}
var isHeadSampled = (traceInfo) => {
  const localRootSpan = traceInfo.localRootSpan;
  return (localRootSpan.spanContext().traceFlags & TraceFlags.SAMPLED) === TraceFlags.SAMPLED;
};
var isRootErrorSpan = (traceInfo) => {
  const localRootSpan = traceInfo.localRootSpan;
  return localRootSpan.status.code === SpanStatusCode.ERROR;
};
function createSampler(conf) {
  const ratioSampler = new TraceIdRatioBasedSampler(conf.ratio);
  if (typeof conf.acceptRemote === "boolean" && !conf.acceptRemote) {
    return new ParentBasedSampler({
      root: ratioSampler,
      remoteParentSampled: ratioSampler,
      remoteParentNotSampled: ratioSampler
    });
  } else {
    return new ParentBasedSampler({ root: ratioSampler });
  }
}

// src/types.ts
function isSpanProcessorConfig(config) {
  return !!config.spanProcessors;
}

// node_modules/@opentelemetry/otlp-transformer/node_modules/@opentelemetry/core/build/esm/common/hex-to-binary.js
function intValue(charCode) {
  if (charCode >= 48 && charCode <= 57) {
    return charCode - 48;
  }
  if (charCode >= 97 && charCode <= 102) {
    return charCode - 87;
  }
  return charCode - 55;
}
function hexToBinary(hexStr) {
  var buf = new Uint8Array(hexStr.length / 2);
  var offset = 0;
  for (var i = 0; i < hexStr.length; i += 2) {
    var hi = intValue(hexStr.charCodeAt(i));
    var lo = intValue(hexStr.charCodeAt(i + 1));
    buf[offset++] = hi << 4 | lo;
  }
  return buf;
}

// node_modules/@opentelemetry/otlp-transformer/node_modules/@opentelemetry/core/build/esm/common/time.js
var NANOSECOND_DIGITS2 = 9;
var NANOSECOND_DIGITS_IN_MILLIS2 = 6;
var MILLISECONDS_TO_NANOSECONDS2 = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS2);
var SECOND_TO_NANOSECONDS2 = Math.pow(10, NANOSECOND_DIGITS2);
function hrTimeToNanoseconds2(time) {
  return time[0] * SECOND_TO_NANOSECONDS2 + time[1];
}

// node_modules/@opentelemetry/otlp-transformer/build/esm/common/index.js
function hrTimeToNanos(hrTime3) {
  var NANOSECONDS = BigInt(1e9);
  return BigInt(hrTime3[0]) * NANOSECONDS + BigInt(hrTime3[1]);
}
function toLongBits(value) {
  var low = Number(BigInt.asUintN(32, value));
  var high = Number(BigInt.asUintN(32, value >> BigInt(32)));
  return { low, high };
}
function encodeAsLongBits(hrTime3) {
  var nanos = hrTimeToNanos(hrTime3);
  return toLongBits(nanos);
}
function encodeAsString(hrTime3) {
  var nanos = hrTimeToNanos(hrTime3);
  return nanos.toString();
}
var encodeTimestamp = typeof BigInt !== "undefined" ? encodeAsString : hrTimeToNanoseconds2;
function identity(value) {
  return value;
}
function optionalHexToBinary(str) {
  if (str === void 0)
    return void 0;
  return hexToBinary(str);
}
var DEFAULT_ENCODER = {
  encodeHrTime: encodeAsLongBits,
  encodeSpanContext: hexToBinary,
  encodeOptionalSpanContext: optionalHexToBinary
};
function getOtlpEncoder(options) {
  var _a2, _b;
  if (options === void 0) {
    return DEFAULT_ENCODER;
  }
  var useLongBits = (_a2 = options.useLongBits) !== null && _a2 !== void 0 ? _a2 : true;
  var useHex = (_b = options.useHex) !== null && _b !== void 0 ? _b : false;
  return {
    encodeHrTime: useLongBits ? encodeAsLongBits : encodeTimestamp,
    encodeSpanContext: useHex ? identity : hexToBinary,
    encodeOptionalSpanContext: useHex ? identity : optionalHexToBinary
  };
}

// node_modules/@opentelemetry/otlp-transformer/build/esm/common/internal.js
var __read8 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
function createInstrumentationScope(scope) {
  return {
    name: scope.name,
    version: scope.version
  };
}
function toAttributes(attributes) {
  return Object.keys(attributes).map(function(key) {
    return toKeyValue(key, attributes[key]);
  });
}
function toKeyValue(key, value) {
  return {
    key,
    value: toAnyValue(value)
  };
}
function toAnyValue(value) {
  var t = typeof value;
  if (t === "string")
    return { stringValue: value };
  if (t === "number") {
    if (!Number.isInteger(value))
      return { doubleValue: value };
    return { intValue: value };
  }
  if (t === "boolean")
    return { boolValue: value };
  if (value instanceof Uint8Array)
    return { bytesValue: value };
  if (Array.isArray(value))
    return { arrayValue: { values: value.map(toAnyValue) } };
  if (t === "object" && value != null)
    return {
      kvlistValue: {
        values: Object.entries(value).map(function(_a2) {
          var _b = __read8(_a2, 2), k = _b[0], v = _b[1];
          return toKeyValue(k, v);
        })
      }
    };
  return {};
}

// node_modules/@opentelemetry/otlp-transformer/build/esm/trace/internal.js
function sdkSpanToOtlpSpan(span, encoder) {
  var _a2;
  var ctx = span.spanContext();
  var status = span.status;
  return {
    traceId: encoder.encodeSpanContext(ctx.traceId),
    spanId: encoder.encodeSpanContext(ctx.spanId),
    parentSpanId: encoder.encodeOptionalSpanContext(span.parentSpanId),
    traceState: (_a2 = ctx.traceState) === null || _a2 === void 0 ? void 0 : _a2.serialize(),
    name: span.name,
    // Span kind is offset by 1 because the API does not define a value for unset
    kind: span.kind == null ? 0 : span.kind + 1,
    startTimeUnixNano: encoder.encodeHrTime(span.startTime),
    endTimeUnixNano: encoder.encodeHrTime(span.endTime),
    attributes: toAttributes(span.attributes),
    droppedAttributesCount: span.droppedAttributesCount,
    events: span.events.map(function(event) {
      return toOtlpSpanEvent(event, encoder);
    }),
    droppedEventsCount: span.droppedEventsCount,
    status: {
      // API and proto enums share the same values
      code: status.code,
      message: status.message
    },
    links: span.links.map(function(link) {
      return toOtlpLink(link, encoder);
    }),
    droppedLinksCount: span.droppedLinksCount
  };
}
function toOtlpLink(link, encoder) {
  var _a2;
  return {
    attributes: link.attributes ? toAttributes(link.attributes) : [],
    spanId: encoder.encodeSpanContext(link.context.spanId),
    traceId: encoder.encodeSpanContext(link.context.traceId),
    traceState: (_a2 = link.context.traceState) === null || _a2 === void 0 ? void 0 : _a2.serialize(),
    droppedAttributesCount: link.droppedAttributesCount || 0
  };
}
function toOtlpSpanEvent(timedEvent, encoder) {
  return {
    attributes: timedEvent.attributes ? toAttributes(timedEvent.attributes) : [],
    name: timedEvent.name,
    timeUnixNano: encoder.encodeHrTime(timedEvent.time),
    droppedAttributesCount: timedEvent.droppedAttributesCount || 0
  };
}

// node_modules/@opentelemetry/otlp-transformer/build/esm/resource/internal.js
function createResource(resource) {
  return {
    attributes: toAttributes(resource.attributes),
    droppedAttributesCount: 0
  };
}

// node_modules/@opentelemetry/otlp-transformer/build/esm/trace/index.js
var __values3 = function(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read9 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
function createExportTraceServiceRequest(spans, options) {
  var encoder = getOtlpEncoder(options);
  return {
    resourceSpans: spanRecordsToResourceSpans(spans, encoder)
  };
}
function createResourceMap(readableSpans) {
  var e_1, _a2;
  var resourceMap = /* @__PURE__ */ new Map();
  try {
    for (var readableSpans_1 = __values3(readableSpans), readableSpans_1_1 = readableSpans_1.next(); !readableSpans_1_1.done; readableSpans_1_1 = readableSpans_1.next()) {
      var record = readableSpans_1_1.value;
      var ilmMap = resourceMap.get(record.resource);
      if (!ilmMap) {
        ilmMap = /* @__PURE__ */ new Map();
        resourceMap.set(record.resource, ilmMap);
      }
      var instrumentationLibraryKey = record.instrumentationLibrary.name + "@" + (record.instrumentationLibrary.version || "") + ":" + (record.instrumentationLibrary.schemaUrl || "");
      var records = ilmMap.get(instrumentationLibraryKey);
      if (!records) {
        records = [];
        ilmMap.set(instrumentationLibraryKey, records);
      }
      records.push(record);
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (readableSpans_1_1 && !readableSpans_1_1.done && (_a2 = readableSpans_1.return)) _a2.call(readableSpans_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  return resourceMap;
}
function spanRecordsToResourceSpans(readableSpans, encoder) {
  var resourceMap = createResourceMap(readableSpans);
  var out = [];
  var entryIterator = resourceMap.entries();
  var entry = entryIterator.next();
  while (!entry.done) {
    var _a2 = __read9(entry.value, 2), resource = _a2[0], ilmMap = _a2[1];
    var scopeResourceSpans = [];
    var ilmIterator = ilmMap.values();
    var ilmEntry = ilmIterator.next();
    while (!ilmEntry.done) {
      var scopeSpans = ilmEntry.value;
      if (scopeSpans.length > 0) {
        var spans = scopeSpans.map(function(readableSpan) {
          return sdkSpanToOtlpSpan(readableSpan, encoder);
        });
        scopeResourceSpans.push({
          scope: createInstrumentationScope(scopeSpans[0].instrumentationLibrary),
          spans,
          schemaUrl: scopeSpans[0].instrumentationLibrary.schemaUrl
        });
      }
      ilmEntry = ilmIterator.next();
    }
    var transformedSpans = {
      resource: createResource(resource),
      scopeSpans: scopeResourceSpans,
      schemaUrl: void 0
    };
    out.push(transformedSpans);
    entry = entryIterator.next();
  }
  return out;
}

// node_modules/@opentelemetry/otlp-exporter-base/build/esm/types.js
var __extends = /* @__PURE__ */ function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
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
var OTLPExporterError = (
  /** @class */
  function(_super) {
    __extends(OTLPExporterError2, _super);
    function OTLPExporterError2(message, code, data) {
      var _this = _super.call(this, message) || this;
      _this.name = "OTLPExporterError";
      _this.data = data;
      _this.code = code;
      return _this;
    }
    return OTLPExporterError2;
  }(Error)
);

// src/wrap.ts
var unwrapSymbol = Symbol("unwrap");
function isWrapped(item) {
  return item && !!item[unwrapSymbol];
}
function isProxyable(item) {
  return item !== null && typeof item === "object" || typeof item === "function";
}
function wrap(item, handler, autoPassthrough = true) {
  if (isWrapped(item) || !isProxyable(item)) {
    return item;
  }
  const proxyHandler = Object.assign({}, handler);
  proxyHandler.get = (target, prop, receiver) => {
    if (prop === unwrapSymbol) {
      return item;
    } else {
      if (handler.get) {
        return handler.get(target, prop, receiver);
      } else if (prop === "bind") {
        return () => receiver;
      } else if (autoPassthrough) {
        return passthroughGet(target, prop);
      }
    }
  };
  proxyHandler.apply = (target, thisArg, argArray) => {
    if (handler.apply) {
      return handler.apply(unwrap(target), unwrap(thisArg), argArray);
    }
  };
  return new Proxy(item, proxyHandler);
}
function unwrap(item) {
  if (item && isWrapped(item)) {
    return item[unwrapSymbol];
  } else {
    return item;
  }
}
function passthroughGet(target, prop, thisArg) {
  const unwrappedTarget = unwrap(target);
  const value = Reflect.get(unwrappedTarget, prop);
  if (typeof value === "function") {
    if (value.constructor.name === "RpcProperty") {
      return (...args) => {
        const ctx = context.active();
        let headers = {};
        propagation.inject(ctx, headers);
        if (typeof args[0] === "object" && args[0] !== null) {
          args[0] = {
            ...args[0],
            __otel_request: {
              ..."__otel_request" in args[0] ? args[0].__otel_request : {},
              headers: {
                ..."__otel_request" in args[0] && "headers" in args[0].__otel_request ? args[0].__otel_request.headers : {},
                ...headers
              }
            }
          };
        }
        return unwrappedTarget[prop](...args);
      };
    }
    thisArg = thisArg || unwrappedTarget;
    return value.bind(thisArg);
  } else {
    return value;
  }
}

// src/exporter.ts
var defaultHeaders = {
  accept: "application/json",
  "content-type": "application/json"
};
var OTLPExporter = class {
  headers;
  url;
  constructor(config) {
    this.url = config.url;
    this.headers = Object.assign({}, defaultHeaders, config.headers);
  }
  export(items, resultCallback) {
    this._export(items).then(() => {
      resultCallback({ code: ExportResultCode.SUCCESS });
    }).catch((error) => {
      resultCallback({ code: ExportResultCode.FAILED, error });
    });
  }
  _export(items) {
    return new Promise((resolve, reject) => {
      try {
        this.send(items, resolve, reject);
      } catch (e) {
        reject(e);
      }
    });
  }
  send(items, onSuccess, onError) {
    const exportMessage = createExportTraceServiceRequest(items, {
      useHex: true,
      useLongBits: false
    });
    const body = JSON.stringify(exportMessage);
    const params = {
      method: "POST",
      headers: this.headers,
      body
    };
    unwrap(fetch)(this.url, params).then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onError(new OTLPExporterError(`Exporter received a statusCode: ${response.status}`));
      }
    }).catch((error) => {
      onError(new OTLPExporterError(`Exception during export: ${error.toString()}`, error.code, error.stack));
    });
  }
  async shutdown() {
  }
};

// src/vendor/ts-checked-fsm/StateMachine.ts
var stateMachine = () => {
  const stateFunc = state();
  return {
    state: stateFunc
  };
};
var state = () => {
  return (_s) => {
    const transitionFunc = transition();
    const stateFunc = state();
    const builder = {
      state: stateFunc,
      transition: transitionFunc
    };
    return builder;
  };
};
var transition = () => {
  return (_curState, _next) => {
    const transitionFunction = transition();
    const actionFunc = action();
    return {
      transition: transitionFunction,
      action: actionFunc
    };
  };
};
var action = () => {
  return (_actionName) => {
    const actionFunc = action();
    const actionHandlerFunc = actionHandler({ handlers: {} });
    return {
      action: actionFunc,
      actionHandler: actionHandlerFunc
    };
  };
};
var actionHandler = (definition) => {
  return (state2, action2, handler) => {
    const untypedState = state2;
    const untypedAction = action2;
    const newDefinition = {
      ...definition,
      handlers: {
        ...definition.handlers,
        [untypedState]: {
          ...definition.handlers[untypedState] ? definition.handlers[untypedState] : {},
          [untypedAction]: handler
        }
      }
    };
    const doneFunc = done(newDefinition);
    const actionHandlerFunc = actionHandler(newDefinition);
    return {
      actionHandler: actionHandlerFunc,
      done: doneFunc
    };
  };
};
var done = (definition) => {
  const doneFunc = (_) => {
    const nextStateFunction = (curState, action2) => {
      const curStateAsState = curState;
      const actionAsAction = action2;
      if (definition.handlers[curStateAsState.stateName] == null) {
        return curState;
      }
      const handler = definition.handlers[curStateAsState.stateName];
      if (handler === void 0) {
        return curState;
      }
      const nextAction = handler[actionAsAction.actionName];
      return nextAction != null ? nextAction(curState, action2) : curState;
    };
    return {
      nextState: nextStateFunction
    };
  };
  return doneFunc;
};

// src/spanprocessor.ts
function newTrace(currentState, { span }) {
  const spanId = span.spanContext().spanId;
  return {
    ...currentState,
    stateName: "in_progress",
    traceId: span.spanContext().traceId,
    localRootSpan: span,
    completedSpans: [],
    inProgressSpanIds: /* @__PURE__ */ new Set([spanId])
  };
}
function newSpan(currentState, { span }) {
  const spanId = span.spanContext().spanId;
  currentState.inProgressSpanIds.add(spanId);
  return { ...currentState };
}
function endSpan(currentState, { span }) {
  currentState.completedSpans.push(span);
  currentState.inProgressSpanIds.delete(span.spanContext().spanId);
  if (currentState.inProgressSpanIds.size === 0) {
    return {
      stateName: "trace_complete",
      traceId: currentState.traceId,
      localRootSpan: currentState.localRootSpan,
      completedSpans: currentState.completedSpans
    };
  } else {
    return { ...currentState };
  }
}
function startExport(currentState, { args }) {
  const { exporter, tailSampler, postProcessor } = args;
  const { traceId, localRootSpan, completedSpans: spans } = currentState;
  const shouldExport = tailSampler({ traceId, localRootSpan, spans });
  if (shouldExport) {
    const exportSpans2 = postProcessor(spans);
    const promise = new Promise((resolve) => {
      exporter.export(exportSpans2, resolve);
    });
    return { stateName: "exporting", promise };
  } else {
    return { stateName: "done" };
  }
}
var { nextState } = stateMachine().state("not_started").state("in_progress").state("trace_complete").state("exporting").state("done").transition("not_started", "in_progress").transition("in_progress", "in_progress").transition("in_progress", "trace_complete").transition("trace_complete", "exporting").transition("trace_complete", "done").transition("exporting", "done").action("startSpan").action("endSpan").action("startExport").action("exportDone").actionHandler("not_started", "startSpan", newTrace).actionHandler("in_progress", "startSpan", newSpan).actionHandler("in_progress", "endSpan", endSpan).actionHandler("trace_complete", "startExport", startExport).actionHandler("exporting", "exportDone", (_c, _a2) => {
  return { stateName: "done" };
}).done();
var BatchTraceSpanProcessor = class {
  constructor(exporter) {
    this.exporter = exporter;
  }
  traceLookup = /* @__PURE__ */ new Map();
  localRootSpanLookup = /* @__PURE__ */ new Map();
  inprogressExports = /* @__PURE__ */ new Map();
  action(localRootSpanId, action2) {
    const state2 = this.traceLookup.get(localRootSpanId) || { stateName: "not_started" };
    const newState = nextState(state2, action2);
    if (newState.stateName === "done") {
      this.traceLookup.delete(localRootSpanId);
    } else {
      this.traceLookup.set(localRootSpanId, newState);
    }
    return newState;
  }
  export(localRootSpanId) {
    const config = getActiveConfig();
    if (!config) throw new Error("Config is undefined. This is a bug in the instrumentation logic");
    const { sampling, postProcessor } = config;
    const exportArgs = { exporter: this.exporter, tailSampler: sampling.tailSampler, postProcessor };
    const newState = this.action(localRootSpanId, { actionName: "startExport", args: exportArgs });
    if (newState.stateName === "exporting") {
      const promise = newState.promise;
      this.inprogressExports.set(localRootSpanId, promise);
      promise.then((result) => {
        if (result.code === ExportResultCode.FAILED) {
          console.log("Error sending spans to exporter:", result.error);
        }
        this.action(localRootSpanId, { actionName: "exportDone" });
        this.inprogressExports.delete(localRootSpanId);
      });
    }
  }
  onStart(span, parentContext) {
    const spanId = span.spanContext().spanId;
    const parentSpanId = trace.getSpan(parentContext)?.spanContext()?.spanId;
    const parentRootSpanId = parentSpanId ? this.localRootSpanLookup.get(parentSpanId) : void 0;
    const localRootSpanId = parentRootSpanId || spanId;
    this.localRootSpanLookup.set(spanId, localRootSpanId);
    this.action(localRootSpanId, { actionName: "startSpan", span });
  }
  onEnd(span) {
    const spanId = span.spanContext().spanId;
    const localRootSpanId = this.localRootSpanLookup.get(spanId);
    if (localRootSpanId) {
      const state2 = this.action(localRootSpanId, { actionName: "endSpan", span });
      if (state2.stateName === "trace_complete") {
        state2.completedSpans.forEach((span2) => {
          this.localRootSpanLookup.delete(span2.spanContext().spanId);
        });
        this.export(localRootSpanId);
      }
    }
  }
  async forceFlush() {
    await Promise.allSettled(this.inprogressExports.values());
  }
  async shutdown() {
  }
};

// src/config.ts
var configSymbol = "Otel Workers Tracing Configuration";
function setConfig(config, ctx = context.active()) {
  return ctx.setValue(configSymbol, config);
}
function getActiveConfig() {
  const config = context.active().getValue(configSymbol);
  return config || void 0;
}
function isSpanExporter(exporterConfig) {
  return !!exporterConfig.export;
}
function isSampler(sampler) {
  return !!sampler.shouldSample;
}
function parseConfig(supplied) {
  if (isSpanProcessorConfig(supplied)) {
    const headSampleConf = supplied.sampling?.headSampler;
    const headSampler = headSampleConf ? isSampler(headSampleConf) ? headSampleConf : createSampler(headSampleConf) : new AlwaysOnSampler();
    const spanProcessors = Array.isArray(supplied.spanProcessors) ? supplied.spanProcessors : [supplied.spanProcessors];
    if (spanProcessors.length === 0) {
      console.log(
        "Warning! You must either specify an exporter or your own SpanProcessor(s)/Exporter combination in the open-telemetry configuration."
      );
    }
    return {
      fetch: {
        includeTraceContext: supplied.fetch?.includeTraceContext ?? true
      },
      handlers: {
        fetch: {
          acceptTraceContext: supplied.handlers?.fetch?.acceptTraceContext ?? true
        }
      },
      postProcessor: supplied.postProcessor || ((spans) => spans),
      sampling: {
        headSampler,
        tailSampler: supplied.sampling?.tailSampler || multiTailSampler([isHeadSampled, isRootErrorSpan])
      },
      service: supplied.service,
      spanProcessors,
      propagator: supplied.propagator || new W3CTraceContextPropagator(),
      instrumentation: {
        instrumentGlobalCache: supplied.instrumentation?.instrumentGlobalCache ?? true,
        instrumentGlobalFetch: supplied.instrumentation?.instrumentGlobalFetch ?? true
      }
    };
  } else {
    const exporter = isSpanExporter(supplied.exporter) ? supplied.exporter : new OTLPExporter(supplied.exporter);
    const spanProcessors = [new BatchTraceSpanProcessor(exporter)];
    const newConfig = Object.assign(supplied, { exporter: void 0, spanProcessors });
    return parseConfig(newConfig);
  }
}

// src/context.ts
import { AsyncLocalStorage } from "node:async_hooks";
import { EventEmitter } from "node:events";
var ADD_LISTENER_METHODS = [
  "addListener",
  "on",
  "once",
  "prependListener",
  "prependOnceListener"
];
var AbstractAsyncHooksContextManager = class {
  /**
   * Binds a the certain context or the active one to the target function and then returns the target
   * @param context A context (span) to be bind to target
   * @param target a function or event emitter. When target or one of its callbacks is called,
   *  the provided context will be used as the active context for the duration of the call.
   */
  bind(context2, target) {
    if (target instanceof EventEmitter) {
      return this._bindEventEmitter(context2, target);
    }
    if (typeof target === "function") {
      return this._bindFunction(context2, target);
    }
    return target;
  }
  _bindFunction(context2, target) {
    const manager = this;
    const contextWrapper = function(...args) {
      return manager.with(context2, () => target.apply(this, args));
    };
    Object.defineProperty(contextWrapper, "length", {
      enumerable: false,
      configurable: true,
      writable: false,
      value: target.length
    });
    return contextWrapper;
  }
  /**
   * By default, EventEmitter call their callback with their context, which we do
   * not want, instead we will bind a specific context to all callbacks that
   * go through it.
   * @param context the context we want to bind
   * @param ee EventEmitter an instance of EventEmitter to patch
   */
  _bindEventEmitter(context2, ee) {
    const map = this._getPatchMap(ee);
    if (map !== void 0) return ee;
    this._createPatchMap(ee);
    ADD_LISTENER_METHODS.forEach((methodName) => {
      if (ee[methodName] === void 0) return;
      ee[methodName] = this._patchAddListener(ee, ee[methodName], context2);
    });
    if (typeof ee.removeListener === "function") {
      ee.removeListener = this._patchRemoveListener(ee, ee.removeListener);
    }
    if (typeof ee.off === "function") {
      ee.off = this._patchRemoveListener(ee, ee.off);
    }
    if (typeof ee.removeAllListeners === "function") {
      ee.removeAllListeners = this._patchRemoveAllListeners(ee, ee.removeAllListeners);
    }
    return ee;
  }
  /**
   * Patch methods that remove a given listener so that we match the "patched"
   * version of that listener (the one that propagate context).
   * @param ee EventEmitter instance
   * @param original reference to the patched method
   */
  _patchRemoveListener(ee, original) {
    const contextManager = this;
    return function(event, listener) {
      const events = contextManager._getPatchMap(ee)?.[event];
      if (events === void 0) {
        return original.call(this, event, listener);
      }
      const patchedListener = events.get(listener);
      return original.call(this, event, patchedListener || listener);
    };
  }
  /**
   * Patch methods that remove all listeners so we remove our
   * internal references for a given event.
   * @param ee EventEmitter instance
   * @param original reference to the patched method
   */
  _patchRemoveAllListeners(ee, original) {
    const contextManager = this;
    return function(event) {
      const map = contextManager._getPatchMap(ee);
      if (map !== void 0) {
        if (arguments.length === 0) {
          contextManager._createPatchMap(ee);
        } else if (map[event] !== void 0) {
          delete map[event];
        }
      }
      return original.apply(this, arguments);
    };
  }
  /**
   * Patch methods on an event emitter instance that can add listeners so we
   * can force them to propagate a given context.
   * @param ee EventEmitter instance
   * @param original reference to the patched method
   * @param [context] context to propagate when calling listeners
   */
  _patchAddListener(ee, original, context2) {
    const contextManager = this;
    return function(event, listener) {
      if (contextManager._wrapped) {
        return original.call(this, event, listener);
      }
      let map = contextManager._getPatchMap(ee);
      if (map === void 0) {
        map = contextManager._createPatchMap(ee);
      }
      let listeners = map[event];
      if (listeners === void 0) {
        listeners = /* @__PURE__ */ new WeakMap();
        map[event] = listeners;
      }
      const patchedListener = contextManager.bind(context2, listener);
      listeners.set(listener, patchedListener);
      contextManager._wrapped = true;
      try {
        return original.call(this, event, patchedListener);
      } finally {
        contextManager._wrapped = false;
      }
    };
  }
  _createPatchMap(ee) {
    const map = /* @__PURE__ */ Object.create(null);
    ee[this._kOtListeners] = map;
    return map;
  }
  _getPatchMap(ee) {
    return ee[this._kOtListeners];
  }
  _kOtListeners = Symbol("OtListeners");
  _wrapped = false;
};
var AsyncLocalStorageContextManager = class extends AbstractAsyncHooksContextManager {
  _asyncLocalStorage;
  constructor() {
    super();
    this._asyncLocalStorage = new AsyncLocalStorage();
  }
  active() {
    return this._asyncLocalStorage.getStore() ?? ROOT_CONTEXT;
  }
  with(context2, fn, thisArg, ...args) {
    const cb = thisArg == null ? fn : fn.bind(thisArg);
    return this._asyncLocalStorage.run(context2, cb, ...args);
  }
  enable() {
    return this;
  }
  disable() {
    this._asyncLocalStorage.disable();
    return this;
  }
};

// src/span.ts
function transformExceptionAttributes(exception) {
  const attributes = {};
  if (typeof exception === "string") {
    attributes[SemanticAttributes.EXCEPTION_MESSAGE] = exception;
  } else {
    if (exception.code) {
      attributes[SemanticAttributes.EXCEPTION_TYPE] = exception.code.toString();
    } else if (exception.name) {
      attributes[SemanticAttributes.EXCEPTION_TYPE] = exception.name;
    }
    if (exception.message) {
      attributes[SemanticAttributes.EXCEPTION_MESSAGE] = exception.message;
    }
    if (exception.stack) {
      attributes[SemanticAttributes.EXCEPTION_STACKTRACE] = exception.stack;
    }
  }
  return attributes;
}
function millisToHr(millis) {
  return [Math.trunc(millis / 1e3), millis % 1e3 * 1e6];
}
function getHrTime(input) {
  const now = Date.now();
  if (!input) {
    return millisToHr(now);
  } else if (input instanceof Date) {
    return millisToHr(input.getTime());
  } else if (typeof input === "number") {
    return millisToHr(input);
  } else if (Array.isArray(input)) {
    return input;
  }
  const v = input;
  throw new Error(`unreachable value: ${JSON.stringify(v)}`);
}
var SpanImpl = class {
  name;
  _spanContext;
  onEnd;
  parentSpanId;
  kind;
  attributes;
  status = {
    code: SpanStatusCode.UNSET
  };
  endTime = [0, 0];
  _duration = [0, 0];
  startTime;
  events = [];
  links;
  resource;
  instrumentationLibrary = { name: "@firmly/otel-cf-workers" };
  _ended = false;
  _droppedAttributesCount = 0;
  _droppedEventsCount = 0;
  _droppedLinksCount = 0;
  constructor(init2) {
    this.name = init2.name;
    this._spanContext = init2.spanContext;
    this.parentSpanId = init2.parentSpanId;
    this.kind = init2.spanKind || SpanKind.INTERNAL;
    this.attributes = sanitizeAttributes(init2.attributes);
    this.startTime = getHrTime(init2.startTime);
    this.links = init2.links || [];
    this.resource = init2.resource;
    this.onEnd = init2.onEnd;
  }
  addLink(link) {
    this.links.push(link);
    return this;
  }
  addLinks(links) {
    this.links.push(...links);
    return this;
  }
  spanContext() {
    return this._spanContext;
  }
  setAttribute(key, value) {
    if (isAttributeKey(key) && isAttributeValue(value)) {
      this.attributes[key] = value;
    }
    return this;
  }
  setAttributes(attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      this.setAttribute(key, value);
    }
    return this;
  }
  addEvent(name, attributesOrStartTime, startTime) {
    if (isTimeInput(attributesOrStartTime)) {
      startTime = attributesOrStartTime;
      attributesOrStartTime = void 0;
    }
    const attributes = sanitizeAttributes(attributesOrStartTime);
    const time = getHrTime(startTime);
    this.events.push({ name, attributes, time });
    return this;
  }
  setStatus(status) {
    this.status = status;
    return this;
  }
  updateName(name) {
    this.name = name;
    return this;
  }
  end(endTime) {
    if (this._ended) {
      return;
    }
    this._ended = true;
    this.endTime = getHrTime(endTime);
    this._duration = hrTimeDuration(this.startTime, this.endTime);
    this.onEnd(this);
  }
  isRecording() {
    return !this._ended;
  }
  recordException(exception, time) {
    const attributes = transformExceptionAttributes(exception);
    this.addEvent("exception", attributes, time);
  }
  get duration() {
    return this._duration;
  }
  get ended() {
    return this._ended;
  }
  get droppedAttributesCount() {
    return this._droppedAttributesCount;
  }
  get droppedEventsCount() {
    return this._droppedEventsCount;
  }
  get droppedLinksCount() {
    return this._droppedLinksCount;
  }
};

// src/tracer.ts
var withNextSpanAttributes;
var WorkerTracer = class {
  _spanProcessors;
  resource;
  idGenerator = new RandomIdGenerator2();
  constructor(spanProcessors, resource) {
    this._spanProcessors = spanProcessors;
    this.resource = resource;
  }
  get spanProcessors() {
    return this._spanProcessors;
  }
  addToResource(extra) {
    this.resource.merge(extra);
  }
  startSpan(name, options = {}, context2 = context.active()) {
    if (options.root) {
      context2 = trace.deleteSpan(context2);
    }
    const parentSpan = trace.getSpan(context2);
    const parentSpanContext = parentSpan?.spanContext();
    const hasParentContext = parentSpanContext && trace.isSpanContextValid(parentSpanContext);
    const traceId = hasParentContext ? parentSpanContext.traceId : this.idGenerator.generateTraceId();
    const spanKind = options.kind || SpanKind.INTERNAL;
    const sanitisedAttrs = sanitizeAttributes(options.attributes);
    const config = getActiveConfig();
    if (!config) throw new Error("Config is undefined. This is a bug in the instrumentation logic");
    const sampler = config.sampling.headSampler;
    const samplingDecision = sampler.shouldSample(context2, traceId, name, spanKind, sanitisedAttrs, []);
    const { decision, traceState, attributes: attrs } = samplingDecision;
    const attributes = Object.assign({}, sanitisedAttrs, attrs, withNextSpanAttributes);
    withNextSpanAttributes = {};
    const spanId = this.idGenerator.generateSpanId();
    const parentSpanId = hasParentContext ? parentSpanContext.spanId : void 0;
    const traceFlags = decision === SamplingDecision.RECORD_AND_SAMPLED ? TraceFlags.SAMPLED : TraceFlags.NONE;
    const spanContext = { traceId, spanId, traceFlags, traceState };
    const span = new SpanImpl({
      attributes,
      name,
      onEnd: (span2) => {
        this.spanProcessors.forEach((sp) => {
          sp.onEnd(span2);
        });
      },
      resource: this.resource,
      spanContext,
      parentSpanId,
      spanKind,
      startTime: options.startTime
    });
    this.spanProcessors.forEach((sp) => {
      sp.onStart(span, context2);
    });
    return span;
  }
  startActiveSpan(name, ...args) {
    const options = args.length > 1 ? args[0] : void 0;
    const parentContext = args.length > 2 ? args[1] : context.active();
    const fn = args[args.length - 1];
    const span = this.startSpan(name, options, parentContext);
    const contextWithSpanSet = trace.setSpan(parentContext, span);
    return context.with(contextWithSpanSet, fn, void 0, span);
  }
};
function withNextSpan(attrs) {
  withNextSpanAttributes = Object.assign({}, withNextSpanAttributes, attrs);
}

// src/provider.ts
var WorkerTracerProvider = class {
  spanProcessors;
  resource;
  tracers = {};
  constructor(spanProcessors, resource) {
    this.spanProcessors = spanProcessors;
    this.resource = resource;
  }
  getTracer(name, version, options) {
    const key = `${name}@${version || ""}:${options?.schemaUrl || ""}`;
    if (!this.tracers[key]) {
      this.tracers[key] = new WorkerTracer(this.spanProcessors, this.resource);
    }
    return this.tracers[key];
  }
  register() {
    trace.setGlobalTracerProvider(this);
    context.setGlobalContextManager(new AsyncLocalStorageContextManager());
  }
};

// src/instrumentation/common.ts
var PromiseTracker = class {
  _outstandingPromises = [];
  get outstandingPromiseCount() {
    return this._outstandingPromises.length;
  }
  track(promise) {
    this._outstandingPromises.push(promise);
  }
  async wait() {
    await allSettledMutable(this._outstandingPromises);
  }
};
function createWaitUntil(fn, context2, tracker) {
  const handler = {
    apply(target, _thisArg, argArray) {
      tracker.track(argArray[0]);
      return Reflect.apply(target, context2, argArray);
    }
  };
  return wrap(fn, handler);
}
function proxyExecutionContext(context2) {
  const tracker = new PromiseTracker();
  const ctx = new Proxy(context2, {
    get(target, prop) {
      if (prop === "waitUntil") {
        const fn = Reflect.get(target, prop);
        return createWaitUntil(fn, context2, tracker);
      } else {
        return passthroughGet(target, prop);
      }
    }
  });
  return { ctx, tracker };
}
async function exportSpans(tracker) {
  const tracer2 = trace.getTracer("export");
  if (tracer2 instanceof WorkerTracer) {
    await scheduler.wait(1);
    if (tracker) {
      await tracker.wait();
    }
    const promises = tracer2.spanProcessors.map(async (spanProcessor) => {
      await spanProcessor.forceFlush();
    });
    await Promise.allSettled(promises);
  } else {
    console.error("The global tracer is not of type WorkerTracer and can not export spans");
  }
}
async function allSettledMutable(promises) {
  let values;
  do {
    values = await Promise.allSettled(promises);
  } while (values.length !== promises.length);
  return values;
}

// src/instrumentation/do-storage.ts
var dbSystem = "Cloudflare DO";
function isDurableObjectCommonOptions(options) {
  return typeof options === "object" && ("allowConcurrency" in options || "allowUnconfirmed" in options || "noCache" in options);
}
function applyOptionsAttributes(attrs, options) {
  if ("allowConcurrency" in options) {
    attrs["db.cf.do.allow_concurrency"] = options.allowConcurrency;
  }
  if ("allowUnconfirmed" in options) {
    attrs["db.cf.do.allow_unconfirmed"] = options.allowUnconfirmed;
  }
  if ("noCache" in options) {
    attrs["db.cf.do.no_cache"] = options.noCache;
  }
}
var StorageAttributes = {
  delete(argArray, result) {
    const args = argArray;
    let attrs = {};
    if (Array.isArray(args[0])) {
      const keys = args[0];
      attrs = {
        // todo: Maybe set db.cf.do.keys to the whole array here?
        "db.cf.do.key": keys[0],
        "db.cf.do.number_of_keys": keys.length,
        "db.cf.do.keys_deleted": result
      };
    } else {
      attrs = {
        "db.cf.do.key": args[0],
        "db.cf.do.success": result
      };
    }
    if (args[1]) {
      applyOptionsAttributes(attrs, args[1]);
    }
    return attrs;
  },
  deleteAll(argArray) {
    const args = argArray;
    let attrs = {};
    if (args[0]) {
      applyOptionsAttributes(attrs, args[0]);
    }
    return attrs;
  },
  get(argArray) {
    const args = argArray;
    let attrs = {};
    if (Array.isArray(args[0])) {
      const keys = args[0];
      attrs = {
        // todo: Maybe set db.cf.do.keys to the whole array here?
        "db.cf.do.key": keys[0],
        "db.cf.do.number_of_keys": keys.length
      };
    } else {
      attrs = {
        "db.cf.do.key": args[0]
      };
    }
    if (args[1]) {
      applyOptionsAttributes(attrs, args[1]);
    }
    return attrs;
  },
  list(argArray, result) {
    const args = argArray;
    const attrs = {
      "db.cf.do.number_of_results": result.size
    };
    if (args[0]) {
      const options = args[0];
      applyOptionsAttributes(attrs, options);
      if ("start" in options) {
        attrs["db.cf.do.start"] = options.start;
      }
      if ("startAfter" in options) {
        attrs["db.cf.do.start_after"] = options.startAfter;
      }
      if ("end" in options) {
        attrs["db.cf.do.end"] = options.end;
      }
      if ("prefix" in options) {
        attrs["db.cf.do.prefix"] = options.prefix;
      }
      if ("reverse" in options) {
        attrs["db.cf.do.reverse"] = options.reverse;
      }
      if ("limit" in options) {
        attrs["db.cf.do.limit"] = options.limit;
      }
    }
    return attrs;
  },
  put(argArray) {
    const args = argArray;
    const attrs = {};
    if (typeof args[0] === "string") {
      attrs["db.cf.do.key"] = args[0];
      if (args[2]) {
        applyOptionsAttributes(attrs, args[2]);
      }
    } else {
      const keys = Object.keys(args[0]);
      attrs["db.cf.do.key"] = keys[0];
      attrs["db.cf.do.number_of_keys"] = keys.length;
      if (isDurableObjectCommonOptions(args[1])) {
        applyOptionsAttributes(attrs, args[1]);
      }
    }
    return attrs;
  },
  getAlarm(argArray) {
    const args = argArray;
    const attrs = {};
    if (args[0]) {
      applyOptionsAttributes(attrs, args[0]);
    }
    return attrs;
  },
  setAlarm(argArray) {
    const args = argArray;
    const attrs = {};
    if (args[0] instanceof Date) {
      attrs["db.cf.do.alarm_time"] = args[0].getTime();
    } else {
      attrs["db.cf.do.alarm_time"] = args[0];
    }
    if (args[1]) {
      applyOptionsAttributes(attrs, args[1]);
    }
    return attrs;
  },
  deleteAlarm(argArray) {
    const args = argArray;
    const attrs = {};
    if (args[0]) {
      applyOptionsAttributes(attrs, args[0]);
    }
    return attrs;
  }
};
function instrumentStorageFn(fn, operation) {
  const tracer2 = trace.getTracer("do_storage");
  const fnHandler = {
    apply: (target, thisArg, argArray) => {
      const attributes = {
        [SemanticAttributes.DB_SYSTEM]: dbSystem,
        [SemanticAttributes.DB_OPERATION]: operation,
        [SemanticAttributes.DB_STATEMENT]: `${operation} ${argArray[0]}`
      };
      const options = {
        kind: SpanKind.CLIENT,
        attributes: {
          ...attributes,
          operation
        }
      };
      return tracer2.startActiveSpan(`Durable Object Storage ${operation}`, options, async (span) => {
        const result = await Reflect.apply(target, thisArg, argArray);
        const extraAttrsFn = StorageAttributes[operation];
        const extraAttrs = extraAttrsFn ? extraAttrsFn(argArray, result) : {};
        span.setAttributes(extraAttrs);
        span.setAttribute("db.cf.do.has_result", !!result);
        span.end();
        return result;
      });
    }
  };
  return wrap(fn, fnHandler);
}
function instrumentStorage(storage) {
  const storageHandler = {
    get: (target, prop, receiver) => {
      const operation = String(prop);
      const fn = Reflect.get(target, prop, receiver);
      return instrumentStorageFn(fn, operation);
    }
  };
  return wrap(storage, storageHandler);
}

// src/instrumentation/do.ts
function instrumentBindingStub(stub, nsName) {
  const stubHandler = {
    get(target, prop) {
      if (prop === "fetch") {
        const fetcher = Reflect.get(target, prop);
        const attrs = {
          name: `Durable Object ${nsName}`,
          "do.namespace": nsName,
          "do.id": target.id.toString(),
          "do.id.name": target.id.name
        };
        return instrumentClientFetch(fetcher, () => ({ includeTraceContext: true }), attrs);
      } else {
        return passthroughGet(target, prop);
      }
    }
  };
  return wrap(stub, stubHandler);
}
function instrumentBindingGet(getFn, nsName) {
  const getHandler = {
    apply(target, thisArg, argArray) {
      const stub = Reflect.apply(target, thisArg, argArray);
      return instrumentBindingStub(stub, nsName);
    }
  };
  return wrap(getFn, getHandler);
}
function instrumentDOBinding(ns, nsName) {
  const nsHandler = {
    get(target, prop) {
      if (prop === "get") {
        const fn = Reflect.get(ns, prop);
        return instrumentBindingGet(fn, nsName);
      } else {
        return passthroughGet(target, prop);
      }
    }
  };
  return wrap(ns, nsHandler);
}
function instrumentState(state2) {
  const stateHandler = {
    get(target, prop, receiver) {
      const result = Reflect.get(target, prop, unwrap(receiver));
      if (prop === "storage") {
        return instrumentStorage(result);
      } else if (typeof result === "function") {
        return result.bind(target);
      } else {
        return result;
      }
    }
  };
  return wrap(state2, stateHandler);
}
var cold_start = true;
function executeDOFetch(fetchFn, request, id) {
  const spanContext = getParentContextFromHeaders(request.headers);
  const tracer2 = trace.getTracer("DO fetchHandler");
  const attributes = {
    [SemanticAttributes.FAAS_TRIGGER]: "http",
    [SemanticAttributes.FAAS_COLDSTART]: cold_start
  };
  cold_start = false;
  Object.assign(attributes, gatherRequestAttributes(request));
  Object.assign(attributes, gatherIncomingCfAttributes(request));
  const options = {
    attributes,
    kind: SpanKind.SERVER
  };
  const name = id.name || "";
  const promise = tracer2.startActiveSpan(`Durable Object Fetch ${name}`, options, spanContext, async (span) => {
    try {
      const response = await fetchFn(request);
      if (response.ok) {
        span.setStatus({ code: SpanStatusCode.OK });
      }
      span.setAttributes(gatherResponseAttributes(response));
      span.end();
      return response;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      span.end();
      throw error;
    }
  });
  return promise;
}
function executeDOAlarm(alarmFn, id) {
  const tracer2 = trace.getTracer("DO alarmHandler");
  const name = id.name || "";
  const promise = tracer2.startActiveSpan(`Durable Object Alarm ${name}`, async (span) => {
    span.setAttribute(SemanticAttributes.FAAS_COLDSTART, cold_start);
    cold_start = false;
    span.setAttribute("do.id", id.toString());
    if (id.name) span.setAttribute("do.name", id.name);
    try {
      await alarmFn();
      span.end();
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      span.end();
      throw error;
    }
  });
  return promise;
}
function instrumentFetchFn(fetchFn, initialiser, env, id) {
  const fetchHandler = {
    async apply(target, thisArg, argArray) {
      const request = argArray[0];
      const config = initialiser(env, request);
      const context2 = setConfig(config);
      try {
        const bound = target.bind(unwrap(thisArg));
        return await context.with(context2, executeDOFetch, void 0, bound, request, id);
      } catch (error) {
        throw error;
      } finally {
        exportSpans();
      }
    }
  };
  return wrap(fetchFn, fetchHandler);
}
function instrumentAlarmFn(alarmFn, initialiser, env, id) {
  if (!alarmFn) return void 0;
  const alarmHandler = {
    async apply(target, thisArg) {
      const config = initialiser(env, "do-alarm");
      const context2 = setConfig(config);
      try {
        const bound = target.bind(unwrap(thisArg));
        return await context.with(context2, executeDOAlarm, void 0, bound, id);
      } catch (error) {
        throw error;
      } finally {
        exportSpans();
      }
    }
  };
  return wrap(alarmFn, alarmHandler);
}
function instrumentDurableObject(doObj, initialiser, env, state2) {
  const objHandler = {
    get(target, prop) {
      if (prop === "fetch") {
        const fetchFn = Reflect.get(target, prop);
        return instrumentFetchFn(fetchFn, initialiser, env, state2.id);
      } else if (prop === "alarm") {
        const alarmFn = Reflect.get(target, prop);
        return instrumentAlarmFn(alarmFn, initialiser, env, state2.id);
      } else {
        const result = Reflect.get(target, prop);
        if (typeof result === "function") {
          result.bind(doObj);
        }
        return result;
      }
    }
  };
  return wrap(doObj, objHandler);
}
function instrumentDOClass(doClass, initialiser) {
  const classHandler = {
    construct(target, [orig_state, orig_env]) {
      const trigger = {
        id: orig_state.id.toString(),
        name: orig_state.id.name
      };
      const constructorConfig = initialiser(orig_env, trigger);
      const context2 = setConfig(constructorConfig);
      const state2 = instrumentState(orig_state);
      const env = instrumentEnv(orig_env);
      const createDO = () => {
        return new target(state2, env);
      };
      const doObj = context.with(context2, createDO);
      return instrumentDurableObject(doObj, initialiser, env, state2);
    }
  };
  return wrap(doClass, classHandler);
}

// src/instrumentation/kv.ts
var dbSystem2 = "Cloudflare KV";
var KVAttributes = {
  delete(_argArray) {
    return {};
  },
  get(argArray) {
    const attrs = {};
    const opts = argArray[1];
    if (typeof opts === "string") {
      attrs["db.cf.kv.type"] = opts;
    } else if (typeof opts === "object") {
      attrs["db.cf.kv.type"] = opts.type;
      attrs["db.cf.kv.cache_ttl"] = opts.cacheTtl;
    }
    return attrs;
  },
  getWithMetadata(argArray, result) {
    const attrs = {};
    const opts = argArray[1];
    if (typeof opts === "string") {
      attrs["db.cf.kv.type"] = opts;
    } else if (typeof opts === "object") {
      attrs["db.cf.kv.type"] = opts.type;
      attrs["db.cf.kv.cache_ttl"] = opts.cacheTtl;
    }
    attrs["db.cf.kv.metadata"] = true;
    const { cacheStatus } = result;
    if (typeof cacheStatus === "string") {
      attrs["db.cf.kv.cache_status"] = cacheStatus;
    }
    return attrs;
  },
  list(argArray, result) {
    const attrs = {};
    const opts = argArray[0] || {};
    const { cursor, limit } = opts;
    attrs["db.cf.kv.list_request_cursor"] = cursor || void 0;
    attrs["db.cf.kv.list_limit"] = limit || void 0;
    const { list_complete, cacheStatus } = result;
    attrs["db.cf.kv.list_complete"] = list_complete || void 0;
    if (!list_complete) {
      attrs["db.cf.kv.list_response_cursor"] = cursor || void 0;
    }
    if (typeof cacheStatus === "string") {
      attrs["db.cf.kv.cache_status"] = cacheStatus;
    }
    return attrs;
  },
  put(argArray) {
    const attrs = {};
    if (argArray.length > 2 && argArray[2]) {
      const { expiration, expirationTtl, metadata } = argArray[2];
      attrs["db.cf.kv.expiration"] = expiration;
      attrs["db.cf.kv.expiration_ttl"] = expirationTtl;
      attrs["db.cf.kv.metadata"] = !!metadata;
    }
    return attrs;
  }
};
function instrumentKVFn(fn, name, operation) {
  const tracer2 = trace.getTracer("KV");
  const fnHandler = {
    apply: (target, thisArg, argArray) => {
      const attributes = {
        binding_type: "KV",
        [SemanticAttributes.DB_NAME]: name,
        [SemanticAttributes.DB_SYSTEM]: dbSystem2,
        [SemanticAttributes.DB_OPERATION]: operation
      };
      const options = {
        kind: SpanKind.CLIENT,
        attributes
      };
      return tracer2.startActiveSpan(`KV ${name} ${operation}`, options, async (span) => {
        const result = await Reflect.apply(target, thisArg, argArray);
        const extraAttrsFn = KVAttributes[operation];
        const extraAttrs = extraAttrsFn ? extraAttrsFn(argArray, result) : {};
        span.setAttributes(extraAttrs);
        if (operation === "list") {
          const opts = argArray[0] || {};
          const { prefix } = opts;
          span.setAttribute(SemanticAttributes.DB_STATEMENT, `${operation} ${prefix || void 0}`);
        } else {
          span.setAttribute(SemanticAttributes.DB_STATEMENT, `${operation} ${argArray[0]}`);
          span.setAttribute("db.cf.kv.key", argArray[0]);
        }
        if (operation === "getWithMetadata") {
          const hasResults = !!result && !!result.value;
          span.setAttribute("db.cf.kv.has_result", hasResults);
        } else {
          span.setAttribute("db.cf.kv.has_result", !!result);
        }
        span.end();
        return result;
      });
    }
  };
  return wrap(fn, fnHandler);
}
function instrumentKV(kv, name) {
  const kvHandler = {
    get: (target, prop, receiver) => {
      const operation = String(prop);
      const fn = Reflect.get(target, prop, receiver);
      return instrumentKVFn(fn, name, operation);
    }
  };
  return wrap(kv, kvHandler);
}

// src/instrumentation/version.ts
function versionAttributes(env) {
  const attributes = {};
  if (typeof env === "object" && env !== null) {
    for (const [binding, data] of Object.entries(env)) {
      if (isVersionMetadata(data)) {
        attributes["cf.workers_version_metadata.binding"] = binding;
        attributes["cf.workers_version_metadata.id"] = data.id;
        attributes["cf.workers_version_metadata.tag"] = data.tag;
        break;
      }
    }
  }
  return attributes;
}

// src/instrumentation/queue.ts
var traceIdSymbol = Symbol("traceId");
var MessageStatusCount = class {
  succeeded = 0;
  failed = 0;
  total;
  constructor(total) {
    this.total = total;
  }
  ack() {
    this.succeeded = this.succeeded + 1;
  }
  ackRemaining() {
    this.succeeded = this.total - this.failed;
  }
  retry() {
    this.failed = this.failed + 1;
  }
  retryRemaining() {
    this.failed = this.total - this.succeeded;
  }
  toAttributes() {
    return {
      "queue.messages_count": this.total,
      "queue.messages_success": this.succeeded,
      "queue.messages_failed": this.failed,
      "queue.batch_success": this.succeeded === this.total
    };
  }
};
var addEvent = (name, msg) => {
  const attrs = {};
  if (msg) {
    attrs["queue.message_id"] = msg.id;
    attrs["queue.message_timestamp"] = msg.timestamp.toISOString();
  }
  trace.getActiveSpan()?.addEvent(name, attrs);
};
var proxyQueueMessage = (msg, count) => {
  const msgHandler = {
    get: (target, prop) => {
      if (prop === "ack") {
        const ackFn = Reflect.get(target, prop);
        return new Proxy(ackFn, {
          apply: (fnTarget) => {
            addEvent("messageAck", msg);
            count.ack();
            Reflect.apply(fnTarget, msg, []);
          }
        });
      } else if (prop === "retry") {
        const retryFn = Reflect.get(target, prop);
        return new Proxy(retryFn, {
          apply: (fnTarget) => {
            addEvent("messageRetry", msg);
            count.retry();
            const result = Reflect.apply(fnTarget, msg, []);
            return result;
          }
        });
      } else {
        return Reflect.get(target, prop, msg);
      }
    }
  };
  return wrap(msg, msgHandler);
};
var proxyMessageBatch = (batch, count) => {
  const batchHandler = {
    get: (target, prop) => {
      if (prop === "messages") {
        const messages = Reflect.get(target, prop);
        const messagesHandler = {
          get: (target2, prop2) => {
            if (typeof prop2 === "string" && !isNaN(parseInt(prop2))) {
              const message = Reflect.get(target2, prop2);
              return proxyQueueMessage(message, count);
            } else {
              return Reflect.get(target2, prop2);
            }
          }
        };
        return wrap(messages, messagesHandler);
      } else if (prop === "ackAll") {
        const ackFn = Reflect.get(target, prop);
        return new Proxy(ackFn, {
          apply: (fnTarget) => {
            addEvent("ackAll");
            count.ackRemaining();
            Reflect.apply(fnTarget, batch, []);
          }
        });
      } else if (prop === "retryAll") {
        const retryFn = Reflect.get(target, prop);
        return new Proxy(retryFn, {
          apply: (fnTarget) => {
            addEvent("retryAll");
            count.retryRemaining();
            Reflect.apply(fnTarget, batch, []);
          }
        });
      }
      return Reflect.get(target, prop);
    }
  };
  return wrap(batch, batchHandler);
};
function executeQueueHandler(queueFn, [batch, env, ctx]) {
  const count = new MessageStatusCount(batch.messages.length);
  batch = proxyMessageBatch(batch, count);
  const tracer2 = trace.getTracer("queueHandler");
  const options = {
    attributes: {
      [SemanticAttributes.FAAS_TRIGGER]: "pubsub",
      "queue.name": batch.queue
    },
    kind: SpanKind.CONSUMER
  };
  Object.assign(options.attributes, versionAttributes(env));
  const promise = tracer2.startActiveSpan(`queueHandler ${batch.queue}`, options, async (span) => {
    const traceId = span.spanContext().traceId;
    context.active().setValue(traceIdSymbol, traceId);
    try {
      const result = await queueFn(batch, env, ctx);
      span.setAttribute("queue.implicitly_acked", count.total - count.succeeded - count.failed);
      count.ackRemaining();
      span.setAttributes(count.toAttributes());
      span.end();
      return result;
    } catch (error) {
      span.recordException(error);
      span.setAttribute("queue.implicitly_retried", count.total - count.succeeded - count.failed);
      count.retryRemaining();
      span.end();
      throw error;
    }
  });
  return promise;
}
function createQueueHandler(queueFn, initialiser) {
  const queueHandler = {
    async apply(target, _thisArg, argArray) {
      const [batch, orig_env, orig_ctx] = argArray;
      const config = initialiser(orig_env, batch);
      const env = instrumentEnv(orig_env);
      const { ctx, tracker } = proxyExecutionContext(orig_ctx);
      const context2 = setConfig(config);
      try {
        const args = [batch, env, ctx];
        return await context.with(context2, executeQueueHandler, void 0, target, args);
      } catch (error) {
        throw error;
      } finally {
        orig_ctx.waitUntil(exportSpans(tracker));
      }
    }
  };
  return wrap(queueFn, queueHandler);
}
function instrumentQueueSend(fn, name) {
  const tracer2 = trace.getTracer("queueSender");
  const handler = {
    apply: (target, thisArg, argArray) => {
      return tracer2.startActiveSpan(`Queues ${name} send`, async (span) => {
        span.setAttribute("queue.operation", "send");
        await Reflect.apply(target, unwrap(thisArg), argArray);
        span.end();
      });
    }
  };
  return wrap(fn, handler);
}
function instrumentQueueSendBatch(fn, name) {
  const tracer2 = trace.getTracer("queueSender");
  const handler = {
    apply: (target, thisArg, argArray) => {
      return tracer2.startActiveSpan(`Queues ${name} sendBatch`, async (span) => {
        span.setAttribute("queue.operation", "sendBatch");
        await Reflect.apply(target, unwrap(thisArg), argArray);
        span.end();
      });
    }
  };
  return wrap(fn, handler);
}
function instrumentQueueSender(queue, name) {
  const queueHandler = {
    get: (target, prop) => {
      if (prop === "send") {
        const sendFn = Reflect.get(target, prop);
        return instrumentQueueSend(sendFn, name);
      } else if (prop === "sendBatch") {
        const sendFn = Reflect.get(target, prop);
        return instrumentQueueSendBatch(sendFn, name);
      } else {
        return Reflect.get(target, prop);
      }
    }
  };
  return wrap(queue, queueHandler);
}

// src/instrumentation/workflow.ts
function addTraceHeadersToWorkflowEvent(data) {
  const ctx = context.active();
  let headers = {};
  propagation.inject(ctx, headers);
  let params = data.params || {};
  data.params = {
    id: data.id,
    ...params,
    __otel_request: {
      ...params.__otel_request || {},
      headers: {
        ...params.__otel_request?.headers || {},
        ...headers
      }
    }
  };
  return data;
}
function getParentContextFromHeaders2(headers) {
  if (headers instanceof Map) {
    return propagation.extract(context.active(), headers, {
      get(headers2, key) {
        return headers2.get(key) || void 0;
      },
      keys(headers2) {
        return [...headers2.keys()];
      }
    });
  } else {
    return propagation.extract(context.active(), headers, {
      get(headers2, key) {
        return headers2[key] || void 0;
      },
      keys(headers2) {
        return [...Object.keys(headers2)];
      }
    });
  }
}
function getParentContextFromRequest(request) {
  const workerConfig = getActiveConfig();
  if (workerConfig === void 0) {
    return context.active();
  }
  const acceptTraceContext = typeof workerConfig.handlers.fetch.acceptTraceContext === "function" ? workerConfig.handlers.fetch.acceptTraceContext(request) : workerConfig.handlers.fetch.acceptTraceContext ?? true;
  return acceptTraceContext ? getParentContextFromHeaders2(request?.headers) : context.active();
}
function instrumentWorkflowStep(step, activeContext) {
  const stepHandler = {
    get(target, prop) {
      const method = Reflect.get(target, prop);
      if (typeof method !== "function") {
        return method;
      }
      return new Proxy(method, {
        apply: async (fn, thisArg, args) => {
          const [name, ...restArgs] = args;
          const tracer2 = trace.getTracer("Workflow");
          switch (prop) {
            case "do":
              return tracer2.startActiveSpan(`Workflow Step ${name}`, {
                attributes: {
                  "workflow.step": "do",
                  "workflow.step.do.name": name
                },
                kind: SpanKind.INTERNAL
              }, activeContext, async (span) => {
                let ctx = context.active();
                try {
                  if (typeof args[args.length - 1] === "function") {
                    const originalCallback = args[args.length - 1];
                    args[args.length - 1] = async (...callbackArgs) => {
                      return context.with(ctx, () => originalCallback(...callbackArgs));
                    };
                  }
                  const result = await Reflect.apply(fn, thisArg, args);
                  span.setStatus({ code: SpanStatusCode.OK });
                  return result;
                } catch (error) {
                  span.recordException(error);
                  span.setStatus({ code: SpanStatusCode.ERROR });
                  throw error;
                } finally {
                  span.end();
                }
              });
            case "sleep":
              return tracer2.startActiveSpan(`Workflow Step sleep`, {
                attributes: {
                  "workflow.step": "sleep",
                  "workflow.step.sleep.name": name,
                  "workflow.step.sleep.duration": restArgs[0]
                },
                kind: SpanKind.INTERNAL
              }, activeContext, async (span) => {
                try {
                  await Reflect.apply(fn, thisArg, args);
                  span.setStatus({ code: SpanStatusCode.OK });
                } catch (error) {
                  span.recordException(error);
                  span.setStatus({ code: SpanStatusCode.ERROR });
                  throw error;
                } finally {
                  span.end();
                  exportSpans();
                }
              });
            case "sleepUntil":
              return tracer2.startActiveSpan(`Workflow Step sleepUntil`, {
                attributes: {
                  "workflow.step": "sleepUntil",
                  "workflow.step.sleep_until.name": name,
                  "workflow.step.sleep_until.timestamp": restArgs[0].toString()
                },
                kind: SpanKind.INTERNAL
              }, activeContext, async (span) => {
                try {
                  await Reflect.apply(fn, thisArg, args);
                  span.setStatus({ code: SpanStatusCode.OK });
                } catch (error) {
                  span.recordException(error);
                  span.setStatus({ code: SpanStatusCode.ERROR });
                  throw error;
                } finally {
                  span.end();
                }
              });
            default:
              return Reflect.apply(fn, thisArg, args);
          }
        }
      });
    }
  };
  return wrap(step, stepHandler);
}
function instrumentWorkflowRun(runFn, initialiser, env, ctx) {
  const runHandler = {
    async apply(target, thisArg, [event, step]) {
      const config = initialiser(env);
      const context2 = setConfig(config);
      let name = event?.payload?.name || "Unknown";
      return context.with(context2, async () => {
        const tracer2 = trace.getTracer("Workflow");
        let otelPropogationRequest = event?.payload?.__otel_request;
        let activeContext = context.active();
        if (otelPropogationRequest) {
          activeContext = getParentContextFromRequest(otelPropogationRequest);
        }
        return tracer2.startActiveSpan(`Workflow Run ${name}`, {
          attributes: {
            "workflow.operation": "run",
            "workflow.id": event?.id || event?.payload?.id,
            "workflow.run.name": name
          },
          kind: SpanKind.CONSUMER
        }, activeContext, async (span) => {
          try {
            const bound = target.bind(thisArg);
            const instrumentedStep = instrumentWorkflowStep(step, context.active());
            const result = await bound(event, instrumentedStep);
            span.setStatus({ code: SpanStatusCode.OK });
            return result;
          } catch (error) {
            span.recordException(error);
            span.setStatus({ code: SpanStatusCode.ERROR });
            throw error;
          } finally {
            span.end();
            exportSpans();
          }
        });
      });
    }
  };
  return wrap(runFn, runHandler);
}
function instrumentWorkflowCreate(createFn, attrs) {
  const createHandler = {
    async apply(target, thisArg, [data]) {
      const tracer2 = trace.getTracer("Workflow");
      let name = attrs?.["name"] || "Unknown";
      return tracer2.startActiveSpan(`Workflow Create ${name}`, {
        attributes: {
          "workflow.create.name": data.params?.name,
          "workflow.operation": "create",
          "workflow.id": data?.id
        },
        kind: SpanKind.CLIENT
      }, async (span) => {
        try {
          const result = await Reflect.apply(
            target,
            thisArg,
            [addTraceHeadersToWorkflowEvent(data)]
          );
          span.setStatus({ code: SpanStatusCode.OK });
          return result;
        } catch (error) {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR });
          throw error;
        } finally {
          span.end();
          exportSpans();
        }
      });
    }
  };
  return wrap(createFn, createHandler);
}
function instrumentWorkflowInstance(workflowObj, initialiser, env, ctx) {
  const objHandler = {
    get(target, prop) {
      if (prop === "run") {
        const runFn = Reflect.get(target, prop);
        return instrumentWorkflowRun(runFn, initialiser, env, ctx);
      } else {
        const result = Reflect.get(target, prop);
        if (typeof result === "function") {
          result.bind(workflowObj);
        }
        return result;
      }
    }
  };
  return wrap(workflowObj, objHandler);
}
function instrumentWorkflowBinding(workflowObj, attrs) {
  const objHandler = {
    get(target, prop) {
      const method = Reflect.get(target, prop);
      if (typeof method !== "function") {
        return method;
      }
      return new Proxy(method, {
        apply: async (fn, thisArg, args) => {
          switch (prop) {
            case "create":
              const createHandler = instrumentWorkflowCreate(fn, attrs);
              return Reflect.apply(createHandler, thisArg, args);
            default:
              return Reflect.apply(fn, thisArg, args);
          }
        }
      });
    }
  };
  return wrap(workflowObj, objHandler);
}
function instrumentWorkflow(WorkflowClass, initialiser) {
  const classHandler = {
    construct(target, [orig_ctx, orig_env]) {
      const constructorConfig = initialiser(orig_env);
      const context2 = setConfig(constructorConfig);
      const env = instrumentEnv(orig_env);
      const createWorkflow = () => {
        return new target(orig_ctx, env);
      };
      const workflowObj = context.with(context2, createWorkflow);
      return instrumentWorkflowInstance(workflowObj, initialiser, env, orig_ctx);
    }
  };
  return wrap(WorkflowClass, classHandler);
}

// src/instrumentation/service.ts
function instrumentServiceBinding(fetcher, envName) {
  const fetcherHandler = {
    get(target, prop) {
      const method = Reflect.get(target, prop);
      if (prop === "fetch") {
        const attrs = {
          name: `Service Binding ${envName}`
        };
        return instrumentClientFetch(method, () => ({ includeTraceContext: true }), attrs);
      } else if (prop === "create") {
        return new Proxy(method, {
          apply: async (fn, thisArg, args) => {
            switch (prop) {
              case "create":
                const createHandler = instrumentWorkflowCreate(fn, {
                  name: `${String(envName)}`
                });
                return Reflect.apply(createHandler, thisArg, args);
              default:
                return Reflect.apply(fn, thisArg, args);
            }
          }
        });
      } else {
        return passthroughGet(target, prop);
      }
    }
  };
  return wrap(fetcher, fetcherHandler);
}

// src/instrumentation/d1.ts
var dbSystem3 = "Cloudflare D1";
function metaAttributes(meta) {
  return {
    "db.cf.d1.rows_read": meta.rows_read,
    "db.cf.d1.rows_written": meta.rows_written,
    "db.cf.d1.duration": meta.duration,
    "db.cf.d1.size_after": meta.size_after,
    "db.cf.d1.last_row_id": meta.last_row_id,
    "db.cf.d1.changed_db": meta.changed_db,
    "db.cf.d1.changes": meta.changes
  };
}
function spanOptions(dbName, operation, sql) {
  const attributes = {
    binding_type: "D1",
    [SemanticAttributes.DB_NAME]: dbName,
    [SemanticAttributes.DB_SYSTEM]: dbSystem3,
    [SemanticAttributes.DB_OPERATION]: operation
  };
  if (sql) {
    attributes[SemanticAttributes.DB_STATEMENT] = sql;
  }
  return {
    kind: SpanKind.CLIENT,
    attributes
  };
}
function instrumentD1StatementFn(fn, dbName, operation, sql) {
  const tracer2 = trace.getTracer("D1");
  const fnHandler = {
    apply: (target, thisArg, argArray) => {
      if (operation === "bind") {
        const newStmt = Reflect.apply(target, thisArg, argArray);
        return instrumentD1PreparedStatement(newStmt, dbName, sql);
      }
      const options = spanOptions(dbName, operation, sql);
      return tracer2.startActiveSpan(`${dbName} ${operation}`, options, async (span) => {
        try {
          const result = await Reflect.apply(target, thisArg, argArray);
          if (operation === "all" || operation === "run") {
            span.setAttributes(metaAttributes(result.meta));
          }
          span.setStatus({ code: SpanStatusCode.OK });
          return result;
        } catch (error) {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR });
          throw error;
        } finally {
          span.end();
        }
      });
    }
  };
  return wrap(fn, fnHandler);
}
function instrumentD1PreparedStatement(stmt, dbName, statement) {
  const statementHandler = {
    get: (target, prop, receiver) => {
      const operation = String(prop);
      const fn = Reflect.get(target, prop, receiver);
      if (typeof fn === "function") {
        return instrumentD1StatementFn(fn, dbName, operation, statement);
      }
      return fn;
    }
  };
  return wrap(stmt, statementHandler);
}
function instrumentD1Fn(fn, dbName, operation) {
  const tracer2 = trace.getTracer("D1");
  const fnHandler = {
    apply: (target, thisArg, argArray) => {
      if (operation === "prepare") {
        const sql = argArray[0];
        const stmt = Reflect.apply(target, thisArg, argArray);
        return instrumentD1PreparedStatement(stmt, dbName, sql);
      } else if (operation === "exec") {
        const sql = argArray[0];
        const options = spanOptions(dbName, operation, sql);
        return tracer2.startActiveSpan(`${dbName} ${operation}`, options, async (span) => {
          try {
            const result = await Reflect.apply(target, thisArg, argArray);
            span.setStatus({ code: SpanStatusCode.OK });
            return result;
          } catch (error) {
            span.recordException(error);
            span.setStatus({ code: SpanStatusCode.ERROR });
            throw error;
          } finally {
            span.end();
          }
        });
      } else if (operation === "batch") {
        const statements = argArray[0];
        return tracer2.startActiveSpan(`${dbName} ${operation}`, async (span) => {
          const subSpans = statements.map(
            (s) => tracer2.startSpan(`${dbName} ${operation} > query`, spanOptions(dbName, operation, s.statement))
          );
          try {
            const result = await Reflect.apply(target, thisArg, argArray);
            result.forEach((r, i) => subSpans[i]?.setAttributes(metaAttributes(r.meta)));
            span.setStatus({ code: SpanStatusCode.OK });
            return result;
          } catch (error) {
            span.recordException(error);
            span.setStatus({ code: SpanStatusCode.ERROR });
            throw error;
          } finally {
            subSpans.forEach((s) => s.end());
            span.end();
          }
        });
      } else {
        return Reflect.apply(target, thisArg, argArray);
      }
    }
  };
  return wrap(fn, fnHandler);
}
function instrumentD1(database, dbName) {
  const dbHandler = {
    get: (target, prop, receiver) => {
      const operation = String(prop);
      const fn = Reflect.get(target, prop, receiver);
      if (typeof fn === "function") {
        return instrumentD1Fn(fn, dbName, operation);
      }
      return fn;
    }
  };
  return wrap(database, dbHandler);
}

// src/instrumentation/analytics-engine.ts
var dbSystem4 = "Cloudflare Analytics Engine";
var AEAttributes = {
  writeDataPoint(argArray) {
    const attrs = {};
    const opts = argArray[0];
    if (typeof opts === "object") {
      attrs["db.cf.ae.indexes"] = opts.indexes.length;
      attrs["db.cf.ae.index"] = opts.indexes[0].toString();
      attrs["db.cf.ae.doubles"] = opts.doubles.length;
      attrs["db.cf.ae.blobs"] = opts.blobs.length;
    }
    return attrs;
  }
};
function instrumentAEFn(fn, name, operation) {
  const tracer2 = trace.getTracer("AnalyticsEngine");
  const fnHandler = {
    apply: (target, thisArg, argArray) => {
      const attributes = {
        binding_type: "AnalyticsEngine",
        [SemanticAttributes.DB_NAME]: name,
        [SemanticAttributes.DB_SYSTEM]: dbSystem4,
        [SemanticAttributes.DB_OPERATION]: operation
      };
      const options = {
        kind: SpanKind.CLIENT,
        attributes
      };
      return tracer2.startActiveSpan(`Analytics Engine ${name} ${operation}`, options, async (span) => {
        const result = await Reflect.apply(target, thisArg, argArray);
        const extraAttrsFn = AEAttributes[operation];
        const extraAttrs = extraAttrsFn ? extraAttrsFn(argArray, result) : {};
        span.setAttributes(extraAttrs);
        span.setAttribute(SemanticAttributes.DB_STATEMENT, `${operation} ${argArray[0]}`);
        span.end();
        return result;
      });
    }
  };
  return wrap(fn, fnHandler);
}
function instrumentAnalyticsEngineDataset(dataset, name) {
  const datasetHandler = {
    get: (target, prop, receiver) => {
      const operation = String(prop);
      const fn = Reflect.get(target, prop, receiver);
      return instrumentAEFn(fn, name, operation);
    }
  };
  return wrap(dataset, datasetHandler);
}

// src/instrumentation/env.ts
var isJSRPC = (item) => {
  return !!item?.["__some_property_that_will_never_exist" + Math.random()];
};
var isKVNamespace = (item) => {
  return !isJSRPC(item) && !!item?.getWithMetadata;
};
var isQueue = (item) => {
  return !isJSRPC(item) && !!item?.sendBatch;
};
var isDurableObject = (item) => {
  return !isJSRPC(item) && !!item?.idFromName;
};
var isVersionMetadata = (item) => {
  return !isJSRPC(item) && typeof item?.id === "string" && typeof item?.tag === "string";
};
var isWorkflowBinding = (item) => {
  return !isJSRPC(item) && !!item?.create;
};
var isAnalyticsEngineDataset = (item) => {
  return !isJSRPC(item) && !!item?.writeDataPoint;
};
var isD1Database = (item) => {
  return !!item?.exec && !!item?.prepare;
};
var instrumentEnv = (env) => {
  const envHandler = {
    get: (target, prop, receiver) => {
      const item = Reflect.get(target, prop, receiver);
      if (!isProxyable(item)) {
        return item;
      }
      if (isJSRPC(item)) {
        return instrumentServiceBinding(item, String(prop));
      } else if (isKVNamespace(item)) {
        return instrumentKV(item, String(prop));
      } else if (isQueue(item)) {
        return instrumentQueueSender(item, String(prop));
      } else if (isDurableObject(item)) {
        return instrumentDOBinding(item, String(prop));
      } else if (isVersionMetadata(item)) {
        return item;
      } else if (isWorkflowBinding(item)) {
        return instrumentWorkflowBinding(item, {
          name: `${String(prop)}`
        });
      } else if (isAnalyticsEngineDataset(item)) {
        return instrumentAnalyticsEngineDataset(item, String(prop));
      } else if (isD1Database(item)) {
        return instrumentD1(item, String(prop));
      } else {
        return item;
      }
    }
  };
  return wrap(env, envHandler);
};

// src/instrumentation/fetch.ts
var netKeysFromCF = /* @__PURE__ */ new Set(["colo", "country", "request_priority", "tls_cipher", "tls_version", "asn", "tcp_rtt"]);
var camelToSnakeCase = (s) => {
  return s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};
var gatherOutgoingCfAttributes = (cf) => {
  const attrs = {};
  Object.keys(cf).forEach((key) => {
    const value = cf[key];
    const destKey = camelToSnakeCase(key);
    if (!netKeysFromCF.has(destKey)) {
      if (typeof value === "string" || typeof value === "number") {
        attrs[`cf.${destKey}`] = value;
      } else {
        attrs[`cf.${destKey}`] = JSON.stringify(value);
      }
    }
  });
  return attrs;
};
function gatherRequestAttributes(request) {
  const attrs = {};
  const headers = request.headers;
  attrs["http.request.method"] = request.method.toUpperCase();
  attrs["network.protocol.name"] = "http";
  attrs["network.protocol.version"] = request.cf?.httpProtocol;
  attrs["http.request.body.size"] = headers.get("content-length");
  attrs["user_agent.original"] = headers.get("user-agent");
  attrs["http.mime_type"] = headers.get("content-type");
  attrs["http.accepts"] = request.cf?.clientAcceptEncoding;
  const u = new URL(request.url);
  attrs["url.full"] = `${u.protocol}//${u.host}${u.pathname}${u.search}`;
  attrs["server.address"] = u.host;
  attrs["url.scheme"] = u.protocol;
  attrs["url.path"] = u.pathname;
  attrs["url.query"] = u.search;
  return attrs;
}
function gatherResponseAttributes(response) {
  const attrs = {};
  attrs["http.response.status_code"] = response.status;
  if (response.headers.get("content-length") == null) {
    attrs["http.response.body.size"] = response.headers.get("content-length");
  }
  attrs["http.mime_type"] = response.headers.get("content-type");
  return attrs;
}
function gatherIncomingCfAttributes(request) {
  const attrs = {};
  attrs["net.colo"] = request.cf?.colo;
  attrs["net.country"] = request.cf?.country;
  attrs["net.request_priority"] = request.cf?.requestPriority;
  attrs["net.tls_cipher"] = request.cf?.tlsCipher;
  attrs["net.tls_version"] = request.cf?.tlsVersion;
  attrs["net.asn"] = request.cf?.asn;
  attrs["net.tcp_rtt"] = request.cf?.clientTcpRtt;
  return attrs;
}
function getParentContextFromHeaders(headers) {
  return propagation.extract(context.active(), headers, {
    get(headers2, key) {
      return headers2.get(key) || void 0;
    },
    keys(headers2) {
      return [...headers2.keys()];
    }
  });
}
function getParentContextFromRequest2(request) {
  const workerConfig = getActiveConfig();
  if (workerConfig === void 0) {
    return context.active();
  }
  const acceptTraceContext = typeof workerConfig.handlers.fetch.acceptTraceContext === "function" ? workerConfig.handlers.fetch.acceptTraceContext(request) : workerConfig.handlers.fetch.acceptTraceContext ?? true;
  return acceptTraceContext ? getParentContextFromHeaders(request.headers) : context.active();
}
function waitUntilTrace(fn) {
  const tracer2 = trace.getTracer("waitUntil");
  return tracer2.startActiveSpan("waitUntil", async (span) => {
    await fn();
    span.end();
  });
}
var cold_start2 = true;
function executeFetchHandler(fetchFn, [request, env, ctx]) {
  const spanContext = getParentContextFromRequest2(request);
  const tracer2 = trace.getTracer("fetchHandler");
  const attributes = {
    ["faas.trigger"]: "http",
    ["faas.coldstart"]: cold_start2,
    ["faas.invocation_id"]: request.headers.get("cf-ray") ?? void 0
  };
  cold_start2 = false;
  Object.assign(attributes, gatherRequestAttributes(request));
  Object.assign(attributes, gatherIncomingCfAttributes(request));
  Object.assign(attributes, versionAttributes(env));
  const options = {
    attributes,
    kind: SpanKind.SERVER
  };
  const method = request.method.toUpperCase();
  const promise = tracer2.startActiveSpan(`fetchHandler ${method}`, options, spanContext, async (span) => {
    const readable = span;
    try {
      const response = await fetchFn(request, env, ctx);
      span.setAttributes(gatherResponseAttributes(response));
      return response;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      if (readable.attributes["http.route"]) {
        span.updateName(`fetchHandler ${method} ${readable.attributes["http.route"]}`);
      }
      span.end();
    }
  });
  return promise;
}
function createFetchHandler(fetchFn, initialiser) {
  const fetchHandler = {
    apply: async (target, _thisArg, argArray) => {
      const [request, orig_env, orig_ctx] = argArray;
      const config = initialiser(orig_env, request);
      const env = instrumentEnv(orig_env);
      const { ctx, tracker } = proxyExecutionContext(orig_ctx);
      const context2 = setConfig(config);
      try {
        const args = [request, env, ctx];
        return await context.with(context2, executeFetchHandler, void 0, target, args);
      } catch (error) {
        throw error;
      } finally {
        orig_ctx.waitUntil(exportSpans(tracker));
      }
    }
  };
  return wrap(fetchFn, fetchHandler);
}
function instrumentClientFetch(fetchFn, configFn, attrs) {
  const handler = {
    apply: (target, thisArg, argArray) => {
      const request = new Request(argArray[0], argArray[1]);
      if (!request.url.startsWith("http")) {
        return Reflect.apply(target, thisArg, argArray);
      }
      const workerConfig = getActiveConfig();
      if (!workerConfig) {
        return Reflect.apply(target, thisArg, [request]);
      }
      const config = configFn(workerConfig);
      const tracer2 = trace.getTracer("fetcher");
      const options = { kind: SpanKind.CLIENT, attributes: attrs };
      const host = new URL(request.url).host;
      const method = request.method.toUpperCase();
      const spanName = typeof attrs?.["name"] === "string" ? attrs?.["name"] : `fetch ${method} ${host}`;
      const promise = tracer2.startActiveSpan(spanName, options, async (span) => {
        try {
          const includeTraceContext = typeof config.includeTraceContext === "function" ? config.includeTraceContext(request) : config.includeTraceContext;
          if (includeTraceContext ?? true) {
            propagation.inject(context.active(), request.headers, {
              set: (h, k, v) => h.set(k, typeof v === "string" ? v : String(v))
            });
          }
          span.setAttributes(gatherRequestAttributes(request));
          if (request.cf) span.setAttributes(gatherOutgoingCfAttributes(request.cf));
          const response = await Reflect.apply(target, thisArg, [request]);
          span.setAttributes(gatherResponseAttributes(response));
          return response;
        } catch (error) {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR });
          throw error;
        } finally {
          span.end();
        }
      });
      return promise;
    }
  };
  return wrap(fetchFn, handler, true);
}
function instrumentGlobalFetch() {
  globalThis.fetch = instrumentClientFetch(globalThis.fetch, (config) => config.fetch);
}

// src/instrumentation/cache.ts
var tracer = trace.getTracer("cache instrumentation");
function sanitiseURL(url) {
  const u = new URL(url);
  return `${u.protocol}//${u.host}${u.pathname}${u.search}`;
}
function instrumentFunction(fn, cacheName, op) {
  const handler = {
    async apply(target, thisArg, argArray) {
      const attributes = {
        "cache.name": cacheName,
        "http.url": argArray[0].url ? sanitiseURL(argArray[0].url) : void 0,
        "cache.operation": op
      };
      const options = { kind: SpanKind.CLIENT, attributes };
      return tracer.startActiveSpan(`Cache ${cacheName} ${op}`, options, async (span) => {
        const result = await Reflect.apply(target, thisArg, argArray);
        if (op === "match") {
          span.setAttribute("cache.hit", !!result);
        }
        span.end();
        return result;
      });
    }
  };
  return wrap(fn, handler);
}
function instrumentCache(cache, cacheName) {
  const handler = {
    get(target, prop) {
      if (prop === "delete" || prop === "match" || prop === "put") {
        const fn = Reflect.get(target, prop).bind(target);
        return instrumentFunction(fn, cacheName, prop);
      } else {
        return Reflect.get(target, prop);
      }
    }
  };
  return wrap(cache, handler);
}
function instrumentOpen(openFn) {
  const handler = {
    async apply(target, thisArg, argArray) {
      const cacheName = argArray[0];
      const cache = await Reflect.apply(target, thisArg, argArray);
      return instrumentCache(cache, cacheName);
    }
  };
  return wrap(openFn, handler);
}
function _instrumentGlobalCache() {
  const handler = {
    get(target, prop) {
      if (prop === "default") {
        const cache = target.default;
        return instrumentCache(cache, "default");
      } else if (prop === "open") {
        const openFn = Reflect.get(target, prop).bind(target);
        return instrumentOpen(openFn);
      } else {
        return Reflect.get(target, prop);
      }
    }
  };
  globalThis.caches = wrap(caches, handler);
}
function instrumentGlobalCache() {
  return _instrumentGlobalCache();
}

// src/instrumentation/do-rpc.ts
var dbSystem5 = "Cloudflare DO SQLite";
function getParentContextFromHeaders3(headers) {
  if (headers instanceof Map) {
    return propagation.extract(context.active(), headers, {
      get(headers2, key) {
        return headers2.get(key) || void 0;
      },
      keys(headers2) {
        return [...headers2.keys()];
      }
    });
  } else {
    return propagation.extract(context.active(), headers, {
      get(headers2, key) {
        return headers2[key] || void 0;
      },
      keys(headers2) {
        return [...Object.keys(headers2)];
      }
    });
  }
}
function getParentContextFromRequest3(request) {
  const workerConfig = getActiveConfig();
  if (workerConfig === void 0) {
    return context.active();
  }
  const acceptTraceContext = typeof workerConfig.handlers.fetch.acceptTraceContext === "function" ? workerConfig.handlers.fetch.acceptTraceContext(request) : workerConfig.handlers.fetch.acceptTraceContext ?? true;
  return acceptTraceContext ? getParentContextFromHeaders3(request?.headers) : context.active();
}
function spanOptions2(dbName, operation, sql) {
  const attributes = {
    binding_type: "DO",
    [SemanticAttributes.DB_NAME]: dbName,
    [SemanticAttributes.DB_SYSTEM]: dbSystem5,
    [SemanticAttributes.DB_OPERATION]: operation
  };
  if (sql) {
    attributes[SemanticAttributes.DB_STATEMENT] = sql?.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
  }
  return {
    kind: SpanKind.CLIENT,
    attributes
  };
}
function metaAttributes2(meta) {
  return {
    "db.cf.sql.rows_read": meta?.rowsRead,
    "db.cf.sql.rows_written": meta?.rowsWritten
  };
}
function databaseSizeAttributes(databaseSize) {
  return {
    "db.cf.sql.database_size": databaseSize
  };
}
function instrumentSqlExec(fn) {
  const tracer2 = trace.getTracer("D1");
  const fnHandler = {
    apply: (target, thisArg, argArray) => {
      const sql = argArray[0];
      const options = spanOptions2("DO SQLite", "exec", sql);
      return tracer2.startActiveSpan("DO SQL Exec", options, (span) => {
        try {
          const result = Reflect.apply(target, thisArg, argArray);
          span.setAttributes(metaAttributes2(result));
          span.setAttributes(databaseSizeAttributes(thisArg?.databaseSize));
          span.setStatus({ code: SpanStatusCode.OK });
          return result;
        } catch (error) {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR });
          throw error;
        } finally {
          span.end();
        }
      });
    }
  };
  return wrap(fn, fnHandler);
}
function instrumentSql(sql) {
  const sqlHandler = {
    get(target, prop, receiver) {
      const result = Reflect.get(target, prop, receiver);
      if (prop === "exec") {
        return instrumentSqlExec(result);
      } else {
        return result;
      }
    }
  };
  return wrap(sql, sqlHandler);
}
var cold_start3 = true;
function executeDORPCFn(anyFn, fnName, argArray, id) {
  const tracer2 = trace.getTracer("DO RPC");
  const attributes = {
    [SemanticAttributes.FAAS_TRIGGER]: "rpc",
    [SemanticAttributes.FAAS_COLDSTART]: cold_start3
  };
  cold_start3 = false;
  const options = {
    attributes,
    kind: SpanKind.SERVER
  };
  let spanContext = context.active();
  let request = argArray?.[0]?.request || argArray?.[0]?.__otel_request;
  if (request) {
    spanContext = getParentContextFromRequest3(request);
  }
  const namespace = argArray[1];
  if (namespace) {
    fnName = `${fnName}/${namespace}`;
  }
  const promise = tracer2.startActiveSpan(`DO RPC ${fnName}`, options, spanContext, async (span) => {
    try {
      span.setAttribute("do.id", id.toString());
      span.setAttribute("do.fn", fnName);
      const response = await anyFn(...argArray);
      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
      return response;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      span.end();
      throw error;
    }
  });
  return promise;
}
function executeDOAlarm2(alarmFn, id) {
  const tracer2 = trace.getTracer("DO alarmHandler");
  const name = id.name || "";
  const promise = tracer2.startActiveSpan(`Durable Object Alarm ${name}`, async (span) => {
    span.setAttribute(SemanticAttributes.FAAS_COLDSTART, cold_start3);
    cold_start3 = false;
    span.setAttribute("do.id", id.toString());
    if (id.name) span.setAttribute("do.name", id.name);
    try {
      await alarmFn();
      span.end();
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      span.end();
      throw error;
    }
  });
  return promise;
}
function instrumentDORPCFn(anyFn, fnName, initialiser, env, id) {
  const fetchHandler = {
    async apply(target, thisArg, argArray) {
      const request = argArray[0]?.request;
      const config = initialiser(env, request);
      const context2 = setConfig(config);
      try {
        const bound = target.bind(unwrap(thisArg));
        let response = await context.with(context2, executeDORPCFn, void 0, bound, fnName, argArray, id);
        return response;
      } catch (error) {
        throw error;
      } finally {
        exportSpans();
      }
    }
  };
  return wrap(anyFn, fetchHandler);
}
function instrumentAlarmFn2(alarmFn, initialiser, env, id) {
  if (!alarmFn) return void 0;
  const alarmHandler = {
    async apply(target, thisArg) {
      const config = initialiser(env, "do-alarm");
      const context2 = setConfig(config);
      try {
        const bound = target.bind(unwrap(thisArg));
        return await context.with(context2, executeDOAlarm2, void 0, bound, id);
      } catch (error) {
        throw error;
      } finally {
        exportSpans();
      }
    }
  };
  return wrap(alarmFn, alarmHandler);
}
function instrumentDurableObjectStub(doObj, initialiser, env, state2, rpcFunctions) {
  const objHandler = {
    get(target, prop) {
      if (prop === "alarm") {
        const alarmFn = Reflect.get(target, prop);
        return instrumentAlarmFn2(alarmFn, initialiser, env, state2.id);
      } else {
        const result = Reflect.get(target, prop);
        if (typeof result === "function" && rpcFunctions.includes(String(prop))) {
          return instrumentDORPCFn(result, String(prop), initialiser, env, state2.id);
        }
        return result;
      }
    }
  };
  return wrap(doObj, objHandler);
}
function instrumentDOClassRPC(doClass, initialiser, rpcFunctions) {
  const classHandler = {
    construct(target, [orig_state, orig_env]) {
      const trigger = {
        id: orig_state.id.toString(),
        name: orig_state.id.name
      };
      const constructorConfig = initialiser(orig_env, trigger);
      const context2 = setConfig(constructorConfig);
      const env = instrumentEnv(orig_env);
      const createDO = () => {
        orig_state.storage.sql = instrumentSql(orig_state.storage.sql);
        return new target(orig_state, env);
      };
      const doObj = context.with(context2, createDO);
      return instrumentDurableObjectStub(doObj, initialiser, env, orig_state, rpcFunctions);
    }
  };
  return wrap(doClass, classHandler);
}

// src/instrumentation/scheduled.ts
var traceIdSymbol2 = Symbol("traceId");
var cold_start4 = true;
function executeScheduledHandler(scheduledFn, [controller, env, ctx]) {
  const tracer2 = trace.getTracer("scheduledHandler");
  const attributes = {
    [SemanticAttributes.FAAS_TRIGGER]: "timer",
    [SemanticAttributes.FAAS_COLDSTART]: cold_start4,
    [SemanticAttributes.FAAS_CRON]: controller.cron,
    [SemanticAttributes.FAAS_TIME]: new Date(controller.scheduledTime).toISOString()
  };
  cold_start4 = false;
  Object.assign(attributes, versionAttributes(env));
  const options = {
    attributes,
    kind: SpanKind.SERVER
  };
  const promise = tracer2.startActiveSpan(`scheduledHandler ${controller.cron}`, options, async (span) => {
    const traceId = span.spanContext().traceId;
    context.active().setValue(traceIdSymbol2, traceId);
    try {
      await scheduledFn(controller, env, ctx);
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
  return promise;
}
function createScheduledHandler(scheduledFn, initialiser) {
  const scheduledHandler = {
    async apply(target, _thisArg, argArray) {
      const [controller, orig_env, orig_ctx] = argArray;
      const config = initialiser(orig_env, controller);
      const env = instrumentEnv(orig_env);
      const { ctx, tracker } = proxyExecutionContext(orig_ctx);
      const context2 = setConfig(config);
      try {
        const args = [controller, env, ctx];
        return await context.with(context2, executeScheduledHandler, void 0, target, args);
      } catch (error) {
        throw error;
      } finally {
        orig_ctx.waitUntil(exportSpans(tracker));
      }
    }
  };
  return wrap(scheduledFn, scheduledHandler);
}

// versions.json
var _firmly_otel_cf_workers = "1.1.1";
var node = "20.18.0";

// src/sdk.ts
function isRequest(trigger) {
  return trigger instanceof Request;
}
function isMessageBatch(trigger) {
  return !!trigger.ackAll;
}
function isAlarm(trigger) {
  return trigger === "do-alarm";
}
var createResource2 = (config) => {
  const workerResourceAttrs = {
    "cloud.provider": "cloudflare",
    "cloud.platform": "cloudflare.workers",
    "cloud.region": "earth",
    "faas.max_memory": 134217728,
    "telemetry.sdk.language": "js",
    "telemetry.sdk.name": "@firmly/otel-cf-workers",
    "telemetry.sdk.version": _firmly_otel_cf_workers,
    "telemetry.sdk.build.node_version": node
  };
  const serviceResource = new Resource({
    "service.name": config.service.name,
    "service.namespace": config.service.namespace,
    "service.version": config.service.version
  });
  const resource = new Resource(workerResourceAttrs);
  return resource.merge(serviceResource);
};
var initialised = false;
function init(config) {
  if (!initialised) {
    if (config.instrumentation.instrumentGlobalCache) {
      instrumentGlobalCache();
    }
    if (config.instrumentation.instrumentGlobalFetch) {
      instrumentGlobalFetch();
    }
    propagation.setGlobalPropagator(config.propagator);
    const resource = createResource2(config);
    const provider = new WorkerTracerProvider(config.spanProcessors, resource);
    provider.register();
    initialised = true;
  }
}
function createInitialiser(config) {
  if (typeof config === "function") {
    return (env, trigger) => {
      const conf = parseConfig(config(env, trigger));
      init(conf);
      return conf;
    };
  } else {
    return () => {
      const conf = parseConfig(config);
      init(conf);
      return conf;
    };
  }
}
function instrument(handler, config) {
  const initialiser = createInitialiser(config);
  if (handler.fetch) {
    const fetcher = unwrap(handler.fetch);
    handler.fetch = createFetchHandler(fetcher, initialiser);
  }
  if (handler.scheduled) {
    const scheduler2 = unwrap(handler.scheduled);
    handler.scheduled = createScheduledHandler(scheduler2, initialiser);
  }
  if (handler.queue) {
    const queuer = unwrap(handler.queue);
    handler.queue = createQueueHandler(queuer, initialiser);
  }
  return handler;
}
function instrumentDO(doClass, config) {
  const initialiser = createInitialiser(config);
  return instrumentDOClass(doClass, initialiser);
}
function instrumentDORPC(doClass, config, rpcFunctions) {
  const initialiser = createInitialiser(config);
  return instrumentDOClassRPC(doClass, initialiser, rpcFunctions);
}
function instrumentWorkflow2(workflowClass, config) {
  const initialiser = createInitialiser(config);
  return instrumentWorkflow(workflowClass, initialiser);
}
var __unwrappedFetch = unwrap(fetch);

// src/multiexporter.ts
var MultiSpanExporter = class {
  exporters;
  constructor(exporters) {
    this.exporters = exporters;
  }
  export(items, resultCallback) {
    for (const exporter of this.exporters) {
      exporter.export(items, resultCallback);
    }
  }
  async shutdown() {
    for (const exporter of this.exporters) {
      await exporter.shutdown();
    }
  }
};
var MultiSpanExporterAsync = class {
  exporters;
  constructor(exporters) {
    this.exporters = exporters;
  }
  export(items, resultCallback) {
    const promises = this.exporters.map(
      (exporter) => new Promise((resolve) => {
        exporter.export(items, resolve);
      })
    );
    Promise.all(promises).then((results) => {
      const failed = results.filter((result) => result.code === ExportResultCode.FAILED);
      if (failed.length > 0) {
        resultCallback({ code: ExportResultCode.FAILED, error: failed[0].error });
      } else {
        resultCallback({ code: ExportResultCode.SUCCESS });
      }
    });
  }
  async shutdown() {
    await Promise.all(this.exporters.map((exporter) => exporter.shutdown()));
  }
};
export {
  BatchTraceSpanProcessor,
  MultiSpanExporter,
  MultiSpanExporterAsync,
  OTLPExporter,
  SpanImpl,
  SpanStatusCode,
  __unwrappedFetch,
  context as api_context,
  createExportTraceServiceRequest,
  createSampler,
  getParentContextFromHeaders,
  instrument,
  instrumentDO,
  instrumentDORPC,
  instrumentEnv,
  instrumentSql,
  instrumentWorkflow2 as instrumentWorkflow,
  isAlarm,
  isHeadSampled,
  isMessageBatch,
  isRequest,
  isRootErrorSpan,
  multiTailSampler,
  propagation,
  trace,
  waitUntilTrace,
  withNextSpan
};
