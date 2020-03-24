import { Machine, sendParent, spawn, assign, State, sendUpdate } from 'xstate';
import { log } from "xstate/lib/actions";

export function spawnWorker(worker, options) {
  const WrapperMachine = Machine({
    id: 'worker-wrapper-machine',
    initial: 'running',
    context: {},
    states: {
      running: {},
      closed: {
        entry: 'terminateService',
        type: 'final',
      }
    },
    on: {
      '*': [
        { cond: 'isStateUpdate', actions: ['assignState', sendUpdate()] },
        { cond: 'isFromWorker', actions: 'sendToParent' },
        { actions: 'sendToWorker' }
      ]
    }
  },{
    actions: {
      sendToParent: sendParent((_, event) => event.event),
      sendToWorker: (_, event) => {
        worker.postMessage(event);
      },

      assignState: assign((_, { states }) => Object.entries(states).reduce(
        (result, [name, state]) => { result[name] = JSON.parse(state); return result; },
        {}
      )),

      terminateService: () => worker.terminate(),
    },

    guards: {
      isStateUpdate: (_, { type }) => type === 'worker.state',
      isFromWorker: (_, { type }) => type === 'worker.event',
    }
  });

  const service = spawn(WrapperMachine, options);
  worker.addEventListener('message', ({ data }) => {
    // console.count('parsing worker event');
    // console.time('parsing worker event');
    service.send(data);
    // console.timeEnd('parsing worker event');
  });

  return service;
}
