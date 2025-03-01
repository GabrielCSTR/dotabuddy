import type { PluginContext } from '../types'

import PrimeVue from 'primevue/config'

// Prime components imports
import Button from 'primevue/button'
import Card from 'primevue/card'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Image from 'primevue/image'
import Select from 'primevue/select'
import PanelMenu from 'primevue/panelmenu'
import Fluid from 'primevue/fluid'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Divider from 'primevue/divider'
import Ripple from 'primevue/ripple'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Panel from 'primevue/panel'
import OverlayBadge from 'primevue/overlaybadge'
import Tooltip from 'primevue/tooltip'

// Prime config imports
// import Aura from "@primevue/themes/aura";
import Aura from '@primeuix/themes/aura'

export default function ({ app }: PluginContext) {
  // Prime components
  app.component('PButton', Button)
  app.component('Card', Card)
  app.component('FloatLabel', FloatLabel)
  app.component('InputText', InputText)
  app.component('Password', Password)
  app.component('PImage', Image)
  app.component('PSelect', Select)
  app.component('PanelMenu', PanelMenu)
  app.component('Fluid', Fluid)
  app.component('PDialog', Dialog)
  app.component('Message', Message)
  app.component('Tabs', Tabs)
  app.component('TabList', TabList)
  app.component('Tab', Tab)
  app.component('TabPanels', TabPanels)
  app.component('TabPanel', TabPanel)
  app.component('Divider', Divider)
  app.component('Accordion', Accordion)
  app.component('AccordionTab', AccordionTab)
  app.component('Avatar', Avatar)
  app.component('Badge', Badge)
  app.component('Panel', Panel)
  app.component('OverlayBadge', OverlayBadge)
  app.directive('tooltip', Tooltip)

  // Prime directives
  app.directive('ripple', Ripple)

  // Prime
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        cssLayer: {
          name: 'primevue',
          order: 'theme, base, primevue'
        }
      }
    }
  })
}
