import type { ClientsConfig, RecorderState, ServiceContext } from '@vtex/api'
import { LRUCache, Service } from '@vtex/api'

import { resolvers } from './resolvers'
import { Clients } from './clients'

const MEDIUM_TIMEOUT_MS = 2 * 1000

// Export a service that defines resolvers and clients options
// export default new Service<IOClients, RecorderState, ParamsContext>({
//   clients: {
//     implementation: IOClients,
//     options: {
//       default: {
//         timeout: MEDIUM_TIMEOUT_MS,
//       },
//     },
//   },
//   graphql: {
//     resolvers,
//   },
// })

const memoryCache = new LRUCache<string, any>({ max: 5000 })

const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 2,
      timeout: MEDIUM_TIMEOUT_MS,
    },
    // This key will be merged with the default options and add this cache to our Status client.
    status: {
      memoryCache,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, State>
  type State = RecorderState
}

export default new Service({
  clients,
  graphql: {
    resolvers,
  },
})
