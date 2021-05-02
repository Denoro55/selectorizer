import { Selectorizer } from "./Selectorizer";

export interface ISelectOption {
  text: string;
  value: string;
  disabled?: boolean;
  selected?: boolean;
}

export interface IElementDataset {
  key: string;
  value: string | number;
}

export interface IState {
  isOpened: boolean;
  isNative: boolean;
  options: ISelectOption[];
  selected: number[];
  dir: "bottom" | "top";
}

export interface IElements {
  $select: HTMLSelectElement;
  $wrapper: HTMLElement | null;
  $inner: HTMLElement | null;
  $label: HTMLElement | null;
  $icon: HTMLElement | null;
  $dropdown: HTMLElement | null;
}

export enum EClasses {
  open = "open",
  native = "native",
  inverted = "inverted",
}

export interface IOptions {
  withIcon?: boolean;
  iconHtml?: string;
  isNativeOnMobile?: boolean;
  callbacks?: {
    beforeInit?: (select: Selectorizer) => void;
    init?: (select: Selectorizer) => void;
    beforeOpen?: (select: Selectorizer) => void;
    open?: (select: Selectorizer) => void;
    beforeClose?: (select: Selectorizer) => void;
    close?: (select: Selectorizer) => void;
    beforeChange?: (select: Selectorizer) => void;
    change?: (select: Selectorizer) => void;
    beforeRefresh?: (select: Selectorizer) => void;
    refresh?: (select: Selectorizer) => void;
    click?: (select: Selectorizer) => void;
    beforeDestroy?: (select: Selectorizer) => void;
    destroy?: (select: Selectorizer) => void;
  };
  maxHeight?: number;
  classes?: string[];
  placeholder?: string;
  renderOption?: (
    select: Selectorizer,
    option: ISelectOption
  ) => string;
  isMobile?: () => boolean;
  renderLabel?: (select: Selectorizer) => string;
  closeOnClickOutside?: boolean;
  calculateDropdownDir?: (select: Selectorizer) => 'bottom' | 'top';
  multiple?: {
    delimiter: string;
  }
}

export interface IExtendedOptions extends IOptions {
  withIcon: boolean;
  isMobile: () => boolean;
  placeholder: string;
  classes: string[];
  closeOnClickOutside: boolean;
}