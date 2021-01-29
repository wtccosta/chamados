<template>
  <div>
    <div class="row my-5" v-if="show">
      <div class="col-md-8 offset-md-2">
        <b-form @submit.prevent="onSubmit" @reset="onReset">
          <div class="row">
            <div class="col-6">
              <b-form-group
                id="solicitante-group"
                label="Solicitante:"
                label-for="solicitante"
                description="Quem está informando o problema"
              >
                <b-form-input
                  id="solicitante-form"
                  v-model="form.solicitante"
                  type="text"
                  placeholder="Contato"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="telefone-group"
                label="Telefone:"
                label-for="Telefone"
                description="Telefone ou Celular do comunicante ou do local"
              >
                <b-form-input
                  id="telefone-form"
                  v-model="form.telefoneContato"
                  type="text"
                  placeholder="Telefone ou Celular"
                ></b-form-input>
              </b-form-group>
            </div>

            <div class="col-6">
              <b-form-group
                id="email-group"
                label="Email:"
                label-for="email"
                description="Email do comunicante"
              >
                <b-form-input
                  id="email-form"
                  v-model="form.email"
                  type="email"
                  placeholder="e-mail"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="local-group"
                label="Local:"
                label-for="local"
                description="Ex. Contabilidade, Escola Municipal Tal, etc."
              >
                <b-form-input
                  id="local-form"
                  v-model="form.endereco"
                  type="local"
                  placeholder="Local a ser atendido"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <b-form-group
                id="descricao-group"
                label="Descrição:"
                label-for="descricao"
                description="Resumidamente, qual o problema a ser resolvido"
              >
                <b-form-textarea
                  id="textarea"
                  v-model="form.descricao"
                  placeholder="Digite"
                  rows="3"
                  max-rows="6"
                  required
                ></b-form-textarea>
              </b-form-group>
            </div>
          </div>
          <div class="row d-flex justify-content-center">
            <button type="submit" class="btn btn-success mr-3">
              Abrir Chamado
            </button>
            <button type="reset" class="btn btn-warning">Limpar Campos</button>
          </div>
        </b-form>
      </div>
    </div>
    <div class="row my-5 justify-content-center" v-else>
      <div class="col-md-6">
        <b-card
          bg-variant="secondary"
          text-variant="white"
          title="Ticket de Chamado"
        >
        <hr>
          <dl class="row mt-4">
            <dt class="col-sm-3">Protocolo</dt>
            <dd class="col-sm-9">
              <p>{{ result.id }}</p>
            </dd>

            <dt class="col-sm-3">Data Abertura</dt>
            <dd class="col-sm-9">
              <p>{{ result.abertura | toLocateDateConverter}}</p>
            </dd>

            <dt class="col-sm-3">Local</dt>
            <dd class="col-sm-9">
              <p>{{ result.endereco }}</p>
            </dd>

            <dt class="col-sm-3">Telefone</dt>
            <dd class="col-sm-9">
              <p>{{ result.telefoneContato }}</p>
            </dd>

            <dt class="col-sm-3 text-truncate">Descrição</dt>
            <dd class="col-sm-9">
              <p>{{ result.descricao }}</p>
            </dd>
  
          </dl>
        </b-card>
         <b-alert variant="info" show class="mt-3 text-center">
           <p>Guarde estes dados para futuro contato com equipe da STIC.</p>
           <p><button class="btn btn-info" @click="()=>reset()"><b>Abrir Outro Chamado</b></button></p>
           </b-alert>
      </div>
    </div>
  </div>
</template>
<script>
import { apiPublic } from "./../configs/apiServices";
export default {
  data() {
    return {
      show: true,
      form: {
        solicitante: "",
        endereco: "",
        telefoneContato: "",
        email: "",
        descricao: "",
      },
      result: "",
    };
  },
  methods: {
    onSubmit() {
      apiPublic.post("chamados", this.form).then((response) => {
        this.reset();
        this.show = false;
        this.result = response.data;
      });
    },
    onReset() {
      this.reset();
    },
    reset() {
      this.show = true;
      this.result = "";
      this.form = {
        solicitante: "",
        endereco: "",
        telefoneContato: "",
        email: "",
        descricao: "",
      };
    },
  },
  filters: {
    toLocateDateConverter(date) {
      if(date === undefined) return
      return  new Date(Date.parse(date)).toLocaleDateString()
    }
  }
};
</script>

<style scoped>
</style>