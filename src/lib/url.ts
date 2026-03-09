import { siteConfig } from '@/site-config'

export const PROMPT_LIMIT = 1500

export function sanitizePrompt(input: string) {
  return input.trim().slice(0, PROMPT_LIMIT)
}

export function buildShareUrl(prompt: string, origin: string = siteConfig.productionUrl) {
  const sanitized = sanitizePrompt(prompt)
  const normalizedOrigin = origin.replace(/\/$/, '')

  if (!sanitized) {
    return `${normalizedOrigin}/`
  }

  return `${normalizedOrigin}/?q=${encodeURIComponent(sanitized)}`
}

export function getPromptFromSearch(search: string) {
  const prompt = new URLSearchParams(search).get('q')

  if (!prompt) {
    return null
  }

  const sanitized = sanitizePrompt(prompt)

  return sanitized || null
}
