import { getSelectedOptionsIndexes } from "../src/scripts/helpers";

import { generateOptions } from "../__mocks__/options";

const MOCK_SELECT_OPTIONS = generateOptions(3);
MOCK_SELECT_OPTIONS[1].selected = true;
MOCK_SELECT_OPTIONS[2].selected = true;

describe("getSelectedOptionsIndexes", () => {
  test("test empty", () => {
    expect(getSelectedOptionsIndexes([])).toEqual([]);
  });

  test("two selected options", () => {
    expect(getSelectedOptionsIndexes(MOCK_SELECT_OPTIONS)).toEqual([1, 2]);
  });
});
