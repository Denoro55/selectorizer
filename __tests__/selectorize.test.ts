import { selectorize } from "../src";

import { generateOptions } from "../__mocks__/options";
import { $createSelect } from "../__mocks__/dom";

let $emptySelect: HTMLSelectElement, $singleSelect: HTMLSelectElement;

describe("selectorizer", () => {
  beforeEach(() => {
    $emptySelect = $createSelect(0);
    $singleSelect = $createSelect(3);
  });

  test("init not a select", () => {
    document.body.appendChild(document.createElement("div"));
    document.body.appendChild(document.createElement("div"));

    const $divs = document.querySelectorAll("div") as any;

    expect(() => selectorize($divs[0])).toThrow("Element must be a select");
    expect(() => selectorize($divs)).toThrow(
      "All of the elements must be a select"
    );
  });

  test("init single select with no options", () => {
    const selectorizer = selectorize($emptySelect).selectorizers[0];

    expect(selectorizer.getElements().$label?.innerHTML).toBe(
      selectorizer.getConfig().placeholder
    );
    expect(selectorizer.getState().options.length).toBe(0);
    expect(selectorizer.getCurrentValue()).toBe("");
    expect(selectorizer.getElements().$select.value).toBe("");
  });

  test("init single select with options", () => {
    const selectorizer = selectorize($singleSelect).selectorizers[0];
    const expectedValue = "option 1";

    expect(selectorizer.getElements().$label?.innerHTML).toBe(expectedValue);
    expect(selectorizer.getState().options.length).toBe(3);
    expect(selectorizer.getCurrentValue()).toBe(expectedValue);
    expect(selectorizer.getElements().$select.value).toBe(expectedValue);
  });

  test("init multiple select without selected options", () => {
    const selectorizer = selectorize($createSelect(3, [], true))
      .selectorizers[0];
    const expectedValue = "";

    expect(selectorizer.getElements().$label?.innerHTML).toBe(
      selectorizer.getConfig().placeholder
    );
    expect(selectorizer.getState().options.length).toBe(3);
    expect(selectorizer.getCurrentValue()).toBe(expectedValue);
    expect(selectorizer.getElements().$select.value).toBe(expectedValue);
  });

  test("init multiple select with selected options", () => {
    const selectorizer = selectorize($createSelect(3, [1, 2], true))
      .selectorizers[0];
    const expectedValues = ["option 2", "option 3"];

    expect(selectorizer.getElements().$label?.innerHTML).toBe(
      expectedValues.join(",")
    );
    expect(selectorizer.getState().options.length).toBe(3);
    expect(selectorizer.getState().options[1].selected).toBeTruthy();
    expect(selectorizer.getState().options[2].selected).toBeTruthy();
    expect(selectorizer.getState().selected).toEqual([1, 2]);
    expect(selectorizer.getCurrentValue()).toBe(expectedValues.join(","));
    expect(selectorizer.getElements().$select.value).toBe(expectedValues[0]);
  });

  test("open and close", () => {
    const selectorizer = selectorize($emptySelect).selectorizers[0];

    selectorizer.open();
    expect(selectorizer.getState().isOpened).toBe(true);
    expect(selectorizer.getElements().$wrapper?.className).toBe(
      "selectorizer selectorizer-open"
    );

    selectorizer.close();
    expect(selectorizer.getState().isOpened).toBe(false);
    expect(selectorizer.getElements().$wrapper?.className).toBe("selectorizer");
  });

  test("change single select", () => {
    const selectorizer = selectorize($singleSelect).selectorizers[0];

    const expectedValue = "option 1";
    const newValue = "option 3";

    const elements = selectorizer.getElements();

    expect(elements.$label?.innerHTML).toBe(expectedValue);
    expect(selectorizer.getCurrentValue()).toBe(expectedValue);
    expect(elements.$select.value).toBe(expectedValue);

    selectorizer.change(newValue);

    expect(elements.$label?.innerHTML).toBe(newValue);
    expect(selectorizer.getCurrentValue()).toBe(newValue);
    expect(elements.$select.value).toBe(newValue);

    const unknownValue = "unknown value";
    selectorizer.change(unknownValue);

    expect(elements.$label?.innerHTML).toBe(selectorizer.getConfig().placeholder);
    expect(selectorizer.getCurrentValue()).toBe("");
    expect(elements.$select.value).toBe("");
  });

  test("change multiple select", () => {
    const selectorizer = selectorize($createSelect(3, [1], true))
      .selectorizers[0];
    const expectedValue = "option 2";
    const newValues = ["option 1", "option 2", "option 3"];
    const newValues2 = ["option 1", "option 2"];

    expect(selectorizer.getElements().$label?.innerHTML).toBe(expectedValue);
    selectorizer.change(newValues);
    expect(selectorizer.getCurrentValue()).toBe(newValues.join(','));

    expect(selectorizer.getElements().$select.options[0].selected).toBeTruthy();
    expect(selectorizer.getElements().$select.options[1].selected).toBeTruthy();
    expect(selectorizer.getElements().$select.options[2].selected).toBeTruthy();

    selectorizer.change(newValues2);
    expect(selectorizer.getCurrentValue()).toBe(newValues2.join(','));

    expect(selectorizer.getElements().$select.options[0].selected).toBeTruthy();
    expect(selectorizer.getElements().$select.options[1].selected).toBeTruthy();
    expect(selectorizer.getElements().$select.options[2].selected).toBeFalsy();
  });

  test("add options", () => {
    const selectorizer = selectorize($emptySelect).selectorizers[0];

    selectorizer.addOptions(generateOptions(3));

    expect(selectorizer.getState().options.length).toBe(3);
    expect(selectorizer.getElements().$label?.innerHTML).toBe(
      selectorizer.getConfig().placeholder
    );
    expect(selectorizer.getCurrentValue()).toBe("");
    expect(selectorizer.getElements().$select.value).toBe("");
  });

  test("set options", () => {
    const selectorizer = selectorize($singleSelect).selectorizers[0];

    expect(selectorizer.getState().options.length).toBe(3);
    selectorizer.setOptions(generateOptions(2));
    expect(selectorizer.getState().options.length).toBe(2);
  });

  test("render option", () => {
    const additionalText = " additional text";
    const exptectedValue = "option 1";

    const selectorizer = selectorize($singleSelect, {
      renderOption: (select, option) => option.value + additionalText,
    }).selectorizers[0];

    expect(selectorizer.getElements().$dropdown?.children[0]?.innerHTML).toBe(
      selectorizer.getState().options[0].value + additionalText
    );
    expect(selectorizer.getElements().$dropdown?.children[1].innerHTML).toBe(
      selectorizer.getState().options[1].value + additionalText
    );

    expect(selectorizer.getCurrentValue()).toBe(exptectedValue);
    expect(selectorizer.getElements().$select.value).toBe(exptectedValue);
  });

  test("render label", () => {
    const expectedLabel = "custom label";
    const exptectedValue = "option 3";

    const selectorizer = selectorize($singleSelect, {
      renderLabel: () => expectedLabel,
    }).selectorizers[0];

    expect(selectorizer.getElements().$label?.innerHTML).toBe(expectedLabel);

    expect(selectorizer.getState().options[2].value).toBe(exptectedValue);

    selectorizer.change(exptectedValue);

    expect(selectorizer.getElements().$label?.innerHTML).toBe(expectedLabel);
    expect(selectorizer.getCurrentValue()).toBe(exptectedValue);
    expect(selectorizer.getElements().$select.value).toBe(exptectedValue);
  });
});
