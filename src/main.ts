import { createApp } from 'vue'
import App from './App.vue'

// css
import './style.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        aliases,
        defaultSet: 'mdi',
        sets: {
            mdi
        }
    }
})

createApp(App)
    .use(vuetify)
    .mount('#app')
