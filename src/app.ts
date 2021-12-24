import { BasicComponent } from "./basicComponent.js";
import { AutoBind } from "./desorator.js";
import { ProjectInput } from "./input.js";
import { Project } from "./project.js";
import { ManageState } from "./state.js";

enum ProjectStatus {
  "Active" = "Active",
  "Finished" = "Finished",
}

export type Status = keyof typeof ProjectStatus;

export interface IProjectList
  extends BasicComponent<HTMLDivElement, HTMLUListElement> {
  renderList(): void;
}

export interface IRenderItem
  extends BasicComponent<HTMLUListElement, HTMLLIElement> {
  renderList(): void;
}

class RenderItem
  extends BasicComponent<HTMLUListElement, HTMLLIElement>
  implements IRenderItem
{
  private project: Project;
  constructor(itemId: string, project: Project) {
    super("single-project", itemId, "afterbegin", project.id);
    this.project = project;

    this.renderList();
  }

  get getPeople(): string {
    const people = this.project.people;
    return people > 1 ? `${people}s` : people.toString();
  }

  renderList(): void {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("p")!.textContent = this.project.description;
    this.element.querySelector("h3")!.textContent = this.getPeople;
  }
}

class ProjectList
  extends BasicComponent<HTMLDivElement, HTMLUListElement>
  implements IProjectList
{
  private assignedState: Project[] = [];
  private ul: HTMLUListElement = this.element.querySelector("ul")!;
  constructor(
    private type: Status,
    private constractor: { new (itemId: string, project: Project): IRenderItem }
  ) {
    super("project-list", "app", "beforeend", "");
    this.renderList();

    ManageState.getInstance().addListener(this.listener);
  }

  @AutoBind
  private listener(state: Project[]) {
    this.assignedState = state.filter((item) => item.status === this.type);
    this.renderItem();
  }

  private renderItem() {
    this.ul.innerHTML = "";
    for (const item of this.assignedState) {
      new this.constractor(this.ul.id, item);
    }
  }

  renderList() {
    const listId = `${this.type}-projects-list`;
    this.ul = this.element.querySelector("ul")! as HTMLUListElement;
    this.ul.id = listId;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()}-PROJECTS`;
  }
}

new ProjectInput();
new ProjectList("Active", RenderItem);
new ProjectList("Finished", RenderItem);
