# Getting Started with Veramo on nodejs

## Install and set up

Clone this template repository and run:

```bash
yarn install
```

**_NOTE:_** This template depends on `@next` versions of `@veramo/*` packages

### Customize config

Inspect `src/setup.ts` and choose other constants for `infuraProjectId` and `secretKey`

## Run some agent code

```typescript
import { agent } from './setup'

// ...

const someDID = 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190'
const didResolution = await agent.resolveDid({ didUrl: someDID })
```
