import { PLUGIN_NAME, DEFAULT_OPTIONS, ERROR_MESSAGES, CLASSES } from "./const";
import {
  getOptions,
  createElement,
  wrapElement,
  getPluginClass,
  getClosestElement,
} from "./helpers";
import {
  IElements,
  IState,
  EClasses,
  ISelectOption,
  IOptions,
  IExtendedOptions,
} from "./types";

class Selectorizer {
  readonly elements: IElements;
  readonly state: IState;
  readonly options: IExtendedOptions;

  constructor(select: HTMLSelectElement, options: IOptions = {}) {
    this.elements = {
      $select: select,
      $wrapper: null,
      $inner: null,
      $label: null,
      $icon: null,
      $dropdown: null,
    };

    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    this.state = {
      isOpened: false,
      isNative: this.isSelectNative(),
      currentValue: "",
      options: [],
      dir: "bottom",
    };

    this.onResizeListener = this.onResizeListener.bind(this);
    this.onSelectChangeListener = this.onSelectChangeListener.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);

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

    this.state.currentValue = $select.value;

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

    const $allOptions = $select.querySelectorAll("option");

    const options = getOptions($allOptions);
    this.state.options = options;
  }

  private initListeners() {
    window.addEventListener("resize", this.onResizeListener);
    window.addEventListener("click", this.onDocumentClick, true);

    this.elements.$dropdown?.addEventListener("click", (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) {
        return;
      }

      const $dropdownItem = getClosestElement(e.target, CLASSES.dropdownItem);

      if ($dropdownItem) {
        const dataIndex = $dropdownItem.getAttribute("index");
        const index = dataIndex ? +dataIndex : null;

        if (index !== null) {
          this.change(this.state.options[index].value);
        }
      }
    });

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
  }

  private removeListeners() {
    window.removeEventListener("resize", this.onResizeListener);
    window.removeEventListener("click", this.onDocumentClick, true);
    this.elements.$select?.removeEventListener(
      "change",
      this.onSelectChangeListener
    );
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
    console.log('change');

    if (!(e.target instanceof HTMLSelectElement)) {
      return;
    }

    this.change(e.target.value);
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

  private getOptionByValue(value: string) {
    return this.state.options.find((opt) => opt.value === value);
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

  change(value: string) {
    const option = this.getOptionByValue(value);

    if (option) {
      const isNewValue = value !== this.state.currentValue;

      if (this.options.callbacks?.beforeChange && isNewValue) {
        this.options.callbacks.beforeChange(this);
      }

      this.state.currentValue = value;

      if (this.options.callbacks?.change && isNewValue) {
        this.options.callbacks.change(this);
      }

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
    this.elements.$select.appendChild(newOption);
  }

  private removeOptions() {
    this.state.options = [];
    this.elements.$select.innerHTML = "";
  }

  setOptions(newOptions: ISelectOption[]) {
    const { currentValue } = this.state;

    this.removeOptions();
    this.addOptions(newOptions);

    this.state.currentValue = newOptions.some(
      (opt) => opt.value === currentValue
    )
      ? this.state.currentValue
      : "";
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

  private renderDropdownList = (options: ISelectOption[]) => {
    const { currentValue } = this.state;
    const { renderOption } = this.options;

    return options
      .map((option, index) => {
        const isSelected = currentValue === option.value;
        const classes = [CLASSES.dropdownItem];
        if (isSelected) {
          classes.push("selected");
        }

        const optionContent = renderOption
          ? renderOption(this, option, isSelected)
          : option.text;

        return createElement("div", classes, optionContent, [
          { key: "index", value: index },
        ]).outerHTML;
      })
      .join("");
  };

  private preRender() {
    const { calculateDropdownDir } = this.options;
    this.elements.$select.value = this.state.currentValue;

    const selectorizer = this.elements.$wrapper;

    if (selectorizer) {
      if (calculateDropdownDir) {
        this.state.dir = calculateDropdownDir(this);
      } else {
        const windowOffsetY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const elY = selectorizer.offsetTop;
        const middleY = (windowOffsetY + windowHeight) / 2;

        this.state.dir = middleY > elY ? "bottom" : "top";
      }
    }

    this.render();
  }

  private render() {
    const { $label, $wrapper, $dropdown } = this.elements;
    const { renderLabel, renderPlaceholder } = this.options;
    const classes = this.getClasses();
    const option = this.getOptionByValue(this.state.currentValue);
    let optionText;

    if (option) {
      optionText = renderLabel ? renderLabel(this) : option.text;
    } else {
      optionText = renderPlaceholder
        ? renderPlaceholder(this, this.options.placeholder)
        : this.options.placeholder;
    }

    if ($dropdown) {
      const $dropdownList = this.renderDropdownList(this.state.options);
      $dropdown.innerHTML = $dropdownList;
    }

    if ($label) {
      $label.innerHTML = optionText;
    }

    if ($wrapper) {
      $wrapper.className = classes;
    }
  }
}

export { Selectorizer };
