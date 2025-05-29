<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ props }">
      <slot name="activator" v-bind="props" />
    </template>

    <v-card>
      <v-card-title>
        {{ isEditMode ? '회원 정보 수정' : '새 회원 추가' }}
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
          {{ isEditMode ? '수정' : '추가' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, defineProps, watch } from 'vue';

const emit = defineEmits(['save']);
const props = defineProps<{
  member?: {
    _id: number;
    name: string;
    schedule?: string[];
  };
  length: number;
}>();

const valid = ref(false);
const form = ref();
const dialog = ref(false);
const isEditMode = computed(() => !!props.member);

const formData = ref({
  _id: length + 1,
  name: '',
  lessonMW: false,
  lessonTT: false,
});

const nameRules = [(v: string) => !!v || '이름은 필수입니다.'];
const canSave = computed(() => formData.value.name.trim() !== '');

const resetForm = () => {
  formData.value = {
    _id: props.length + 1,
    name: '',
    lessonMW: false,
    lessonTT: false,
  };
};

const fillForm = () => {
  if (props.member) {
    formData.value._id = props.member._id;
    formData.value.name = props.member.name || '';
    formData.value.lessonMW = props.member.schedule?.includes('lessonMW') ?? false;
    formData.value.lessonTT = props.member.schedule?.includes('lessonTT') ?? false;
  } else {
    resetForm();
  }
};

watch(dialog, (val) => {
  if (val) fillForm();
});

watch(
  () => props.member,
  () => {
    if (dialog.value) fillForm();
  },
);

const save = () => {
  if (!canSave.value) return;

  const memberData = {
    _id: formData.value._id,
    name: formData.value.name.trim(),
    schedule: [
      ...(formData.value.lessonMW ? ['lessonMW'] : []),
      ...(formData.value.lessonTT ? ['lessonTT'] : []),
    ],
    ...(props.member?._id && { _id: props.member._id }),
  };

  emit('save', memberData);
  close();
};

const close = () => {
  dialog.value = false;
  resetForm();
};
</script>
