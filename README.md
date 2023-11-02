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
import { agent } from './setup-local'

// ...

const someDID = 'did:ethr:0xb09b66026ba5909a7cfe99b76875431d2b8d5190'
const didResolution = await agent.resolveDid({ didUrl: someDID })
```

This is a very simple example, but you can see how the agent is configured and how it is used to resolve a DID.

You'll find some more examples in the `src` folder.

### Example 1:

```bash
pnpm run local
```

will run `src/issue-local-verify-local.ts` which configures a Veramo agent and then uses it to create an issuer DID,
issue a credential with it and then verify that credential.

### Example 2:

```bash
pnpm run server
```

will create a server that exposes the methods of the agent from the previous example as an OpenAPI endpoint.

```bash
pnpm run remote
```

will run `src/issue-local-verify-remote.ts` which configures a Veramo agent for verification and uses the methods from a
remote agent to act as the issuer.
Then it uses this `clientAgent` instance to both issue and verify a credential, while the actual issuance happens
remotely.

## Run tests

```bash
pnpm run test
```
