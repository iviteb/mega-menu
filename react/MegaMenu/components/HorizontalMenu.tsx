import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import type { WrappedComponentProps } from 'react-intl'
import { injectIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'
import { useCssHandles } from 'vtex.css-handles'

import { megaMenuState } from '../State'
import '../styles.css'
import Item from './Item'
import Submenu from './Submenu'
import { BUTTON_ID } from './TriggerButton'
import type { MenuItem } from '../../shared'

const CSS_HANDLES = [
  'menuWrapper',
  'menuContainer',
  'menuContainerNav',
  'menuItem',
  'submenuContainer',
  'departmentActive',
  'submenuList',
] as const

const HorizontalMenu: FC<
  WrappedComponentProps & {
    openOnly: string
    orientation: string
  }
> = observer((props) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const {
    departments,
    departmentActive,
    config: { defaultDepartmentActive },
    setDepartmentActive,
    openMenu,
  } = megaMenuState

  const { openOnly } = props

  const departmentActiveHasCategories = !!departmentActive?.menu?.length
  const navRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | null>(null)

  const handleClickOutside = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      const isTriggerButton = event?.path?.find(
        (data: HTMLElement) => data.dataset?.id === BUTTON_ID
      )

      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        !isTriggerButton
      ) {
        openMenu(false)
      }
    },
    [openMenu]
  )

  useEffect(() => {
    document.addEventListener('mouseover', handleClickOutside, true)

    return () => {
      document.removeEventListener('mouseover', handleClickOutside, true)
    }
  }, [handleClickOutside])

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
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = window.setTimeout(() => {
      setDepartmentActive(department)
    }, 200)
  }

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }

  const departmentItems = useMemo(
    () =>
      departments
        .filter((j) => j.display)
        .map((d) => {
          return (
            <li
              className={classNames(
                handles.menuItem,
                d.id === departmentActive?.id &&
                  `bg-black-05 ${handles.departmentActive}`
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
          )
        }),
    [
      departments,
      departmentActive,
      handles.menuItem,
      handles.departmentActive,
      openMenu,
    ]
  )

  const loaderBlocks = useMemo(() => {
    const blocks: JSX.Element[] = []

    for (let index = 1; index <= 4; index++) {
      blocks.push(
        <div key={index} className="lh-copy">
          <Skeleton height={20} />
          <Skeleton height={80} />
        </div>
      )
    }

    return blocks
  }, [])

  return departmentItems?.length > 0 ? (
    <div className={`${handles.menuWrapper} w-100`}>
      <nav
        className={classNames(handles.menuContainerNav, 'bg-white')}
        ref={navRef}
      >
        <ul className={classNames(handles.menuContainer, 'list flex ma0 pa0')}>
          {departments.length ? (
            departmentItems
          ) : (
            <div className="flex justify-center lh-copy">
              <Skeleton count={3} height={20} />
            </div>
          )}
        </ul>
        {departments.length ? (
          <div
            className={classNames(
              handles.submenuContainer,
              'absolute left-0 w-100 bg-white'
            )}
            style={{
              display:
                departments.length &&
                departmentActive &&
                departmentActiveHasCategories
                  ? 'flex'
                  : 'none',
            }}
          >
            <Submenu closeMenu={openMenu ?? 'horizontal'} openOnly={openOnly} />
          </div>
        ) : (
          <div className="w-100" style={{ overflow: 'auto' }}>
            <div className="w-30 mb4 ml4 mt5">
              <Skeleton height={30} />
            </div>
            <div className={classNames(handles.submenuList, 'mh4 mb5')}>
              {loaderBlocks}
            </div>
          </div>
        )}
      </nav>
    </div>
  ) : null
})

export default injectIntl(HorizontalMenu)
