export class BasicComponent {
  protected template: HTMLTemplateElement;
  protected host: HTMLElement;
  protected element: HTMLElement;

  constructor(id: string, position: InsertPosition) {
    this.template = document.getElementById(id)! as HTMLTemplateElement;
    this.host = document.getElementById("app")! as HTMLElement;
    const importedNode = document.importNode(this.template.content, true);
    this.element = importedNode.firstElementChild! as HTMLElement;

    this.attach(position);
  }

  private attach(position: InsertPosition) {
    this.host.insertAdjacentElement(position, this.element);
  }
}
