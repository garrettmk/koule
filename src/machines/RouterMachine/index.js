import { Machine, assign, spawn, sendParent } from 'xstate';
import { spawnWorker } from "../spawnWorker";

export const Router = config => {
  return Machine({
    id: 'router-machine',
    context: {
      services: {},
    },
    initial: 'initializing',
    states: {
      initializing: {
        entry: 'createServices',
        on: {
          '': 'running',
        }
      },
      running: {
        on: {
          '*': [
            { cond: 'isXStateMessage' },
            { actions: ['createServices', 'broadcastToPeers', 'broadcastToParent'] }
          ]
        }
      }
    }
  },{
    actions: {
      createServices: assign({
        services: ({ services }, { type: eventType }) => Object
          .entries(config)
          .reduce(
            (result, [name, config]) => {
              if (['broadcastToParent'].includes(name))
                return result;

              const {
                source,
                createOn = 'xstate.init',
                type = 'machine',
                sync = false
              } = config;

              if (!services[name] && eventType === createOn)
                result[name] = type === 'machine'
                  ? spawn(source, { name, sync })
                  : spawnWorker(new source(), { name, sync });

              return result;
            },
            { ...services }
          )
      }),

      broadcastToPeers: ({ services }, event, meta) => {
        const origin = meta._event.origin;
        Object.values(services).forEach(service =>
          service.sessionId !== origin && service.send(event)
        );
      },

      broadcastToParent: config.broadcastToParent
        ? sendParent((_, event, meta) => {
          if (meta._event.origin)
            return event;

          return '';
        })
        : () => null,
    },

    guards: {
      isXStateMessage: (_, { type }) => type.startsWith('xstate.'),
    }
  });
};