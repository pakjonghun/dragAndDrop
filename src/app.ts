import { Box } from "./components/box.js";
class App {
  private readonly root: HTMLElement;
  constructor(root: HTMLElement) {
    this.root = root;

    const addButton = document.getElementById("addBox")! as HTMLButtonElement;
    console.log(addButton);
    addButton.addEventListener("click", () => {
      console.log("clicked");
      const box = new Box("red");
      box.attachTo(this.root);
    });
  }
}

new App(document.getElementById("root")! as HTMLElement);
