const createElement = (tag, cls, text) => {
    const el = document.createElement(tag);
    el.className = cls;
    el.textContent = text;
    return el;
};

const render = (select, list, text, state) => {
    const nativeElement = select.querySelector('select');
    nativeElement.selectedIndex = state.currentOptionIndex;
    text.innerText = state.currentText;
    if (state.active) {
        list.style.display = 'block';
        select.classList.add('opened');
    } else {
        list.style.display = 'none';
        select.classList.remove('opened');
    }
    if (state.position === 'top') {
        list.style.top = '100%';
        list.style.bottom = 'auto';
    } else {
        list.style.top = 'auto';
        list.style.bottom = '100%';
    }
};

const change = (params) => {

};

const methods = {
    'change': change
};

const selectorize = (elements, options) => {
    if (elements === null) {
        throw new TypeError('Argument is null');
    }
    if (elements instanceof NodeList) {
        elements.forEach(el => {
            wrap(el, options);
        })
    } else {
        wrap(elements, options);
    }
};

const wrap = (select, options) => {
    const state = {
        active: false,
        currentOptionIndex: 0,
        currentText: '',
        items: [],
        callbacks: options.callbacks
    };

    const element = createElement('div', 'select', '');

    const inner = createElement('div', 'select__inner', '');
    element.appendChild(inner);

    const icon = createElement('div', 'select__icon', '');
    inner.appendChild(icon);

    const list = createElement('ul', 'select__list', '');
    list.style.display = 'none';

    const currentOptions = select.querySelectorAll('option');

    const text = createElement('div', 'select__text', currentOptions[0].innerText);
    state.currentText = currentOptions[0].innerText;
    inner.appendChild(text);

    currentOptions.forEach((option, idx) => {
        const optionText = option.text;
        state.items.push({value: option.value, text: optionText});
        const li = createElement('li', 'select__item', optionText);
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            state.active = false;
            state.currentOptionIndex = idx;
            state.currentText = state.items[idx].text;
            if (state.callbacks.onchange) {
                options.callbacks.onchange(select, state.items[idx].value);
            }
            render(element, list, text, state);
        });

        list.appendChild(li);
    });

    element.appendChild(list);

    element.addEventListener('click', (e) => {
        if (window.innerWidth < 768) return;
        const position = window.pageYOffset;
        const h = window.innerHeight;
        const elY = element.offsetTop;
        const calc = (position + h) / 2;
        if (calc < elY) {
            state.position = 'bottom';
        } else {
            state.position = 'top';
        }
        state.active = !state.active;
        render(element, list, text, state);
    });

    document.body.addEventListener('click', (e) => {
        if (!element.contains(e.target)) {
            state.active = false;
            render(element, list, text, state);
        }
    });

    select.after(element);
    element.prepend(select);

    select.addEventListener('change', (e) => {
        const index = e.target.selectedIndex;
        state.currentOptionIndex = index;
        state.currentText = state.items[index];
        render(element, list, text, state);
    })
};

// const wrap = (element, options) => {
//     const state = {
//         active: false,
//         currentOptionIndex: 0,
//         currentText: '',
//         items: [],
//         callbacks: options.callbacks
//     };
//
//     const select = createElement('div', 'select', '');
//
//     const inner = createElement('div', 'select__inner', '');
//     select.appendChild(inner);
//
//     const icon = createElement('div', 'select__icon', '');
//     inner.appendChild(icon);
//
//     const list = createElement('ul', 'select__list', '');
//     list.style.display = 'none';
//
//     const currentOptions = element.querySelectorAll('option');
//
//     const text = createElement('div', 'select__text', currentOptions[0].innerText);
//     state.currentText = currentOptions[0].innerText;
//     inner.appendChild(text);
//
//     currentOptions.forEach((option, idx) => {
//         const optionText = option.text;
//         state.items.push({value: option.value, text: optionText});
//         const li = createElement('li', 'select__item', optionText);
//         li.addEventListener('click', (e) => {
//             e.stopPropagation();
//             state.active = false;
//             state.currentOptionIndex = idx;
//             state.currentText = state.items[idx].text;
//             if (state.callbacks.onchange) {
//                 options.callbacks.onchange(select, state.items[idx].value);
//             }
//             render(select, list, text, state);
//         });
//
//         list.appendChild(li);
//     });
//
//     select.appendChild(list);
//
//     select.addEventListener('click', (e) => {
//         if (window.innerWidth < 768) return;
//         const position = window.pageYOffset;
//         const h = window.innerHeight;
//         const elY = select.offsetTop;
//         const calc = (position + h) / 2;
//         if (calc < elY) {
//             state.position = 'bottom';
//         } else {
//             state.position = 'top';
//         }
//         state.active = !state.active;
//         render(select, list, text, state);
//     });
//
//     document.body.addEventListener('click', (e) => {
//         if (!select.contains(e.target)) {
//             state.active = false;
//             render(select, list, text, state);
//         }
//     });
//
//     element.after(select);
//     select.prepend(element);
//
//     element.addEventListener('change', (e) => {
//         const index = e.target.selectedIndex;
//         state.currentOptionIndex = index;
//         state.currentText = state.items[index];
//         render(select, list, text, state);
//     })
// };

// export default selectorize;
