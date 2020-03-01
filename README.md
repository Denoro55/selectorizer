This package with native javascript will help you to create a simple wrapper for your selects and get useful methods.

``
npm i selectorizer --save-dev
``

##### Version 4.0.0
- fixed errors in Internet Explorer 10+
- methods has become shorter (selectorizer-open => open)
- fixed rendering position of list after refresh


**Works in IE 10+**

### implemented methods:
- trigger (change, refresh)
- on (change, before-open, open, before-close, close)

### options:
- nativeOnMobile (boolean)
- iconHtml (string)
- classes (string or array)

## How to use:

```js
import selectorize from 'selectorizer';
import 'selectorizer/style.css';

var selects = document.querySelectorAll("select");

selectorize(selects, {
    nativeOnMobile: true,
    iconHtml: '<div class="my-icon"></div>',
    classes: ['my-class', 'my-class-2']
});

selectorize(selects).trigger("change", "value #7");  // change value of all selects

selectorize(selects).on("open", function(select, value) {
    console.log("open!", select, value);
});

selectorize(selects).on("close", function(select, value) {
    console.log("close!", select, value);
});

selectorize(selects).on("before-open", function(select, value) {
    console.log("before open!", select, value);
});

selectorize(selects).on("before-close", function(select, value) {
    console.log("before close!", select, value);
});

selectorize(selects).on("change", function(
    select,
    value,
    prevValue
) {
    console.log("value changed ", select, value, prevValue);
});

var option = document.createElement("option");
option.value = "newValue";
option.text = "newValue";
selects[0].appendChild(option);

setTimeout(function() {
    selectorize(selects).trigger("refresh"); // refresh list
}, 3000);
```

----------------------------------------------------------

Other methods and updates soon
