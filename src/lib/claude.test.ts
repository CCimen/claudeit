import { expect, test } from 'bun:test'

import { buildClaudeUrl } from '@/lib/claude'

test('buildClaudeUrl encodes the prompt for Claude', () => {
  expect(buildClaudeUrl('How do I center a div?')).toBe(
    'https://claude.ai/new?q=How%20do%20I%20center%20a%20div%3F',
  )
})
