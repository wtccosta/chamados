<template>
  <div>
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
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"><b>Descrição:</b></b-col>
            <b-col>{{ row.item.descricao }}</b-col>
            <b-col>
              <b-form-group label="Selecione o Local">
                <b-form-select
                  v-model="row.item.local"
                  :options="placesOptions"
                  @click.once="loaddPlaces()"
                ></b-form-select></b-form-group
            ></b-col>
            <b-col>
              <b-form-group label="Selecione o Técnico">
                <b-form-select
                  v-model="row.item.tecnicoResponsavel"
                  :options="techOptions"
                  @click.once="loaddPlaces()"
                ></b-form-select></b-form-group
            ></b-col>
          </b-row>

          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"><b>Aberto</b></b-col>
            <b-col>{{
              row.item.fechamento == undefined ? "Sim" : "Não"
            }}</b-col>
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
            >Atualizar Cadastro</b-button>
        </b-card>
      </template>
    </b-table>
  </div>
</template>

<script>
import { apiProtected } from "./../configs/apiServices";
import moment from "moment";
import Select from "./ChamadosSelect";
export default {
  component: {
    Select,
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
            console.error(error.response.data);
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
      );
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
      );
    },
    async deletar(item) {
      const conf = confirm(`DELETAR chamado n. ${item.id}, tem certeza?`);
      if (conf) {
        const api = await apiProtected();
        api
          .delete(`/chamados/${item.id}`)
          .then(() => this.loadData())
          .catch((error) => {
            if (
              error.response != undefined &&
              error.response.data != undefined
            ) {
              console.log("erro ao deletar: ", error.response.data);
            } else {
              console.error("Ooops: ", error);
            }
          });
      }
    },
    async update(item) {
      console.log(item);
      const conf = confirm(`Atualizar chamado n. ${item.id}?`);
      if (conf) {
        const api = await apiProtected();
        api
          .put(`/chamados/${item.id}`, JSON.stringify(item) )
          .then(() => this.loadData())
          .catch((error) => {
            if (
              error.response != undefined &&
              error.response.data != undefined
            ) {
              console.log("erro ao atualizar: ", error.response.data);
            } else {
              console.error("Ooops: ", error);
            }
          });
      }
    },
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