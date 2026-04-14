import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, formatDateShort } from '../format-utils'

describe('formatCurrency', () => {
  it('should format with divisor 100', () => {
    expect(formatCurrency(1000, 100)).toBe('10.00')
  })

  it('should format with divisor 1', () => {
    expect(formatCurrency(1234, 1)).toBe('1234.00')
  })

  it('should handle zero amount', () => {
    expect(formatCurrency(0, 100)).toBe('0.00')
  })

  it('should format decimal values correctly', () => {
    expect(formatCurrency(123, 100)).toBe('1.23')
  })
})

describe('formatDate', () => {
  it('should format date with time', () => {
    const timestamp = new Date('2024-03-15T14:30:00').getTime()
    const result = formatDate(timestamp)
    expect(result).toMatch(/Mar 15, 2024/)
    expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)/)
  })

  it('should format different dates', () => {
    const timestamp = new Date('2023-12-25T09:00:00').getTime()
    const result = formatDate(timestamp)
    expect(result).toMatch(/Dec 25, 2023/)
  })
})

describe('formatDateShort', () => {
  it('should format date without time', () => {
    const timestamp = new Date('2024-03-15T14:30:00').getTime()
    expect(formatDateShort(timestamp)).toBe('Mar 15, 2024')
  })

  it('should format short date correctly', () => {
    const timestamp = new Date('2023-01-01T00:00:00').getTime()
    expect(formatDateShort(timestamp)).toBe('Jan 1, 2023')
  })
})
