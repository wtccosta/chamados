<template>
<div>
<b-nav-form> <!--Criar computed para monitorar estado de logado-->
       <span class="mr-3 font-weight-bolder text-white-50">Administração</span>
      <b-form-input class="mr-sm-2" v-model="form.login" :state=status placeholder="Usuário"></b-form-input>
      <b-form-input type="password" class="mr-sm-2" v-model="form.senha" placeholder="Senha"></b-form-input>
      <b-button variant="light" :state=status class="my-2 my-sm-0 font-weight-lighter" type="submit" @click.prevent="doLogin()">Logar</b-button>
    </b-nav-form>
</div>
     
</template>

<script>
import {apiPublic} from '../configs/apiServices'
export default {
  data () {
    return {
      status:true,
      form: {
        login: '',
        senha: ''
      },
    }
  },
  methods:{
    doLogin () {
      apiPublic.post('/usuarios/auth', this.form)
      .then(() => this.status = true)
      .catch(() => this.status = false)
    }
  }
}
</script>

<style>

</style>