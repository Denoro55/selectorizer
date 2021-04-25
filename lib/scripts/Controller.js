"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
var Controller = /** @class */ (function () {
    function Controller(selectorizers) {
        this.selectorizers = selectorizers;
    }
    Controller.prototype.open = function () {
        this.selectorizers.forEach(function (selectorizer) {
            selectorizer.open();
        });
    };
    Controller.prototype.close = function () {
        this.selectorizers.forEach(function (selectorizer) {
            selectorizer.close();
        });
    };
    Controller.prototype.change = function (newValue) {
        this.selectorizers.forEach(function (selectorizer) {
            selectorizer.change(newValue);
        });
    };
    Controller.prototype.refresh = function () {
        this.selectorizers.forEach(function (selectorizer) {
            selectorizer.refresh();
        });
    };
    Controller.prototype.destroy = function () {
        this.selectorizers.forEach(function (selectorizer) {
            selectorizer.destroy();
        });
    };
    Controller.prototype.addOptions = function (newOptions) {
        this.selectorizers.forEach(function (selectorizer) {
            selectorizer.addOptions(newOptions);
        });
    };
    Controller.prototype.setOptions = function (newOptions) {
        this.selectorizers.forEach(function (selectorizer) {
            selectorizer.setOptions(newOptions);
        });
    };
    Controller.prototype.getValues = function () {
        return this.selectorizers.map(function (selectorizer) {
            var _a = selectorizer.getSelect(), name = _a.name, value = _a.value;
            return { name: name, value: value };
        });
    };
    return Controller;
}());
exports.Controller = Controller;
