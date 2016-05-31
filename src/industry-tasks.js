import minimist from "minimist"
import { spacedTasks, taskToFactory } from "./tasks"

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

function runTask({ _ }) {
  let factory
  let task = _.shift()
  let tasks = _.indexOf("tasks") > -1

  if (task) {
    factory = taskToFactory({ instance: this, task })()
  } else {
    factory = this
  }

  if (tasks) {
    return showTasks.bind(factory)()
  } else {
    return factory().run({ ...args, _ })
  }
}

function showTasks() {
  let tasks = spacedTasks({ instance: this })

  if (this.tasks) {
    return this.tasks({ tasks })
  } else {
    tasks.forEach(task => console.log(...task))
  }

  return tasks
}

export let tasks = Class =>
  class extends Class {

    run({ argv=process.argv.slice(2) }) {
      if (typeof argv == "string") {
        argv = argv.split(/\s+/g)
      }

      if (Array.isArray(argv)) {
        argv = minimist(argv)
      }

      return runTask.bind(this)(argv)
    }
  }
