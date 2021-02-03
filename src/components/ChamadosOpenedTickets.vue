<template>
  <div>
    <div class="col" v-if="feedback.show">
              <div class="row justify-content-center">
                <b-alert show :variant="feedback.variant">{{feedback.message}}</b-alert>
              </div>
            </div>
    <b-table striped hover :items="tickets" :fields="fields" :busy="isBusy">
      <template #cell(abertura)="data">
        {{ data.value | dateConvert }}
      </template>

      <template #cell(detalhes)="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? "Fechar Gestão" : "Gerir Chamado" }}
        </b-button>
      </template>

      <template #row-details="row">
        <b-card>
          
          <b-row class="col-mb-12">
          <b-col cols="8">
            <dl class="row">
              <dt class="col-sm-4 text-sm-right">Descrição</dt>
              <dd class="col-sm-6">{{ row.item.descricao }}</dd>
                    <dt class="col-sm-4 text-sm-right">Solicitante</dt>
              <dd class="col-sm-6">{{ row.item.solicitante }}</dd>
              <dt class="col-sm-4 text-sm-right">Email:</dt>
              <dd class="col-sm-6">{{ row.item.email }}</dd>
              <dt class="col-sm-4 text-sm-right">Tel. Contato</dt>
              <dd class="col-sm-6">{{ row.item.telefoneContato }}</dd>
                  <dt class="col-sm-4 text-sm-right">Endereço Informado</dt>
              <dd class="col-sm-6">{{ row.item.endereco }}</dd>
                      <dt class="col-sm-4 text-sm-right">Aberto</dt>
              <dd class="col-sm-6">{{
              row.item.fechamento == undefined ? "Sim" : "Não"
            }}</dd>
            </dl>
           
          </b-col>
            <b-col cols="4">
              <b-form-group label="Selecione o Local">
                <b-form-select
                  v-model="row.item.local"
                  :options="placesOptions"
                  @click.once="loaddPlaces()"
                ></b-form-select>
                <chamados-select title="locais"></chamados-select>
                </b-form-group>
              <b-form-group label="Selecione o Técnico">
                <b-form-select
                  v-model="row.item.tecnicoResponsavel"
                  :options="techOptions"
                  @click.once="loaddPlaces()"
                ></b-form-select></b-form-group>
            </b-col>
          </b-row>

        
          <b-button size="sm" @click="row.toggleDetails"
            >Fechar Gestão</b-button
          >
          <b-button
            size="sm"
            @click="deletar(row.item)"
            class="btn btn-danger ml-3"
            >Deletar</b-button
          >
          <b-button
            size="sm"
            @click="update(row.item)"
            class="btn btn-success ml-3"
            >Atualizar Cadastro</b-button
          >
        </b-card>
      </template>
    </b-table>
  </div>
</template>

<script>
import { apiProtected } from "./../configs/apiServices";
import moment from "moment";
export default {
  name: 'ChamadosOpenedTickets',
  component: {
    'chamados-select': () => import('./ChamadosSelect.vue')
  },
  data() {
    return {
      isBusy: true,
      fields: [
        "id",
        { key: "endereco", label: "Local Informado pelo Usuário" },
        "telefoneContato",
        { key: "abertura", sortable: true },
        "detalhes",
      ],
      tickets: [],
      placesOptions: "",
      selectedPlace: "",
      techOptions: "",
      selectedPTech: "",
      feedback: {
        show: false,
        variant: '',
        message: ''
      }
    };
  },
  methods: {
    async loadData() {
      this.isBusy = true;
      const api = await apiProtected();
      api
        .get("chamados")
        .then((response) => {
          this.tickets = response.data;
        })
        .catch((error) => {
          if (error.response != undefined && error.response.data != undefined) {
            this.handleError(error)
          }
          console.error("Algo deu errado: ", error);
        })
        .finally(() => (this.isBusy = false));
    },
    async loadPlaces() {
      const api = await apiProtected();
      api.get("locais").then(
        (response) =>
          (this.placesOptions = response.data.map((place) => {
            return {
              value: place.id,
              text: place.nome,
            };
          }))
      )
      .catch(error => this.handleError(error))
    },
    async loadTech() {
      const api = await apiProtected();
      api.get("usuarios").then(
        (response) =>
          (this.techOptions = response.data.map((user) => {
            return {
              value: user.id,
              text: user.nome,
            };
          }))
      ).catch(error => this.handleError(error))
    },
    async deletar(item) {
      const conf = confirm(`DELETAR chamado n. ${item.id}, tem certeza?`);
      if (conf) {
        const api = await apiProtected();
        api
          .delete(`/chamados/${item.id}`)
          .then(() => this.loadData())
          .catch((error) => {
            this.handleError(error);
          });
      }
    },
    async update(item) {
      const data = {
        abertura: item.abertura,
        alteracao: item.alteracao,
        descricao: item.descricao,
        email: item.email,
        endereco: item.endereco,
        fechamento: item.fechamento,
        id: item.id,
        local: { id: item.local },
        solicitante: item.solicitante,
        tecnicoResponsavel: { id: item.tecnicoResponsavel },
        telefoneContato: item.telefoneContato,
      };
      const conf = confirm(`Atualizar chamado n. ${item.id}?`);
      if (conf) {
        const api = await apiProtected();
        api
          .put(`/chamados/${item.id}`, data)
          .then(() => this.loadData())
          .catch((error) => {
            this.handleError(error);
          });
      }
    },
    handleError(error){
      if (error.response != undefined && error.response.data != undefined) {
        if(error.response.status == '403'){
          alert('teste')
          this.feedback.show = true;
          this.feedback.variant = 'danger';
           this.feedback.message = "Faça login novamente. Token de acesso está expirado."
        }

              console.log("erro ao atualizar: ", error.response.data);
            } else {
              console.error("Ooops: ", error);
            }
    }
  },
  mounted() {
    this.loadData();
    this.loadPlaces();
    this.loadTech();
  },
  filters: {
    dateConvert(value) {
      if (value == undefined) return;
      return moment(value).locale("pt-br").format("lll");
    },
  },
};
</script>

<style>
</style>