import { defineStore } from 'pinia'
import type { Dota2Events } from '@renderer/types'

export const useCurrentMatchStore = defineStore('match-player', {
  state: () => ({
    isMatchRunning: false,
    radiantPlayers: null as null | Dota2Events['player'],
    direPlayers: null as null | Dota2Events['player'],
    radiantHeroes: null as null | Dota2Events['hero'],
    direHeroes: null as null | Dota2Events['hero']
  }),
  actions: {
    addRadiantPlayer(player: Dota2Events['player']) {
      this.radiantPlayers = player
    },
    addDirePlayer(player: Dota2Events['player']) {
      this.direPlayers = player
    },
    addRadiantHero(hero: Dota2Events['hero']) {
      this.radiantHeroes = hero
    },
    addDireHero(hero: Dota2Events['hero']) {
      this.direHeroes = hero
    },
    getRadiantPlayers() {
      return this.radiantPlayers
    },
    getDirePlayers() {
      return this.direPlayers
    },
    getRadiantHeroes() {
      return this.radiantHeroes
    },
    getDireHeroes() {
      return this.direHeroes
    },
    clear() {
      this.radiantPlayers = []
      this.direPlayers = []
      this.radiantHeroes = []
      this.direHeroes = []
    }
  }
})
