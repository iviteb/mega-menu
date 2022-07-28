/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo'
import { useDevice } from 'vtex.device-detector'
import { canUseDOM } from 'vtex.render-runtime'
// import { useOrderForm } from 'vtex.order-manager/OrderForm'
// import { useFullSession } from 'vtex.session-client'

import GET_MENUS from '../graphql/queries/getMenus.graphql'
import type { GlobalConfig, MenusResponse, Orientation } from '../shared'
import HorizontalMenu from './components/HorizontalMenu'
import VerticalMenu from './components/VerticalMenu'
import { megaMenuState } from './State'

const Wrapper: StorefrontFunctionComponent<MegaMenuProps> = (props) => {
  const { orientation } = props

  // const { data: session } = useFullSession()

  // console.log('🚀 ~ file: wrapper.tsx ~ line 19 ~ session', session)

  // console.log(
  //   '🚀 ~ file: wrapper.tsx ~ line 19 ~ session',
  //   session?.namespaces?.public?.regionId?.value
  // )

  // const { orderForm } = useOrderForm()
  // const formSellers: string[] = []

  // orderForm?.items.forEach((item: any) => {
  //   formSellers.push(item.seller)
  // })

  const { data } = useQuery<MenusResponse>(GET_MENUS, {
    ssr: true,
  })

  // console.log('🚀 ~ file: wrapper.tsx ~ line 38 ~ error', error)

  const { setDepartments, setConfig } = megaMenuState

  const { isMobile } = useDevice()

  const currentOrientation: Orientation =
    orientation ?? (isMobile ? 'vertical' : 'horizontal')

  const initMenu = () => {
    if (data?.menus.length) {
      setConfig({
        ...props,
        orientation: currentOrientation,
      })
      setDepartments(data.menus)
    }
  }

  if (!canUseDOM) {
    initMenu()
  }

  useEffect(() => {
    initMenu()
  }, [data])

  return (
    <>
      {currentOrientation === 'horizontal' ? (
        <HorizontalMenu />
      ) : (
        <VerticalMenu />
      )}
    </>
  )
}

Wrapper.defaultProps = {
  title: 'Departments',
}

export type MegaMenuProps = GlobalConfig

export default Wrapper
