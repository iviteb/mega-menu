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
import { IconArrowBack } from 'vtex.store-icons'

import type { MenuItem } from '../../shared'
import { megaMenuState } from '../State'
import styles from '../styles.css'
import Item from './Item'

const CSS_HANDLES = [
  'submenuList',
  'submenuListVertical',
  'submenuItem',
  'submenuItemVertical',
  'collapsibleContent',
  'collapsibleHeaderText',
  'seeAllLinkContainer',
  'seeAllLink',
  'submenuContainerTitle',
  'submenuContainerTitleText',
  'submenuItemsContainer',
  'arrowBackContainer',
  'submenuVerticalNameContainer',
  'menuItemIcon',
  'departmentBannerContainer',
  'departmentBannerLink',
  'departmentBanner',
  'categoryLink',
  'categoryTitle',
  'subcategoriesContainer',
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

  const isHorizontal = orientation === 'horizontal' && openOnly === 'horizontal'
  const isVertical = orientation === 'vertical' || openOnly === 'vertical'

  const [collapsibleStates, setCollapsibleStates] = useState<
    Record<string, boolean>
  >({})

  const [showBtnCat, setShowBtnCat] = useState(false)

  const seeAllLink = (to: string, level = 1, className?: string) => {
    return (
      <div
        className={classNames(
          handles.seeAllLinkContainer,
          'lh-solid',
          !className && level === 1 && 'pv3 ph5 w-100',
          !className && level > 1 && 'mv3 pv3 t-body',
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
      if (!departmentActive?.menu) {
        setShowBtnCat(false)

        return null
      }

      if (departmentActive.menu.length > 1) {
        setShowBtnCat(true)
      } else {
        setShowBtnCat(false)
      }

      const categories = getCategories()

      return categories
        .filter((j) => j.display)
        .map((category) => {
          const subcategories = category.menu?.length
            ? subCategories(category.menu)
            : []

          return (
            <div
              data-col-number={
                isHorizontal ? Math.ceil(subcategories.length / 12) : undefined
              }
              key={category.id}
              style={{
                display: departmentActive?.menu?.length ? 'block' : 'none',
              }}
              className={classNames(
                applyModifiers(
                  isHorizontal
                    ? styles.submenuItem
                    : handles.submenuItemVertical,
                  collapsibleStates[category.id] ? 'isOpen' : 'isClosed'
                ),
                isVertical && 'c-on-base mv0 ph5'
              )}
            >
              {isHorizontal ? (
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
                    className={`${handles.categoryTitle} mb5`}
                  >
                    {category.name}
                  </Item>

                  <div className={`${handles.subcategoriesContainer}`}>
                    {!!subcategories.length && subcategories}
                  </div>
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
                            'mv3 lh-solid fw7'
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
                    <div className={`${handles.collapsibleContent} mb3`}>
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
                        'mv3 lh-solid',
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
          'flex-column flex-grow-1'
        )}
      >
        {orientation === 'vertical' && openOnly === 'vertical' && (
          <div
            onClick={() => setDepartmentActive(null)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setDepartmentActive(null)
              }
            }}
            className={classNames(
              handles.submenuContainerTitle,
              'ph5 fw7 c-on-base lh-copy flex items-center h-large ttu'
            )}
          >
            <span className={`${handles.arrowBackContainer} flex items-center`}>
              <IconArrowBack size={18} />
            </span>
            <span className={`${handles.submenuContainerTitleText}`}>
              {departmentActive?.name}
            </span>
          </div>
        )}

        <div
          className={classNames(
            orientation === 'horizontal' &&
              openOnly === 'horizontal' &&
              handles.submenuList,
            isVertical && `${handles.submenuListVertical} flex flex-column`
          )}
        >
          {isHorizontal ? (
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
        <div className={`${handles.departmentBannerContainer} w-third`}>
          {departmentActive?.linkBanner !== '' && (
            <a
              href={departmentActive?.linkBanner}
              className={`${handles.departmentBannerLink}`}
            >
              <img
                className={`${handles.departmentBanner} w-100 db`}
                src={departmentActive?.banner}
                alt="Banner"
              />
            </a>
          )}

          {departmentActive?.linkBanner === '' && (
            <img
              className={`${handles.departmentBanner} w-100 db`}
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
