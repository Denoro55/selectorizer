import { getValuesFromIndexes } from "../src/scripts/helpers";

import { generateOptions } from "../__mocks__/options";

const MOCK_SELECT_OPTIONS = generateOptions(3);

const getOptionValue = (index: number) => {
  return MOCK_SELECT_OPTIONS[index].value;
}

describe("getValuesFromIndexes", () => {
  test("test empty", () => {
    expect(getValuesFromIndexes([], MOCK_SELECT_OPTIONS)).toEqual([]);
  });

  test("one selected option", () => {
    expect(getValuesFromIndexes([1], MOCK_SELECT_OPTIONS)).toEqual([getOptionValue(1)]);
  });

  test("all options are selected", () => {
    expect(getValuesFromIndexes([0, 1, 2], MOCK_SELECT_OPTIONS)).toEqual([
      getOptionValue(0),
      getOptionValue(1),
      getOptionValue(2),
    ]);
  });

  test("selected options that does not exist", () => {
    expect(getValuesFromIndexes([0, 2, 3, 4], MOCK_SELECT_OPTIONS)).toEqual([
      getOptionValue(0),
      getOptionValue(2),
    ]);
  });
});
