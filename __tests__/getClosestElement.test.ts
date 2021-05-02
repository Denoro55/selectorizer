import { getClosestElement } from '../src/scripts/helpers';

describe('getClosestElement', () => {
  test('test 1', () => {
    const $wrapper = document.createElement('div');
    $wrapper.className = 'wrapper';
    const $inner = document.createElement('div');
    const $item = document.createElement('div');
    $item.className = 'item';

    $inner.appendChild($item);
    $wrapper.appendChild($inner);

    const $closest = getClosestElement($item, 'wrapper');
    const $closest2 = getClosestElement($item, 'item');
    const $closest3 = getClosestElement($item, 'body');
    const $closest4 = getClosestElement($item, 'unknown');

    expect($closest).toStrictEqual($wrapper);
    expect($closest2).toStrictEqual($item);
    expect($closest3).toBeNull();
    expect($closest4).toBeNull();
  })
})