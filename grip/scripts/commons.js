/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [], result;
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/ 		if(executeModules) {
/******/ 			for(i=0; i < executeModules.length; i++) {
/******/ 				result = __webpack_require__(__webpack_require__.s = executeModules[i]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// objects to store loaded and loading chunks
/******/ 	var installedChunks = {
/******/ 		3: 0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		if(installedChunks[chunkId] === 0) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/
/******/ 		// a Promise means "currently loading".
/******/ 		if(installedChunks[chunkId]) {
/******/ 			return installedChunks[chunkId][2];
/******/ 		}
/******/
/******/ 		// setup Promise in chunk cache
/******/ 		var promise = new Promise(function(resolve, reject) {
/******/ 			installedChunks[chunkId] = [resolve, reject];
/******/ 		});
/******/ 		installedChunks[chunkId][2] = promise;
/******/
/******/ 		// start chunk loading
/******/ 		var head = document.getElementsByTagName('head')[0];
/******/ 		var script = document.createElement('script');
/******/ 		script.type = 'text/javascript';
/******/ 		script.charset = 'utf-8';
/******/ 		script.async = true;
/******/ 		script.timeout = 120000;
/******/
/******/ 		if (__webpack_require__.nc) {
/******/ 			script.setAttribute("nonce", __webpack_require__.nc);
/******/ 		}
/******/ 		script.src = __webpack_require__.p + "" + chunkId + ".js?" + "01f1b86d0a35a59fd7d9" + "";
/******/ 		var timeout = setTimeout(onScriptComplete, 120000);
/******/ 		script.onerror = script.onload = onScriptComplete;
/******/ 		function onScriptComplete() {
/******/ 			// avoid mem leaks in IE.
/******/ 			script.onerror = script.onload = null;
/******/ 			clearTimeout(timeout);
/******/ 			var chunk = installedChunks[chunkId];
/******/ 			if(chunk !== 0) {
/******/ 				if(chunk) {
/******/ 					chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
/******/ 				}
/******/ 				installedChunks[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		head.appendChild(script);
/******/
/******/ 		return promise;
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/ })
/************************************************************************/
/******/ ({

/***/ 116:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Tracer {
    constructor() {
        this.index = 0;
    }
    trace(message, port, packet) {
        return this.log({
            index: this.index++,
            timestamp: new Date(),
            port,
            packet,
            message,
            stack: this.processStackTrace((new Error()).stack)
        });
    }
    processStackTrace(stack) {
        return stack.split('\n')
            .slice(1)
            .map((line) => {
            return '\t' + line.replace(/^\s*at\s*/, '').trim();
        }).filter((line) => {
            return !line.match(/(Tracer|Function)\.trace/);
        }).join('\n');
    }
    log(entry) {
        console.log(`
[${entry.index} - ${Tracer.dateStr(entry.timestamp)}] PROTOCOL TRACE:
  [${entry.port.uid}]${entry.message}[${(entry.packet.sender == entry.port.uid) ? '*:????' : entry.packet.sender}]
			`.trim(), entry.packet, '\n', entry.stack);
        return entry;
    }
    static trace(message, port, packet) {
        if (!this.instance) {
            this.instance = new Tracer();
        }
        return this.instance.trace(message, port, packet);
    }
    static dateStr(time) {
        return time.toISOString().replace(/[TZ]|\..*/g, ' ').trim();
    }
}
/* unused harmony export Tracer */

//# sourceMappingURL=Tracer.js.map

/***/ }),

/***/ 117:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class AbstractActions {
    static register(constructor) {
        return this._registry[constructor.uid] = new constructor();
    }
    static get(constructor) {
        return this._registry[constructor.uid] || this.register(constructor);
    }
    static registered(name) {
        return this._registry[name];
    }
    static action(name) {
        let performer = this._cache[name];
        if (!performer) {
            let action = this._registry[name];
            performer = action.send.bind(action);
            this._cache[name] = performer;
        }
        return performer;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AbstractActions;

AbstractActions._cache = {};
AbstractActions._registry = {};
//# sourceMappingURL=AbstractActions.js.map

/***/ }),

/***/ 118:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Action__ = __webpack_require__(8);

class FireAction extends __WEBPACK_IMPORTED_MODULE_0__Action__["a" /* Action */] {
    constructor() {
        super(...arguments);
        this.properties = ['sender', 'event', 'payload'];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FireAction;

//# sourceMappingURL=Fire.js.map

/***/ }),

/***/ 18:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class PortUtils {
    static portName(port) {
        return `${port}-data-channel`;
    }
    static guid(prefix) {
        return prefix + ':' + `${~~(1000 + Math.random() * 8999)}`.replace(/^0\./, '');
    }
    static rename(uid, to) {
        return uid.replace(/(\d+)$/, to.replace(/^[^\d]*/, ''));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PortUtils;

//# sourceMappingURL=PortUtils.js.map

/***/ }),

/***/ 19:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Handshake__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__server_actions_Fetch__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Send__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__server_actions_Update__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Fire__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__AbstractActions__ = __webpack_require__(117);






class BaseActions extends __WEBPACK_IMPORTED_MODULE_5__AbstractActions__["a" /* AbstractActions */] {
    static get handshake() {
        let action = __WEBPACK_IMPORTED_MODULE_0__Handshake__["a" /* HandshakeAction */].uid;
        if (!this.registered(action)) {
            this.register(__WEBPACK_IMPORTED_MODULE_0__Handshake__["a" /* HandshakeAction */]);
        }
        return this.action(action);
    }
    static get fetch() {
        let action = __WEBPACK_IMPORTED_MODULE_1__server_actions_Fetch__["a" /* FetchAction */].uid;
        if (!this.registered(action)) {
            this.register(__WEBPACK_IMPORTED_MODULE_1__server_actions_Fetch__["a" /* FetchAction */]);
        }
        return this.action(action);
    }
    static get send() {
        let action = __WEBPACK_IMPORTED_MODULE_2__Send__["a" /* SendAction */].uid;
        if (!this.registered(action)) {
            this.register(__WEBPACK_IMPORTED_MODULE_2__Send__["a" /* SendAction */]);
        }
        return this.action(action);
    }
    static get update() {
        let action = __WEBPACK_IMPORTED_MODULE_3__server_actions_Update__["a" /* UpdateAction */].uid;
        if (!this.registered(action)) {
            this.register(__WEBPACK_IMPORTED_MODULE_3__server_actions_Update__["a" /* UpdateAction */]);
        }
        return this.action(action);
    }
    static get fire() {
        let action = __WEBPACK_IMPORTED_MODULE_4__Fire__["a" /* FireAction */].uid;
        if (!this.registered(action)) {
            this.register(__WEBPACK_IMPORTED_MODULE_4__Fire__["a" /* FireAction */]);
        }
        return this.action(action);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BaseActions;

//# sourceMappingURL=BaseActions.js.map

/***/ }),

/***/ 25:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_parcel_actions_Base_BaseActions__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Cache__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Updated__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Cached__ = __webpack_require__(60);




class GripActions extends __WEBPACK_IMPORTED_MODULE_0__core_parcel_actions_Base_BaseActions__["a" /* BaseActions */] {
    static get cache() {
        let action = __WEBPACK_IMPORTED_MODULE_1__Cache__["a" /* CacheAction */].uid;
        if (!this.registered(action)) {
            this.register(__WEBPACK_IMPORTED_MODULE_1__Cache__["a" /* CacheAction */]);
        }
        return this.action(action);
    }
    static get cached() {
        let action = __WEBPACK_IMPORTED_MODULE_3__Cached__["a" /* CachedAction */].uid;
        if (!this.registered(action)) {
            this.register(__WEBPACK_IMPORTED_MODULE_3__Cached__["a" /* CachedAction */]);
        }
        return this.action(action);
    }
    static get updated() {
        let action = __WEBPACK_IMPORTED_MODULE_2__Updated__["a" /* UpdatedAction */].uid;
        if (!this.registered(action)) {
            this.register(__WEBPACK_IMPORTED_MODULE_2__Updated__["a" /* UpdatedAction */]);
        }
        return this.action(action);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GripActions;

//# sourceMappingURL=GripActions.js.map

/***/ }),

/***/ 27:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Action__ = __webpack_require__(8);

class SendAction extends __WEBPACK_IMPORTED_MODULE_0__Action__["a" /* Action */] {
    constructor() {
        super(...arguments);
        this.properties = ['what', 'data', 'payload'];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SendAction;

//# sourceMappingURL=Send.js.map

/***/ }),

/***/ 47:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions_Base_BaseActions__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__PacketDispatcher__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Tracer__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__PortUtils__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions_Base_Handshake__ = __webpack_require__(63);





class Port {
    constructor(name, port) {
        this.dispatcher = new __WEBPACK_IMPORTED_MODULE_1__PacketDispatcher__["a" /* PacketDispatcher */](__WEBPACK_IMPORTED_MODULE_0__actions_Base_BaseActions__["a" /* BaseActions */]);
        this.uid = __WEBPACK_IMPORTED_MODULE_3__PortUtils__["a" /* PortUtils */].guid('P');
        this.touched = 0;
        this.name = __WEBPACK_IMPORTED_MODULE_3__PortUtils__["a" /* PortUtils */].portName(name);
        console.log('created', this.name, this.uid, this.constructor.name);
        if (!this.rebind(port)) {
            throw new Error('Failed to connect from ' + this.constructor.name);
        }
    }
    disconnect() {
        if (!this.port) {
            return false;
        }
        try {
            this.port.disconnect();
        }
        catch (e) {
        }
        finally {
            this.port = null;
        }
        return true;
    }
    rebind(port) {
        return this.bind(port || this.port || chrome.runtime.connect({ name: this.name }));
    }
    fire(sender, event) {
        return __WEBPACK_IMPORTED_MODULE_0__actions_Base_BaseActions__["a" /* BaseActions */].fire(this, { sender, event });
    }
    bind(port) {
        if (!port) {
            return;
        }
        port.onMessage.addListener(this.process.bind(this));
        port.onDisconnect.addListener(() => { this.port = null; });
        return this.port = port;
    }
    listen(action, handler) {
        return this.dispatcher.bind(this, { handler, action });
    }
    sendPacket(action, data, error) {
        if (!this.port) {
            return;
        }
        let packet = {
            sender: this.uid,
            action: action,
            data: data,
            error: error || null,
        };
        if (false) {
            Tracer.trace(' > ', this, packet);
        }
        this.port.postMessage(packet);
    }
    process(packet) {
        if (false) {
            Tracer.trace(' < ', this, packet);
        }
        this.touched = +new Date;
        this.dispatcher.dispatch(this, packet)
            .catch((e) => {
            __WEBPACK_IMPORTED_MODULE_0__actions_Base_BaseActions__["a" /* BaseActions */].send(this, { what: 'error', data: packet }, e.toLocaleString());
        });
    }
    handshake(delegate) {
        let done = false;
        let handler = delegate || this._handle_handshake.bind(this);
        this.listen(__WEBPACK_IMPORTED_MODULE_4__actions_Base_Handshake__["a" /* HandshakeAction */], (data, client, packet) => {
            if (done) {
                console.log('repeating handshake', data, client, packet, this);
                return;
            }
            try {
                return handler(data, this, packet);
            }
            finally {
                done = true;
            }
        });
        __WEBPACK_IMPORTED_MODULE_0__actions_Base_BaseActions__["a" /* BaseActions */].handshake(this, { uid: this.uid });
        return this;
    }
    _handle_handshake(data) {
        this.uid = __WEBPACK_IMPORTED_MODULE_3__PortUtils__["a" /* PortUtils */].rename(this.uid, data.uid);
        this.touched = +new Date;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Port;

//# sourceMappingURL=Port.js.map

/***/ }),

/***/ 59:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_parcel_actions_Action__ = __webpack_require__(8);

class CacheAction extends __WEBPACK_IMPORTED_MODULE_0__core_parcel_actions_Action__["a" /* Action */] {
    constructor() {
        super(...arguments);
        this.properties = ['uid'];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CacheAction;

//# sourceMappingURL=Cache.js.map

/***/ }),

/***/ 60:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_parcel_actions_Action__ = __webpack_require__(8);

class CachedAction extends __WEBPACK_IMPORTED_MODULE_0__core_parcel_actions_Action__["a" /* Action */] {
    constructor() {
        super(...arguments);
        this.properties = ['uids'];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CachedAction;

//# sourceMappingURL=Cached.js.map

/***/ }),

/***/ 61:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_parcel_actions_Action__ = __webpack_require__(8);

class UpdatedAction extends __WEBPACK_IMPORTED_MODULE_0__core_parcel_actions_Action__["a" /* Action */] {
    constructor() {
        super(...arguments);
        this.properties = ['what', 'uids'];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UpdatedAction;

//# sourceMappingURL=Updated.js.map

/***/ }),

/***/ 62:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class PacketDispatcher {
    constructor(repository) {
        this.actionHandlers = {};
        this.repository = repository;
    }
    bind(context, descriptors) {
        if (descriptors instanceof Array) {
            for (let descriptor of descriptors) {
                this.bind(context, descriptor);
            }
            return context;
        }
        let descriptor = descriptors;
        let method = descriptor.handler;
        let name = PacketDispatcher.DEFAULT;
        let unpack = null;
        if (descriptor.action) {
            let action = this.repository.get(descriptor.action);
            unpack = (packet) => action.unpack(packet.data);
            name = descriptor.action.uid;
        }
        let bound = this.actionHandlers[name] || (this.actionHandlers[name] = []);
        bound.push(unpack
            ? (sender, packet) => method.call(context, unpack(packet), sender, packet)
            : (sender, packet) => method.call(context, packet.data, sender, packet));
        return context;
    }
    dispatch(sender, packet) {
        return __awaiter(this, void 0, void 0, function* () {
            let handled = false;
            try {
                let promises = [], promise;
                for (let action of [packet.action, PacketDispatcher.DEFAULT]) {
                    let handlers = this.actionHandlers[action];
                    if (handlers) {
                        handled = true;
                        for (let handler of handlers) {
                            if (promise = handler(sender, packet)) {
                                promises.push(promise);
                            }
                            else if (promise === false) {
                                break;
                            }
                        }
                    }
                }
                yield Promise.all(promises);
            }
            catch (e) {
                let stack = e.stack.split("\n").slice(1).join("\n");
                packet.error = `${e}\n${stack}`;
                if (!e.logged) {
                    console.error(`Error while dispatching request:`, e);
                    e.logged = true;
                }
                throw e;
            }
            return handled;
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PacketDispatcher;

PacketDispatcher.DEFAULT = '*';
//# sourceMappingURL=PacketDispatcher.js.map

/***/ }),

/***/ 63:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Action__ = __webpack_require__(8);

class HandshakeAction extends __WEBPACK_IMPORTED_MODULE_0__Action__["a" /* Action */] {
    constructor() {
        super(...arguments);
        this.properties = ['uid'];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HandshakeAction;

//# sourceMappingURL=Handshake.js.map

/***/ }),

/***/ 64:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__parcel_actions_Action__ = __webpack_require__(8);

class CollectionAction extends __WEBPACK_IMPORTED_MODULE_0__parcel_actions_Action__["a" /* Action */] {
    constructor() {
        super(...arguments);
        this.properties = ['what', 'data', 'payload'];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CollectionAction;

//# sourceMappingURL=Collection.js.map

/***/ }),

/***/ 65:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Collection__ = __webpack_require__(64);

class FetchAction extends __WEBPACK_IMPORTED_MODULE_0__Collection__["a" /* CollectionAction */] {
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FetchAction;

//# sourceMappingURL=Fetch.js.map

/***/ }),

/***/ 66:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Collection__ = __webpack_require__(64);

class UpdateAction extends __WEBPACK_IMPORTED_MODULE_0__Collection__["a" /* CollectionAction */] {
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UpdateAction;

//# sourceMappingURL=Update.js.map

/***/ }),

/***/ 8:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Action {
    constructor() {
        this.properties = ['error'];
    }
    pack(data) {
        return data;
    }
    unpack(data) {
        return data;
    }
    send(port, data, error) {
        return port.sendPacket(this.uid, this.pack(data), error);
    }
    get uid() {
        return this.constructor.uid;
    }
    static get uid() {
        return this.name
            .replace(/Action$/, '')
            .toLowerCase();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Action;

//# sourceMappingURL=Action.js.map

/***/ })

/******/ });