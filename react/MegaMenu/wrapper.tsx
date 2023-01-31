/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useDevice } from 'vtex.device-detector'
import { canUseDOM } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'

import GET_MENUS from '../graphql/queries/getMenus.graphql'
import type { GlobalConfig, MenusResponse, Orientation } from '../shared'
import HorizontalMenu from './components/HorizontalMenu'
import VerticalMenu from './components/VerticalMenu'
import { megaMenuState } from './State'

const Wrapper: StorefrontFunctionComponent<MegaMenuProps> = (props) => {
  const { orientation, homeVersion } = props

  console.log('🚀 ~ file: wrapper.tsx:16 ~ homeVersion', homeVersion)
  const [loaded, setLoaded] = useState(false)

  /* "filterMenuItems" filters the menu items returned in node,
  such that the items with sellerID matching the current regionId (sellerID) are not returned */
  const { data, error } = useQuery<MenusResponse>(GET_MENUS, {
    ssr: true,
    variables: {
      filterMenuItems: true,
    },
  })

  const { setDepartments, setConfig, openMenu } = megaMenuState

  const { isMobile } = useDevice()

  const currentOrientation: Orientation =
    orientation ?? (isMobile ? 'vertical' : 'horizontal')

  const initMenu = () => {
    if (homeVersion) {
      openMenu(true)
    }

    if (data?.menus.length) {
      setConfig({
        ...props,
        defaultDepartmentActive: '',
        orientation: currentOrientation,
      })
      setDepartments(data.menus)
    }
  }

  if (!canUseDOM) {
    initMenu()
  }

  useEffect(() => {
    if (!data || loaded) {
      return
    }

    setLoaded(true)

    initMenu()
  }, [data])

  useEffect(() => {
    if (error) {
      setLoaded(true)
      console.error('Error mega menu get menus', error)
    }
  }, [error])

  if (isMobile && !loaded) {
    return (
      <div className="w-100 h-auto flex justify-center items-center pa6 c-action-primary">
        <Spinner color="currentColor" size={30} />
      </div>
    )
  }

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
  homeVersion: false,
}

export type MegaMenuProps = GlobalConfig

export default Wrapper
