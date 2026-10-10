'use client'

import {ArrowRight02Icon} from '@animateicons/react/huge/arrow-right-0-2-icon'
import {cn} from 'cn'
import Link from 'next/link'
import {ComponentProps, PropsWithChildren, useRef} from 'react'
import {IconHandle} from '@/types'

type Props = PropsWithChildren & ComponentProps<typeof Link>

export function LinkWithAnimatedArrowRightIcon({
  children,
  className,
  ...props
}: Props) {
  const iconRef = useRef<IconHandle>(null)

  return (
    <Link
      {...props}
      onMouseEnter={e => {
        props?.onMouseEnter?.(e)
        iconRef.current?.startAnimation()
      }}
      onMouseLeave={e => {
        props?.onMouseLeave?.(e)
        iconRef.current?.stopAnimation()
      }}
      className={cn(
        'group flex items-center gap-1 text-sm font-medium text-primary hover:underline',
        className,
      )}
    >
      {children}
      <ArrowRight02Icon
        ref={iconRef}
        isAnimated={false}
        className="size-4 transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  )
}
