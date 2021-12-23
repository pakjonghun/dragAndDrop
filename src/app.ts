class ProjectInput {
  template: HTMLTemplateElement;
  host: HTMLDivElement;
  element: HTMLFormElement;

  constructor() {
    this.template = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.host = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(this.template.content, true);
    this.element = importedNode.firstElementChild! as HTMLFormElement;
    this.element.id = "user-input";
    this.attach();
  }

  private attach() {
    this.host.insertAdjacentElement("afterbegin", this.element);
  }
}

const Project = new ProjectInput();
