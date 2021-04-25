import { selectorize } from "./../src";

let $emptySelect: HTMLSelectElement, $select: HTMLSelectElement;

import {
  MOCK_SELECT_OPTIONS,
  MOCK_SELECT_OPTIONS_2,
} from "../__mocks__/options";

describe("selectorizer", () => {
  beforeEach(() => {
    $emptySelect = document.createElement("select");

    $select = document.createElement("select");
    for (let i = 1; i < 4; i++) {
      const $option = document.createElement("option");
      $option.value = `option ${i}`;
      $option.innerHTML = `option ${i}`;
      $select.appendChild($option);
    }
  });

  test("init", () => {
    const $div = document.createElement("div") as any;

    expect(() => selectorize($div)).toThrow("Element must be a select");
  });

  test("select with no options", () => {
    const selectorizer = selectorize($emptySelect).selectorizers[0];

    expect(selectorizer.elements.$label?.innerHTML).toBe(
      selectorizer.options.placeholder
    );
    expect(selectorizer.state.options.length).toBe(0);
    expect(selectorizer.state.currentValue).toBe("");
    expect(selectorizer.elements.$select.value).toBe("");
  });

  test("select with options", () => {
    const selectorizer = selectorize($select).selectorizers[0];
    const expectedValue = "option 1";

    expect(selectorizer.elements.$label?.innerHTML).toBe(expectedValue);
    expect(selectorizer.state.options.length).toBe(3);
    expect(selectorizer.state.currentValue).toBe(expectedValue);
    expect(selectorizer.elements.$select.value).toBe(expectedValue);
  });

  test("trigger open and close", () => {
    const selectorizer = selectorize($emptySelect).selectorizers[0];

    selectorizer.open();
    expect(selectorizer.state.isOpened).toBe(true);
    expect(selectorizer.elements.$wrapper?.className).toBe(
      "selectorizer selectorizer-open"
    );

    selectorizer.close();
    expect(selectorizer.state.isOpened).toBe(false);
    expect(selectorizer.elements.$wrapper?.className).toBe("selectorizer");
  });

  test("add options", () => {
    const selectorizer = selectorize($emptySelect).selectorizers[0];

    selectorizer.addOptions(MOCK_SELECT_OPTIONS);

    expect(selectorizer.state.options.length).toBe(3);
    expect(selectorizer.elements.$label?.innerHTML).toBe(
      selectorizer.options.placeholder
    );
    expect(selectorizer.state.currentValue).toBe("");
    expect(selectorizer.elements.$select.value).toBe("");
  });

  test("trigger change", () => {
    const selectorizer = selectorize($emptySelect).selectorizers[0];

    expect(selectorizer.elements.$label?.innerHTML).toBe(
      selectorizer.options.placeholder
    );
    expect(selectorizer.state.currentValue).toBe("");
    expect(selectorizer.elements.$select.value).toBe("");

    selectorizer.addOptions(MOCK_SELECT_OPTIONS);
    const nextValue = "option 2";

    selectorizer.change(nextValue);

    expect(selectorizer.elements.$label?.innerHTML).toBe(nextValue);
    expect(selectorizer.state.currentValue).toBe(nextValue);
    expect(selectorizer.elements.$select.value).toBe(nextValue);

    const unknownValue = "unknown value";
    selectorizer.change(unknownValue);

    expect(selectorizer.elements.$label?.innerHTML).toBe(nextValue);
    expect(selectorizer.state.currentValue).toBe(nextValue);
    expect(selectorizer.elements.$select.value).toBe(nextValue);
  });

  test("set options", () => {
    const selectorizer = selectorize($emptySelect).selectorizers[0];
    const expectedValue = "option 2";
    const expectedValue2 = "";

    selectorizer.addOptions(MOCK_SELECT_OPTIONS);
    expect(selectorizer.state.options).toEqual(MOCK_SELECT_OPTIONS);

    selectorizer.change(expectedValue);

    expect(selectorizer.elements.$label?.innerHTML).toBe(expectedValue);
    expect(selectorizer.state.currentValue).toBe(expectedValue);
    expect(selectorizer.elements.$select.value).toBe(expectedValue);

    selectorizer.addOptions(MOCK_SELECT_OPTIONS_2);
    expect(selectorizer.state.options).toEqual([
      ...MOCK_SELECT_OPTIONS,
      ...MOCK_SELECT_OPTIONS_2,
    ]);

    selectorizer.setOptions(MOCK_SELECT_OPTIONS_2);
    expect(selectorizer.state.options).toStrictEqual(MOCK_SELECT_OPTIONS_2);

    expect(selectorizer.elements.$label?.innerHTML).toBe(
      selectorizer.options.placeholder
    );
    expect(selectorizer.state.currentValue).toBe(expectedValue2);
    expect(selectorizer.elements.$select.value).toBe(expectedValue2);
  });

  test("render option", () => {
    const additionalText = ' additional text';
    const exptectedValue = 'option 1';

    const selectorizer = selectorize($select, {
      renderOption: (select, option) => option.value + additionalText
    }).selectorizers[0];
    
    const $firstOption = selectorizer.elements.$dropdown?.children[0];
    
    expect($firstOption?.innerHTML).toBe(
      selectorizer.state.options[0].value + additionalText
    );

    expect(selectorizer.state.currentValue).toBe(exptectedValue);
    expect(selectorizer.elements.$select.value).toBe(exptectedValue);
  });

  test("render option 2", () => {
    const additionalText = ' additional text';
    const exptectedValue = 'option 1';

    const selectorizer = selectorize($select, {
      renderOption: (select, option) => option.value + additionalText
    }).selectorizers[0];

    selectorizer.addOptions(MOCK_SELECT_OPTIONS_2);

    const $fourthOption = selectorizer.elements.$dropdown?.children[3];
    
    expect($fourthOption?.innerHTML).toBe(
      selectorizer.state.options[3].value + additionalText
    );

    expect(selectorizer.state.currentValue).toBe(exptectedValue);
    expect(selectorizer.elements.$select.value).toBe(exptectedValue);
  });

  test("render label", () => {
    const expectedLabel = 'render label';
    const exptectedValue = "option 3"

    const selectorizer = selectorize($select, {
      renderLabel: () => expectedLabel
    }).selectorizers[0];
    
    expect(selectorizer.elements.$label?.innerHTML).toBe(
      expectedLabel
    );

    expect(selectorizer.state.options[2].value).toBe(
      exptectedValue
    );

    selectorizer.change(exptectedValue);

    expect(selectorizer.elements.$label?.innerHTML).toBe(
      expectedLabel
    );
    expect(selectorizer.state.currentValue).toBe(exptectedValue);
    expect(selectorizer.elements.$select.value).toBe(exptectedValue);
  });
});
