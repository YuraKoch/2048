export class Tile {
  constructor(gridElement, value = getRandomValue()) {
    this.tileElement = document.createElement("div");
    this.tileElement.classList.add("tile");
    gridElement.append(this.tileElement);

    this.setValue(value);
  }

  setValue(value) {
    this.value = value;
    this.tileElement.textContent = value;
    const power = Math.log2(value);
    const bgLightness = 100 - power * 9;
    this.tileElement.style.setProperty("--bg-lightness", `${bgLightness}%`);
    this.tileElement.style.setProperty("--text-lightness", `${bgLightness <= 50 ? 90 : 10}%`);
  }

  setX(x) {
    this.x = x;
    this.tileElement.style.setProperty("--x", x);
  }

  setY(y) {
    this.y = y;
    this.tileElement.style.setProperty("--y", y);
  }

  removeFromDOM() {
    this.tileElement.remove();
  }

  waitForTransitionEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener(
        "transitionend", resolve, { once: true });
    });
  }

  waitForAnimationEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener(
        "animationend", resolve, { once: true });
    });
  }
}

function getRandomValue() {
  return Math.random() > 0.5 ? 2 : 4;
};