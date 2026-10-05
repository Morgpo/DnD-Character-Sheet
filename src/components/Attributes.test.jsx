import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Attributes from './Attributes'

describe('ability modifier calculation', () => {
  it('shows +3 for a score of 16, and +0 for a score of 10', () => {
    const attributes = { str: '16', dex: '10', con: '10', int: '10', wis: '10', cha: '10' }
    const basicInfo = { race: '', background: '', classes: '' }

    render(<Attributes attributes={attributes} basicInfo={basicInfo} onChange={() => {}} />)

    expect(screen.getByText('+3')).toBeInTheDocument()
    expect(screen.getAllByText('+0')).toHaveLength(5)
  })

  it('shows a negative modifier for a below-average score', () => {
    const attributes = { str: '8', dex: '10', con: '10', int: '10', wis: '10', cha: '10' }
    const basicInfo = { race: '', background: '', classes: '' }

    render(<Attributes attributes={attributes} basicInfo={basicInfo} onChange={() => {}} />)

    expect(screen.getByText('-1')).toBeInTheDocument()
  })
})
