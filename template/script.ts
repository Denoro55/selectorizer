import "./styles.scss";
import "../src/styles/index.scss";
import { selectorize } from "../src";

// node list
const selects = document.querySelectorAll(
  ".js-select"
) as NodeListOf<HTMLSelectElement>;

selectorize(selects);
selectorize(selects[2], {
  classes: ["customized"],
  iconHtml: '<div class="status"></div>',
  renderLabel: (selectorizer) => {
    const selectedCount = selectorizer.getState().selected.length;

    if (selectedCount === 0) return `Select at least 3 options`;
    if (selectedCount < 3) return `Select ${3 - selectedCount} more options`;

    return selectorizer.getCurrentValue();
  },
  renderOption: (selectorizer, option) => {
    return `<div class="option">
      <input type="checkbox" ${option.selected ? "checked" : ""} ${
      option.disabled ? "disabled" : ""
    } class="option__checkbox">
      <div class="option__text">${option.text}</div>
    </div>`;
  },
});
