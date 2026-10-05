'use client'

import {SidebarMenu, SidebarMenuItem} from '../ui/sidebar'
import {LocaleSwitcher} from './LocaleSwitcher'
import {ThemeToggle} from './ThemeToggle'

export function SidebarSettings() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex justify-end gap-1 w-full">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
