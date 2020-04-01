export function titleForUiState(state) {
  if (!state)
    return;

  if (state.matches('taskList'))
    return 'Task List';

  if (state.matches('taskView'))
    return 'Edit Task';

  if (state.matches('chooseGroupIcon'))
    return 'Choose Icon';

  return 'Koule';
}