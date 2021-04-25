import "@babel/polyfill";

import { PLUGIN_NAME } from "./scripts/const";
import { IOptions } from "./scripts/types";
import { Selectorizer } from "./scripts/Selectorizer";
import { Controller } from "./scripts/Controller";

const validateSelects = ($selects: HTMLSelectElement[]) => {
  $selects.forEach(($select) => {
    if (!($select instanceof HTMLSelectElement)) {
      throw new Error("Element must be a select");
    }
  });
};

export const selectorize = (
  $selectElement: HTMLSelectElement | NodeListOf<HTMLSelectElement>,
  options?: IOptions
): Controller => {
  const $selects =
    $selectElement instanceof NodeList
      ? Array.from($selectElement)
      : [$selectElement];

  validateSelects($selects);

  const selectorizers: Selectorizer[] = [];

  const init = ($select: HTMLSelectElement) => {
    $select[PLUGIN_NAME] = new Selectorizer($select, options);
  };

  $selects.forEach(($select) => {
    const selectorizer = $select[PLUGIN_NAME] as Selectorizer;

    if (!selectorizer) {
      // first init
      init($select);
    } else {
      if (options) {
        // reinit
        selectorizer.destroy();
        init($select);
      }
    }

    selectorizers.push($select[PLUGIN_NAME]);
  });

  return new Controller(selectorizers);
};
