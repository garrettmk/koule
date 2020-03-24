import { Router } from "../RouterMachine";
import { ApolloMachine } from "../ApolloMachine";
import { TaskMachine } from "../TaskMachine";
import { runWorkerService } from "../runWorkerService";
import { TaskListMachine } from "../TaskListMachine";
import { TasksModelMachine } from "../TasksModelMachine";
import { GroupListMachine } from "../GroupList";
import { UiMachine } from "../UiMachine";
import { NavigationMachine } from "../NavigationMachine";
import { WaitMachine } from "../WaitMachine";

export const AppWorkerMachine = Router({
  broadcastToParent: true,
  apollo: {
    source: ApolloMachine,
    type: 'machine',
    sync: false,
  },
  task: {
    source: TaskMachine,
    type: 'machine',
    sync: false
  },
  taskList: {
    source: TasksModelMachine,
    type: 'machine',
    sync: false
  },
  groupList: {
    source: GroupListMachine,
    type: 'machine',
    sync: false
  },
  ui: {
    source: UiMachine,
    type: 'machine',
    sync: false,
  },
  nav: {
    source: NavigationMachine,
    type: 'machine',
    sync: false
  },
  wait: {
    source: WaitMachine,
    type: 'machine',
  }
});

runWorkerService(AppWorkerMachine, { sync: true });