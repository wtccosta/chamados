<template>
<div>
<b-nav-form> <!--Criar computed para monitorar estado de logado-->
       <span class="mr-3 font-weight-bolder text-white-50">Administração</span>
      <b-form-input class="mr-sm-2" v-model="form.login" :state=status placeholder="Usuário"></b-form-input>
      <b-form-input type="password" class="mr-sm-2" v-model="form.senha" :state=status placeholder="Senha"></b-form-input>
      <b-button v-if="!processing" variant="light" :state=status class="my-2 my-sm-0 font-weight-lighter" type="submit" @click.prevent="doLogin()">Logar</b-button>
      <b-button v-else variant="light" :state=status class="my-2 my-sm-0 font-weight-lighter" type="submit" > <b-spinner label="Loading..."></b-spinner></b-button>
    </b-nav-form>
</div>
     
</template>

<script>
import {apiPublic} from '../configs/apiServices'
export default {
  data () {
    return {
      processing: false,
      status: null,
      form: {
        login: '',
        senha: ''
      },
    }
  },
  methods:{
    async doLogin () {
      this.processing = true
      const api = await apiPublic();
      api.post('/usuarios/auth', this.form)
      .then( response => {
        const {login, token} = response.data;
        this.$store.dispatch('login', {login, token})
        this.status = true
        this.$router.push('/dashboard')
      })
      .catch(error => {
        this.reset();
        this.status = false;
         if (error.code === 'ECONNABORTED')
                return 'timeout';
            else
                throw error;
      })
      .finally(() => this.processing = false)
    },
    reset (){
      this.processing = false;
      this.status = null;
      this.form = {
        login: '',
        senha: ''
      };
    },
  }
}
</script>

<style>

</style>