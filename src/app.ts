type UserInput = [string, string, number];

type validates = {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  gt?: number;
};

function validateFunc({ value, ...args }: validates): boolean {
  let result = true;
  const valueLength = value.toString().trim().length;
  for (const key in args) {
    switch (key) {
      case "required":
        if (args.required) result = !!valueLength;
        break;
      case "minLength":
        if (typeof args.minLength === "number" && args.minLength >= 0)
          result = valueLength >= args.minLength;
        break;
      case "maxLength":
        if (typeof args.maxLength === "number" && args.maxLength >= 0)
          result = valueLength <= args.maxLength;
        break;
      case "gt":
        if (typeof args.gt === "number" && typeof value === "number")
          result = value > args.gt;
        break;
      default:
        alert("유효성 검사 실패");
        throw new Error("올바른 유효성검사 타입을 입력하세요 ");
    }
    if (!result) return result;
  }
  return result;
}

class ManageState {
  private listener: any[] = [];
  private projects: any[] = [];
  private static instance: ManageState;

  static getInstance() {
    if (this.instance) return this.instance;
    this.instance = new ManageState();
    return this.instance;
  }

  addListener(listenerFunc: Function) {
    this.listener.push(listenerFunc);
  }

  addProject(title: string, desc: string, people: number) {
    const id = `${Math.random() * 1000}_${Date.now()}`;
    this.projects.push({ id, title, desc, people });

    for (const listenerFn of this.listener) {
      listenerFn(this.projects.slice());
    }
  }

  get getProject() {
    return this.projects;
  }

  deleteById(id: string) {
    this.projects = this.projects.filter((item) => item.id !== id);
  }
}

class ProjectInput {
  private template: HTMLTemplateElement;
  private host: HTMLDivElement;
  private element: HTMLFormElement;
  private titleInput: HTMLInputElement;
  private description: HTMLTextAreaElement;
  private people: HTMLInputElement;

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

    this.configure();
  }

  @AutoBind
  private submitHandle(event: Event) {
    event.preventDefault();
    const data = this.getUserInput();
    if (!data) return;
    projectState.addProject(data[0], data[1], data[2]);
    this.cleanInput();
  }

  private cleanInput() {
    this.titleInput.value = "";
    this.description.value = "";
    this.people.value = "";
  }

  private getUserInput(): UserInput | void {
    const title = this.titleInput.value;
    const description = this.description.value;
    const people = +this.people.value;
    const result =
      validateFunc({ value: title, required: true, maxLength: 5 }) &&
      validateFunc({ value: description, required: true, minLength: 5 }) &&
      validateFunc({ value: people, gt: 5, required: true });

    return result ? [title, description, people] : alert("유효성 검사 실패");
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandle);
  }

  private attach() {
    this.host.insertAdjacentElement("afterbegin", this.element);
  }
}

//deco
function AutoBind(_: any, __: string, propertyDescriptor: PropertyDescriptor) {
  const origin = propertyDescriptor.value;
  const adjDesporitor: PropertyDescriptor = {
    configurable: true,
    get() {
      const temp = origin.bind(this);
      return temp;
    },
  };
  return adjDesporitor;
}
const projectState = ManageState.getInstance();
class ProjectList {
  private element: HTMLElement;
  private template: HTMLTemplateElement;
  private host: HTMLDivElement;
  assignedProjects: any[];

  constructor(private type: "active" | "finished") {
    this.template = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.host = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(this.template.content, true);
    this.element = importedNode.firstElementChild! as HTMLElement;
    this.element.id = `${this.type}-projects`;
    this.assignedProjects = [];

    projectState.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.render();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-project-list`
    )! as HTMLUListElement;
    for (const item of this.assignedProjects) {
      const listItem = document.createElement("li")!;
      listItem.textContent = item.title;
      listEl.appendChild(listItem);
    }
  }

  attach() {
    this.host.insertAdjacentElement("beforeend", this.element);
  }

  render() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()}-PROJECTS`;
    this.element.querySelector("ul")!.id = listId;
  }
}

new ProjectInput();
new ProjectList("active");
new ProjectList("finished");
