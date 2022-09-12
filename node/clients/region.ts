import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

const ORDER_BASE_URL = (accountName: string) =>
  `http://${accountName}.myvtex.com`

export default class RegionClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(ORDER_BASE_URL(context.account), context, {
      ...options,
      headers: {
        ...options?.headers,
        'Proxy-Authorization': context.authToken,
        VtexIdclientAutCookie: context.authToken,
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public async getRegionSellers(regionID: string): Promise<any> {
    return this.http.get(`/api/checkout/pub/regions/${regionID}`)
  }
}
