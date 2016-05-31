import factory from "../helpers/factory"

class B {
  init() {
    this.include(`${__dirname}/b`)
  }
  description() { return "b" }
}

export default factory(B)
