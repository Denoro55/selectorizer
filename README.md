This package with native javascript will help you to create a simple wrapper for your selects and get useful methods.

**Package requires babel**

### implemented methods:
- trigger (change, refresh)
- on (selectorizer-change, selectorizer-before-open, selectorizer-open, selectorizer-before-close, selectorizer-close)

### options:
- nativeOnMobile
- iconHtml

## How to use:

```js
import selectorize from 'selectorizer';
import 'selectorizer/style.css';

const selects = document.querySelectorAll('select');

selectorize(selects, {
    nativeOnMobile: true,
    iconHtml: '<div class="my-icon"></div>'
});

selectorize(selects).trigger('change', 'value #7'); // changes value of all selects

selectorize(selects).on('selectorizer-open', (select, value) => {
    console.log('open!', select, value)
});

selectorize(selects).on('selectorizer-close', (select, value) => {
    console.log('close!', select, value)
});

selectorize(selects).on('selectorizer-before-open', (select, value) => {
    console.log('before open!', select, value)
});

selectorize(selects).on('selectorizer-before-close', (select, value) => {
    console.log('before close!', select, value)
});

selectorize(selects).on('selectorizer-change', (select, value, prevValue) => { // handler
    console.log('value changed ', select, value, prevValue);
});

const option = document.createElement('option');
option.value = 'newValue';
option.text = 'newValue';
selects[0].append(option);

setTimeout(() => {
    selectorize(selects[0]).trigger('refresh'); // refresh list
}, 3000);
```

----------------------------------------------------------

Other methods and updates soon
