import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { MemoryRouter } from 'react-router'
import { LoginLeftPanel } from '../component/left-panel'

function renderLeftPanel() {
  const result = render(
    <MantineProvider>
      <MemoryRouter>
        <LoginLeftPanel />
      </MemoryRouter>
    </MantineProvider>,
  )

  result.container.querySelectorAll('[id]').forEach((el) => {
    if (el.id.startsWith('mantine-')) {
      el.removeAttribute('id')
    }
  })

  return result
}

describe('LoginLeftPanel', () => {
  it('matches snapshot', () => {
    const { container } = renderLeftPanel()
    expect(container).toMatchSnapshot()
  })

  it('renders brand name', () => {
    const { getAllByText } = renderLeftPanel()
    expect(getAllByText('EV Station').length).toBeGreaterThan(0)
  })

  it('renders carousel images', () => {
    const { container } = renderLeftPanel()
    const images = container.querySelectorAll('img')
    expect(images.length).toBe(3)
  })

  it('renders heading text', () => {
    const { getByText } = renderLeftPanel()
    expect(
      getByText('Drive into the control room with one secure sign-in.'),
    ).toBeTruthy()
  })
})
