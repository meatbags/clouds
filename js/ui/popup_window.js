/** Popup window */

import CreateElement from '../util/create_element';

class PopupWindow {
  constructor(params) {
    this.label = params.label || '';
    this.content = params.content || '';
    this.buttons = params.buttons || {};
    this.render();
  }

  closeWindow() {
    if (this.el.classList.contains('active')) {
      this.el.classList.remove('active');
      setTimeout(() => {
        this.el.remove();
      }, 500);
    }
  }

  render() {
    if (!this.el) {
      this.el = CreateElement({
        class: 'popup-window',
        childNodes: [{
          class: 'popup-window__header',
          childNodes: [{
            class: 'popup-window__label',
            innerHTML: this.label,
          },{
            class: 'popup-window__close',
            innerHTML: '&times',
          }]
        }, {
          class: 'popup-window__body',
          childNodes: [{
            class: 'popup-window__content',
            innerHTML: this.content,
          }, {
            class: 'popup-window__buttons',
          }]
        }]
      });

      // close
      this.el.querySelector('.popup-window__close').addEventListener('click', () => {
        this.closeWindow();
      });

      // add buttons
      Object.keys(this.buttons).forEach(key => {
        const callback = this.buttons[key];
        const button = CreateElement({
          class: 'button',
          innerHTML: key,
          addEventListener: {
            click: () => {
              callback();
              this.closeWindow();
            },
          }
        });
        this.el.querySelector('.popup-window__buttons').appendChild(button);
      });

      // add to doc, animate in
      document.querySelector('body').appendChild(this.el);
      setTimeout(() => {
        this.el.classList.add('active');
      }, 20);
    }
  }
}

export default PopupWindow;
