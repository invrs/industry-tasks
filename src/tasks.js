let not_tasks = [ "init", "run", "description" ]

export function tasksToObject({ instance, prev="" }) {
  let included
  let tasks = instance._tasks

  return Object.keys(tasks).reduce((arr, task) => {
    let description

    if (!tasks[task]()) { return arr }
    
    if (tasks[task]().description) {
      description = tasks[task]().description().value
    }
    
    arr.push({ task: `${prev}${task}`, description })
    
    return arr.concat(
      tasksToObject({
        instance: { _tasks: tasks[task] },
        prev: `${prev}${task}.`
      })
    )
  }, [])
}

export function taskToFactory({ instance, task }) {
  let tasks = instance._tasks
  return task
    .split(".")
    .reduce((tasks, key) => {
      if (tasks[key]) { return tasks[key] }
    }, tasks)
}
