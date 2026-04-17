import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MantineAppProvider } from '../mantine-provider'

describe('MantineAppProvider', () => {
  it('matches snapshot with children', () => {
    const { container } = render(
      <MantineAppProvider>
        <div data-testid="child">Hello</div>
      </MantineAppProvider>,
    )

    container.querySelectorAll('[id]').forEach((el) => {
      if (el.id.startsWith('mantine-')) {
        el.removeAttribute('id')
      }
    })

    expect(container).toMatchSnapshot()
  })

  it('renders children correctly', () => {
    const { getByTestId, getByText } = render(
      <MantineAppProvider>
        <div data-testid="child">Hello</div>
      </MantineAppProvider>,
    )
    expect(getByTestId('child')).toBeTruthy()
    expect(getByText('Hello')).toBeTruthy()
  })

  it('wraps children with MantineProvider', () => {
    const { container } = render(
      <MantineAppProvider>
        <span>test content</span>
      </MantineAppProvider>,
    )
    expect(container.querySelector('span')?.textContent).toBe('test content')
    expect(container.innerHTML).toContain('mantine')
  })
})
