<template>
    <div class="footer d-flex-column pt-2">
        <div class="upper d-flex justify-content-center">Superintendência de Tecnologia da Informação e Comunicação</div>
        <div class="down d-flex justify-content-center">Prefeitura Municipal de Corumbá</div>

    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
.footer {
    color: rgb(255, 255, 255);;
    background-color: #000;
    min-height: 10vh;
    font-size: 0.8rem;
}

@media (max-width: 320) {
  .upper {
    display: none;
  }
}

</style>
