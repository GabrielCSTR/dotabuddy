import axios from 'axios'

async function getRequestAPIStratz(query: string, variables?: object, retries = 3) {
  const stratzApi = 'https://api.stratz.com/graphql'
  const bearerToken = import.meta.env.RENDERER_VITE_STRATZ_KEY

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        stratzApi,
        { query, variables },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`
          }
        }
      )
      return response.data.data || null
    } catch (error) {
      console.error(`GraphQL Error (attempt ${attempt}):`, error)
      if (attempt === retries) {
        throw new Error('Max retries reached')
      }
    }
  }
}

async function makeGraphQLProfileRequest(steamID3: number) {
  const query = `
  query playerInfo ($steamid: Long!)
  {
    player(steamAccountId: $steamid) {
      firstMatchDate
      matchCount
      winCount
      MatchGroupBySteamId: matchesGroupBy( request: {
        take: 5
        gameModeIds: [1,22]
        playerList: SINGLE
        groupBy: STEAM_ACCOUNT_ID
      }) {
        ... on MatchGroupBySteamAccountIdType{ matchCount winCount avgImp avgKills avgDeaths avgAssists avgExperiencePerMinute avgGoldPerMinute avgKDA }
      }
      MatchGroupByHero: matchesGroupBy( request: {
        take: 5
        gameModeIds: [1,22]
        playerList: SINGLE
        groupBy: HERO
      }) {
        ... on MatchGroupByHeroType{ heroId matchCount winCount avgKills avgDeaths avgAssists avgExperiencePerMinute avgGoldPerMinute avgKDA avgImp }
      }
      simpleSummary{
        matchCount
        lastUpdateDateTime
        heroes
        {
          heroId
          winCount
          lossCount
        }
      }
      steamAccount {
        name
        avatar
        isAnonymous
        seasonRank
        smurfFlag
        countryCode
        isDotaPlusSubscriber
        dotaAccountLevel
        seasonLeaderboardRank
        guild{
          guild{
            name
            motd
            logo
            tag
          }
        }
        battlepass{
          level
        }
        proSteamAccount {
          isPro
          name
        }
      }
      matches( request: {
        isParsed: true
        gameModeIds: [1,22]
        take: 5
        playerList: SINGLE
      }) {
        id
        analysisOutcome
        durationSeconds
        endDateTime
        players(steamAccountId: $steamid) { isVictory networth level assists kills deaths heroId experiencePerMinute goldPerMinute }
      }
    }
  }
  `

  const variables = {
    steamid: steamID3
  }

  return await getRequestAPIStratz(query, variables)
}

async function makeGraphQLHerosRequest() {
  const query = `
  query GetAllHeroes {
    constants {
      heroes {
        id
        name
        displayName
        shortName
        stats {
          primaryAttribute
        }
      }
    }
  }
  `
  return await getRequestAPIStratz(query)
}

async function makeGraphQLGetPlayerBestHeroes(steamID3: number) {
  const query = `
  query GetPlayerBestHeroes($steamAccountId: Long!,  $take: Int!, $gameVersionId: Short!) {
    player(steamAccountId: $steamAccountId) {
      steamAccountId
      matchCount
      heroesGroupBy: matchesGroupBy(
        request: { playerList: SINGLE, groupBy: HERO, take: $take }
      ) {
        ... on MatchGroupByHeroType {
          heroId
          hero(gameVersionId: $gameVersionId) {
            id
            displayName
            shortName
          }
          winCount
          matchCount
        }
      }
    }
  }
  `
  const variables = {
    steamAccountId: steamID3,
    take: 50000,
    gameVersionId: 169
  }

  return await getRequestAPIStratz(query, variables)
}

export default function useStractz() {
  return {
    makeGraphQLProfileRequest,
    makeGraphQLHerosRequest,
    makeGraphQLGetPlayerBestHeroes
  }
}
