import minimist from "minimist"
import { tasksToObject, taskToFactory } from "./tasks"

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
  let tasks = tasksToObject({ instance: this })

  if (typeof this.tasks == "function") {
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
        argv = parseArgv(argv)
      }

      let factory, task
      let { _ } = argv
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
      } else if (factory.task) {
        return factory.task({ ...argv, _ })
      }
    }
  }
