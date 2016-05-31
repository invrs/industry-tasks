import factory from "../helpers/factory"

describe("IndustryTasks", () => {
  it("works", (done) => {
    let base = class {
      init() {
        this.include(`${__dirname}/../fixture`)
      }
    }
    let test = factory().base(base)
    test().run({ argv: "b tasks" }).then(done)
  })
})
