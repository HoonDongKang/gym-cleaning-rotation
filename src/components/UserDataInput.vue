<template>
  <v-sheet>
    <v-row>
      <v-col cols="3">
        <v-text-field v-model="user.name"></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-checkbox-btn v-model="user.lesson_MW" @keydown.enter.native="toggleCheckBox('mw')" />
      </v-col>
      <v-col cols="3">
        <v-checkbox-btn v-model="user.lesson_TT" @keydown.enter.native="toggleCheckBox('tt')" />
      </v-col>
      <v-col cols="3"> <v-btn @click="emitUser">추가</v-btn> </v-col>
    </v-row>
  </v-sheet>
</template>
<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['addUser']);
const props = defineProps({
  total: Number,
});
const createResetUser = () => ({
  index: props.total + 1,
  name: '',
  lesson_MW: false,
  lesson_TT: false,
});

const user = ref(createResetUser());

const toggleCheckBox = (type) => {
  if (type === 'mw') {
    user.value.lesson_MW = !user.value.lesson_MW;
  } else {
    user.value.lesson_TT = !user.value.lesson_TT;
  }
};

const emitUser = () => {
  emit('addUser', {
    ...user.value,
    index: props.total + 1,
  });
  user.value = createResetUser();
};
</script>
