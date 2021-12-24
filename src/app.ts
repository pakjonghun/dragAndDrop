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
  setObserver: Ovserver;
  addClass: (className: string) => void;
  removeClass: (className: string) => void;
}

type State = "start" | "end" | "leave" | "enter";
type Ovserver = (state: State, item: IRenderItem) => void;

class RenderItem
  extends BasicComponent<HTMLUListElement, HTMLLIElement>
  implements IRenderItem
{
  private observer?: Ovserver;
  private project: Project;
  constructor(itemId: string, project: Project) {
    super("single-project", itemId, "afterbegin", project.id);
    this.project = project;
    this.element.draggable = true;
    this.renderList();

    this.element.addEventListener("dragstart", () => {
      this.listener("start");
    });

    this.element.addEventListener("dragend", () => {
      this.listener("end");
    });

    this.element.addEventListener("dragenter", () => {
      this.listener("enter");
    });

    this.element.addEventListener("dragleave", () => {
      this.listener("leave");
    });
  }

  addClass(className: string) {
    this.element.classList.add(className);
  }

  removeClass(className: string) {
    this.element.classList.remove(className);
  }

  get getPeople(): string {
    const people = this.project.people;
    return people > 1 ? `${people}s` : people.toString();
  }

  set setObserver(func: Ovserver) {
    this.observer = func;
  }

  private listener(state: State) {
    this.observer && this.observer(state, this);
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
  private lis = new Set<IRenderItem>();
  private moving?: IRenderItem;
  private target?: IRenderItem;

  private assignedState: Project[] = [];
  private ul: HTMLUListElement = this.element.querySelector("ul")!;
  constructor(
    private type: Status,
    private constractor: { new (itemId: string, project: Project): IRenderItem }
  ) {
    super("project-list", "app", "beforeend", "");
    this.renderList();

    ManageState.getInstance().addListener(this.listener);

    this.ul.addEventListener("drop", (event: DragEvent) => {
      event.preventDefault();
      console.log(this.moving, this.target);
    });

    this.ul.addEventListener("dragover", (event: DragEvent) => {
      event.preventDefault();
    });
  }

  @AutoBind
  private listener(state: Project[]) {
    this.assignedState = state.filter((item) => item.status === this.type);
    this.renderItem();
  }

  private setMovingClass(className: string) {
    this.lis.forEach((item) => item.addClass(className));
  }

  private removeMovingClass(className: string) {
    this.lis.forEach((item) => item.removeClass(className));
  }

  @AutoBind
  private observer(state: State, item: IRenderItem) {
    switch (state) {
      case "end":
        this.removeMovingClass("moving");
        this.moving = undefined;
        break;
      case "start":
        this.setMovingClass("moving");
        this.moving = item;
        break;
      case "leave":
        this.target = undefined;
        break;
      case "enter":
        this.target = item;
        break;
      default:
        throw new Error("잘못된 상태 타입 입니다.");
    }
  }

  private renderItem() {
    this.ul.innerHTML = "";
    for (const item of this.assignedState) {
      const jtem = new this.constractor(this.ul.id, item);
      this.lis.add(jtem);
      jtem.setObserver = this.observer;
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
