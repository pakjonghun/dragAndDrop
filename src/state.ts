import { Project } from "./project.js";

type StateListener<T> = (arg: T[]) => void;

class BaseState<T> {
  protected state: T[] = [];
  protected listenerFuncs: StateListener<T>[] = [];

  addListener(func: StateListener<T>) {
    this.listenerFuncs.push(func);
  }
}

export class ManageState extends BaseState<Project> {
  static instance: ManageState;
  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ManageState();
      return this.instance;
    }

    return this.instance;
  }

  addState(newState: Project) {
    this.state.push(newState);
    this.listenerLoop();
  }

  private listenerLoop() {
    for (const func of this.listenerFuncs) {
      func(this.state.slice());
    }
  }

  editData(id: string) {
    const item = this.state.find((item) => item.id === id);
    if (!item) return alert("존재하지 않는 데이터 입니다.");
    const curState = item.status === "Active" ? "Finished" : "Active";
    item.status = curState;
    this.listenerLoop();
  }
}
