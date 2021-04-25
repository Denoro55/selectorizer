"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClosestElement = exports.toPx = exports.getPluginClass = exports.getOptions = exports.wrapElement = exports.createElement = void 0;
var const_1 = require("./const");
var createElement = function (tag, cls, text, datasetArray) {
    if (datasetArray === void 0) { datasetArray = []; }
    var el = document.createElement(tag);
    el.className = cls.join(" ");
    el.innerHTML = text;
    datasetArray.forEach(function (dataName) {
        var value = dataName.value.toString();
        el.setAttribute(dataName.key, value);
    });
    return el;
};
exports.createElement = createElement;
var wrapElement = function ($parent, $child) {
    if ($child.parentNode) {
        $child.parentNode.insertBefore($parent, $child);
        $parent.appendChild($child);
    }
};
exports.wrapElement = wrapElement;
var getOptions = function ($optionsNodes) {
    var options = Array.prototype.slice.call($optionsNodes);
    return options.map(function (_a) {
        var text = _a.text, value = _a.value;
        return { text: text, value: value };
    });
};
exports.getOptions = getOptions;
var getPluginClass = function (clz, delimiter) {
    return "" + const_1.PLUGIN_NAME + delimiter + clz;
};
exports.getPluginClass = getPluginClass;
var toPx = function (value) { return value + "px"; };
exports.toPx = toPx;
var getClosestElement = function (element, clazz) {
    if (!element)
        return null;
    if (element.classList.contains(clazz)) {
        return element;
    }
    if (element.parentElement) {
        return exports.getClosestElement(element.parentElement, clazz);
    }
    return null;
};
exports.getClosestElement = getClosestElement;
