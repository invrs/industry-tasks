import minimist from "minimist"
import { spacedTasks } from "./tasks"

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

function runTask({ _, tasks, t }) {
  if (tasks || t) {
    return showTasks.bind(this)()
  } else {
    return {}
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

    run({ argv, slack }) {
      argv = (argv || slack).split(/\s+/g)
      if (argv) {
        argv = minimist(argv)
      } else {
        argv = minimist(process.argv.slice(2))
      }

      return runTask.bind(this)(argv)
    }
  }
