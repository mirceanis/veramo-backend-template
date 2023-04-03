# Getting Started with Veramo on nodejs

## Install and set up

Clone this template repository and run:

```bash
pnpm i
```

**_NOTE:_** This template depends on `@next` versions of `@veramo/*` packages

### Customize config

Inspect `src/setup.ts` and choose other constants for `infuraProjectId` and `secretKey`

## Run some agent code

```typescript
import { agent } from './setup.js'

// ...

const someDID = 'did:ethr:goerli:0xb09b66026ba5909a7cfe99b76875431d2b8d5190'
const didResolution = await agent.resolveDid({ didUrl: someDID })
```

This is a very simple example, but you can see how the agent is configured and how it is used to resolve a DID.
The same code is available in the `src/index.ts` file.

```bash
pnpm run start
```

## Run tests

```bash
pnpm run test
```
