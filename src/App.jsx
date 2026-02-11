import { useState, useEffect, useCallback } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import CharacterBasicInfo from './components/CharacterBasicInfo'
import Attributes from './components/Attributes'
import Status from './components/Status'
import SavesAndSkills from './components/SavesAndSkills'
import Proficiencies from './components/Proficiencies'
import FeaturesTraits from './components/FeaturesTraits'
import Charges from './components/Charges'
import Attacks from './components/Attacks'
import Actions from './components/Actions'
import Equipment from './components/Equipment'
import Spells from './components/Spells'
import Backstory from './components/Backstory'
import Notes from './components/Notes'
import ConfirmModal from './components/ConfirmModal'

const AUTOSAVE_KEY = 'dnd_character_sheet_autosave'

// Helper function to deeply merge uploaded data with default structure
const mergeWithDefaults = (defaults, uploaded) => {
  if (!uploaded || typeof uploaded !== 'object' || Array.isArray(uploaded)) {
    return uploaded !== undefined ? uploaded : defaults
  }

  const result = { ...defaults }
  
  for (const key in defaults) {
    if (uploaded.hasOwnProperty(key)) {
      if (Array.isArray(defaults[key])) {
        // Keep arrays as-is from uploaded data
        result[key] = uploaded[key]
      } else if (typeof defaults[key] === 'object' && defaults[key] !== null) {
        // Recursively merge nested objects
        result[key] = mergeWithDefaults(defaults[key], uploaded[key])
      } else {
        // Use uploaded value for primitives
        result[key] = uploaded[key]
      }
    }
  }
  
  return result
}

const getDefaultState = () => {
  return {
    basicInfo: {
      charName: '',
      level: '',
      levelTwo: '',
      race: '',
      background: '',
      playerName: '',
      exp: '',
      alignment: '',
      deity: '',
      currentLevel: ''
    },
    topBar: {
      proficiency: '',
      initiative: '',
      passivePerception: '',
      ac: '',
      speed: '',
      spellDC: '',
      inspiration: ''
    },
    attributes: {
      str: '', dex: '', con: '', int: '', wis: '', cha: ''
    },
    status: {
      tempHP: '',
      currentHP: '',
      maxHP: '',
      hitDice: '',
      maxHitDice: '',
      deathSaves: { successes: 0, failures: 0 },
      conditions: '',
      boons: ''
    },
    saves: {
      str: false, dex: false, con: false,
      int: false, wis: false, cha: false
    },
    skills: {
      athletics: { prof: false, expert: false },
      acrobatics: { prof: false, expert: false },
      sleightOfHand: { prof: false, expert: false },
      stealth: { prof: false, expert: false },
      arcana: { prof: false, expert: false },
      history: { prof: false, expert: false },
      investigation: { prof: false, expert: false },
      nature: { prof: false, expert: false },
      religion: { prof: false, expert: false },
      animalHandling: { prof: false, expert: false },
      insight: { prof: false, expert: false },
      medicine: { prof: false, expert: false },
      perception: { prof: false, expert: false },
      survival: { prof: false, expert: false },
      deception: { prof: false, expert: false },
      intimidation: { prof: false, expert: false },
      performance: { prof: false, expert: false },
      persuasion: { prof: false, expert: false }
    },
    spellCasting: 'none',
    proficiencies: {
      languages: '',
      armor: '',
      weapons: '',
      tools: ''
    },
    features: '',
    charges: [],
    attacks: [],
    actions: [],
    equipment: {
      currency: { cp: '', sp: '', ep: '', gp: '', pp: '' },
      items: [],
      capacity: '',
      encumbrance: ''
    },
    spells: {
      spellClass: '',
      slots: {
        1: [], 2: [], 3: [], 4: [], 5: [],
        6: [], 7: [], 8: [], 9: []
      },
      cantrips: [],
      level1: [], level2: [], level3: [], level4: [], level5: [],
      level6: [], level7: [], level8: [], level9: []
    },
    backstory: {
      personality: '',
      ideals: '',
      bonds: '',
      flaws: '',
      backstory: '',
      appearance: '',
      allies: ''
    },
    notes: {
      notes1: '',
      notes2: ''
    }
  }
}

const getInitialState = () => {
  try {
    const saved = localStorage.getItem(AUTOSAVE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Merge saved data with defaults to ensure all fields exist
      return mergeWithDefaults(getDefaultState(), parsed)
    }
  } catch (error) {
    console.error('Error loading saved data:', error)
    // Clear corrupted data
    localStorage.removeItem(AUTOSAVE_KEY)
  }

  return getDefaultState()
}

