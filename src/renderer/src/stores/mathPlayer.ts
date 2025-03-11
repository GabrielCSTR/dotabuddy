import { defineStore } from 'pinia'
import type { Dota2Events, PlayerStats } from '@renderer/types'

export const useCurrentMatchStore = defineStore('match-player', {
  state: () => ({
    isMatchRunning: false,
    radiantPlayers: {} as { [key: string]: PlayerStats },
    direPlayers: {} as { [key: string]: PlayerStats },
    radiantHeroes: null as Dota2Events['hero'] | null,
    direHeroes: null as Dota2Events['hero'] | null,
    radiantSkills: { team2: {}, team3: {} } as Dota2Events['abilities'],
    direSkills: { team2: {}, team3: {} } as Dota2Events['abilities'],
    radiantItems: {} as Dota2Events['items'],
    direItems: {} as Dota2Events['items']
  }),

  actions: {
    setPlayers(team: 'radiant' | 'dire', players: { [key: string]: PlayerStats }) {
      this[`${team}Players`] = players
    },

    setHeroes(team: 'radiant' | 'dire', heroes: Dota2Events['hero']) {
      this[`${team}Heroes`] = heroes
    },

    setSkills(team: 'radiant' | 'dire', skills: Dota2Events['abilities']) {
      this[`${team}Skills`] = skills
    },

    setItems(team: 'radiant' | 'dire', items: Dota2Events['items']) {
      this[`${team}Items`] = items
    },

    clear() {
      this.isMatchRunning = false
      this.radiantPlayers = {}
      this.direPlayers = {}
      this.radiantHeroes = null
      this.direHeroes = null
      this.radiantSkills = { team2: {}, team3: {} }
      this.direSkills = { team2: {}, team3: {} }
      this.radiantItems = { team2: {}, team3: {} }
      this.direItems = { team2: {}, team3: {} }
    }
  }
})
