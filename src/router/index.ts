import { createRouter, createWebHistory } from 'vue-router'
import TechnicianReport from '../components/TechnicianReport.vue'
import AdminSettings from '../components/AdminSettings.vue'
import Support from '../components/Support.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/suporte'
    },
    {
      path: '/relatorios',
      name: 'relatorios',
      component: TechnicianReport
    },
    {
      path: '/configuracoes',
      name: 'configuracoes',
      component: AdminSettings
    },
    {
      path: '/suporte',
      name: 'suporte',
      component: Support
    }
  ]
})

export default router