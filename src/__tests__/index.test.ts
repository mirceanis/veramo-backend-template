import { jest } from '@jest/globals'
import { agent } from '../setup.js'

jest.setTimeout(30000)

describe('basic', () => {
  beforeAll(async () => {
    // nop
  })

  it('1. resolves hardcoded DID using agent', async () => {
    const address = '0xb09B66026bA5909A7CFE99b76875431D2b8D5190'
    const did = `did:ethr:${address}`
    const resolution = await agent.resolveDid({
      didUrl: `${did}?versionId=0`,
    })
    expect(resolution.didDocument).toEqual({
      '@context': ['https://www.w3.org/ns/did/v1', 'https://w3id.org/security/suites/secp256k1recovery-2020/v2'],
      id: did,
      verificationMethod: [
        {
          blockchainAccountId: `eip155:1:${address}`,
          controller: did,
          id: `${did}#controller`,
          type: 'EcdsaSecp256k1RecoveryMethod2020',
        },
      ],
      authentication: [`${did}#controller`],
      assertionMethod: [`${did}#controller`],
    })
  })

  it('2. creates a DID', async () => {
    const created = await agent.didManagerGetOrCreate({
      alias: 'myDID',
    })
    expect(created.keys).toHaveLength(1)
  })

  it('3. creates and saves a Credential', async () => {
    const myDID = await agent.didManagerGetByAlias({
      alias: 'myDID',
    })
    const credential = await agent.createVerifiableCredential({
      credential: {
        credentialSubject: {
          hello: 'world',
        },
        issuer: myDID.did,
      },
      proofFormat: 'jwt',
    })
    await agent.dataStoreSaveVerifiableCredential({ verifiableCredential: credential })
    expect(credential.credentialSubject).toEqual({
      hello: 'world',
    })
  })

  it('4. finds a Credential', async () => {
    const myDID = await agent.didManagerGetByAlias({
      alias: 'myDID',
    })
    const myCredential = await agent.dataStoreORMGetVerifiableCredentials({
      where: [{ column: 'issuer', value: [myDID.did] }],
    })

    expect(myCredential[0].verifiableCredential.credentialSubject).toEqual({
      hello: 'world',
    })
  })
})
