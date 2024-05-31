import React, { useState } from 'react'
import { Alert, ButtonWithIcon } from 'vtex.styleguide'
import { useLazyQuery } from 'react-apollo'
import { defineMessages, useIntl } from 'react-intl'

import IconDownload from '../../icons/IconDownload'
import GET_CATEGORIES from '../../graphql/queries/getCategories.graphql'
import writeToCSV from '../../utils/writeToCSV'

const messages = defineMessages({
  getCatsError: { id: 'admin/mega-menu.getCatsError' },
  exportCats: { id: 'admin/mega-menu.exportCats' },
  saveCsvError: { id: 'admin/mega-menu.saveCsvError' },
})

type Category = {
  id: number
  name: string
  slug: string
  children: Category[]
}

type SubMenuItem = {
  id: string
  name: string
  icon: string
  slug: string
  styles: string
  display: boolean
  enableSty: boolean
  order: number
  slugRoot: string
  slugRelative: string
  menu: SubMenuItem[] | null
}

const calculateSubMenu = (cats: Category[], trailingSlug: string) => {
  if (!cats.length) {
    return null
  }

  const subMenus: SubMenuItem[] = []

  cats.forEach((cat: Category, idx: number) => {
    const newSlug = `${trailingSlug}/${cat.slug}`

    subMenus.push({
      id: `${cat.name}${cat.id}`,
      name: cat.name,
      icon: '',
      slug: newSlug,
      styles: '',
      display: true,
      enableSty: true,
      order: idx,
      slugRoot: '',
      slugRelative: '',
      menu: calculateSubMenu(cat?.children ?? [], newSlug),
    })
  })

  return subMenus
}

export default function ExportCategories() {
  const { formatMessage } = useIntl()
  const [csvError, setCsvError] = useState(false)

  const handleSaveCSV = (data: { categories: Category[] } | undefined) => {
    const menuItems: string[][] = []

    data?.categories.forEach((cat: Category, idx: number) => {
      const subMenu = calculateSubMenu(cat?.children ?? [], cat.slug)

      menuItems.push([
        `${cat.name}${cat.id}`,
        cat.name,
        '',
        cat.slug,
        '',
        'TRUE',
        'TRUE',
        String(idx),
        'null',
        'null',
        subMenu ? JSON.stringify(subMenu) : '',
      ])
    })

    try {
      writeToCSV(menuItems, `${formatMessage(messages.exportCats)}.csv`)
    } catch (e) {
      setCsvError(true)
    }
  }

  const [getCategories, { data, loading, error }] = useLazyQuery(
    GET_CATEGORIES,
    {
      onCompleted: () => {
        if (!data?.categories?.length) {
          return
        }

        handleSaveCSV(data)
      },
    }
  )

  if (error) {
    return <Alert type="error">{formatMessage(messages.getCatsError)}</Alert>
  }

  if (csvError) {
    return <Alert type="error">{formatMessage(messages.saveCsvError)}</Alert>
  }

  return (
    <div>
      <ButtonWithIcon
        icon={<IconDownload />}
        variation="secondary"
        onClick={() => (data ? handleSaveCSV(data) : getCategories())}
        isLoading={loading}
        block
      >
        {formatMessage(messages.exportCats)}
      </ButtonWithIcon>
    </div>
  )
}
