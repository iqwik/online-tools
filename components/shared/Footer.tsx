import {useTranslations} from 'next-intl'
import {Link} from '@/i18n/navigation'

export function Footer() {
  const t = useTranslations('sidebar.settings')

  return (
    <footer className="flex shrink-0 w-full justify-between px-4 py-2.5 border-t text-sm text-muted-foreground">
      <div className="flex gap-4">
        <Link href="/about" className="hover:text-primary/80">
          {t('about')}
        </Link>
        <Link href="/privacy" className=" hover:text-primary/80">
          {t('privacy')}
        </Link>
      </div>
      <div>
        &copy; {'2026'} {'ProjectName'}
      </div>
    </footer>
  )
}
