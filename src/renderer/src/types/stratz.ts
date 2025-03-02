export interface IHeroes {
  id: number
  displayName: string
  name: string
  shortName: string
  stats: {
    primaryAttribute: string
  }
}

export interface IMatches {
  id: number
  analysisOutcome: string
  durationSeconds: number
  endDateTime: number
  players: [
    {
      assists: number
      deaths: number
      experiencePerMinute: number
      goldPerMinute: number
      heroId: number
      isVictory: boolean
      kills: number
      level: number
      networth: number
    }
  ]
}
