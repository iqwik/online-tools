'use client'

import Script from 'next/script'
import {useEffect} from 'react'

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void
  }
}

interface YandexMetricaProps {
  counterId: number
}

export function YandexMetrica({counterId}: YandexMetricaProps) {
  useEffect(() => {
    if (typeof window.ym !== 'function') return

    const handleRouteChange = () => {
      window.ym?.(counterId, 'hit', window.location.href, {
        title: document.title,
        referer: document.referrer,
      })
    }

    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function (...args) {
      originalPushState.apply(this, args)
      handleRouteChange()
    }

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args)
      handleRouteChange()
    }

    window.addEventListener('popstate', handleRouteChange)

    return () => {
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [counterId])

  return (
    <>
      <Script
        id="yandex-metrica"
        strategy="afterInteractive"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: yandex-metric allowed
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(${counterId}, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true,
              trackHash:true
            });
          `,
        }}
      />
      <noscript>
        <div>
          {/** biome-ignore lint/performance/noImgElement: yandex-metric allowed */}
          <img
            src={`https://mc.yandex.ru/watch/${counterId}`}
            style={{position: 'absolute', left: '-9999px'}}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}
