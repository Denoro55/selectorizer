export const PLUGIN_NAME: string = "selectorizer";

export const DEFAULT_OPTIONS = {
  withIcon: true,
  isMobile: () =>
    /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ),
  classes: [],
  placeholder: 'Select value',
  closeOnClickOutside: true
};

export const DEFAULT_MULTIPLE_OPTION = {
  delimiter: ','
}

export const ERROR_MESSAGES = {
  invalidType: (prop: string, type: string) => `Property "${prop}" is not assignable to type ${type}`,
  valueDoesNotExists: (value: string) =>
    `Value "${value}" does not exists in options`,
};