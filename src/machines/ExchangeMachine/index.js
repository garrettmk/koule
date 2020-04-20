import { Machine, assign, spawn, sendParent, send } from 'xstate';
import { raise } from "xstate/lib/actions";
import { merge } from "lodash";
import cuid from "cuid";

export const ExchangeMachine = Machine({
    id: 'exchange-machine',
    context: {
      config: {
        services: {},
        rules: {},
        data: undefined,
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
          'exchange.spawn': {
            actions: 'handleSpawnDirective',
          },
          'exchange.config': {
            actions: 'handleConfigDirective'
          },
          'exchange.assign': {
            actions: 'handleAssignDirective',
          },
          'exchange.send': {
            cond: 'hasEventsToSend',
            actions: ['sendFirstEvent', 'raiseRemainingEvents']
          },
          'exchange.broadcast': {
            actions: 'handleBroadcastDirective',
          },
          '*': [
            { cond: 'isXStateMessage' },
            { cond: 'isMappedEvent', actions: 'handleMappedEvent' },
            { actions: ['broadcastToPeers', 'broadcastToParent'] }
          ]
        }
      },
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

      handleSpawnDirective: assign({
        services: ({ services = {} }, { id = cuid(), source, sync }) => {
          if (services[id])
            services[id].stop();

          return {
            ...services,
            [id]: spawn(source, { name: id, sync })
          };
        }
      }),

      handleUpdateConfigDirective: assign({
        config: ({ config }, { config: newConfig }) => merge(config, newConfig)
      }),

      handleMappedEvent: send((context, event) => {
        return context.config.rules.map[event.type](context, event) || '';
      }),

      handleAssignDirective: assign({
        data: (_, { data }) => data
      }),

      sendFirstEvent: send((_, { events }) => {
        return events[0];
      }),

      raiseRemainingEvents: raise((_, { events }) => ({
        type: 'exchange.send',
        events: events.slice(1),
      })),

      handleBroadcastDirective: sendParent(({ services }, { event, toPeers = true, toParent = true }, meta) => {
        const { origin } = meta._event;

        if (toPeers)
          Object.values(services).forEach(service =>
            service.sessionId !== origin && service.send(event)
          );

        if (toParent)
          return event;

        return '';
      })
    },

    guards: {
      isXStateMessage: (_, { type }) => type.startsWith('xstate.'),

      isMappedEvent: ({ config: { rules = {} } }, { type }) => {
        const { map = {} } = rules;
        return Object.keys(map).includes(type);
      },

      hasEventsToSend: (_, { events = [] }) => Boolean(events.length),
    }
  }
);