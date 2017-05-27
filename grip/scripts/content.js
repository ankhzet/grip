webpackJsonp([2],{

/***/ 110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_client_Injector__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Grip_Client_GripServerConnector__ = __webpack_require__(34);


((injector) => {
    injector.log('Injecting...');
})(new __WEBPACK_IMPORTED_MODULE_0__core_client_Injector__["a" /* Injector */](new __WEBPACK_IMPORTED_MODULE_1__Grip_Client_GripServerConnector__["a" /* GripServerConnector */]()));
//# sourceMappingURL=content.js.map

/***/ }),

/***/ 34:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_client_ServerConnector__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Server_actions_GripActions__ = __webpack_require__(25);


class GripServerConnector extends __WEBPACK_IMPORTED_MODULE_0__core_client_ServerConnector__["a" /* ServerConnector */] {
    constructor(port) {
        super('grip', port);
    }
    cache(uid) {
        return __WEBPACK_IMPORTED_MODULE_1__Server_actions_GripActions__["a" /* GripActions */].cache(this, { uid });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GripServerConnector;

//# sourceMappingURL=GripServerConnector.js.map

/***/ }),

/***/ 44:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__parcel_PortUtils__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__parcel_Port__ = __webpack_require__(47);


class ServerConnector extends __WEBPACK_IMPORTED_MODULE_1__parcel_Port__["a" /* Port */] {
    constructor() {
        super(...arguments);
        this.uid = __WEBPACK_IMPORTED_MODULE_0__parcel_PortUtils__["a" /* PortUtils */].guid('S');
    }
    notifyDisconnect() {
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ServerConnector;

//# sourceMappingURL=ServerConnector.js.map

/***/ }),

/***/ 92:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Injector {
    constructor(connector) {
        this.watch = 1000 * 60;
        this.aggressive = true;
        this.connector = connector;
        window.onbeforeunload = () => {
            return this.connector.notifyDisconnect();
        };
        if (document.readyState === 'complete') {
            this.check();
        }
        else {
            window.onload = this.check.bind(this);
        }
    }
    check() {
        let last = this.actual();
        let age = this.age();
        let watch = this.watch;
        let aged = age >= watch;
        if (aged || !last) {
            this.log(`Last request ${age} msec ago (${watch} delay for reconnect)`);
            if (aged) {
                this.connector.disconnect();
            }
            if (!this.connector.rebind()) {
                if (this.aggressive) {
                    this.log('Failed to connect to extension, reloading');
                    window.location.reload();
                }
            }
            else {
                this.connector.handshake();
            }
        }
        if (watch) {
            window.setTimeout(this.check.bind(this), watch / 10);
        }
    }
    actual() {
        return +this.connector.touched;
    }
    age() {
        return this.actual() ? (+new Date) - this.actual() : -1;
    }
    log(message, ...args) {
        console.log(`[${this.connector.name.toLocaleUpperCase()}] ${message}`, ...args);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Injector;

//# sourceMappingURL=Injector.js.map

/***/ })

},[110]);