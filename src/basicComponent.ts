export abstract class BasicComponent<
  H extends HTMLElement,
  E extends HTMLElement
> {
  protected template: HTMLTemplateElement;
  protected host: H;
  protected element: E;

  constructor(id: string, position: InsertPosition) {
    this.template = document.getElementById(id)! as HTMLTemplateElement;
    this.host = document.getElementById("app")! as H;
    const importedNode = document.importNode(this.template.content, true);
    this.element = importedNode.firstElementChild! as E;

    this.attach(position);
  }

  private attach(position: InsertPosition) {
    this.host.insertAdjacentElement(position, this.element);
  }
}
