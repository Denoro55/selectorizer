export const $createSelect = (optionsCount: number) => {
  const $select = document.createElement('select');

  for (let i = 1; i < optionsCount + 1; i++) {
    const $option = document.createElement("option");
    $option.value = `option ${i}`;
    $option.text = `option ${i}`;
    $select.appendChild($option);
  }

  return $select;
}