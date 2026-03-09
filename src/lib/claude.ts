import { siteConfig } from '@/site-config'

import { sanitizePrompt } from '@/lib/url'

export function buildClaudeUrl(prompt: string) {
  const sanitized = sanitizePrompt(prompt)

  return `${siteConfig.claudeBaseUrl}?q=${encodeURIComponent(sanitized)}`
}
