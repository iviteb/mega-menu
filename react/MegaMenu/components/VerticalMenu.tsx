import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React, { useState, useMemo } from 'react'
import type { InjectedIntlProps } from 'react-intl'
import { defineMessages, injectIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'
import { useCssHandles } from 'vtex.css-handles'
import { formatIOMessage } from 'vtex.native-types'
import { Link } from 'vtex.render-runtime'
import { Collapsible } from 'vtex.styleguide'

import type { MenuItem } from '../../shared'
import { megaMenuState } from '../State'
import type { ItemProps } from './Item'
import Item from './Item'

const CSS_HANDLES = [
  'menuContainerVertical',
  'departmentsContainer',
  'menuContainerNavVertical',
  'menuItemVertical',
  'departmentsTitle',
  'seeAllLinkContainer',
  'seeAllLink',
  'collapsibleContent',
  'submenuItem',
] as const

const messages = defineMessages({
  seeAllProducts: {
    defaultMessage: '',
    id: 'store/mega-menu.submenu.seeAllProducts.title',
  },
})

const VerticalMenu: FC<VerticalMenuProps> = observer(({ intl }) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const { departments, departmentActive, config } = megaMenuState

  const [collapsibleStates, setCollapsibleStates] = useState<
    Record<string, boolean>
  >({})

  const { title } = config

  const seeAllLink = (to?: string) => (
    <div className={classNames(handles.seeAllLinkContainer, 'mv5 t-body')}>
      <Link
        to={to ?? '#'}
        className={classNames(handles.seeAllLink, 'link fw7 c-on-base')}
      >
        {formatIOMessage({ id: messages.seeAllProducts.id, intl })}
      </Link>
    </div>
  )

  const parseCategories = (items: MenuItem[]) => {
    return items
      .filter((v) => v.display)
      .map((x) => (
        <div key={x.id} className={classNames(handles.submenuItem, 'mt3')}>
          <Item
            to={x.slug}
            iconId={x.icon}
            level={2}
            style={x.styles}
            enableStyle={x.enableSty}
            optionalText={x.optionalText}
            uploadedIcon={x.uploadedIcon}
          >
            {x.name}
          </Item>
        </div>
      ))
  }

  const departmentItems = useMemo(
    () => {
      return departments
        .filter((j) => j.display)
        .map((d, i) => {
          const itemProps: ItemProps = {
            id: d.id,
            iconId: d.icon,
            tabIndex: i,
            style: d.styles,
            enableStyle: d.enableSty,
            uploadedIcon: d.uploadedIcon,
          }

          if (!d.menu?.length || d.menu?.length < 1) {
            return (
              <li
                className={classNames(
                  handles.menuItemVertical,
                  'bb b--light-gray',
                  {
                    bt: i === 0,
                  }
                )}
                key={d.id}
              >
                <Link
                  to={d.slug ?? '#'}
                  className={classNames('link c-on-base')}
                >
                  <Item className={classNames('pv5 mh5')} {...itemProps}>
                    {d.name}
                  </Item>
                </Link>
              </li>
            )
          }

          const parsedCategories = parseCategories(d.menu)

          return (
            <li
              className={classNames(
                handles.menuItemVertical,
                'bb b--light-gray',
                {
                  bt: i === 0,
                }
              )}
              key={d.id}
            >
              <Collapsible
                header={
                  <Item className={classNames('pv5 mh5')} {...itemProps}>
                    {d.name}
                  </Item>
                }
                align="right"
                onClick={(e: any) =>
                  setCollapsibleStates({
                    ...collapsibleStates,
                    [d.id]: e.target.isOpen,
                  })
                }
                isOpen={collapsibleStates[d.id]}
                caretColor={`${collapsibleStates[d.id] ? 'base' : 'muted'}`}
              >
                {!!parsedCategories.length && (
                  <div className={handles.collapsibleContent}>
                    {parsedCategories}
                  </div>
                )}

                {parsedCategories.length >= 1 ? seeAllLink(d.slug) : <div />}
              </Collapsible>
            </li>
          )
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [departments, collapsibleStates]
  )

  return departmentItems?.length > 0 ? (
    <nav className={classNames(handles.menuContainerNavVertical, 'w-100')}>
      <div
        className={classNames(handles.departmentsContainer, {
          dn: !!departmentActive,
        })}
      >
        <div
          className={classNames(
            handles.departmentsTitle,
            'f4 fw7 c-on-base mv5 lh-copy ph5'
          )}
        >
          {formatIOMessage({ id: title, intl })}
        </div>
        <ul className={classNames(handles.menuContainerVertical, 'list pa0')}>
          {departments.length ? (
            departmentItems
          ) : (
            <div className="flex flex-column justify-center ph5 lh-copy">
              <Skeleton count={4} height={40} />
            </div>
          )}
        </ul>
      </div>
    </nav>
  ) : null
})

type VerticalMenuProps = InjectedIntlProps

export default injectIntl(VerticalMenu)
