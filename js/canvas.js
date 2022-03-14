class Canvas {
  /**
   * @param {String} color Line color when drawing
   * @param {Number} lineWidth Line width when drawing
   * @property {boolean} isDrawing If false prevents from drawing
   * @method drawSignature Allows user to draw on Canvas
   * @method eraseSignature Allows user to erase its signature
   * @method validCanvas Verifies user signature length with pixelChecker() method
   */

  constructor(canvas, color, lineWidth) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.rect = this.canvas.getBoundingClientRect();
    this.context.strokeStyle = color;
    this.context.lineWidth = lineWidth;

    this.isDrawing = false;

    this.drawSignature();
    this.eraseSignature();
    this.validCanvas();
  }

  drawSignature(e) {
    if (window.screen.width > 769) {
      this.canvas.addEventListener("mousedown", (e) => this.mouseDown(e));
      this.canvas.addEventListener("mousemove", (e) => this.mouseMove(e));
      this.canvas.addEventListener("mouseup", (e) => this.mouseUp(e));
    } else {
      this.canvas.addEventListener("touchstart", (e) => this.touchStart(e));
      this.canvas.addEventListener("touchmove", (e) => this.touchMove(e));
      this.canvas.addEventListener("touchend", () => this.touchEnd());
    }
  }

  mouseDown(e) {
    this.isDrawing = true;
    this.context.beginPath();
    this.context.moveTo(e.offsetX, e.offsetY);
  }

  /**
   * Draw a line on the Canvas
   * @param { Number } e Mouse cursor coordinates of the user as a number
   */

  mouseMove(e) {
    if (this.isDrawing) {
      this.context.lineTo(e.offsetX, e.offsetY);
      this.context.stroke();
      //this.posX = event.clientX - this.rect.left;
      //this.posY = event.clientY - this.rect.top;
    }
  }

  mouseUp() {
    if (this.isDrawing) {
      this.isDrawing = false;
    }
    this.context.closePath();
    this.canvasActions();
  }

  touchStart(e) {
    console.log("touchstart");
    this.isDrawing = true;
    this.context.beginPath();
    this.context.moveTo(
      e.touches[0].clientX - parseInt(this.rect.left),
      e.touches[0].clientY - parseInt(this.rect.top)
    );
  }

  touchMove(e) {
    if (this.isDrawing) {
      console.log("touchmove");
      this.context.lineTo(
        e.touches[0].clientX - this.rect.left,
        e.touches[0].clientY - this.rect.top
      );
      this.context.stroke();
    }
  }

  touchEnd() {
    console.log("touchend");
    this.context.closePath();
    if (this.isDrawing) {
      this.isDrawing = false;
    }
    this.canvasActions();
  }

  eraseSignature() {
    document.getElementById("erase").addEventListener("click", () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      $("#canvasSignature").removeClass("valid");
      $("#errorSignature").hide();
    });
  }

  /**
   * getImageData() takes 4 parameters :
   * @param { Number } x The x coordinate (in pixels) of the upper-left corner to start copy from
   * @param { Number } y The y coordinate (in pixels) of the upper-left corner to start copy from
   * @param { Number } width The width of the rectangular area we copy
   * @param { Number } height The height of the rectangular area we copy
   */

  pixelChecker() { // Counts the number of pixels : if < 200 signature is incorrect
    this.imageData = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    let count = 0;
    for (
      let i = 0;
      i < this.imageData.data.length;
      i += 4 // Check every pixel
    ) {
      if (this.imageData.data[i + 3] != 0) {
        count++;
      } // Check if opacity value change
    }
    return count > 200;
  }

  canvasActions() { // Adds a visual confirmation or alert to verify if the user has correctly signed
    let count = this.pixelChecker();
    if (count) {
      $("#canvasSignature").addClass("valid");
      $("#canvasSignature").removeClass("alert");
      $("#errorSignature").hide();
    } else {
      $("#canvasSignature").addClass("alert");
      $("#errorSignature").show();
      $("#errorSignature").html(
        "<p>*Votre signature n'est pas assez longue</p>"
      );
    }
  }

  validCanvas() {
    let nextform = document.getElementById("nextForm");
    nextform.addEventListener("click", () => {
      if (this.pixelChecker()) {
        $("#errorSignature").hide();
        $("#canvasSignature").removeClass("alert");
        $("#canvasSignature").addClass("valid");
      } else {
        $("#errorSignature").show();
        $("#canvasSignature").addClass("alert");
        $("#errorSignature").html("<p>*Veuillez signer ci-dessus.</p>");
      }
    });
  }
}
