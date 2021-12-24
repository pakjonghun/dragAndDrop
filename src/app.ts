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
  extends BasicComponent<HTMLUListElement, HTMLDivElement> {
  renderList(): void;
}

class ProjectList
  extends BasicComponent<HTMLUListElement, HTMLDivElement>
  implements IProjectList
{
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
    const ul = this.element.querySelector("ul")!;
    ul.innerHTML = "";
    for (const item of this.assignedState) {
      const li = document.createElement("li")!;
      li.textContent = item.title;
      ul.prepend(li);
    }
  }

  renderList() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()}-PROJECTS`;
  }
}

new ProjectInput();
new ProjectList("Active");
new ProjectList("Finished");
