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

export const getOptions = ($optionsNodes: HTMLOptionsCollection) => {
  const options: ISelectOption[] = Array.prototype.slice.call($optionsNodes);
  return options.map(({ text, value, disabled, selected }) => {
    return { text, value, disabled, selected };
  });
};

export const getPluginClass = (clz: string, delimiter: "__" | "-") =>
  `${PLUGIN_NAME}${delimiter}${clz}`;

export const toPx = (value: number) => `${value}px`;

export const getClosestElement = (
  element: HTMLElement,
  clazz: string
): HTMLElement | null => {
  if (!element) return null;

  if (element.classList.contains(clazz)) {
    return element;
  }

  if (element.parentElement) {
    return getClosestElement(element.parentElement, clazz);
  }

  return null;
};

export const getSelectedOptionsIndexes = (
  options: ISelectOption[]
): number[] => {
  return options.reduce((acc: number[], option, index) => {
    return option.selected ? [...acc, index] : acc;
  }, []);
};

export const getIndexesFromValues = (
  value: string | string[],
  options: ISelectOption[]
): number[] => {
  const values: string[] = Array.isArray(value) ? value : [value];

  return values.reduce((acc: number[], value) => {
    const optionIndex = options.findIndex(opt => opt.value === value);
    if (optionIndex !== -1) {
      return [...acc, optionIndex];
    }
    return acc;
  }, []);
};

export const getValuesFromIndexes = (
  selected: number[],
  options: ISelectOption[]
): string[] => {
  return selected.reduce((acc: string[], selectedIndex: number) => {
    const option = options[selectedIndex];
    return option ? [...acc, options[selectedIndex].value] : acc;
  }, []);
};

export const joinByDelimiter = (
  values: string[],
  delimiter: string
): string => {
  return values.join(delimiter);
};
