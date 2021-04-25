"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorize = void 0;
require("@babel/polyfill");
var const_1 = require("./scripts/const");
var Selectorizer_1 = require("./scripts/Selectorizer");
var Controller_1 = require("./scripts/Controller");
var validateSelects = function ($selects) {
    $selects.forEach(function ($select) {
        if (!($select instanceof HTMLSelectElement)) {
            throw new Error("Element must be a select");
        }
    });
};
var selectorize = function ($selectElement, options) {
    var $selects = $selectElement instanceof NodeList
        ? Array.from($selectElement)
        : [$selectElement];
    validateSelects($selects);
    var selectorizers = [];
    var init = function ($select) {
        $select[const_1.PLUGIN_NAME] = new Selectorizer_1.Selectorizer($select, options);
    };
    $selects.forEach(function ($select) {
        var selectorizer = $select[const_1.PLUGIN_NAME];
        if (!selectorizer) {
            // first init
            init($select);
        }
        else {
            if (options) {
                // reinit
                selectorizer.destroy();
                init($select);
            }
        }
        selectorizers.push($select[const_1.PLUGIN_NAME]);
    });
    return new Controller_1.Controller(selectorizers);
};
exports.selectorize = selectorize;
