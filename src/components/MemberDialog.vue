<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ props }">
      <slot name="activator" v-bind="props" />
    </template>
    <v-card>
      <v-card-title>
        새 회원 추가
        <!-- {{ member ? '회원 정보 수정' : '새 회원 추가' }} -->
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="formData.name"
            label="이름"
            :rules="nameRules"
            required
            focused
          ></v-text-field>

          <div class="mb-4">
            <v-label class="mb-2">레슨 일정</v-label>
            <v-checkbox
              v-model="formData.lessonMW"
              label="월/수 레슨"
              @keydown.enter="formData.lessonMW = !formData.lessonMW"
            />
            <v-checkbox
              v-model="formData.lessonTT"
              label="화/목 레슨"
              @keydown.enter="formData.lessonTT = !formData.lessonTT"
            />
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="close">취소</v-btn>
        <v-btn color="primary" @click="save" :disabled="!canSave">
          추가
          <!-- {{ member ? '수정' : '추가' }} -->
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue';
const emit = defineEmits(['save']);

const valid = ref(false);
const form = ref();
const dialog = ref(false);
const formData = ref({
  name: '',
  lessonMW: false,
  lessonTT: false,
});
const nameRules = [(v: string) => !!v || '이름은 필수입니다.'];
const canSave = computed(() => {
  return formData.value.name;
});

const resetForm = () => {
  formData.value = {
    name: '',
    lessonMW: false,
    lessonTT: false,
  };
};

const save = () => {
  if (!canSave.value) {
    return;
  }

  const memberData = {
    name: formData.value.name,
    schedule: [
      formData.value.lessonMW ? 'lessonMW' : '',
      formData.value.lessonTT ? 'lessonTT' : '',
    ],
    // lessonMW: formData.value.lessonMW,
    // lessonTT: formData.value.lessonTT,
  };

  emit('save', memberData);

  close();
};

const close = () => {
  dialog.value = false;
  resetForm();
};
</script>
