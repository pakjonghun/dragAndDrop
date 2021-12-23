import { Colors, DragState } from "./type.js";
import { Component, IComponent } from "./component.js";
import { IBox } from "./box.js";

export type BoxConstractor = {
  new (color: Colors): IBox;
};

export interface IPlayground extends IComponent {
  addChild(constructor: BoxConstractor): void;
}

export class Playground extends Component implements IPlayground {
  private drag?: IComponent | null;
  private target?: IComponent | null;
  constructor() {
    super(`<div  class="playGround"></div>`);

    this.element.addEventListener("dragover", (event: DragEvent) => {
      event.preventDefault();
    });

    this.element.addEventListener("drop", (_: DragEvent) => {
      console.log(2);
    });
  }

  drop(state: DragState, drag: IBox) {
    switch (state) {
      case "end":
        this.drag = null;
        this.target = null;
        break;
      case "enter":
        this.target = drag;
        break;
      case "leave":
        this.target = null;
        break;
      case "start":
        this.drag = drag;
        break;
    }
  }

  addChild(constructor: BoxConstractor) {
    const box = new constructor("red");
    box.attachTo(this.element);
    box.setListenerCallback = this.drop;
  }
}
