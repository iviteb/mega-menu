export type MenuItem = {
  id: string
  icon: string
  uploadedIcon?: string
  name: string
  slug: string
  sellerIDs?: string
  styles: string
  menu?: MenuItem[]
  display: boolean
  enableSty: boolean
  order?: number
  slugRoot?: string
  slugRelative?: string
  banner?: string
<<<<<<< HEAD
  optionalText?: string
=======
>>>>>>> 7075498 (CU-2am52gt - [Auchan] [PR] Mega menu images)
}

export type MenuItemSave = {
  id: string
  icon: string
  uploadedIcon?: string
  name: string
  slug: string
  sellerIDs?: string
  styles: string
  menu?: MenuItem[] | string
  display: boolean
  enableSty: boolean
  order?: number
  slugRoot?: string
  slugRelative?: string
  banner?: string
<<<<<<< HEAD
  optionalText?: string
=======
>>>>>>> 7075498 (CU-2am52gt - [Auchan] [PR] Mega menu images)
}

export type MenusResponse = {
  menus: MenuItem[]
}

export type DataMenu = MenuItem & {
  firstLevel?: string
  secondLevel?: string
}

export type DeleteArrayType = {
  deleteMenu: DataMenu[]
}

export type ShowAlertFunction = (
  show: boolean,
  messageAlert: string,
  newData: DeleteArrayType,
  type?: string
) => void

export type UpdateData = (data: DataMenu[], type: string) => void

export type ResponseFilterFunction = (filterArray: DataMenu[]) => void

export type Orientation = 'vertical' | 'horizontal'
export interface GlobalConfig {
  title?: string
  orientation?: Orientation
  defaultDepartmentActive?: string
  openOnly?: string
}

export interface IconProps {
  id: string
  size?: number
  isActive?: boolean
  viewBox?: string
  activeClassName?: string
  mutedClassName?: string
  Drawer?: any
}

export interface SettingsType {
  settings: [
    {
      idMenu: string
      orientation: string
    }
  ]
}
