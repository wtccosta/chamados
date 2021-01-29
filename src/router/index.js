import Vue from 'vue'
import VueRouter from 'vue-router'
import ChamadosFormComponent from '../components/ChamadoForm.vue'
import ChamadosOpenedTickets from '../components/ChamadosOpenedTickets'

import DashBoard from './../pages/DashBoard.vue'

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: ChamadosFormComponent
        },

        {
            path: '/dashboard',
            component: DashBoard
        },

        {
            path: '/tickets',
            component: ChamadosOpenedTickets
        }
    ]
})