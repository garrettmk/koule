export function titleForNavEvent(event) {
  if (!event)
    return;

  const { type, title } = event;

  const titleMap = {
    NAVIGATE_TASKS: 'Task List',
    NAVIGATE_TASK: 'Edit Task',
    NAVIGATE_CHOOSE_ICON: 'Choose Icon',
  };

  return title || titleMap[type] || type;
}