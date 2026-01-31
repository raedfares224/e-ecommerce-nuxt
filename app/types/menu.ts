// ~/types/menu.ts

export interface DropdownMenuItem {
  id: number
  link: string
  title: string
  drop_down: boolean
  dropdown_menus: {
    data: DropdownMenuItem[]
  }
}

export interface MenuResponse {
  data: DropdownMenuItem[]
  status: string
  message: string
}
