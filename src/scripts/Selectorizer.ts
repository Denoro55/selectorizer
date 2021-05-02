import {
  PLUGIN_NAME,
  DEFAULT_OPTIONS,
  ERROR_MESSAGES,
  DEFAULT_MULTIPLE_OPTION,
} from "./const";
import {
  getOptions,
  createElement,
  wrapElement,
  getPluginClass,
  getClosestElement,
  getIndexesFromValues,
  getValuesFromIndexes,
  joinByDelimiter,
  getSelectedOptionsIndexes,
} from "./helpers";
import {
  IElements,
  IState,
  EClasses,
  ISelectOption,
  IOptions,
  IExtendedOptions,
} from "./types";

const CLASSES = {
  dropdown: getPluginClass("dropdown", "__"),
  dropdownItem: getPluginClass("dropdown-item", "__"),
  label: getPluginClass("label", "__"),
  inner: getPluginClass("inner", "__"),
  icon: getPluginClass("icon", "__"),
  iconArrow: getPluginClass("icon-arrow", "__"),
};

class Selectorizer {
  private readonly elements: IElements;
  private readonly state: IState;
  private readonly options: IExtendedOptions;

  constructor($select: HTMLSelectElement, options: IOptions = {}) {
    this.elements = {
      $select: $select,
      $wrapper: null,
      $inner: null,
      $label: null,
      $icon: null,
      $dropdown: null,
    };

    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
      // TODO: refactor. hard to read
      multiple: options.multiple
        ? options.multiple
        : $select.multiple
        ? DEFAULT_MULTIPLE_OPTION
        : undefined,
    };

    this.state = {
      isOpened: false,
      isNative: this.isSelectNative(),
      options: [],
      selected: [],
      dir: "bottom",
    };

    this.onResizeListener = this.onResizeListener.bind(this);
    this.onSelectChangeListener = this.onSelectChangeListener.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onDropdownItemClick = this.onDropdownItemClick.bind(this);
    this.onWrapperClickListener = this.onWrapperClickListener.bind(this);

    this.validateConfig();

