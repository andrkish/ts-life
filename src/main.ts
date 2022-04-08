import { Render, Game, State } from './engine';
import { setup } from './setup';

function initApp() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const context = canvas.getContext('2d');

  const img = new Image();
  img.onload = function() {
    setup();
    const state = new State(19, 25);
    const spriteSize = { width: 32, height: 32 };
    const fieldSize = { width: 32, height: 32 };
    const render = new Render(canvas, context, img, fieldSize, spriteSize);

    new Game(state, render);
  };
  img.src = 'spritesheet.png';
}

if (document.readyState == 'complete') {
  initApp();
} else {
  window.onload = () => {
    initApp();
  };
}
