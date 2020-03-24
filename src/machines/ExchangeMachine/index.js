import { Machine, assign, spawn, sendParent } from 'xstate';

export const ExchangeMachine = Machine({
    id: 'exchange-machine',
    context: {
      config: {
        services: {},
        rules: {},
      },
      services: {},
    },
    initial: 'initializing',
    states: {
      initializing: {
        entry: 'createServices',
        on: {
          '': 'running'
        }
      },
      running: {
        on: {
          '*': [
            { cond: 'isXStateMessage' },
            { actions: ['broadcastToPeers', 'broadcastToParent'] }
          ]
        }
      }
    }
  },{
    actions: {
      createServices: assign({
        services: ({ services = {}, config = {} }, { type: eventType }) => {
          return Object
            .entries(config.services)
            .reduce(
              (result, [name, config]) => {
                const {
                  source,
                  createOn = 'xstate.init',
                  sync = false
                } = config;

                if (!services[name] && eventType === createOn)
                  result[name] = spawn(source, { name, sync });

                return result;
              },
              { ...services }
            )
        }
      }),

      broadcastToPeers: ({ services }, event, meta) => {
        const origin = meta._event.origin;
        Object.values(services).forEach(service =>
          service.sessionId !== origin && service.send(event)
        );
      },

      broadcastToParent: sendParent(({ config }, event) => {
        const { rules: { broadcastToParent } = {} } = config;
        if (Array.isArray(broadcastToParent) && broadcastToParent.includes(event.type))
          return event;

        if (broadcastToParent)
          return event;

        return '';
      }),
    },

    guards: {
      isXStateMessage: (_, { type }) => {
        type.startsWith('xstate.')
      },
    }
  }
);