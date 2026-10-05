'use client'

import {useEffect} from 'react'
import {useSidebar} from '@/components/ui/sidebar'

/**
 * Reads the `sidebar_state` cookie on mount and collapses the sidebar
 * if it was previously closed. Runs once — no hydration mismatch,
 * because the server renders with defaultOpen=true and React just
 * adjusts on the first client effect.
 */
export function SidebarStateProvider({children}: {children: React.ReactNode}) {
  const {setOpen} = useSidebar()

  // biome-ignore lint/correctness/useExhaustiveDependencies: set cookie
  useEffect(() => {
    const match = document.cookie.match(/(^|;\s*)sidebar_state=([^;]+)/)
    const value = match?.[2]
    if (value === 'false') {
      setOpen(false)
    }
  }, [])

  return <>{children}</>
}
