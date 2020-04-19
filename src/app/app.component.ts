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
    console.log(event);
    switch(event.keyCode){
      case KEY_CODE.RIGHT_ARROW:this.model.moveRight();break;
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.model.moveLeft();
    }
    if (event.keyCode === KEY_CODE.UP_ARROW) {
      this.model.moveUp();
    }

    if (event.keyCode === KEY_CODE.DOWN_ARROW) {
      this.model.moveDown();
    }
    this.model.fillRandomEmptyCell();
  }

  public initGame(size: number) {
    size = parseInt(size.toString(), 10);
    this.model = new Data(size);
    this.model.fillRandomEmptyCell();
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
  public availableDigits: Array<number>;

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

  private checkMovementElements(i,j,currentItem,nextItem) {
    if (!nextItem && !currentItem) {
      // skip the iteration
    } else if (currentItem === nextItem) {
      // Check if i & i+1 elements are same, if so add them
      nextItem += currentItem;
      currentItem = 0;
      this.matrix[i][j] = currentItem;
      this.matrix[i][j] = nextItem;
    } else if (currentItem !== 0) {
      // console.log("swap", currentItem, nextItem);
      // Check if i not equal to 0 & i+1 equals 0 , if so swap them
      const temp = currentItem;
      currentItem = nextItem;
      nextItem = temp;
      this.matrix[i][j] = currentItem;
      this.matrix[i][j] = nextItem;
      // console.log("swap", this.matrix[i][j], this.matrix[i][j]);
    }
  }

  public moveDown() {
    // comparing i & i+1 cell at a time, so reducing 1 loop
    for (let i = 0; i < this.size - 1; i++) {
      for (let j = 0; j < this.size; j++) {
        let currentItem = this.matrix[i][j],
          nextItem = this.matrix[i + 1][j];
        if (!nextItem && !currentItem) {
          // skip the iteration
          continue;
        } else if (currentItem === nextItem) {
          // Check if i & i+1 elements are same, if so add them
          nextItem += currentItem;
          currentItem = 0;
          this.matrix[i][j] = currentItem;
          this.matrix[i + 1][j] = nextItem;
        } else if (currentItem !== 0) {
          // console.log("swap", currentItem, nextItem);
          // Check if i not equal to 0 & i+1 equals 0 , if so swap them
          const temp = currentItem;
          currentItem = nextItem;
          nextItem = temp;
          this.matrix[i][j] = currentItem;
          this.matrix[i + 1][j] = nextItem;
          // console.log("swap", this.matrix[i][j], this.matrix[i + 1][j]);
        }
      }
    }
  }
  public moveUp() {
    for (let i = this.size - 1; i > 0; i--) {
      for (let j = 0; j < this.size; j++) {
        let currentItem = this.matrix[i][j],
          nextItem = this.matrix[i - 1][j];
        console.log(`${i}${j}=>${currentItem}   ${i - 1}${j}=>${nextItem}`);
        if (!nextItem && !currentItem) {
          // skip the iteration
          continue;
        } else if (currentItem === nextItem) {
          // Check if i & i+1 elements are same, if so add them
          nextItem += currentItem;
          currentItem = 0;
          this.matrix[i][j] = currentItem;
          this.matrix[i - 1][j] = nextItem;
        } else if (currentItem !== 0) {
          // console.log("swap", currentItem, nextItem);
          // Check if i not equal to 0 & i+1 equals 0 , if so swap them
          const temp = currentItem;
          currentItem = nextItem;
          nextItem = temp;
          this.matrix[i][j] = currentItem;
          this.matrix[i - 1][j] = nextItem;
          // console.log("swap", this.matrix[i][j], this.matrix[i - 1][j]);
        }
      }
    }
  }
  public moveRight() {
    // comparing i & i+1 cell at a time, so reducing 1 loop
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size-1; j++) {
        let currentItem = this.matrix[i][j],
          nextItem = this.matrix[i][j + 1];
        if (!nextItem && !currentItem) {
          // skip the iteration
          continue;
        } else if (currentItem === nextItem) {
          // Check if i & i+1 elements are same, if so add them
          nextItem += currentItem;
          currentItem = 0;
          this.matrix[i][j] = currentItem;
          this.matrix[i][j + 1] = nextItem;
        } else if (currentItem !== 0) {
          // console.log("swap", currentItem, nextItem);
          // Check if i not equal to 0 & i+1 equals 0 , if so swap them
          const temp = currentItem;
          currentItem = nextItem;
          nextItem = temp;
          this.matrix[i][j] = currentItem;
          this.matrix[i][j + 1] = nextItem;
          // console.log("swap", this.matrix[i][j], this.matrix[i][j + 1]);
        }
      }
    }
  }
  public moveLeft() {
    for (let  i = 0; i < this.size; i++) {
      for (let j = this.size - 1; j > 0; j--) {
        let currentItem = this.matrix[i][j],
          nextItem = this.matrix[i][j - 1];
          // console.log(i,j,'=',currentItem,'----',i,j+1,'=',nextItem)
        if (!nextItem && !currentItem) {
          // skip the iteration
          continue;
        } else if (currentItem === nextItem) {
          // Check if i & i+1 elements are same, if so add them
          nextItem += currentItem;
          currentItem = 0;
          this.matrix[i][j] = currentItem;
          this.matrix[i][j - 1] = nextItem;
        } else if (currentItem !== 0) {
          // console.log("swap", currentItem, nextItem);
          // Check if i not equal to 0 & i+1 equals 0 , if so swap them
          const temp = currentItem;
          currentItem = nextItem;
          nextItem = temp;
          this.matrix[i][j] = currentItem;
          this.matrix[i][j - 1] = nextItem;
          // console.log("swap", this.matrix[i][j], this.matrix[i][j - 1]);
        }
      }
    }
  }
}

export interface Cell {
  x: number;
  y: number;
}
