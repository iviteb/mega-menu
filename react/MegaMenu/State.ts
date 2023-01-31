import { makeAutoObservable } from 'mobx'

import type { DataMenu, GlobalConfig, MenuItem } from '../shared'

type ChangeOpenMenu = boolean | ((isOpen: boolean) => boolean)

class MegaMenuState {
  public config: GlobalConfig = {}
  public departments: MenuItem[] = []
  public departmentActive: MenuItem | null = null
  public departmentActiveHome: MenuItem | null = null
  public isOpenMenu = false
  public isOpenMenuHome = true

  constructor() {
    makeAutoObservable(this)
  }

  public setConfig = (config: GlobalConfig) => {
    this.config = config
  }

  public setDepartments = (departments: MenuItem[]) => {
    this.departments = departments
  }

  public setDepartmentActive = (
    department: MenuItem | null,
    homeVersion?: boolean | null
  ) => {
    homeVersion
      ? (this.departmentActiveHome = department)
      : (this.departmentActive = department)
  }

  public openMenu = (
    value: ChangeOpenMenu = true,
    homeVersion?: boolean | null
  ) => {
    if (typeof value === 'boolean') {
      homeVersion ? (this.isOpenMenuHome = value) : (this.isOpenMenu = value)
    } else {
      homeVersion
        ? (this.isOpenMenuHome = value(this.isOpenMenuHome))
        : (this.isOpenMenu = value(this.isOpenMenu))
    }
  }

  public getCategories = (homeVersion?: boolean) => {
    let categories: DataMenu[] = []

    const depActive = homeVersion
      ? this.departmentActiveHome
      : this.departmentActive

    if (depActive) {
      return depActive?.menu ?? []
    }

    this.departments.forEach((department: any) => {
      if (department?.menu?.length) {
        categories = categories.concat(department.menu)
      }
    })

    return categories
  }
}

export const megaMenuState = new MegaMenuState()
