export const $createSelect = (optionsCount: number, selected: number[] = [], isMultiple?: boolean) => {
  const $select = document.createElement('select');
  $select.multiple = !!isMultiple;

  for (let i = 1; i < optionsCount + 1; i++) {
    const $option = document.createElement("option");
    $option.value = `option ${i}`;
    $option.text = `option ${i}`;
    $option.selected = selected.includes(i - 1);
    $select.appendChild($option);
  }

  return $select;
}