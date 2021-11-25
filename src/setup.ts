import { createAgent, IDataStore, IDIDManager, IKeyManager, IMessageHandler, IResolver } from '@veramo/core'
import { CredentialIssuer, ICredentialIssuer, W3cMessageHandler } from '@veramo/credential-w3c'
import { ISelectiveDisclosure, SdrMessageHandler, SelectiveDisclosure } from '@veramo/selective-disclosure'
import { DIDComm, DIDCommMessageHandler, IDIDComm } from '@veramo/did-comm'
import {
  DataStore,
  DataStoreORM,
  DIDStore,
  Entities,
  IDataStoreORM,
  KeyStore,
  migrations,
  PrivateKeyStore,
  ProfileDiscoveryProvider,
} from '@veramo/data-store'
import { DIDDiscovery, IDIDDiscovery } from '@veramo/did-discovery'

import { createConnection } from 'typeorm'
import { KeyManager } from '@veramo/key-manager'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'
import { getDidKeyResolver, KeyDIDProvider } from '@veramo/did-provider-key'
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local'
import { AliasDiscoveryProvider, DIDManager } from '@veramo/did-manager'
import { EthrDIDProvider } from '@veramo/did-provider-ethr'
import { WebDIDProvider } from '@veramo/did-provider-web'
import { MessageHandler } from '@veramo/message-handler'
import { JwtMessageHandler } from '@veramo/did-jwt'
import { DIDCommHttpTransport } from '@veramo/did-comm/build/transports/transports'

// Customize these values to your own project
const infuraProjectId = '5ffc47f65c4042ce847ef66a3fa70d4c'
const secretKey = '29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c'

const dbConnection = createConnection({
  type: 'sqlite',
  database: 'agent.sqlite',
  synchronize: false,
  migrations,
  migrationsRun: true,
  logging: false,
  entities: Entities,
})

export const agent = createAgent<
  // these interfaces should match the plugins you add next. They are optional but very useful for auto-complete.
  IResolver &
    IKeyManager &
    IDIDManager &
    IDataStore &
    IDataStoreORM &
    IMessageHandler &
    IDIDComm &
    ICredentialIssuer &
    ISelectiveDisclosure &
    IDIDDiscovery
>({
  plugins: [
    // it's a good idea to add the corresponding plugin interface `types` to the `createAgent<types>`
    // it is optional, but very useful for auto-complete
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...ethrDidResolver({ infuraProjectId }),
        ...webDidResolver(),
        ...getDidKeyResolver(),
      }),
    }),
    new KeyManager({
      store: new KeyStore(dbConnection),
      kms: {
        local: new KeyManagementSystem(new PrivateKeyStore(dbConnection, new SecretBox(secretKey))),
      },
    }),
    new DIDManager({
      store: new DIDStore(dbConnection),
      defaultProvider: 'did:ethr:rinkeby',
      providers: {
        'did:ethr:rinkeby': new EthrDIDProvider({
          defaultKms: 'local',
          network: 'rinkeby',
          rpcUrl: 'https://rinkeby.infura.io/v3/' + infuraProjectId,
        }),
        'did:web': new WebDIDProvider({
          defaultKms: 'local',
        }),
        'did:key': new KeyDIDProvider({
          defaultKms: 'local',
        }),
      },
    }),
    new DataStore(dbConnection),
    new DataStoreORM(dbConnection),
    new MessageHandler({
      messageHandlers: [
        new DIDCommMessageHandler(),
        new JwtMessageHandler(),
        new W3cMessageHandler(),
        new SdrMessageHandler(),
      ],
    }),
    new DIDComm([new DIDCommHttpTransport()]),
    new CredentialIssuer(),
    new SelectiveDisclosure(),
    new DIDDiscovery({
      providers: [new AliasDiscoveryProvider(), new ProfileDiscoveryProvider()],
    }),
  ],
})
