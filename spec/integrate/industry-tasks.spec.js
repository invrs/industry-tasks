import { factory } from "industry"
import { chain } from "industry-chain"
import { exception } from "industry-exception"
import { instance } from "industry-instance"
import { functions } from "industry-functions"
import { standard_io } from "industry-standard-io"
import { tasks } from "../../"

describe("IndustryTasks", () => {
  function makeTest() {
    return factory()
      .set("exception", exception)
      .set("instance", instance)
      .set("functions", functions)
      .set("tasks", tasks)
  }

  it("works", () => {
    let base3 = class {
      description() { return "hello2" }
    }
    let base2 = class {
      description() { return "hello" }
      b() {
        return makeTest().base(base3)()
      }
    }
    let base = class {
      a() {
        return makeTest().base(base2)()
      }
    }
    let test = makeTest().base(base)
    test().run()
  })
})
