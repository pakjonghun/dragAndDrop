import { BasicComponent } from "./basicComponent.js";
import { AutoBind } from "./desorator.js";
import { Project } from "./project.js";
import { ManageState } from "./state.js";

export interface IProjectInput
  extends BasicComponent<HTMLLIElement, HTMLDivElement> {
  configure(): void;
}

export class ProjectInput
  extends BasicComponent<HTMLLIElement, HTMLDivElement>
  implements IProjectInput
{
  constructor() {
    super("project-input", "app", "afterbegin", "user-input");
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

  configure() {
    this.element.addEventListener("submit", this.handleSubmit);
  }
}

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
