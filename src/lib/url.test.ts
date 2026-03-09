import { describe, expect, test } from 'bun:test'

import {
  PROMPT_LIMIT,
  buildShareUrl,
  getPromptFromSearch,
  getPromptFromUrl,
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

  test('buildShareUrl produces opaque hash fragment', () => {
    const url = buildShareUrl('Hello world', 'http://localhost:5173')
    expect(url).toStartWith('http://localhost:5173/#')
    expect(url).not.toContain('Hello')
    expect(url).not.toContain('world')
  })

  test('buildShareUrl returns bare origin for empty prompt', () => {
    expect(buildShareUrl('', 'http://localhost:5173')).toBe(
      'http://localhost:5173/',
    )
    expect(buildShareUrl('   ', 'http://localhost:5173')).toBe(
      'http://localhost:5173/',
    )
  })

  test('round-trip: buildShareUrl → getPromptFromUrl', () => {
    const prompt = 'How do I center a div?'
    const url = buildShareUrl(prompt, 'http://localhost:5173')
    const hash = '#' + url.split('#')[1]
    expect(getPromptFromUrl('', hash)).toBe(prompt)
  })

  test('round-trip with Swedish characters', () => {
    const prompt = 'Varför är albaner så smarta?'
    const url = buildShareUrl(prompt, 'http://localhost:5173')
    const hash = '#' + url.split('#')[1]
    expect(getPromptFromUrl('', hash)).toBe(prompt)
  })

  test('round-trip with emoji', () => {
    const prompt = 'Why is 🐛 debugging so hard? 🤔'
    const url = buildShareUrl(prompt, 'http://localhost:5173')
    const hash = '#' + url.split('#')[1]
    expect(getPromptFromUrl('', hash)).toBe(prompt)
  })

  test('round-trip with long prompt stays under 2000 chars', () => {
    const prompt = 'a'.repeat(PROMPT_LIMIT)
    const url = buildShareUrl(prompt, 'https://letmeclaudeit.com')
    expect(url.length).toBeLessThan(2000)
    const hash = '#' + url.split('#')[1]
    expect(getPromptFromUrl('', hash)).toBe(prompt)
  })

  test('getPromptFromUrl falls back to legacy ?q= format', () => {
    expect(getPromptFromUrl('?q=Hur%20m%C3%A5r%20du%3F', '')).toBe(
      'Hur mår du?',
    )
  })

  test('getPromptFromUrl prefers hash over legacy ?q=', () => {
    const prompt = 'From hash'
    const url = buildShareUrl(prompt, 'http://localhost:5173')
    const hash = '#' + url.split('#')[1]
    expect(getPromptFromUrl('?q=From%20query', hash)).toBe('From hash')
  })

  test('getPromptFromUrl returns null for empty hash and empty search', () => {
    expect(getPromptFromUrl('', '')).toBeNull()
    expect(getPromptFromUrl('', '#')).toBeNull()
  })

  // Legacy tests
  test('getPromptFromSearch returns null for empty or whitespace prompt', () => {
    expect(getPromptFromSearch('?q=')).toBeNull()
    expect(getPromptFromSearch('?q=++++')).toBeNull()
  })

  test('getPromptFromSearch returns decoded prompt text', () => {
    expect(getPromptFromSearch('?q=Hur%20m%C3%A5r%20du%3F')).toBe('Hur mår du?')
  })
})
