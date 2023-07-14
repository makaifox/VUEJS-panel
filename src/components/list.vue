<template>
  <v-container fluid>
    <!-- Barra de pesquisa e botão de cadastro -->
    <v-row>
      <v-col cols="12" lg="10">
        <v-text-field
          v-model="searchTerm"
          append-icon="mdi-magnify"
          label="Digite sua busca"
          single-line
          max-width="200"
          @input="filterStudents"
        ></v-text-field>
      </v-col>
      <v-col cols="12" lg="2" class="d-flex justify-center align-center">
        <v-btn @click="dialog = true">Cadastrar Aluno</v-btn>
      </v-col>
    </v-row>

    <!-- Tabela de alunos -->
    <v-table fixed-header child-flex class="ma-2 pa-2">
      <thead>
        <tr>
          <th class="text-left">Registro Acadêmico</th>
          <th class="text-left">Nome</th>
          <th class="text-left">CPF</th>
          <th class="text-left">E-mail</th>
          <th class="text-left">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student of students" :key="student.id">
          <td>{{ student.ra }}</td>
          <td>{{ student.nome }}</td>
          <td>{{ student.cpf }}</td>
          <td>{{ student.email }}</td>
          <td>
            <v-btn prepend-icon="$edit" color="#00A0B0" class="mr-3" @click="dialog = true; edit(student)">
              EDITAR
            </v-btn>
            <v-btn prepend-icon="$delete" color="#FF4719" @click="remove(student)">
              REMOVER
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>

  <!-- Popup de formulário -->
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Consulta de alunos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items></v-toolbar-items>
        </v-toolbar>
        <v-container fluid>
          <v-card class="ma-2 pa-2" title="Consulta de alunos">
            <!-- Formulário de cadastro/editar -->
            <v-form fast-fail @submit.prevent="save">
              <v-text-field v-model="student.nome" label="Nome"></v-text-field>
              <v-text-field v-model="student.email" label="E-mail"></v-text-field>
              <v-text-field v-model="student.ra" label="RA"></v-text-field>
              <v-text-field v-model="student.cpf" label="CPF"></v-text-field>

              <v-row>
                <v-col>
                  <v-btn type="submit" block class="mt-2" @click="dialog = false" size="large">SALVAR</v-btn>
                </v-col>
                <v-col>
                  <v-btn block class="mt-2" @click="dialog = false" size="large">CANCELAR</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import List from '../services/StudentsData'
import Register from '../services/StudentsData'
import Edit from '../services/StudentsData'
import Remove from '../services/StudentsData'

export default {
  data() {
    return {
      students: [],
      student: {
        id: '',
        nome: '',
        email: '',
        ra: '',
        cpf: '',
      },
      dialog: false,
      searchTerm: '',
    }
  },
  mounted() {
    this.list()
  },
  methods: {
    // Listar todos os alunos
    list() {
      List.listStudents().then(response => {
        this.students = response.data.data
      })
    },
    // Salvar aluno (cadastro ou edição)
    save() {
      if (!this.student.id) {
        Register.registerStudent(this.student)
          .then(response => {
            this.student = {}
            alert('Aluno cadastrado com sucesso!')
            this.list()
            this.errors = []
          })
          .catch(e => {
            this.errors = e.response.data.errors
          })
      } else {
        Edit.update(this.student.id, this.student)
          .then(response => {
            this.student = {}
            alert('Cadastro atualizado com sucesso!')
            this.list()
            this.errors = []
          })
          .catch(e => {
            this.errors = e.response.data.errors
          })
      }
    },
    // Editar aluno
    edit(student) {
      this.student = student
    },
    // Remover aluno
    remove(student) {
      Remove.delete(student.id, student)
        .then(response => {
          this.list()
          this.errors = []
        })
        .catch(e => {
          this.errors = e.response.data.errors
        })
    },
    // Filtrar alunos
    filterStudents() {
      // Filtrar a lista de alunos com base no termo de pesquisa
      if (this.searchTerm) {
        this.students = this.students.filter(student => {
          const searchRegex = new RegExp(this.searchTerm, 'i')
          return (
            searchRegex.test(student.nome) ||
            searchRegex.test(student.email) ||
            searchRegex.test(student.ra) ||
            searchRegex.test(student.cpf)
          )
        })
      } else {
        // Caso o termo de pesquisa esteja vazio, exiba todos os alunos novamente
        this.list()
      }
    },
  },
}
</script>
