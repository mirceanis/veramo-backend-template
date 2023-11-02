import { clientAgent } from './setup-remote'

const issuer = await clientAgent.didManagerGetOrCreate({ alias: 'myIssuer' })

console.log(`Created an issuer with ID: ${issuer.did}`)

const subject = await clientAgent.didManagerGetOrCreate({ provider: 'did:key', alias: 'mySubject' })
console.log(`Created an identifier for a subject with ID: ${subject.did}`)

const credential = await clientAgent.createVerifiableCredential({
  credential: {
    issuer: { id: issuer.did },
    credentialSubject: {
      id: subject.did,
      created: 'remotely',
    },
  },
  proofFormat: 'jwt',
})

console.log(`Created a verifiable credential: ${JSON.stringify(credential, null, 2)}`)

const verification = await clientAgent.verifyCredential({ credential })

console.log(`Verification result: ${verification.verified ? '✅' : '❌'} `)
