/** User Interface */

import PopupWindow from './popup_window';

class UserInterface {
  constructor() {
    document.querySelector('#button-controls').addEventListener('click', () => {
      const win = new PopupWindow({
        label: 'Controls',
        content: `
          <em>Click and drag</em> to pan the camera. <em>Click</em> on objects to interact with them. 
          Use the <em>keyboard arrows</em> or the <em>W, S, A, D</em> keys to move.
        `,
        buttons: {
          OK: () => {},
        },
      })
    });
  }
}

export default UserInterface;
