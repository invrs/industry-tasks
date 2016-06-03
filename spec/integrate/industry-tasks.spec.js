import factory from "../helpers/factory"

describe("IndustryTasks", () => {
  it("works", (done) => {
    let base = class {
      init() {
        this._tasks = this.include(`${__dirname}/../fixture`)
      }
    }
    let test = factory().base(base)
    test().run({ argv: "b.c p 1" }).then(done)
  })
})
