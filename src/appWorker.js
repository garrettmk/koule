import { ExchangeMachine } from "./machines/ExchangeMachine";
import { ApiMachine, apolloApi } from "./machines/ApiMachine";
import { TaskMachine } from "./machines/TaskMachine";
import { TasksModelMachine } from "./machines/TasksModelMachine";
import { GroupListMachine } from "./machines/GroupList";
import { UiMachine } from "./machines/UiMachine";
import { WaitMachine } from "./machines/WaitMachine";
import { NetworkStatusMachine, workerConfig } from "./machines/NetworkStatusMachine";
import { OfflineMachine } from "./machines/OfflineMachine";
import { NotificationMachine } from "./machines/NotificationMachine";
import { interpret } from "xstate";
import { apiConfig } from "./config/api";


const workerMachine = ExchangeMachine.withContext({
  config: {
    rules: {
      broadcastToParent: ['SIGN_IN', 'GET_ID_TOKEN', 'NETWORK_ONLINE'],
    },
    services: {
      api: { source: ApiMachine.withConfig(apolloApi(apiConfig)) },
      taskList: { source: TasksModelMachine },
      task: { source: TaskMachine },
      groupList: { source: GroupListMachine },
      ui: { source: UiMachine },
      wait: { source: WaitMachine },
      offline: { source: OfflineMachine },
      network: { source: NetworkStatusMachine.withConfig(workerConfig) },
      notifications: { source: NotificationMachine }
    }
  }
});

const workerService = interpret(
  workerMachine,
  {
    parent: {
      send: event => {
        postMessage(JSON.stringify(event))
      }
    }
  }
);

workerService.onTransition(
  state => {
    const isRefreshEvent = ['xstate.init', 'REFRESH_UI'].includes(state.event.type);
    if (!isRefreshEvent)
      return;

    let childStates = {};
    workerService.children.forEach((child, name) => childStates[name] = child.state);

    postMessage(JSON.stringify({
      type: 'worker.state',
      states: childStates
    }));
  }
);


self.addEventListener('message', event => {
  workerService.send(JSON.parse(event.data))
});

workerService.start();