import { Colors, DragState } from "./type.js";
import { Component } from "./component.js";

type ListenerObserver = (state: DragState) => void;
export class Box extends Component {
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
  }

  set setListenerCallback(func: ListenerObserver) {
    this.listenerObserver = func;
  }

  private dragListener(dragState: DragState) {
    console.log(dragState);
    this.listenerObserver && this.listenerObserver(dragState);
  }
}
