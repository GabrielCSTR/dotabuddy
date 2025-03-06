<script lang="ts" setup>
import { useHeroStore } from '@renderer/stores/hero-store'
import { MatchGroupByHeroType } from '@renderer/types'
import { IHeroes as HeroType, DotaPlusHero } from '@renderer/types/stratz'

import { normalizeHeroNameImage } from '@renderer/utils'
import { computed } from 'vue'

const props = defineProps<{ bestHeroes: MatchGroupByHeroType[]; dotaPlusHeroes: DotaPlusHero[] }>()
const heroStore = useHeroStore()

// Order 10 best heroes by match count
const bestHeroesData = computed(() =>
  [...props.bestHeroes].sort((a, b) => b.matchCount - a.matchCount).slice(0, 10)
)

const getHeroInfo = (heroId: number): HeroType | undefined =>
  heroStore.data.heroes.find((hero) => hero.id === heroId)

const getHeroPlusInfo = (heroId: number): DotaPlusHero | undefined =>
  props.dotaPlusHeroes.reduce(
    (maxHero, currentHero) =>
      currentHero.heroId === heroId && currentHero.level > maxHero.level ? currentHero : maxHero,
    { heroId: 0, level: 0 } as DotaPlusHero
  )

const sortedHeroesByLevel = computed(() =>
  bestHeroesData.value
    .map((hero) => getHeroPlusInfo(hero.heroId)!)
    .filter(Boolean)
    .sort((a, b) => b.level - a.level)
    .slice(0, 10)
)

const getBadgeImage = (level: number): string =>
  `hero_badge_${
    level >= 30 ? 6 : level >= 25 ? 5 : level >= 15 ? 4 : level >= 10 ? 3 : level >= 5 ? 2 : 1
  }.png`

const levelGradients: Record<number, string> = {
  30: 'background-image: linear-gradient(135deg, rgb(223, 48, 68), rgb(195, 147, 70));', // lvl 30
  25: 'background-image: linear-gradient(135deg, rgb(162, 104, 187), rgb(224, 52, 36));', // lvl 25
  15: 'background-image: linear-gradient(135deg, rgb(200, 254, 252), rgb(122, 136, 255));', // lvl 20
  10: 'background-image: linear-gradient(135deg, rgb(203, 178, 87), rgb(156, 118, 28));', // lvl 15
  5: 'background-image: linear-gradient(135deg, rgb(0, 34, 0), rgb(0, 68, 0));', // lvl 10
  0: 'background-image: linear-gradient(135deg, rgb(34, 0, 0), rgb(68, 0, 0));' // lvl 5
}

const getBgColor = (level: number): string => {
  return levelGradients[
    Object.keys(levelGradients)
      .map(Number)
      .reverse()
      .find((lvl) => level >= lvl) ?? 0
  ]
}

