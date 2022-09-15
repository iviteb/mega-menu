import { IOClients } from '@vtex/api'

import RegionClient from './region'

export class Clients extends IOClients {
  public get region() {
    return this.getOrSet('region', RegionClient)
  }
}
