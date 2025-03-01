import axios from 'axios'

const STEAM_API_KEY = 'FBDAE59168DD04ED8077C5AC176822F5'
const STEAM_API_URL = 'https://api.steampowered.com'

async function getPlayerSummary(steamId: string) {
  try {
    const response = await axios.get(`${STEAM_API_URL}/ISteamUser/GetPlayerSummaries/v2/`, {
      params: {
        key: STEAM_API_KEY,
        steamids: steamId
      }
    })
    return response.data.response.players[0]
  } catch (error) {
    console.error('Error fetching player summary:', error)
    throw error
  }
}

async function getOwnedGames(steamId: string) {
  try {
    const response = await axios.get(`${STEAM_API_URL}/IPlayerService/GetOwnedGames/v1/`, {
      params: {
        key: STEAM_API_KEY,
        steamid: steamId,
        include_appinfo: true,
        include_played_free_games: true
      }
    })
    return response.data.response.games
  } catch (error) {
    console.error('Error fetching owned games:', error)
    throw error
  }
}

export default function useSteam() {
  return {
    getPlayerSummary,
    getOwnedGames
  }
}
