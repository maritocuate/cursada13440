"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resta = void 0;
var Resta = /** @class */ (function () {
    function Resta(a, b) {
        var _this = this;
        this.resultado = function () {
            return _this._a - _this._b;
        };
        this._a = a;
        this._b = b;
    }
    return Resta;
}());
exports.Resta = Resta;
