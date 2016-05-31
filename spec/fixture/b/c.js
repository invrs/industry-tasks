import factory from "../../helpers/factory"

class C {
  description() { return "c" }
  run() {
    console.log("ran!")
    return {}
  }
}

export default factory(C)
