"use strict";
var __assign = (this && this.__assign) || function () {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Selectorizer = void 0;
var const_1 = require("./const");
var helpers_1 = require("./helpers");
var types_1 = require("./types");
var Selectorizer = /** @class */ (function () {
    function Selectorizer(select, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.renderDropdownList = function (options) {
            var currentValue = _this.state.currentValue;
            var renderOption = _this.options.renderOption;
            return options
                .map(function (option, index) {
                var value = option.value, text = option.text, disabled = option.disabled;
                var isSelected = currentValue === value;
                var classes = [const_1.CLASSES.dropdownItem];
                if (isSelected) {
                    classes.push("selected");
                }
                if (disabled) {
                    classes.push("disabled");
                }
                var optionContent = renderOption
                    ? renderOption(_this, option, isSelected)
                    : text;
                return helpers_1.createElement("div", classes, optionContent, [
                    { key: "data-index", value: index },
                ]).outerHTML;
            })
                .join("");
        };
        this.elements = {
            $select: select,
            $wrapper: null,
            $inner: null,
            $label: null,
            $icon: null,
            $dropdown: null,
        };
        this.options = __assign(__assign({}, const_1.DEFAULT_OPTIONS), options);
        this.state = {
            isOpened: false,
            isNative: this.isSelectNative(),
            currentValue: "",
            options: [],
            dir: "bottom",
        };
        this.onResizeListener = this.onResizeListener.bind(this);
        this.onSelectChangeListener = this.onSelectChangeListener.bind(this);
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onDropdownItemClick = this.onDropdownItemClick.bind(this);
        this.validateConfig();
        this.init();
        this.initListeners();
    }
    Selectorizer.prototype.validateConfig = function () {
        var _a = this.options, iconHtml = _a.iconHtml, maxHeight = _a.maxHeight, classes = _a.classes;
        this.options.withIcon = !!this.options.withIcon;
        this.options.isNativeOnMobile = !!this.options.isNativeOnMobile;
        if (iconHtml && typeof iconHtml !== "string") {
            throw new Error(const_1.ERROR_MESSAGES.invalidType("iconHtml", "string"));
        }
        if (maxHeight && typeof maxHeight !== "number") {
            throw new Error(const_1.ERROR_MESSAGES.invalidType("maxHeight", "number"));
        }
        if (classes && !Array.isArray(classes)) {
            throw new Error(const_1.ERROR_MESSAGES.invalidType("classes", "array"));
        }
    };
    Selectorizer.prototype.init = function () {
        var _a, _b;
        var $select = this.elements.$select;
        // TODO: think how to do better
        if ((_a = this.options.callbacks) === null || _a === void 0 ? void 0 : _a.beforeInit) {
            this.options.callbacks.beforeInit(this);
        }
        this.elements.$wrapper = helpers_1.createElement("div", [this.getClasses()], "");
        this.elements.$inner = helpers_1.createElement("div", [const_1.CLASSES.inner], "");
        this.elements.$wrapper.appendChild(this.elements.$inner);
        this.elements.$label = helpers_1.createElement("div", [const_1.CLASSES.label], "");
        this.elements.$inner.appendChild(this.elements.$label);
        this.elements.$dropdown = helpers_1.createElement("div", [const_1.CLASSES.dropdown], "");
        this.elements.$wrapper.appendChild(this.elements.$dropdown);
        this.initIcon();
        this.initOptions();
        this.state.currentValue = $select.value;
        helpers_1.wrapElement(this.elements.$wrapper, $select);
        if ((_b = this.options.callbacks) === null || _b === void 0 ? void 0 : _b.init) {
            this.options.callbacks.init(this);
        }
        this.preRender();
    };
    Selectorizer.prototype.initIcon = function () {
        var elements = this.elements;
        var _a = this.options, withIcon = _a.withIcon, iconHtml = _a.iconHtml;
        if (withIcon) {
            if (elements.$inner) {
                elements.$icon = helpers_1.createElement("div", [const_1.CLASSES.icon], "");
                elements.$inner.appendChild(elements.$icon);
                if (!iconHtml) {
                    var $arrow = helpers_1.createElement("div", [const_1.CLASSES.iconArrow], "");
                    elements.$icon.appendChild($arrow);
                }
                else {
                    elements.$icon.innerHTML = iconHtml;
                }
            }
        }
    };
    Selectorizer.prototype.initOptions = function () {
        var $select = this.elements.$select;
        var $allOptions = $select.querySelectorAll("option");
        var options = helpers_1.getOptions($allOptions);
        this.state.options = options;
    };
    Selectorizer.prototype.initListeners = function () {
        var _this = this;
        var _a, _b, _c;
        window.addEventListener("resize", this.onResizeListener);
        window.addEventListener("click", this.onDocumentClick, true);
        (_a = this.elements.$dropdown) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onDropdownItemClick);
        (_b = this.elements.$inner) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function (e) {
            if (!(e.target instanceof HTMLElement)) {
                return;
            }
            _this.toggleOpened();
        });
        (_c = this.elements.$select) === null || _c === void 0 ? void 0 : _c.addEventListener("change", this.onSelectChangeListener);
    };
    Selectorizer.prototype.removeListeners = function () {
        var _a;
        window.removeEventListener("resize", this.onResizeListener);
        window.removeEventListener("click", this.onDocumentClick, true);
        (_a = this.elements.$select) === null || _a === void 0 ? void 0 : _a.removeEventListener("change", this.onSelectChangeListener);
    };
    Selectorizer.prototype.onDropdownItemClick = function (e) {
        if (!(e.target instanceof HTMLElement)) {
            return;
        }
        var $dropdownItem = helpers_1.getClosestElement(e.target, const_1.CLASSES.dropdownItem);
        if ($dropdownItem) {
            var dataIndex = $dropdownItem.getAttribute("data-index");
            var index = dataIndex ? +dataIndex : null;
            if (index !== null && this.state.options[index] && !this.state.options[index].disabled) {
                this.change(this.state.options[index].value);
            }
        }
    };
    Selectorizer.prototype.onDocumentClick = function (e) {
        var _a;
        var $target = e.target; // TODO: fix typecast
        if (!((_a = this.getWrapper()) === null || _a === void 0 ? void 0 : _a.contains($target))) {
            this.getConfig().closeOnClickOutside && this.close();
        }
    };
    Selectorizer.prototype.onResizeListener = function () {
        var isNative = this.state.isNative;
        this.state.isNative = this.isSelectNative();
        if (isNative !== this.state.isNative) {
            this.preRender();
        }
    };
    Selectorizer.prototype.onSelectChangeListener = function (e) {
        if (!(e.target instanceof HTMLSelectElement)) {
            return;
        }
        this.change(e.target.value);
    };
    Selectorizer.prototype.toggleOpened = function () {
        if (this.state.isOpened) {
            this.close();
        }
        else {
            this.open();
        }
    };
    Selectorizer.prototype.getClasses = function () {
        var classes = __spreadArray([const_1.PLUGIN_NAME], this.options.classes);
        if (this.state.isOpened) {
            classes.push(helpers_1.getPluginClass(types_1.EClasses.open, "-"));
        }
        if (this.state.isNative) {
            classes.push(helpers_1.getPluginClass(types_1.EClasses.native, "-"));
        }
        if (this.state.dir === "top") {
            classes.push(helpers_1.getPluginClass(types_1.EClasses.inverted, "-"));
        }
        return classes.join(" ");
    };
    Selectorizer.prototype.getOptionByValue = function (value) {
        return this.state.options.find(function (opt) { return opt.value === value; });
    };
    Selectorizer.prototype.open = function () {
        var _a, _b;
        var isOpened = this.state.isOpened;
        if (!isOpened && ((_a = this.options.callbacks) === null || _a === void 0 ? void 0 : _a.beforeOpen)) {
            this.options.callbacks.beforeOpen(this);
        }
        this.state.isOpened = true;
        this.preRender();
        if (!isOpened && ((_b = this.options.callbacks) === null || _b === void 0 ? void 0 : _b.open)) {
            this.options.callbacks.open(this);
        }
    };
    Selectorizer.prototype.close = function () {
        var _a, _b;
        var isOpened = this.state.isOpened;
        if (isOpened && ((_a = this.options.callbacks) === null || _a === void 0 ? void 0 : _a.beforeClose)) {
            this.options.callbacks.beforeClose(this);
        }
        this.state.isOpened = false;
        this.preRender();
        if (isOpened && ((_b = this.options.callbacks) === null || _b === void 0 ? void 0 : _b.close)) {
            this.options.callbacks.close(this);
        }
    };
    Selectorizer.prototype.change = function (value) {
        var _a, _b;
        var option = this.getOptionByValue(value);
        if (option) {
            var isNewValue = value !== this.state.currentValue;
            if (((_a = this.options.callbacks) === null || _a === void 0 ? void 0 : _a.beforeChange) && isNewValue) {
                this.options.callbacks.beforeChange(this);
            }
            this.state.currentValue = value;
            if (((_b = this.options.callbacks) === null || _b === void 0 ? void 0 : _b.change) && isNewValue) {
                this.options.callbacks.change(this);
            }
            this.close();
        }
    };
    Selectorizer.prototype.refresh = function () {
        var _a, _b;
        if ((_a = this.options.callbacks) === null || _a === void 0 ? void 0 : _a.beforeRefresh) {
            this.options.callbacks.beforeRefresh(this);
        }
        this.initOptions();
        this.preRender();
        if ((_b = this.options.callbacks) === null || _b === void 0 ? void 0 : _b.refresh) {
            this.options.callbacks.refresh(this);
        }
    };
    Selectorizer.prototype.isSelectNative = function () {
        var _a;
        return !!(((_a = this.options) === null || _a === void 0 ? void 0 : _a.isMobile()) && this.options.isNativeOnMobile);
    };
    Selectorizer.prototype.addNativeOption = function (option) {
        var newOption = document.createElement("option");
        newOption.value = option.value;
        newOption.text = option.text;
        newOption.disabled = !!option.disabled;
        this.elements.$select.appendChild(newOption);
    };
    Selectorizer.prototype.removeOptions = function () {
        this.state.options = [];
        this.elements.$select.innerHTML = "";
    };
    Selectorizer.prototype.setOptions = function (newOptions) {
        var currentValue = this.state.currentValue;
        this.removeOptions();
        this.addOptions(newOptions);
        this.state.currentValue = newOptions.some(function (opt) { return opt.value === currentValue; })
            ? this.state.currentValue
            : "";
    };
    Selectorizer.prototype.addOptions = function (newOptions) {
        var _this = this;
        newOptions.forEach(function (opt) {
            _this.addNativeOption(opt);
            _this.state.options.push(opt);
        });
        this.preRender();
    };
    Selectorizer.prototype.getWrapper = function () {
        return this.getElements().$wrapper;
    };
    Selectorizer.prototype.getSelect = function () {
        return this.getElements().$select;
    };
    Selectorizer.prototype.getElements = function () {
        return this.elements;
    };
    Selectorizer.prototype.getState = function () {
        return this.state;
    };
    Selectorizer.prototype.getConfig = function () {
        return this.options;
    };
    Selectorizer.prototype.destroy = function () {
        var _a, _b;
        if ((_a = this.options.callbacks) === null || _a === void 0 ? void 0 : _a.beforeDestroy) {
            this.options.callbacks.beforeDestroy(this);
        }
        this.removeListeners();
        if (this.elements.$wrapper) {
            helpers_1.wrapElement(this.elements.$select, this.elements.$wrapper);
            this.elements.$select[const_1.PLUGIN_NAME] = null;
            this.elements.$wrapper.remove();
            if ((_b = this.options.callbacks) === null || _b === void 0 ? void 0 : _b.destroy) {
                this.options.callbacks.destroy(this);
            }
        }
    };
    Selectorizer.prototype.preRender = function () {
        var calculateDropdownDir = this.options.calculateDropdownDir;
        this.elements.$select.value = this.state.currentValue;
        var selectorizer = this.elements.$wrapper;
        if (selectorizer) {
            if (calculateDropdownDir) {
                this.state.dir = calculateDropdownDir(this);
            }
            else {
                var windowOffsetY = window.pageYOffset;
                var windowHeight = window.innerHeight;
                var elY = selectorizer.offsetTop;
                var middleY = (windowOffsetY + windowHeight) / 2;
                this.state.dir = middleY > elY ? "bottom" : "top";
            }
        }
        this.render();
    };
    Selectorizer.prototype.render = function () {
        var _a = this.elements, $label = _a.$label, $wrapper = _a.$wrapper, $dropdown = _a.$dropdown;
        var _b = this.options, renderLabel = _b.renderLabel, renderPlaceholder = _b.renderPlaceholder;
        var classes = this.getClasses();
        var option = this.getOptionByValue(this.state.currentValue);
        var optionText;
        if (option) {
            optionText = renderLabel ? renderLabel(this) : option.text;
        }
        else {
            optionText = renderPlaceholder
                ? renderPlaceholder(this, this.options.placeholder)
                : this.options.placeholder;
        }
        if ($dropdown) {
            var $dropdownList = this.renderDropdownList(this.state.options);
            $dropdown.innerHTML = $dropdownList;
        }
        if ($label) {
            $label.innerHTML = optionText;
        }
        if ($wrapper) {
            $wrapper.className = classes;
        }
    };
    return Selectorizer;
}());
exports.Selectorizer = Selectorizer;
