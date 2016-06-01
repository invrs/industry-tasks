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

function parseArgv(argv) {
  if (typeof argv == "string") {
    argv = argv.split(/\s+/g)
  }

  if (Array.isArray(argv)) {
    argv = minimist(argv)
  }

  return argv
}

function runAndReturn({ args, bind_to, fn, name }) {
  let output = fn.bind(bind_to)(...args)
  return output
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

    run({ args, argv }) {
      if (argv) {
        delete args.argv
        args = parseArgv(argv)
      }

      let factory, task
      let { _ } = args
      let tasks = _.indexOf("tasks") > -1 || _.indexOf("t") > -1
      
      if ([ "tasks", "t" ].indexOf(_[0]) == -1) {
        task = _.shift()
      }

      if (task) {
        factory = taskToFactory({ instance: this, task })
        if (typeof factory == "function") {
          factory = factory()
        }
      } else {
        factory = this
      }

      if (tasks) {
        return showTasks.bind(factory)()
      } else if (task) {
        return factory.run({ ...args, _ })
      } else if (super.run) {
        return super.run({ ...argv, _ })
      }
    }
  }
