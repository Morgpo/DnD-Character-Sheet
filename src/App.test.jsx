import { afterEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

afterEach(() => {
  localStorage.clear()
})

describe('page routing', () => {
  it('shows the attributes page by default', () => {
    render(<App />)
    expect(screen.getByText('Class & Background')).toBeInTheDocument()
  })

  it('groups Status, Attacks, Actions and Charges under the "Actions" nav item', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('Actions'))
    expect(screen.getByText('Status & Conditions')).toBeInTheDocument()
    expect(screen.getByText('Attacks')).toBeInTheDocument()
    expect(screen.getByText('Actions & Abilities')).toBeInTheDocument()
    expect(screen.getByText('Resources & Item Charges')).toBeInTheDocument()
  })

  it('combines Notes and Backstory on the notes page', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('Notes'))
    expect(screen.getByRole('heading', { name: 'Personality' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Backstory' })).toBeInTheDocument()
  })
})

describe('saved-data resilience', () => {
  it('discards corrupted autosave data instead of crashing', () => {
    localStorage.setItem('dnd_character_sheet_autosave', '{not valid json')
    render(<App />)
    expect(screen.getByPlaceholderText('Character Name')).toHaveValue('')
  })

  it('fills in missing fields from an older save rather than breaking', () => {
    localStorage.setItem(
      'dnd_character_sheet_autosave',
      JSON.stringify({ basicInfo: { charName: 'Vorhn' } })
    )
    render(<App />)
    expect(screen.getByPlaceholderText('Character Name')).toHaveValue('Vorhn')
  })
})
