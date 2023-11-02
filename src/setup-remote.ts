import { createAgent, ICredentialPlugin, IResolver } from '@veramo/core'
import { CredentialPlugin } from '@veramo/credential-w3c'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'
import { getDidKeyResolver } from '@veramo/did-provider-key'
import { getResolver as peerDidResolver } from '@veramo/did-provider-peer'
import { AgentRestClient } from '@veramo/remote-client'

// Customize these values to your own project
const infuraProjectId = '5ffc47f65c4042ce847ef66a3fa70d4c'

// example agent that uses the functionality of a remote agent for credential issuance, but can perform verification
// locally.
export const clientAgent = createAgent<IResolver & ICredentialPlugin>({
  plugins: [
    // this plugin is used to access the methods of a remote Veramo agent as if they were implemented locally.
    // we're using the methods of a credential issuer and a method to create issuer DIDs
    new AgentRestClient({
      url: 'http://localhost:3002/agent',
      enabledMethods: [
        `createVerifiableCredential`,
        `createVerifiablePresentation`,
        `didManagerGetOrCreate`,
        `didManagerGet`,
        `keyManagerSign`,
      ],
    }),
    // a DID resolver is needed for credential verification
    new DIDResolverPlugin({
      ...ethrDidResolver({ infuraProjectId }),
      ...webDidResolver(),
      ...peerDidResolver(),
      ...getDidKeyResolver(),
    }),
    // this plugin is used to verify credentials
    new CredentialPlugin(),
  ],
})
