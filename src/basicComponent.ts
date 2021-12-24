export abstract class BasicComponent<
  H extends HTMLElement,
  E extends HTMLElement
> {
  protected template: HTMLTemplateElement;
  protected host: H;
  protected element: E;

  constructor(
    templateId: string,
    hostId: string,
    position: InsertPosition,
    elementId?: string
  ) {
    this.template = document.getElementById(templateId)! as HTMLTemplateElement;
    const importedNode = document.importNode(this.template.content, true);
    this.element = importedNode.firstElementChild! as E;
    this.host = document.getElementById(hostId)! as H;
    if (elementId) this.element.id = elementId;
    this.attach(position);
  }

  private attach(position: InsertPosition) {
    this.host.insertAdjacentElement(position, this.element);
  }
}
