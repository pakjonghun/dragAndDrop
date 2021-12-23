export interface IComponent {
  attachTo(parent: HTMLElement, position: InsertPosition): void;
  removeFrom(parent: HTMLElement): void;
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
}
