import { Colors } from "./type.js";
import { Component } from "./component.js";
export class Box extends Component {
  constructor(color: Colors) {
    super(`<div class="box" draggable="true"></div>`);
    this.element.classList.add(color);
  }
}