const getInfoBestHero = (heroId: number): MatchGroupByHeroType | undefined => {
  return bestHeroesData.value.find((hero) => hero.heroId === heroId)
}
</script>
<template>
  <div class="grid grid-cols-5 h-full items-center justify-center gap-2">
    <div
      v-for="bestHero in sortedHeroesByLevel"
      v-show="getHeroPlusInfo(bestHero.heroId)?.heroId"
      :key="bestHero.heroId"
      class="bg-gray-800 rounded-ss-md rounded-se-md relative h-full"
      :style="getBgColor(getHeroPlusInfo(bestHero.heroId)?.level ?? 0)"
    >
      <!-- <OverlayBadge :value="index + 1" severity="warn" size="small" class="mr-2 mt-2"> -->
      <img
        :src="`https://cdn.stratz.com/images/dota2/heroes/${normalizeHeroNameImage(getHeroInfo(bestHero.heroId)?.name ?? '')}_modelcrop.png`"
        :alt="getHeroInfo(bestHero.heroId)?.displayName"
        class="w-full h-auto"
      />
      <!-- </OverlayBadge> -->

      <div class="flex justify-evenly relative p-3" style="background: rgba(0, 0, 0, 0.6)">
        <div
          class="absolute left-1/2 transform -translate-x-1/2 inline-flex justify-center items-center overflow-hidden text-[11px] w-10 h-10"
        >
          <img
            :src="`/src/assets/icons/plus/${getBadgeImage(getHeroPlusInfo(bestHero.heroId)?.level ?? 0)}`"
            loading="lazy"
            style="width: 35px; height: 35px"
          />
          <div class="absolute p-8">
            <svg viewBox="0 0 32 13" width="32" height="13">
              <text
                x="16"
                y="10.4"
                text-anchor="middle"
                font-weight="bold"
                stroke="hsl(0,0%,0%)"
                stroke-width="4"
              >
                {{ getHeroPlusInfo(bestHero.heroId)?.level }}
              </text>
              <text x="16" y="10.4" text-anchor="middle" font-weight="bold" fill="hsl(0,0%,100%)">
                {{ getHeroPlusInfo(bestHero.heroId)?.level }}
              </text>
            </svg>
          </div>
        </div>

        <div class="w-1/2 lg:mr-2 flex flex-col items-center justify-center">
          <dt class="block whitespace-nowrap text-white">
            <div class="block whitespace-nowrap text-white" style="color: hsla(0, 0%, 100%, 0.6)">
              <svg
                width="8"
                height="8"
                viewBox="0 0 24 24"
                style="
                  width: 1em;
                  height: 1em;
                  margin-bottom: -0.1em;
                  fill: currentcolor;
                  display: inline-block;
                "
              >
                <g
                  style="
                    transform: rotate(180deg);
                    transform-origin: center center;
                    transition: transform 100ms ease-in-out;
                  "
                >
                  <path
                    d="M23.778 6.334l-1.07-1.087a.642.642 0 0 0-.919 0L12 15.167l-9.79-9.92a.642.642 0 0 0-.918 0L.222 6.334a.667.667 0 0 0 0 .933L11.54 18.764a.642.642 0 0 0 .918 0L23.78 7.267a.667.667 0 0 0 0-.933z"
                  ></path>
                </g>
              </svg>
            </div>
          </dt>
          <dd class="block whitespace-nowrap text-white font-bold">
            &ZeroWidthSpace;<span
              class="inline"
              :style="
                (
                  ((getInfoBestHero(bestHero.heroId)?.winCount ?? 0) /
                    (getInfoBestHero(bestHero.heroId)?.matchCount ?? 1)) *
                  100
                ).toFixed(2) > '50'
                  ? 'color: hsl(134, 66%, 48%)'
                  : 'color: hsl(353, 97%, 47%);'
              "
              >{{
                (
                  ((getInfoBestHero(bestHero.heroId)?.winCount ?? 0) /
                    (getInfoBestHero(bestHero.heroId)?.matchCount ?? 1)) *
                  100
                ).toFixed(2)
              }}%</span
            >
          </dd>
        </div>

        <div class="w-1/2 flex flex-col items-center justify-center">
          <dt class="block whitespace-nowrap text-white">
            <div class="block whitespace-nowrap text-white" style="color: hsla(0, 0%, 100%, 0.6)">
              <svg
                width="8"
                height="8"
                viewBox="0 0 24 24"
                style="
                  width: 1em;
                  height: 1em;
                  margin-bottom: -0.1em;
                  fill: currentcolor;
                  display: inline-block;
                "
              >
                <polygon
                  points="0.0012 0.427465309 1.05186667 4.45152349 16.1749778 18.4010217 18.6914222 15.9801722 4.24431111 1.38023913"
                ></polygon>
                <polygon
                  points="22.1191556 13.7102784 20.9747111 16.1965562 16.4049333 20.5930857 13.8204889 21.6955322 14.8911556 19.1352733 19.4600444 14.7391715"
                ></polygon>
                <path
                  d="M22.5210667,13.1897167 C22.8175111,13.4740948 22.8166222,13.9346592 22.5210667,14.2190374 C22.2264,14.5029879 21.7477333,14.5029879 21.4526222,14.2190374 C21.1575111,13.9346592 21.1570667,13.4740948 21.4526222,13.1897167 C21.7477333,12.9057661 22.2264,12.9053385 22.5210667,13.1897167"
                ></path>
                <path
                  d="M14.472,21.0686173 C14.7675556,21.3521402 14.7675556,21.8131322 14.472,22.0975104 C14.1764444,22.3814609 13.6982222,22.3814609 13.4026667,22.0975104 C13.1075556,21.8131322 13.1075556,21.3521402 13.4022222,21.0686173 C13.6977778,20.7842391 14.1764444,20.7842391 14.472,21.0686173"
                ></path>
                <polygon
                  points="22.4225333 19.5700084 19.9065333 21.9917132 18.1678667 20.3183721 20.6838667 17.897095"
                ></polygon>
                <path
                  d="M22.4546222,20.5726874 L20.9475111,22.0228023 C20.6546222,22.3050423 20.6519556,22.7591921 20.9412889,23.0380111 C21.2306222,23.3164023 21.7026222,23.3134089 21.9964,23.0311689 L23.5035111,21.5806263 C23.7964,21.2983863 23.7995111,20.8446641 23.5101778,20.5662729 C23.2204,20.2878816 22.7488444,20.2904474 22.4546222,20.5726874"
                ></path>
                <polygon
                  points="9.90973333 21.7171706 7.32573333 20.6155793 2.7564 16.2186223 1.61062222 13.7319168 4.27151111 14.7620928 8.83995556 19.1586223"
                ></polygon>
                <path
                  d="M10.4505333,22.104096 C10.1549778,22.3884742 9.67631111,22.3884742 9.3812,22.104096 C9.08564444,21.8201455 9.08564444,21.3595811 9.3812,21.0756305 C9.67631111,20.79168 10.1549778,20.7912524 10.4505333,21.0756305 C10.7460889,21.3595811 10.7460889,21.8201455 10.4505333,22.104096"
                ></path>
                <path
                  d="M2.26213333,14.3592593 C1.96746667,14.6436375 1.48835556,14.6436375 1.1928,14.3588317 C0.897688889,14.0748812 0.897688889,13.6143168 1.1928,13.3303663 C1.48835556,13.0464157 1.96746667,13.0464157 2.26213333,13.3299386 C2.55724444,13.6143168 2.55768889,14.0748812 2.26213333,14.3592593"
                ></path>
                <polygon
                  points="3.81924444 22.009289 1.30324444 19.5884396 3.04191111 17.9146708 5.55835556 20.3359479"
                ></polygon>
                <path
                  d="M2.77755556,22.0397795 L1.27044444,20.5896646 C0.976666667,20.3078522 0.505111111,20.3048588 0.214888889,20.58325 C-0.0744444444,20.8620689 -0.0713333333,21.3162188 0.222,21.5984588 L1.72955556,23.0490013 C2.02288889,23.3308137 2.49444444,23.3342348 2.78422222,23.0554159 C3.07355556,22.7765969 3.07133333,22.3228748 2.77755556,22.0397795"
                ></path>
                <polygon
                  points="19.5423111 1.43933847 12.3952 8.54793775 15.2174222 11.3930025 22.7347556 4.51105047 23.7254222 0.427550836"
                ></polygon>
                <polygon
                  points="8.5356 12.4543104 5.03515556 15.9977053 7.55115556 18.4189824 11.3018222 14.9812137"
                ></polygon>
              </svg>
            </div>
          </dt>
          <dd class="block whitespace-nowrap text-white font-bold">
            &ZeroWidthSpace;<span class="inline">{{
              getInfoBestHero(bestHero.heroId)?.matchCount
            }}</span>
          </dd>
        </div>
      </div>
    </div>
  </div>
</template>
