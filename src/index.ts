import { agent } from './setup'

export async function main(): Promise<void> {
  const resolution = await agent.resolveDid({ didUrl: 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190' })
  console.log(resolution)
}
