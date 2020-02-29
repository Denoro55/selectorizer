const pluginName = 'selectorizer';

document.body.addEventListener('click', (e) => {
    tryToClose(e);
});

const tryToClose = (e) => {
    const selects = document.querySelectorAll('.selectorizer');
    selects.forEach(el => {
        if (!el.contains(e.target)) {
            const select = el.querySelector('select');
            select[pluginName].close();
        }
    })
};

const createElement = (tag, cls, text) => {
    const el = document.createElement(tag);
    el.className = cls;
    el.textContent = text;
    return el;
};

const getSiblings = function (elem) {

    // Setup siblings array and get the first sibling
    var siblings = [];
    var sibling = elem.parentNode.firstChild;

    // Loop through each sibling and push to the array
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== elem) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling
    }

    return siblings;
};

class Selectorizer {
    constructor(select, params = {}) {
        this.select = select;
        this.state = {
            opened: false,
            position: 'top',
            currentValue: ''
        };
        this.events = {};
        this.params = params;
        this.init();
    }

    init() {
        const select = this.select;

        if (this.isMobile()) {
            select.classList.add('native');
        }

        const element = createElement('div', pluginName, '');

        const inner = createElement('div', `${pluginName}__inner`, '');
        element.appendChild(inner);

        const icon = createElement('div', `${pluginName}__icon`, '');
        if (this.params.iconHtml) {
            icon.innerHTML = this.params.iconHtml;
        }
        inner.appendChild(icon);

        const currentOptions = this.select.querySelectorAll('option');

        const text = createElement('div', `${pluginName}__text`, currentOptions[0].innerText);
        inner.appendChild(text);

        this.state.currentValue = currentOptions[0].value;

        const list = this.generateList();

        element.appendChild(list);

        element.addEventListener('click', (e) => {
            if (this.isMobile()) {
                return;
            }
            e.stopPropagation();
            tryToClose(e);
            this.toggle(this.state);
        });

        select.after(element);
        element.prepend(select);

        select.addEventListener('change', (e) => {
            this.change(e.target.value);
        });

        this.elements = {
            selectorizer: element,
            list,
            text
        }
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && this.params.nativeOnMobile;
    }

    refresh() {
        const newList = this.generateList();
        this.elements.list.remove();
        this.elements.selectorizer.append(newList);
    }

    updateValue(value) {
        if (this.state.currentValue !== value) {
            const prevValue = this.state.currentValue;
            this.state.currentValue = value;
            this.triggerEvent('selectorizer-change', prevValue);
            return true;
        }
        return false;
    }

    change(value) {
        if (this.updateValue(value)) {
            this.render();
        }
    }

    toggle(state) {
        const selectorizer = this.elements.selectorizer;

        const position = window.pageYOffset;
        const h = window.innerHeight;
        const elY = selectorizer.offsetTop;
        const calc = (position + h) / 2;

        state.position = calc < elY ? 'bottom' : 'top';

        if (state.opened) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (!this.state.opened) {
            this.state.opened = true;
            this.triggerEvent('selectorizer-before-open');
            this.render();
            this.triggerEvent('selectorizer-open');
        }
    }

    close() {
        if (this.state.opened) {
            this.state.opened = false;
            this.triggerEvent('selectorizer-before-close');
            this.render();
            this.triggerEvent('selectorizer-close');
        }
    }

    render() {
        const state = this.state;
        const { selectorizer, list, text } = this.elements;
        const select = this.select;

        select.value = state.currentValue;
        const currentIndex = select.selectedIndex || 0;
        const option = selectorizer.querySelectorAll(`.${pluginName}__item`)[currentIndex];

        if (option) {
            text.innerText = option.innerText;
            getSiblings(option).forEach(sibling => {
                sibling.classList.remove('active');
            });
            option.classList.add('active');
        } else {
            text.innerText = '';
        }

        if (state.opened) {
            selectorizer.classList.add('opened');
        } else {
            selectorizer.classList.remove('opened');
        }

        if (state.position === 'top') {
            list.style.top = '100%';
            list.style.bottom = 'auto';
        } else {
            list.style.top = 'auto';
            list.style.bottom = '100%';
        }
    }

    triggerEvent(eventName, ...args) {
        if (this.events.hasOwnProperty(eventName)) {
            this.events[eventName](this.select, this.state.currentValue, ...args);
        }
    }

    on(eventName, cb) {
        if (!this.events.hasOwnProperty(eventName)) {
            this.events[eventName] = cb;
        }
    }

    generateList() {
        const list = createElement('ul', `${pluginName}__list`, '');
        const currentOptions = this.select.querySelectorAll('option');
        currentOptions.forEach((option) => {
            const value = option.value;
            const text = option.text;
            const li = createElement('li', `${pluginName}__item`, text);
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                this.updateValue(value);
                this.close();
            });
            list.appendChild(li);
        });
        return list;
    }
}

class Data {
    constructor() {
        this.selects = [];
    }

    add(item) {
        this.selects.push(item)
    }

    trigger(methodName, ...args) {
        this.selects.forEach(e => {
            e[methodName](...args);
        })
    }

    on(...args) {
        this.trigger('on', ...args);
    }
}

const selectorize = (element, params) => {
    let items;
    if (!(element instanceof NodeList)) {
        items = [element];
    } else {
        items = element;
    }

    const map = new Data();

    items.forEach(select => {
        const data = select[pluginName];
        if (!data) {
            select[pluginName] = new Selectorizer(select, params);
            map.add(select[pluginName]);
        } else {
            map.add(data);
        }
    });

    return map;
};

export default selectorize;
