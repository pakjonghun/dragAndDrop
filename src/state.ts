import { Project } from "./project.js";

type StateListener<T> = (arg: T[]) => void;

class BaseState<T> {
  protected state: T[] = [];
  protected listenerFuncs: StateListener<T>[] = [];

  addState(newState: T) {
    this.state.push(newState);

    for (const func of this.listenerFuncs) {
      func(this.state.slice());
    }
  }

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
}
