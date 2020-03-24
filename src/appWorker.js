import { ExchangeMachine } from "./machines/ExchangeMachine";
import { ApolloMachine } from "./machines/ApolloMachine";
import { TaskMachine } from "./machines/TaskMachine";
import { TasksModelMachine } from "./machines/TasksModelMachine";
import { GroupListMachine } from "./machines/GroupList";
import { UiMachine } from "./machines/UiMachine";
import { WaitMachine } from "./machines/WaitMachine";
import { ReplayMachine } from "./machines/ReplayMachine";
import { interpret } from "xstate";


const workerMachine = ExchangeMachine.withContext({
  config: {
    rules: {
      broadcastToParent: ['SIGN_IN', 'GET_ID_TOKEN'],
    },
    services: {
      apollo: { source: ApolloMachine },
      taskList: { source: TasksModelMachine },
      task: { source: TaskMachine },
      groupList: { source: GroupListMachine },
      ui: { source: UiMachine },
      nav: { source: ReplayMachine.withContext({ matcher: event => event.type.startsWith('NAVIGATE') }) },
      wait: { source: WaitMachine }
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