import minimist from "minimist"
import webhooks from "./webhooks"
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

export let tasks = Class =>
  class extends Class {

    showTasks({ webhook }) {
      let tasks = tasksToObject({ instance: this })

      if (typeof this.tasks == "function") {
        return this.tasks({ tasks, webhook })
      }

      return tasks
    }

    run({ argv, webhook }) {
      webhook = webhook || (() => {})

      if (argv) {
        argv = parseArgv(argv)
      }

      if (argv.webhooks) {
        return webhooks({ argv, instance: this })
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
        return this.showTasks.bind(factory)({ webhook })
      } else if (factory.task) {
        return factory.task({ ...argv, _, webhook })
      }
    }
  }
