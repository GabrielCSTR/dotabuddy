import type router from '@renderer/router'
import type { Pinia } from 'pinia'
import type { App } from 'vue'

export interface Loaddable {
  loading: boolean
}

export interface Disablable {
  disabled: boolean
}

export interface PluginContext {
  app: App
  router: typeof router
  pinia: Pinia
}

export interface IToken {
  email: string
}

export type EmitsFunction<T extends Record<string, [any]>> = <K extends keyof T>(
  event: K,
  ...args: T[K]
) => void

export type ListenersType<Emits extends Record<string, [any]>> = Record<
  keyof Emits,
  (...args: Emits[keyof Emits]) => void
>

interface Building {
  health: number
  max_health: number
}

interface Buildings {
  radiant: Record<string, Building>
  dire: Record<string, Building>
}

interface Provider {
  name: string
  appid: number
  version: number
  timestamp: number
}

interface Map {
  name: string
  matchid: string
  game_time: number
  clock_time: number
  daytime: boolean
  nightstalker_night: boolean
  radiant_score: number
  dire_score: number
  game_state: string
  paused: boolean
  win_team: string
  customgamename: string
  radiant_ward_purchase_cooldown: number
  dire_ward_purchase_cooldown: number
  roshan_state: string
  roshan_state_end_seconds: number
  radiant_win_chance: number
}

export interface PlayerStats {
  steamid: string
  accountid: string
  name: string
  activity: string
  kills: number
  deaths: number
  assists: number
  last_hits: number
  denies: number
  kill_streak: number
  commands_issued: number
  kill_list: Record<string, number>
  team_name: string
  player_slot: number
  team_slot: number
  gold: number
  gold_reliable: number
  gold_unreliable: number
  gold_from_hero_kills: number
  gold_from_creep_kills: number
  gold_from_income: number
  gold_from_shared: number
  gpm: number
  xpm: number
  net_worth: number
  hero_damage: number
  hero_healing: number
  tower_damage: number
  wards_purchased: number
  wards_placed: number
  wards_destroyed: number
  runes_activated: number
  camps_stacked: number
  support_gold_spent: number
  consumable_gold_spent: number
  item_gold_spent: number
  gold_lost_to_death: number
  gold_spent_on_buybacks: number
}

interface Players {
  team2: Record<string, PlayerStats>
  team3: Record<string, PlayerStats>
}

export interface IHero {
  facet: number
  xpos: number
  ypos: number
  id: number
  name: string
  level: number
  xp: number
  alive: boolean
  respawn_seconds: number
  buyback_cost: number
  buyback_cooldown: number
  health: number
  max_health: number
  health_percent: number
  mana: number
  max_mana: number
  mana_percent: number
  silenced: boolean
  stunned: boolean
  disarmed: boolean
  magicimmune: boolean
  hexed: boolean
  muted: boolean
  break: boolean
  aghanims_scepter: boolean
  aghanims_shard: boolean
  smoked: boolean
  has_debuff: boolean
  selected_unit: boolean
  talent_1: boolean
  talent_2: boolean
  talent_3: boolean
  talent_4: boolean
  talent_5: boolean
  talent_6: boolean
  talent_7: boolean
  talent_8: boolean
  attributes_level: number
}

interface Heroes {
  team2: Record<string, IHero>
  team3: Record<string, IHero>
}

export interface IAbility {
  name: string
  level: number
  can_cast: boolean
  passive: boolean
  ability_active: boolean
  cooldown: number
  ultimate: boolean
  charges?: number
  max_charges?: number
  charge_cooldown?: number
}

interface Abilities {
  team2: Record<string, Record<string, IAbility>>
  team3: Record<string, Record<string, IAbility>>
}

interface Item {
  name: string
  purchaser: number
  item_level: number
  can_cast?: boolean
  cooldown?: number
  passive: boolean
  item_charges?: number
  charges?: number
  contains_rune?: string
}

interface Items {
  team2: Record<string, Record<string, Item>>
  team3: Record<string, Record<string, Item>>
}

export interface Dota2Events {
  buildings: Buildings
  provider: Provider
  map: Map
  player: Players
  hero: Heroes
  abilities: Abilities
  items: Items
  draft: Record<string, unknown>
  previously: Partial<Dota2Events>
  auth: {
    token: string
  }
}

export interface SteamPlayerSummary {
  steamid: string
  communityvisibilitystate: number
  profilestate: number
  personaname: string
  commentpermission: number
  profileurl: string
  avatar: string
  avatarmedium: string
  avatarfull: string
  avatarhash: string
  personastate: number
  realname: string
  primaryclanid: string
  timecreated: number
  personastateflags: number
  loccountrycode: string
  locstatecode: string
}

interface hero {
  hero_id: number
  last_played: number
  games: number
  win: number
  with_games: number
  with_win: number
  against_games: number
  against_win: number
  heroname: string
  npc_name: string
}

interface profile {
  account_id: number
  personaname: string
  name: string
  plus: boolean
  cheese: number
  steamid: string
  avatar: string
  avatarmedium: string
  avatarfull: string
  profileurl: string
  last_login: string
  loccountrycode: string
  status: string
  fh_unavailable: boolean
  is_contributor: boolean
  is_subscriber: boolean
}

interface rank {
  image: string
  rank: number
  title: string
}
export interface MatchPlayer {
  bestHeroes: hero[]
  leaderboard_rank: number
  profile: profile
  rank: rank
  rank_tier: number
}

export interface Battlepass {
  level: number
}

export interface Guild {
  guild: {
    logo: string
    motd: string
    name: string
    tag: string
  }
}

export interface IHeroes {
  heroId: number
  winCount: number
  lossCount: number
}
export interface SimpleSummary {
  lastUpdateDateTime: number
  matchCount: number
  heroes: IHeroes[]
}

export interface ProSteamAccount {
  isPro: boolean
  name: string
}
export interface SteamAccount {
  name: string
  avatar: string
  isAnonymous: boolean
  seasonRank: number
  smurfFlag: number
  countryCode: string
  isDotaPlusSubscriber: boolean
  dotaAccountLevel: number
  seasonLeaderboardRank: number
  guild: Guild
  battlepass: Battlepass[]
  proSteamAccount: ProSteamAccount
}

export interface IPlayerSummary {
  steamAccountId: number
  firstMatchDate: number
  matchCount: number
  winCount: number
  MatchGroupBySteamId: []
  MatchGroupByHero: []
  simpleSummary: SimpleSummary
  steamAccount: SteamAccount
  matches: any[]
  playerGSI: PlayerStats
}

export const [RADIANT, DIRE] = ['team2', 'team3']
