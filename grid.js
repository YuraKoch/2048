import { VirtualCell } from "./cell.js";

const GRID_SIZE = 4;
const CELLS_COUNT = GRID_SIZE * GRID_SIZE;
const CELL_SIZE = 20;
const CELL_GAP = 2;

export class Grid {
  constructor(gridElement) {
    this.gridElement = gridElement;
    this.gridElement.style.setProperty("--grid-size", GRID_SIZE);
    this.gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
    this.gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);

    this.appendBackgroundCells(CELLS_COUNT);

    this.cells = this.initCells();

    this.cellsGroupedByColumn = this.groupCellsByColumn();
    this.cellsGroupedByRow = this.groupCellsByRow();
  }

  appendBackgroundCells() {
    for (let i = 0; i < CELLS_COUNT; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      this.gridElement.append(cell);
    }
  };

  initCells() {
    const cellElements = [];

    for (let i = 0; i < CELLS_COUNT; i++) {
      cellElements.push(
        new VirtualCell(i % GRID_SIZE, Math.floor(i / GRID_SIZE))
      );
    }

    return cellElements;
  }

  getRandomEmptyCell() {
    const emptyCells = this.getEmptyCells();
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }

  getEmptyCells() {
    return this.cells.filter(cell => !cell.hasLinkedTile());
  }

  groupCellsByColumn() {
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.x] = groupedCells[cell.x] || [];
      groupedCells[cell.x][cell.y] = cell;
      return groupedCells;
    }, []);
  }

  groupCellsByRow() {
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.y] = groupedCells[cell.y] || [];
      groupedCells[cell.y][cell.x] = cell;
      return groupedCells;
    }, []);
  }
}