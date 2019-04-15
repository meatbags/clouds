/** Menu overlay */

class Menu {
  constructor() {
    this.el = {
      menuButton: document.querySelector('#menu-button'),
      menu: document.querySelector('#menu'),
    };
    this.el.menuButton.addEventListener('click', () => { this.toggleMenu(); });
  }

  toggleMenu() {
    if (this.el.menuButton.classList.contains('active')) {
      this.el.menuButton.classList.remove('active');
      this.el.menu.classList.remove('active');
    } else {
      this.el.menuButton.classList.add('active');
      this.el.menu.classList.add('active');
    }
  }
}

export default Menu;
