import LZString from 'lz-string'

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

  const compressed = LZString.compressToEncodedURIComponent(sanitized)
  return `${normalizedOrigin}/#${compressed}`
}

export function getPromptFromUrl(search: string, hash: string): string | null {
  // New format: hash fragment with lz-string compression
  if (hash && hash.length > 1) {
    const compressed = hash.slice(1)
    const decompressed = LZString.decompressFromEncodedURIComponent(compressed)

    if (decompressed) {
      const sanitized = sanitizePrompt(decompressed)
      return sanitized || null
    }
  }

  // Legacy format: ?q= query parameter
  return getPromptFromSearch(search)
}

export function getPromptFromSearch(search: string) {
  const prompt = new URLSearchParams(search).get('q')

  if (!prompt) {
    return null
  }

  const sanitized = sanitizePrompt(prompt)

  return sanitized || null
}
