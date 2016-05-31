import { factory } from "industry"
import { chain } from "industry-chain"
import { exception } from "industry-exception"
import { include } from "industry-include"
import { instance } from "industry-instance"
import { functions } from "industry-functions"
import { standard_io } from "industry-standard-io"
import { tasks } from "../../"

export default factory()
  .set("exception", exception)
  .set("include", include)
  .set("instance", instance)
  .set("functions", functions)
  .set("tasks", tasks)
  .set("standard_io", standard_io)
  .set("chain", chain)
