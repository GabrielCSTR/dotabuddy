import { defineStore } from 'pinia'
import type { Dota2Events } from '@renderer/types'

export const useCurrentMatchStore = defineStore('match-player', {
  state: () => ({
    isMatchRunning: false,
    radiantPlayers: null as null | Dota2Events['player'],
    direPlayers: null as null | Dota2Events['player'],
    radiantHeroes: null as null | Dota2Events['hero'],
    direHeroes: null as null | Dota2Events['hero'],
    radiantSkills: null as null | Dota2Events['ability'],
    direSkills: null as null | Dota2Events['ability'],
    radiantItems: null as null | Dota2Events['item'],
    direItems: null as null | Dota2Events['item']
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
    addRadiantSkills(skills: Dota2Events['ability']) {
      this.radiantSkills = skills
    },
    addDireSkills(skills: Dota2Events['ability']) {
      this.direSkills = skills
    },
    addRadiantItems(items: Dota2Events['item']) {
      this.radiantItems = items
    },
    addDireItems(items: Dota2Events['item']) {
      this.direItems = items
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
    getRadiantSkills() {
      return this.radiantSkills
    },
    getDireSkills() {
      return this.direSkills
    },
    getRadiantItems() {
      return this.radiantItems
    },
    getDireItems() {
      return this.direItems
    },
    clear() {
      this.isMatchRunning = false
      this.radiantPlayers = []
      this.direPlayers = []
      this.radiantHeroes = []
      this.direHeroes = []
      this.radiantSkills = []
      this.direSkills = []
      this.radiantItems = []
      this.direItems = []
    }
  }
})
