<template>
  <v-dialog v-model="dialog" max-width="400">
    <template #activator="{ props }">
      <slot name="activator" v-bind="props" />
    </template>
    <v-card>
      <v-card-title class="text-h6"> Confirm Delete </v-card-title>

      <v-card-text> 회원 {{ props.member?.name }}을 제거하시겠습니까? </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn variant="text" @click="dialog = false"> Cancel </v-btn>

        <v-btn color="error" variant="tonal" @click="deleteMember"> Delete </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';

const dialog = ref(false);
const props = defineProps<{
  member?: {
    _id: number;
    name: string;
    schedule?: string[];
  };
}>();
const emit = defineEmits(['delete']);

const deleteMember = () => {
  emit('delete', props.member?._id);
  dialog.value = false;
};
</script>
