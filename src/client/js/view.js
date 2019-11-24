class View {
  constructor() {
    this.scale = 1;
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.color = '#232529';

    this.setupCanvas();

    this.ctx = this.canvas.getContext('2d');
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.canvas.style.backgroundColor = this.color;
    document.getElementById('root').appendChild(this.canvas);
  }

  drawCircle(x, y, radius, color) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  drawImage(x, y, img) {
    console.log(img, img.width, img.height);
    this.ctx.drawImage(img, 0, 0);
  }

  reset() {
    this.ctx.fillStyle = this.color;
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawImageAtAngle(image, x, y, angle, scale = 1) {
    const imgWidth = image.width * scale;
    const imgHeight = image.height * scale;

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(angle);

    this.ctx.drawImage(image, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
    this.ctx.restore();
  }

  showWaitingScreen() {
    const waitingScreen = document.createElement('div');
    waitingScreen.style.backgroundColor = 'white';
    waitingScreen.style.position = 'absolute';
    waitingScreen.style.left = '25%';
    waitingScreen.style.top = '25%';
    waitingScreen.style.width = `${this.width / 2}px`;
    waitingScreen.style.height = `${this.height / 2}px`;

    const heading = document.createElement('h1');
    heading.innerHTML = 'You have to wait for another player!';

    waitingScreen.appendChild(heading);

    document.getElementById('root').appendChild(waitingScreen);

    this.waitingScreen = waitingScreen;
  }

  hideWaitingScreen() {
    if (this.waitingScreen) {
      this.waitingScreen.style.display = 'none';
    }
  }
}

export default View;
