<template>
  <v-sheet border rounded>
    <v-data-table :headers="headers" :hide-default-footer="users.length < 11" :items="users">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon icon="mdi-account-box-multiple" size="x-small"></v-icon>
            회원 리스트
          </v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="d-flex justify-end">
          <v-icon
            color="medium-emphasis"
            icon="mdi-delete"
            size="small"
            @click="remove(item.id)"
          ></v-icon>
        </div>
      </template>

      <template v-slot:item.lesson_MW="{ item }">
        <v-checkbox-btn v-model="item.lesson_MW" :ripple="false"></v-checkbox-btn>
      </template>
      <template v-slot:item.lesson_TT="{ item }">
        <v-checkbox-btn v-model="item.lesson_TT" :ripple="false"></v-checkbox-btn>
      </template>
    </v-data-table>
  </v-sheet>
  <user-data-input />
</template>

<script setup>
import { ref } from 'vue';
import UserDataInput from './UserDataInput.vue';

const users = ref([{ name: 'a', lesson_MW: true, lesson_TT: true }]);
const headers = [
  { title: '회원명', key: 'name' },
  { title: '월/수 레슨 여부', key: 'lesson_MW' },
  { title: '화/목 레슨 여부', key: 'lesson_TT' },
  { title: 'Actions', key: 'actions', align: 'end' },
];

function remove(id) {
  const index = users.value.findIndex((user) => user.id === id);
  users.value.splice(index, 1);
}
</script>
