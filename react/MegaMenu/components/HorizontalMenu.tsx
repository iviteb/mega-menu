import classNames from 'classnames'
import { debounce } from 'lodash'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React, { useEffect, useMemo, useRef } from 'react'
import type { InjectedIntlProps } from 'react-intl'
import { injectIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'
import { useCssHandles } from 'vtex.css-handles'
import { formatIOMessage } from 'vtex.native-types'

import { megaMenuState } from '../State'
import styles from '../styles.css'
import Item from './Item'
import Submenu from './Submenu'

const CSS_HANDLES = [
  'menuContainer',
  'menuContainerNav',
  'menuItem',
  'submenuContainer',
  'departmentsTitle',
  'departmentActive',
  'widthAuto',
  'darkBackground',
  'backgroundShadow',
] as const

type HorizontalMenuProps = InjectedIntlProps & {
  homeVersion?: boolean
}

const HorizontalMenu: FC<HorizontalMenuProps> = observer(
  ({ intl, homeVersion }) => {
    const { handles } = useCssHandles(CSS_HANDLES)
    const {
      isOpenMenu: menuOpen,
      isOpenMenuHome: menuHomeOpen,
      departments,
      departmentActive: activeDep,
      departmentActiveHome: activeHomeDep,
      config: { title, defaultDepartmentActive },
      setDepartmentActive,
      openMenu,
    } = megaMenuState

    const departmentActive = homeVersion ? activeHomeDep : activeDep
    const isOpenMenu = homeVersion ? menuHomeOpen : menuOpen

    const departmentActiveHasCategories = !!departmentActive?.menu?.length
    const navRef = useRef<HTMLDivElement>(null)

    const handleScroll = () => {
      const position = window.pageYOffset

      if (position < 640) {
        openMenu(false)
      }
    }

    useEffect(() => {
      window.addEventListener(
        'scroll',
        debounce(() => handleScroll(), 100),
        { passive: true }
      )

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }, [])

    useEffect(() => {
      const defaultDepartment = departments.find(
        (x) =>
          x.name.toLowerCase().trim() ===
          defaultDepartmentActive?.toLowerCase().trim()
      )

      if (defaultDepartment) {
        setDepartmentActive(defaultDepartment, homeVersion)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultDepartmentActive])

    const departmentItems = useMemo(
      () =>
        departments
          .filter((j) => j.display)
          .map((d) => {
            const hasCategories = !!d.menu?.length

            return (
              <li
                className={classNames(
                  handles.menuItem,
                  d.id === departmentActive?.id &&
                  `bg-black-05 ${handles.departmentActive}`
                )}
                key={d.id}
                onMouseEnter={() => {
                  setDepartmentActive(d, homeVersion)
                }}
              >
                <Item
                  id={d.id}
                  to={d.slug}
                  iconId={d.icon}
                  accordion={hasCategories}
                  className={classNames('pv3 mh5')}
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [departments, departmentActive]
    )

    const loaderBlocks = useMemo(() => {
      const blocks: JSX.Element[] = []

      for (let index = 1; index <= 4; index++) {
        blocks.push(
          <div className="lh-copy">
            <Skeleton height={20} />
            <Skeleton height={80} />
          </div>
        )
      }

      return blocks
    }, [])

    return departmentItems?.length > 0 ? (
      <div
        style={{
          display: isOpenMenu ? 'block' : 'none',
        }}
        onMouseLeave={() => {
          setDepartmentActive(null, homeVersion)
        }}
      >
        <nav
          className={classNames(
            handles.menuContainerNav,
            !departmentActive?.id && handles.widthAuto,
            departmentActive?.id && handles.backgroundShadow,
            'absolute left-0 bg-white bw1 bb b--muted-3 flex'
          )}
          ref={navRef}
        >
          <ul
            className={classNames(
              styles.menuContainer,
              departmentActive?.id && handles.darkBackground,
              'list ma0 pa0 pb3 br b--muted-4'
            )}
          >
            <div
              className={classNames(
                handles.departmentsTitle,
                'f4 fw7 c-on-base lh-copy ma0 pv5 ph5'
              )}
            >
              {formatIOMessage({ id: title, intl })}
            </div>
            {departments.length ? (
              departmentItems
            ) : (
              <div className="flex flex-column justify-center ph5 lh-copy">
                <Skeleton count={3} height={30} />
              </div>
            )}
          </ul>
          {departments.length ? (
            <div
              className={classNames(styles.submenuContainer, 'pa5 w-100')}
              style={{
                display:
                  departments.length &&
                    departmentActive &&
                    departmentActiveHasCategories
                    ? 'flex'
                    : 'none',
              }}
            >
              <Submenu closeMenu={openMenu} homeVersion={homeVersion} />
            </div>
          ) : (
            <div className="w-100" style={{ overflow: 'auto' }}>
              <div className="w-30 mb4 ml4 mt5">
                <Skeleton height={30} />
              </div>
              <div className={classNames(styles.submenuList, 'mh4 mb5')}>
                {loaderBlocks}
              </div>
            </div>
          )}
        </nav>
      </div>
    ) : null
  }
)

export default injectIntl(HorizontalMenu)
