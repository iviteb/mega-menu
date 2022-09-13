import { JanusClient } from '@vtex/api'

export default class RegionClient extends JanusClient {
  public async getRegionSellers(regionID: string): Promise<any> {
    return this.http.get(`/api/checkout/pub/regions/${regionID}`)
  }
}
