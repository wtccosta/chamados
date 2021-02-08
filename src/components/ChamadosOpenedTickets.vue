<template>
  <div>
    <div class="col" v-if="feedback.show">
      <div class="row justify-content-center">
        <b-alert show :variant="feedback.variant">{{
          feedback.message
        }}</b-alert>
      </div>
    </div>
    <b-table striped hover :items="tickets" :fields="fields" :busy="isBusy">
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Carregando...</strong>
        </div>
      </template>

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
                <dd class="col-sm-6">
                 <b-form-textarea
                 :disabled="validSolution(row.item)" v-model="row.item.descricao"
                  rows="3"
                  max-rows="6"
                  required
                ></b-form-textarea>
                </dd>
                <dt class="col-sm-4 text-sm-right">Solicitante</dt>
                <dd class="col-sm-6"><input type="text" :disabled="validSolution(row.item)" v-model="row.item.solicitante"></dd>
                <dt class="col-sm-4 text-sm-right">Email:</dt>
                <dd class="col-sm-6"><input type="text" :disabled="validSolution(row.item)" v-model="row.item.email"></dd>
                <dt class="col-sm-4 text-sm-right">Tel. Contato</dt>
                <dd class="col-sm-6"><input type="text" :disabled="validSolution(row.item)" v-model="row.item.telefoneContato"></dd>
                <dt class="col-sm-4 text-sm-right">Endereço Informado</dt>
                <dd class="col-sm-6"><input type="text" :disabled="validSolution(row.item)" v-model="row.item.endereco"></dd>
                <dt class="col-sm-4 text-sm-right">Aberto</dt>
                <dd class="col-sm-6">
                  {{ row.item.abertura |  dateConvert }}
                </dd>
                <dt class="col-sm-4 text-sm-right">Fechado em: </dt>
                <dd class="col-sm-6">
                  {{ row.item.fechamento |  dateConvert }}
                </dd>
                <dt class="col-sm-4 text-sm-right" v-if="validSolution(row.item)">Solução</dt>
                <dd class="col-sm-6" v-if="validSolution(row.item)">
                  {{ row.item.solucao}}
                </dd>
              </dl>
            </b-col>
            <b-col cols="4">
              <b-form-group label="Selecione o Local">
                <chamados-select
                  title="locais"
                  :oldSelectedId="row.item.local != null && row.item.local != undefined ? row.item.local.id : ''"
                  @selectedItem="(data) => row.item.local =  data.selected.id"
                ></chamados-select>
              </b-form-group>
              <b-form-group label="Selecione o Técnico">
                <chamados-select
                  title="usuarios"
                  :oldSelectedId="
                    row.item.tecnicoResponsavel ? row.item.tecnicoResponsavel.id : ''"
                  @selectedItem="(data) => row.item.tecnicoResponsavel = data.selected.id"
                ></chamados-select>
              </b-form-group>
            </b-col>
          </b-row>

          <b-button size="sm" @click="row.toggleDetails"
            >Fechar Gestão</b-button
          >
          <b-button
          v-if="!validSolution(row.item)"
            size="sm"
            @click="deletar(row.item)"
            class="btn btn-danger ml-3"
            >Deletar</b-button
          >
          <b-button
          v-if="!validSolution(row.item)"
            size="sm"
            @click="update(row.item)"
            class="btn btn-success ml-3"
            >Atualizar Cadastro</b-button
          >
          <b-button
          v-if="!row.item.solucao"
            size="sm"
            v-b-modal.closeTicketModal
            class="btn btn-warning ml-3"
            >Fechar Chamado</b-button
          >
        </b-card>
        <b-modal ref="closeTicketModal" id="closeTicketModal" hide-footer>
      <b-row>
        <b-col>
          <b-form-group label="Insira um solução">
                <b-form-textarea
      id="textarea"
      v-model="row.item.solucao"
      placeholder="Insira uma soução..."
      rows="3"
      max-rows="6"
      :state="validSolution(row.item)"
    ></b-form-textarea>
          </b-form-group>
          <b-button v-if="row.item.solucao && row.item.solucao.length > 10" class="mt-3" block @click="closeTicket(row.item)">Fechar</b-button>
        </b-col>
      </b-row>
    </b-modal>
      </template>
    </b-table>
    
  </div>
