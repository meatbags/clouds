/** Handle loading screen */

class LoadingScreen {
  constructor(toLoad) {
    this.toLoad = toLoad;
    this.haveLoaded = 0;
    this.domElement = document.querySelector('#loading-screen');
    this.domElementBar = document.querySelector('#loading-screen > .loading-screen__bar');
  }

  onAssetLoaded() {
    this.haveLoaded += 1;

    // remove or update loading screen
    if (this.haveLoaded >= this.toLoad) {
      this.domElementBar.style.width = '100%';
      this.domElement.classList.add('fade-out');
      setTimeout(() => {
        this.domElement.parentNode.removeChild(this.domElement);
      }, 1000);
    } else {
      const percent = Math.ceil((this.haveLoaded / this.toLoad) * 100);
      this.domElementBar.style.width = `${percent}%`;
    }
  }
}

export default LoadingScreen;