function App() {
  const [character, setCharacter] = useState(getInitialState)
  const [currentPage, setCurrentPage] = useState('attributes')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Debounced autosave - only saves 1 second after user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(character))
        console.log('Autosaved at', new Date().toLocaleTimeString())
      } catch (error) {
        console.error('Error autosaving:', error)
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [character])

  const updateCharacter = useCallback((path, value) => {
    setCharacter(prev => {
      const keys = path.split('.')
      const newState = { ...prev }
      let current = newState

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return newState
    })
  }, [])

  const saveBackup = () => {
    try {
      const dataStr = JSON.stringify(character, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${character.basicInfo.charName || 'character'}-backup.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error saving backup:', error)
    }
  }

  const loadBackup = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const uploadedData = JSON.parse(event.target.result)
          // Merge uploaded data with default structure to prevent missing fields
          const mergedData = mergeWithDefaults(getDefaultState(), uploadedData)
          setCharacter(mergedData)
          localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(mergedData))
          console.log('Backup loaded successfully')
        } catch (error) {
          console.error('Error loading backup:', error)
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const clearSheet = () => {
    setShowClearConfirm(true)
  }

  const handleClearConfirm = () => {
    const blankState = getDefaultState()
    setCharacter(blankState)
    // Immediately save blank state to localStorage to prevent race conditions
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(blankState))
    setShowClearConfirm(false)
  }

  const handleClearCancel = () => {
    setShowClearConfirm(false)
  }

  return (
    <div className="app">
      <ConfirmModal
        isOpen={showClearConfirm}
        title="⚠️ Clear Character Sheet"
        message="WARNING: This will clear ALL data and reset the character sheet to blank.\n\nThis action cannot be undone!\n\nDo you want to continue?"
        onConfirm={handleClearConfirm}
        onCancel={handleClearCancel}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page)
          setSidebarOpen(false)
        }}
        onClearSheet={clearSheet}
        onSaveBackup={saveBackup}
        onLoadBackup={loadBackup}
      />

      <button 
        className="menu-button"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      <button 
        className="scroll-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ^
      </button>

      <div className="main-content" onClick={() => setSidebarOpen(false)}>
        <CharacterBasicInfo
          data={character.basicInfo}
          onChange={updateCharacter}
        />

        {currentPage === 'attributes' && (
          <div className="page">
            <Attributes
              attributes={character.attributes}
              topBar={character.topBar}
              basicInfo={character.basicInfo}
              onChange={updateCharacter}
            />
            <Status
              data={character.status}
              onChange={updateCharacter}
            />
            <SavesAndSkills
              attributes={character.attributes}
              topBar={character.topBar}
              saves={character.saves}
              skills={character.skills}
              spellCasting={character.spellCasting}
              onChange={updateCharacter}
            />
            <div className="two-column-layout">
              <div>
                <Proficiencies
                  data={character.proficiencies}
                  onChange={updateCharacter}
                />
                <FeaturesTraits
                  data={character.features}
                  onChange={updateCharacter}
                />
              </div>
              <Charges
                charges={character.charges}
                onChange={updateCharacter}
              />
            </div>
            <Attacks
              attacks={character.attacks}
              attributes={character.attributes}
              proficiency={character.topBar.proficiency}
              onChange={updateCharacter}
            />
            <Actions
              actions={character.actions}
              attributes={character.attributes}
              proficiency={character.topBar.proficiency}
              onChange={updateCharacter}
            />
          </div>
        )}

        {currentPage === 'equipment' && (
          <div className="page">
            <Equipment
              data={character.equipment}
              onChange={updateCharacter}
            />
          </div>
        )}

        {currentPage === 'spells' && (
          <div className="page">
            <Spells
              spells={character.spells}
              attributes={character.attributes}
              proficiency={character.topBar.proficiency}
              onChange={updateCharacter}
            />
          </div>
        )}

        {currentPage === 'backstory' && (
          <div className="page">
            <Backstory
              data={character.backstory}
              onChange={updateCharacter}
            />
          </div>
        )}

        {currentPage === 'notes' && (
          <div className="page">
            <Notes
              data={character.notes}
              onChange={updateCharacter}
            />
          </div>
        )}

        <footer className="footer">
          D&D 5<sup>th</sup> Edition Character Sheet || Created by{' '}
          <a href="https://github.com/Chee32" target="_blank" rel="noopener noreferrer">Chee32</a>,{' '}
          <a href="https://github.com/lckynmbrsvn" target="_blank" rel="noopener noreferrer">lckynmbrsvn</a> &{' '}
          <a href="https://github.com/Morgpo" target="_blank" rel="noopener noreferrer">Morgpo</a> || React Version 2.0
        </footer>
      </div>
    </div>
  )
}

export default App
