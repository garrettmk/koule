export function titleForNavEvent(event) {
  if (!event)
    return;

  const { type, title } = event;

  const titleMap = {
    NAVIGATE_TASK_LIST: 'Task List',
    NAVIGATE_TASK: 'Edit Task',
    NAVIGATE_CHOOSE_ICON: 'Choose Icon',
    NAVIGATE_CURRENT_TASK: 'Current Task'
  };

  return title || titleMap[type] || type;
}