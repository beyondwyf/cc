import { createApp } from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faLocationDot,
  faRestroom,
  faWheelchair,
  faToilet,
  faPen
} from '@fortawesome/free-solid-svg-icons'

library.add(faLocationDot, faRestroom, faWheelchair, faToilet, faPen)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')