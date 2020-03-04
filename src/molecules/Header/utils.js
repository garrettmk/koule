export function titleForNavEvent(event) {
  if (!event)
    return;

  const { type, title } = event;

  const titleMap = {
    NAVIGATE_TASKS: 'Task List',
    NAVIGATE_TASK: 'Edit Task'
  };

  return title || titleMap[type] || type;
}