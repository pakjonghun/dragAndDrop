import { BasicComponent } from "./basicComponent.js";
import { AutoBind } from "./desorator.js";
function validate({
  value,
  ...rest
}: {
  value: string | number;
  required?: boolean;
  max?: number;
  min?: number;
}): boolean {
  let result = true;
  const valueLength = value.toString().trim().length;
  for (const key in rest) {
    switch (key) {
      case "required":
        if (rest.required) result = !!valueLength;
        break;
      case "max":
        if (rest.max! >= 0) result = valueLength < rest.max!;
        break;
      case "min":
        if (rest.min! >= 0) result = valueLength >= rest.min!;
        break;
      default:
        throw new Error("타입이 맞지 않습니다.");
    }
    if (!result) return false;
  }
  return result;
}

type StateListener = (arg: Project[]) => void;

enum ProjectStatus {
  "Active" = "Active",
  "Finished" = "Finished",
}

type Status = keyof typeof ProjectStatus;

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: Status
  ) {}
}

class ManageState {
  private state: Project[] = [];
  private listenerFuncs: StateListener[] = [];
  static instance: ManageState;
  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new ManageState();
      return this.instance;
    }

    return this.instance;
  }

  addState(newState: Project) {
    this.state.push(newState);

    for (const func of this.listenerFuncs) {
      func(this.state.slice());
    }
  }

  addListener(func: StateListener) {
    this.listenerFuncs.push(func);
  }
}

class ProjectList extends BasicComponent {
  private assignedState: Project[] = [];
  constructor(private type: Status) {
    super("project-list", "beforeend");
    this.renderList();

    ManageState.getInstance().addListener(this.listener);
  }

  @AutoBind
  private listener(state: Project[]) {
    this.assignedState = state.filter((item) => item.status === this.type);
    this.renderItem();
  }

  private renderItem() {
    for (const item of this.assignedState) {
      const ul = this.element.querySelector("ul")!;
      const li = document.createElement("li")!;
      li.textContent = item.title;
      ul.prepend(li);
    }
  }

  private renderList() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()}-PROJECTS`;
  }
}

class ProjectInput extends BasicComponent {
  constructor() {
    super("project-input", "afterbegin");
    this.element.id = "user-input";
    this.configure();
  }

  @AutoBind
  private handleSubmit(event: Event) {
    event.preventDefault();
    const inputValues = this.getInput();
    if (!inputValues) return;
    const [title, description, people] = inputValues;
    ManageState.getInstance().addState(
      new Project(
        `${Math.random() * 1000}-${Date.now()}`,
        title,
        description,
        people,
        "Active"
      )
    );
  }

  private getInput(): [string, string, number] | void {
    const title = this.element.querySelector("#title")! as HTMLInputElement;
    const description = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    const people = this.element.querySelector("#people")! as HTMLInputElement;

    const result =
      validate({ value: title.value, required: true }) &&
      validate({ value: description.value, required: true }) &&
      validate({ value: people.value, required: true });

    if (!result) return alert("유효성 검사 실패");
    return [title.value, description.value, +people.value];
  }

  private configure() {
    this.element.addEventListener("submit", this.handleSubmit);
  }
}

new ProjectInput();
new ProjectList("Active");
new ProjectList("Finished");
