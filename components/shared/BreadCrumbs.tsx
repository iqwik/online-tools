import {ChevronRight, Home} from 'lucide-react'
import {getTranslations} from 'next-intl/server'
import {Fragment, ReactNode} from 'react'
import {Link} from '@/i18n/navigation'

interface Props {
  items: {href?: string; title: ReactNode}[]
}

export async function BreadCrumbs({items}: Props) {
  const tNav = await getTranslations('nav')

  return (
    <nav className="text-xs text-muted-foreground mb-6 flex flex-wrap items-center gap-x-1 gap-y-0.5">
      <Link
        href="/"
        className="hover:text-foreground flex items-center gap-1 underline"
      >
        <Home className="size-3 shrink-0" />
        {tNav('home')}
      </Link>
      <ChevronRight className="size-3 shrink-0" />
      {items.map((it, i) => {
        if (it?.href) {
          return (
            <Fragment key={`breadcrumb-item--${i}`}>
              <Link href={it.href} className="hover:text-foreground underline">
                {it.title}
              </Link>
              <ChevronRight className="size-3 shrink-0" />
            </Fragment>
          )
        }

        return (
          <span key={`breadcrumb-item--${i}`} className="font-semibold">
            {it.title}
          </span>
        )
      })}
    </nav>
  )
}
