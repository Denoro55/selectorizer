import { Selectorizer } from "./Selectorizer";
import { ISelectOption } from "./types";

export class Controller {
  selectorizers: Selectorizer[];
  
  constructor(selectorizers: Selectorizer[]) {
    this.selectorizers = selectorizers;
  }

  open() {
    this.selectorizers.forEach((selectorizer) => {
      selectorizer.open();
    });
  }

  close() {
    this.selectorizers.forEach((selectorizer) => {
      selectorizer.close();
    });
  }

  change(newValue: string) {
    this.selectorizers.forEach((selectorizer) => {
      selectorizer.change(newValue);
    });
  }

  refresh() {
    this.selectorizers.forEach((selectorizer) => {
      selectorizer.refresh();
    });
  }

  destroy() {
    this.selectorizers.forEach((selectorizer) => {
      selectorizer.destroy();
    });
  }

  addOptions(newOptions: ISelectOption[]) {
    this.selectorizers.forEach((selectorizer) => {
      selectorizer.addOptions(newOptions);
    });
  }

  setOptions(newOptions: ISelectOption[]) {
    this.selectorizers.forEach((selectorizer) => {
      selectorizer.setOptions(newOptions);
    });
  }

  getValues() {
    return this.selectorizers.map((selectorizer) => {
      const { name, value } = selectorizer.getSelect();
      return { name, value };
    });
  }
}
