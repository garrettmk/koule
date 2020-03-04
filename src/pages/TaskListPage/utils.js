import { isSameDay } from "date-fns";

export function groupTasksByDay(tasks) {
  return tasks.reduce((result, task, index) => {
    if (!index)
      return [[task]];

    const lastTask = tasks[index - 1];

    if (!isSameDay(new Date(lastTask.start), new Date(task.start)))
      return [...result, [task]];

    result[result.length - 1].push(task);
    return result;
  }, [])
}

export function groupTasksByGroup(tasks) {
  return tasks.reduce((result, task, index) => {
    if (!index)
      return [[task]];

    const lastTask = tasks[index - 1];

    if (lastTask.group_id !== task.group_id)
      return [...result, [task]];

    result[result.length - 1].push(task);
    return result;
  }, []);
}


export function formatTotalMilliseconds(total) {
  let result = '';
  let remaining = total;

  const msPerHour = 60 * 60 * 1000;
  const hours = Math.floor(total / msPerHour);
  remaining = total - (hours * msPerHour);

  if (hours)
    result = `${hours}:`;

  const msPerMinute = 60 * 1000;
  const minutes = Math.floor(remaining / msPerMinute);
  remaining = remaining - (minutes * msPerMinute);
  result = `${result}${minutes < 10 ? '0' : ''}${minutes}:`;

  const msPerSecond = 1000;
  const seconds = Math.floor(remaining / msPerSecond);
  result = `${result}${seconds < 10 ? '0' : ''}${seconds}`;

  return result;
}

export function formatTotalTaskTime(tasks = []) {
  const totalMilliseconds = tasks.reduce((result, task) =>
    result
    + (task.end  ? new Date(task.end) : new Date).getTime()
    - new Date(task.start).getTime(),
    0
  );

  return formatTotalMilliseconds(totalMilliseconds);
}

export function formatTaskDuration(task) {
  const start = new Date(task.start);
  const end = task.end ? new Date(task.end) : new Date();

  const duration = end.getTime() - start.getTime();
  return formatTotalMilliseconds(duration);
}