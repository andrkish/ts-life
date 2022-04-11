import { Render, Game, State, GameOptions } from './engine';
import { setup } from './setup';

function create32x32(canvas:HTMLCanvasElement,
  context:CanvasRenderingContext2D,
  img:HTMLImageElement) {
  const state = new State(19, 25);
  const spriteSize = { width: 32, height: 32 };
  const fieldSize = { width: 32, height: 32 };
  const render = new Render(canvas, context, img, fieldSize, spriteSize);

  const options = new GameOptions(false, 1);

  new Game(state, render, options);
}

function create1x1(canvas:HTMLCanvasElement,
  context:CanvasRenderingContext2D,
  img:HTMLImageElement) {
  const state = new State(608, 800);
  const spriteSize = { width: 1, height: 1 };
  const fieldSize = { width: 1, height: 1 };
  const render = new Render(canvas, context, img, fieldSize, spriteSize);

  const options = new GameOptions(false, 1);

  new Game(state, render, options);
}

function initApp() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const context = canvas.getContext('2d');

  const img = new Image();
  img.onload = function() {
    setup();
    create1x1(canvas, context, img);
    //create32x32(canvas, context, img);
  };
  //img.src = 'spritesheet.png';
  img.src = 'sprite1x1.png';
}

if (document.readyState == 'complete') {
  initApp();
} else {
  window.onload = () => {
    initApp();
  };
}
