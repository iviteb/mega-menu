/* eslint-disable prettier/prettier */
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React, { useMemo, useState } from 'react'
import type { WrappedComponentProps } from 'react-intl'
import { defineMessages, injectIntl } from 'react-intl'
import { applyModifiers, useCssHandles } from 'vtex.css-handles'
import { formatIOMessage } from 'vtex.native-types'
import { ExtensionPoint, Link } from 'vtex.render-runtime'
import { Collapsible } from 'vtex.styleguide'

import type { MenuItem } from '../../shared'
import { megaMenuState } from '../State'
import styles from '../styles.css'
import Item from './Item'

const CSS_HANDLES = [
  'submenuContainer',
  'submenuList',
  'submenuListVertical',
  'submenuItem',
  'submenuItemVertical',
  'collapsibleContent',
  'collapsibleHeaderText',
  'seeAllLinkContainer',
  'seeAllLink',
  'submenuContainerTitle',
  'submenuItemsContainer',
  'hideArrow',
  'submenuVerticalNameContainer',
  'menuItemIcon',
  'departmentBannerContainer',
  'departmentBanner',
  'categoryLink',
] as const

const messages = defineMessages({
  seeAllTitle: {
    defaultMessage: '',
    id: 'store/mega-menu.submenu.seeAllButton.title',
  },
})

export type ItemProps = WrappedComponentProps & {
  closeMenu?: (open: boolean) => void
  openOnly?: string
}

