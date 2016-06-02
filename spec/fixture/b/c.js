import factory from "../../helpers/factory"

class C {
  description() { return "c" }
  task(args) {
    console.log(args)
    console.log("ran!")
    return {}
  }
}

export default factory(C)
