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

  if (instance.Class) {
    included = instance.Class.industry().included
  } else {
    included = Object.keys(instance)
  }

  return included.reduce((arr, task) => {
    if (!instance[task]()) { return arr }
    if (instance[task]().description) {
      arr.push([ 
        `${prev}${task}`, instance[task]().description().value
      ])
    } else {
      arr.push([ `${prev}${task}`, "" ])
    }
    return arr.concat(
      tasksWithDesc({
        instance: instance[task],
        prev: `${prev}${task}.`
      })
    )
  }, [])
}

export function taskToFactory({ instance, task }) {
  return task
    .split(".")
    .reduce((instance, key) => {
      if (instance[key]) { return instance[key] }
    }, instance)
}
