let not_tasks = [ "init", "run", "description" ]

export function spacedTasks({ ignore, instance }) {
  let tasks = tasksWithDesc({ ignore, instance })
  let lengths = tasks.map(task => task[0].length).sort()
  let longest = lengths[lengths.length - 1]

  return tasks.map(task => {
    let space_length = longest - task[0].length + 1
    let space = Array(space_length).join(" ")
    return [ task[0], space, task[1] ]
  })
}

export function tasksWithDesc({ instance, prev="" }) {
  let included
  let tasks = instance._tasks

  return Object.keys(tasks).reduce((arr, task) => {
    if (!tasks[task]()) { return arr }
    if (tasks[task]().description) {
      arr.push([ 
        `${prev}${task}`, tasks[task]().description().value
      ])
    } else {
      arr.push([ `${prev}${task}`, "" ])
    }
    return arr.concat(
      tasksWithDesc({
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