</template>

<script>
import { apiProtected } from "./../configs/apiServices";
import ChamadosSelect from "./ChamadosSelect.vue";
import moment from "moment";
export default {
  name: "ChamadosOpenedTickets",
  components: {
    "chamados-select": ChamadosSelect,
  },
  data() {
    return {
      isBusy: false,
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
        variant: "",
        message: "",
      },
    };
  },
  methods: {
    async loadData() {
      this.isBusy = true;
      this.resetErrors();
      const api = await apiProtected();
      api
        .get("chamados")
        .then((response) => {
          this.tickets = response.data;
        })
        .catch((error) => {
          if (error.response != undefined && error.response.data != undefined) {
            this.handleError(error);
          }
          console.error("Algo deu errado: ", error);
        })
        .finally(() => (this.isBusy = false));
    },
    async loadPlaces() {
      const api = await apiProtected();
      api
        .get("locais")
        .then(
          (response) =>
            (this.placesOptions = response.data.map((place) => {
              return {
                value: place.id,
                text: place.nome,
              };
            }))
        )
        .catch((error) => this.handleError(error));
    },
    async loadTech() {
      const api = await apiProtected();
      api
        .get("usuarios")
        .then(
          (response) =>
            (this.techOptions = response.data.map((user) => {
              return {
                value: user.id,
                text: user.nome,
              };
            }))
        )
        .catch((error) => this.handleError(error));
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
      
      const conf = confirm(`Atualizar chamado n. ${item.id}?`);
      if (conf) {
        const api = await apiProtected();
        try {
          const data = this.processSelectedItem(item)
          api
          .put(`/chamados/${item.id}`,data)
          .then(() => this.loadData())
          .catch((error) => {
            this.handleError(error);
          });
        } catch (e) {
          this.handleError(e);
        }
        
      }
    },
    async closeTicket(item){
       const conf = confirm(`Atualizar chamado n. ${item.id}?`);
      if (conf) {
        const api = await apiProtected();
        try {
           const data = this.processSelectedItem(item)
           api
          .put(`/chamados/close/${item.id}`, data)
          .then(() => this.loadData())
          .catch((error) => {
            this.handleError(error);
          });
        } catch (e) {
          this.handleError(e);
        }
       
      }
    },
   
    handleError(error) {
      if (error.response != undefined && error.response.data != undefined) {
        if (error.response.status == "403") {
          this.feedback.show = true;
          this.feedback.variant = "danger";
          this.feedback.message =
            "Faça login novamente. Token de acesso está expirado.";
        }
        

        console.log("erro ao atualizar: ", error.response.data);
      }
      if(error == 407){
            this.feedback.show = true;
          this.feedback.variant = "danger";
          this.feedback.message =
            "Escolha um técnico e um local.";
              this.$bvModal.msgBoxOk('Escolha um Técnico e um local!')
          .then(value => {
            this.boxOne = value
          })
          .catch(err => {
            console.log(err);
          })

        }
      
      else {
        console.error("Ooops: ", error);
      }
    },
    processSelectedItem(item){
      if(item.tecnicoResponsavel == null || item.local == null){
        
            throw '407';
        }
        const data = {
        abertura: item.abertura,
        alteracao: item.alteracao,
        descricao: item.descricao,
        solucao: item.solucao,
        email: item.email,
        endereco: item.endereco,
        fechamento: item.fechamento,
        id: item.id,
        local: '',
        solicitante: item.solicitante,
        tecnicoResponsavel: { id: item.tecnicoResponsavel },
        telefoneContato: item.telefoneContato,
      };
      data.local = (typeof item.local == 'object') ? {id: item.local.id} : {id: item.local};
      data.tecnicoResponsavel = (typeof item.tecnicoResponsavel == 'object') ? {id: item.tecnicoResponsavel.id} : {id: item.tecnicoResponsavel};
      return data; 
    },
    validSolution(item){
      if(!item.solucao) return
      return item.solucao.length && item.solucao.length > 10
    },
    resetErrors(){
        this.feedback.show = false;
          this.feedback.variant = '';
          this.feedback.message = '';
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