    this.init();
    this.initListeners();
  }

  private validateConfig() {
    const { iconHtml, maxHeight, classes } = this.options;

    this.options.withIcon = !!this.options.withIcon;
    this.options.isNativeOnMobile = !!this.options.isNativeOnMobile;

    if (iconHtml && typeof iconHtml !== "string") {
      throw new Error(ERROR_MESSAGES.invalidType("iconHtml", "string"));
    }

    if (maxHeight && typeof maxHeight !== "number") {
      throw new Error(ERROR_MESSAGES.invalidType("maxHeight", "number"));
    }

    if (classes && !Array.isArray(classes)) {
      throw new Error(ERROR_MESSAGES.invalidType("classes", "array"));
    }
  }

  private init() {
    const { $select } = this.elements;

    // TODO: think how to do better
    if (this.options.callbacks?.beforeInit) {
      this.options.callbacks.beforeInit(this);
    }

    this.elements.$wrapper = createElement("div", [this.getClasses()], "");

    this.elements.$inner = createElement("div", [CLASSES.inner], "");
    this.elements.$wrapper.appendChild(this.elements.$inner);

    this.elements.$label = createElement("div", [CLASSES.label], "");
    this.elements.$inner.appendChild(this.elements.$label);

    this.elements.$dropdown = createElement("div", [CLASSES.dropdown], "");
    this.elements.$wrapper.appendChild(this.elements.$dropdown);

    this.initIcon();
    this.initOptions();

    this.state.selected = getSelectedOptionsIndexes(this.state.options);

    wrapElement(this.elements.$wrapper, $select);

    if (this.options.callbacks?.init) {
      this.options.callbacks.init(this);
    }

    this.preRender();
  }

  private initIcon() {
    const elements = this.elements;
    const { withIcon, iconHtml } = this.options;

    if (withIcon) {
      if (elements.$inner) {
        elements.$icon = createElement("div", [CLASSES.icon], "");
        elements.$inner.appendChild(elements.$icon);

        if (!iconHtml) {
          const $arrow = createElement("div", [CLASSES.iconArrow], "");
          elements.$icon.appendChild($arrow);
        } else {
          elements.$icon.innerHTML = iconHtml;
        }
      }
    }
  }

  private initOptions() {
    const { $select } = this.elements;

    this.state.options = getOptions($select.options);
  }

  private initListeners() {
    window.addEventListener("resize", this.onResizeListener);
    window.addEventListener("click", this.onDocumentClick, true);

    this.elements.$dropdown?.addEventListener(
      "click",
      this.onDropdownItemClick
    );

    this.elements.$inner?.addEventListener("click", (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) {
        return;
      }

      this.toggleOpened();
    });

    this.elements.$select?.addEventListener(
      "change",
      this.onSelectChangeListener
    );

    this.elements.$wrapper?.addEventListener(
      "click",
      this.onWrapperClickListener
    );
  }

  private removeListeners() {
    window.removeEventListener("resize", this.onResizeListener);
    window.removeEventListener("click", this.onDocumentClick, true);
    this.elements.$select?.removeEventListener(
      "change",
      this.onSelectChangeListener
    );
    this.elements.$wrapper?.removeEventListener(
      "click",
      this.onWrapperClickListener
    );
  }

  private onWrapperClickListener() {
    const click = this.getConfig().callbacks?.click;

    click && click(this);
  }

  private onDropdownItemClick(e: MouseEvent) {
    const { multiple } = this.options;
    const { options, selected } = this.state;

    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    const $dropdownItem = getClosestElement(e.target, CLASSES.dropdownItem);

    if ($dropdownItem) {
      const dataIndex = $dropdownItem.getAttribute("data-index");
      const index = dataIndex ? +dataIndex : null;

      if (index !== null) {
        const option = options[index];

        if (option && !option.disabled) {
          if (multiple) {
            const nextValues = getValuesFromIndexes(selected, options);

            if (selected.includes(index)) {
              const valueIndex = nextValues.findIndex(
                (v) => v === option.value
              );
              nextValues.splice(valueIndex, 1);
            } else {
              nextValues.push(option.value);
            }

            this.change(nextValues);
          } else {
            this.change(option.value);
          }
        }
      }
    }
  }

  private onDocumentClick(e: MouseEvent) {
    const $target = e.target as Node; // TODO: fix typecast

    if (!this.getWrapper()?.contains($target)) {
      this.getConfig().closeOnClickOutside && this.close();
    }
  }

  private onResizeListener() {
    const isNative = this.state.isNative;

    this.state.isNative = this.isSelectNative();

    if (isNative !== this.state.isNative) {
      this.preRender();
    }
  }

  private onSelectChangeListener(e: Event) {
    if (!(e.target instanceof HTMLSelectElement)) {
      return;
    }

    this.changeFromNative();
  }

  getDelimiter() {
    const { multiple } = this.options;

    return multiple ? multiple.delimiter : ",";
  }

  getCurrentValue(): string {
    const { options, selected } = this.state;

    return joinByDelimiter(
      getValuesFromIndexes(selected, options),
      this.getDelimiter()
    );
  }

  getPlaceholder() {
    return this.options.placeholder;
  }

  private toggleOpened() {
    if (this.state.isOpened) {
      this.close();
    } else {
      this.open();
    }
  }

  private getClasses() {
    const classes = [PLUGIN_NAME, ...this.options.classes];

    if (this.state.isOpened) {
      classes.push(getPluginClass(EClasses.open, "-"));
    }

    if (this.state.isNative) {
      classes.push(getPluginClass(EClasses.native, "-"));
    }

    if (this.state.dir === "top") {
      classes.push(getPluginClass(EClasses.inverted, "-"));
    }

    return classes.join(" ");
  }

  open() {
    const isOpened = this.state.isOpened;

    if (!isOpened && this.options.callbacks?.beforeOpen) {
      this.options.callbacks.beforeOpen(this);
    }

    this.state.isOpened = true;

    this.preRender();

    if (!isOpened && this.options.callbacks?.open) {
      this.options.callbacks.open(this);
    }
  }

  close() {
    const isOpened = this.state.isOpened;

    if (isOpened && this.options.callbacks?.beforeClose) {
      this.options.callbacks.beforeClose(this);
    }

    this.state.isOpened = false;
    this.preRender();

    if (isOpened && this.options.callbacks?.close) {
      this.options.callbacks.close(this);
    }
  }

  private changeFromNative() {
    const $select = this.getElements().$select;

    if ($select) {
      this.state.options = getOptions($select.options);
      this.state.selected = getSelectedOptionsIndexes(this.state.options);

      this.preRender();
    }
  }

  change(value: string | string[]) {
    const nextSelectedIndexes = getIndexesFromValues(value, this.state.options);

    const nextValue = joinByDelimiter(
      getValuesFromIndexes(nextSelectedIndexes, this.state.options),
      this.getDelimiter()
    );

    const isNewValue = nextValue !== this.getCurrentValue();

    if (this.options.callbacks?.beforeChange && isNewValue) {
      this.options.callbacks.beforeChange(this);
    }

    this.setSelectedOptions(nextSelectedIndexes);

    if (this.options.callbacks?.change && isNewValue) {
      this.options.callbacks.change(this);
    }

    if (this.options.multiple) {
      this.preRender();
    } else {
      this.close();
    }
  }

  refresh() {
    if (this.options.callbacks?.beforeRefresh) {
      this.options.callbacks.beforeRefresh(this);
    }

    this.initOptions();
    this.preRender();

    if (this.options.callbacks?.refresh) {
      this.options.callbacks.refresh(this);
    }
  }

  private isSelectNative() {
    return !!(this.options?.isMobile() && this.options.isNativeOnMobile);
  }

  private addNativeOption(option: ISelectOption) {
    var newOption = document.createElement("option");
    newOption.value = option.value;
    newOption.text = option.text;
    newOption.disabled = !!option.disabled;
    this.elements.$select.appendChild(newOption);
  }

  private removeOptions() {
    this.state.options = [];
    this.elements.$select.innerHTML = "";
  }

  private setSelectedOptions(indexes: number[]) {
    this.state.selected = indexes;
    const $options = this.getElements().$select.options;

    this.state.options.forEach((option, index) => {
      const isSelected = indexes.includes(index);

      option.selected = isSelected;
      $options[index].selected = isSelected;
    });
  }

  setOptions(newOptions: ISelectOption[]) {
    const { selected } = this.state;

    const nextSelectedIndexes = getIndexesFromValues(
      getValuesFromIndexes(selected, newOptions),
      newOptions
    );

    this.setSelectedOptions(nextSelectedIndexes);

    this.removeOptions();
    this.addOptions(newOptions);
  }

  addOptions(newOptions: ISelectOption[]) {
    newOptions.forEach((opt) => {
      this.addNativeOption(opt);
      this.state.options.push(opt);
    });
    this.preRender();
  }

  getWrapper() {
    return this.getElements().$wrapper;
  }

  getSelect() {
    return this.getElements().$select;
  }

  getElements() {
    return this.elements;
  }

  getState() {
    return this.state;
  }

  getConfig() {
    return this.options;
  }

  destroy() {
    if (this.options.callbacks?.beforeDestroy) {
      this.options.callbacks.beforeDestroy(this);
    }

    this.removeListeners();

    if (this.elements.$wrapper) {
      wrapElement(this.elements.$select, this.elements.$wrapper);
      this.elements.$select[PLUGIN_NAME] = null;
      this.elements.$wrapper.remove();

      if (this.options.callbacks?.destroy) {
        this.options.callbacks.destroy(this);
      }
    }
  }

  private preRender() {
    const { calculateDropdownDir } = this.options;
    const { $wrapper } = this.elements;

    if (this.state.selected.length < 1) {
      this.elements.$select.value = "";
    }

    if ($wrapper) {
      if (calculateDropdownDir) {
        this.state.dir = calculateDropdownDir(this);
      } else {
        const windowOffsetY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const elY = $wrapper.offsetTop;
        const middleY = (windowOffsetY + windowHeight) / 2;

        this.state.dir = middleY > elY ? "bottom" : "top";
      }
    }

    this.render();
  }

  private renderDropdownList = (options: ISelectOption[]) => {
    const { renderOption } = this.options;
    const { selected } = this.state;

    return options
      .map((option, index) => {
        const { text, disabled } = option;

        const isSelected = selected.includes(index);
        const classes = [CLASSES.dropdownItem];

        if (isSelected) {
          classes.push("selected");
        }

        if (disabled) {
          classes.push("disabled");
        }

        const optionContent = renderOption
          ? renderOption(this, option)
          : text;

        return createElement("div", classes, optionContent, [
          { key: "data-index", value: index },
        ]).outerHTML;
      })
      .join("");
  };

  private render() {
    const { $label, $wrapper, $dropdown } = this.elements;
    const { renderLabel } = this.options;

    const classes = this.getClasses();

    let value = renderLabel ? renderLabel(this) : this.getCurrentValue();

    if (!value) {
      value = this.getPlaceholder();
    }

    if ($dropdown) {
      const $dropdownList = this.renderDropdownList(this.state.options);
      $dropdown.innerHTML = $dropdownList;
    }

    if ($label) {
      $label.innerHTML = value;
    }

    if ($wrapper) {
      $wrapper.className = classes;
    }
  }
}

export { Selectorizer };
