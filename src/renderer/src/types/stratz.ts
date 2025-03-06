export interface IHeroes {
  id: number
  displayName: string
  name: string
  shortName: string
  stats: {
    primaryAttribute: string
  }
}

export interface MatchPlayer {
  steamAccountId: number
  isVictory: boolean
  networth: number
  level: number
  assists: number
  kills: number
  deaths: number
  heroId: number
  experiencePerMinute: number
  goldPerMinute: number
}

export interface IMatches {
  id: number
  analysisOutcome: string
  durationSeconds: number
  endDateTime: number
  players: MatchPlayer[]
}

export interface DotaPlusHero {
  heroId: number
  level: number
}
