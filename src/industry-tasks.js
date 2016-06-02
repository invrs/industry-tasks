import minimist from "minimist"
import { spacedTasks, taskToFactory } from "./tasks"

function parseArgv(argv) {
  if (typeof argv == "string") {
    argv = argv.split(/\s+/g)
  }

  if (Array.isArray(argv)) {
    argv = minimist(argv)
  }

  return argv
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
      } else if (this.task) {
        return this.task({ ...argv, _ })
      }
    }
  }
