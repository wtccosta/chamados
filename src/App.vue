<template>
  <div id="app">
    <div class="conteiner">
      <div class="row">
        <div class="col-12">
          <chamado-header />
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-2" v-if="logged">
          <chamados-nav />
        </div>
        <div class="col">
          <main>
            <router-view></router-view>
          </main>
        </div>
      </div>


      <footer>
        <chamados-footer />
      </footer>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ChamadosFooter from "./components/ChamadosFooter.vue";
import ChamadoHeader from "./components/ChamadosHeader.vue";
import ChamadosNav from './components/ChamadosNav'
export default {
  name: "App",
  components: {
    ChamadoHeader,
    ChamadosFooter,
    ChamadosNav
  },
     computed: mapState({
    logged: (state) => state.auth.logged,
    user: (state) => state.auth.user,
  }),
};
</script>

<style scoped>
main {
  min-height: 75vh;
}
</style>
