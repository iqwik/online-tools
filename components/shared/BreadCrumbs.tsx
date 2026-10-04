import {ChevronRight, Home} from 'lucide-react'
import {getTranslations} from 'next-intl/server'
import {Link} from '@/i18n/navigation'
import {CategorySlug} from '@/types'

interface Props {
  categorySlug: CategorySlug
  name: string
}

export async function BreadCrumbs({categorySlug, name}: Props) {
  const tConfig = await getTranslations('config')
  const tCategories = await getTranslations('categories')
  const tNav = await getTranslations('nav')

  return (
    <nav className="mb-6 text-xs text-muted-foreground flex items-center">
      <Link
        href="/"
        className="hover:text-foreground flex items-center gap-1 underline"
      >
        <Home className="size-3" />
        {tNav('home')}
      </Link>
      <ChevronRight className="mx-1 size-3" />
      <Link
        href={`/${categorySlug}`}
        className="hover:text-foreground underline"
      >
        {tCategories(`${categorySlug}.name`)}
      </Link>
      <ChevronRight className="mx-1 size-3" />
      <span className="font-semibold">{tConfig(name)}</span>
    </nav>
  )
}
