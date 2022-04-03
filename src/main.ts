import { helloWorld } from './engine';

function renderHello(divName: string, name: string) {
  const elt = document.getElementById(divName);
  elt.innerText = helloWorld(name);
}

// it works!
renderHello('greeting', 'TypeScript');
