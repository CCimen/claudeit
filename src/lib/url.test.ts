import { describe, expect, test } from 'bun:test'

import {
  PROMPT_LIMIT,
  buildShareUrl,
  getPromptFromSearch,
  sanitizePrompt,
} from '@/lib/url'

describe('url helpers', () => {
  test('sanitizePrompt trims whitespace', () => {
    expect(sanitizePrompt('  hello  ')).toBe('hello')
  })

  test('sanitizePrompt clamps long prompts', () => {
    expect(sanitizePrompt('a'.repeat(PROMPT_LIMIT + 25))).toHaveLength(
      PROMPT_LIMIT,
    )
  })

  test('buildShareUrl encodes unicode with provided origin', () => {
    expect(buildShareUrl('Hej världen 👋', 'http://localhost:5173')).toBe(
      'http://localhost:5173/?q=Hej%20v%C3%A4rlden%20%F0%9F%91%8B',
    )
  })

  test('getPromptFromSearch returns null for empty or whitespace prompt', () => {
    expect(getPromptFromSearch('?q=')).toBeNull()
    expect(getPromptFromSearch('?q=++++')).toBeNull()
  })

  test('getPromptFromSearch returns decoded prompt text', () => {
    expect(getPromptFromSearch('?q=Hur%20m%C3%A5r%20du%3F')).toBe('Hur mår du?')
  })
})
