<template>
  <v-sheet>
    <v-row>
      <v-col cols="3">
        <v-text-field v-model:focused="user.name"></v-text-field>
      </v-col>
      <v-col cols="3"> <v-checkbox-btn></v-checkbox-btn> </v-col>
      <v-col cols="3"> <v-checkbox-btn></v-checkbox-btn> </v-col>
      <v-col cols="3"> <v-btn>추가</v-btn> </v-col>
    </v-row>
  </v-sheet>
</template>
<script setup>
import { ref } from 'vue';

const user = ref({
  name: '',
  lesson_MW: false,
  lesson_TT: false,
});
</script>
