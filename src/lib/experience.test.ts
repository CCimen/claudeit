import { expect, test } from 'bun:test'

import { shouldShowRefusal } from '@/lib/experience'

test('shouldShowRefusal can be forced for deterministic tests', () => {
  expect(shouldShowRefusal(() => 0.001)).toBe(true)
  expect(shouldShowRefusal(() => 0.8)).toBe(false)
})
