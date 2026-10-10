import {ComponentType, RefAttributes} from 'react'

export interface FAQItem {
  q: string
  a: string
}

export type CategorySlug =
  | 'finance'
  | 'health'
  | 'text'
  | 'developer'
  | 'generators'
  | 'business'

export type Tag =
  | 'calculator'
  | 'text'
  | 'health'
  | 'developer'
  | 'generators'
  | 'business'

export type IconHandle = {
  startAnimation: () => void
  stopAnimation: () => void
}

export type IconProps = {
  size?: number
  className?: string
  color?: string
  isAnimated?: boolean
  duration?: number
}

export interface BaseConfig {
  slug: string
  category: CategorySlug
  tags: Tag[]
  title: string
  h1: string
  /** Translation key — renders under h1 on the page (up to ~200 chars). */
  description: string
  /** Optional translation key — meta tag + JSON-LD only (up to ~155 chars).
   *  Falls back to `description` (truncated) when not set. */
  metaDescription: string
  keywords: string[]
  faq?: FAQItem[]
  related?: string[]
  publishedAt?: string
  /** Optional sort priority within its category. Higher — first. Default 0. */
  priority?: number
  Icon: ComponentType<IconProps & RefAttributes<IconHandle>>
}

export type Values = Record<string, string | number>

export interface Option {
  value: string
  label: string
  params?: Record<string, string | number>
}

export interface OperationResult extends Pick<Option, 'params'> {
  value: number | string
  raw?: number
  secondary?: Option[]
}

export interface ResultRange {
  max: number
  label: string
  color: 'blue' | 'green' | 'orange' | 'red' | 'gray'
}

export interface InputField {
  name: string
  label: string
  type: 'number' | 'text' | 'date' | 'select' | 'slider'
  unit?: string
  placeholder?: string
  min?: number
  max?: number
  step?: number
  options?: Option[]
  defaultValue?: string | number
  hint?: string
}

export interface FeatureItem {
  title: string
  description: string
}
