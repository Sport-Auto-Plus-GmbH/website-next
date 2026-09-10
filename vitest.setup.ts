import '@testing-library/jest-dom/vitest'
import 'dotenv/config'

// Unmount rendered components between tests — without this, multiple tests calling
// `render()` in the same file leak elements into jsdom's shared document, breaking
// single-element queries like `getByText` on the second/third test.
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
