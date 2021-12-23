import { Colors, DragState } from "./type.js";
import { Component, IComponent } from "./component.js";

type ListenerObserver = (state: DragState) => void;
export interface IBox extends IComponent {
  setListenerCallback: ListenerObserver;
}
export class Box extends Component implements IBox {
  private listenerObserver?: ListenerObserver;
  constructor(color: Colors) {
    super(`<div class="box" draggable="true"></div>`);
    this.element.classList.add(color);

    this.element.addEventListener("dragstart", () => {
      this.dragListener("start");
    });
    this.element.addEventListener("dragend", () => {
      this.dragListener("end");
    });
    this.element.addEventListener("dragenter", () => {
      this.dragListener("enter");
    });
    this.element.addEventListener("dragleave", () => {
      this.dragListener("leave");
    });

    this.element.addEventListener("dragover", (event: DragEvent) => {
      event.preventDefault();
    });
  }

  set setListenerCallback(func: ListenerObserver) {
    this.listenerObserver = func;
  }

  private dragListener(state: DragState) {
    this.listenerObserver && this.listenerObserver(state);
    console.log(state);
  }
}