const Submenu: FC<ItemProps> = observer((props) => {
  const { intl, closeMenu, openOnly } = props
  const { handles } = useCssHandles(CSS_HANDLES)
  const { departmentActive, setDepartmentActive, config, getCategories } =
    megaMenuState

  const { orientation } = config

  const [collapsibleStates, setCollapsibleStates] = useState<
    Record<string, boolean>
  >({})

  const [showBtnCat, setShowBtnCat] = useState(false)

  const seeAllLink = (to: string, level = 1, className?: string) => {
    return (
      <div
        className={classNames(
          handles.seeAllLinkContainer,
          !className && level === 1 && 'bb b--light-gray pv5 ph5 w-100',
          !className && level > 1 && 'mt4 mb6 t-body',
          className
        )}
      >
        <Link
          to={to}
          className={classNames(
            handles.seeAllLink,
            'link underline fw7 c-on-base'
          )}
          onClick={() => {
            if (closeMenu) closeMenu(false)
          }}
        >
          {formatIOMessage({ id: messages.seeAllTitle.id, intl })}
        </Link>
      </div>
    )
  }

  const subCategories = (items: MenuItem[]) => {
    return items
      .filter((v) => v.display)
      .map((x) => (
        <div key={x.id} className={classNames(handles.submenuItem, 'mt3')}>
          <Item
            to={x.slug}
            iconId={x.icon}
            level={3}
            style={x.styles}
            enableStyle={x.enableSty}
            closeMenu={closeMenu}
            uploadedIcon={x.uploadedIcon}
          >
            {x.name}
          </Item>
        </div>
      ))
  }

  const items = useMemo(
    () => {
      if (departmentActive?.menu) {
        if (departmentActive?.menu.length > 1) {
          setShowBtnCat(true)
        } else {
          setShowBtnCat(false)
        }
      } else {
        setShowBtnCat(false)
      }

      const categories = getCategories()

      return categories
        .filter((j) => j.display)
        .map((category, i) => {
          const subcategories = category.menu?.length
            ? subCategories(category.menu)
            : []

          return (
            <div
              key={category.id}
              style={{
                display:
                  departmentActive && (departmentActive?.menu ?? []).length > 0
                    ? 'block'
                    : 'none',
              }}
              className={classNames(
                applyModifiers(
                  orientation === 'horizontal' && openOnly === 'horizontal'
                    ? styles.submenuItem
                    : handles.submenuItemVertical,
                  collapsibleStates[category.id] ? 'isOpen' : 'isClosed'
                ),
                (orientation === 'vertical' || openOnly === 'vertical') &&
                  'c-on-base bb b--light-gray mv0 ph5',
                (orientation === 'vertical' || openOnly === 'vertical') &&
                  i === 0 &&
                  'bt',
                collapsibleStates[category.id] && 'bg-near-white'
              )}
            >
              {orientation === 'horizontal' && openOnly === 'horizontal' ? (
                <>
                  <Item
                    to={category.slug}
                    iconId={category.icon}
                    level={2}
                    style={category.styles}
                    isTitle
                    enableStyle={category.enableSty}
                    closeMenu={closeMenu}
                    uploadedIcon={category.uploadedIcon}
                  >
                    {category.name}
                  </Item>

                  {!!subcategories.length && subcategories}
                  {subcategories.length > 1 && seeAllLink(category.slug, 2)}
                </>
              ) : subcategories.length ? (
                <Collapsible
                  header={
                    <>
                      <div
                        className={classNames(
                          handles.submenuVerticalNameContainer,
                          'flex'
                        )}
                      >
                        {category.uploadedIcon && (
                          <img
                            className={handles.menuItemIcon}
                            src={category.uploadedIcon}
                            alt=""
                          />
                        )}
                        <p
                          className={classNames(
                            handles.collapsibleHeaderText,
                            collapsibleStates[category.id] && 'fw7'
                          )}
                        >
                          {category.name}
                        </p>
                      </div>
                    </>
                  }
                  align="right"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onClick={(e: any) => {
                    if (subcategories.length >= 1) {
                      setCollapsibleStates({
                        ...collapsibleStates,
                        [category.id]: e.target.isOpen,
                      })
                    } else {
                      window.location.assign(`${category.slug}`)
                      if (closeMenu) closeMenu(false)
                    }
                  }}
                  isOpen={collapsibleStates[category.id]}
                  caretColor={`${
                    collapsibleStates[category.id] ? 'base' : 'muted'
                  }`}
                >
                  {subcategories.length >= 0 ? (
                    seeAllLink(category.slug, 2)
                  ) : (
                    // eslint-disable-next-line jsx-a11y/anchor-has-content
                    <a href={category.slug} />
                  )}

                  {!!subcategories.length && (
                    <div className={handles.collapsibleContent}>
                      {subcategories}
                    </div>
                  )}
                </Collapsible>
              ) : (
                <Link
                  to={category.slug}
                  className={`${handles.categoryLink} no-underline c-on-base`}
                  onClick={() => {
                    if (config.orientation === 'vertical') {
                      setDepartmentActive(null)
                    }

                    if (closeMenu) closeMenu(false)
                  }}
                >
                  <div
                    className={classNames(
                      handles.submenuVerticalNameContainer,
                      'flex'
                    )}
                  >
                    {category.uploadedIcon && (
                      <img
                        className={handles.menuItemIcon}
                        src={category.uploadedIcon}
                        alt=""
                      />
                    )}
                    <p
                      className={classNames(
                        handles.collapsibleHeaderText,
                        'lh-title',
                        collapsibleStates[category.id] && 'fw7'
                      )}
                    >
                      {category.name}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          )
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [departmentActive, collapsibleStates]
  )

  return (
    <>
      <div
        style={{ display: departmentActive ? 'flex' : 'none' }}
        className={classNames(
          handles.submenuItemsContainer,
          'flex-column w-100'
        )}
      >
        <h3
          className={classNames(
            handles.submenuContainerTitle,
            'f4 fw7 c-on-base lh-copy ma0 flex items-center',
            orientation === 'horizontal' && openOnly === 'horizontal' && 'mb6',
            (orientation === 'vertical' || openOnly === 'vertical') && 'pv5 ph5'
          )}
        >
          {departmentActive?.name}
          {orientation === 'horizontal' && (
            <div
              style={{
                display:
                  openOnly === 'horizontal' && showBtnCat ? 'block' : 'none',
              }}
            >
              {seeAllLink(departmentActive?.slug ?? '', 1, 't-small ml7')}
            </div>
          )}
        </h3>

        <div
          className={classNames(
            orientation === 'horizontal' &&
              openOnly === 'horizontal' &&
              styles.submenuList,
            (orientation === 'vertical' || openOnly === 'vertical') &&
              handles.submenuListVertical
          )}
        >
          {orientation === 'horizontal' && openOnly === 'horizontal' ? (
            <>
              <ExtensionPoint id="before-menu" /> {items}{' '}
              <ExtensionPoint id="after-menu" />
            </>
          ) : (
            <>
              {showBtnCat &&
                departmentActive?.slug &&
                seeAllLink(departmentActive.slug)}
              {items}
            </>
          )}
        </div>
      </div>

      {orientation === 'horizontal' && departmentActive?.banner && (
        <div className={handles.departmentBannerContainer}>
          {departmentActive?.linkBanner !== '' && (
            <a
              href={departmentActive?.linkBanner}
              target="_blank"
              rel="noreferrer"
            >
              <img
                className={handles.departmentBanner}
                src={departmentActive?.banner}
                alt=""
              />
            </a>
          )}

          {departmentActive?.linkBanner === '' && (
            <img
              className={handles.departmentBanner}
              src={departmentActive?.banner}
              alt=""
            />
          )}
        </div>
      )}
    </>
  )
})

export default injectIntl(Submenu)
