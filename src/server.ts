import express from 'express'
import { agent } from './setup.js'
import { AgentRouter, ApiSchemaRouter, RequestWithAgentRouter, WebDidDocRouter } from '@veramo/remote-server'

const exposedMethods = agent.availableMethods()
const basePath = '/agent'
const schemaPath = '/open-api.json'

const agentRouter = AgentRouter({
  exposedMethods,
})

const schemaRouter = ApiSchemaRouter({
  basePath,
  exposedMethods,
})

const app = express()
app.use(RequestWithAgentRouter({ agent }))
app.use(basePath, agentRouter)
app.use(schemaPath, schemaRouter)
app.use(WebDidDocRouter({}))
app.listen(3002, () => console.log('Listening on port 3002'))
