const pluginName = 'selectorizer';

document.body.addEventListener('click', (e) => {
    closeOther(e);
});

const closeOther = (e) => {
    const selects = document.querySelectorAll(`.${pluginName}`);
    Array.prototype.forEach.call(selects, el => {
        if (!el.contains(e.target)) {
            const select = el.querySelector('select');
            select[pluginName].close();
        }
    });
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
        this.applyClasses(element, this.params.classes);

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

        inner.addEventListener('click', (e) => {
            if (this.isMobile()) {
                return;
            }
            closeOther(e);
            this.toggle();
        });

        select.parentNode.insertBefore(element, select);
        element.appendChild(select);

        select.addEventListener('change', (e) => {
            this.change(e.target.value);
        });

        this.elements = {
            selectorizer: element,
            list,
            text
        }
    }

    applyClasses(element, classes) {
        if (!Array.isArray(classes)) {
            classes = [classes];
        }
        classes.forEach(cls => {
            element.classList.add(cls);
        });
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && this.params.nativeOnMobile;
    }

    refresh() {
        const newList = this.generateList();
        this.elements.list.parentNode.removeChild(this.elements.list);
        this.elements.selectorizer.appendChild(newList);
        this.elements.list = newList;
        this.updatePosition();
        this.render();
    }

    updateValue(value) {
        if (this.state.currentValue !== value) {
            const prevValue = this.state.currentValue;
            this.state.currentValue = value;
            this.triggerEvent('change', prevValue);
            return true;
        }
        return false;
    }

    change(value) {
        if (this.updateValue(value)) {
            this.render();
        }
    }

    updatePosition() {
        const selectorizer = this.elements.selectorizer;

        const position = window.pageYOffset;
        const h = window.innerHeight;
        const elY = selectorizer.offsetTop;
        const calc = (position + h) / 2;

        this.state.position = calc < elY ? 'bottom' : 'top';
        console.log(calc , elY, this.state.position)
    }

    toggle() {
        this.updatePosition();

        if (this.state.opened) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (!this.state.opened) {
            this.updatePosition();
            this.state.opened = true;
            this.triggerEvent('before-open');
            this.render();
            this.triggerEvent('open');
        }
    }

    close() {
        if (this.state.opened) {
            this.updatePosition();
            this.state.opened = false;
            this.triggerEvent('before-close');
            this.render();
            this.triggerEvent('close');
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
        Array.prototype.forEach.call(currentOptions, (option) => {
            const value = option.value;
            const text = option.text;
            const li = createElement('li', `${pluginName}__item`, text);
            li.addEventListener('click', () => {
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

    Array.prototype.forEach.call(items, select => {
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
