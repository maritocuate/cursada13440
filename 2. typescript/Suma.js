"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Suma = void 0;
var Suma = /** @class */ (function () {
    function Suma(a, b) {
        var _this = this;
        this.resultado = function () {
            return _this._a + _this._b;
        };
        this._a = a;
        this._b = b;
    }
    return Suma;
}());
exports.Suma = Suma;
