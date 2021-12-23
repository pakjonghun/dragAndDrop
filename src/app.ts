import { Playground } from "./components/playground.js";
import { Box } from "./components/box.js";
class App {
  private readonly root: HTMLElement;
  constructor(root: HTMLElement) {
    this.root = root;
    const playGround = new Playground();
    playGround.attachTo(this.root);

    const addButton = document.getElementById("addBox")! as HTMLButtonElement;
    addButton.addEventListener("click", () => {
      const box = new Box("red");
      playGround.addChild(box);
    });

    this.root.addEventListener("drop", () => {
      console.log(1);
    });
  }
}

new App(document.getElementById("root")! as HTMLElement);
