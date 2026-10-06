'use client'

import {useTranslations} from 'next-intl'
import {useEffect, useState} from 'react'
import {Link} from '@/i18n/navigation'
import {Alert, AlertDescription} from './ui/alert'
import {Button} from './ui/button'

const STORAGE_KEY = 'cookie-consent'

export function CookieConsent() {
  const t = useTranslations('cookieConsent')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY)
    if (consent !== 'accepted') {
      setIsVisible(true)
    }
  }, [])

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <Alert className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 px-4 py-3 shadow-lg pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <AlertDescription className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <span className="text-sm">
          {t('description')}{' '}
          <Link href="/privacy" className="text-primary underline">
            {t('privacyLink')}
          </Link>
        </span>
        <Button
          size="sm"
          variant="alternative"
          className="w-full shrink-0 sm:w-auto"
          onClick={handleAccept}
        >
          {t('accept')}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
