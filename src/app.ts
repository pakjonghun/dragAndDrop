class ProjectInput {
  template: HTMLTemplateElement;
  host: HTMLDivElement;
  element: HTMLFormElement;
  titleInput: HTMLInputElement;
  description: HTMLTextAreaElement;
  people: HTMLInputElement;

  constructor() {
    this.template = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.host = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(this.template.content, true);
    this.element = importedNode.firstElementChild! as HTMLFormElement;
    this.element.id = "user-input";
    this.attach();

    this.titleInput = document.getElementById("title")! as HTMLInputElement;
    this.description = document.getElementById(
      "description"
    )! as HTMLTextAreaElement;
    this.people = document.getElementById("people")! as HTMLInputElement;

    this.element.addEventListener("submit", (event: Event) => {
      event.preventDefault();
      console.log(this.titleInput.value);
      console.log(this.description.value);
      console.log(this.people.value);
    });
  }

  private attach() {
    this.host.insertAdjacentElement("afterbegin", this.element);
  }
}

const Project = new ProjectInput();
