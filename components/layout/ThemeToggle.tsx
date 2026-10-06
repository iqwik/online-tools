'use client'

import {Monitor, Moon, Sun} from '@animateicons/react/lucide'
import {useTranslations} from 'next-intl'
import {useTheme} from 'next-themes'
import {useEffect, useMemo, useRef, useState} from 'react'
import {IconHandle} from '@/types'
import {Button} from '../ui/button'

export function ThemeToggle() {
  const {theme, setTheme} = useTheme()
  const t = useTranslations('sidebar.settings')
  const [mounted, setMounted] = useState(false)
  const activeThemIconRef = useRef<IconHandle>(null)
  // const iconSunRef = useRef<IconHandle>(null)
  // const iconMoonRef = useRef<IconHandle>(null)
  // const iconMonitorRef = useRef<IconHandle>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const ActiveThemeIcon = useMemo(() => {
    if (!mounted) return Sun
    if (theme === 'light') return Sun
    if (theme === 'dark') return Moon
    return Monitor
  }, [theme, mounted])

  const nextTheme = useMemo(() => {
    if (!mounted) return 'light'
    if (theme === 'light') return 'dark'
    if (theme === 'dark') return 'system'
    return 'light'
  }, [theme, mounted])

  return (
    <Button
      size="xs"
      variant="outline"
      onMouseEnter={() => activeThemIconRef.current?.startAnimation()}
      onMouseLeave={() => activeThemIconRef.current?.stopAnimation()}
      onClick={() => setTheme(nextTheme)}
      className="justify-start gap-2 cursor-pointer"
    >
      <ActiveThemeIcon
        isAnimated={false}
        ref={activeThemIconRef}
        className="size-4"
      />
      <span>{t('theme')}</span>
    </Button>
  )

  // return (
  //   <DropdownMenu>
  //     <DropdownMenuTrigger
  //       render={
  //         <Button
  //           size="xs"
  //           variant="outline"
  //           onMouseEnter={() => activeThemIconRef.current?.startAnimation()}
  //           onMouseLeave={() => activeThemIconRef.current?.stopAnimation()}
  //           className="justify-start gap-2 cursor-pointer"
  //         />
  //       }
  //     >
  //       <ActiveThemeIcon
  //         isAnimated={false}
  //         ref={activeThemIconRef}
  //         className="size-4"
  //       />
  //       <span>{t('theme')}</span>
  //     </DropdownMenuTrigger>
  //     <DropdownMenuContent align="start" className="w-40">
  //       <DropdownMenuItem
  //         className="cursor-pointer"
  //         onClick={() => setTheme('light')}
  //         onMouseEnter={() => iconSunRef.current?.startAnimation()}
  //         onMouseLeave={() => iconSunRef.current?.stopAnimation()}
  //       >
  //         <Sun isAnimated={false} ref={iconSunRef} className="mr-2 size-4" />
  //         {t('themeLight')}
  //       </DropdownMenuItem>
  //       <DropdownMenuItem
  //         className="cursor-pointer"
  //         onClick={() => setTheme('dark')}
  //         onMouseEnter={() => iconMoonRef.current?.startAnimation()}
  //         onMouseLeave={() => iconMoonRef.current?.stopAnimation()}
  //       >
  //         <Moon isAnimated={false} ref={iconMoonRef} className="mr-2 size-4" />
  //         {t('themeDark')}
  //       </DropdownMenuItem>
  //       <DropdownMenuItem
  //         className="cursor-pointer"
  //         onClick={() => setTheme('system')}
  //         onMouseEnter={() => iconMonitorRef.current?.startAnimation()}
  //         onMouseLeave={() => iconMonitorRef.current?.stopAnimation()}
  //       >
  //         <Monitor
  //           isAnimated={false}
  //           ref={iconMonitorRef}
  //           className="mr-2 size-4"
  //         />
  //         {t('themeSystem')}
  //       </DropdownMenuItem>
  //     </DropdownMenuContent>
  //   </DropdownMenu>
  // )
}
