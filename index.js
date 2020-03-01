"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var pluginName = 'selectorizer';
document.body.addEventListener('click', function (e) {
  closeOther(e);
});

var closeOther = function closeOther(e) {
  var selects = document.querySelectorAll(".".concat(pluginName));
  Array.prototype.forEach.call(selects, function (el) {
    if (!el.contains(e.target)) {
      var select = el.querySelector('select');
      select[pluginName].close();
    }
  });
};

var createElement = function createElement(tag, cls, text) {
  var el = document.createElement(tag);
  el.className = cls;
  el.textContent = text;
  return el;
};

var getSiblings = function getSiblings(elem) {
  // Setup siblings array and get the first sibling
  var siblings = [];
  var sibling = elem.parentNode.firstChild; // Loop through each sibling and push to the array

  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== elem) {
      siblings.push(sibling);
    }

    sibling = sibling.nextSibling;
  }

  return siblings;
};

var Selectorizer = /*#__PURE__*/function () {
  function Selectorizer(select) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Selectorizer);

    this.select = select;
    this.state = {
      opened: false,
      position: 'top',
      currentValue: ''
    };
    this.events = {};
    this.params = params;
    this.init();
  }

  _createClass(Selectorizer, [{
    key: "init",
    value: function init() {
      var _this = this;

      var select = this.select;

      if (this.isMobile()) {
        select.classList.add('native');
      }

      var element = createElement('div', pluginName, '');
      this.applyClasses(element, this.params.classes);
      var inner = createElement('div', "".concat(pluginName, "__inner"), '');
      element.appendChild(inner);
      var icon = createElement('div', "".concat(pluginName, "__icon"), '');

      if (this.params.iconHtml) {
        icon.innerHTML = this.params.iconHtml;
      }

      inner.appendChild(icon);
      var currentOptions = this.select.querySelectorAll('option');
      var text = createElement('div', "".concat(pluginName, "__text"), currentOptions[0].innerText);
      inner.appendChild(text);
      this.state.currentValue = currentOptions[0].value;
      var list = this.generateList();
      element.appendChild(list);
      inner.addEventListener('click', function (e) {
        if (_this.isMobile()) {
          return;
        }

        closeOther(e);

        _this.toggle();
      });
      select.parentNode.insertBefore(element, select);
      element.appendChild(select);
      select.addEventListener('change', function (e) {
        _this.change(e.target.value);
      });
      this.elements = {
        selectorizer: element,
        list: list,
        text: text
      };
    }
  }, {
    key: "applyClasses",
    value: function applyClasses(element, classes) {
      if (!Array.isArray(classes)) {
        classes = [classes];
      }

      classes.forEach(function (cls) {
        element.classList.add(cls);
      });
    }
  }, {
    key: "isMobile",
    value: function isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && this.params.nativeOnMobile;
    }
  }, {
    key: "refresh",
    value: function refresh() {
      var newList = this.generateList();
      this.elements.list.parentNode.removeChild(this.elements.list);
      this.elements.selectorizer.appendChild(newList);
      this.elements.list = newList;
      this.updatePosition();
      this.render();
    }
  }, {
    key: "updateValue",
    value: function updateValue(value) {
      if (this.state.currentValue !== value) {
        var prevValue = this.state.currentValue;
        this.state.currentValue = value;
        this.triggerEvent('change', prevValue);
        return true;
      }

      return false;
    }
  }, {
    key: "change",
    value: function change(value) {
      if (this.updateValue(value)) {
        this.render();
      }
    }
  }, {
    key: "updatePosition",
    value: function updatePosition() {
      var selectorizer = this.elements.selectorizer;
      var position = window.pageYOffset;
      var h = window.innerHeight;
      var elY = selectorizer.offsetTop;
      var calc = (position + h) / 2;
      this.state.position = calc < elY ? 'bottom' : 'top';
      console.log(calc, elY, this.state.position);
    }
  }, {
    key: "toggle",
    value: function toggle() {
      this.updatePosition();

      if (this.state.opened) {
        this.close();
      } else {
        this.open();
      }
    }
  }, {
    key: "open",
    value: function open() {
      if (!this.state.opened) {
        this.updatePosition();
        this.state.opened = true;
        this.triggerEvent('before-open');
        this.render();
        this.triggerEvent('open');
      }
    }
  }, {
    key: "close",
    value: function close() {
      if (this.state.opened) {
        this.updatePosition();
        this.state.opened = false;
        this.triggerEvent('before-close');
        this.render();
        this.triggerEvent('close');
      }
    }
  }, {
    key: "render",
    value: function render() {
      var state = this.state;
      var _this$elements = this.elements,
          selectorizer = _this$elements.selectorizer,
          list = _this$elements.list,
          text = _this$elements.text;
      var select = this.select;
      select.value = state.currentValue;
      var currentIndex = select.selectedIndex || 0;
      var option = selectorizer.querySelectorAll(".".concat(pluginName, "__item"))[currentIndex];

      if (option) {
        text.innerText = option.innerText;
        getSiblings(option).forEach(function (sibling) {
          sibling.classList.remove('active');
        });
        option.classList.add('active');
      } else {
        text.innerText = '';
      }

      if (state.opened) {
        selectorizer.classList.add('opened');
      } else {
        selectorizer.classList.remove('opened');
      }

      if (state.position === 'top') {
        list.style.top = '100%';
        list.style.bottom = 'auto';
      } else {
        list.style.top = 'auto';
        list.style.bottom = '100%';
      }
    }
  }, {
    key: "triggerEvent",
    value: function triggerEvent(eventName) {
      if (this.events.hasOwnProperty(eventName)) {
        var _this$events;

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        (_this$events = this.events)[eventName].apply(_this$events, [this.select, this.state.currentValue].concat(args));
      }
    }
  }, {
    key: "on",
    value: function on(eventName, cb) {
      if (!this.events.hasOwnProperty(eventName)) {
        this.events[eventName] = cb;
      }
    }
  }, {
    key: "generateList",
    value: function generateList() {
      var _this2 = this;

      var list = createElement('ul', "".concat(pluginName, "__list"), '');
      var currentOptions = this.select.querySelectorAll('option');
      Array.prototype.forEach.call(currentOptions, function (option) {
        var value = option.value;
        var text = option.text;
        var li = createElement('li', "".concat(pluginName, "__item"), text);
        li.addEventListener('click', function () {
          _this2.updateValue(value);

          _this2.close();
        });
        list.appendChild(li);
      });
      return list;
    }
  }]);

  return Selectorizer;
}();

var Data = /*#__PURE__*/function () {
  function Data() {
    _classCallCheck(this, Data);

    this.selects = [];
  }

  _createClass(Data, [{
    key: "add",
    value: function add(item) {
      this.selects.push(item);
    }
  }, {
    key: "trigger",
    value: function trigger(methodName) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      this.selects.forEach(function (e) {
        e[methodName].apply(e, args);
      });
    }
  }, {
    key: "on",
    value: function on() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      this.trigger.apply(this, ['on'].concat(args));
    }
  }]);

  return Data;
}();

var selectorize = function selectorize(element, params) {
  var items;

  if (!(element instanceof NodeList)) {
    items = [element];
  } else {
    items = element;
  }

  var map = new Data();
  Array.prototype.forEach.call(items, function (select) {
    var data = select[pluginName];

    if (!data) {
      select[pluginName] = new Selectorizer(select, params);
      map.add(select[pluginName]);
    } else {
      map.add(data);
    }
  });
  return map;
};

var _default = selectorize;
exports["default"] = _default;