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

interface IDraggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface ITarget {
  dropHandler(event: DragEvent): void;
  overHandler(event: DragEvent): void;
  leaveHandler(event: DragEvent): void;
}

export interface IRenderItem
  extends BasicComponent<HTMLUListElement, HTMLLIElement> {
  renderList(): void;
}

class RenderItem
  extends BasicComponent<HTMLUListElement, HTMLLIElement>
  implements IRenderItem, IDraggable
{
  private project: Project;
  constructor(itemId: string, project: Project) {
    super("single-project", itemId, "afterbegin", project.id);
    this.project = project;
    this.element.draggable = true;
    this.renderList();

    this.element.addEventListener("dragend", this.dragEndHandler);
    this.element.addEventListener("dragstart", this.dragStartHandler);
  }

  @AutoBind
  dragEndHandler(_: DragEvent): void {}

  @AutoBind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData("text/plain", this.element.id);
    // event.dataTransfer!.effectAllowed = "move";
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
  implements IProjectList, ITarget
{
  private lis = new Set<IRenderItem>();

  private assignedState: Project[] = [];
  private ul: HTMLUListElement = this.element.querySelector("ul")!;
  constructor(
    private type: Status,
    private constractor: { new (itemId: string, project: Project): IRenderItem }
  ) {
    super("project-list", "app", "beforeend", "");
    this.renderList();

    ManageState.getInstance().addListener(this.listener);

    this.ul.addEventListener("drop", this.dropHandler);

    this.ul.addEventListener("dragover", this.overHandler);

    this.ul.addEventListener("dragleave", this.leaveHandler);
  }

  @AutoBind
  overHandler(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer!.types[0] === "text/plain") {
      this.ul.classList.add("droppable");
    }
  }

  @AutoBind
  leaveHandler(event: DragEvent): void {
    event.preventDefault();
    this.ul.classList.remove("droppable");
  }

  @AutoBind
  dropHandler(event: DragEvent): void {
    event.preventDefault();
    const id = event.dataTransfer!.getData("text/plain");

    const isExist = this.assignedState.find((item) => item.id === id);
    if (isExist) return alert("같은자리~");

    ManageState.getInstance().editData(id);
    this.renderItem();
  }

  @AutoBind
  private listener(state: Project[]) {
    this.assignedState = state.filter((item) => item.status === this.type);
    this.renderItem();
  }

  private renderItem() {
    this.ul.innerHTML = "";
    for (const item of this.assignedState) {
      const jtem = new this.constractor(this.ul.id, item);
      this.lis.add(jtem);
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
