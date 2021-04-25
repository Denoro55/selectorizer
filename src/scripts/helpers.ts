import { PLUGIN_NAME } from "./const";
import { ISelectOption, IElementDataset } from "./types";

export const createElement = (
  tag: string,
  cls: string[],
  text: string,
  datasetArray: IElementDataset[] = []
) => {
  const el = document.createElement(tag);
  el.className = cls.join(" ");
  el.innerHTML = text;

  datasetArray.forEach((dataName) => {
    const value = dataName.value.toString();
    el.setAttribute(dataName.key, value);
  });

  return el;
};

export const wrapElement = ($parent: HTMLElement, $child: HTMLElement) => {
  if ($child.parentNode) {
    $child.parentNode.insertBefore($parent, $child);
    $parent.appendChild($child);
  }
};

export const getOptions = ($optionsNodes: NodeList) => {
  const options: ISelectOption[] = Array.prototype.slice.call($optionsNodes);
  return options.map(({ text, value }) => {
    return { text, value };
  });
};

export const getPluginClass = (clz: string, delimiter: "__" | "-") =>
  `${PLUGIN_NAME}${delimiter}${clz}`;

export const toPx = (value: number) => `${value}px`;

export const getClosestElement = (element: HTMLElement, clazz: string): HTMLElement | null => {
	if (!element) return null;
  
	if (element.classList.contains(clazz)) {
  	return element;
  }

  if (element.parentElement) {
    return getClosestElement(element.parentElement, clazz)
  }

  return null;
}