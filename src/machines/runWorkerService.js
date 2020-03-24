import { interpret } from "xstate";

export function runWorkerService(machine, { sync = false } = {}) {

  // Services use sendParent() to communicate with their parent/peers,
  // so we need to intercept those events and and send them to the worker's
  // event listeners.
  const parent = {
    send: event => {
      const isAllowedEvent = ['SIGN_IN', 'GET_ID_TOKEN'].includes(event.type);
      if (isAllowedEvent)
        postMessage({
          type: 'worker.event',
          event
        });
    },
  };

  const service = interpret(machine, { parent });

  if (sync)
    service.onTransition(state => {
      const isRefreshEvent = ['xstate.init', 'REFRESH_UI'].includes(state.event.type);
      if (!isRefreshEvent)
        return console.log(state.event);

      const getChildState = name => {
        const child = service.children.get(name);
        if (!child) return undefined;

        return JSON.stringify(child.state);
      };

      postMessage({
        type: 'worker.state',
        states: {
          apollo: getChildState('apollo'),
          task: getChildState('task'),
          taskList: getChildState('taskList'),
          groupList: getChildState('groupList'),
          ui: getChildState('ui'),
          nav: getChildState('nav')
        }
      });
    });

  self.addEventListener('message', event => {
    service.send(event.data);
  }); // eslint-disable-line no-restricted-globals
  self.service = service; // eslint-disable-line no-restricted-globals

  service.start();
  return service;
}