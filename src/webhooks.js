import bodyParser from "body-parser"
import express from "express"
import xhub from "express-x-hub"

function listen({ app, port }) {
  app.listen(port, () => {
    console.log(`Listening at http://127.0.0.1:${port}`)
  })
  return {}
}

function middleware({ app, secret }) {
  app.use(xhub({ secret }))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  return {}
}

function routes({ app, instance, token }) {
  app.get("/up", (req, res) =>
    res.sendStatus(200)
  )

  app.post("/webhook", (req, res) => {
    let cmd = req.body
    if (cmd.token != token) return

    let output = ""
    let webhook = (...msg) => output += msg.join(" ")
    
    instance
      .run({ argv: cmd.text, webhook })
      .then(() => res.send("```" + output + "```"))
  })

  return {}
}

export default function({ argv, instance }) {
  let options = {
    app: express(),
    port: process.env.PORT || 8009,
    token: process.env.WEBHOOK_TOKEN,
    instance,
    ...argv
  }
  middleware(options)
  routes(options)
  listen(options)
}
