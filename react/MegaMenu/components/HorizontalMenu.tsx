import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import type { WrappedComponentProps } from 'react-intl'
import { injectIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { megaMenuState } from '../State'
import '../styles.css'
import Item from './Item'
import Submenu from './Submenu'
import type { MenuItem } from '../../shared'

const CSS_HANDLES = [
  'menuWrapper',
  'menuContainer',
  'menuContainerNav',
  'menuItem',
  'submenuContainer',
  'submenuWrapper',
  'departmentActive',
  'submenuList',
] as const

const HorizontalMenu: FC<
  WrappedComponentProps & {
    openOnly: string
    orientation: string
  }
> = observer((props) => {
  const { handles, withModifiers } = useCssHandles(CSS_HANDLES)
  const {
    departments,
    departmentActive,
    config: { defaultDepartmentActive },
    setDepartmentActive,
    openMenu,
  } = megaMenuState

  const { openOnly } = props

  const departmentActiveHasCategories = !!departmentActive?.menu?.length
  const navRef = useRef<HTMLUListElement>(null)
  const submenuRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | null>(null)

  // Updated function to handle mouse events outside of both menu and submenu
  const handleMoveOutside = useCallback(
    (event: MouseEvent) => {
      // Clear any existing timeout if it exists
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      // Set a new timeout to delay the outside move handling
      timerRef.current = window.setTimeout(() => {
        if (
          navRef.current &&
          submenuRef.current &&
          !navRef.current.contains(event.target as Node) &&
          !submenuRef.current.contains(event.target as Node)
        ) {
          openMenu(false)
          setDepartmentActive(null)
        }
      }, 200) // Adjust delay time as desired
    },
    [openMenu, setDepartmentActive]
  )

  // Clear timeout on unmount or if event listeners are removed
  useEffect(() => {
    document.addEventListener('mouseover', handleMoveOutside, true)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      document.removeEventListener('mouseover', handleMoveOutside, true)
    }
  }, [handleMoveOutside])

  useEffect(() => {
    const defaultDepartment = departments.find(
      (x) =>
        x.name.toLowerCase().trim() ===
        defaultDepartmentActive?.toLowerCase().trim()
    )

    if (defaultDepartment) {
      setDepartmentActive(defaultDepartment)
    }
  }, [defaultDepartmentActive, departments, setDepartmentActive])

  const handleMouseEnter = (department: MenuItem | null) => {
    // Clear any existing timeout to prevent the menu from closing
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Immediately set the active department and open the menu
    setDepartmentActive(department)
    openMenu(true)
  }

  const handleMouseLeave = () => {
    // Clear any existing timeout for handling accidental hover-outs
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Delay closing the menu to allow for accidental hover-out correction
    timerRef.current = window.setTimeout(() => {
      openMenu(false)
      setDepartmentActive(null)
    }, 800) // Adjust delay as needed to provide a smooth buffer
  }

  const departmentItems = useMemo(
    () =>
      departments.map((d) => (
        <li
          className={classNames(
            handles.menuItem,
            d.id === departmentActive?.id && `${handles.departmentActive}`
          )}
          key={d.id}
          onMouseEnter={() => handleMouseEnter(d)}
          onMouseLeave={handleMouseLeave}
        >
          <Item
            id={d.id}
            to={d.slug}
            iconId={d.icon}
            style={d.styles}
            enableStyle={d.enableSty}
            closeMenu={openMenu}
            uploadedIcon={d.uploadedIcon}
          >
            {d.name}
          </Item>
        </li>
      )),
    [
      departments,
      departmentActive,
      handles.menuItem,
      handles.departmentActive,
      openMenu,
    ]
  )

  return departmentItems?.length > 0 ? (
    <div className={`${handles.menuWrapper} w-100 h-100 flex`}>
      <nav
        className={classNames(
          handles.menuContainerNav,
          'w-100 h-100 flex justify-center bg-white'
        )}
      >
        <ul
          ref={navRef}
          className={classNames(
            handles.menuContainer,
            'h-100 list flex items-center ma0 ph6'
          )}
        >
          {departments.length && departmentItems}
        </ul>
      </nav>
      <div
        className={`${withModifiers(
          'submenuWrapper',
          departmentActive && departmentActiveHasCategories
            ? 'isOpen'
            : 'isClosed'
        )} absolute left-0 w-100 justify-center`}
      >
        <div
          ref={submenuRef}
          className={`${handles.submenuContainer} w-100 flex justify-between bg-white`}
        >
          <Submenu closeMenu={openMenu} openOnly={openOnly} />
        </div>
      </div>
    </div>
  ) : null
})

export default injectIntl(HorizontalMenu)
