<template>
  <b-navbar toggleable type="dark" variant="dark">
    <b-navbar-brand href="#">Abertura de Chamados</b-navbar-brand>
      <login-nav />
        
  </b-navbar>
</template>

<script>
import LoginNav from './../components/ChamadosLoginNavForm.vue'
export default {
    components: {
      LoginNav
    }
}
</script>

<style scoped>

</style>