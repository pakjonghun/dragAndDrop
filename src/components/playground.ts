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
  private boxs = new Set<IBox>();
  drag?: IBox | null;
  private target?: IBox | null;
  constructor() {
    super(`<div  class="playGround"></div>`);
    this.element.addEventListener("dragover", (event: DragEvent) => {
      event.preventDefault();
    });

    this.element.addEventListener("drop", (event: DragEvent) => {
      if (!this.drag || !this.target) return;

      this.drag.attach(
        this.target,
        this.drag.getY() - event.clientY < 0 ? "beforebegin" : "afterend"
      );
    });
  }

  drop(state: DragState, drag: IBox) {
    switch (state) {
      case "end":
        this.drag?.removeClass("black");
        this.target?.removeClass("black");
        drag.removeClass("drag");
        this.drag = null;
        this.target = null;
        this.boxs.forEach((box) => box.addClass("overing"));
        break;
      case "enter":
        this.target = drag;
        drag.addClass("black");
        break;
      case "leave":
        drag.removeClass("black");
        this.target = null;
        break;
      case "start":
        this.drag = drag;
        drag.addClass("blue");
        drag.addClass("drag");
        this.boxs.forEach((box) => box.addClass("overing"));
        break;
      default:
        throw new Error("error");
    }
  }

  addChild(constructor: BoxConstractor) {
    const box = new constructor("red");
    // this.boxs?.add(box);
    box.attachTo(this.element);
    box.setListenerCallback = this.drop.bind(this);
  }
}
