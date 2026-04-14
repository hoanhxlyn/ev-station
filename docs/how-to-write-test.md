# How to Write Tests with Vitest

A quick reference guide for writing tests using Vitest.

## Quick Start

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('feature name', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should do something specific', () => {
    expect(actual).toBe(expected)
  })
})
```

## Common Assertions

```ts
// Equality
expect(value).toBe(42)                    // Strict (===)
expect(obj).toEqual({ a: 1 })             // Deep equality
expect(obj).toStrictEqual({ a: 1 })       // Strict deep (checks types)

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()

// Numbers
expect(0.1 + 0.2).toBeCloseTo(0.3)
expect(value).toBeGreaterThan(5)

// Strings/Arrays
expect(str).toMatch(/pattern/)
expect(str).toContain('substring')
expect(array).toContain(item)
expect(array).toHaveLength(3)

// Objects
expect(obj).toHaveProperty('key')
expect(obj).toHaveProperty('nested.key', 'value')
expect(obj).toMatchObject({ subset: 'of properties' })

// Exceptions
expect(() => fn()).toThrow()
expect(() => fn()).toThrow('error message')
expect(() => fn()).toThrow(/pattern/)
```

## Async Testing

```ts
// Async/await (preferred)
it('fetches data', async () => {
  const data = await fetchData()
  expect(data).toEqual({ id: 1 })
})

// Promise matchers - ALWAYS await these
await expect(fetchData()).resolves.toEqual({ id: 1 })
await expect(fetchData()).rejects.toThrow('Error')
```

## Mocking

### Mock Functions

```ts
const mockFn = vi.fn()
mockFn.mockReturnValue(42)
mockFn.mockResolvedValue({ data: 'value' })

expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
expect(mockFn).toHaveBeenCalledTimes(2)
```

### Module Mocking

```ts
vi.mock('./module', () => ({
  namedExport: vi.fn(() => 'mocked'),
  default: vi.fn()
}))
```

### Spying

```ts
const spy = vi.spyOn(obj, 'method')
spy.mockRestore()
```

### Mock Cleanup

```ts
beforeEach(() => {
  vi.clearAllMocks()
  vi.restoreAllMocks()
})
```

## Fake Timers

```ts
beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

it('executes after timeout', () => {
  const callback = vi.fn()
  setTimeout(callback, 1000)
  vi.advanceTimersByTime(1000)
  expect(callback).toHaveBeenCalled()
})
```

## Snapshots

```ts
it('matches snapshot', () => {
  expect(data).toMatchSnapshot()
})

it('matches inline snapshot', () => {
  expect(render()).toMatchInlineSnapshot(`
    <div>
      <h1>Title</h1>
    </div>
  `)
})
```

## Test Methods

| Method | Purpose |
|--------|---------|
| `it()` / `test()` | Define test |
| `describe()` | Group tests |
| `beforeEach()` / `afterEach()` | Per-test hooks |
| `beforeAll()` / `afterAll()` | Per-suite hooks |
| `.skip` | Skip test/suite |
| `.only` | Run only this |
| `.todo` | Placeholder |
| `.concurrent` | Parallel execution |

## Best Practices

- Keep describes shallow (avoid deeply nested describes)
- Always `await` async expects
- Test behavior, not implementation details
- Use `beforeEach` for state isolation
- Place `vi.mock` at top level (before imports)
- Don't share state between tests