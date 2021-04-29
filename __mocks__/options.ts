export const MOCK_SELECT_OPTIONS = [
  { text: "option 1", value: "option 1" },
  { text: "option 2", value: "option 2" },
  { text: "option 3", value: "option 3" },
];

export const MOCK_SELECT_OPTIONS_2 = [
  { text: "option 4", value: "option 4" },
  { text: "option 5", value: "option 5" },
  { text: "option 6", value: "option 6" },
];

export const generateOptions = (
  count: number
): { text: string; value: string; selected?: boolean }[] => {
  return new Array(count).fill("").map((item, index) => ({
    text: `option ${index + 1}`,
    value: `option ${index + 1}`,
  }));
};
