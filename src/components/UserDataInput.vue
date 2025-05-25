<template>
  <v-sheet>
    <v-row>
      <v-col cols="3">
        <v-text-field v-model:model-value="user.name"></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-checkbox-btn
          v-model:model-value="user.lesson_MW"
          @keydown.enter.native="toggleCheckBox('mw')"
        />
      </v-col>
      <v-col cols="3">
        <v-checkbox-btn
          v-model:model-value="user.lesson_TT"
          @keydown.enter.native="toggleCheckBox('tt')"
        />
      </v-col>
      <v-col cols="3"> <v-btn @click="emitUser">추가</v-btn> </v-col>
    </v-row>
  </v-sheet>
</template>
<script setup>
import { ref } from 'vue';

const emit = defineEmits(['addUser']);
const RESET_USER = { name: '', lesson_MW: false, lesson_TT: false };
let user = ref({ ...RESET_USER });

const toggleCheckBox = (type) => {
  if (type === 'mw') {
    user.value.lesson_MW = !user.value.lesson_MW;
  } else {
    user.value.lesson_TT = !user.value.lesson_TT;
  }
};

const emitUser = () => {
  emit('addUser', user.value);
  user.value = { ...RESET_USER };
};
</script>
