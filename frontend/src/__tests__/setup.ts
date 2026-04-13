import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Stub les imports de SVG/images qui échouent en environnement jsdom
vi.mock('../assets/images/icon-search.svg', () => ({ default: 'icon-search.svg' }))
