import { getIndexesFromValues } from "../src/scripts/helpers";

import { generateOptions } from "../__mocks__/options";

const MOCK_SELECT_OPTIONS = generateOptions(3);

const getOptionValue = (index: number) => {
  return MOCK_SELECT_OPTIONS[index].value;
};

describe("getIndexesFromValues", () => {
  test("test empty", () => {
    expect(getIndexesFromValues([], MOCK_SELECT_OPTIONS)).toEqual([]);
  });

  test("one selected value", () => {
    expect(
      getIndexesFromValues([getOptionValue(0)], MOCK_SELECT_OPTIONS)
    ).toEqual([0]);
  });

  test("all values are selected", () => {
    expect(
      getIndexesFromValues(
        [getOptionValue(2), getOptionValue(1), getOptionValue(0)],
        MOCK_SELECT_OPTIONS
      )
    ).toEqual([2, 1, 0]);
  });

  test("values that does not exist", () => {
    expect(
      getIndexesFromValues(
        [getOptionValue(0), getOptionValue(2), 'unknown value'],
        MOCK_SELECT_OPTIONS
      )
    ).toEqual([0, 2]);
  });
});
