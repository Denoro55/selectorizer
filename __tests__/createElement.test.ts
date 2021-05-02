import { createElement } from "../src/scripts/helpers";

describe("createElement", () => {
  test("create element 1", () => {
    const div = createElement("div", [], "", [{ key: "index", value: 5 }]);

    expect(div.nodeName).toBe("DIV");
    expect(div.className).toBe("");
    expect(div.getAttribute("index")).toBe("5");
  });

  test("create element 2", () => {
    const div = createElement(
      "span",
      ["selectorizer", "customized"],
      "Select value",
      [
        { key: "type", value: "wrapper" },
      ]
    );

    expect(div.nodeName).toBe("SPAN");
    expect(div.className).toBe("selectorizer customized");
    expect(div.getAttribute("type")).toBe('wrapper');
    expect(div.getAttribute("index")).toBe(null);
    expect(div.innerHTML).toBe('Select value');
  });
});
