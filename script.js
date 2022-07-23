import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);
grid.getRandomEmptyCell()
  .linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell()
  .linkTile(new Tile(gameBoard));
setupInput();


function setupInput() {
  window.addEventListener("keydown", handleKeydown, { once: true });
  window.addEventListener("touchstart", handleTouchStart, { once: true, passive: false });
}

function stopInput() {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("touchstart", handleTouchStart);
}

function handleKeydown(e) {
  handleInput(e.key);
}

async function handleInput(key) {
  stopInput();

  switch (key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    default:
      setupInput();
      return;
  }

  grid.cells.forEach(cell => cell.mergeTiles());

  const newTile = new Tile(gameBoard);
  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForAnimationEnd()
      .then(() => alert("Try again!"));
    return;
  }

  setupInput();
}

function moveUp() {
  slideTiles(grid.cellsGroupedByColumn);
}

function moveDown() {
  slideTiles(
    grid.cellsGroupedByColumn
      .map(column => [...column].reverse())
  );
}

function moveLeft() {
  slideTiles(grid.cellsGroupedByRow);
}

function moveRight() {
  slideTiles(grid.cellsGroupedByRow.map(raw => [...raw].reverse()));
}

function slideTiles(groupedCells) {
  const promises = [];

  groupedCells.forEach(group => {
    for (let i = 1; i < group.length; i++) {
      const cell = group[i];

      if (!cell.hasLinkedTile()) {
        continue;
      }

      let targetCell;

      for (let j = i - 1; j >= 0; j--) {
        const temporaryTargetCell = group[j];

        if (!temporaryTargetCell.canAccept(cell.linkedTile)) {
          break;
        }

        targetCell = temporaryTargetCell;
      }

      if (!!targetCell) {
        promises.push(cell.linkedTile.waitForTransitionEnd());

        if (targetCell.linkedTile != null) {
          targetCell.linkTileForMerge(cell.linkedTile);
        } else {
          targetCell.linkTile(cell.linkedTile);
        }

        cell.unlinkTile();
      }
    }
  });

  return Promise.all(promises);
}

function canMoveUp() {
  return canMove(grid.cellsGroupedByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsGroupedByColumn.map(column => [...column].reverse()));
}

function canMoveLeft() {
  return canMove(grid.cellsGroupedByRow);
}

function canMoveRight() {
  return canMove(grid.cellsGroupedByRow.map(raw => [...raw].reverse()));
}

function canMove(groupedCells) {
  return groupedCells.some(group => {
    return group.some((cell, index) => {
      if (index === 0) {
        return false;
      }

      if (cell.linkedTile == null) {
        return false;
      }

      const targetCell = group[index - 1];
      return targetCell.canAccept(cell.linkedTile);
    });
  })
}

function handleTouchStart(e) {
  stopInput();
  e.preventDefault();

  let touchStartData = e.changedTouches[0];
  let touchStartDate = new Date;

  window.addEventListener("touchend", async evt => {
    evt.preventDefault();
    let touchEndData = evt.changedTouches[0];

    if (new Date - touchStartDate > 500) {
      setupInput();
      return;
    }

    let deltaX = touchEndData.pageX - touchStartData.pageX;
    let deltaY = touchEndData.pageY - touchStartData.pageY;

    if (Math.abs(deltaX) >= 55) {
      await handleInput(deltaX > 0 ? "ArrowRight" : "ArrowLeft")
    } else if (Math.abs(deltaY) >= 55) {
      await handleInput(deltaY > 0 ? "ArrowDown" : "ArrowUp");
    }
    setupInput();
  }, { once: true })
}