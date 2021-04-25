"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLASSES = exports.ERROR_MESSAGES = exports.DEFAULT_OPTIONS = exports.PLUGIN_NAME = void 0;
var helpers_1 = require("./helpers");
exports.PLUGIN_NAME = "selectorizer";
exports.DEFAULT_OPTIONS = {
    withIcon: true,
    isMobile: function () {
        return /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    classes: [],
    placeholder: 'Select value',
    closeOnClickOutside: true,
};
exports.ERROR_MESSAGES = {
    invalidType: function (prop, type) { return "Property \"" + prop + "\" is not assignable to type " + type; },
    valueDoesNotExists: function (value) {
        return "Value \"" + value + "\" does not exists in options";
    },
};
exports.CLASSES = {
    dropdown: helpers_1.getPluginClass("dropdown", "__"),
    dropdownItem: helpers_1.getPluginClass("dropdown-item", "__"),
    label: helpers_1.getPluginClass('label', '__'),
    inner: helpers_1.getPluginClass('inner', '__'),
    icon: helpers_1.getPluginClass('icon', '__'),
    iconArrow: helpers_1.getPluginClass('icon-arrow', '__'),
};
