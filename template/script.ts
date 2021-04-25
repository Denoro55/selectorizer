import "selectorizer/lib/styles/index.scss";
import { selectorize } from 'selectorizer';

// node list
const selects = document.querySelectorAll("select");

setTimeout(() => {
  selectorize(selects);
}, 2000);

setTimeout(() => {
  selectorize(selects).destroy();
}, 5000);

setTimeout(() => {
  selectorize(selects);
}, 8000);

// selectorize(selects, {
//   withIcon: false,
//   classes: ["my-class"],
//   callbacks: {
//     init: (selectorizer) => {
//       const state = selectorizer.getState();
//       const $elements = selectorizer.getElements();
//       const $wrapper = selectorizer.getWrapper();
//       const $select = selectorizer.getSelect();
//       const config = selectorizer.getConfig();

//       console.log("init", selectorizer, state, $elements, $wrapper, $select, config);
//     },
//   },
//   calculateDropdownDir: (select) => 'bottom',
//   renderOption: (select, option) =>
//     `<div class="my-awesome-option">${option.text}</div>`,
//   renderLabel: (select) =>
//     `<div class="my-awesome-label">${select.getState().currentValue}</div>`,
//   renderPlaceholder: (select, placeholder) =>
//     `<div class="my-awesome-placeholder">${placeholder}</div>`,
// });

// // ok. let's start to do something with our selects
// setTimeout(() => {
//   selectorize(selects).open(); // open selects
// }, 1000);

// setTimeout(() => {
//   selectorize(selects).close(); // close selects
// }, 2000);

// setTimeout(() => {
//   selectorize(selects).change("3"); // change value of selects
// }, 3000);

// setTimeout(() => {
//   selectorize(selects).addOptions([
//     { value: "new option 1", text: "new option 1" },
//     { value: "new option 2", text: "new option 2" },
//   ]); // add new options
// }, 4000);

// setTimeout(() => {
//   selectorize(selects).setOptions([
//     { value: "new option 1", text: "new option 1" },
//     { value: "new option 2", text: "new option 2" },
//   ]); // set new options
// }, 5000);

// setTimeout(() => {
//   const $option = document.createElement("option");
//   $option.value = "new value";
//   $option.text = "new value";
//   selects[0].appendChild($option);

//   selectorize(selects[0]).refresh();

//   console.log(selectorize(selects).getValues());
// }, 6000);
