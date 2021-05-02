import { wrapElement } from './../src/scripts/helpers';

describe('wrapElement', () => {
  test('test wrap', () => {
    const $div = document.createElement('div');
    const $wrapper = document.createElement('div');

    document.body.appendChild($div);

    expect($wrapper.children.length).toBe(0);
    expect($wrapper.children[0] === $div).toBeFalsy();

    wrapElement($wrapper, $div);

    expect($wrapper.children.length).toBe(1);
    expect($wrapper.children[0] === $div).toBeTruthy();
  })
})