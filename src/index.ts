import { agent } from './setup.js'

const resolution = await agent.resolveDid({ didUrl: 'did:ethr:0xb09b66026ba5909a7cfe99b76875431d2b8d5190' })
console.dir(resolution.didDocument, { depth: 5 })
