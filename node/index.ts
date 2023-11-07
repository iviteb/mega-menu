import type { ParamsContext, RecorderState } from '@vtex/api'
import { Service, method } from '@vtex/api'

import { resolvers } from './resolvers'
import { Clients } from './clients'
import { keepAlive } from './middlewares/keepAlive'

const MEDIUM_TIMEOUT_MS = 2 * 1000

// Export a service that defines resolvers and clients options
export default new Service<Clients, RecorderState, ParamsContext>({
  clients: {
    implementation: Clients,
    options: {
      default: {
        timeout: MEDIUM_TIMEOUT_MS,
      },
    },
  },
  graphql: {
    resolvers,
  },
  routes: {
    keepAlive: method({
      GET: [keepAlive],
    }),
  },
})
