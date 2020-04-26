import { Component, OnInit, HostListener } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  public size: number;
  public model: Data;
  constructor() {
    this.size = 4;
  }
  ngOnInit() {
    this.initGame(this.size);
  }

  @HostListener("window:keyup", ["$event"])
  keyEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case KEY_CODE.UP_ARROW:
        this.model.moveUp();
        break;
      case KEY_CODE.DOWN_ARROW:
        this.model.moveDown();
        break;
      case KEY_CODE.LEFT_ARROW:
        this.model.moveLeft();
        break;
      case KEY_CODE.RIGHT_ARROW:
        this.model.moveRight();
        break;
    }

    this.model.fillRandomEmptyCell();
  }

  public initGame(size: number) {
    size = parseInt(size.toString(), 10);
    this.model = new Data(size);
    this.model.fillRandomEmptyCell();
    this.model.fillRandomEmptyCell();
    this.model.fillRandomEmptyCell();
    // this.model.fillRandomEmptyCell();
    // this.model.fillRandomEmptyCell();
    // this.model.moveRight();
  }
}

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  DOWN_ARROW = 40,
}

export class Data {
  public size: number;
  public title: string;
  public score: number;
  public matrix: number[][];
  private availableDigits: Array<number>;
  private skipNextLoop: boolean;

  constructor(size: number = 4) {
    this.size = size;
    this.title = this.getTitle();
    this.score = 0;
    this.matrix = this.getMatrix();
    this.availableDigits = this.getAvailableDigits();
  }

  private getTitle(): string {
    return `Game - ${this.size * this.size}`;
  }

  private getMatrix(): number[][] {
    let output: number[][] = [];
    for (let i = 0; i < this.size; i++) {
      output[i] = Array(this.size).fill(0);
    }
    return output;
  }

  private getAvailableDigits(): Array<number> {
    if (this.availableDigits === undefined) {
      this.availableDigits = Array(1).fill(2);
    }
    return this.availableDigits;
  }

  public fillRandomEmptyCell() {
    let getRandomNumber = (max: number): number => {
      return Math.floor(Math.random() * max);
    };
    let findEmptyCells = (): Array<Cell> => {
      let idxs = [];
      for (let i = 0; i < this.matrix.length; i++) {
        const row = this.matrix[i];
        for (let j = 0; j < row.length; j++) {
          if (row[j] === 0) {
            idxs.unshift({ x: i, y: j });
          }
        }
      }
      return idxs;
    };
    let findRandomEmptyCell = (): Cell => {
      const emptyCells = findEmptyCells();
      if (!emptyCells.length) {
        return { x: -1, y: -1 };
      }
      return emptyCells[getRandomNumber(emptyCells.length)];
    };
    const cellIndex: Cell = findRandomEmptyCell();
    if (cellIndex.x == -1) {
      console.log("Game over");
    } else {
      this.matrix[cellIndex.x][cellIndex.y] = this.availableDigits[
        getRandomNumber(this.availableDigits.length - 1)
      ];
    }
  }

  private bubbleUpZero(
    currentCell: Cell,
    options: { value: string; bubbleDirection: string }
  ): void {
    if (options.value === "x" && options.bubbleDirection === "decrement") {
      for (let i = currentCell.x; i > 0; i--) {
        this.matrix[i][currentCell.y] = this.matrix[i - 1][currentCell.y];
        this.matrix[i - 1][currentCell.y] = 0;
      }
    } else if (
      options.value === "x" &&
      options.bubbleDirection === "increment"
    ) {
      // Compares the next element, so skipping the last element
      for (let i = currentCell.x; i < this.size - 1; i++) {
        console.log(i, this.matrix);
        this.matrix[i][currentCell.y] = this.matrix[i + 1][currentCell.y];
        this.matrix[i + 1][currentCell.y] = 0;
      }
    } else if (
      options.value === "y" &&
      options.bubbleDirection === "decrement"
    ) {
      // Compares the next element, so skipping the last element
      for (let i = currentCell.y; i > 0; i--) {
        this.matrix[currentCell.x][i] = this.matrix[currentCell.x][i - 1];
        this.matrix[currentCell.x][i - 1] = 0;
      }
    } else if (
      options.value === "y" &&
      options.bubbleDirection === "increment"
    ) {
      // Compares the next element, so skipping the last element
      for (let i = currentCell.y; i < this.size - 1; i++) {
        console.log(i, this.matrix);
        this.matrix[currentCell.x][i] = this.matrix[currentCell.x][i + 1];
        this.matrix[currentCell.x][i + 1] = 0;
      }
    }
  }

  private checkMovementElements(
    currentCell: Cell,
    nextCell: Cell,
    options: { value: string; bubbleDirection: string }
  ): void {
    // bubble up zero's to top
    // Add same elements & make clear previous element, don't add up for next element
    let currentItem = this.matrix[currentCell.x][currentCell.y],
      nextItem = this.matrix[nextCell.x][nextCell.y];
    if (nextItem === 0 && currentItem === 0) {
      // skip the iteration
    } else if (!this.skipNextLoop && currentItem === nextItem) {
      // Check if i & i+1 elements are same, if so add them
      this.matrix[currentCell.x][currentCell.y] = 0;
      this.matrix[nextCell.x][nextCell.y] = nextItem + currentItem;
      this.skipNextLoop = true;
      this.bubbleUpZero(currentCell, options);
    } else if (nextItem === 0) {
      // console.log("swap", currentItem, nextItem);
      // Swap only at zero
      const temp = currentItem;
      this.matrix[currentCell.x][currentCell.y] = nextItem;
      this.matrix[nextCell.x][nextCell.y] = temp;
      this.skipNextLoop = false;
      // console.log("swap", this. matrix[currentCell.x][currentCell.y], this.matrix[nextCell.x][nextCell.y]);
      this.bubbleUpZero(currentCell, options);
    }
  }

  public moveUp() {
    for (let i = this.size - 1; i > 0; i--) {
      this.skipNextLoop = false;
      for (let j = 0; j < this.size; j++) {
        this.checkMovementElements(
          { x: i, y: j },
          { x: i - 1, y: j },
          { value: "x", bubbleDirection: "increment" }
        );
      }
    }
  }
  public moveDown() {
    // comparing i & i+1 cell at a time, so reducing 1 loop
    for (let i = 0; i < this.size; i++) {
      this.skipNextLoop = false;
      for (let j = 0; j < this.size; j++) {
        this.checkMovementElements(
          { x: i, y: j },
          { x: i + 1, y: j },
          { value: "x", bubbleDirection: "decrement" }
        );
      }
    }
  }
  public moveLeft() {
    for (let i = 0; i < this.size; i++) {
      this.skipNextLoop = false;
      for (let j = this.size - 1; j > 0; j--) {
        this.checkMovementElements(
          { x: i, y: j },
          { x: i, y: j - 1 },
          { value: "y", bubbleDirection: "increment" }
        );
      }
    }
  }
  public moveRight() {
    // comparing i & i+1 cell at a time, so reducing 1 loop
    for (let i = 0; i < this.size; i++) {
      this.skipNextLoop = false;
      for (let j = 0; j < this.size; j++) {
        this.checkMovementElements(
          { x: i, y: j },
          { x: i, y: j + 1 },
          { value: "y", bubbleDirection: "decrement" }
        );
      }
    }
  }
}

export interface Cell {
  x: number;
  y: number;
}
