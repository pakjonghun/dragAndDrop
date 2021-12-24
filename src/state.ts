import { Project } from "./project.js";

type StateListener = (arg: Project[]) => void;

export class ManageState {
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
