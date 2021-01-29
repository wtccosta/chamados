<template>
  <div id="app">
    <div class="conteiner">
        <chamado-header />
        <main>
          <chamado-form />
        </main>

        <footer>
          <chamados-footer />
        </footer>
        
    </div>
    
  </div>
</template>

<script>
import ChamadoForm from './components/ChamadoForm.vue'
import ChamadosFooter from './components/ChamadosFooter.vue'
import ChamadoHeader from './components/ChamadosHeader.vue'
export default {
  name: 'App',
  components: {
    ChamadoForm,
    ChamadoHeader,
    ChamadosFooter
}
}
</script>

<style scoped>
main{
  min-height: 75vh;
}
</style>
