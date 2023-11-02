import express from 'express'
import { agent } from './setup-local'
import {
  AgentRouter,
  ApiSchemaRouter,
  MessagingRouter,
  RequestWithAgentRouter,
  WebDidDocRouter,
} from '@veramo/remote-server'

const exposedMethods = agent.availableMethods()
const basePath = '/agent'
const messagingPath = '/messaging'
const schemaPath = '/open-api.json'

const agentRouter = AgentRouter({
  exposedMethods,
})

const schemaRouter = ApiSchemaRouter({
  basePath,
  exposedMethods,
})

const messagingRouter = MessagingRouter({
  metaData: { type: 'incoming' },
  save: false,
})

const app = express()
app.use(RequestWithAgentRouter({ agent }))
app.use(basePath, agentRouter)
app.use(schemaPath, schemaRouter)
app.use(messagingPath, messagingRouter)
app.use(WebDidDocRouter({}))

const PORT = 3002
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
