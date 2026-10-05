'use client'

import type {ReactNode} from 'react'
import {createContext, useContext, useEffect, useState} from 'react'
import {SearchModal} from './SearchModal'

interface SearchContextValue {
  isOpen: boolean
  /** Opens the modal. Pass a string to prefill and overwrite the input. */
  open: (query?: string) => void
  close: () => void
}

const SearchContext = createContext<SearchContextValue | null>(null)

export function useSearch() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used inside SearchProvider')
  return ctx
}

export function SearchProvider({children}: {children: ReactNode}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  function open(nextQuery?: string) {
    if (nextQuery !== undefined) setQuery(nextQuery)
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true) // preserve existing query
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <SearchContext.Provider value={{isOpen, open, close}}>
      {children}
      <SearchModal
        open={isOpen}
        onOpenChange={setIsOpen}
        query={query}
        onQueryChange={setQuery}
      />
    </SearchContext.Provider>
  )
}
