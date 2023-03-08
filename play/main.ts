import { createApp } from "vue";
import App from './app.vue'
import { ElDialog } from '@ljc-ui/components'

const app = createApp(App)
app.use(ElDialog).mount('#app')