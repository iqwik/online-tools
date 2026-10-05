'use client'

import {Globe} from '@animateicons/react/lucide'
import {useLocale} from 'next-intl'
import {useRef} from 'react'
import {usePathname, useRouter} from '@/i18n/navigation'
import {routing} from '@/i18n/routing'
import {IconHandle} from '@/types'
import {Button} from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const iconRef = useRef<IconHandle>(null)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            size="xs"
            variant="outline"
            onMouseEnter={() => iconRef.current?.startAnimation()}
            onMouseLeave={() => iconRef.current?.stopAnimation()}
            className="justify-start gap-2 cursor-pointer"
          />
        }
      >
        <Globe ref={iconRef} isAnimated={false} className="size-4" />
        <span className="ml-auto text-xs uppercase">{locale}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {routing.locales.map(l => (
          <DropdownMenuItem
            key={l}
            onClick={() => router.replace(pathname, {locale: l})}
          >
            {l.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
