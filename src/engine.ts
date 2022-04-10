enum CellState {
  Empty = 0,
  Full = 1,
}

type CellPoint = {
  row: number,
  column: number,
}

class State {

  public state:Array<number>;
  public newState:Array<number>;
  public total:number;

  constructor(public rows:number, public columns:number) {
    this.total = rows * columns;
    this.state = new Array<number>(this.total);
    this.newState = new Array<number>(this.total);

    this.glider();
    this.randomize();
  }

  private glider() {
    this.state[this.toIndex(1, 3)] = CellState.Full;
    this.state[this.toIndex(2, 4)] = CellState.Full;
    this.state[this.toIndex(3, 2)] = CellState.Full;
    this.state[this.toIndex(3, 3)] = CellState.Full;
    this.state[this.toIndex(3, 4)] = CellState.Full;
  }

  private wrapPoint(p:number, total:number):number {
    return (p + total) % total;
  }

  public isLive(row:number, column:number):number {
    const wRow = this.wrapPoint(row, this.rows);
    const wColumn = this.wrapPoint(column, this.columns);
    const index = this.toIndex(wRow, wColumn);
    return this.state[index] == CellState.Full ? 1 : 0;
  }

  private nCount(index:number):number {
    const { row, column } = this.toPoint(index);
    const fn = this.isLive.bind(this);
    return fn(row - 1, column - 1) + fn(row - 1, column) + fn(row - 1, column + 1) +
      fn(row, column - 1) + fn(row, column + 1) +
      fn(row + 1, column - 1) + fn(row + 1, column) + fn(row + 1, column + 1);
  }

  public doStep():void {
    //window.logger.log('step');
    const newState = this.newState;
    for (let i = 0; i < this.total; i++) {
      const live = this.nCount(i);
      if (this.state[i] == CellState.Full) {
        if (live == 2 || live == 3) {
          newState[i] = CellState.Full;
        } else {
          newState[i] = CellState.Empty;
        }
      } else {
        if (live == 3) {
          newState[i] = CellState.Full;
        } else {
          newState[i] = CellState.Empty;
        }
      }
    }

    const tmpState = this.state;
    this.state = newState;
    this.newState = tmpState;
  }

  public randomize() {
    for (let i = 0; i < this.total; i++) {
      const r = Math.random();
      this.state[i] = r > 0.9 ?
        CellState.Full :
        CellState.Empty;
    }
  }

  public toPoint(index:number):CellPoint {
    const row = Math.floor(index / this.columns);
    const column = index % this.columns;
    return { row: row, column: column };
  }

  public toIndex(row:number, column:number):number {
    return row * this.columns + column;
  }

}

type SpriteSize = {
  width: number,
  height: number,
}

type FieldSize = {
  width: number,
  height: number,
}

class Render {

  constructor(public canvas:HTMLCanvasElement,
              public context:CanvasRenderingContext2D,
              public spritesheet:HTMLImageElement,
              public field:FieldSize,
              public spriteSize:SpriteSize) {}

  public clear():void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public renderCell(x:number, y:number, s:CellState):void {
    let sx = 0;
    const sy = 0;
    if (s == CellState.Full) {
      sx = this.field.width;
    }
    const sizeX = this.spriteSize.width;
    const sizeY = this.spriteSize.height;
    this.context.drawImage(this.spritesheet, sx, sy, sizeX, sizeY, x, y, this.field.width, this.field.height);
  }

}

class GameOptions {

  constructor(public drawEmpty:boolean,
              public skipFrames:number) {}

}


class Game {

  private frames = 0;
  constructor(public state:State,
              public render:Render,
              private options:GameOptions) {
    this.update();
  }

  update = () => {
    this.frames += 1;
    if (this.frames % this.options.skipFrames == 0) {
      this.frames = 0;
      this.state.doStep();
    }

    this.render.clear();
    const state = this.state;
    for (let i = 0; i < state.total; i++) {
      const p = state.toPoint(i);
      const x = p.column * this.render.field.width;
      const y = p.row * this.render.field.height;

      // don't render empty cells
      if (!this.options.drawEmpty && state.state[i] == CellState.Empty) {
        continue;
      }
      this.render.renderCell(x, y, state.state[i]);
    }
    requestAnimationFrame(this.update);
  }

}

export {
  State,
  Render,
  GameOptions,
  Game
};
