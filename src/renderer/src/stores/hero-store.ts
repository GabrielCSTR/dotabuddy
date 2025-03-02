import { defineStore } from 'pinia'
import { IHeroes } from '../types/stratz'

export const useHeroStore = defineStore('hero-store', {
  state: () => ({
    data: {
      heroes: [] as IHeroes[]
    }
  }),
  actions: {
    addHeroes(data: IHeroes[]) {
      this.data.heroes = data
    },
    getHeroes() {
      return this.data.heroes
    }
  }
})
