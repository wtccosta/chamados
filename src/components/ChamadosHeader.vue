<template>
  <b-navbar toggleable="sm" type="dark" variant="dark">
    <b-navbar-brand to="/">Abertura de Chamados</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
    

      <b-navbar-nav class="ml-auto">
        <login-nav v-if="!logged" />
        <b-nav-item-dropdown :text="user" right v-else>
          <b-dropdown-item>Perfil <small><b>(Em construção)</b></small></b-dropdown-item>
          <b-dropdown-item @click="doLogoff()">Sair <small><b>(Logout)</b></small></b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import LoginNav from "./../components/ChamadosLoginNavForm.vue";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    LoginNav,
  },
  methods: {
    ...mapActions(['logoff']),
    doLogoff(){
      this.logoff();
      this.$router.push('/');
    }
  },
  computed: mapState({
    logged: (state) => state.auth.logged,
    user: (state) => state.auth.user,
  }),
};
</script>

<style scoped>
</style>