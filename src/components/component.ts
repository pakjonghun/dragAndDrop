export interface IComponent {
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
  removeFrom(parent: HTMLElement): void;
  attach(target: IComponent, position: InsertPosition): void;
}

export class Component implements IComponent {
  protected element: HTMLElement;

  constructor(htmlText: string) {
    const template = document.createElement("template");
    template.innerHTML = htmlText;
    this.element = template.content.firstElementChild! as HTMLElement;
  }

  attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
    parent.insertAdjacentElement(position, this.element);
  }

  removeFrom(parent: HTMLElement) {
    parent.removeChild(this.element);
  }

  attach(target: IComponent, position: InsertPosition) {
    target.attachTo(this.element, position);
  }
}
