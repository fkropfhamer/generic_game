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
}

export default View;
