'use client'

import {CheckIcon as Check} from '@animateicons/react/lucide/check-icon'
import {cn} from 'cn'
import {useTranslations} from 'next-intl'
import {HTMLAttributes, useEffect, useRef, useState} from 'react'
import {useEvent} from '@/hooks/use-event'
import {Button} from '../ui/button'
import {Tooltip, TooltipContent, TooltipTrigger} from '../ui/tooltip'

interface Props {
  className?: string
  /** Optional: override page title. Default — document.title. */
  title?: string
  /** Optional: override URL. Default — window.location.href. */
  url?: string
}

export function ShareButton({className, title, url}: Props) {
  const t = useTranslations('global')
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [])

  const handleShare = useEvent(async () => {
    const shareUrl = url ?? window.location.href
    const shareTitle = title ?? document.title

    // Native share (mobile Safari/Chrome, Edge desktop)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({title: shareTitle, url: shareUrl})
        return
      } catch (err) {
        // AbortError — пользователь закрыл sheet, не ошибка
        if (err instanceof Error && err.name === 'AbortError') return
        // иначе — падаем в clipboard fallback
      }
    }

    // Fallback — copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard недоступен (insecure context, старый браузер)
    }
  })

  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex" />}>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleShare}
          aria-label={copied ? t('shareCopied') : t('share')}
          className={cn('cursor-pointer text-muted-foreground', className)}
        >
          {copied ? (
            <Check isAnimated={false} className="size-4" />
          ) : (
            <ShareIcon />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? t('shareCopied') : t('share')}</TooltipContent>
    </Tooltip>
  )
}

function ShareIcon(props: HTMLAttributes<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="shareIconTitle"
    >
      <title id="shareIconTitle">Share icon</title>
      <path
        d="M7.95889 1.52285C7.95888 0.826234 8.76055 0.467983 9.27669 0.875208L9.37524 0.967191L15.1317 7.18358C15.5582 7.64419 15.5582 8.35614 15.1317 8.81676L9.37524 15.0331C8.87034 15.578 7.95888 15.2205 7.95889 14.4775V10.8207C7.10614 10.8432 6.31361 10.9316 5.45468 11.2515C4.39484 11.6463 3.18248 12.413 1.64676 13.9425C1.4533 14.135 1.18329 14.1696 0.969086 14.0908C0.74748 14.0091 0.547307 13.7879 0.54859 13.4844L0.55516 13.1315C0.618924 11.3494 1.11153 9.29838 2.27656 7.63787C3.45289 5.96147 5.29554 4.71635 7.95889 4.54797V1.52285ZM9.20911 5.13366C9.20899 5.50567 8.9031 5.77687 8.56523 5.77755C5.99383 5.78282 4.33736 6.8762 3.29964 8.35496C2.54519 9.43014 2.10739 10.7283 1.9152 11.9939C3.04749 11.0323 4.0569 10.4385 5.01917 10.0801C6.29638 9.60449 7.4406 9.56343 8.56429 9.56295C8.9178 9.5628 9.20894 9.84909 9.20911 10.2068L9.20817 13.3737L14.1837 8.00017L9.20817 2.62571L9.20911 5.13366Z"
        fill="currentColor"
      />
    </svg>
  )
}
