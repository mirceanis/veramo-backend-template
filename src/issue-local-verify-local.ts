import { agent } from './setup-local'

const issuer = await agent.didManagerGetOrCreate({ provider: 'did:key', alias: 'myIssuer' })

console.log(`Created an issuer with ID: ${issuer.did}`)

const subject = await agent.didManagerGetOrCreate({ provider: 'did:key', alias: 'mySubject' })
console.log(`Created an identifier for a subject with ID: ${subject.did}`)

const credential = await agent.createVerifiableCredential({
  credential: {
    issuer: { id: issuer.did },
    credentialSubject: {
      id: subject.did,
      created: 'locally',
    },
  },
  proofFormat: 'jwt',
})

console.log(`Created a verifiable credential: ${JSON.stringify(credential, null, 2)}`)

const verified = await agent.verifyCredential({ credential })
console.log(`Credential verified: ${verified.verified}`)
