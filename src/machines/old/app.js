import { Machine } from "xstate";
import auth from './auth';
import navigation from './navigation';
import tasks from './tasks';
import task from './task';
import groups from './groups';
import group from './group';

function combineMachineFragments({ fragments = [], config = { type: 'parallel' }, implementation = {} }) {
  const combinedConfig = fragments.reduce((result, fragment) => Object.assign(result, {
    context: { ...result.context, ...fragment.context },
    states: { ...result.states, ...fragment.states }
  }), config);

  const combinedImplementation = fragments.reduce((result, fragment) => Object.assign(result, {
    actions: { ...result.actions, ...fragment.actions },
    services: { ...result.services, ...fragment.services },
    guards: { ...result.guards, ...fragment.guards },
    activities: { ...result.activities, ...fragment.activities }
  }), implementation);

  return [combinedConfig, combinedImplementation];
}

const [config, implementation] = combineMachineFragments({
  config: { id: 'app-machine', type: 'parallel' },
  fragments: [
    auth,
    navigation,
    tasks,
    task,
    groups,
    group
  ]
});

export default Machine(config, implementation);