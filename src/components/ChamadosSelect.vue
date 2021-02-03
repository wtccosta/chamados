
<template>
  <div v-if="show">
    <label :for="title" class="form-label">{{ titleLabel }}</label>
    <v-select
      class="form-group"
      :options="options"
      v-model="form.selected"
      @input="returnSelectdValue"
    ></v-select>
  </div>
  <div v-else>
    <div
      class="alert alert-danger mt-3"
      role="alert"
      v-html="errorMessage"
    ></div>
  </div>
</template>

<script>
import { apiProtected } from "./../configs/apiServices";
export default {
  name: 'ChamadosSelect',
  props: {
    title: {
      type: String,
      required: true,
    },

    selected: {
      required: false,
      type: Object,
    },

    oldSelectedId: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      show: true,
      errorMessage: "",
      options: [],
      form: {
        inputName: this.title,
        selected: {
          id: "",
          label: "",
        },
      },
    };
  },

  computed: {
    titleLabel() {
      return this.title.charAt(0).toUpperCase() + this.title.slice(1);
    },
  },
  methods: {
    returnSelectdValue() {
      // this.form.inputName = this.label
      this.$emit("selectedItem", this.form);
    },

    convertToVSelectPattern(data){
           let labelName = "";
        if (data.value) {
          labelName = data.value.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          });
        }
        if (data.nome) {
          labelName = data.nome;
        }
        if (data.logradouro) {
          labelName = data.logradouro;
        }
        return {
          id: data.id,
          label: labelName,
        };
    },

    mapToSelectOptions(data) {
      return data.map((data) => {
          return this.convertToVSelectPattern(data);
      });
    },

    mapErrors(error) {
      if (error.response != undefined && error.response.data.status === 404) {
        this.show = false;
        this.errorMessage = `<h5>Erro ao buscar lista de opções na base de dados:</h5>
              <p>Verifique o recurso 'title' passado via props. Necessário corresponder a um ressource da API. </p>`;
      }
      if (error.response != undefined && error.response.data.status === 403) {
        this.show = false;
        this.errorMessage = `<h5>Necessário autenticar-se novamente:</h5>
              <p>Recarregue a página com <kbd>Ctrl</kbd>+<kbd>F5</kbd>.</p>`;
      }
    },

    async optionsSelect() {
      const api = await apiProtected
      api
        .get(`${this.title}`)
        .then((response) => {
          this.options = this.mapToSelectOptions(response.data);
        })
        .catch((error) => {
          this.mapErrors(error);
        });
    },

    getOldValue() {
      apiProtected
        .get(`${this.title}/${this.oldSelectedId}`)
        .then((response) => {
          this.form.selected = this.convertToVSelectPattern(response.data);
        })
        .catch((error) => {
          this.mapErrors(error);
        });
    },
  },
  mounted() {
    this.optionsSelect();
    if(this.oldSelectedId != undefined){
        setTimeout(()=>{
            this.getOldValue();
        }, 1000);
    }
  },
};
</script>

<style>
</style>