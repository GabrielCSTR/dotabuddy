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

async function makeGraphQLProfileRequest(steamID: number[]) {
  const query = `
    query GetPlayersBySteamId(
      $steamAccountId1: Long!,
      $steamAccountId2: Long!,
      $steamAccountId3: Long!,
      $steamAccountId4: Long!,
      $steamAccountId5: Long!,
      $steamAccountId6: Long!,
      $steamAccountId7: Long!,
      $steamAccountId8: Long!,
      $steamAccountId9: Long!,
      $steamAccountId10: Long!,
      $heroesGroupByRequest: PlayerMatchesGroupByRequestType!
    ) {
      player1: player(steamAccountId: $steamAccountId1) {
        ...PlayerData
      }
      player2: player(steamAccountId: $steamAccountId2) {
        ...PlayerData
      }
      player3: player(steamAccountId: $steamAccountId3) {
        ...PlayerData
      }
      player4: player(steamAccountId: $steamAccountId4) {
        ...PlayerData
      }
      player5: player(steamAccountId: $steamAccountId5) {
        ...PlayerData
      }
      player6: player(steamAccountId: $steamAccountId6) {
        ...PlayerData
      }
      player7: player(steamAccountId: $steamAccountId7) {
        ...PlayerData
      }
      player8: player(steamAccountId: $steamAccountId8) {
        ...PlayerData
      }
      player9: player(steamAccountId: $steamAccountId9) {
        ...PlayerData
      }
      player10: player(steamAccountId: $steamAccountId10) {
        ...PlayerData
      }
    }

    fragment PlayerData on PlayerType {
      firstMatchDate
      matchCount
      winCount
      heroesGroupBy: matchesGroupBy(request: $heroesGroupByRequest) {
        ... on MatchGroupByHeroType {
          heroId
          matchCount
          winCount
          avgGoldPerMinute
          avgExperiencePerMinute
          lastMatchDateTime
          avgAssists
          avgKills
          avgDeaths
        }
      }
      dotaPlus {
        heroId
        level
      }
      steamAccountId
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
        guild {
          guild {
            name
            motd
            logo
            tag
          }
        }
        battlepass {
          level
        }
        proSteamAccount {
          isPro
          name
        }
      }
      ...MatchData
    }

    fragment MatchData on PlayerType {
      matches(request: {
        isParsed: true
        gameModeIds: [1,22]
        take: 10
        playerList: SINGLE
      }) {
        id
        analysisOutcome
        durationSeconds
        endDateTime
        players {
          steamAccountId
          isVictory
          networth
          level
          assists
          kills
          deaths
          heroId
          experiencePerMinute
          goldPerMinute
        }
      }
    }
  `

  const variables = Object.fromEntries([
    ...steamID.slice(0, 10).map((id, index) => [`steamAccountId${index + 1}`, id]),
    [
      'heroesGroupByRequest',
      {
        groupBy: 'HERO',
        playerList: 'SINGLE',
        skip: 0,
        take: 10000
      }
    ]
  ])

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
  const response = await getRequestAPIStratz(query)
  return response?.constants || null
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
  return { makeGraphQLProfileRequest, makeGraphQLHerosRequest, makeGraphQLGetPlayerBestHeroes }
}
