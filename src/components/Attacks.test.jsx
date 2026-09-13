import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Attacks from './Attacks'

const ATTRIBUTES = { str: '16', dex: '10', con: '10', int: '10', wis: '10', cha: '10' }

function AttacksHarness({ proficiency, spellCasting }) {
  const [attacks, setAttacks] = useState([])
  return (
    <Attacks
      attacks={attacks}
      attributes={ATTRIBUTES}
      proficiency={proficiency}
      spellCasting={spellCasting}
      onChange={(_, value) => setAttacks(value)}
    />
  )
}

describe('attack to-hit / save DC calculation', () => {
  it('adds ability modifier and proficiency bonus for a default (STR, attack roll) row', async () => {
    render(<AttacksHarness proficiency="+2" spellCasting="none" />)

    await userEvent.click(screen.getByText('+ Add Attack'))

    // STR 16 -> +3 modifier, plus a +2 proficiency bonus (addProf defaults to true) = +5
    expect(screen.getByDisplayValue('+5')).toBeInTheDocument()
  })

  it('uses the spellcasting ability, not the row\'s own stat, for Save DC', async () => {
    render(<AttacksHarness proficiency="+2" spellCasting="cha" />)

    await userEvent.click(screen.getByText('+ Add Attack'))
    const typeSelect = screen.getByDisplayValue('Attack Roll')
    await userEvent.selectOptions(typeSelect, 'Save DC')

    // 8 + CHA mod (+0, since CHA is 10) + proficiency (+2) = 10, regardless of the row's STR stat
    expect(screen.getByDisplayValue('10')).toBeInTheDocument()
  })
})
