import axios from 'axios'

const API_URL = 'https://api.opendota.com/api'

function getSteamID32(steamID: string) {
  const steamID64 = BigInt(steamID)
  const steamID32 = steamID64 - BigInt('76561197960265728')
  return steamID32.toString()
}

async function getHerosOpenDota() {
  await axios
    .get(`${API_URL}/heroes`)
    .then((data) => {
      console.log(data)
    })
    .catch((err) => {
      console.log(err)
    })
}

async function getPorfileOpenDota(steamID: string) {
  try {
    const steamID32 = getSteamID32(steamID) // convert steamid
    const responseProfile = await axios.get(`${API_URL}/players/${steamID32}`) // get profile info open dota
    const dataProfile = responseProfile.data

    const responseAllHeroes = (await axios.get(`${API_URL}/heroes`)).data // get all heros dota 2
    const responseBestHeroes = (await axios.get(`${API_URL}/players/${steamID32}/heroes`)).data // get best heros from player dota2

    responseBestHeroes.forEach((hero: any) => {
      // add name from heros
      const heroData = responseAllHeroes.find((data: any) => data.id.toString() == hero.hero_id)
      hero.heroname = heroData ? heroData.localized_name : ''
      hero.npc_name = heroData ? heroData.name : ''
    })

    const foundRank = ranks.find((tier) => {
      return dataProfile.rank_tier === tier.rank
    })
    dataProfile.rank = foundRank ? foundRank : null

    dataProfile.bestHeroes = responseBestHeroes // add bestheros from player
    return dataProfile
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const ranks = [
  { rank: 11, title: 'Herald☆1', image: '11.png' },
  { rank: 12, title: 'Herald☆2', image: '12.png' },
  { rank: 13, title: 'Herald☆3', image: '13.png' },
  { rank: 14, title: 'Herald☆4', image: '14.png' },
  { rank: 15, title: 'Herald☆5', image: '15.png' },
  { rank: 21, title: 'Guardian☆1', image: '21.png' },
  { rank: 22, title: 'Guardian☆2', image: '22.png' },
  { rank: 23, title: 'Guardian☆3', image: '23.png' },
  { rank: 24, title: 'Guardian☆4', image: '24.png' },
  { rank: 25, title: 'Guardian☆5', image: '25.png' },
  { rank: 31, title: 'Crusader☆1', image: '31.png' },
  { rank: 32, title: 'Crusader☆2', image: '32.png' },
  { rank: 33, title: 'Crusader☆3', image: '33.png' },
  { rank: 34, title: 'Crusader☆4', image: '34.png' },
  { rank: 35, title: 'Crusader☆5', image: '35.png' },
  { rank: 41, title: 'Archon☆1', image: '41.png' },
  { rank: 42, title: 'Archon☆2', image: '42.png' },
  { rank: 43, title: 'Archon☆3', image: '43.png' },
  { rank: 44, title: 'Archon☆4', image: '44.png' },
  { rank: 45, title: 'Archon☆5', image: '45.png' },
  { rank: 51, title: 'Legend☆1', image: '51.png' },
  { rank: 52, title: 'Legend☆2', image: '52.png' },
  { rank: 53, title: 'Legend☆3', image: '53.png' },
  { rank: 54, title: 'Legend☆4', image: '54.png' },
  { rank: 55, title: 'Legend☆5', image: '55.png' },
  { rank: 61, title: 'Ancient☆1', image: '61.png' },
  { rank: 62, title: 'Ancient☆2', image: '62.png' },
  { rank: 63, title: 'Ancient☆3', image: '63.png' },
  { rank: 64, title: 'Ancient☆4', image: '64.png' },
  { rank: 65, title: 'Ancient☆5', image: '65.png' },
  { rank: 71, title: 'Divine☆1', image: '71.png' },
  { rank: 72, title: 'Divine☆2', image: '72.png' },
  { rank: 73, title: 'Divine☆3', image: '73.png' },
  { rank: 74, title: 'Divine☆4', image: '74.png' },
  { rank: 75, title: 'Divine☆5', image: '75.png' },
  { rank: 80, title: 'Imortal', image: '80.png' }
]

export default function useOpenDota() {
  return {
    getSteamID32,
    getHerosOpenDota,
    getPorfileOpenDota
  }
}
