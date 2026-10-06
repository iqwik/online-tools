import {ShieldCheckIcon} from '@animateicons/react/lucide'
import {useTranslations} from 'next-intl'
import {Badge} from '../ui/badge'

export function PrivacyNote() {
  const tHome = useTranslations('home')
  return (
    <section className="page flex flex-col gap-6 pt-0">
      <div className="rounded-md bg-secondary/50 p-3.5 sm:p-4">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-success-custom-foreground sm:size-12">
            <ShieldCheckIcon className="size-8 sm:size-10" />
          </span>
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-1">
              <span className="font-semibold text-secondary-foreground">
                {tHome('privacy.label')}
              </span>
              <Badge
                variant="success"
                className="self-start font-tag text-xs font-semibold uppercase tracking-wider sm:self-auto"
              >
                {tHome('privacy.badge')}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              {tHome('privacy.text')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
