let not_tasks = [ "init", "run", "description" ]

function instanceTasks({ ignore, instance }) {
  if (!instance.functions) { return [] }
  return Object.keys(instance.functions()).filter(name =>
    ignore.indexOf(name) == -1 && not_tasks.indexOf(name) == -1
  ).sort()
}

function taskDesc({ ignore, prev="", tasks }) {
  return tasks.reduce((arr, task) => {
    if (!this[task]()) { return arr }
    if (this[task]().description) {
      arr.push([ 
        `${prev}${task}`, this[task]().description()
      ])
    } else {
      arr.push([ `${prev}${task}`, "" ])
    }
    return arr.concat(
      taskDesc.bind(this[task]())({
        ignore,
        prev: `${prev}${task}.`,
        tasks: instanceTasks({ ignore, instance: this[task]() })
      })
    )
  }, [])
}

function taskToCommand({ instance, task }) {
  return task
    .split(".")
    .reduce((instance, key) => {
      if (instance[key]) { return instance[key] }
    }, instance)
}

function patch(ignore, type) {
  for (let name in this.functions()) {
    if (ignore[type].indexOf(name) == -1) {
      let fn = this[name]
      this[name] = (...args) =>
        runAndReturn({ args, bind_to: this, fn, name })
    }
  }
}

function runAndReturn({ args, bind_to, fn, name }) {
  let output = fn.bind(bind_to)(...args)
  return output
}

export let tasks = Class =>
  class extends Class {

    run() {
      let ignore = this.Class.industry().ignore.instance
      let tasks = instanceTasks({ ignore, instance: this })

      console.log(taskDesc.bind(this)({ ignore, tasks }))
      
      if (super.run) super.run()
      return {}
    }
  }
