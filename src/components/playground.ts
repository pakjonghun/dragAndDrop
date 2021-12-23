import { Component, IComponent } from "./component.js";

export interface IPlayground extends IComponent {
  addChild(child: IComponent): void;
}
export class Playground extends Component implements IPlayground {
  constructor() {
    super(`<div  class="playGround"></div>`);

    this.element.addEventListener("drop", (_: DragEvent) => {
      console.log(2);
    });

    this.element.addEventListener("drop", (_: DragEvent) => {
      console.log(2);
    });
    this.element.addEventListener("dragover", (event: DragEvent) => {
      event.preventDefault();
    });
  }

  addChild(child: IComponent) {
    child.attachTo(this.element);
  }
}
