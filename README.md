Do you wanna beautify your selects using pure javascript or typescript? Ok. This package was created for you.
I have written the most used methods in my opinion.

##### Version 5.0.0

- package has fully rewritten in typescript
- new methods

**Works in IE 10+**

### implemented methods:

- getValues
- open
- close
- change
- addOptions
- setOptions
- refresh
- destroy

### implemented callbacks:

- before init
- init
- before open
- open
- before close
- close
- before change
- change
- before refresh
- refresh
- before destroy
- destroy

### options:

- withIcon?: boolean;
- iconHtml?: string;
- isNativeOnMobile?: boolean;
- maxHeight?: number;
- classes?: string[];
- placeholder?: string;
- closeOnClickOutside?: boolean;
- isMobile?: () => boolean;
- renderOption?: (select: Selectorizer, option: ISelectOption, isSelected: boolean) => string;
- renderLabel?: (select: Selectorizer) => string;
- renderPlaceholder?: (select: Selectorizer, placeholder: string) => string;
- calculateDropdownDir?: (select: Selectorier) => 'bottom' | 'top';
- callbacks?: { ...see callbacks below }

### callbacks:

- beforeInit?: (select: Selectorizer) => void;
- init?: (select: Selectorizer) => void;
- beforeOpen?: (select: Selectorizer) => void;
- open?: (select: Selectorizer) => void;
- beforeClose?: (select: Selectorizer) => void;
- close?: (select: Selectorizer) => void;
- beforeChange?: (select: Selectorizer) => void;
- change?: (select: Selectorizer) => void;
- beforeRefresh?: (select: Selectorizer) => void;
- refresh?: (select: Selectorizer) => void;
- beforeDestroy?: (select: Selectorizer) => void;
- destroy?: (select: Selectorizer) => void;

## How to use:

```ts
import "selectorizer/lib/styles/index.scss";
import { selectorize } from "selectorizer";

// node list
const selects = document.querySelectorAll("select");
selectorize(selects);

// single select
const singleSelect = document.querySelector("select");
if (singleSelect) {
  selectorize(singleSelect);
}

// Warning! If you want to reinit your selectorizer just specify second argument
// Note that current value will reset as reinit calls destroy method
const selects = document.querySelectorAll("select");

// first init
selectorize(selects);

// reinit
selectorize(selects, {
  withIcon: false,
});

// init with some options
const selects = document.querySelectorAll("select");
selectorize(selects, {
  withIcon: false,
  classes: ["my-class"],
  callbacks: {
    init: (selectorizer) => {
      const state = selectorizer.getState();
      const $elements = selectorizer.getElements();
      const $wrapper = selectorizer.getWrapper();
      const $select = selectorizer.getSelect();
      const config = selectorizer.getConfig();

      console.log(
        "init",
        selectorizer,
        state,
        $elements,
        $wrapper,
        $select,
        config
      );
    },
  },
  renderOption: (select, option) =>
    `<div class="my-awesome-option">${option.text}</div>`,
  renderLabel: (select) =>
    `<div class="my-awesome-label">${select.getState().currentValue}</div>`,
  renderPlaceholder: (select, placeholder) =>
    `<div class="my-awesome-placeholder">${placeholder}</div>`,
});

// ok. let's start to do something with our selects

// *** get values of selects ***
selectorize(selects).getValues();
// [ { name: 'select-1', value: 'option 1' }, { name: 'select-2', value: 'option 1' } ]

// *** open selects ***
selectorize(selects).open();

// *** close selects ***
selectorize(selects).close();

// *** change value of selects ***
selectorize(selects).change("option 3");

// *** add new options ***
selectorize(selects).addOptions([
  { value: "new option 1", text: "new option 1" },
  { value: "new option 2", text: "new option 2" },
]);

// Warning! You can also update your native select without implemented methods, but then you must call refresh method
const $select = document.createElement("select");
const selectorizer = selectorize($select);

// append new option
const $option = document.createElement("option");
$option.value = "new value";
$option.text = "new value";
$select.appendChild(option);

// refresh selectorizer
selectorizer.refresh();

// *** set only specified options ***
selectorize(selects).setOptions([
  { value: "new option 1", text: "new option 1" },
  { value: "new option 2", text: "new option 2" },
]);

// *** destroy :( ***
selectorize(selects).destroy();
```

---

Multiple selects soon
