<template>
  <div>
     
  
  </div>
</template>

<script>
import { apiProtected } from './../configs/apiServices'
export default {

    data() {
        return {
            fields: ['id', 'endereco', 'telefoneContanto', 'descricao', 'abertura'],
            tickets: []
        }
    },
    methods: {
        async loadData() {
            const api =  await apiProtected();
            api.get('chamados')
                .then(response => {
                    this.tickets = response.data
                })
                .catch(error => {
                    if(error.response != undefined && error.response.data != undefined){
                        console.error(error.response.data);
                    }
                    console.error('Algo deu errado: ', error);
                })
        }
    },
    mounted () {
        this.loadData();
    }

};
</script>

<style>
</style>